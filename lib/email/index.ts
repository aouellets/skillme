import 'server-only'
import { adminAlertEmail } from './builders'

/**
 * Transactional email + ops alerts via Resend (https://resend.com).
 *
 * Uses the Resend REST API directly over fetch — no SDK dependency, matching the
 * project's other integrations (lib/github.ts, scripts/setup-email-forwarding.ts).
 *
 * Every send is best-effort: if RESEND_API_KEY is unset or Resend errors, we log
 * and return { ok: false } rather than throwing, so a mail failure never breaks
 * a submission, an approval, or a signup.
 *
 * The look of every email lives in ./templates (the dark Skill Me design system);
 * the messages themselves are composed in ./builders and re-exported below.
 *
 * Env:
 *   RESEND_API_KEY   API key (required to actually send; sending is a no-op without it)
 *   EMAIL_FROM       From header, default "Skill Me <noreply@skillme.dev>"
 *                    (skillme.dev is the verified sending domain in Resend)
 *   EMAIL_REPLY_TO   Reply-To header, default "support@skillme.dev"
 *   ALERT_EMAIL      Where ops alerts go; falls back to the first ADMIN_EMAILS entry
 *   RESEND_AUDIENCE_ID  Audience that newsletter signups are added to
 *                    (addAudienceContact); audience sync is a no-op when unset
 */

const RESEND_API = 'https://api.resend.com/emails'

const DEFAULT_FROM = 'Skill Me <noreply@skillme.dev>'
const DEFAULT_REPLY_TO = 'support@skillme.dev'

function apiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined
}

/** True when email sending is configured. */
export function isEmailEnabled(): boolean {
  return Boolean(apiKey())
}

function fromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM
}

function replyToAddress(): string {
  return process.env.EMAIL_REPLY_TO?.trim() || DEFAULT_REPLY_TO
}

/** Resend audience that newsletter signups are added to (broadcast list). */
function audienceId(): string | undefined {
  return process.env.RESEND_AUDIENCE_ID?.trim() || undefined
}

/** Destination for internal ops alerts (new submissions, etc.). */
function alertAddress(): string | null {
  const explicit = process.env.ALERT_EMAIL?.trim()
  if (explicit) return explicit
  const firstAdmin = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)[0]
  return firstAdmin || null
}

export interface SendResult {
  ok: boolean
  id?: string
  error?: string
}

interface SendArgs {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

/**
 * Send one email. Never throws — returns { ok: false, error } on any failure so
 * callers can fire-and-await without a try/catch.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<SendResult> {
  const key = apiKey()
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping send:', subject)
    return { ok: false, error: 'not_configured' }
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        reply_to: replyTo ?? replyToAddress(),
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[email] Resend ${res.status} for "${subject}": ${detail}`)
      return { ok: false, error: `http_${res.status}` }
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: data.id }
  } catch (e) {
    console.error('[email] send failed:', e instanceof Error ? e.message : e)
    return { ok: false, error: 'exception' }
  }
}

/**
 * Send an internal ops alert to ALERT_EMAIL. No-op (logged) when no alert
 * address is configured.
 */
export async function sendAdminAlert(subject: string, bodyLines: string[]): Promise<SendResult> {
  const to = alertAddress()
  if (!to) {
    console.warn('[email] no ALERT_EMAIL/ADMIN_EMAILS — skipping alert:', subject)
    return { ok: false, error: 'no_recipient' }
  }
  const { subject: full, html, text } = adminAlertEmail(subject, bodyLines)
  return sendEmail({ to, subject: full, html, text })
}

/**
 * Add a contact to the Resend audience (the broadcast list). Best-effort like
 * every other call here: a no-op when RESEND_API_KEY or RESEND_AUDIENCE_ID is
 * unset, and never throws. Resend dedupes by email within an audience, so this
 * is safe to call on every signup; a contact that already exists is treated as
 * success. Adding a contact never sends mail — broadcasts stay separately gated.
 */
export async function addAudienceContact(email: string): Promise<SendResult> {
  const key = apiKey()
  const audience = audienceId()
  if (!key || !audience) {
    return { ok: false, error: 'not_configured' }
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[email] Resend audience add ${res.status} for ${email}: ${detail}`)
      return { ok: false, error: `http_${res.status}` }
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: data.id }
  } catch (e) {
    console.error('[email] audience add failed:', e instanceof Error ? e.message : e)
    return { ok: false, error: 'exception' }
  }
}

// Public template surface — builders + types.
export {
  newsletterWelcomeEmail,
  newsletterDigestEmail,
  submissionReceivedEmail,
  submissionDecisionEmail,
  adminAlertEmail,
  type DigestInput,
  type EmailParts,
  type SubmissionKind,
  type Decision,
} from './builders'
export type { SkillCardData, PackCardData } from './templates'
export { unsubscribeToken, verifyUnsubscribe, unsubscribeUrl } from './unsubscribe'
