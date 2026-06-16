import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CategoryBadge } from '@/components/CategoryBadge'
import { VerifiedMark } from '@/components/VerifiedMark'
import { InstallInstructions } from '@/components/InstallInstructions'
import { CATEGORY_MAP, formatInstalls } from '@/lib/categories'
import { getSkillBySlug } from '@/lib/data'

export const dynamic = 'force-dynamic'

const PREVIEW_LINES = 25

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)
  if (!skill) return { title: 'Skill not found' }
  return {
    title: skill.name,
    description: skill.description,
  }
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)
  if (!skill) notFound()

  const category = CATEGORY_MAP[skill.category]
  const preview = skill.skill_content.split('\n').slice(0, PREVIEW_LINES).join('\n')
  const truncated = skill.skill_content.split('\n').length > PREVIEW_LINES

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-shelf-text-tertiary">
        <Link href="/browse" className="transition-colors hover:text-shelf-text-secondary">
          Browse
        </Link>
        <span>/</span>
        <Link
          href={`/browse?category=${skill.category}`}
          className="transition-colors hover:text-shelf-text-secondary"
        >
          {category?.label ?? skill.category}
        </Link>
        <span>/</span>
        <span className="text-shelf-text-secondary">{skill.name}</span>
      </nav>

      {/* Hero */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={skill.category} size="md" />
          {skill.verified && <VerifiedMark />}
        </div>
        <h1 className="mt-3 font-display text-4xl text-shelf-text-primary sm:text-5xl">
          {skill.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-sm text-shelf-text-tertiary">
          <span>{formatInstalls(skill.install_count)} installs</span>
          {skill.rating_count > 0 && (
            <span>
              <span className="text-accent">★</span> {skill.rating_avg.toFixed(1)} (
              {skill.rating_count})
            </span>
          )}
          {skill.author && <span>by {skill.author}</span>}
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <p className="text-lg leading-relaxed text-shelf-text-secondary">
            {skill.description}
          </p>

          {skill.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-btn border border-shelf-border bg-shelf-elevated px-2.5 py-0.5 font-mono text-xs text-shelf-text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* SKILL.md preview */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-shelf-text-primary">SKILL.md preview</h2>
              {skill.source_url && (
                <a
                  href={skill.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  View source on GitHub →
                </a>
              )}
            </div>
            <pre className="skill-preview mt-3 max-h-[420px] overflow-auto rounded-lg border border-shelf-border bg-shelf-void p-4 font-mono text-sm leading-relaxed text-shelf-text-secondary">
              <code>{preview}</code>
              {truncated && (
                <span className="mt-2 block text-shelf-text-tertiary">
                  … install to load the full skill
                </span>
              )}
            </pre>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <InstallInstructions skillName={skill.name} />
          {skill.source_url && (
            <a
              href={skill.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full"
            >
              Source on GitHub →
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
