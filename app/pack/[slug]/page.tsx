import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SkillCard } from '@/components/SkillCard'
import { SkillThumbnail } from '@/components/SkillThumbnail'
import { VerifiedMark } from '@/components/VerifiedMark'
import { CopyButton } from '@/components/CopyButton'
import { formatInstalls } from '@/lib/categories'
import { getPackBySlug } from '@/lib/packs'
import { MCP_URL, SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Pack not found' }

  const ogImage = pack.thumbnail_url ?? `${SITE_URL}/og-default.png`

  return {
    title: pack.name,
    description: pack.tagline,
    openGraph: {
      title: `${pack.name} · SkillShelf`,
      description: pack.tagline,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pack.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pack.name} · SkillShelf`,
      description: pack.tagline,
      images: [ogImage],
    },
  }
}

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-shelf-text-tertiary">
        <Link href="/packs" className="transition-colors hover:text-shelf-text-secondary">Packs</Link>
        <span>/</span>
        <span className="text-shelf-text-secondary">{pack.name}</span>
      </nav>

      {/* Thumbnail */}
      {(pack.thumbnail_url || pack.thumbnail_gif) && (
        <div className="mt-6 overflow-hidden rounded-lg border border-shelf-border">
          <SkillThumbnail skill={pack} size="detail" />
        </div>
      )}

      {/* Hero */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded border border-accent-border bg-accent-dim px-2.5 py-1 font-mono text-sm text-accent">
            Pack · {pack.skill_count ?? 0} skills
          </span>
          {pack.verified && <VerifiedMark />}
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shelf-text-primary sm:text-5xl">
          {pack.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-shelf-text-secondary">{pack.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-sm text-shelf-text-tertiary">
          <span>{formatInstalls(pack.install_count)} installs</span>
          {pack.author && <span>by {pack.author}</span>}
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <p className="text-shelf-text-secondary leading-relaxed">{pack.description}</p>

          {/* Skills in this pack */}
          {pack.skills && pack.skills.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-base font-medium text-shelf-text-primary">
                Skills included ({pack.skills.length})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pack.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-medium text-shelf-text-primary">Install this pack</h2>
            <ol className="mt-4 space-y-3 text-sm text-shelf-text-secondary">
              <li className="flex gap-3">
                <span className="font-mono text-accent">1.</span>
                <span>
                  Make sure SkillShelf MCP is connected.{' '}
                  <Link href="/connect" className="text-accent hover:text-accent-hover">
                    Connect →
                  </Link>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-accent">2.</span>
                <span>
                  Say in any Claude conversation:
                  <span className="mt-1 block rounded border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-shelf-text-primary">
                    Install the {pack.name} pack
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-accent">3.</span>
                <span>All {pack.skill_count ?? 0} skills activate in your next session.</span>
              </li>
            </ol>
            <div className="mt-5 border-t border-shelf-border pt-4">
              <p className="text-xs text-shelf-text-tertiary">MCP endpoint</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-sm text-shelf-text-primary">
                  {MCP_URL}
                </code>
                <CopyButton value={MCP_URL} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
