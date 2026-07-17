-- Phase 7: transactional admin operations. The application authenticates the
-- actor, and this service-role-only function repeats role checks and writes the
-- business mutation and audit event in one database transaction.

create or replace function public.admin_operate_v7(
  p_actor_id uuid,
  p_action text,
  p_entity_id uuid,
  p_payload jsonb,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor public.profiles%rowtype;
  v_order public.orders%rowtype;
  v_assignment public.order_assignments%rowtype;
  v_application public.coach_applications%rowtype;
  v_profile public.profiles%rowtype;
  v_review public.reviews%rowtype;
  v_dispute public.disputes%rowtype;
  v_before jsonb;
  v_after jsonb;
  v_entity_type text;
  v_status text;
  v_coach_id uuid;
  v_compensation integer;
  v_deadline timestamptz;
  v_decision text;
  v_new_assignment_id uuid;
begin
  select * into v_actor from public.profiles where id = p_actor_id and role in ('admin','owner') and status = 'active' and deleted_at is null;
  if not found then raise exception 'Active admin not found'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 10 or char_length(trim(p_reason)) > 500 then raise exception 'Invalid audit reason'; end if;

  if p_action = 'order.status' then
    v_entity_type := 'order';
    select * into v_order from public.orders where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Order not found'; end if;
    if v_order.status = 'refunded' then raise exception 'A refunded order cannot change status'; end if;
    v_before := to_jsonb(v_order);
    v_status := p_payload->>'status';
    if v_status not in ('paid','matching','coach_assigned','awaiting_customer','in_progress','delivery_submitted','customer_review','completed','disputed','cancelled','refunded') then raise exception 'Invalid order status'; end if;
    if v_status = v_order.status::text then raise exception 'Order already has this status'; end if;
    update public.orders set
      status = v_status::public.order_status,
      completed_at = case when v_status = 'completed' then coalesce(completed_at, now()) when status = 'completed' then null else completed_at end,
      cancelled_at = case when v_status = 'cancelled' then coalesce(cancelled_at, now()) when status = 'cancelled' then null else cancelled_at end,
      updated_at = now()
    where id = p_entity_id returning * into v_order;
    insert into public.order_status_history(order_id, from_status, to_status, reason, changed_by)
    values (p_entity_id, (v_before->>'status')::public.order_status, v_order.status, trim(p_reason), p_actor_id);
    v_after := to_jsonb(v_order);

  elsif p_action = 'order.deadline' then
    v_entity_type := 'order';
    select * into v_order from public.orders where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Order not found'; end if;
    v_before := to_jsonb(v_order);
    v_deadline := nullif(p_payload->>'deadlineAt', '')::timestamptz;
    if v_deadline is not null and v_deadline < now() then raise exception 'Deadline must be in the future'; end if;
    update public.orders set deadline_at = v_deadline, updated_at = now() where id = p_entity_id returning * into v_order;
    v_after := to_jsonb(v_order);

  elsif p_action = 'order.assign' then
    v_entity_type := 'order_assignment';
    v_coach_id := (p_payload->>'coachId')::uuid;
    v_compensation := (p_payload->>'compensationAmount')::integer;
    if v_compensation < 0 or v_compensation > 1000000 then raise exception 'Invalid compensation'; end if;
    select * into v_order from public.orders where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Order not found'; end if;
    if v_order.status in ('draft','payment_pending','cancelled','refunded','completed') then raise exception 'Order cannot be assigned in its current state'; end if;
    if not exists (
      select 1 from public.coach_profiles cp join public.profiles p on p.id = cp.profile_id
      where cp.profile_id = v_coach_id and cp.verification_status = 'verified' and cp.is_available and cp.deleted_at is null
        and p.role = 'coach' and p.status = 'active' and p.deleted_at is null
    ) then raise exception 'Verified available booster not found'; end if;
    select * into v_assignment from public.order_assignments where order_id = p_entity_id and status in ('assigned','accepted') for update;
    v_before := case when found then to_jsonb(v_assignment) else jsonb_build_object('order_id', p_entity_id, 'status', 'unassigned') end;
    if found and v_assignment.coach_id = v_coach_id then raise exception 'This booster is already assigned'; end if;
    if found then
      update public.order_assignments set status = 'replaced', ended_at = now(), replacement_reason = trim(p_reason), updated_at = now() where id = v_assignment.id;
      update public.conversation_members cm set removed_at = now()
      from public.conversations c where c.id = cm.conversation_id and c.order_id = p_entity_id and cm.user_id = v_assignment.coach_id;
    end if;
    insert into public.order_assignments(order_id, coach_id, status, compensation_amount, assigned_by)
    values (p_entity_id, v_coach_id, 'assigned', v_compensation, p_actor_id) returning id into v_new_assignment_id;
    insert into public.conversation_members(conversation_id, user_id, member_role, removed_at)
    select c.id, v_coach_id, 'coach', null from public.conversations c where c.order_id = p_entity_id
    on conflict (conversation_id, user_id) do update set removed_at = null, member_role = 'coach';
    if v_order.status in ('paid','matching') then
      update public.orders set status = 'coach_assigned', coach_earnings = v_compensation, updated_at = now() where id = p_entity_id;
      insert into public.order_status_history(order_id, from_status, to_status, reason, changed_by)
      values (p_entity_id, v_order.status, 'coach_assigned', trim(p_reason), p_actor_id);
    else
      update public.orders set coach_earnings = v_compensation, updated_at = now() where id = p_entity_id;
    end if;
    insert into public.notifications(user_id, event_type, title, body, action_url, metadata)
    values (v_coach_id, 'assignment_proposed', 'New boost assignment', 'Review the assigned order and accept or decline it from your booster workspace.', '/coach', jsonb_build_object('order_id', p_entity_id, 'assignment_id', v_new_assignment_id));
    v_after := jsonb_build_object('assignment_id', v_new_assignment_id, 'order_id', p_entity_id, 'coach_id', v_coach_id, 'status', 'assigned', 'compensation_amount', v_compensation);
    p_entity_id := v_new_assignment_id;

  elsif p_action = 'application.status' then
    v_entity_type := 'coach_application';
    select * into v_application from public.coach_applications where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Application not found'; end if;
    v_before := to_jsonb(v_application);
    v_status := p_payload->>'status';
    if v_status not in ('submitted','under_review','verification_required','skill_assessment','interview','trial_assignment','approved','rejected','suspended') then raise exception 'Invalid application status'; end if;
    update public.coach_applications set status = v_status::public.coach_application_status, reviewed_by = p_actor_id, reviewed_at = now(), updated_at = now() where id = p_entity_id returning * into v_application;
    v_after := to_jsonb(v_application);

  elsif p_action = 'profile.status' then
    v_entity_type := 'profile';
    select * into v_profile from public.profiles where id = p_entity_id and role in ('customer','coach') and deleted_at is null for update;
    if not found then raise exception 'Customer or booster profile not found'; end if;
    v_before := to_jsonb(v_profile);
    v_status := p_payload->>'status';
    if v_status not in ('active','invited','suspended','closed') then raise exception 'Invalid profile status'; end if;
    update public.profiles set status = v_status, updated_at = now() where id = p_entity_id returning * into v_profile;
    v_after := to_jsonb(v_profile);

  elsif p_action = 'review.moderate' then
    v_entity_type := 'review';
    select * into v_review from public.reviews where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Review not found'; end if;
    v_before := to_jsonb(v_review);
    update public.reviews set
      is_public = coalesce((p_payload->>'isPublic')::boolean, false),
      is_verified = coalesce((p_payload->>'isVerified')::boolean, false),
      moderated_content = nullif(p_payload->>'moderatedContent', ''),
      moderated_by = p_actor_id, moderated_at = now(), updated_at = now()
    where id = p_entity_id returning * into v_review;
    v_after := to_jsonb(v_review);

  elsif p_action = 'dispute.status' then
    v_entity_type := 'dispute';
    select * into v_dispute from public.disputes where id = p_entity_id and deleted_at is null for update;
    if not found then raise exception 'Dispute not found'; end if;
    v_before := to_jsonb(v_dispute);
    v_status := p_payload->>'status';
    v_decision := nullif(trim(coalesce(p_payload->>'decision', '')), '');
    if v_status not in ('opened','awaiting_customer','awaiting_coach','under_review','resolved_customer','resolved_coach','partial_refund','closed') then raise exception 'Invalid dispute status'; end if;
    if v_status in ('resolved_customer','resolved_coach','partial_refund','closed') and char_length(coalesce(v_decision, '')) < 10 then raise exception 'Resolution decision is required'; end if;
    update public.disputes set status = v_status::public.dispute_status, decision = coalesce(v_decision, decision), assigned_admin_id = p_actor_id,
      resolved_at = case when v_status in ('resolved_customer','resolved_coach','partial_refund','closed') then now() else null end, updated_at = now()
    where id = p_entity_id returning * into v_dispute;
    v_after := to_jsonb(v_dispute);
  else
    raise exception 'Unsupported admin action';
  end if;

  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, before_state, after_state, reason)
  values (p_actor_id, v_actor.role, p_action, v_entity_type, p_entity_id, v_before, v_after, trim(p_reason));
  return jsonb_build_object('action', p_action, 'entity_type', v_entity_type, 'entity_id', p_entity_id, 'after', v_after);
end;
$$;

revoke all on function public.admin_operate_v7(uuid,text,uuid,jsonb,text) from public, anon, authenticated;
grant execute on function public.admin_operate_v7(uuid,text,uuid,jsonb,text) to service_role;
