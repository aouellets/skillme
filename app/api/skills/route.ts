import { NextRequest } from 'next/server'
import { getSkills, getRelatedSkills, type SortOption } from '@/lib/data'
import { isCategory } from '@/lib/categories'
import type { Skill } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SORTS: SortOption[] = ['trending', 'newest', 'top_rated', 'hot']

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  const query = params.get('q') ?? undefined
  const categoryParam = params.get('category') ?? undefined
  const sortParam = params.get('sort') ?? 'trending'
  const limit = Number(params.get('limit') ?? 12)
  const offset = Number(params.get('offset') ?? 0)

  const category =
    categoryParam && isCategory(categoryParam) ? categoryParam : undefined
  const sort = (SORTS.includes(sortParam as SortOption) ? sortParam : 'trending') as SortOption

  try {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 48) : 12
    const safeOffset = Number.isFinite(offset) ? Math.max(offset, 0) : 0

    const { skills, total } = await getSkills({
      query,
      category,
      sort,
      limit: safeLimit,
      offset: safeOffset,
    })

    // Strip full skill_content from list responses to keep payloads small.
    const strip = (s: Skill) => {
      const { skill_content, ...rest } = s
      void skill_content
      return rest
    }
    const summary = skills.map(strip)

    // Semantic recall safety net: when a keyword search doesn't even fill the
    // first page, surface the closest embedding matches as "related" so
    // vocabulary-gap queries (e.g. "issue tracker") aren't a dead end. Gated to
    // the first page, an uncategorised search, and a sparse result set so the
    // extra embedding call only fires when it can actually help.
    let related: ReturnType<typeof strip>[] = []
    if (query?.trim() && safeOffset === 0 && !category && total < safeLimit) {
      const rel = await getRelatedSkills(query, {
        excludeIds: skills.map((s) => s.id),
        limit: 6,
      })
      related = rel.map(strip)
    }

    return Response.json({ skills: summary, total, related })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message, skills: [], total: 0 }, { status: 500 })
  }
}
