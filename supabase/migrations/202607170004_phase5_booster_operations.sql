-- Phase 5: controlled booster operations. Customer-visible assignment changes
-- remain server-mediated and auditable; no payout is created here.

alter table public.coach_profiles
  add column if not exists is_available boolean not null default true,
  add column if not exists availability_updated_at timestamptz not null default now();

create or replace function public.set_coach_availability_v1(
  p_coach_id uuid,
  p_is_available boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = p_coach_id and role = 'coach' and status = 'active' and deleted_at is null
  ) then
    raise exception 'Active booster profile not found';
  end if;

  update public.coach_profiles
  set is_available = p_is_available, availability_updated_at = now(), updated_at = now()
  where profile_id = p_coach_id;
  if not found then raise exception 'Booster profile not found'; end if;

  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state)
  values (p_coach_id, 'coach', 'coach.availability_updated', 'coach_profile', p_coach_id,
    jsonb_build_object('is_available', p_is_available));

  return jsonb_build_object('is_available', p_is_available);
end;
$$;

create or replace function public.respond_to_assignment_v1(
  p_coach_id uuid,
  p_assignment_id uuid,
  p_accept boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_assignment public.order_assignments%rowtype;
  v_order public.orders%rowtype;
  v_next_status public.assignment_status;
begin
  select * into v_assignment
  from public.order_assignments
  where id = p_assignment_id and coach_id = p_coach_id
  for update;
  if not found then raise exception 'Assignment not found'; end if;
  if v_assignment.status <> 'assigned' then raise exception 'Assignment is no longer awaiting a response'; end if;

  select * into v_order from public.orders where id = v_assignment.order_id for update;
  if not found or v_order.deleted_at is not null then raise exception 'Order not found'; end if;

  v_next_status := case when p_accept then 'accepted'::public.assignment_status else 'declined'::public.assignment_status end;
  update public.order_assignments
  set status = v_next_status,
      accepted_at = case when p_accept then now() else accepted_at end,
      ended_at = case when p_accept then ended_at else now() end,
      updated_at = now()
  where id = v_assignment.id;

  if p_accept and v_order.status in ('paid', 'matching') then
    update public.orders set status = 'coach_assigned', updated_at = now() where id = v_order.id;
    insert into public.order_status_history(order_id, from_status, to_status, reason, changed_by)
    values (v_order.id, v_order.status, 'coach_assigned', 'Booster accepted assignment', p_coach_id);
  end if;

  insert into public.notifications(user_id, event_type, title, body, action_url, metadata)
  values (
    v_order.customer_id,
    case when p_accept then 'booster_assigned' else 'booster_assignment_declined' end,
    case when p_accept then 'Your booster accepted the assignment' else 'Assignment update' end,
    case when p_accept then 'Your assigned booster has accepted. Operations will confirm the next delivery step shortly.' else 'The proposed booster was unavailable. Operations is finding the best compatible replacement.' end,
    '/dashboard/orders/' || v_order.id,
    jsonb_build_object('order_id', v_order.id, 'assignment_id', v_assignment.id)
  );
  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, before_state, after_state)
  values (
    p_coach_id, 'coach',
    case when p_accept then 'assignment.accepted' else 'assignment.declined' end,
    'order_assignment', v_assignment.id,
    jsonb_build_object('status', v_assignment.status),
    jsonb_build_object('status', v_next_status, 'order_id', v_order.id)
  );

  return jsonb_build_object('assignment_id', v_assignment.id, 'status', v_next_status, 'order_id', v_order.id);
end;
$$;

revoke all on function public.set_coach_availability_v1(uuid, boolean) from public, anon, authenticated;
revoke all on function public.respond_to_assignment_v1(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.set_coach_availability_v1(uuid, boolean) to service_role;
grant execute on function public.respond_to_assignment_v1(uuid, uuid, boolean) to service_role;
