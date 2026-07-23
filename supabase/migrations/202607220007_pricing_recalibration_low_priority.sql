-- Phase 8: versioned pricing, exact-MMR routes, Rank Confidence calibration,
-- and account-safe Low Priority recovery. No service introduced here requests
-- or permits customer account credentials.

create table public.pricing_catalog_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique check (version ~ '^[0-9]{4}\.[0-9]{2}\.[0-9]{2}(-[a-z0-9-]+)?$'),
  currency text not null default 'cad' check (currency = 'cad'),
  configuration jsonb not null,
  is_active boolean not null default false,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index pricing_catalog_one_active_idx
on public.pricing_catalog_versions(is_active)
where is_active;

alter table public.pricing_catalog_versions enable row level security;
create policy pricing_catalog_versions_public_select
on public.pricing_catalog_versions for select
using (is_active or public.is_admin());
create policy pricing_catalog_versions_admin_manage
on public.pricing_catalog_versions for all
using (public.is_admin())
with check (public.is_admin());

grant select on public.pricing_catalog_versions to anon, authenticated;
grant insert, update, delete on public.pricing_catalog_versions to authenticated;
grant all on public.pricing_catalog_versions to service_role;

update public.pricing_catalog_versions set is_active = false where is_active;

insert into public.pricing_catalog_versions(version, currency, configuration, is_active)
values (
  '2026.07.22',
  'cad',
  $json$
  {
    "minimumTotal": 2500,
    "mmrBrackets": [
      {"from": 0, "to": 769, "ratePer100": 450},
      {"from": 770, "to": 1539, "ratePer100": 500},
      {"from": 1540, "to": 2309, "ratePer100": 550},
      {"from": 2310, "to": 3079, "ratePer100": 600},
      {"from": 3080, "to": 3849, "ratePer100": 700},
      {"from": 3850, "to": 4619, "ratePer100": 850},
      {"from": 4620, "to": 5419, "ratePer100": 1150},
      {"from": 5420, "to": 6500, "ratePer100": 1600}
    ],
    "unitPrices": {
      "calibrationMatch": 850,
      "lowPriorityWin": 1200,
      "behaviorScore500": 450,
      "assistedWin": 750,
      "coachingSession": 3900
    },
    "volumeDiscounts": {
      "mmr-boost": [
        {"minimumUnits": 20, "rate": 0.12},
        {"minimumUnits": 10, "rate": 0.07},
        {"minimumUnits": 5, "rate": 0.03}
      ],
      "mmr-calibration": [
        {"minimumUnits": 20, "rate": 0.15},
        {"minimumUnits": 10, "rate": 0.10}
      ],
      "low-priority-recovery": [
        {"minimumUnits": 10, "rate": 0.10},
        {"minimumUnits": 5, "rate": 0.05}
      ],
      "behavior-score-boost": [
        {"minimumUnits": 8, "rate": 0.08},
        {"minimumUnits": 4, "rate": 0.04}
      ],
      "win-boost": [
        {"minimumUnits": 20, "rate": 0.10},
        {"minimumUnits": 15, "rate": 0.07},
        {"minimumUnits": 10, "rate": 0.05}
      ],
      "coaching": [
        {"minimumUnits": 8, "rate": 0.12},
        {"minimumUnits": 4, "rate": 0.07}
      ]
    }
  }
  $json$::jsonb,
  true
);

