import { NextRequest } from 'next/server'
import { getUserToken } from '@/lib/userToken'
import {
  getUserCollections,
  createCollection,
  getCollectionIdsContainingSkill,
} from '@/lib/collections'
import { checkRateLimit } from '@/lib/mcp/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/collections           — list the user's collections.
// GET /api/collections?skill_id=  — also return which contain that skill.
export async function GET(req: NextRequest) {
  const token = await getUserToken()
  if (!token) return Response.json({ collections: [], member_of: [] })

  const collections = await getUserCollections(token)
  const skillId = req.nextUrl.searchParams.get('skill_id')
  const memberOf = skillId ? await getCollectionIdsContainingSkill(token, skillId) : []

  return Response.json({ collections, member_of: memberOf })
}

// POST /api/collections — create a collection { name, description? }.
export async function POST(req: NextRequest) {
  const token = await getUserToken()
  if (!token) return Response.json({ error: 'Sign in to create collections.' }, { status: 401 })

  const limit = checkRateLimit(`collections:${token}`)
  if (!limit.ok) {
    return Response.json({ error: `Too many requests. Try again in ${limit.retryAfter}s.` }, { status: 429 })
  }

  let body: { name?: string; description?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name || name.length < 1 || name.length > 60) {
    return Response.json({ error: 'A collection name (1–60 chars) is required.' }, { status: 400 })
  }

  const collection = await createCollection(token, name, body.description?.trim() || undefined)
  if (!collection) return Response.json({ error: 'Could not create the collection.' }, { status: 500 })

  return Response.json({ ok: true, collection })
}
