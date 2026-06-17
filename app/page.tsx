import Link from 'next/link'
import { SkillCard } from '@/components/SkillCard'
import { PackCard } from '@/components/PackCard'
import { HeroDemo } from '@/components/HeroDemo'
import { Reveal } from '@/components/Reveal'
import { EmailCapture } from '@/components/EmailCapture'
import { CATEGORIES } from '@/lib/categories'
import { getFeaturedSkills, getSkills } from '@/lib/data'
import { getFeaturedPacks } from '@/lib/packs'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/** Live catalog stats for the hero. Renders nothing when the DB is empty/unavailable. */
async function StatsBar() {
  try {
    const supabase = getSupabase()
    if (!supabase) return null

    const [skillsRes, packsRes] = await Promise.all([
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('packs').select('id', { count: 'exact', head: true }),
    ])

    const skills = skillsRes.count ?? 0
    const packs = packsRes.count ?? 0
    if (skills === 0) return null

    return (
      <div className="flex flex-wrap gap-6 font-mono text-xs text-shelf-text-tertiary">
        <span>
          <span className="text-shelf-text-secondary">{skills.toLocaleString()}</span> skills
        </span>
        <span>
          <span className="text-shelf-text-secondary">{packs}</span> packs
        </span>
        <span>
          <span className="text-shelf-text-secondary">free</span> forever
        </span>
        <span>
          <span className="text-shelf-text-secondary">MIT</span> licensed
        </span>
      </div>
    )
  } catch {
    return null
  }
}

const STEPS = [
  {
    title: 'Connect the MCP',
    body: 'In claude.ai, open Settings, Integrations, and add the SkillShelf endpoint. You will see it appear in your integrations list. That is the only setup you will ever do.',
  },
  {
    title: 'Ask for skills',
    body: 'Say "show me skills" in any conversation. Claude searches the catalog and returns results sorted by install count, or by what you want to do: "writing skills", "debug SQL".',
  },
  {
    title: 'Say "install it"',
    body: 'Skills load automatically at the start of every conversation from now on. Install a full pack for 8 skills at once. Remove any with "uninstall the X skill".',
  },
]

export default async function HomePage() {
  const [featured, { total }, featuredPacks] = await Promise.all([
    getFeaturedSkills(6),
    getSkills({ limit: 1 }),
    getFeaturedPacks(3),
  ])
  const countLabel =
    total > 0 ? `${total.toLocaleString()}+ curated Claude skills` : 'Curated Claude skills'

  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      {/* HERO — asymmetric split, single eyebrow for the whole page */}
      <section className="relative grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="aurora" aria-hidden />
        <div className="fade-up">
          <span className="eyebrow">The App Store for Claude</span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-shelf-text-primary sm:text-6xl">
            Install
            <br />
            intelligence.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-shelf-text-secondary">
            {countLabel}. Connect once, install anything. No ZIP files, no terminal, no setup.
          </p>

          {/* Live stats */}
          <div className="mt-4">
            <StatsBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/connect" className="btn btn-primary">
              Connect to Claude
            </Link>
            <Link href="/browse" className="btn btn-secondary">
              Browse skills
            </Link>
          </div>

          {/* Email capture — after the hero CTAs */}
          <div className="mt-10 max-w-md">
            <EmailCapture
              label="New skill packs drop weekly. Get notified."
              placement="inline"
            />
          </div>
        </div>
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <HeroDemo />
        </div>
      </section>

      {/* FEATURED SKILLS */}
      <section className="py-8">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-shelf-text-primary">Featured this week</h2>
          <Link
            href="/browse"
            className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
          >
            View all →
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="mt-8 text-sm text-shelf-text-secondary">
            No featured skills yet. Check back soon.
          </p>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((skill, i) => (
              <Reveal key={skill.id} delay={i * 60}>
                <SkillCard skill={skill} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* FEATURED PACKS */}
      {featuredPacks.length > 0 && (
        <section className="py-8">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-shelf-text-primary">Skill packs</h2>
            <Link
              href="/packs"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              View all packs →
            </Link>
          </Reveal>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {featuredPacks.map((pack, i) => (
              <Reveal key={pack.id} delay={i * 60}>
                <PackCard pack={pack} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIES — full-width tinted band breaks the rhythm */}
      <section className="py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-shelf-text-primary">Browse by category</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/browse?category=${cat.slug}`}
                className="chip"
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
        </Reveal>
      </section>

      {/* OPEN SOURCE CREDIBILITY — plain text columns grouped by a top rule */}
      <section className="border-t border-shelf-border py-16">
        <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-base font-semibold text-shelf-text-primary">
              Open source
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
              MIT licensed. Self-hostable. The full MCP server and web catalog are on GitHub.
              Fork it, extend it, run your own private instance.
            </p>
            <a
              href="https://github.com/aouellets/skillshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm text-accent transition-colors hover:text-accent-hover"
            >
              View on GitHub →
            </a>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-shelf-text-primary">
              Safety reviewed
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
              Every skill is reviewed for prompt injection and hidden instructions before
              publishing. No skill in the catalog can exfiltrate your data or override
              Claude&apos;s behavior.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-shelf-text-primary">
              Skill standard
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
              Skills use the open SKILL.md format, compatible with Claude Code, Cursor,
              Gemini CLI, and OpenAI Codex. Skills you install here work everywhere.
            </p>
            <Link
              href="/submit"
              className="mt-3 inline-flex text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Submit your skill →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS — connected numbered flow, not 3 identical cards */}
      <section className="relative py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-shelf-text-primary">How it works</h2>
          <p className="mt-2 max-w-lg text-shelf-text-secondary">
            From zero to a live skill in three steps. Nothing to download.
          </p>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-shelf-border bg-shelf-border sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className="bg-shelf-surface p-7">
              <span className="font-mono text-sm font-medium text-accent">
                {`0${i + 1}`}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-shelf-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                {step.body}
              </p>
            </Reveal>
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
