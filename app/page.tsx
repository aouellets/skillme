import Link from 'next/link'
import { SkillCard } from '@/components/SkillCard'
import { CATEGORIES } from '@/lib/categories'
import { getFeaturedSkills } from '@/lib/data'

export const dynamic = 'force-dynamic'

const STEPS = [
  {
    title: 'Connect the MCP',
    body: 'In claude.ai, open Settings → Integrations and add the SkillShelf endpoint. One time, thirty seconds.',
  },
  {
    title: 'Ask for skills',
    body: 'Say "show me writing skills" in any conversation. Claude searches the catalog and reads back what fits.',
  },
  {
    title: 'Say "install it"',
    body: 'The skill is added to your library and activates automatically in your next session — across every conversation.',
  },
]

export default async function HomePage() {
  const featured = await getFeaturedSkills(6)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* HERO */}
      <section className="py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          The App Store for Claude
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-shelf-text-primary sm:text-6xl">
          Install intelligence.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-shelf-text-secondary">
          150+ curated Claude skills. Connect once, install anything. No ZIP files, no
          terminal, no setup.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/connect" className="btn btn-primary">
            Connect to Claude
          </Link>
          <Link href="/browse" className="btn btn-secondary">
            Browse Skills →
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
              Featured this week
            </p>
            <h2 className="mt-1 text-xl font-medium text-shelf-text-primary">
              Curated and verified
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-sm text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-8 text-sm text-shelf-text-secondary">
            No featured skills yet. Check back soon.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          Browse by category
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/browse?category=${cat.slug}`}
              className="inline-flex items-center gap-2 rounded-btn border border-shelf-border bg-shelf-surface px-4 py-2 text-sm text-shelf-text-secondary transition-colors hover:border-shelf-muted hover:text-shelf-text-primary"
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
          How it works
        </p>
        <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="font-mono text-sm text-accent">{`0${i + 1}`}</span>
              <h3 className="mt-3 text-base font-medium text-shelf-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/connect" className="btn btn-primary">
            Get started
          </Link>
        </div>
      </section>
    </div>
  )
}
