-- ============================================================================
-- 0021_telemetry_geo_adoption.sql
--
-- Geographic adoption rollup behind the admin /admin/geography world-map. One
-- row per location bucket (country + region + city + coordinate, coordinates
-- rounded to 1 decimal for cell grouping) with event / distinct-actor / install
-- / activation counts. Country shades the choropleth; lat/lng place the bubbles
-- (null for events that predate coordinate capture in 0019 — those still count
-- toward the country totals).
--
-- Follows the MV recipe of 0008/0013/0015: a stable unique key for REFRESH ...
-- CONCURRENTLY, revoke from anon/authenticated, and refresh via the shared
-- refresh_telemetry_rollups(). This migration owns the AUTHORITATIVE refresh
-- function body: all 13 original rollups + mv_category_usage_daily (0020) +
-- mv_geo_adoption (15 total).
-- ============================================================================

drop materialized view if exists public.mv_geo_adoption cascade;
create materialized view public.mv_geo_adoption as
with located as (
  select
    actor_key,
    event_name,
    context -> 'geo' ->> 'country'                    as country,
    context -> 'geo' ->> 'region'                     as region,
    context -> 'geo' ->> 'city'                       as city,
    round((context -> 'geo' ->> 'lat')::numeric, 1)   as lat,
    round((context -> 'geo' ->> 'lng')::numeric, 1)   as lng
  from public.telemetry_account_events
  where context -> 'geo' ->> 'country' is not null
)
select
  -- Deterministic key over the (nullable) bucket columns so REFRESH CONCURRENTLY
  -- has a single unique handle per row.
  md5(
    coalesce(country, '') || '|' || coalesce(region, '') || '|' || coalesce(city, '')
      || '|' || coalesce(lat::text, '') || '|' || coalesce(lng::text, '')
  )                                                              as loc_key,
  country,
  region,
  city,
  lat,
  lng,
  count(*)                                                       as events,
  count(distinct actor_key)                                      as actors,
  count(*) filter (where event_name in ('skill_installed', 'pack_installed')) as installs,
  count(*) filter (where event_name = 'skill_activated')         as activations
from located
group by 1, 2, 3, 4, 5, 6
with data;

create unique index if not exists mv_geo_adoption_pk
  on public.mv_geo_adoption (loc_key);

revoke all on public.mv_geo_adoption from anon, authenticated;

-- ------------------------------------------------------------
-- Authoritative refresh entry point: every rollup across 0008/0013/0015/0020 +
-- this one. 15 views total.
-- ------------------------------------------------------------
create or replace function public.refresh_telemetry_rollups()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently public.mv_active_users_daily;
  refresh materialized view concurrently public.mv_activation;
  refresh materialized view concurrently public.mv_retention_weekly;
  refresh materialized view concurrently public.mv_install_funnel;
  refresh materialized view concurrently public.mv_skill_performance;
  refresh materialized view concurrently public.mv_pack_performance;
  refresh materialized view concurrently public.mv_growth_accounting;
  refresh materialized view concurrently public.mv_tool_performance;
  refresh materialized view concurrently public.mv_event_volume_daily;
  refresh materialized view concurrently public.mv_trending_skills;
  refresh materialized view concurrently public.mv_trending_packs;
  refresh materialized view concurrently public.mv_search_terms;
  refresh materialized view concurrently public.mv_user_directory;
  refresh materialized view concurrently public.mv_category_usage_daily;
  refresh materialized view concurrently public.mv_geo_adoption;
end;
$$;

revoke execute on function public.refresh_telemetry_rollups() from public;
revoke execute on function public.refresh_telemetry_rollups() from anon, authenticated;
grant  execute on function public.refresh_telemetry_rollups() to service_role;
