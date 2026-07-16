-- Highground foundation
-- PostgreSQL 15+ / Supabase. All private access is denied by default and opened
-- only through the explicit policies below.

create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'coach', 'support', 'admin', 'owner');
create type public.coach_application_status as enum ('submitted', 'under_review', 'verification_required', 'skill_assessment', 'interview', 'trial_assignment', 'approved', 'rejected', 'suspended');
create type public.order_status as enum ('draft', 'payment_pending', 'paid', 'matching', 'coach_assigned', 'awaiting_customer', 'in_progress', 'delivery_submitted', 'customer_review', 'completed', 'disputed', 'cancelled', 'refunded');
create type public.assignment_status as enum ('proposed', 'assigned', 'accepted', 'declined', 'replaced', 'completed', 'cancelled');
create type public.message_kind as enum ('text', 'image', 'audio', 'video', 'document', 'match_id', 'session_request', 'session_confirmation', 'milestone', 'deliverable', 'completion_request', 'support_request', 'dispute_notice', 'system');
create type public.payment_status as enum ('pending', 'processing', 'succeeded', 'failed', 'partially_refunded', 'refunded', 'disputed', 'cancelled');
create type public.dispute_status as enum ('opened', 'awaiting_customer', 'awaiting_coach', 'under_review', 'resolved_customer', 'resolved_coach', 'partial_refund', 'closed');
create type public.session_status as enum ('proposed', 'confirmed', 'reschedule_requested', 'cancel_requested', 'cancelled', 'completed', 'no_show');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  display_name text not null check (char_length(display_name) between 2 and 60),
  avatar_path text,
  locale text not null default 'en-CA',
  time_zone text not null default 'America/Toronto',
  status text not null default 'active' check (status in ('active', 'invited', 'suspended', 'closed')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.customer_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  current_rank text,
  target_goal text,
  main_role text,
  preferred_region text,
  preferred_language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  current_rank text not null,
  peak_rank text not null,
  biography text not null check (char_length(biography) between 60 and 2000),
  coaching_style text not null check (char_length(coaching_style) between 20 and 1000),
  region text not null,
  languages text[] not null default '{}',
  roles text[] not null default '{}',
  hero_specialties text[] not null default '{}',
  time_zone text not null,
  tier text not null default 'Pro' check (tier in ('Pro', 'Master', 'Elite')),
  starting_price integer not null check (starting_price >= 0),
  average_rating numeric(3,2) not null default 0 check (average_rating between 0 and 5),
  completed_sessions integer not null default 0 check (completed_sessions >= 0),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  is_public boolean not null default false,
  stripe_onboarding_status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.coach_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_profile_id uuid references public.profiles(id) on delete set null,
  legal_name text not null,
  display_name text not null,
  email text not null,
  country text not null,
  time_zone text not null,
  languages text[] not null,
  current_rank text not null,
  peak_rank text not null,
  main_roles text[] not null,
  best_heroes text[] not null,
  public_gameplay_profile text not null,
  coaching_experience text not null,
  weekly_availability text not null,
  preferred_compensation text not null,
  biography text not null,
  sample_replay_analysis text not null,
  sample_coaching_video_url text,
  why_join text not null,
  status public.coach_application_status not null default 'submitted',
  agreement_accepted_at timestamptz not null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.coach_application_files (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.coach_applications(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 104857600),
  created_at timestamptz not null default now()
);

create table public.coach_availability (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(profile_id) on delete cascade,
  day_of_week smallint check (day_of_week between 0 and 6),
  start_time time,
  end_time time,
  blocked_date date,
  time_zone text not null,
  max_daily_sessions smallint not null default 4 check (max_daily_sessions between 1 and 12),
  minimum_notice_hours smallint not null default 12 check (minimum_notice_hours between 0 and 168),
  is_vacation boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((blocked_date is not null) or (day_of_week is not null and start_time is not null and end_time is not null and start_time < end_time))
);

create table public.coach_specialties (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(profile_id) on delete cascade,
  specialty_type text not null check (specialty_type in ('role', 'hero', 'service', 'skill')),
  specialty_value text not null,
  proficiency smallint not null default 3 check (proficiency between 1 and 5),
  created_at timestamptz not null default now(),
  unique (coach_id, specialty_type, specialty_value)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  description text not null,
  service_type text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.service_packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  description text not null,
  base_price integer not null check (base_price >= 0),
  currency text not null default 'cad' check (currency ~ '^[a-z]{3}$'),
  default_duration_minutes integer check (default_duration_minutes between 15 and 480),
  included_sessions integer not null default 1 check (included_sessions between 0 and 50),
  included_replays integer not null default 0 check (included_replays between 0 and 50),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_options (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  option_key text not null,
  label text not null,
  option_type text not null check (option_type in ('select', 'number', 'boolean', 'text', 'multi_select')),
  configuration jsonb not null default '{}',
  is_required boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, option_key)
);

create table public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  rule_key text not null,
  conditions jsonb not null default '{}',
  adjustment_type text not null check (adjustment_type in ('fixed', 'percentage', 'multiplier')),
  adjustment_value numeric(12,4) not null,
  priority integer not null default 100,
  is_active boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, rule_key)
);

