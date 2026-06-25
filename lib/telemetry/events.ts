import { z } from 'zod'

/**
 * Canonical, typed telemetry taxonomy for Skill Me. SINGLE SOURCE OF TRUTH:
 * the zod schemas below drive BOTH runtime boundary validation (the web batch
 * ingest in app/api/telemetry/route.ts) and the compile-time `TelemetryEvent`
 * union (so `track()` is exhaustive over every event).
 *
 * Naming is `object_action`, past tense. Properties are typed per event and
 * serialized into the `properties` jsonb column. ZERO PII may live here — no
 * names, no emails, no free-text identifiers, no raw IPs (see docs/telemetry.md).
 *
 * To add an event: add one entry to EVENT_SCHEMAS, decide whether the web
 * client may emit it (WEB_EMITTABLE_EVENTS), and emit it from a real code path.
 */

/** The MCP tools we instrument. `mcp_tool_invoked.tool` is constrained to these. */
export const MCP_TOOLS = [
  'get_active_skills',
  'browse_skills',
  'browse_packs',
  'install_skill',
  'uninstall_skill',
  'install_pack',
  'list_installed',
  'manage_collection',
  'rate_skill',
  'recommend_skills',
] as const
export type McpTool = (typeof MCP_TOOLS)[number]

const skillId = z.string().uuid()
const packId = z.string().uuid()

/**
 * Per-event property schemas. The key is the event name; the value validates
 * that event's `properties`. Keep every field primitive and non-identifying.
 */
export const EVENT_SCHEMAS = {
  mcp_session_started: z.object({
    transport: z.string().max(40),
    client_name: z.string().max(120).optional(),
  }),
  mcp_tool_invoked: z.object({
    tool: z.enum(MCP_TOOLS),
    duration_ms: z.number().int().nonnegative(),
    ok: z.boolean(),
    error_code: z.string().max(80).optional(),
  }),
  skill_browsed: z.object({
    query: z.string().max(200).optional(),
    category: z.string().max(40).optional(),
    // Total surfaced (keyword + semantic retry); a true 0 means we showed nothing.
    result_count: z.number().int().nonnegative(),
    // Breakdown so the audit can tell exact-match recall from the retry top-up.
    keyword_count: z.number().int().nonnegative().optional(),
    related_count: z.number().int().nonnegative().optional(),
  }),
  pack_browsed: z.object({
    query: z.string().max(200).optional(),
    category: z.string().max(40).optional(),
    result_count: z.number().int().nonnegative(),
    keyword_count: z.number().int().nonnegative().optional(),
    related_count: z.number().int().nonnegative().optional(),
  }),
  skill_viewed: z.object({ skill_id: skillId }),
  skill_installed: z.object({
    skill_id: skillId,
    via: z.enum(['single', 'pack']),
    pack_id: packId.optional(),
    // First-party (Skill Me original) flag + whether an anonymous caller was
    // nudged to sign in. Only set on single installs; pack installs aggregate
    // first-party counts on pack_installed instead.
    first_party: z.boolean().optional(),
    nudged: z.boolean().optional(),
  }),
  skill_uninstalled: z.object({ skill_id: skillId }),
  pack_installed: z.object({
    pack_id: packId,
    skill_count: z.number().int().nonnegative(),
    // Set when an anonymous caller installed a pack containing Skill Me
    // originals and was nudged to sign in.
    nudged: z.boolean().optional(),
    first_party_count: z.number().int().nonnegative().optional(),
  }),
  skill_rated: z.object({ skill_id: skillId, rating: z.number().int().min(1).max(5) }),
  collection_managed: z.object({
    action: z.enum(['create', 'add', 'remove', 'rename', 'share', 'delete']),
    collection_id: z.string().uuid().optional(),
  }),
  // Server-only: the true "active use" signal, emitted from get_active_skills
  // when an installed skill is actually loaded into a session.
  skill_activated: z.object({ skill_id: skillId }),
  user_signed_up: z.object({ method: z.string().max(40) }),
  // Semantic recommender: one row per recommend_skills call. `mode` records
  // whether vector search or the lexical fallback produced the candidates, and
  // `used_rerank` whether the LLM rerank stage ran — both surface how often the
  // tool runs degraded.
  skill_recommended: z.object({
    result_count: z.number().int().nonnegative(),
    used_rerank: z.boolean(),
    mode: z.enum(['semantic', 'lexical']),
  }),
} as const

/** First-party cookie holding the pre-auth anonymous id. Shared by the client
 *  tracker (sets it) and the ingest route (reads it). */
export const ANONYMOUS_ID_COOKIE = 'skillme_anon_id'

export type EventName = keyof typeof EVENT_SCHEMAS

export const EVENT_NAMES = Object.keys(EVENT_SCHEMAS) as [EventName, ...EventName[]]

/**
 * Discriminated union over `name`, exhaustive across EVENT_SCHEMAS. `track()`
 * accepts this, so adding an EVENT_SCHEMAS entry immediately makes a new event
 * trackable and the compiler enforces correct properties at every call site.
 */
export type TelemetryEvent = {
  [K in EventName]: { name: K; properties: z.infer<(typeof EVENT_SCHEMAS)[K]> }
}[EventName]

/**
 * Events the WEB CLIENT is allowed to emit (server-side first principle).
 * `mcp_*` and `skill_activated` are server-authored signals — accepting them
 * from an untrusted browser would let a client forge MCP usage / active-use.
 */
export const WEB_EMITTABLE_EVENTS = [
  'skill_browsed',
  'pack_browsed',
  'skill_viewed',
  'skill_installed',
  'skill_uninstalled',
  'pack_installed',
  'skill_rated',
  'collection_managed',
  'user_signed_up',
] as const satisfies readonly EventName[]

export type WebEmittableEvent = (typeof WEB_EMITTABLE_EVENTS)[number]

/** Validate an event's properties against its per-name schema. */
export function validateEventProperties(name: EventName, properties: unknown) {
  return EVENT_SCHEMAS[name].safeParse(properties)
}
