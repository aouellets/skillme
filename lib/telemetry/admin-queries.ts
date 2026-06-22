import 'server-only'
import { getServiceSupabase } from '../supabase'

/**
 * Admin-only reads of the telemetry rollups (supabase/migrations/0008). The
 * materialized views are `revoke all ... from anon, authenticated`, so the ONLY
 * way to read them is the service-role client (which bypasses grants). That is
 * safe because every function here is `server-only` and is called exclusively
 * from the `isAdmin()`-gated /admin/telemetry server component — no client
 * component or public API route ever touches these.
 *
 * Every read is defensive: a missing service key or a query error yields an
 * empty result (never a throw), so the dashboard degrades to empty panels
 * rather than erroring. The 15-minute Vercel cron (/api/cron/telemetry) keeps
 * the views fresh; this layer only reads.
 */

// --- Row shapes (mirror the MV columns exactly; rates are 0..1 ratios) --------

export interface ActiveUsersDailyRow {
  day: string
  source: string
  dau: number
  wau: number
  mau: number
}

export interface ActivationRow {
  signup_week: string
  cohort_size: number
  activated_users: number
  activation_rate: number
  avg_hours_to_activate: number | null
}

export interface RetentionRow {
  signup_week: string
  week_offset: number
  cohort_size: number
  retained_users: number
  retention_rate: number
}

export interface FunnelRow {
  step_order: number
  step: string
  actors: number
  pct_of_top: number
  step_conversion: number | null
}

export interface SkillPerfRow {
  skill_id: string
  skill_name: string
  installs: number
  uninstalls: number
  activating_users: number
  avg_rating: number | null
  ratings: number
  install_to_activation_rate: number | null
}

export interface PackPerfRow {
  pack_id: string
  pack_name: string
  installs: number
  distinct_installers: number
  derived_skill_activations: number
  distinct_activating_users: number
}

export interface GrowthRow {
  period: string
  new_users: number
  retained_users: number
  resurrected_users: number
  churned_users: number
}

export interface ToolPerfRow {
  tool: string
  invocations: number
  distinct_actors: number
  errors: number
  error_rate: number
  p50_ms: number | null
  p95_ms: number | null
  invocations_24h: number
  invocations_7d: number
  invocations_prev_7d: number
  last_used_at: string | null
}

export interface EventVolumeRow {
  day: string
  event_name: string
  source: string
  events: number
  actors: number
}

export interface TrendingSkillRow {
  skill_id: string
  skill_name: string | null
  installs_7d: number
  installs_prev_7d: number
  installs_delta: number
  installs_growth: number | null
  views_7d: number
  activations_7d: number
  actors_7d: number
}

export interface TrendingPackRow {
  pack_id: string
  pack_name: string | null
  installs_7d: number
  installs_prev_7d: number
  installs_delta: number
  installs_growth: number | null
  actors_7d: number
}

export interface SearchTermRow {
  term: string
  searches: number
  distinct_searchers: number
  zero_result_searches: number
  zero_result_rate: number
  avg_results: number | null
}

export interface TelemetryDashboardData {
  activeUsers: ActiveUsersDailyRow[]
  activation: ActivationRow[]
  retention: RetentionRow[]
  funnel: FunnelRow[]
  skills: SkillPerfRow[]
  packs: PackPerfRow[]
  growth: GrowthRow[]
  tools: ToolPerfRow[]
  eventVolume: EventVolumeRow[]
  trendingSkills: TrendingSkillRow[]
  trendingPacks: TrendingPackRow[]
  searchTerms: SearchTermRow[]
  /** Most recent telemetry_events.received_at — a "data through" staleness proxy. */
  freshness: string | null
}

// --- Reads --------------------------------------------------------------------

interface OrderSpec {
  column: string
  ascending?: boolean
}

/** Read a rollup view via the service role. Returns [] on any failure. */
async function readMv<T>(table: string, orders: OrderSpec[] = [], limit?: number): Promise<T[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []
  let query = supabase.from(table).select('*')
  for (const o of orders) query = query.order(o.column, { ascending: o.ascending ?? true })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) {
    console.error(`[admin-telemetry] read ${table} failed:`, error.message)
    return []
  }
  return (data ?? []) as T[]
}

