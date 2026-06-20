import { createHmac, timingSafeEqual } from 'node:crypto'
import { SITE_URL } from '../site'

/**
 * Stateless one-click unsubscribe tokens for the newsletter.
 *
 * A token is HMAC-SHA256(email) — no DB lookup needed to validate the link, and
 * a recipient can only unsubscribe their own address (they can't forge another's
 * token without the secret). The unsubscribe route sets newsletter_signups
 * .unsubscribed_at; the sender skips rows where it's non-null.
 *
 * Secret: NEWSLETTER_SECRET, falling back to MCP_OAUTH_SECRET (already required
 * in prod) then SUPABASE_SERVICE_ROLE_KEY — same defensive chain as the OAuth
 * shim, so links keep working as long as any one is set.
 */
function secret(): string {
  const s =
    process.env.NEWSLETTER_SECRET?.trim() ||
    process.env.MCP_OAUTH_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!s) throw new Error('No NEWSLETTER_SECRET / MCP_OAUTH_SECRET / SUPABASE_SERVICE_ROLE_KEY set')
  return s
}

function normalize(email: string): string {
  return email.trim().toLowerCase()
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(normalize(email)).digest('hex')
}

export function verifyUnsubscribe(email: string, token: string): boolean {
  if (!email || !token) return false
  let expected: string
  try {
    expected = unsubscribeToken(email)
  } catch {
    return false
  }
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(token, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Absolute unsubscribe URL for a given recipient. */
export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({ email: normalize(email), token: unsubscribeToken(email) })
  return `${SITE_URL}/api/newsletter/unsubscribe?${params.toString()}`
}
