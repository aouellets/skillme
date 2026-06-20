import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isPackCategory } from '@/lib/categories'
import { checkRateLimit } from '@/lib/mcp/rateLimit'
import { sendEmail, sendAdminAlert, submissionReceivedEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PackSubmitBody {
  name?: string
  tagline?: string
  description?: string
  author?: string
  author_url?: string
  category?: string
  tags?: string | string[]
  skill_slugs?: string[]
  submitter_email?: string
  // Honeypot — real users never fill this.
  website?: string
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function normalizeTags(tags: PackSubmitBody['tags']): string[] {
  const raw = Array.isArray(tags) ? tags : (tags ?? '').split(',')
  return raw
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8)
}

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(`submit-pack:${clientIp(req)}`)
  if (!rate.ok) {
    return Response.json(
      { error: `Too many submissions. Try again in ${rate.retryAfter}s.` },
      { status: 429 }
    )
  }

  let body: PackSubmitBody
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
  const tagline = body.tagline?.trim()
  const description = body.description?.trim()
  const category = body.category?.trim()
  const slugs = Array.isArray(body.skill_slugs)
    ? Array.from(new Set(body.skill_slugs.map((s) => s.trim()).filter(Boolean)))
    : []

  if (!name || name.length < 2 || name.length > 80) {
    return Response.json({ error: 'A pack name (2–80 chars) is required.' }, { status: 400 })
  }
  if (!tagline || tagline.length < 5) {
    return Response.json({ error: 'A one-line tagline (at least 5 chars) is required.' }, { status: 400 })
  }
  if (!description || description.length < 10) {
    return Response.json({ error: 'A description (at least 10 chars) is required.' }, { status: 400 })
  }
  if (!category || !isPackCategory(category)) {
    return Response.json({ error: 'A valid category is required.' }, { status: 400 })
  }
  if (slugs.length < 2) {
    return Response.json({ error: 'A pack needs at least 2 skills.' }, { status: 400 })
  }

  const email = body.submitter_email?.trim().toLowerCase() || null
  if (email && !email.includes('@')) {
    return Response.json({ error: 'That email address looks invalid.' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  if (!supabase) {
    return Response.json(
      { error: 'Submissions are temporarily unavailable. Please try the GitHub option.' },
      { status: 503 }
    )
  }

  // Validate that every referenced skill exists, so the submitter gets clear
  // feedback now rather than a silent drop at approval time.
  const { data: found } = await supabase.from('skills').select('slug').in('slug', slugs)
  const knownSlugs = new Set((found ?? []).map((r) => r.slug as string))
  const missing = slugs.filter((s) => !knownSlugs.has(s))
  if (missing.length > 0) {
    return Response.json(
      { error: `These skills aren't in the catalog: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  const { error } = await supabase.from('pack_submissions').insert({
    status: 'pending',
    name,
    tagline,
    description,
    author: body.author?.trim() || null,
    author_url: body.author_url?.trim() || null,
    category,
    tags: normalizeTags(body.tags),
    skill_slugs: slugs,
    submitter_email: email,
  })

  if (error) {
    if (error.code === '42P01') {
      return Response.json(
        { error: 'Pack submissions are not enabled yet. Please use the GitHub option.' },
        { status: 503 }
      )
    }
    console.error('[submit-pack] insert error:', error.message)
    return Response.json({ error: 'Could not save your submission. Try again.' }, { status: 500 })
  }

  // Best-effort notifications — never block or fail the response on a mail error.
  if (email) {
    const tpl = submissionReceivedEmail(name, 'pack')
    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  }
  await sendAdminAlert(`New pack submission: ${name}`, [
    `Tagline: ${tagline}`,
    `Category: ${category}`,
    `Skills (${slugs.length}): ${slugs.join(', ')}`,
    `From: ${email ?? '(no email)'}`,
    `Review it: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/packs`,
  ])

  return Response.json({
    ok: true,
    status: 'pending',
    message:
      'Submitted! Your pack is in the review queue. We review curation and quality, then publish — usually within 1–3 days.',
  })
}
