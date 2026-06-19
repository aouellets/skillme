import { NextRequest } from 'next/server'
import { getUserToken } from '@/lib/userToken'
import { addSkillToCollection, removeSkillFromCollection } from '@/lib/collections'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/collections/[id]/skills — add or remove a skill.
// Body: { skill_id, action: 'add' | 'remove' }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getUserToken()
  if (!token) return Response.json({ error: 'Sign in required.' }, { status: 401 })

  const { id } = await params
  let body: { skill_id?: string; action?: 'add' | 'remove' }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.skill_id || (body.action !== 'add' && body.action !== 'remove')) {
    return Response.json(
      { error: "A skill_id and an action of 'add' or 'remove' are required." },
      { status: 400 }
    )
  }

  const ok =
    body.action === 'add'
      ? await addSkillToCollection(id, body.skill_id, token)
      : await removeSkillFromCollection(id, body.skill_id, token)

  if (!ok) {
    return Response.json(
      { error: 'Could not update the collection. Check it belongs to you.' },
      { status: 400 }
    )
  }

  return Response.json({ ok: true, action: body.action })
}
