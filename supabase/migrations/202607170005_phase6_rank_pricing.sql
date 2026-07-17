-- Phase 6: exact public Dota medal divisions and lower customer-operated rates.
-- The live quote remains server calculated; this metadata keeps the catalog aligned.

update public.service_options
set configuration = jsonb_build_object('values', jsonb_build_array(
  'Herald I','Herald II','Herald III','Herald IV','Herald V',
  'Guardian I','Guardian II','Guardian III','Guardian IV','Guardian V',
  'Crusader I','Crusader II','Crusader III','Crusader IV','Crusader V',
  'Archon I','Archon II','Archon III','Archon IV','Archon V',
  'Legend I','Legend II','Legend III','Legend IV','Legend V',
  'Ancient I','Ancient II','Ancient III','Ancient IV','Ancient V',
  'Divine I','Divine II','Divine III','Divine IV','Divine V','Immortal'
)), updated_at = now()
where option_key in ('current_rank', 'target_rank');

update public.service_packages p set
  base_price = case s.slug
    when 'mmr-boost' then 4125
    when 'mmr-calibration' then 5000
    when 'behavior-score-boost' then 1800
    when 'win-boost' then 3750
    when 'coaching' then 3900
    else p.base_price end,
  updated_at = now()
from public.services s
where p.service_id = s.id and p.sort_order = 10 and s.slug in ('mmr-boost','mmr-calibration','behavior-score-boost','win-boost','coaching');
