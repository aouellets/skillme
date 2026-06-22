import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { HeroDemo } from '@/components/HeroDemo'
import { Reveal } from '@/components/Reveal'
import { EmailCapture } from '@/components/EmailCapture'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { SkillCard } from '@/components/SkillCard'
import { MagneticCTA } from '@/components/MagneticCTA'
import { Spotlight } from '@/components/Spotlight'
import { StatBand } from '@/components/StatBand'
import { PartnerMarquee } from '@/components/PartnerMarquee'
import { WordRotator } from '@/components/WordRotator'
import { PARTNER_STRIP } from '@/lib/partners'
import { CATEGORIES } from '@/lib/categories'
import { getSkillsBySlugs, getSkills, formatSkillCount } from '@/lib/data'
import { getPacksBySlugs } from '@/lib/packs'
import { getPlatformDemos } from '@/lib/media'
import { DemoVideo } from '@/components/DemoVideo'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/** Live catalog counts for the stat band. Returns zeros when the DB is absent. */
async function getCounts(): Promise<{ skills: number; packs: number }> {
  try {
    const supabase = getSupabase()
    if (!supabase) return { skills: 0, packs: 0 }
    const [skillsRes, packsRes] = await Promise.all([
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('packs').select('id', { count: 'exact', head: true }),
    ])
    return { skills: skillsRes.count ?? 0, packs: packsRes.count ?? 0 }
  } catch {
    return { skills: 0, packs: 0 }
  }
}

/**
 * Curated landing-page pack showcase — one standout pack per discipline, in
 * category order, so the grid reads as "we cover every kind of work" rather than
 * a top-N-by-installs cluster. Each label names the discipline it represents.
 */
const SHOWCASE_PACKS: { slug: string; discipline: string }[] = [
  { slug: 'engineering-workflow', discipline: 'Engineering' },
  { slug: 'data-science-ml', discipline: 'Data & ML' },
  { slug: 'brand-visual-identity', discipline: 'Design' },
  { slug: 'content-marketing-engine', discipline: 'Marketing' },
  { slug: 'startup-fundraising', discipline: 'Fundraising' },
  { slug: 'product-manager-stack', discipline: 'Product' },
  { slug: 'academic-researcher', discipline: 'Research' },
  { slug: 'personal-operating-system', discipline: 'Personal' },
]

/**
 * Curated "Featured this week" rail — recognizable, high-craft skills with at
 * least one from every discipline, so the opening skill rail reads as range.
 */
const FEATURED_SKILLS = [
  'codegraph',
  'anthropic-frontend-design',
  'deep-research',
  'pitch-deck-builder',
  'sql-to-insights',
  'linkedin-post-writer',
  'gtd-system',
  'life-coach',
  'nextjs-app-router',
  'ab-test-analyzer',
  'competitive-intelligence',
  'resume-writer',
]

/**
 * "Become anything" shelf — a deliberately wide span of roles from one chat.
 * Each pick is a different job entirely; the variety is the point. Distinct
 * from FEATURED_SKILLS so the two rails never repeat a card.
 */
const BECOME_ANYTHING_SKILLS = [
  'term-sheet-negotiation',
  'meal-planner',
  'playwright-testing',
  'literature-review',
  'ui-ux-pro-max',
  'pandas-expert',
  'grand-slam-offer-builder',
  'okr-builder',
  'cold-email-craft',
  'financial-planner',
  'user-flow-mapper',
  'customer-analytics',
]

/** Roles the rotating headline cycles through (mirrors the skills below). */
const ROLES = [
  'a founder',
  'a data scientist',
  'a product designer',
  'a QA engineer',
  'a researcher',
  'a growth marketer',
  'a chief of staff',
  'a sales lead',
]

const STEPS = [
  {
    title: 'Connect once',
    body: 'Add the Skill Me endpoint in claude.ai under Settings, Integrations. About thirty seconds, and you never do it again.',
  },
  {
    title: 'Describe your task',
    body: 'Tell Claude what you are working on, like "help me make a launch video." It reads the task and finds the skills that fit, so you never have to know they exist.',
  },
  {
    title: 'It installs and sticks',
    body: 'Claude installs the right skill, uses it on the spot, and keeps it for every future conversation. No reinstalling.',
  },
]

/** A real SKILL.md frontmatter sample for the authoring section (not a mockup). */
const SKILL_SAMPLE = `---
name: launch-video-director
description: >-
  Plans and directs a polished product launch
  video — beat sheet, cursor choreography,
  pacing, and an honest, real-data script.
license: MIT
---

# Launch Video Director

When the user wants a launch or demo video,
work through the storyboard first, then…`

