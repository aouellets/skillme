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

export interface CategoryUsageRow {
  day: string
  /** A SkillCategory value, or 'unknown' for events whose skill_id has no row. */
  category: string
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

/** One location bucket from mv_geo_adoption (migration 0021). Coordinates are
 *  rounded to 1 decimal and null for events that predate coordinate capture. */
export interface GeoAdoptionRow {
  loc_key: string
  country: string | null
  region: string | null
  city: string | null
  lat: number | null
  lng: number | null
  events: number
  actors: number
  installs: number
  activations: number
}

/** Raw row from mv_user_directory (no PII — emails join in at read time). */
export interface UserDirectoryMvRow {
  actor_key: string
  user_id: string | null
  actor_kind: 'account' | 'mcp_anon' | 'web_anon'
  user_token: string | null
  anonymous_id: string | null
  first_seen_at: string
  last_seen_at: string
  total_events: number
  mcp_events: number
  web_events: number
  tool_invocations: number
  installs: number
  activations: number
  sessions: number
  last_country: string | null
  last_region: string | null
  last_city: string | null
  /** Approximate, coarsened coordinates (2 decimals) of the most recent located
   *  event. Null for actors whose located events predate coordinate capture. */
  last_lat: number | null
  last_lng: number | null
  last_source: string | null
  signup_at: string | null
  signup_method: string | null
  signup_country: string | null
  signup_region: string | null
  signup_city: string | null
  signup_lat: number | null
  signup_lng: number | null
}

/** mv_user_directory row enriched with the account's auth.users identity. */
export interface UserDirectoryRow extends UserDirectoryMvRow {
  /** From auth.users — null for anonymous actors or if the lookup is unavailable. */
  email: string | null
  name: string | null
  provider: string | null
  account_created_at: string | null
  last_sign_in_at: string | null
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
  categoryUsage: CategoryUsageRow[]
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

export function getCategoryUsageDaily(): Promise<CategoryUsageRow[]> {
  // Newest first; the UI re-slices by category / event / range / source.
  return readMv<CategoryUsageRow>('mv_category_usage_daily', [{ column: 'day', ascending: false }], 5000)
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

/** Location buckets for the admin world-map, busiest first. Read directly by the
 *  /admin/geography page (not part of loadTelemetryDashboard). [] on any failure. */
export function getGeoAdoption(): Promise<GeoAdoptionRow[]> {
  return readMv<GeoAdoptionRow>('mv_geo_adoption', [{ column: 'events', ascending: false }], 500)
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
    categoryUsage,
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
    getCategoryUsageDaily(),
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
    categoryUsage,
    trendingSkills,
    trendingPacks,
    searchTerms,
    freshness,
  }
}

// --- User directory -----------------------------------------------------------

interface AuthUserInfo {
  email: string | null
  name: string | null
  provider: string | null
  created_at: string | null
  last_sign_in_at: string | null
}

/**
 * Resolve account identities (email / display name) for the given user ids via
 * the service-role Admin API. PII stays OUT of the telemetry tables — it is
 * fetched live here and only for the admin dashboard. Paginates listUsers and
 * never throws; an error or missing service key yields an empty map (the
 * directory then shows accounts without emails rather than failing).
 */
async function fetchAuthUsers(ids: Set<string>): Promise<Map<string, AuthUserInfo>> {
  const out = new Map<string, AuthUserInfo>()
  const supabase = getServiceSupabase()
  if (!supabase || ids.size === 0) return out

  const perPage = 1000
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.error('[admin-telemetry] listUsers failed:', error.message)
      break
    }
    const users = data?.users ?? []
    for (const u of users) {
      if (!ids.has(u.id)) continue
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>
      const name =
        (meta.full_name as string | undefined) ??
        (meta.name as string | undefined) ??
        (meta.user_name as string | undefined) ??
        null
      out.set(u.id, {
        email: u.email ?? null,
        name,
        provider: (u.app_metadata?.provider as string | undefined) ?? null,
        created_at: u.created_at ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null,
      })
    }
    if (users.length < perPage) break
  }
  return out
}

/**
 * The per-user directory: every resolved actor (accounts + anonymous MCP/web),
 * newest-active first, enriched with account email/name from auth.users. Reads
 * the mv_user_directory rollup; defensive (empty on any failure).
 */
export async function getUserDirectory(limit = 1000): Promise<UserDirectoryRow[]> {
  const rows = await readMv<UserDirectoryMvRow>(
    'mv_user_directory',
    [{ column: 'last_seen_at', ascending: false }],
    limit
  )
  const ids = new Set(rows.map((r) => r.user_id).filter((v): v is string => Boolean(v)))
  const auth = await fetchAuthUsers(ids)
  return rows.map((r) => {
    const info = r.user_id ? auth.get(r.user_id) : undefined
    return {
      ...r,
      email: info?.email ?? null,
      name: info?.name ?? null,
      provider: info?.provider ?? r.signup_method ?? null,
      account_created_at: info?.created_at ?? null,
      last_sign_in_at: info?.last_sign_in_at ?? null,
    }
  })
}
