import type { Metadata } from 'next'
import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { getPacks, getPacksBySlugs } from '@/lib/packs'
import { PARTNER_STRIP } from '@/lib/partners'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Skill Packs',
  description:
    'Curated bundles of Claude skills. Install a themed set in one command. Solo Founder Stack, Engineering Workflow, Content Marketing Engine, and more.',
  openGraph: {
    title: 'Skill Packs · Skill Me',
    description: 'Install a full themed skill bundle in one Claude command.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Packs · Skill Me',
    description: 'Install a full themed skill bundle in one Claude command.',
  },
}

export default async function PacksPage() {
  const [{ packs, total }, officialPacks] = await Promise.all([
    getPacks({ limit: 48 }),
    getPacksBySlugs(PARTNER_STRIP.map((p) => p.packSlug)),
  ])

  // Official packs get their own showcase up top — drop them from the main grid
  // so they aren't listed twice.
  const officialSlugs = new Set(officialPacks.map((p) => p.slug))
  const restPacks = packs.filter((p) => !officialSlugs.has(p.slug))

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
        <Link href="/browse" className="text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover">
          Browse individual skills →
        </Link>
      </div>

      {/* Install hint */}
      <div className="mt-4 card p-4 flex items-center gap-4">
        <div className="font-mono text-xs text-shelf-text-tertiary">
          Install a full pack in Claude: say{' '}
          <span className="text-accent">&quot;install the [Pack Name] pack&quot;</span>
        </div>
        <Link href="/connect" className="btn btn-primary ml-auto flex-shrink-0">
          Connect to Claude
        </Link>
      </div>

      {/* Official partner packs — straight from the source */}
      {officialPacks.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-semibold text-shelf-text-primary">
                Straight from the source
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                Official packs published by the teams who build the tools — Anthropic, Google,
                Vercel, Microsoft, Hugging Face, and WordPress.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {officialPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      )}

      {/* All other packs */}
      {restPacks.length === 0 ? (
        officialPacks.length === 0 && (
          <div className="card mt-10 p-10 text-center">
            <p className="text-shelf-text-secondary">No packs yet. Check back soon.</p>
            <Link href="/browse" className="btn btn-secondary mt-4">
              Browse individual skills →
            </Link>
          </div>
        )
      ) : (
        <section className="mt-12">
          {officialPacks.length > 0 && (
            <h2 className="font-display text-xl font-semibold text-shelf-text-primary">
              All packs
            </h2>
          )}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