create table public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('fixed', 'percentage')),
  discount_value integer not null check (discount_value > 0),
  max_redemptions integer check (max_redemptions > 0),
  redemption_count integer not null default 0 check (redemption_count >= 0),
  active_from timestamptz,
  active_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  status public.order_status not null default 'payment_pending',
  requirements jsonb not null default '{}',
  currency text not null default 'cad' check (currency ~ '^[a-z]{3}$'),
  subtotal_amount integer not null check (subtotal_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  platform_commission integer not null default 0 check (platform_commission >= 0),
  coach_earnings integer not null default 0 check (coach_earnings >= 0),
  refunded_amount integer not null default 0 check (refunded_amount >= 0),
  priority text not null default 'Standard' check (priority in ('Flexible', 'Standard', 'Priority')),
  deadline_at timestamptz,
  paid_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (discount_amount <= subtotal_amount + tax_amount),
  check (refunded_amount <= total_amount)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  package_id uuid references public.service_packages(id) on delete set null,
  item_type text not null,
  description text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount integer not null check (unit_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  configuration jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.order_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  coach_id uuid not null references public.coach_profiles(profile_id) on delete restrict,
  status public.assignment_status not null default 'assigned',
  compensation_amount integer not null check (compensation_amount >= 0),
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  ended_at timestamptz,
  replacement_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_assignment_per_order on public.order_assignments(order_id) where status in ('assigned', 'accepted');

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  reason text,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.order_milestones (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'submitted', 'approved', 'changes_requested', 'cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_deliverables (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  milestone_id uuid references public.order_milestones(id) on delete set null,
  title text not null,
  description text,
  storage_path text,
  match_id text,
  submitted_by uuid not null references public.profiles(id) on delete restrict,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  subject text not null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role public.app_role not null,
  joined_at timestamptz not null default now(),
  removed_at timestamptz,
  muted_until timestamptz,
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  client_id uuid,
  kind public.message_kind not null default 'text',
  body text check (body is null or char_length(body) <= 4000),
  metadata jsonb not null default '{}',
  reply_to_id uuid references public.messages(id) on delete set null,
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  check (kind = 'system' or sender_id is not null),
  check (body is not null or kind in ('image', 'audio', 'video', 'document'))
);

create unique index messages_sender_client_id_unique on public.messages(sender_id, client_id) where client_id is not null;

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  storage_path text not null unique,
  thumbnail_path text,
  original_name text not null,
  mime_type text not null,
  extension text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 104857600),
  duration_seconds integer check (duration_seconds is null or duration_seconds between 0 and 600),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  scan_status text not null default 'pending' check (scan_status in ('pending', 'clean', 'rejected', 'failed')),
  created_at timestamptz not null default now()
);

