/**
 * In-memory sliding-window rate limiter for state-changing MCP tools (install,
 * install_pack, rate, manage_collection): 10 actions per minute per user token.
 *
 * Best-effort and per-instance — adequate for the POC. KNOWN LIMITATIONS for
 * production (tracked as follow-up): (1) on serverless this resets per cold
 * start and is not shared across instances; (2) it is keyed on the caller's
 * bearer token, which is currently client-chosen, so a determined abuser can
 * rotate tokens to bypass it (rating/install-count ballot-stuffing). Both are
 * fully closed only by binding rate limits to an authenticated identity + IP
 * and backing this with a shared store (Redis or a Supabase table).
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10

const hits = new Map<string, number[]>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfter: number
}

export function checkRateLimit(token: string): RateLimitResult {
  const now = Date.now()
  const recent = (hits.get(token) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = recent[0]
    const retryAfter = Math.ceil((WINDOW_MS - (now - oldest)) / 1000)
    hits.set(token, recent)
    return { ok: false, remaining: 0, retryAfter }
  }

  recent.push(now)
  hits.set(token, recent)
  return { ok: true, remaining: MAX_PER_WINDOW - recent.length, retryAfter: 0 }
}
