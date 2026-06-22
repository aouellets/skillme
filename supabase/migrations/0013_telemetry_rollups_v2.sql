-- ============================================================
-- Migration 0013 — Telemetry rollups v2 (tool calls, trends, search).
--
-- Extends the 0008 metrics layer with the surfaces the admin dashboard was
-- missing:
--   * mv_tool_performance   — MCP tool usage: volume, error rate, latency.
--   * mv_event_volume_daily — every event by day/source for a filterable
--                             activity timeline (powers range + trend deltas).
--   * mv_trending_skills    — 7d-vs-prior-7d install/view velocity per skill.
--   * mv_trending_packs     — 7d-vs-prior-7d install velocity per pack.
--   * mv_search_terms       — browse/recommend queries with zero-result rate
--                             (surfaces catalog gaps).
--
-- All read off public.telemetry_account_events (0008), inherit its access model
-- (REVOKE from anon/authenticated; admin reads via the service-role client), and
-- are refreshed CONCURRENTLY by refresh_telemetry_rollups() — re-created at the
-- bottom of this file to include the five new views.
--
-- Trailing-window aggregates use now() (stable per refresh transaction); with the
-- 15-minute cron these stay current. Idempotent. Apply after 0008.
-- ============================================================

-- ============================================================
-- 8. mv_tool_performance — per MCP tool: invocations, distinct actors, error
-- rate, p50/p95 latency, recent-window volume, last-used. Reads mcp_tool_invoked
-- (properties: tool, duration_ms, ok, error_code — see lib/telemetry/events.ts).
-- ============================================================
drop materialized view if exists public.mv_tool_performance cascade;
create materialized view public.mv_tool_performance as
with t as (
  select
    properties->>'tool'                       as tool,
    actor_key,
    (properties->>'ok')::boolean              as ok,
    nullif(properties->>'duration_ms', '')::numeric as duration_ms,
    occurred_at
  from public.telemetry_account_events
  where event_name = 'mcp_tool_invoked'
    and properties->>'tool' is not null
)
select
  tool,
  count(*)                                                          as invocations,
  count(distinct actor_key)                                         as distinct_actors,
  count(*) filter (where ok is false)                              as errors,
  round(count(*) filter (where ok is false)::numeric
        / nullif(count(*), 0), 4)                                  as error_rate,
  round(percentile_cont(0.5)  within group (order by duration_ms)::numeric, 0) as p50_ms,
  round(percentile_cont(0.95) within group (order by duration_ms)::numeric, 0) as p95_ms,
  count(*) filter (where occurred_at >= now() - interval '24 hours') as invocations_24h,
  count(*) filter (where occurred_at >= now() - interval '7 days')   as invocations_7d,
  count(*) filter (where occurred_at >= now() - interval '14 days'
                     and occurred_at <  now() - interval '7 days')   as invocations_prev_7d,
  max(occurred_at)                                                  as last_used_at
from t
group by tool
with data;

create unique index if not exists mv_tool_performance_pk
  on public.mv_tool_performance (tool);

-- ============================================================
-- 9. mv_event_volume_daily — count + distinct actors per day × event × source.
-- The raw material for the activity timeline, range filtering and trend deltas
-- (the dashboard re-slices these rows client-side; no per-request DB work).
-- ============================================================
drop materialized view if exists public.mv_event_volume_daily cascade;
create materialized view public.mv_event_volume_daily as
select
  date_trunc('day', occurred_at)::date as day,
  event_name,
  source,
  count(*)                  as events,
  count(distinct actor_key) as actors
from public.telemetry_account_events
group by 1, 2, 3
with data;

create unique index if not exists mv_event_volume_daily_pk
  on public.mv_event_volume_daily (day, event_name, source);

-- ============================================================
-- 10. mv_trending_skills — 7d vs prior-7d install velocity (+ recent views and
-- distinct actors). installs_growth is the week-over-week ratio; rows with no
-- recent install or view are excluded. Joined to public.skills for the name.
-- ============================================================
drop materialized view if exists public.mv_trending_skills cascade;
create materialized view public.mv_trending_skills as
with ev as (
  select properties->>'skill_id' as skill_id, event_name, occurred_at, actor_key
  from public.telemetry_account_events
  where event_name in ('skill_installed', 'skill_viewed', 'skill_activated')
    and properties->>'skill_id' is not null
),
windowed as (
  select
    skill_id,
    count(*) filter (where event_name = 'skill_installed'
                       and occurred_at >= now() - interval '7 days')  as installs_7d,
    count(*) filter (where event_name = 'skill_installed'
                       and occurred_at >= now() - interval '14 days'
                       and occurred_at <  now() - interval '7 days')  as installs_prev_7d,
    count(*) filter (where event_name = 'skill_viewed'
                       and occurred_at >= now() - interval '7 days')  as views_7d,
    count(*) filter (where event_name = 'skill_activated'
                       and occurred_at >= now() - interval '7 days')  as activations_7d,
    count(distinct actor_key) filter (where occurred_at >= now() - interval '7 days') as actors_7d
  from ev
  group by skill_id
)
select
  w.skill_id,
  sk.name                                  as skill_name,
  w.installs_7d,
  w.installs_prev_7d,
  (w.installs_7d - w.installs_prev_7d)     as installs_delta,
  round((w.installs_7d - w.installs_prev_7d)::numeric
        / nullif(w.installs_prev_7d, 0), 4) as installs_growth,
  w.views_7d,
  w.activations_7d,
  w.actors_7d
