import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/mcp/rateLimit'
import { sendEmail, newsletterWelcomeEmail, addAudienceContact } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: NextRequest) {
  // Per-IP rate limit to deter signup spam (10/min, shared limiter).
  const rate = checkRateLimit(`newsletter:${clientIp(req)}`)
  if (!rate.ok) {
    return Response.json(
      { error: `Too many requests. Try again in ${rate.retryAfter}s.` },
      { status: 429 }
    )
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  // Store the signup. We never reveal DB state to the caller — signing up is
  // always reported as success so the form can't be used to probe membership.
  // `isNew` gates the welcome email so repeat submits don't re-welcome (and so
  // the form can't be used to spam an inbox via repeated POSTs).
  let isNew = true
  const supabase = getServiceSupabase()
  if (supabase) {
    const { data: existing } = await supabase
      .from('newsletter_signups')
      .select('email')
      .eq('email', email)
      .maybeSingle()
    isNew = !existing

    const { error } = await supabase
      .from('newsletter_signups')
      .upsert({ email, created_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error && error.code !== '42P01') {
      // 42P01 = table doesn't exist yet — graceful fallback
      console.error('[newsletter] upsert error:', error.message)
    }
  }

  console.log('[newsletter] signup:', email)

  // Best-effort sync to the Resend broadcast audience. Runs on every signup
  // (Resend dedupes per audience) so pre-existing Supabase rows backfill on a
  // resubmit. Never sends mail and never blocks success.
  await addAudienceContact(email)

  // Best-effort welcome — only on a genuinely new signup; never blocks success.
  if (isNew) {
    const tpl = newsletterWelcomeEmail()
    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  }

  return Response.json({
    ok: true,
    message: "You're subscribed. We'll email you when new skills and packs drop.",
  })
}
