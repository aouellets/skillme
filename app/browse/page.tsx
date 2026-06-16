import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BrowseClient } from './BrowseClient'
import { isCategory } from '@/lib/categories'
import type { SkillCategory } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Search and filter the SkillShelf catalog of curated Claude skills.',
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params = await searchParams
  const initialCategory: SkillCategory | 'all' =
    params.category && isCategory(params.category) ? params.category : 'all'
  const initialQuery = params.q ?? ''

  return (
    <Suspense fallback={null}>
      <BrowseClient initialCategory={initialCategory} initialQuery={initialQuery} />
    </Suspense>
  )
}
