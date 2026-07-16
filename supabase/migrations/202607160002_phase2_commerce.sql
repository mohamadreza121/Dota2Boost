-- Highground transactional commerce foundation.
-- Pricing remains server authoritative. Discount reservations, payment ordering,
-- refund intent, and audit events are owned by database transactions.

alter table public.discount_codes
  add column if not exists currency text not null default 'cad' check (currency ~ '^[a-z]{3}$'),
  add column if not exists minimum_amount integer not null default 0 check (minimum_amount >= 0),
  add column if not exists maximum_discount integer check (maximum_discount is null or maximum_discount > 0),
  add column if not exists per_customer_limit integer not null default 1 check (per_customer_limit between 1 and 100),
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists archived_at timestamptz;

create unique index if not exists discount_codes_upper_code_unique on public.discount_codes(upper(code));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'discount_percentage_value_bounds'
      and conrelid = 'public.discount_codes'::regclass
  ) then
    alter table public.discount_codes add constraint discount_percentage_value_bounds
      check (discount_type <> 'percentage' or discount_value <= 100);
  end if;
end;
$$;

alter table public.orders
  add column if not exists checkout_amount integer,
  add column if not exists last_stripe_event_created bigint not null default 0;

update public.orders set checkout_amount = total_amount where checkout_amount is null;
alter table public.orders alter column checkout_amount set not null;

alter table public.payments
  add column if not exists receipt_url text,
  add column if not exists hosted_invoice_url text,
  add column if not exists invoice_pdf_url text,
  add column if not exists stripe_invoice_id text,
  add column if not exists last_stripe_event_created bigint not null default 0;

alter table public.refund_requests
  add column if not exists idempotency_key text,
  add column if not exists processed_at timestamptz;

create unique index if not exists refund_requests_idempotency_unique
  on public.refund_requests(idempotency_key) where idempotency_key is not null;
create unique index if not exists refund_requests_stripe_refund_unique
  on public.refund_requests(stripe_refund_id) where stripe_refund_id is not null;
create unique index if not exists payments_order_unique on public.payments(order_id);

create table public.discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  discount_code_id uuid not null references public.discount_codes(id) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  code_snapshot text not null,
  amount integer not null check (amount > 0),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  status text not null default 'reserved' check (status in ('reserved', 'redeemed', 'released')),
  checkout_expires_at timestamptz not null,
  redeemed_at timestamptz,
  released_at timestamptz,
  release_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index discount_redemptions_code_status_idx on public.discount_redemptions(discount_code_id, status);
create index discount_redemptions_customer_created_idx on public.discount_redemptions(customer_id, created_at desc);

alter table public.discount_redemptions enable row level security;
create policy discount_redemptions_select on public.discount_redemptions for select
  using (customer_id = auth.uid() or public.is_admin());
create policy discount_redemptions_admin_manage on public.discount_redemptions for all
  using (public.is_admin()) with check (public.is_admin());

grant select on public.discount_redemptions to authenticated;

-- Replace the coaching catalog with customer-controlled boost services while
-- retaining old rows as inactive history for existing foreign keys.
update public.services
set is_active = false, updated_at = now()
where slug in ('live-coaching','replay-analysis','role-mastery','hero-mastery','guided-rank-improvement','team-coaching','monthly-membership');

insert into public.services (slug, name, description, service_type, sort_order)
values
  ('rank-boost', 'Rank Boost', 'Customer-controlled party queue with a verified high-MMR booster and tracked win milestones.', 'rank_boost', 10),
  ('win-boost', 'Win Boost', 'A defined package of assisted party wins with match-level progress tracking.', 'win_boost', 20),
  ('calibration-support', 'Calibration Support', 'High-focus self-play party support for calibration and recalibration matches.', 'calibration', 30),
  ('duo-lane-boost', 'Duo Lane Boost', 'Role-synergy matching for coordinated lane pairings and ranked party queue.', 'duo', 40),
  ('mmr-sprint', 'MMR Sprint', 'A time-boxed multi-day ranked push with daily queue blocks and milestones.', 'sprint', 50),
  ('stack-boost', 'Stack Boost', 'Role-balanced verified players for customer-controlled two-to-five-player stacks.', 'stack', 60),
  ('priority-membership', 'Priority Membership', 'Recurring preferred-booster access, reserved queue blocks, and member package rates.', 'membership', 70)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  service_type = excluded.service_type,
  sort_order = excluded.sort_order,
  is_active = true,
  deleted_at = null,
  updated_at = now();

insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Starter Climb', 'Five customer-controlled assisted wins.', 7900, 5, 0, 10 from public.services s
where s.slug = 'rank-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Starter Climb');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Momentum Pack', 'Five assisted party wins with flexible scheduling.', 6900, 5, 0, 10 from public.services s
where s.slug = 'win-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Momentum Pack');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Calibration Five', 'Five customer-controlled calibration matches.', 11900, 5, 0, 10 from public.services s
where s.slug = 'calibration-support' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Calibration Five');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Lane Pair', 'Five wins with role-synergy booster matching.', 8900, 5, 0, 10 from public.services s
where s.slug = 'duo-lane-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Lane Pair');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Three-Day Sprint', 'Ten assisted wins scheduled across a focused queue window.', 15900, 10, 0, 10 from public.services s
where s.slug = 'mmr-sprint' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Three-Day Sprint');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Stack Coverage', 'Five wins with role-balanced party coverage.', 12900, 5, 0, 10 from public.services s
where s.slug = 'stack-boost' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Stack Coverage');
insert into public.service_packages (service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Priority Core', 'Recurring access with reserved queue blocks and member rates.', 24900, 12, 0, 10 from public.services s
where s.slug = 'priority-membership' and not exists (select 1 from public.service_packages p where p.service_id = s.id and p.name = 'Priority Core');

create or replace function public.preview_discount_code_v2(
  p_code text,
  p_amount integer,
  p_currency text,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code public.discount_codes%rowtype;
  v_customer_usage integer := 0;
  v_amount integer;
begin
  if p_amount < 2500 or p_currency <> 'cad' or nullif(trim(p_code), '') is null then
    raise exception 'Invalid discount preview';
  end if;

  select * into v_code
  from public.discount_codes
  where upper(code) = upper(trim(p_code))
    and is_active
    and archived_at is null
    and (active_from is null or active_from <= now())
    and (active_until is null or active_until > now());

  if not found or v_code.currency <> p_currency or p_amount < v_code.minimum_amount then
    raise exception 'Discount code is unavailable';
  end if;
  if v_code.max_redemptions is not null and v_code.redemption_count >= v_code.max_redemptions then
    raise exception 'Discount code is fully redeemed';
  end if;

  if p_customer_id is not null then
    select count(*) into v_customer_usage
    from public.discount_redemptions
    where discount_code_id = v_code.id and customer_id = p_customer_id and status in ('reserved', 'redeemed');
    if v_customer_usage >= v_code.per_customer_limit then
      raise exception 'Customer redemption limit reached';
    end if;
  end if;

  v_amount := case
    when v_code.discount_type = 'percentage' then floor(p_amount * v_code.discount_value / 100.0)::integer
    else v_code.discount_value
  end;
  v_amount := least(v_amount, coalesce(v_code.maximum_discount, v_amount), greatest(0, p_amount - 2500));
  if v_amount <= 0 then raise exception 'Discount does not apply'; end if;

  return jsonb_build_object('code', upper(v_code.code), 'amount', v_amount, 'discount_code_id', v_code.id);
end;
$$;

create or replace function public.create_checkout_order_v2(
  p_customer_id uuid,
  p_service_slug text,
  p_requirements jsonb,
  p_subtotal integer,
  p_package_discount integer,
  p_pre_discount_total integer,
  p_currency text,
  p_discount_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_service_id uuid;
  v_reference text;
  v_discount public.discount_codes%rowtype;
  v_customer_usage integer := 0;
  v_code_amount integer := 0;
  v_total integer;
begin
  if p_subtotal < 0 or p_package_discount < 0 or p_pre_discount_total <> p_subtotal - p_package_discount
    or p_pre_discount_total < 2500 or p_pre_discount_total > 1000000 or p_currency <> 'cad' then
    raise exception 'Invalid authoritative price';
  end if;
  if not exists(select 1 from public.profiles where id = p_customer_id and role = 'customer' and status = 'active') then
    raise exception 'Invalid customer';
  end if;
  select id into v_service_id from public.services where slug = p_service_slug and is_active and deleted_at is null;
  if v_service_id is null then raise exception 'Service unavailable'; end if;

  if nullif(trim(p_discount_code), '') is not null then
    select * into v_discount from public.discount_codes
    where upper(code) = upper(trim(p_discount_code)) for update;
    if not found or not v_discount.is_active or v_discount.archived_at is not null
      or v_discount.currency <> p_currency or p_pre_discount_total < v_discount.minimum_amount
      or (v_discount.active_from is not null and v_discount.active_from > now())
      or (v_discount.active_until is not null and v_discount.active_until <= now()) then
      raise exception 'Discount code is unavailable';
    end if;
    if v_discount.max_redemptions is not null and v_discount.redemption_count >= v_discount.max_redemptions then
      raise exception 'Discount code is fully redeemed';
    end if;
    select count(*) into v_customer_usage from public.discount_redemptions
    where discount_code_id = v_discount.id and customer_id = p_customer_id and status in ('reserved', 'redeemed');
    if v_customer_usage >= v_discount.per_customer_limit then raise exception 'Customer redemption limit reached'; end if;

    v_code_amount := case
      when v_discount.discount_type = 'percentage' then floor(p_pre_discount_total * v_discount.discount_value / 100.0)::integer
      else v_discount.discount_value
    end;
    v_code_amount := least(v_code_amount, coalesce(v_discount.maximum_discount, v_code_amount), greatest(0, p_pre_discount_total - 2500));
    if v_code_amount <= 0 then raise exception 'Discount does not apply'; end if;
  end if;

  v_total := p_pre_discount_total - v_code_amount;
  v_reference := 'HG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  insert into public.orders(
    public_reference, customer_id, service_id, status, requirements, currency,
    subtotal_amount, discount_amount, tax_amount, total_amount, checkout_amount,
    priority, created_by
  ) values (
    v_reference, p_customer_id, v_service_id, 'payment_pending', p_requirements, p_currency,
    p_subtotal, p_package_discount + v_code_amount, 0, v_total, v_total,
    coalesce(p_requirements ->> 'priority', 'Standard'), p_customer_id
  ) returning id into v_order_id;

  insert into public.order_items(order_id, item_type, description, quantity, unit_amount, total_amount, configuration)
  values (v_order_id, 'boost_package', p_service_slug, 1, v_total, v_total, p_requirements);
  insert into public.order_status_history(order_id, to_status, reason, changed_by)
  values (v_order_id, 'payment_pending', 'Boost checkout created', p_customer_id);

  if v_code_amount > 0 then
    update public.discount_codes set redemption_count = redemption_count + 1, updated_at = now() where id = v_discount.id;
    insert into public.discount_redemptions(
      discount_code_id, order_id, customer_id, code_snapshot, amount, currency, checkout_expires_at
    ) values (
      v_discount.id, v_order_id, p_customer_id, upper(v_discount.code), v_code_amount, p_currency, now() + interval '2 hours'
    );
  end if;

  return jsonb_build_object(
    'order_id', v_order_id,
    'public_reference', v_reference,
    'discount_amount', p_package_discount + v_code_amount,
    'promotion_amount', v_code_amount,
    'checkout_amount', v_total
  );
end;
$$;

create or replace function public.release_checkout_order_v2(p_order_id uuid, p_reason text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_redemption public.discount_redemptions%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.status <> 'payment_pending' then return false; end if;

  select * into v_redemption from public.discount_redemptions
  where order_id = p_order_id and status = 'reserved' for update;
  if found then
    update public.discount_redemptions set status = 'released', released_at = now(), release_reason = left(p_reason, 500), updated_at = now() where id = v_redemption.id;
    update public.discount_codes set redemption_count = greatest(0, redemption_count - 1), updated_at = now() where id = v_redemption.discount_code_id;
  end if;
  update public.orders set status = 'cancelled', cancelled_at = now(), updated_at = now() where id = p_order_id;
  insert into public.order_status_history(order_id, from_status, to_status, reason)
  values (p_order_id, 'payment_pending', 'cancelled', left(p_reason, 500));
  return true;
end;
$$;

create or replace function public.claim_webhook_event_v2(p_event_id text, p_event_type text, p_payload jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.webhook_events%rowtype;
begin
  select * into v_event from public.webhook_events where id = p_event_id for update;
  if not found then
    insert into public.webhook_events(id, event_type, payload) values (p_event_id, p_event_type, p_payload);
    return true;
  end if;
  if v_event.status = 'processed' then return false; end if;
  if v_event.status = 'processing' and v_event.updated_at > now() - interval '5 minutes' then return false; end if;
  update public.webhook_events
  set status = 'processing', attempt_count = attempt_count + 1, event_type = p_event_type,
      payload = p_payload, error_message = null, updated_at = now()
  where id = p_event_id;
  return true;
end;
$$;

create or replace function public.record_payment_status_v2(
  p_order_id uuid,
  p_payment_intent_id text,
  p_status public.payment_status,
  p_failure_code text,
  p_event_created bigint
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare v_payment public.payments%rowtype;
begin
  select * into v_payment from public.payments where order_id = p_order_id for update;
  if not found then raise exception 'Payment not found'; end if;
  if p_event_created <= v_payment.last_stripe_event_created then return false; end if;
  if v_payment.status in ('succeeded','partially_refunded','refunded') and p_status in ('pending','processing','failed','cancelled') then
    return false;
  end if;
  update public.payments set
    status = p_status,
    payment_intent_id = coalesce(p_payment_intent_id, payment_intent_id),
    failure_code = p_failure_code,
    paid_at = case when p_status = 'succeeded' then coalesce(paid_at, now()) else paid_at end,
    last_stripe_event_created = p_event_created,
    updated_at = now()
  where id = v_payment.id;
  return true;
end;
$$;

create or replace function public.finalize_paid_order_v2(
  p_order_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_stripe_customer_id text,
  p_amount_subtotal integer,
  p_tax_amount integer,
  p_amount_total integer,
  p_event_created bigint
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_conversation_id uuid;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if p_event_created <= v_order.last_stripe_event_created then return false; end if;
  if v_order.checkout_amount <> p_amount_subtotal or p_amount_total <> p_amount_subtotal + p_tax_amount then
    raise exception 'Payment amount mismatch';
  end if;
  if v_order.status not in ('payment_pending','paid','matching') then raise exception 'Order state does not accept payment'; end if;

  update public.payments set
    status = 'succeeded', payment_intent_id = coalesce(p_payment_intent_id, payment_intent_id),
    stripe_customer_id = coalesce(p_stripe_customer_id, stripe_customer_id), gross_amount = p_amount_total,
    tax_amount = p_tax_amount, paid_at = coalesce(paid_at, now()),
    last_stripe_event_created = greatest(last_stripe_event_created, p_event_created), updated_at = now()
  where checkout_session_id = p_checkout_session_id;
  if not found then raise exception 'Payment record not found'; end if;

  if v_order.status = 'payment_pending' then
    update public.orders set status = 'matching', tax_amount = p_tax_amount, total_amount = p_amount_total,
      paid_at = now(), last_stripe_event_created = p_event_created, updated_at = now() where id = p_order_id;
    insert into public.order_status_history(order_id, from_status, to_status, reason)
    values (p_order_id, 'payment_pending', 'matching', 'Stripe payment and tax confirmed');
  else
    update public.orders set tax_amount = p_tax_amount, total_amount = p_amount_total,
      last_stripe_event_created = p_event_created, updated_at = now() where id = p_order_id;
  end if;

  update public.discount_redemptions set status = 'redeemed', redeemed_at = coalesce(redeemed_at, now()), updated_at = now()
  where order_id = p_order_id and status = 'reserved';

  insert into public.conversations(order_id, subject)
  values (p_order_id, 'Order ' || v_order.public_reference)
  on conflict (order_id) do update set updated_at = now()
  returning id into v_conversation_id;
  insert into public.conversation_members(conversation_id, user_id, member_role)
  values (v_conversation_id, v_order.customer_id, 'customer') on conflict do nothing;
  insert into public.notifications(user_id, event_type, title, body, action_url)
  values (v_order.customer_id, 'payment_received', 'Payment confirmed', 'Your boost workspace is ready for booster assignment.', '/dashboard/orders/' || p_order_id);
  return true;
end;
$$;

create or replace function public.prepare_refund_v2(
  p_order_id uuid,
  p_actor_id uuid,
  p_amount integer,
  p_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_payment public.payments%rowtype;
  v_existing public.refund_requests%rowtype;
  v_request_id uuid;
  v_reserved integer;
  v_actor_role public.app_role;
begin
  if char_length(trim(p_reason)) < 10 or char_length(trim(p_reason)) > 500 then raise exception 'A detailed audit reason is required'; end if;
  if p_idempotency_key !~ '^[A-Za-z0-9_-]{16,120}$' then raise exception 'Invalid idempotency key'; end if;
  select role into v_actor_role from public.profiles where id = p_actor_id and status = 'active';
  if v_actor_role not in ('admin','owner') then raise exception 'Admin authorization required'; end if;

  select * into v_existing from public.refund_requests where idempotency_key = p_idempotency_key;
  if found then
    if v_existing.order_id <> p_order_id or v_existing.requested_amount <> p_amount then
      raise exception 'Idempotency key conflicts with another refund request';
    end if;
    if v_existing.status = 'failed' then
      update public.refund_requests set status = 'approved', reviewed_by = p_actor_id,
        reviewed_at = now(), updated_at = now() where id = v_existing.id;
      insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state, reason, request_id)
      values (p_actor_id, v_actor_role, 'refund.retry', 'refund_request', v_existing.id,
        jsonb_build_object('order_id', p_order_id, 'amount', p_amount), v_existing.reason, p_idempotency_key);
      v_existing.status := 'approved';
    elsif v_existing.status not in ('approved','partially_approved','processed') then
      raise exception 'Refund request cannot be retried';
    end if;
    select * into v_payment from public.payments where id = v_existing.payment_id;
    return jsonb_build_object('request_id', v_existing.id, 'payment_intent_id', v_payment.payment_intent_id,
      'stripe_refund_id', v_existing.stripe_refund_id, 'status', v_existing.status, 'amount', v_existing.approved_amount);
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.status not in ('paid','matching','coach_assigned','awaiting_customer','in_progress','delivery_submitted','customer_review','completed','disputed') then
    raise exception 'Order is not refundable';
  end if;
  select * into v_payment from public.payments where order_id = p_order_id and status in ('succeeded','partially_refunded') for update;
  if not found or v_payment.payment_intent_id is null then raise exception 'Refundable payment not found'; end if;
  select coalesce(sum(coalesce(approved_amount, requested_amount)), 0) into v_reserved
  from public.refund_requests where order_id = p_order_id and status in ('approved','partially_approved');
  if p_amount <= 0 or p_amount > v_payment.gross_amount - v_payment.refunded_amount - v_reserved then
    raise exception 'Refund amount exceeds the available balance';
  end if;

  insert into public.refund_requests(
    order_id, payment_id, requested_by, reason, requested_amount, approved_amount,
    status, reviewed_by, reviewed_at, idempotency_key
  ) values (
    p_order_id, v_payment.id, p_actor_id, trim(p_reason), p_amount, p_amount,
    'approved', p_actor_id, now(), p_idempotency_key
  ) returning id into v_request_id;
  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state, reason, request_id)
  values (p_actor_id, v_actor_role, 'refund.approved', 'refund_request', v_request_id,
    jsonb_build_object('order_id', p_order_id, 'amount', p_amount), trim(p_reason), p_idempotency_key);

  return jsonb_build_object('request_id', v_request_id, 'payment_intent_id', v_payment.payment_intent_id,
    'stripe_refund_id', null, 'status', 'approved', 'amount', p_amount);
end;
$$;

create or replace function public.complete_refund_v2(
  p_request_id uuid,
  p_actor_id uuid,
  p_stripe_refund_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.refund_requests%rowtype;
  v_payment public.payments%rowtype;
  v_order public.orders%rowtype;
  v_actor_role public.app_role;
  v_new_refunded integer;
begin
  select role into v_actor_role from public.profiles where id = p_actor_id and status = 'active';
  if v_actor_role not in ('admin','owner') then raise exception 'Admin authorization required'; end if;
  select * into v_request from public.refund_requests where id = p_request_id for update;
  if not found then raise exception 'Refund request not found'; end if;
  if nullif(trim(p_stripe_refund_id), '') is null then raise exception 'Stripe refund ID is required'; end if;
  if v_request.status = 'processed' then
    if v_request.stripe_refund_id = p_stripe_refund_id then return false; end if;
    raise exception 'Refund request was processed with another Stripe refund';
  end if;
  if v_request.status not in ('approved','partially_approved') then raise exception 'Refund request is not approved'; end if;
  select * into v_payment from public.payments where id = v_request.payment_id for update;
  select * into v_order from public.orders where id = v_request.order_id for update;
  v_new_refunded := least(v_payment.gross_amount, v_payment.refunded_amount + coalesce(v_request.approved_amount, 0));

  update public.refund_requests set status = 'processed', stripe_refund_id = p_stripe_refund_id,
    processed_at = now(), updated_at = now() where id = p_request_id;
  update public.payments set refunded_amount = v_new_refunded,
    status = case when v_new_refunded >= gross_amount then 'refunded' else 'partially_refunded' end,
    updated_at = now() where id = v_payment.id;
  update public.orders set refunded_amount = least(total_amount, refunded_amount + coalesce(v_request.approved_amount, 0)),
    status = case when refunded_amount + coalesce(v_request.approved_amount, 0) >= total_amount then 'refunded' else status end,
    updated_at = now() where id = v_order.id;
  if v_order.refunded_amount + coalesce(v_request.approved_amount, 0) >= v_order.total_amount then
    insert into public.order_status_history(order_id, from_status, to_status, reason, changed_by)
    values (v_order.id, v_order.status, 'refunded', v_request.reason, p_actor_id);
  end if;
  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state, reason, request_id)
  values (p_actor_id, v_actor_role, 'refund.processed', 'refund_request', p_request_id,
    jsonb_build_object('stripe_refund_id', p_stripe_refund_id, 'amount', v_request.approved_amount),
    v_request.reason, v_request.idempotency_key);
  insert into public.notifications(user_id, event_type, title, body, action_url)
  values (v_order.customer_id, 'refund_processed', 'Refund processed', 'Your approved refund has been sent to the original payment method.', '/dashboard/billing');
  return true;
end;
$$;

create or replace function public.fail_refund_v2(p_request_id uuid, p_actor_id uuid, p_error text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_role public.app_role;
begin
  select role into v_role from public.profiles where id = p_actor_id;
  if v_role not in ('admin','owner') then raise exception 'Admin authorization required'; end if;
  update public.refund_requests set status = 'failed', updated_at = now() where id = p_request_id and status <> 'processed';
  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, reason)
  values (p_actor_id, v_role, 'refund.failed', 'refund_request', p_request_id, left(p_error, 500));
end;
$$;

revoke all on function public.preview_discount_code_v2(text,integer,text,uuid) from public, anon, authenticated;
revoke all on function public.create_checkout_order_v2(uuid,text,jsonb,integer,integer,integer,text,text) from public, anon, authenticated;
revoke all on function public.release_checkout_order_v2(uuid,text) from public, anon, authenticated;
revoke all on function public.claim_webhook_event_v2(text,text,jsonb) from public, anon, authenticated;
revoke all on function public.record_payment_status_v2(uuid,text,public.payment_status,text,bigint) from public, anon, authenticated;
revoke all on function public.finalize_paid_order_v2(uuid,text,text,text,integer,integer,integer,bigint) from public, anon, authenticated;
revoke all on function public.prepare_refund_v2(uuid,uuid,integer,text,text) from public, anon, authenticated;
revoke all on function public.complete_refund_v2(uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.fail_refund_v2(uuid,uuid,text) from public, anon, authenticated;

grant execute on function public.preview_discount_code_v2(text,integer,text,uuid) to service_role;
grant execute on function public.create_checkout_order_v2(uuid,text,jsonb,integer,integer,integer,text,text) to service_role;
grant execute on function public.release_checkout_order_v2(uuid,text) to service_role;
grant execute on function public.claim_webhook_event_v2(text,text,jsonb) to service_role;
grant execute on function public.record_payment_status_v2(uuid,text,public.payment_status,text,bigint) to service_role;
grant execute on function public.finalize_paid_order_v2(uuid,text,text,text,integer,integer,integer,bigint) to service_role;
grant execute on function public.prepare_refund_v2(uuid,uuid,integer,text,text) to service_role;
grant execute on function public.complete_refund_v2(uuid,uuid,text) to service_role;
grant execute on function public.fail_refund_v2(uuid,uuid,text) to service_role;

create trigger discount_redemptions_updated_at before update on public.discount_redemptions
for each row execute function public.set_updated_at();
