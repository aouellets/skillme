import { NextRequest } from 'next/server'
import { getAdminEmail } from '@/lib/admin'
import { getServiceSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** url-safe slug from a skill name, max 60 chars. */
function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'skill'
  )
}

/** Find a slug not already used by the skills table. */
async function uniqueSlug(
  supabase: NonNullable<ReturnType<typeof getServiceSupabase>>,
  base: string
): Promise<string> {
  let slug = base
  for (let n = 2; n < 100; n++) {
    const { data } = await supabase.from('skills').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    slug = `${base}-${n}`
  }
  return `${base}-${Date.now()}`
}

// GET /api/admin/submissions?status=pending — list submissions for review.
export async function GET(req: NextRequest) {
  const admin = await getAdminEmail()
  if (!admin) return Response.json({ error: 'Not authorized.' }, { status: 403 })

  const supabase = getServiceSupabase()
  if (!supabase) return Response.json({ error: 'Database not configured.' }, { status: 503 })

  const status = req.nextUrl.searchParams.get('status')

  let q = supabase
    .from('skill_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (status) q = q.eq('status', status)
  else q = q.in('status', ['pending', 'in_review', 'needs_changes'])

  const { data, error } = await q
  if (error) {
    if (error.code === '42P01') return Response.json({ submissions: [] })
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ submissions: data ?? [] })
}

interface ActionBody {
  id?: string
  action?: 'approve' | 'reject' | 'needs_changes'
  note?: string
  // Optional reviewer overrides applied at publish time.
  featured?: boolean
  featured_rank?: number | null
}

// POST /api/admin/submissions — approve / reject / request changes.
export async function POST(req: NextRequest) {
  const admin = await getAdminEmail()
  if (!admin) return Response.json({ error: 'Not authorized.' }, { status: 403 })

  const supabase = getServiceSupabase()
  if (!supabase) return Response.json({ error: 'Database not configured.' }, { status: 503 })

  let body: ActionBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.id || !body.action) {
    return Response.json({ error: 'An id and action are required.' }, { status: 400 })
  }

  const { data: sub, error: loadErr } = await supabase
    .from('skill_submissions')
    .select('*')
    .eq('id', body.id)
    .single()

  if (loadErr || !sub) {
    return Response.json({ error: 'Submission not found.' }, { status: 404 })
  }

  const now = new Date().toISOString()

  if (body.action === 'reject' || body.action === 'needs_changes') {
    const status = body.action === 'reject' ? 'rejected' : 'needs_changes'
    const { error } = await supabase
      .from('skill_submissions')
      .update({ status, reviewer_note: body.note ?? null, reviewed_at: now, updated_at: now })
      .eq('id', body.id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true, status })
  }

  // action === 'approve' → publish into the live catalog.
  if (sub.published_skill_id) {
    return Response.json({ ok: true, status: 'approved', skill_id: sub.published_skill_id })
  }

  const slug = await uniqueSlug(supabase, slugify(sub.name))
  const featured = body.featured ?? false

  const { data: skill, error: insertErr } = await supabase
    .from('skills')
    .insert({
      slug,
      name: sub.name,
      description: sub.description,
      category: sub.category,
      subcategory: sub.subcategory ?? null,
      source_url: sub.source_url ?? null,
      author: sub.author ?? null,
      skill_content: sub.skill_content,
      tags: sub.tags ?? [],
      thumbnail_url: sub.thumbnail_url ?? null,
      media_alt: sub.media_alt ?? null,
      verified: true, // human-reviewed
      featured,
      featured_rank: featured ? (body.featured_rank ?? null) : null,
      free: true,
    })
    .select('id, slug')
    .single()

  if (insertErr || !skill) {
    return Response.json(
      { error: insertErr?.message ?? 'Failed to publish skill.' },
      { status: 500 }
    )
  }

  const { error: updErr } = await supabase
    .from('skill_submissions')
    .update({
      status: 'approved',
      reviewer_note: body.note ?? null,
      reviewed_at: now,
      updated_at: now,
      published_skill_id: skill.id,
    })
    .eq('id', body.id)

  if (updErr) {
    console.error('[admin] submission update failed after publish:', updErr.message)
  }

  return Response.json({ ok: true, status: 'approved', skill_id: skill.id, slug: skill.slug })
}
