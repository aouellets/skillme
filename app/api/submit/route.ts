import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isCategory } from '@/lib/categories'
import { classifySafe } from '@/lib/safety'
import { checkRateLimit } from '@/lib/mcp/rateLimit'
import { sendEmail, sendAdminAlert, submissionReceivedEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SubmitBody {
  name?: string
  description?: string
  category?: string
  source_url?: string
  author?: string
  skill_content?: string
  tags?: string | string[]
  submitter_email?: string
  thumbnail_url?: string
  media_alt?: string
  // Honeypot — real users never fill this.
  website?: string
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function normalizeTags(tags: SubmitBody['tags']): string[] {
  const raw = Array.isArray(tags) ? tags : (tags ?? '').split(',')
  return raw
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8)
}

export async function POST(req: NextRequest) {
  // Light per-IP rate limit to deter spam (10/min, shared limiter).
  const rate = checkRateLimit(`submit:${clientIp(req)}`)
  if (!rate.ok) {
    return Response.json(
      { error: `Too many submissions. Try again in ${rate.retryAfter}s.` },
      { status: 429 }
    )
  }

  let body: SubmitBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot: silently accept bots without writing anything.
  if (body.website && body.website.trim()) {
    return Response.json({ ok: true, status: 'pending' })
  }

  const name = body.name?.trim()
  const description = body.description?.trim()
  const category = body.category?.trim()
  const skill_content = body.skill_content?.trim()

  if (!name || name.length < 2 || name.length > 80) {
    return Response.json({ error: 'A skill name (2–80 chars) is required.' }, { status: 400 })
  }
  if (!description || description.length < 10) {
    return Response.json(
      { error: 'A one-sentence description (at least 10 chars) is required.' },
      { status: 400 }
    )
  }
  if (!category || !isCategory(category)) {
    return Response.json({ error: 'A valid category is required.' }, { status: 400 })
  }
  if (!skill_content || skill_content.length < 80) {
    return Response.json(
      { error: 'SKILL.md content looks too short — write real instructions, not a stub.' },
      { status: 400 }
    )
  }

  const email = body.submitter_email?.trim().toLowerCase() || null
  if (email && !email.includes('@')) {
    return Response.json({ error: 'That email address looks invalid.' }, { status: 400 })
  }

  // Best-effort automated safety + metadata pass. Never blocks the submission —
  // everything lands in the review queue regardless of verdict.
  const safety = await classifySafe(skill_content)

  const supabase = getServiceSupabase()
  if (!supabase) {
    return Response.json(
      { error: 'Submissions are temporarily unavailable. Please try the GitHub option.' },
      { status: 503 }
    )
  }

  const { error } = await supabase.from('skill_submissions').insert({
    status: 'pending',
    name,
    description,
    category,
    source_url: body.source_url?.trim() || null,
    author: body.author?.trim() || null,
    skill_content,
    tags: normalizeTags(body.tags),
    thumbnail_url: body.thumbnail_url?.trim() || null,
    media_alt: body.media_alt?.trim() || null,
    submitter_email: email,
    safety_verdict: safety.verdict,
    safety_reason: safety.reason,
    classifier_model: safety.model,
  })

  if (error) {
    // 42P01 = table missing (DB not migrated yet) — guide the user elsewhere.
    if (error.code === '42P01') {
      return Response.json(
        { error: 'Submissions are not enabled yet. Please use the GitHub option below.' },
        { status: 503 }
      )
    }
    console.error('[submit] insert error:', error.message)
    return Response.json({ error: 'Could not save your submission. Try again.' }, { status: 500 })
  }

  // Best-effort notifications — never block or fail the response on a mail error.
  if (email) {
    const tpl = submissionReceivedEmail(name, 'skill')
    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  }
  await sendAdminAlert(`New skill submission: ${name}`, [
    `Category: ${category}`,
    `Author: ${body.author?.trim() || '—'}`,
    `From: ${email ?? '(no email)'}`,
    `Safety: ${safety.verdict}${safety.reason ? ` — ${safety.reason}` : ''}`,
    `Review it: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/submissions`,
  ])

  return Response.json({
    ok: true,
    status: 'pending',
    message:
      'Submitted! Your skill is in the review queue. We check for safety and quality, then publish — usually within 1–3 days.',
  })
}
