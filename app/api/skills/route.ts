import { NextRequest } from 'next/server'
import { getSkills, type SortOption } from '@/lib/data'
import { isCategory } from '@/lib/categories'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SORTS: SortOption[] = ['trending', 'newest', 'top_rated']

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
    const { skills, total } = await getSkills({
      query,
      category,
      sort,
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 48) : 12,
      offset: Number.isFinite(offset) ? Math.max(offset, 0) : 0,
    })

    // Strip full skill_content from list responses to keep payloads small.
    const summary = skills.map(({ skill_content, ...rest }) => {
      void skill_content
      return rest
    })

    return Response.json({ skills: summary, total })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message, skills: [], total: 0 }, { status: 500 })
  }
}
