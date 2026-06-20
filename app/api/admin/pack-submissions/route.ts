import { NextRequest } from 'next/server'
import { getAdminEmail } from '@/lib/admin'
import { getServiceSupabase } from '@/lib/supabase'
import { sendEmail, submissionDecisionEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** url-safe slug from a pack name, max 60 chars. */
function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'pack'
  )
}

async function uniqueSlug(
  supabase: NonNullable<ReturnType<typeof getServiceSupabase>>,
  base: string
): Promise<string> {
  let slug = base
  for (let n = 2; n < 100; n++) {
    const { data } = await supabase.from('packs').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    slug = `${base}-${n}`
  }
  return `${base}-${Date.now()}`
}

// GET /api/admin/pack-submissions?status=pending — list for review.
export async function GET(req: NextRequest) {
  const admin = await getAdminEmail()
  if (!admin) return Response.json({ error: 'Not authorized.' }, { status: 403 })

  const supabase = getServiceSupabase()
  if (!supabase) return Response.json({ error: 'Database not configured.' }, { status: 503 })

  const status = req.nextUrl.searchParams.get('status')
  let q = supabase
    .from('pack_submissions')
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
  featured?: boolean
}

// POST /api/admin/pack-submissions — approve / reject / request changes.
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
    .from('pack_submissions')
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
      .from('pack_submissions')
      .update({ status, reviewer_note: body.note ?? null, reviewed_at: now, updated_at: now })
      .eq('id', body.id)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    if (sub.submitter_email) {
      const tpl = submissionDecisionEmail({
        name: sub.name,
        kind: 'pack',
        decision: body.action === 'reject' ? 'rejected' : 'needs_changes',
        note: body.note,
      })
      await sendEmail({ to: sub.submitter_email, subject: tpl.subject, html: tpl.html, text: tpl.text })
    }

    return Response.json({ ok: true, status })
  }

  // action === 'approve' → publish into the live catalog.
  if (sub.published_pack_id) {
    return Response.json({ ok: true, status: 'approved', pack_id: sub.published_pack_id })
  }

  // Resolve skill slugs → ids, preserving submission order.
  const slugs: string[] = sub.skill_slugs ?? []
  const { data: skillRows } = await supabase.from('skills').select('id, slug').in('slug', slugs)
  const idBySlug = new Map((skillRows ?? []).map((r) => [r.slug as string, r.id as string]))
  const orderedIds = slugs.map((s) => idBySlug.get(s)).filter((id): id is string => Boolean(id))

  if (orderedIds.length < 2) {
    return Response.json(
      { error: 'Fewer than 2 of the referenced skills still exist in the catalog.' },
      { status: 400 }
    )
  }

  const slug = await uniqueSlug(supabase, slugify(sub.name))

  const { data: pack, error: insertErr } = await supabase
    .from('packs')
    .insert({
      slug,
      name: sub.name,
      tagline: sub.tagline,
      description: sub.description,
      author: sub.author ?? 'Community',
      author_url: sub.author_url ?? null,
      category: sub.category,
      tags: sub.tags ?? [],
      thumbnail_url: sub.thumbnail_url ?? null,
      media_alt: sub.media_alt ?? null,
      verified: true,
      featured: body.featured ?? false,
      free: true,
    })
    .select('id, slug')
    .single()

  if (insertErr || !pack) {
    return Response.json(
      { error: insertErr?.message ?? 'Failed to publish pack.' },
      { status: 500 }
    )
  }

  const packSkills = orderedIds.map((skill_id, position) => ({
    pack_id: pack.id,
    skill_id,
    position,
  }))
  const { error: psErr } = await supabase.from('pack_skills').insert(packSkills)
  if (psErr) {
    console.error('[admin] pack_skills insert failed after pack create:', psErr.message)
    return Response.json({ error: 'Pack created but adding skills failed.' }, { status: 500 })
  }

  const { error: updErr } = await supabase
    .from('pack_submissions')
    .update({
      status: 'approved',
      reviewer_note: body.note ?? null,
      reviewed_at: now,
      updated_at: now,
      published_pack_id: pack.id,
    })
    .eq('id', body.id)
  if (updErr) {
    console.error('[admin] pack submission update failed after publish:', updErr.message)
  }

  if (sub.submitter_email) {
    const tpl = submissionDecisionEmail({
      name: sub.name,
      kind: 'pack',
      decision: 'approved',
      note: body.note,
      url: `${SITE_URL}/pack/${pack.slug}`,
    })
    await sendEmail({ to: sub.submitter_email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  }

  return Response.json({ ok: true, status: 'approved', pack_id: pack.id, slug: pack.slug })
}