export function getActiveUsersDaily(): Promise<ActiveUsersDailyRow[]> {
  // Newest first, capped to a quarter of history; the UI re-sorts for the trend.
  return readMv<ActiveUsersDailyRow>('mv_active_users_daily', [{ column: 'day', ascending: false }], 200)
}

export function getActivation(): Promise<ActivationRow[]> {
  return readMv<ActivationRow>('mv_activation', [{ column: 'signup_week', ascending: true }])
}

export function getRetentionWeekly(): Promise<RetentionRow[]> {
  return readMv<RetentionRow>('mv_retention_weekly', [
    { column: 'signup_week', ascending: true },
    { column: 'week_offset', ascending: true },
  ])
}

export function getInstallFunnel(): Promise<FunnelRow[]> {
  return readMv<FunnelRow>('mv_install_funnel', [{ column: 'step_order', ascending: true }])
}

export function getSkillPerformance(): Promise<SkillPerfRow[]> {
  return readMv<SkillPerfRow>('mv_skill_performance', [{ column: 'installs', ascending: false }], 100)
}

export function getPackPerformance(): Promise<PackPerfRow[]> {
  return readMv<PackPerfRow>('mv_pack_performance', [{ column: 'installs', ascending: false }], 100)
}

export function getGrowthAccounting(): Promise<GrowthRow[]> {
  return readMv<GrowthRow>('mv_growth_accounting', [{ column: 'period', ascending: true }])
}

export function getToolPerformance(): Promise<ToolPerfRow[]> {
  return readMv<ToolPerfRow>('mv_tool_performance', [{ column: 'invocations', ascending: false }])
}

export function getEventVolumeDaily(): Promise<EventVolumeRow[]> {
  // Newest first, capped to a quarter of history; the UI re-slices by range.
  return readMv<EventVolumeRow>('mv_event_volume_daily', [{ column: 'day', ascending: false }], 2000)
}

export function getTrendingSkills(): Promise<TrendingSkillRow[]> {
  return readMv<TrendingSkillRow>('mv_trending_skills', [{ column: 'installs_7d', ascending: false }], 100)
}

export function getTrendingPacks(): Promise<TrendingPackRow[]> {
  return readMv<TrendingPackRow>('mv_trending_packs', [{ column: 'installs_7d', ascending: false }], 100)
}

export function getSearchTerms(): Promise<SearchTermRow[]> {
  return readMv<SearchTermRow>('mv_search_terms', [{ column: 'searches', ascending: false }], 100)
}

/** "Data through" timestamp — newest received event. Null if none / unavailable. */
export async function getDataFreshness(): Promise<string | null> {
  const supabase = getServiceSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('telemetry_events')
    .select('received_at')
    .order('received_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return (data as { received_at: string }).received_at
}

/** Load everything the dashboard needs, in parallel. Never throws. */
export async function loadTelemetryDashboard(): Promise<TelemetryDashboardData> {
  const [
    activeUsers,
    activation,
    retention,
    funnel,
    skills,
    packs,
    growth,
    tools,
    eventVolume,
    trendingSkills,
    trendingPacks,
    searchTerms,
    freshness,
  ] = await Promise.all([
    getActiveUsersDaily(),
    getActivation(),
    getRetentionWeekly(),
    getInstallFunnel(),
    getSkillPerformance(),
    getPackPerformance(),
    getGrowthAccounting(),
    getToolPerformance(),
    getEventVolumeDaily(),
    getTrendingSkills(),
    getTrendingPacks(),
    getSearchTerms(),
    getDataFreshness(),
  ])
  return {
    activeUsers,
    activation,
    retention,
    funnel,
    skills,
    packs,
    growth,
    tools,
    eventVolume,
    trendingSkills,
    trendingPacks,
    searchTerms,
    freshness,
  }
}
