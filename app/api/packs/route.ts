import { NextRequest } from 'next/server'
import { getPacks, getRelatedPacks } from '@/lib/packs'
import { isPackCategory } from '@/lib/categories'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  const query = params.get('q') ?? undefined
  const categoryParam = params.get('category') ?? undefined
  const limit = Number(params.get('limit') ?? 24)
  const offset = Number(params.get('offset') ?? 0)

  const category =
    categoryParam && isPackCategory(categoryParam) ? categoryParam : undefined

  try {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 96) : 24
    const safeOffset = Number.isFinite(offset) ? Math.max(offset, 0) : 0

    const { packs, total } = await getPacks({
      query,
      category,
      limit: safeLimit,
      offset: safeOffset,
    })

    // Semantic recall safety net for sparse keyword results — see the skills route.
    let related: typeof packs = []
    if (query?.trim() && safeOffset === 0 && !category && total < safeLimit) {
      related = await getRelatedPacks(query, {
        excludeIds: packs.map((p) => p.id),
        limit: 4,
      })
    }

    return Response.json({ packs, total, related })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message, packs: [], total: 0 }, { status: 500 })
  }
}
