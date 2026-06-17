import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BrowseClient } from './BrowseClient'
import { isCategory } from '@/lib/categories'
import type { SkillCategory } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse Skills',
  description:
    'Search 300+ curated Claude skills by category. Coding, writing, research, productivity, data, design, business, and personal skills, all installable directly from Claude.',
  openGraph: {
    title: 'Browse Claude Skills · SkillShelf',
    description: '300+ curated skills. Search, filter, install from inside Claude.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Claude Skills · SkillShelf',
    description: '300+ curated skills. Search, filter, install from inside Claude.',
  },
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
