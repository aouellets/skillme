import { NextRequest } from 'next/server'
import { getUserToken } from '@/lib/userToken'
import { setCollectionPublic, deleteCollection } from '@/lib/collections'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH /api/collections/[id] — toggle public sharing { public: boolean }.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getUserToken()
  if (!token) return Response.json({ error: 'Sign in required.' }, { status: 401 })

  const { id } = await params
  let body: { public?: boolean }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  if (typeof body.public !== 'boolean') {
    return Response.json({ error: 'A boolean public flag is required.' }, { status: 400 })
  }

  const shareToken = await setCollectionPublic(id, token, body.public)
  if (!shareToken) return Response.json({ error: 'Could not update the collection.' }, { status: 500 })

  return Response.json({ ok: true, public: body.public, share_token: shareToken })
}

// DELETE /api/collections/[id] — delete a collection the user owns.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getUserToken()
  if (!token) return Response.json({ error: 'Sign in required.' }, { status: 401 })

  const { id } = await params
  const ok = await deleteCollection(id, token)
  if (!ok) return Response.json({ error: 'Could not delete the collection.' }, { status: 500 })

  return Response.json({ ok: true })
}
