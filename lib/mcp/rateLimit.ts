/**
 * In-memory sliding-window rate limiter for installs: 10 per minute per user
 * token. This is best-effort and per-instance — adequate for the POC. For
 * multi-region production, back this with Redis or Supabase.
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
