'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SkillCard } from '@/components/SkillCard'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import type { Skill, SkillCategory } from '@/lib/types'

type SkillSummary = Omit<Skill, 'skill_content'>
type Sort = 'trending' | 'newest' | 'top_rated'

const PAGE_SIZE = 12
const SORTS: Array<{ value: Sort; label: string }> = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'top_rated', label: 'Top Rated' },
]

export function BrowseClient({
  initialCategory,
  initialQuery,
}: {
  initialCategory: SkillCategory | 'all'
  initialQuery: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<SkillCategory | 'all'>(initialCategory)
  const [sort, setSort] = useState<Sort>('trending')

  const [skills, setSkills] = useState<SkillSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestId = useRef(0)

  const fetchPage = useCallback(
    async (offset: number, replace: boolean) => {
      const current = ++requestId.current
      if (replace) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category !== 'all') params.set('category', category)
      params.set('sort', sort)
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(offset))

      try {
        const res = await fetch(`/api/skills?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to load skills')
        const data: { skills: SkillSummary[]; total: number } = await res.json()
        if (current !== requestId.current) return // stale response
        setTotal(data.total)
        setSkills((prev) => (replace ? data.skills : [...prev, ...data.skills]))
      } catch (err) {
        if (current !== requestId.current) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        if (current === requestId.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [query, category, sort]
  )

  // Reload from the top whenever the query, category, or sort changes.
  useEffect(() => {
    fetchPage(0, true)
  }, [fetchPage])

  // Keep the category reflected in the URL for shareable links.
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (category === 'all') params.delete('category')
    else params.set('category', category)
    const qs = params.toString()
    router.replace(qs ? `/browse?${qs}` : '/browse', { scroll: false })
    // Only react to category changes here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const hasMore = skills.length < total

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-shelf-text-primary">Browse skills</h1>
      <p className="mt-2 text-shelf-text-secondary">
        Search the catalog, filter by category, and install from inside Claude.
      </p>
      <p className="mt-2 text-xs text-shelf-text-tertiary">
        Install counts reflect community GitHub adoption data. Real-time installs
        via SkillShelf MCP are tracked separately and added daily.
      </p>

      <div className="mt-8 space-y-4">
        <div className="max-w-md">
          <SearchBar initialValue={initialQuery} onSearch={setQuery} />
        </div>

        <CategoryFilter active={category} onChange={setCategory} />

        <div className="flex items-center gap-2">
          <span className="text-xs text-shelf-text-tertiary">Sort</span>
          <div className="flex gap-1">
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                className={`rounded-btn border px-3 py-1 text-xs transition-colors ${
                  sort === s.value
                    ? 'border-accent-border bg-accent-dim text-accent-hover'
                    : 'border-shelf-border bg-shelf-surface text-shelf-text-secondary hover:text-shelf-text-primary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="text-shelf-text-secondary">{error}</p>
            <button onClick={() => fetchPage(0, true)} className="btn btn-secondary mt-4">
              Try again
            </button>
          </div>
        ) : skills.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-shelf-text-primary">
              No skills found{query ? ` for "${query}"` : ''}.
            </p>
            <p className="mt-1 text-sm text-shelf-text-secondary">Try a broader search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => fetchPage(skills.length, false)}
                  disabled={loadingMore}
                  className="btn btn-secondary"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-40 animate-pulse p-5">
          <div className="h-4 w-2/3 rounded bg-shelf-elevated" />
          <div className="mt-3 h-3 w-full rounded bg-shelf-elevated" />
          <div className="mt-2 h-3 w-5/6 rounded bg-shelf-elevated" />
        </div>
      ))}
    </div>
  )
}
