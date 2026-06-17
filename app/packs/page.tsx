import type { Metadata } from 'next'
import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { getPacks } from '@/lib/packs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Skill Packs',
  description:
    'Curated bundles of Claude skills. Install a themed set in one command. Solo Founder Stack, Engineering Workflow, Content Marketing Engine, and more.',
  openGraph: {
    title: 'Skill Packs · SkillShelf',
    description: 'Install a full themed skill bundle in one Claude command.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Packs · SkillShelf',
    description: 'Install a full themed skill bundle in one Claude command.',
  },
}

export default async function PacksPage() {
  const { packs, total } = await getPacks({ limit: 48 })

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
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

      {/* Grid */}
      {packs.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="text-shelf-text-secondary">No packs yet. Check back soon.</p>
          <Link href="/browse" className="btn btn-secondary mt-4">
            Browse individual skills →
          </Link>
        </div>
      ) : (
        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  )
}