insert into public.services(slug, name, description, service_type, sort_order)
values (
  'low-priority-recovery',
  'Low Priority Recovery Assist',
  'Customer-operated guidance for the required Single Draft wins. Highground never logs into the customer account.',
  'low_priority_recovery',
  30
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  service_type = excluded.service_type,
  sort_order = excluded.sort_order,
  is_active = true,
  deleted_at = null,
  updated_at = now();

update public.services
set
  name = 'Calibration & Rank Confidence',
  description = 'Customer-operated assistance for new calibration, activated recalibration, or returning-player Rank Confidence recovery.',
  sort_order = 20,
  updated_at = now()
where slug = 'mmr-calibration';

update public.services set sort_order = 40, updated_at = now() where slug = 'behavior-score-boost';
update public.services set sort_order = 50, updated_at = now() where slug = 'win-boost';

insert into public.service_packages(service_id, name, description, base_price, included_sessions, included_replays, sort_order)
select id, 'Three Required Wins', 'Guided self-play for three required Single Draft wins. Customer credentials are never accepted.', 3600, 3, 0, 10
from public.services s
where s.slug = 'low-priority-recovery'
  and not exists (
    select 1 from public.service_packages p
    where p.service_id = s.id and p.name = 'Three Required Wins'
  );

update public.service_options
set is_active = false, updated_at = now()
where option_key in ('current_rank', 'target_rank', 'mmr_amount')
  and service_id in (select id from public.services where slug in ('mmr-boost', 'mmr-calibration', 'win-boost'));

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'current_mmr', 'Current or previous MMR', 'number', '{"min":0,"max":6400,"step":1}', true
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'win-boost')
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'target_mmr', 'Target MMR', 'number', '{"min":100,"max":6500,"step":1}', true
from public.services where slug = 'mmr-boost'
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'calibration_type', 'Calibration state', 'select', '{"values":["New account","Recalibration activated","Returning player"]}', true
from public.services where slug = 'mmr-calibration'
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'rank_confidence', 'Current Rank Confidence', 'number', '{"min":0,"max":100,"step":1}', true
from public.services where slug = 'mmr-calibration'
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

update public.service_options
set label = 'Assisted calibration games', configuration = '{"min":1,"max":30,"step":1}', option_type = 'number', updated_at = now()
where option_key = 'match_count'
  and service_id = (select id from public.services where slug = 'mmr-calibration');

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'low_priority_wins', 'Required Single Draft wins', 'number', '{"min":1,"max":10,"step":1}', true
from public.services where slug = 'low-priority-recovery'
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'current_behavior_score', 'Current behavior score', 'number', '{"min":0,"max":12000,"step":100}', true
from public.services where slug in ('mmr-calibration', 'low-priority-recovery')
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.service_options(service_id, option_key, label, option_type, configuration, is_required)
select id, 'boost_mode', 'Recovery delivery', 'select', '{"values":["Solo","Duo"]}', true
from public.services where slug = 'low-priority-recovery'
on conflict (service_id, option_key) do update set
  label = excluded.label,
  option_type = excluded.option_type,
  configuration = excluded.configuration,
  is_required = excluded.is_required,
  is_active = true,
  updated_at = now();

insert into public.pricing_rules(service_id, rule_key, conditions, adjustment_type, adjustment_value, priority)
select id, 'duo-delivery', '{"boostMode":"Duo"}', 'multiplier', 1.20, 50
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'low-priority-recovery', 'win-boost')
on conflict (service_id, rule_key) do update set
  conditions = excluded.conditions,
  adjustment_type = excluded.adjustment_type,
  adjustment_value = excluded.adjustment_value,
  priority = excluded.priority,
  is_active = true;

insert into public.pricing_rules(service_id, rule_key, conditions, adjustment_type, adjustment_value, priority)
select id, 'coach-tier-master', '{"boosterTier":"Master"}', 'multiplier', 1.10, 100
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'low-priority-recovery', 'behavior-score-boost', 'win-boost', 'coaching')
union all
select id, 'coach-tier-elite', '{"boosterTier":"Elite"}', 'multiplier', 1.25, 110
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'low-priority-recovery', 'behavior-score-boost', 'win-boost', 'coaching')
union all
select id, 'flexible-delivery', '{"priority":"Flexible"}', 'multiplier', 0.92, 120
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'low-priority-recovery', 'behavior-score-boost', 'win-boost', 'coaching')
union all
select id, 'priority-delivery', '{"priority":"Priority"}', 'multiplier', 1.18, 130
from public.services where slug in ('mmr-boost', 'mmr-calibration', 'low-priority-recovery', 'behavior-score-boost', 'win-boost', 'coaching')
on conflict (service_id, rule_key) do update set
  conditions = excluded.conditions,
  adjustment_type = excluded.adjustment_type,
  adjustment_value = excluded.adjustment_value,
  priority = excluded.priority,
  is_active = true;