create table public.message_reads (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

create table public.message_reactions (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null check (char_length(reaction) between 1 and 16),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, reaction)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  coach_id uuid not null references public.coach_profiles(profile_id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  status public.session_status not null default 'proposed',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_time_zone text not null,
  coach_time_zone text not null,
  meeting_provider text check (meeting_provider in ('discord', 'google_meet', 'zoom', 'other')),
  meeting_url text,
  customer_notes text,
  coach_notes text,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.session_reschedule_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  proposed_starts_at timestamptz not null,
  proposed_ends_at timestamptz not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  responded_by uuid references public.profiles(id) on delete set null,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (proposed_ends_at > proposed_starts_at)
);

create table public.coach_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  coach_id uuid not null references public.coach_profiles(profile_id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  visibility text not null default 'customer' check (visibility in ('customer', 'coach_private', 'admin_only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.progress_goals (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid references public.coach_profiles(profile_id) on delete set null,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'cancelled')),
  target_date date,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.progress_goals(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null,
  progress_percent smallint check (progress_percent between 0 and 100),
  rank_snapshot text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  stripe_customer_id text,
  checkout_session_id text unique,
  payment_intent_id text unique,
  charge_id text,
  currency text not null check (currency ~ '^[a-z]{3}$'),
  gross_amount integer not null check (gross_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  stripe_processing_estimate integer not null default 0 check (stripe_processing_estimate >= 0),
  refunded_amount integer not null default 0 check (refunded_amount >= 0),
  status public.payment_status not null default 'pending',
  failure_code text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (refunded_amount <= gross_amount)
);

create table public.stripe_customers (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stripe_connected_accounts (
  coach_id uuid primary key references public.coach_profiles(profile_id) on delete cascade,
  stripe_account_id text not null unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  requirements jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  coach_id uuid references public.coach_profiles(profile_id) on delete set null,
  stripe_transfer_id text not null unique,
  destination_account_id text,
  amount integer not null check (amount >= 0),
  currency text not null,
  status text not null default 'pending' check (status in ('pending', 'created', 'failed', 'reversed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references public.coach_profiles(profile_id) on delete set null,
  stripe_payout_id text not null unique,
  amount integer not null check (amount >= 0),
  currency text not null,
  status text not null check (status in ('pending', 'in_transit', 'paid', 'failed', 'cancelled')),
  arrival_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  coach_id uuid not null references public.coach_profiles(profile_id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  feedback text not null check (char_length(feedback) between 10 and 4000),
  service_type text not null,
  rank_before text,
  rank_after text,
  role text,
  is_verified boolean not null default false,
  is_public boolean not null default false,
  moderated_content text,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  opened_by uuid not null references public.profiles(id) on delete restrict,
  reason text not null,
  description text not null check (char_length(description) between 20 and 10000),
  status public.dispute_status not null default 'opened',
  coach_response text,
  decision text,
  refund_amount integer not null default 0 check (refund_amount >= 0),
  coach_earnings_adjustment integer not null default 0,
  assigned_admin_id uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.dispute_messages (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 10000),
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.refund_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  payment_id uuid references public.payments(id) on delete set null,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  reason text not null,
  requested_amount integer not null check (requested_amount > 0),
  approved_amount integer check (approved_amount >= 0),
  status text not null default 'requested' check (status in ('requested', 'under_review', 'approved', 'partially_approved', 'rejected', 'processed', 'failed')),
  stripe_refund_id text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  title text not null,
  body text not null,
  action_url text,
  metadata jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  in_app_enabled boolean not null default true,
  browser_push_enabled boolean not null default false,
  new_message_email boolean not null default true,
  message_preview_enabled boolean not null default false,
  session_reminders boolean not null default true,
  marketing_email boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  body text not null check (char_length(body) between 1 and 10000),
  author_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_role public.app_role,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  reason text,
  request_id text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id text primary key,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'processing' check (status in ('processing', 'processed', 'failed')),
  attempt_count integer not null default 1 check (attempt_count > 0),
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_disputes (
  id uuid primary key default gen_random_uuid(),
  stripe_dispute_id text not null unique,
  charge_id text not null,
  amount integer not null check (amount >= 0),
  currency text not null,
  reason text,
  status text not null,
  evidence_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.api_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default now()
);

-- Indexes target the common customer, coach, operations, and chat access paths.
create index profiles_role_status_idx on public.profiles(role, status) where deleted_at is null;
create index coach_profiles_public_idx on public.coach_profiles(is_public, verification_status, average_rating desc) where deleted_at is null;
create index coach_applications_status_created_idx on public.coach_applications(status, created_at desc) where deleted_at is null;
create index coach_availability_coach_day_idx on public.coach_availability(coach_id, day_of_week);
create index services_active_sort_idx on public.services(is_active, sort_order) where deleted_at is null;
create index service_packages_service_active_idx on public.service_packages(service_id, is_active, sort_order);
create index pricing_rules_service_active_idx on public.pricing_rules(service_id, is_active, priority);
create index orders_customer_created_idx on public.orders(customer_id, created_at desc) where deleted_at is null;
create index orders_status_created_idx on public.orders(status, created_at desc) where deleted_at is null;
create index assignments_coach_status_idx on public.order_assignments(coach_id, status, assigned_at desc);
create index order_history_order_created_idx on public.order_status_history(order_id, created_at desc);
create index milestones_order_sort_idx on public.order_milestones(order_id, sort_order);
create index messages_conversation_cursor_idx on public.messages(conversation_id, created_at desc, id desc) where deleted_at is null;
create index attachments_message_idx on public.message_attachments(message_id);
create index sessions_customer_time_idx on public.sessions(customer_id, starts_at desc);
create index sessions_coach_time_idx on public.sessions(coach_id, starts_at desc);
create index goals_customer_status_idx on public.progress_goals(customer_id, status, created_at desc);
create index payments_customer_created_idx on public.payments(customer_id, created_at desc);
create index payments_order_idx on public.payments(order_id);
create index reviews_public_created_idx on public.reviews(is_public, created_at desc) where deleted_at is null;
create index disputes_order_status_idx on public.disputes(order_id, status) where deleted_at is null;
create index notifications_user_unread_idx on public.notifications(user_id, created_at desc) where read_at is null;
create index audit_entity_created_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','customer_profiles','coach_profiles','coach_applications','coach_availability',
    'services','service_packages','service_options','pricing_rules','discount_codes','orders',
    'order_assignments','order_milestones','order_deliverables','conversations','sessions',
    'session_reschedule_requests','coach_notes','progress_goals','payments','stripe_customers',
    'stripe_connected_accounts','transfers','payouts','reviews','disputes','refund_requests',
    'notification_preferences','admin_notes','webhook_events','payment_disputes','api_rate_limits'
  ]
  loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare safe_name text;
begin
  safe_name := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, 'Player'), '@', 1)), 60);
  if char_length(safe_name) < 2 then safe_name := 'Player'; end if;
  insert into public.profiles (id, role, display_name, status)
  values (new.id, 'customer', safe_name, 'active');
  insert into public.customer_profiles (profile_id) values (new.id);
  insert into public.notification_preferences (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid() and status = 'active' and deleted_at is null;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role() in ('support', 'admin', 'owner'), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role() in ('admin', 'owner'), false);
$$;

create or replace function public.owns_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.orders where id = p_order_id and customer_id = auth.uid() and deleted_at is null);
$$;

create or replace function public.is_assigned_coach(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.order_assignments where order_id = p_order_id and coach_id = auth.uid() and status in ('assigned', 'accepted'));
$$;

create or replace function public.is_conversation_member(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.conversation_members where conversation_id = p_conversation_id and user_id = auth.uid() and removed_at is null);
$$;

create or replace function public.create_pending_order(
  p_customer_id uuid,
  p_service_slug text,
  p_requirements jsonb,
  p_subtotal integer,
  p_discount integer,
  p_total integer,
  p_currency text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare v_order_id uuid;
declare v_service_id uuid;
begin
  if p_subtotal < 0 or p_discount < 0 or p_total < 2500 or p_total > 1000000 or p_currency <> 'cad' then
    raise exception 'Invalid authoritative price';
  end if;
  if not exists(select 1 from public.profiles where id = p_customer_id and role = 'customer' and status = 'active') then
    raise exception 'Invalid customer';
  end if;
  select id into v_service_id from public.services where slug = p_service_slug and is_active and deleted_at is null;
  if v_service_id is null then raise exception 'Service unavailable'; end if;

  insert into public.orders(public_reference, customer_id, service_id, status, requirements, currency, subtotal_amount, discount_amount, total_amount, priority, created_by)
  values ('HG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)), p_customer_id, v_service_id, 'payment_pending', p_requirements, p_currency, p_subtotal, p_discount, p_total, coalesce(p_requirements ->> 'priority', 'Standard'), p_customer_id)
  returning id into v_order_id;
  insert into public.order_items(order_id, item_type, description, quantity, unit_amount, total_amount, configuration)
  values (v_order_id, 'coaching_plan', p_service_slug, 1, p_total, p_total, p_requirements);
  insert into public.order_status_history(order_id, to_status, reason, changed_by)
  values (v_order_id, 'payment_pending', 'Checkout created', p_customer_id);
  return v_order_id;
end;
$$;

create or replace function public.claim_webhook_event(p_event_id text, p_event_type text, p_payload jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare v_status text;
begin
  select status into v_status from public.webhook_events where id = p_event_id for update;
  if not found then
    insert into public.webhook_events(id, event_type, payload) values (p_event_id, p_event_type, p_payload);
    return true;
  end if;
  if v_status = 'processed' or v_status = 'processing' then return false; end if;
  update public.webhook_events set status = 'processing', attempt_count = attempt_count + 1, payload = p_payload, error_message = null where id = p_event_id;
  return true;
end;
$$;

create or replace function public.finalize_paid_order(p_order_id uuid, p_checkout_session_id text, p_payment_intent_id text, p_amount_total integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_order public.orders%rowtype;
declare v_conversation_id uuid;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.total_amount <> p_amount_total then raise exception 'Payment amount mismatch'; end if;
  if v_order.status not in ('payment_pending', 'paid', 'matching') then raise exception 'Order state does not accept payment'; end if;

  update public.payments set status = 'succeeded', payment_intent_id = coalesce(p_payment_intent_id, payment_intent_id), paid_at = coalesce(paid_at, now()) where checkout_session_id = p_checkout_session_id;
  if v_order.status = 'payment_pending' then
    update public.orders set status = 'matching', paid_at = now() where id = p_order_id;
    insert into public.order_status_history(order_id, from_status, to_status, reason)
    values (p_order_id, 'payment_pending', 'matching', 'Stripe payment confirmed');
  end if;
  insert into public.conversations(order_id, subject)
  values (p_order_id, 'Order ' || v_order.public_reference)
  on conflict (order_id) do update set updated_at = now()
  returning id into v_conversation_id;
  insert into public.conversation_members(conversation_id, user_id, member_role)
  values (v_conversation_id, v_order.customer_id, 'customer') on conflict do nothing;
  insert into public.notifications(user_id, event_type, title, body, action_url)
  values (v_order.customer_id, 'payment_received', 'Payment confirmed', 'Your coaching workspace is ready for coach assignment.', '/dashboard/orders/' || p_order_id)
  on conflict do nothing;
end;
$$;

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare v_row public.api_rate_limits%rowtype;
begin
  if p_limit < 1 or p_window_seconds < 1 then return false; end if;
  select * into v_row from public.api_rate_limits where key = p_key for update;
  if not found or v_row.window_started_at <= now() - make_interval(secs => p_window_seconds) then
    insert into public.api_rate_limits(key, window_started_at, request_count) values (p_key, now(), 1)
    on conflict (key) do update set window_started_at = now(), request_count = 1;
    return true;
  end if;
  if v_row.request_count >= p_limit then return false; end if;
  update public.api_rate_limits set request_count = request_count + 1 where key = p_key;
  return true;
end;
$$;

revoke all on function public.create_pending_order(uuid,text,jsonb,integer,integer,integer,text) from public, anon, authenticated;
revoke all on function public.claim_webhook_event(text,text,jsonb) from public, anon, authenticated;
revoke all on function public.finalize_paid_order(uuid,text,text,integer) from public, anon, authenticated;
revoke all on function public.consume_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.create_pending_order(uuid,text,jsonb,integer,integer,integer,text) to service_role;
grant execute on function public.claim_webhook_event(text,text,jsonb) to service_role;
grant execute on function public.finalize_paid_order(uuid,text,text,integer) to service_role;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;

-- Assignment side effects are database-owned and idempotent.
create or replace function public.handle_active_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare v_conversation_id uuid;
declare v_previous public.order_status;
begin
  if new.status not in ('assigned', 'accepted') then return new; end if;
  select id into v_conversation_id from public.conversations where order_id = new.order_id;
  if v_conversation_id is not null then
    insert into public.conversation_members(conversation_id, user_id, member_role)
    values (v_conversation_id, new.coach_id, 'coach')
    on conflict (conversation_id, user_id) do update set removed_at = null, member_role = 'coach';
  end if;
  select status into v_previous from public.orders where id = new.order_id for update;
  if v_previous in ('paid', 'matching') then
    update public.orders set status = 'coach_assigned' where id = new.order_id;
    insert into public.order_status_history(order_id, from_status, to_status, reason, changed_by)
    values (new.order_id, v_previous, 'coach_assigned', 'Coach assigned', new.assigned_by);
  end if;
  insert into public.audit_logs(actor_id, actor_role, action, entity_type, entity_id, after_state)
  select new.assigned_by, p.role, 'coach_assigned', 'order_assignment', new.id, to_jsonb(new)
  from public.profiles p where p.id = new.assigned_by;
  return new;
end;
$$;

create trigger on_active_assignment
after insert or update of status on public.order_assignments
for each row execute function public.handle_active_assignment();

create or replace function public.enforce_verified_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists(
    select 1 from public.orders o
    join public.payments p on p.order_id = o.id and p.status in ('succeeded', 'partially_refunded')
    where o.id = new.order_id and o.customer_id = new.customer_id and o.status = 'completed'
  ) then raise exception 'Only completed paid orders may be reviewed'; end if;
  if not exists(
    select 1 from public.order_assignments a
    where a.order_id = new.order_id and a.coach_id = new.coach_id and a.status in ('accepted', 'completed')
  ) then raise exception 'Coach did not complete this order'; end if;
  new.is_verified := true;
  return new;
end;
$$;

create trigger enforce_review_verification
before insert or update of order_id, customer_id, coach_id on public.reviews
for each row execute function public.enforce_verified_review();

-- Enable RLS on every application table. No policy means no browser access.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','customer_profiles','coach_profiles','coach_applications','coach_application_files',
    'coach_availability','coach_specialties','services','service_packages','service_options',
    'pricing_rules','discount_codes','orders','order_items','order_assignments','order_status_history',
    'order_milestones','order_deliverables','conversations','conversation_members','messages',
    'message_attachments','message_reads','message_reactions','sessions','session_reschedule_requests',
    'coach_notes','progress_goals','progress_updates','payments','stripe_customers',
    'stripe_connected_accounts','transfers','payouts','reviews','disputes','dispute_messages',
    'refund_requests','notifications','notification_preferences','admin_notes','audit_logs',
    'webhook_events','payment_disputes','api_rate_limits'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

-- Profiles and role-specific identity.
create policy profiles_select on public.profiles for select using (
  id = auth.uid() or public.is_staff() or
  (role = 'coach' and exists(select 1 from public.coach_profiles c where c.profile_id = profiles.id and c.is_public and c.verification_status = 'verified' and c.deleted_at is null))
);
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy customer_profiles_select on public.customer_profiles for select using (
  profile_id = auth.uid() or public.is_staff() or exists(
    select 1 from public.orders o join public.order_assignments a on a.order_id = o.id
    where o.customer_id = customer_profiles.profile_id and a.coach_id = auth.uid() and a.status in ('assigned', 'accepted')
  )
);
create policy customer_profiles_update_self on public.customer_profiles for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy coach_profiles_public_select on public.coach_profiles for select using (
  (is_public and verification_status = 'verified' and deleted_at is null) or profile_id = auth.uid() or public.is_staff()
);
create policy coach_profiles_update_self on public.coach_profiles for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy coach_applications_select on public.coach_applications for select using (applicant_profile_id = auth.uid() or public.is_admin());
create policy coach_application_files_select on public.coach_application_files for select using (
  public.is_admin() or exists(select 1 from public.coach_applications a where a.id = application_id and a.applicant_profile_id = auth.uid())
);

create policy coach_availability_select on public.coach_availability for select using (
  coach_id = auth.uid() or public.is_staff() or exists(select 1 from public.coach_profiles c where c.profile_id = coach_id and c.is_public and c.verification_status = 'verified')
);
create policy coach_availability_manage_self on public.coach_availability for all using (coach_id = auth.uid() or public.is_admin()) with check (coach_id = auth.uid() or public.is_admin());

create policy coach_specialties_select on public.coach_specialties for select using (
  coach_id = auth.uid() or public.is_staff() or exists(select 1 from public.coach_profiles c where c.profile_id = coach_id and c.is_public and c.verification_status = 'verified')
);
create policy coach_specialties_manage_self on public.coach_specialties for all using (coach_id = auth.uid() or public.is_admin()) with check (coach_id = auth.uid() or public.is_admin());

-- Public catalog; management stays with administrators.
create policy services_public_select on public.services for select using ((is_active and deleted_at is null) or public.is_admin());
create policy services_admin_manage on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy packages_public_select on public.service_packages for select using (is_active or public.is_admin());
create policy packages_admin_manage on public.service_packages for all using (public.is_admin()) with check (public.is_admin());
create policy options_public_select on public.service_options for select using (is_active or public.is_admin());
create policy options_admin_manage on public.service_options for all using (public.is_admin()) with check (public.is_admin());
create policy pricing_rules_public_select on public.pricing_rules for select using (is_active or public.is_admin());
create policy pricing_rules_admin_manage on public.pricing_rules for all using (public.is_admin()) with check (public.is_admin());
create policy discount_codes_admin_only on public.discount_codes for all using (public.is_admin()) with check (public.is_admin());

-- Orders and their delivery records.
create policy orders_select on public.orders for select using (customer_id = auth.uid() or public.is_assigned_coach(id) or public.is_staff());
create policy order_items_select on public.order_items for select using (public.owns_order(order_id) or public.is_assigned_coach(order_id) or public.is_staff());
create policy assignments_select on public.order_assignments for select using (coach_id = auth.uid() or public.owns_order(order_id) or public.is_staff());
create policy assignments_admin_manage on public.order_assignments for all using (public.is_admin()) with check (public.is_admin());
create policy history_select on public.order_status_history for select using (public.owns_order(order_id) or public.is_assigned_coach(order_id) or public.is_staff());

create policy milestones_select on public.order_milestones for select using (public.owns_order(order_id) or public.is_assigned_coach(order_id) or public.is_staff());
create policy milestones_coach_insert on public.order_milestones for insert with check (public.is_assigned_coach(order_id) and created_by = auth.uid());
create policy milestones_coach_update on public.order_milestones for update using ((public.is_assigned_coach(order_id) and created_by = auth.uid()) or public.is_staff()) with check ((public.is_assigned_coach(order_id) and created_by = auth.uid()) or public.is_staff());

create policy deliverables_select on public.order_deliverables for select using (public.owns_order(order_id) or public.is_assigned_coach(order_id) or public.is_staff());
create policy deliverables_coach_insert on public.order_deliverables for insert with check (public.is_assigned_coach(order_id) and submitted_by = auth.uid());
create policy deliverables_coach_update on public.order_deliverables for update using ((public.is_assigned_coach(order_id) and submitted_by = auth.uid()) or public.is_staff()) with check ((public.is_assigned_coach(order_id) and submitted_by = auth.uid()) or public.is_staff());

-- Conversations: membership is checked for every read and write.
create policy conversations_select on public.conversations for select using (public.is_conversation_member(id) or public.is_staff());
create policy conversation_members_select on public.conversation_members for select using (public.is_conversation_member(conversation_id) or public.is_staff());
create policy messages_select on public.messages for select using (public.is_conversation_member(conversation_id) or public.is_staff());
create policy messages_insert on public.messages for insert with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));
create policy messages_update_own on public.messages for update using (sender_id = auth.uid() and public.is_conversation_member(conversation_id)) with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

create policy attachments_select on public.message_attachments for select using (exists(select 1 from public.messages m where m.id = message_id and (public.is_conversation_member(m.conversation_id) or public.is_staff())));
create policy attachments_insert on public.message_attachments for insert with check (exists(select 1 from public.messages m where m.id = message_id and m.sender_id = auth.uid() and public.is_conversation_member(m.conversation_id)));
create policy reads_select on public.message_reads for select using (user_id = auth.uid() or exists(select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));
create policy reads_manage_own on public.message_reads for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reactions_select on public.message_reactions for select using (exists(select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));
create policy reactions_manage_own on public.message_reactions for all using (user_id = auth.uid() and exists(select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id))) with check (user_id = auth.uid() and exists(select 1 from public.messages m where m.id = message_id and public.is_conversation_member(m.conversation_id)));

-- Sessions and progress.
create policy sessions_select on public.sessions for select using (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff());
create policy sessions_insert_participant on public.sessions for insert with check ((customer_id = auth.uid() or coach_id = auth.uid()) and (public.owns_order(order_id) or public.is_assigned_coach(order_id)));
create policy sessions_update_participant on public.sessions for update using (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff()) with check (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff());

create policy reschedules_select on public.session_reschedule_requests for select using (exists(select 1 from public.sessions s where s.id = session_id and (s.customer_id = auth.uid() or s.coach_id = auth.uid() or public.is_staff())));
create policy reschedules_insert on public.session_reschedule_requests for insert with check (requested_by = auth.uid() and exists(select 1 from public.sessions s where s.id = session_id and (s.customer_id = auth.uid() or s.coach_id = auth.uid())));
create policy reschedules_update on public.session_reschedule_requests for update using (requested_by = auth.uid() or public.is_staff() or exists(select 1 from public.sessions s where s.id = session_id and (s.customer_id = auth.uid() or s.coach_id = auth.uid()))) with check (requested_by = auth.uid() or public.is_staff() or exists(select 1 from public.sessions s where s.id = session_id and (s.customer_id = auth.uid() or s.coach_id = auth.uid())));

create policy coach_notes_select on public.coach_notes for select using (
  public.is_staff() or (coach_id = auth.uid()) or (visibility = 'customer' and public.owns_order(order_id))
);
create policy coach_notes_insert on public.coach_notes for insert with check (coach_id = auth.uid() and public.is_assigned_coach(order_id));
create policy coach_notes_update on public.coach_notes for update using ((coach_id = auth.uid() and public.is_assigned_coach(order_id)) or public.is_staff()) with check ((coach_id = auth.uid() and public.is_assigned_coach(order_id)) or public.is_staff());

create policy goals_select on public.progress_goals for select using (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff());
create policy goals_insert on public.progress_goals for insert with check (created_by = auth.uid() and (customer_id = auth.uid() or coach_id = auth.uid()));
create policy goals_update on public.progress_goals for update using (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff()) with check (customer_id = auth.uid() or coach_id = auth.uid() or public.is_staff());
create policy progress_updates_select on public.progress_updates for select using (exists(select 1 from public.progress_goals g where g.id = goal_id and (g.customer_id = auth.uid() or g.coach_id = auth.uid() or public.is_staff())));
create policy progress_updates_insert on public.progress_updates for insert with check (author_id = auth.uid() and exists(select 1 from public.progress_goals g where g.id = goal_id and (g.customer_id = auth.uid() or g.coach_id = auth.uid())));

-- Financial records and earnings.
create policy payments_select on public.payments for select using (customer_id = auth.uid() or public.is_admin());
create policy stripe_customers_select on public.stripe_customers for select using (profile_id = auth.uid() or public.is_admin());
create policy connected_accounts_select on public.stripe_connected_accounts for select using (coach_id = auth.uid() or public.is_admin());
create policy transfers_select on public.transfers for select using (coach_id = auth.uid() or public.is_admin());
create policy payouts_select on public.payouts for select using (coach_id = auth.uid() or public.is_admin());

-- Verified reviews, disputes, refunds, and notifications.
create policy reviews_select on public.reviews for select using ((is_public and is_verified and deleted_at is null) or customer_id = auth.uid() or coach_id = auth.uid() or public.is_admin());
create policy reviews_insert on public.reviews for insert with check (customer_id = auth.uid() and public.owns_order(order_id));
create policy reviews_update_customer on public.reviews for update using (customer_id = auth.uid() and moderated_at is null) with check (customer_id = auth.uid());
create policy reviews_admin_update on public.reviews for update using (public.is_admin()) with check (public.is_admin());

create policy disputes_select on public.disputes for select using (opened_by = auth.uid() or public.owns_order(order_id) or public.is_assigned_coach(order_id) or public.is_staff());
create policy disputes_insert on public.disputes for insert with check (opened_by = auth.uid() and (public.owns_order(order_id) or public.is_assigned_coach(order_id)));
create policy dispute_messages_select on public.dispute_messages for select using (exists(select 1 from public.disputes d where d.id = dispute_id and (d.opened_by = auth.uid() or public.owns_order(d.order_id) or public.is_assigned_coach(d.order_id) or public.is_staff()) and (not is_internal or public.is_staff())));
create policy dispute_messages_insert on public.dispute_messages for insert with check (author_id = auth.uid() and exists(select 1 from public.disputes d where d.id = dispute_id and (d.opened_by = auth.uid() or public.owns_order(d.order_id) or public.is_assigned_coach(d.order_id) or public.is_staff())) and (not is_internal or public.is_staff()));
create policy refunds_select on public.refund_requests for select using (requested_by = auth.uid() or public.owns_order(order_id) or public.is_staff());
create policy refunds_insert on public.refund_requests for insert with check (requested_by = auth.uid() and public.owns_order(order_id));

create policy notifications_own on public.notifications for select using (user_id = auth.uid());
create policy notifications_update_own on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy preferences_own on public.notification_preferences for select using (user_id = auth.uid());
create policy preferences_update_own on public.notification_preferences for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy admin_notes_admin_only on public.admin_notes for all using (public.is_admin()) with check (public.is_admin());
create policy audit_logs_admin_select on public.audit_logs for select using (public.is_admin());
create policy payment_disputes_admin_select on public.payment_disputes for select using (public.is_admin());

-- Column-level grants prevent role, verification, amount, and audit escalation even
-- if a future policy is accidentally broadened.
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_path, locale, time_zone, last_seen_at, updated_at) on public.profiles to authenticated;
revoke update on public.coach_profiles from authenticated;
grant update (biography, coaching_style, region, languages, roles, hero_specialties, time_zone, starting_price, updated_at) on public.coach_profiles to authenticated;
revoke update on public.orders from authenticated;
revoke update on public.messages from authenticated;
grant update (body, edited_at, deleted_at) on public.messages to authenticated;
revoke insert, update on public.reviews from authenticated;
grant insert (order_id, customer_id, coach_id, rating, feedback, service_type, rank_before, rank_after, role, is_public) on public.reviews to authenticated;
grant update (rating, feedback, rank_before, rank_after, role, is_public, updated_at, deleted_at) on public.reviews to authenticated;
revoke update on public.payments, public.audit_logs, public.webhook_events, public.payment_disputes, public.api_rate_limits from authenticated;
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;

-- Private storage buckets; access is granted only through short-lived signed URLs
-- created after a server-side membership or application-review check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'private-chat', 'private-chat', false, 104857600,
  array['image/jpeg','image/png','image/webp','audio/webm','audio/ogg','audio/mpeg','video/mp4','video/webm','application/pdf','text/plain']
)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'coach-applications', 'coach-applications', false, 104857600,
  array['application/pdf','text/plain','video/mp4','video/webm']
)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Realtime is enabled only for tables that need live workspace behavior.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.message_reads;
alter publication supabase_realtime add table public.message_reactions;
alter publication supabase_realtime add table public.notifications;

-- Versioned base catalog. Production pricing remains server-authoritative; these
-- rows power admin configuration and make fresh deployments checkout-ready.
insert into public.services (slug, name, description, service_type, sort_order)
values
  ('live-coaching', 'Live Coaching', 'Private real-time coaching with session notes and a clear action plan.', 'live', 10),
  ('replay-analysis', 'Replay Analysis', 'Timestamped review of recurring decisions, habits, and priorities.', 'asynchronous', 20),
  ('role-mastery', 'Role Mastery', 'A multi-session curriculum for one position and its repeatable responsibilities.', 'program', 30),
  ('hero-mastery', 'Hero Mastery', 'Matchups, timings, lane plans, and win conditions for a focused hero pool.', 'program', 40),
  ('guided-rank-improvement', 'Guided Rank Improvement', 'A measured improvement plan combining coaching, replay work, and weekly goals.', 'program', 50),
  ('team-coaching', 'Team Coaching', 'Draft, communication, lanes, and teamfight review for a stack or competitive team.', 'team', 60),
  ('monthly-membership', 'Monthly Membership', 'Recurring sessions, replay reviews, and ongoing private workspace support.', 'membership', 70)
on conflict (slug) do update set name = excluded.name, description = excluded.description, service_type = excluded.service_type, sort_order = excluded.sort_order, is_active = true;

insert into public.service_packages (service_id, name, description, base_price, default_duration_minutes, included_sessions, included_replays, sort_order)
select id, 'Focused Session', 'One private 60-minute coaching session.', 6900, 60, 1, 0, 10 from public.services where slug = 'live-coaching'
union all
select id, 'Replay Deep Dive', 'One timestamped replay review and written priorities.', 4500, null, 0, 1, 10 from public.services where slug = 'replay-analysis'
union all
select id, 'Role Foundation', 'Three sessions and one replay review focused on one position.', 18900, 60, 3, 1, 10 from public.services where slug = 'role-mastery'
union all
select id, 'Hero Focus', 'Two sessions and one matchup plan for a compact hero pool.', 14900, 60, 2, 1, 10 from public.services where slug = 'hero-mastery'
union all
select id, 'Four-Week Plan', 'Weekly coaching, progress goals, and coach support.', 28900, 60, 4, 2, 10 from public.services where slug = 'guided-rank-improvement'
union all
select id, 'Team Review', 'One 90-minute full-team review with a shared action plan.', 21900, 90, 1, 1, 10 from public.services where slug = 'team-coaching'
union all
select id, 'Monthly Core', 'Recurring coaching, replay allowance, and priority chat.', 24900, 60, 4, 2, 10 from public.services where slug = 'monthly-membership'
on conflict do nothing;

insert into public.pricing_rules (service_id, rule_key, conditions, adjustment_type, adjustment_value, priority)
select id, 'coach-tier-master', '{"coachTier":"Master"}', 'multiplier', 1.25, 100 from public.services
union all
select id, 'coach-tier-elite', '{"coachTier":"Elite"}', 'multiplier', 1.55, 110 from public.services
union all
select id, 'priority-delivery', '{"priority":"Priority"}', 'multiplier', 1.20, 120 from public.services
union all
select id, 'flexible-delivery', '{"priority":"Flexible"}', 'multiplier', 0.95, 90 from public.services
on conflict (service_id, rule_key) do update set conditions = excluded.conditions, adjustment_type = excluded.adjustment_type, adjustment_value = excluded.adjustment_value, priority = excluded.priority, is_active = true;
