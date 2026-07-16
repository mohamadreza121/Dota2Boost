-- Phase 3 commerce completion: MMR-first catalog and customer refund intake.
-- Browser inputs are configuration only; trusted totals and refund balances stay
-- behind server and transaction boundaries.

update public.services
set is_active = false, updated_at = now()
where slug in (
  'rank-boost', 'calibration-support', 'duo-lane-boost', 'mmr-sprint',
  'stack-boost', 'priority-membership', 'live-coaching', 'replay-analysis',
  'role-mastery', 'hero-mastery', 'guided-rank-improvement', 'team-coaching',
  'monthly-membership'
);

insert into public.services (slug, name, description, service_type, sort_order)
values
  ('mmr-boost', 'MMR Boost', 'A configured MMR climb with customer-operated Solo Assist or Duo Queue delivery.', 'mmr_boost', 10),
  ('mmr-calibration', 'MMR Calibration', 'Five- or ten-match calibration blocks with Solo Assist or Duo Queue delivery.', 'mmr_calibration', 20),
  ('behavior-score-boost', 'Behavior Score Boost', 'A structured customer-operated behavior-score recovery scope with checkpoints.', 'behavior_score', 30),
  ('win-boost', 'Win Boost', 'A fixed package of assisted Duo Queue wins with match-level tracking.', 'win_boost', 40),
  ('coaching', 'Dota 2 Coaching', 'Secondary live coaching and replay-focused improvement sessions.', 'coaching', 90)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  service_type = excluded.service_type,
  sort_order = excluded.sort_order,
  is_active = true,
  deleted_at = null,
  updated_at = now();

insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, '500 MMR Climb', 'Five 100-MMR pricing units configured by bracket and delivery mode.', 9000, 5, 0, 10 from public.services s
where s.slug = 'mmr-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = '500 MMR Climb');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Calibration Five', 'Five customer-operated calibration matches.', 12000, 5, 0, 10 from public.services s
where s.slug = 'mmr-calibration' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Calibration Five');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, '2,000 Score Recovery', 'Four 500-point behavior-score pricing units.', 5600, 4, 0, 10 from public.services s
where s.slug = 'behavior-score-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = '2,000 Score Recovery');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Five Assisted Wins', 'Five customer-operated Duo Queue wins.', 8500, 5, 0, 10 from public.services s
where s.slug = 'win-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Five Assisted Wins');
insert into public.service_packages (service_id, name, description, base_price, default_duration_minutes, included_sessions, included_replays, sort_order)
select id, 'Focused Coaching Session', 'One private 60-minute Dota 2 coaching session.', 6900, 60, 1, 0, 10 from public.services s
where s.slug = 'coaching' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Focused Coaching Session');

insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'boost_mode', 'Boost mode', 'select', '{"values":["Solo","Duo"]}', true from public.services where slug in ('mmr-boost','mmr-calibration')
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();
insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'current_rank', 'Current rank', 'select', '{"values":["Herald","Guardian","Crusader","Archon","Legend","Ancient","Divine","Immortal"]}', true from public.services where slug in ('mmr-boost','mmr-calibration','win-boost')
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();
insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'target_rank', 'Target rank', 'select', '{"values":["Herald","Guardian","Crusader","Archon","Legend","Ancient","Divine","Immortal"]}', true from public.services where slug = 'mmr-boost'
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();
insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'mmr_amount', 'MMR amount', 'number', '{"min":100,"max":3000,"step":100}', true from public.services where slug = 'mmr-boost'
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();
insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'match_count', 'Calibration matches', 'select', '{"values":[5,10]}', true from public.services where slug = 'mmr-calibration'
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();
insert into public.service_options (service_id, option_key, label, option_type, configuration, is_required)
select id, 'behavior_score_amount', 'Behavior-score amount', 'number', '{"min":500,"max":6000,"step":500}', true from public.services where slug = 'behavior-score-boost'
on conflict (service_id, option_key) do update set label = excluded.label, option_type = excluded.option_type, configuration = excluded.configuration, is_required = excluded.is_required, is_active = true, updated_at = now();

create or replace function public.request_customer_refund_v3(
  p_customer_id uuid,
  p_order_id uuid,
  p_requested_amount integer,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_payment public.payments%rowtype;
  v_reserved integer := 0;
  v_available integer;
  v_request_id uuid;
begin
  if p_requested_amount < 100 or p_requested_amount > 1000000 then raise exception 'Invalid refund amount'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 20 or char_length(trim(p_reason)) > 500 then raise exception 'Invalid refund reason'; end if;
  if not exists(select 1 from public.profiles where id = p_customer_id and role = 'customer' and status = 'active' and deleted_at is null) then
    raise exception 'Invalid customer';
  end if;

  select * into v_order from public.orders where id = p_order_id and customer_id = p_customer_id and deleted_at is null for update;
  if not found or v_order.status in ('draft','payment_pending','cancelled','refunded') then
    raise exception 'Order is not eligible for a refund request';
  end if;
  select * into v_payment from public.payments
  where order_id = p_order_id and customer_id = p_customer_id and status in ('succeeded','partially_refunded') for update;
  if not found then raise exception 'Paid order not found'; end if;

  select coalesce(sum(coalesce(approved_amount, requested_amount)), 0)::integer into v_reserved
  from public.refund_requests
  where order_id = p_order_id and status in ('requested','under_review','approved','partially_approved');
  v_available := greatest(0, v_payment.gross_amount - v_payment.refunded_amount - v_reserved);
  if p_requested_amount > v_available then raise exception 'Requested amount exceeds available refundable balance'; end if;

  insert into public.refund_requests(order_id, payment_id, requested_by, reason, requested_amount, status)
  values (p_order_id, v_payment.id, p_customer_id, trim(p_reason), p_requested_amount, 'requested')
  returning id into v_request_id;

  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state)
  values (p_customer_id, 'customer', 'refund.requested', 'refund_request', v_request_id,
    jsonb_build_object('order_id', p_order_id, 'requested_amount', p_requested_amount));
  insert into public.notifications(user_id, event_type, title, body, action_url, metadata)
  values (p_customer_id, 'refund_requested', 'Refund request received',
    'Your request is queued for review. No refund is issued until it is approved and processed through Stripe.',
    '/dashboard/billing', jsonb_build_object('refund_request_id', v_request_id, 'order_id', p_order_id));

  return jsonb_build_object('request_id', v_request_id, 'status', 'requested', 'available_after_request', v_available - p_requested_amount);
end;
$$;

revoke insert on public.refund_requests from authenticated;
revoke all on function public.request_customer_refund_v3(uuid,uuid,integer,text) from public, anon, authenticated;
grant execute on function public.request_customer_refund_v3(uuid,uuid,integer,text) to service_role;
