'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { Reveal } from '@/components/Reveal'
import { SearchBar } from '@/components/SearchBar'
import { PACK_CATEGORIES } from '@/lib/categories'
import type { Pack, PackCategory } from '@/lib/types'

const PAGE_SIZE = 24

const GRID =
  'grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

export function PacksClient({
  officialPacks,
  initialQuery,
  initialCategory,
}: {
  officialPacks: Pack[]
  initialQuery: string
  initialCategory: PackCategory | 'all'
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<PackCategory | 'all'>(initialCategory)

  const [packs, setPacks] = useState<Pack[]>([])
  const [related, setRelated] = useState<Pack[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestId = useRef(0)

  // When neither a search nor a category filter is active we're in the curated
  // landing view: official showcase up top, the rest below. Any active filter
  // collapses to a single flat results grid that spans all packs.
  const isFiltering = query.trim() !== '' || category !== 'all'

  const fetchPage = useCallback(
    async (offset: number, replace: boolean) => {
      const current = ++requestId.current
      if (replace) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category !== 'all') params.set('category', category)
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(offset))

      try {
        const res = await fetch(`/api/packs?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to load packs')
        const data: { packs: Pack[]; total: number; related?: Pack[] } = await res.json()
        if (current !== requestId.current) return // stale response
        setTotal(data.total)
        setPacks((prev) => (replace ? data.packs : [...prev, ...data.packs]))
        // `related` is only computed for the first page; preserve it on load-more.
        if (replace) setRelated(data.related ?? [])
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
    [query, category]
  )

  // Reload from the top whenever the query or category changes.
  useEffect(() => {
    fetchPage(0, true)
  }, [fetchPage])

  // Keep the query/category reflected in the URL for shareable links.
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (query) params.set('q', query)
    else params.delete('q')
    if (category === 'all') params.delete('category')
    else params.set('category', category)
    const qs = params.toString()
    router.replace(qs ? `/packs?${qs}` : '/packs', { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category])

  // In the default (unfiltered) view the official packs already have their own
  // showcase, so drop them from the main grid to avoid listing them twice.
  const officialSlugs = new Set(officialPacks.map((p) => p.slug))
  const gridPacks = isFiltering ? packs : packs.filter((p) => !officialSlugs.has(p.slug))
  const hasMore = packs.length < total

  const filters: Array<{ value: PackCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    ...PACK_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
  ]

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Curated bundles</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shelf-text-primary">
            Skill packs
          </h1>
          <p className="mt-3 max-w-xl text-shelf-text-secondary">
            {total > 0
              ? `${total} pack${total !== 1 ? 's' : ''}. Install a themed set of skills in one command.`
              : 'Themed bundles of curated Claude skills, installed together.'}
          </p>
        </div>
        <Link
          href="/browse"
          className="text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
        >
          Browse individual skills →
        </Link>
      </div>

      {/* Install hint */}
      <div className="mt-4 card flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="font-mono text-xs text-shelf-text-tertiary">
          Install a full pack in Claude: say{' '}
          <span className="text-accent">&quot;install the [Pack Name] pack&quot;</span>
        </div>
        <Link href="/connect" className="btn btn-primary flex-shrink-0 sm:ml-auto">
          Connect to Claude
        </Link>
      </div>

      {/* Search + category filters */}
      <div className="mt-8 space-y-5">
        <div className="max-w-md">
          <SearchBar
            initialValue={initialQuery}
            placeholder="Search packs…"
            onSearch={setQuery}
          />
        </div>

        <div
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="tablist"
          aria-label="Filter packs by category"
        >
          {filters.map((item) => {
            const isActive = category === item.value
            return (
              <button
                key={item.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(item.value)}
                className={`chip shrink-0 ${isActive ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            )
          })}
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
        ) : isFiltering ? (
          // Filtered view: a single flat results grid (+ semantic related set).
          gridPacks.length === 0 && related.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-shelf-text-primary">
                No packs found{query ? ` for "${query}"` : ''}.
              </p>
              <p className="mt-1 text-sm text-shelf-text-secondary">
                Try a broader search or a different category.
              </p>
            </div>
          ) : (
            <>
              {gridPacks.length > 0 && (
                <>
                  <div className={GRID}>
                    {gridPacks.map((pack, i) => (
                      <Reveal key={pack.id} index={i} className="h-full">
                        <PackCard pack={pack} />
                      </Reveal>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => fetchPage(packs.length, false)}
                        disabled={loadingMore}
                        className="btn btn-secondary"
                      >
                        {loadingMore ? 'Loading…' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {related.length > 0 && (
                <div className={gridPacks.length > 0 ? 'mt-12' : ''}>
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-lg font-semibold text-shelf-text-primary">
                      {gridPacks.length > 0
                        ? 'Related matches'
                        : 'No exact matches — related packs'}
                    </h2>
                    <span className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
                      Semantic
                    </span>
                  </div>
                  <div className={`mt-5 ${GRID}`}>
                    {related.map((pack, i) => (
                      <Reveal key={pack.id} index={i} className="h-full">
                        <PackCard pack={pack} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          // Default view: curated official showcase + all other packs.
          <>
            {officialPacks.length > 0 && (
              <section>
                <div className="max-w-xl">
                  <h2 className="font-display text-xl font-semibold text-shelf-text-primary">
                    Straight from the source
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                    Official packs published by the teams who build the tools — Anthropic,
                    OpenAI, Google, Vercel, Microsoft, Stripe, Supabase, Sentry, HashiCorp,
                    and more.
                  </p>
                </div>
                <div className={`mt-6 ${GRID}`}>
                  {officialPacks.map((pack, i) => (
                    <Reveal key={pack.id} index={i} className="h-full">
                      <PackCard pack={pack} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {gridPacks.length > 0 && (
              <section className={officialPacks.length > 0 ? 'mt-12' : ''}>
                {officialPacks.length > 0 && (
                  <h2 className="font-display text-xl font-semibold text-shelf-text-primary">
                    All packs
                  </h2>
                )}
                <div className={`mt-6 ${GRID}`}>
                  {gridPacks.map((pack, i) => (
                    <Reveal key={pack.id} index={i} className="h-full">
                      <PackCard pack={pack} />
                    </Reveal>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => fetchPage(packs.length, false)}
                      disabled={loadingMore}
                      className="btn btn-secondary"
                    >
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className={GRID}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card animate-pulse overflow-hidden">
          <div className="aspect-[16/9] w-full bg-shelf-elevated" />
          <div className="p-3.5 sm:p-5">
            <div className="h-4 w-2/3 rounded-xs bg-shelf-elevated" />
            <div className="mt-3 h-3 w-full rounded-xs bg-shelf-elevated" />
            <div className="mt-2 h-3 w-5/6 rounded-xs bg-shelf-elevated" />
            <div className="mt-4 h-3 w-1/3 rounded-xs bg-shelf-elevated" />
          </div>
        </div>
      ))}
    </div>
  )
}
