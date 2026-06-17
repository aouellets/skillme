import type { Metadata } from 'next'
import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { getPacks } from '@/lib/packs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Skill Packs',
  description:
    'Curated bundles of Claude skills — install a themed set in one command. Solo Founder Stack, Engineering Workflow, Content Marketing Engine, and more.',
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header always renders */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
            Curated bundles
          </p>
          <h1 className="mt-1 font-display text-4xl text-shelf-text-primary">Skill Packs</h1>
          <p className="mt-2 text-shelf-text-secondary">
            {total > 0
              ? `${total} pack${total !== 1 ? 's' : ''} — install a themed set of skills in one command.`
              : 'Themed bundles of curated Claude skills, installed together.'}
          </p>
        </div>
        <Link
          href="/browse"
          className="text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
        >
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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  )
}