export default async function HomePage() {
  const [featured, becomeAnything, { total }, showcasePacks, partnerPacks, platformDemo, counts] =
    await Promise.all([
      getSkillsBySlugs(FEATURED_SKILLS),
      getSkillsBySlugs(BECOME_ANYTHING_SKILLS),
      getSkills({ limit: 1 }),
      getPacksBySlugs(SHOWCASE_PACKS.map((p) => p.slug)),
      getPacksBySlugs(PARTNER_STRIP.map((p) => p.packSlug)),
      getPlatformDemos(),
      getCounts(),
    ])

  // The marquee carries the full partner roster; the showcase grid features the
  // first twelve headline packs (a clean 2/3/4-up across breakpoints).
  const partnerShowcase = PARTNER_STRIP.map((p) =>
    partnerPacks.find((pk) => pk.slug === p.packSlug)
  )
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 12)

  const showcase = SHOWCASE_PACKS.map((s) => ({
    discipline: s.discipline,
    pack: showcasePacks.find((p) => p.slug === s.slug),
  })).filter((s): s is { discipline: string; pack: NonNullable<typeof s.pack> } => Boolean(s.pack))

  const countLabel =
    total > 0 ? `${formatSkillCount(total)} curated Claude skills` : 'curated Claude skills'

  const stats: { value: number | null; text?: string; suffix?: string; label: string }[] = [
    { value: counts.skills || null, text: 'Curated', suffix: '+', label: 'Skills' },
    { value: counts.packs || null, text: 'Workflow', label: 'Packs' },
    { value: PARTNER_STRIP.length, label: 'Official partners' },
    { value: null, text: 'MIT', label: 'Open source' },
  ]

  // Hero showcase: the real 30s product film when it exists (honest media in the
  // prime slot), otherwise the self-running recommender animation as a fallback.
  // One demo, not two — the standalone film section is gone.
  const heroFilm = platformDemo.landscape ?? platformDemo.portrait
  const heroVisual = heroFilm ? (
    <div className="edge-light overflow-hidden rounded-xl border border-shelf-border bg-shelf-surface shadow-glow">
      <DemoVideo
        url={heroFilm.url}
        posterUrl={heroFilm.poster_url}
        width={heroFilm.width}
        height={heroFilm.height}
        eager
        rounded={false}
      />
    </div>
  ) : (
    <HeroDemo />
  )

  return (
    <div className="mx-auto max-w-content overflow-x-clip px-4 sm:px-6 lg:px-8">
      {/* HERO — asymmetric split. One eyebrow for the whole page lives here. */}
      <section className="relative grid grid-cols-1 items-center gap-8 py-10 sm:gap-12 sm:py-24 lg:grid-cols-[1.04fr_1fr] lg:gap-14">
        <div className="aurora" aria-hidden />
        <div aria-hidden className="grid-texture absolute inset-x-0 top-0 -z-10 h-[420px]" />
        {/* Hero stack assembles in sequence (staging): eyebrow → headline → sub
            → CTA, each on a fade-up offset by the stagger step. */}
        <div>
          <span className="eyebrow fade-up inline-block">The App Store for Claude</span>
          <h1 className="fade-up mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-shelf-text-primary sm:text-7xl 2xl:text-8xl" style={{ animationDelay: '80ms' }}>
            Install
            <br />
            intelligence.
          </h1>
          <p className="fade-up mt-6 max-w-md text-lg leading-relaxed text-shelf-text-secondary" style={{ animationDelay: '160ms' }}>
            Describe what you are working on. Claude finds the right skill from {countLabel},
            installs it, and gets to work.
          </p>

          <div className="fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
            <MagneticCTA href="/connect">Connect to Claude</MagneticCTA>
            <Link href="/browse" className="btn btn-secondary">
              Browse skills
            </Link>
          </div>
        </div>

        <div className="fade-up parallax-rise" style={{ animationDelay: '200ms' }}>
          {heroVisual}
          {heroFilm && (
            <p className="mt-3 text-center font-mono text-xs text-shelf-text-tertiary">
              The product in 30 seconds. Click to play with sound.
            </p>
          )}
        </div>
      </section>

      {/* STAT BAND — live catalog metrics, counted up; numbers earn their own strip. */}
      <section className="relative">
        <Reveal>
          <div className="glass overflow-hidden rounded-lg">
            <StatBand stats={stats} />
          </div>
        </Reveal>
      </section>

      {/* PARTNER MARQUEE — the page's single marquee, official marks gliding past. */}
      <section className="border-y border-shelf-border py-7">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-wide text-shelf-text-tertiary">
          Official skills from the teams who build your tools
        </p>
        <PartnerMarquee />
      </section>

      {/* HOW IT WORKS — the recommender flow as three lit, connected steps. */}
      <section className="relative py-10 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-shelf-text-primary sm:text-4xl">
            No code. No browsing. Just ask.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-shelf-text-secondary">
            You do not even pick the skill. If you can send a message in Claude, you are set, and
            it is live in your very next conversation.
          </p>
        </Reveal>

        <Reveal>
          <Spotlight className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-shelf-border bg-shelf-border sm:mt-12 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="bg-shelf-surface p-7 sm:p-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-border bg-accent-dim font-mono text-sm font-semibold text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-shelf-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                  {step.body}
                </p>
              </div>
            ))}
          </Spotlight>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticCTA href="/connect">Connect to Claude</MagneticCTA>
          <span className="font-mono text-xs text-shelf-text-tertiary">
            Works in claude.ai. About 30 seconds. Free.
          </span>
        </Reveal>
      </section>

      {/* FEATURED SKILLS — horizontal carousel. */}
      {featured.length > 0 && (
        <section className="py-8 sm:py-10">
          <Reveal>
            <FeaturedCarousel skills={featured} title="Featured this week" href="/browse" />
          </Reveal>
        </section>
      )}

      {/* BECOME ANYTHING — rotating-role headline over a lit grid of roles. */}
      {becomeAnything.length > 0 && (
        <section className="py-10 sm:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-shelf-text-primary sm:text-4xl">
              In one chat, become{' '}
              <WordRotator words={ROLES} />
            </h2>
            <Link
              href="/browse"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              Browse all →
            </Link>
          </Reveal>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-shelf-text-secondary">
            Close a round, plan a week of meals, ship a test suite, run a literature review. Same
            Claude, whatever the day asks for.
          </p>
          <Reveal>
            <Spotlight className="mt-8 grid grid-cols-1 gap-5 rounded-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {becomeAnything.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </Spotlight>
          </Reveal>
        </section>
      )}

      {/* PACKS — one standout pack per discipline, labeled, to convey breadth. */}
      {showcase.length > 0 && (
        <section className="py-10 sm:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary sm:text-4xl">
                One catalog. Every kind of work.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-shelf-text-secondary">
                Packs bundle a whole workflow into a few skills, from shipping code to closing a
                round to building a brand. One pick from each discipline.
              </p>
            </div>
            <Link
              href="/packs"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              View all packs →
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map(({ pack, discipline }, i) => (
              <Reveal key={pack.id} index={i}>
                <div className="flex h-full flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-wide text-shelf-text-tertiary">
                    {discipline}
                  </span>
                  <PackCard pack={pack} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* OFFICIAL PARTNER PACKS — skills straight from the source. */}
      {partnerShowcase.length > 0 && (
        <section className="py-10 sm:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary sm:text-4xl">
                Skills straight from the source.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-shelf-text-secondary">
                Official packs published by the teams who build the tools: Anthropic, OpenAI,
                Google, NVIDIA, Cloudflare, Databricks, Elastic, Snowflake, Stripe, and more.
              </p>
            </div>
            <Link
              href="/packs"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              View all packs →
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {partnerShowcase.map((pack, i) => (
              <Reveal key={pack.id} index={i}>
                <PackCard pack={pack} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* AUTHOR — bring your own skill (the authoring story). Split feature. */}
      <section className="py-10 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">Bring your own</span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-shelf-text-primary sm:text-4xl">
              Turn a sentence into a skill.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-shelf-text-secondary">
              Describe what it should do and let Claude scaffold the SKILL.md, the open format that
              runs in Claude Code, Cursor, Gemini CLI, and Codex. Submit it and it joins the
              catalog for everyone.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/submit" className="btn btn-primary">
                Submit a skill
              </Link>
              <a
                href="https://github.com/aouellets/skillme"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View on GitHub
              </a>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="card edge-light overflow-hidden">
              <div className="flex items-center justify-between border-b border-shelf-border px-4 py-2.5">
                <span className="font-mono text-xs text-shelf-text-tertiary">SKILL.md</span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-shelf-text-tertiary">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                  Valid
                </span>
              </div>
              <pre className="skill-preview overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-relaxed text-shelf-text-secondary">
                <code>{SKILL_SAMPLE}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES — chip cloud. */}
      <section className="py-8 sm:py-12">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-shelf-text-primary">
            Browse by category
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/browse?category=${cat.slug}`} className="chip">
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

      {/* OPEN SOURCE — plain text columns under a live accent rule. */}
      <section className="py-10 sm:py-16">
        <div className="glow-line" />
        <Reveal className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-base font-semibold text-shelf-text-primary">
              Open source
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
              MIT licensed and self-hostable. The full MCP server and web catalog are on GitHub.
              Fork it, extend it, run your own private instance.
            </p>
            <a
              href="https://github.com/aouellets/skillme"
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
              publishing. No skill in the catalog can exfiltrate your data or override Claude.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-shelf-text-primary">
              Skill standard
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
              Skills use the open SKILL.md format, compatible with Claude Code, Cursor, Gemini CLI,
              and OpenAI Codex. Skills you install here work everywhere.
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

      {/* FINAL CTA — centered closing band. */}
      <section className="relative py-14 text-center sm:py-28">
        <div className="aurora aurora-cta" aria-hidden />
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-shelf-text-primary sm:text-5xl">
            Your next conversation just got an upgrade.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-shelf-text-secondary">
            Connect once and every Claude chat finds the right skill for whatever you are doing.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticCTA href="/connect">Connect to Claude</MagneticCTA>
          </div>
          <div className="mx-auto mt-12 max-w-sm">
            <EmailCapture
              label="New skill packs drop weekly. Get notified."
              placement="inline"
            />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
