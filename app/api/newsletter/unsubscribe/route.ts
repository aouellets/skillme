import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { verifyUnsubscribe } from '@/lib/email'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One-click newsletter unsubscribe. Linked from the digest footer and the
 * List-Unsubscribe header. The token is HMAC(email) (see lib/email/unsubscribe),
 * so the link is self-validating — a recipient can only unsubscribe their own
 * address. We soft-unsubscribe (set unsubscribed_at) rather than delete.
 *
 * Supports GET (footer link → HTML confirmation) and POST (RFC 8058 one-click
 * List-Unsubscribe-Post → 200, no body).
 */
async function unsubscribe(email: string, token: string): Promise<'ok' | 'invalid' | 'error'> {
  const normalized = email.trim().toLowerCase()
  if (!verifyUnsubscribe(normalized, token)) return 'invalid'

  const supabase = getServiceSupabase()
  if (!supabase) return 'error'

  const { error } = await supabase
    .from('newsletter_signups')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('email', normalized)

  // 42P01 = table missing — treat as success (nothing to unsubscribe from).
  if (error && error.code !== '42P01') {
    console.error('[unsubscribe] update error:', error.message)
    return 'error'
  }
  return 'ok'
}

function page(title: string, message: string, status: number): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Skill Me</title></head>
<body style="margin:0;background:#080a0a;color:#f5f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="max-width:440px;margin:0 auto;padding:64px 24px;text-align:center;">
<div style="font-size:18px;font-weight:700;margin-bottom:24px;">Skill<span style="color:#b4f33e;"> Me</span></div>
<h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
<p style="font-size:15px;line-height:1.6;color:#9ba29d;margin:0 0 24px;">${message}</p>
<a href="${SITE_URL}/browse" style="display:inline-block;padding:11px 22px;border-radius:8px;background:#b4f33e;color:#0a1400;font-weight:700;text-decoration:none;font-size:14px;">Browse Skill Me</a>
</div></body></html>`
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8' } })
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') ?? ''
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const result = await unsubscribe(email, token)

  if (result === 'invalid') {
    return page('Link expired', "This unsubscribe link isn't valid. If you keep receiving emails, reply and we'll remove you.", 400)
  }
  if (result === 'error') {
    return page('Something went wrong', 'We couldn\'t process that just now. Please try again in a moment.', 503)
  }
  return page('You\'re unsubscribed', "You won't receive any more Skill Me newsletter emails. You can resubscribe anytime from the site.", 200)
}

// RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). Mail clients POST here.
export async function POST(req: NextRequest) {
  let email = req.nextUrl.searchParams.get('email') ?? ''
  let token = req.nextUrl.searchParams.get('token') ?? ''
  if (!email || !token) {
    // Some clients send the params in the form body instead of the query.
    const form = await req.formData().catch(() => null)
    email = email || String(form?.get('email') ?? '')
    token = token || String(form?.get('token') ?? '')
  }
  const result = await unsubscribe(email, token)
  return Response.json({ ok: result === 'ok' }, { status: result === 'ok' ? 200 : 400 })
}
