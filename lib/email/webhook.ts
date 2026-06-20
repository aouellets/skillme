import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Verify a Resend webhook signature. Resend signs webhooks with Svix:
 *   signedContent = `${svix-id}.${svix-timestamp}.${rawBody}`
 *   signature     = base64( HMAC-SHA256(secretBytes, signedContent) )
 * where the signing secret is `whsec_<base64>` and secretBytes is the decoded
 * tail. The `svix-signature` header may carry several space-separated
 * `v1,<sig>` entries (during secret rotation); any match passes.
 *
 * Implemented directly (no svix SDK) to match the project's zero-dependency
 * style. Rejects stale timestamps to blunt replay attacks.
 */

const TOLERANCE_SECONDS = 5 * 60

export interface SvixHeaders {
  id: string | null
  timestamp: string | null
  signature: string | null
}

export function svixHeaders(h: Headers): SvixHeaders {
  return {
    id: h.get('svix-id'),
    timestamp: h.get('svix-timestamp'),
    signature: h.get('svix-signature'),
  }
}

function timingEqualB64(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'base64')
  const bb = Buffer.from(b, 'base64')
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function verifyResendWebhook(rawBody: string, headers: SvixHeaders, secret: string): boolean {
  const { id, timestamp, signature } = headers
  if (!id || !timestamp || !signature || !secret) return false

  // Replay guard: timestamp must be recent.
  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return false
  const skew = Math.abs(Date.now() / 1000 - ts)
  if (skew > TOLERANCE_SECONDS) return false

  let secretBytes: Buffer
  try {
    secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  } catch {
    return false
  }

  const expected = createHmac('sha256', secretBytes).update(`${id}.${timestamp}.${rawBody}`).digest('base64')

  // Header is "v1,<sig> v1,<sig> ..." — pass if any provided signature matches.
  return signature.split(' ').some((part) => {
    const comma = part.indexOf(',')
    const sig = comma === -1 ? part : part.slice(comma + 1)
    return sig.length > 0 && timingEqualB64(sig, expected)
  })
}

// ── Event payload shape (only the fields we use) ─────────────────────────────

export interface ResendWebhookEvent {
  type: string
  created_at?: string
  data?: {
    email_id?: string
    to?: string[] | string
    subject?: string
    [k: string]: unknown
  }
}

/** Events that should suppress a recipient from future newsletter sends. */
export const SUPPRESSION_EVENTS = new Set(['email.bounced', 'email.complained'])
