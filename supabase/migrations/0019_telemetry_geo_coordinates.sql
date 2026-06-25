-- ============================================================================
-- 0019_telemetry_geo_coordinates.sql
--
-- Adds approximate coordinates to the per-actor directory rollup so the admin
-- world-map can plot adoption. The ingest layer (lib/telemetry/geo.ts) now also
-- captures `context.geo.lat` / `.lng` from Vercel's edge headers, COARSENED to
-- 2 decimals (~1.1 km) at capture — never a raw IP, never a precise point. This
-- is the same no-PII posture as the existing country/region/city columns, just
-- one resolution finer for mapping.
--
-- A materialized view's column set can't be altered with CREATE OR REPLACE, so
-- we drop + recreate mv_user_directory (adding last_lat/last_lng and
-- signup_lat/signup_lng) and re-establish its indexes, grants, and refresh
-- registration exactly as 0015 did. Historical events have no coordinates, so
-- the new columns are null for actors whose located events predate this change;
-- they populate as new located events arrive.
-- ============================================================================

drop materialized view if exists public.mv_user_directory;

create materialized view public.mv_user_directory as
with resolved as (
  -- Fold pre-auth web events into the account they later signed into.
  select
    e.event_name,
    e.occurred_at,
    e.source,
    e.session_id,
    e.user_token,
    e.anonymous_id,
    coalesce(e.user_id, ident.user_id)        as eff_user_id,
    e.context -> 'geo' ->> 'country'          as country,
    e.context -> 'geo' ->> 'region'           as region,
    e.context -> 'geo' ->> 'city'             as city,
    (e.context -> 'geo' ->> 'lat')::double precision as lat,
    (e.context -> 'geo' ->> 'lng')::double precision as lng,
    e.properties
  from public.telemetry_events e
  left join public.telemetry_identity ident
    on ident.anonymous_id = e.anonymous_id
),
keyed as (
  select
    *,
    coalesce(eff_user_id::text, user_token, 'anon:' || anonymous_id) as actor_key
  from resolved
  -- Drop the rare event that carries no identity at all.
  where coalesce(eff_user_id::text, user_token, anonymous_id) is not null
),
agg as (
  select
    actor_key,
    (array_agg(eff_user_id) filter (where eff_user_id is not null))[1] as user_id,
    min(occurred_at)                                                   as first_seen_at,
    max(occurred_at)                                                   as last_seen_at,
    count(*)                                                           as total_events,
    count(*) filter (where source = 'mcp')                            as mcp_events,
    count(*) filter (where source = 'web')                            as web_events,
    count(*) filter (where event_name = 'mcp_tool_invoked')           as tool_invocations,
    count(*) filter (where event_name in ('skill_installed', 'pack_installed')) as installs,
    count(*) filter (where event_name = 'skill_activated')            as activations,
    count(distinct session_id)                                        as sessions,
    (array_agg(user_token)   filter (where user_token is not null))[1]   as user_token,
    (array_agg(anonymous_id) filter (where anonymous_id is not null))[1] as anonymous_id
  from keyed
  group by actor_key
),
last_geo as (
  -- Most recent located event per actor = "where they're active from now".
  select distinct on (actor_key)
    actor_key,
    country as last_country,
    region  as last_region,
    city    as last_city,
    lat     as last_lat,
    lng     as last_lng,
    source  as last_source
  from keyed
  where country is not null
  order by actor_key, occurred_at desc
),
signup as (
  -- The user_signed_up event carries the signup method + the geo of the request
  -- that completed the auth exchange = "where they signed up from".
  select distinct on (actor_key)
    actor_key,
    occurred_at            as signup_at,
    properties ->> 'method' as signup_method,
    country                as signup_country,
    region                 as signup_region,
    city                   as signup_city,
    lat                    as signup_lat,
    lng                    as signup_lng
  from keyed
  where event_name = 'user_signed_up'
  order by actor_key, occurred_at asc
)
select
  a.actor_key,
  a.user_id,
  case
    when a.user_id is not null   then 'account'
    when a.user_token is not null then 'mcp_anon'
    else 'web_anon'
  end                       as actor_kind,
  a.user_token,
  a.anonymous_id,
  a.first_seen_at,
  a.last_seen_at,
  a.total_events,
  a.mcp_events,
  a.web_events,
  a.tool_invocations,
  a.installs,
  a.activations,
  a.sessions,
  g.last_country,
  g.last_region,
  g.last_city,
  g.last_lat,
  g.last_lng,
  g.last_source,
  s.signup_at,
  s.signup_method,
  s.signup_country,
  s.signup_region,
  s.signup_city,
  s.signup_lat,
  s.signup_lng
from agg a
left join last_geo g on g.actor_key = a.actor_key
left join signup   s on s.actor_key = a.actor_key;

-- Unique index is REQUIRED for REFRESH ... CONCURRENTLY.
create unique index mv_user_directory_actor_key_idx
  on public.mv_user_directory (actor_key);
create index mv_user_directory_last_seen_idx
  on public.mv_user_directory (last_seen_at desc);
create index mv_user_directory_user_id_idx
  on public.mv_user_directory (user_id);

-- Admin-only: identical posture to the other rollups. Service role bypasses.
revoke all on public.mv_user_directory from anon, authenticated;

-- ------------------------------------------------------------
-- Re-create the refresh entry point. mv_user_directory was dropped (cascade
-- would have removed it from the function body's plan), so re-declare the full
-- set — unchanged membership from 0015, listed defensively so this migration is
-- correct on its own.
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
end;
$$;

revoke execute on function public.refresh_telemetry_rollups() from public;
revoke execute on function public.refresh_telemetry_rollups() from anon, authenticated;
grant  execute on function public.refresh_telemetry_rollups() to service_role;
