import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import {
  svixHeaders,
  verifyResendWebhook,
  SUPPRESSION_EVENTS,
  type ResendWebhookEvent,
} from '@/lib/email/webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Resend webhook receiver. Logs every delivery event to email_events and, on a
 * hard bounce or spam complaint, suppresses that recipient from future
 * newsletter sends (newsletter_signups.unsubscribed_at).
 *
 * Set RESEND_WEBHOOK_SECRET (the signing secret from the Resend dashboard) so
 * incoming events can be verified — without it the endpoint refuses everything.
 *
 * Note: Resend webhooks are account-wide and fire for every domain, so we may
 * receive events for sends from other apps on the account; logging them is
 * harmless and suppression only ever touches addresses in our own signup table.
 */
function firstRecipient(to: unknown): string | null {
  if (Array.isArray(to)) return to[0] ? String(to[0]).toLowerCase() : null
  if (typeof to === 'string') return to.toLowerCase() || null
  return null
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET not set — rejecting event')
    return Response.json({ error: 'Webhook not configured.' }, { status: 503 })
  }

  // Raw body is required for signature verification — read it before parsing.
  const raw = await req.text()
  if (!verifyResendWebhook(raw, svixHeaders(req.headers), secret)) {
    return Response.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  let event: ResendWebhookEvent
  try {
    event = JSON.parse(raw) as ResendWebhookEvent
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  if (!supabase) {
    // Signature was valid; ack so Resend doesn't retry against a misconfigured DB.
    console.error('[resend-webhook] no service supabase — event not persisted:', event.type)
    return Response.json({ ok: true, stored: false })
  }

  const recipient = firstRecipient(event.data?.to)

  // 1) Log the event (best-effort; 42P01 = table not migrated yet).
  const { error: logErr } = await supabase.from('email_events').insert({
    type: event.type,
    email_id: event.data?.email_id ?? null,
    recipient,
    subject: event.data?.subject ?? null,
    occurred_at: event.created_at ?? null,
    payload: event,
  })
  if (logErr && logErr.code !== '42P01') {
    console.error('[resend-webhook] log insert failed:', logErr.message)
  }

  // 2) Suppress on bounce / complaint.
  let suppressed = false
  if (recipient && SUPPRESSION_EVENTS.has(event.type)) {
    const { error: supErr } = await supabase
      .from('newsletter_signups')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', recipient)
      .is('unsubscribed_at', null)
    if (supErr && supErr.code !== '42P01') {
      console.error('[resend-webhook] suppression failed:', supErr.message)
    } else {
      suppressed = true
      console.log(`[resend-webhook] suppressed ${recipient} after ${event.type}`)
    }
  }

  return Response.json({ ok: true, type: event.type, suppressed })
}