from windowed w
left join public.skills sk
  on sk.id = (case
                when w.skill_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
                then w.skill_id::uuid
              end)
where w.installs_7d > 0 or w.views_7d > 0 or w.activations_7d > 0
with data;

create unique index if not exists mv_trending_skills_pk
  on public.mv_trending_skills (skill_id);

-- ============================================================
-- 11. mv_trending_packs — 7d vs prior-7d pack install velocity. (pack_browsed
-- carries no pack_id, so packs trend on installs only.) Joined to public.packs.
-- ============================================================
drop materialized view if exists public.mv_trending_packs cascade;
create materialized view public.mv_trending_packs as
with ev as (
  select properties->>'pack_id' as pack_id, occurred_at, actor_key
  from public.telemetry_account_events
  where event_name = 'pack_installed'
    and properties->>'pack_id' is not null
),
windowed as (
  select
    pack_id,
    count(*) filter (where occurred_at >= now() - interval '7 days')  as installs_7d,
    count(*) filter (where occurred_at >= now() - interval '14 days'
                       and occurred_at <  now() - interval '7 days')  as installs_prev_7d,
    count(distinct actor_key) filter (where occurred_at >= now() - interval '7 days') as actors_7d
  from ev
  group by pack_id
)
select
  w.pack_id,
  pk.name                                  as pack_name,
  w.installs_7d,
  w.installs_prev_7d,
  (w.installs_7d - w.installs_prev_7d)     as installs_delta,
  round((w.installs_7d - w.installs_prev_7d)::numeric
        / nullif(w.installs_prev_7d, 0), 4) as installs_growth,
  w.actors_7d
from windowed w
left join public.packs pk
  on pk.id = (case
                when w.pack_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
                then w.pack_id::uuid
              end)
where w.installs_7d > 0 or w.installs_prev_7d > 0
with data;

create unique index if not exists mv_trending_packs_pk
  on public.mv_trending_packs (pack_id);

-- ============================================================
-- 12. mv_search_terms — normalized browse/recommend queries with search volume,
-- distinct searchers, average result count, and zero-result rate. A high
-- zero_result_rate is a direct signal of a catalog gap. (skill_recommended has
-- no query text, so this draws on skill_browsed + pack_browsed.)
-- ============================================================
drop materialized view if exists public.mv_search_terms cascade;
create materialized view public.mv_search_terms as
with q as (
  select
    lower(trim(properties->>'query'))        as term,
    actor_key,
    nullif(properties->>'result_count', '')::int as result_count
  from public.telemetry_account_events
  where event_name in ('skill_browsed', 'pack_browsed')
    and coalesce(trim(properties->>'query'), '') <> ''
)
select
  term,
  count(*)                                                       as searches,
  count(distinct actor_key)                                      as distinct_searchers,
  count(*) filter (where result_count = 0)                       as zero_result_searches,
  round(count(*) filter (where result_count = 0)::numeric
        / nullif(count(*), 0), 4)                                as zero_result_rate,
  round(avg(result_count)::numeric, 1)                           as avg_results
from q
group by term
with data;

create unique index if not exists mv_search_terms_pk
  on public.mv_search_terms (term);

-- ------------------------------------------------------------
-- Lock down the new rollups: deny anon/authenticated (admin reads via service
-- role), matching every 0008 view.
-- ------------------------------------------------------------
revoke all on public.mv_tool_performance   from anon, authenticated;
revoke all on public.mv_event_volume_daily from anon, authenticated;
revoke all on public.mv_trending_skills    from anon, authenticated;
revoke all on public.mv_trending_packs     from anon, authenticated;
revoke all on public.mv_search_terms       from anon, authenticated;

-- ------------------------------------------------------------
-- Re-create the refresh entry point to also refresh the five new views. Same
-- contract as 0008: SECURITY DEFINER, CONCURRENTLY (every MV has a unique
-- index), revoked from PUBLIC, granted to service_role.
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
end;
$$;

revoke execute on function public.refresh_telemetry_rollups() from public;
-- 0008 only revoked from PUBLIC; Supabase grants anon/authenticated separately,
-- so they retained EXECUTE (flagged by the security advisor). Lock to service
-- role only — the cron route is the sole caller.
revoke execute on function public.refresh_telemetry_rollups() from anon, authenticated;
grant  execute on function public.refresh_telemetry_rollups() to service_role;

-- Same gap on the 0007 GDPR-erasure function: deny anon/authenticated so it is
-- not callable via PostgREST RPC by untrusted roles.
revoke execute on function public.purge_telemetry_for_user(uuid) from anon, authenticated;
