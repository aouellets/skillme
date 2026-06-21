import Link from 'next/link'
import { PackCard } from '@/components/PackCard'
import { HeroDemo } from '@/components/HeroDemo'
import { Reveal } from '@/components/Reveal'
import { EmailCapture } from '@/components/EmailCapture'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { SkillCard } from '@/components/SkillCard'
import { CATEGORIES } from '@/lib/categories'
import { getSkillsBySlugs, getSkills, formatSkillCount } from '@/lib/data'
import { getPacksBySlugs } from '@/lib/packs'
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
 * Curated "Featured this week" marquee — recognizable, high-craft skills with at
 * least one from every discipline, so the opening skill rail reads as range, not
 * a single lane. Order is the carousel order.
 */
const FEATURED_SKILLS = [
  'codegraph', // coding — code intelligence graph
  'anthropic-frontend-design', // design
  'deep-research', // research
  'pitch-deck-builder', // business / fundraising
  'sql-to-insights', // data
  'linkedin-post-writer', // writing
  'gtd-system', // productivity
  'life-coach', // personal
  'nextjs-app-router', // coding
  'ab-test-analyzer', // data
  'competitive-intelligence', // research
  'resume-writer', // business / personal
]

/**
 * "Become anything" shelf — a deliberately wide span of what Claude can turn into
 * from one chat. Each pick is a different role entirely; the variety is the point.
 * Distinct from FEATURED_SKILLS so the two rails never repeat a card.
 */
const BECOME_ANYTHING_SKILLS = [
  'term-sheet-negotiation', // a founder closing a round
  'meal-planner', // a nutrition coach
  'playwright-testing', // a QA engineer
  'literature-review', // an academic researcher
  'ui-ux-pro-max', // a product designer
  'pandas-expert', // a data scientist
  'grand-slam-offer-builder', // a growth marketer
  'okr-builder', // a chief of staff
  'cold-email-craft', // a sales rep
]

const STEPS = [
  {
    title: 'Connect once',
    body: 'Add the Skill Me endpoint in claude.ai under Settings, Integrations. Thirty seconds, and you never do it again.',
  },
  {
    title: 'Just describe your task',
    body: 'Tell Claude what you\'re working on — "help me make a launch video." It reads the task and finds the skills that fit, so you don\'t have to know they exist.',
  },
  {
    title: 'It installs and sticks',
    body: 'Claude installs the right skill and uses it on the spot, then it\'s there in every future conversation. No reinstalling.',
  },
]

export default async function HomePage() {
  const [featured, becomeAnything, { total }, showcasePacks] = await Promise.all([
    getSkillsBySlugs(FEATURED_SKILLS),
    getSkillsBySlugs(BECOME_ANYTHING_SKILLS),
    getSkills({ limit: 1 }),
    getPacksBySlugs(SHOWCASE_PACKS.map((p) => p.slug)),
  ])
  // Pair each fetched pack with its curated discipline label, preserving order.
  const showcase = SHOWCASE_PACKS.map((s) => ({
    discipline: s.discipline,
    pack: showcasePacks.find((p) => p.slug === s.slug),
  })).filter((s): s is { discipline: string; pack: NonNullable<typeof s.pack> } =>
    Boolean(s.pack)
  )
  const countLabel =
    total > 0 ? `${formatSkillCount(total)} curated Claude skills` : 'Curated Claude skills'

  return (
    <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
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
            Describe what you&apos;re working on and Claude finds the right skill from {countLabel},
            installs it, and puts it to work — no browsing, no setup.
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

      {/* HOW IT WORKS — promoted high, non-technical pitch + primary CTA */}
      <section className="relative py-10 sm:py-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-shelf-border bg-shelf-surface">
            {/* top accent hairline */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
            />
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              {/* Left: the pitch */}
              <div className="lg:py-2">
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-shelf-text-primary sm:text-4xl">
                  No code.
                  <br />
                  No browsing. Just ask.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-shelf-text-secondary">
                  You don&apos;t even pick the skill. Describe the task and Claude finds the right
                  one, installs it, and uses it on the spot. If you can send a message in Claude,
                  you&apos;re set — and it is live in your very next conversation.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/connect" className="btn btn-primary">
                    Connect to Claude
                  </Link>
                  <Link href="/browse" className="btn btn-secondary">
                    Browse skills
                  </Link>
                </div>
                <p className="mt-4 font-mono text-xs text-shelf-text-tertiary">
                  Works in claude.ai. About 30 seconds. Free.
                </p>
              </div>

              {/* Right: connected vertical stepper */}
              <ol className="relative space-y-7 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-shelf-border">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-accent-border bg-shelf-elevated font-mono text-sm font-medium text-accent">
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      <h3 className="text-base font-semibold text-shelf-text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-shelf-text-secondary">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FEATURED SKILLS — horizontal carousel */}
      {featured.length > 0 && (
        <section className="py-10">
          <Reveal>
            <FeaturedCarousel skills={featured} title="Featured this week" href="/browse" />
          </Reveal>
        </section>
      )}

      {/* BECOME ANYTHING — a deliberately wide span of roles from one chat */}
      {becomeAnything.length > 0 && (
        <section className="py-8">
          <Reveal className="flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-shelf-text-primary">
                In one chat, become anything.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                Close a round, plan a week of meals, ship a test suite, run a literature
                review — same Claude, whatever the day asks for.
              </p>
            </div>
            <Link
              href="/browse"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              Browse all →
            </Link>
          </Reveal>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {becomeAnything.map((skill, i) => (
              <Reveal key={skill.id} delay={i * 60}>
                <SkillCard skill={skill} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PACK SHOWCASE — one standout pack per discipline, to convey breadth */}
      {showcase.length > 0 && (
        <section className="py-10">
          <Reveal className="flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-shelf-text-primary">
                One catalog. Every kind of work.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">
                Packs bundle a whole workflow into a few skills — from shipping code to
                closing a round to building a brand. One pick from each discipline below.
              </p>
            </div>
            <Link
              href="/packs"
              className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
            >
              View all packs →
            </Link>
          </Reveal>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map(({ pack, discipline }, i) => (
              <Reveal key={pack.id} delay={i * 50}>
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

      {/* CATEGORIES — chips */}
      <section className="py-14">
        <Reveal>
          <h2 className="text-2xl font-semibold text-shelf-text-primary">Browse by category</h2>
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

      {/* FINAL CTA — closing band, centered launch moment */}
      <section className="relative py-20 text-center sm:py-24">
        <div className="aurora" aria-hidden />
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-shelf-text-primary sm:text-5xl">
            Your next conversation just got an upgrade.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-shelf-text-secondary">
            Connect once and every Claude chat finds the right skill for whatever you&apos;re doing.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/connect" className="btn btn-primary">
              Connect to Claude
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-shelf-text-tertiary">Free and open source.</p>
        </Reveal>
      </section>
    </div>
  )
}
