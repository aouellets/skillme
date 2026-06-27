import Link from 'next/link'
import { DemoVideo } from './DemoVideo'
import { SkillThumbnail } from './SkillThumbnail'
import { CategoryBadge } from './CategoryBadge'
import { MethodologyBadge } from './MethodologyBadge'
import { Reveal } from './Reveal'
import { hasMethodology } from '@/lib/methodology'
import type { MediaAsset, Skill } from '@/lib/types'

type PackSkill = Omit<Skill, 'skill_content'> & {
  skill_content?: string
  /** The skill's own landscape demo, when one has been published. */
  demo: MediaAsset | null
}

/**
 * The sub-page index for a pack detail page. One unified, numbered list of the
 * member skills — each tile carries that skill's own demo video inline (or its
 * thumbnail when there's no video) and links to the full skill page.
 *
 * This replaces the older split of a plain "Skills included" card grid plus a
 * separate "Skill demos" gallery, which rendered the same skills twice and left
 * each video disconnected from the skill it belonged to. Members arrive in the
 * author's recommended order (pack_skills.position), so the step numbers read
 * as a sequence you can either walk through or dip into.
 */
export function PackSkillList({ items }: { items: PackSkill[] }) {
  if (items.length === 0) return null
  const withDemo = items.filter((s) => s.demo).length

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-shelf-text-primary">
          Skills in this pack
        </h2>
        <span className="font-mono text-xs text-shelf-text-tertiary">
          {items.length} skills{withDemo > 0 ? ` · ${withDemo} with demos` : ''}
        </span>
      </div>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-shelf-text-secondary">
        Arranged in the author&apos;s recommended order. Walk through them in
        sequence, or open any one on its own.
      </p>

      <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((skill, i) => (
          <Reveal as="li" key={skill.id} index={i} className="min-w-0">
            <Link
              href={`/skill/${skill.slug}`}
              className="card card-interactive group relative flex h-full flex-col overflow-hidden"
            >
              <div className="relative">
                {/* Step number — makes the author's ordering legible at a glance. */}
                <span className="absolute left-2.5 top-2.5 z-10 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border border-shelf-border bg-shelf-void/80 px-1.5 font-mono text-xs font-medium text-shelf-text-secondary backdrop-blur-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {skill.demo ? (
                  <>
                    <DemoVideo
                      url={skill.demo.url}
                      posterUrl={skill.demo.poster_url}
                      width={skill.demo.width}
                      height={skill.demo.height}
                      playMode="hover"
                      interactive={false}
                      rounded={false}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded border border-shelf-border bg-shelf-void/80 px-1.5 py-0.5 font-mono text-[11px] text-shelf-text-tertiary">
                      demo
                    </span>
                  </>
                ) : (
                  <SkillThumbnail skill={skill} size="card" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 font-display text-base font-semibold leading-snug text-shelf-text-primary transition-colors group-hover:text-accent-hover">
                    {skill.name}
                  </h3>
                  {/* Match SkillCard: hide the inline badge on the compact mobile
                      tile (the thumbnail already carries the category) and bring
                      it back at sm+. */}
                  <span className="hidden shrink-0 sm:contents">
                    {hasMethodology(skill.tags) ? (
                      <MethodologyBadge tags={skill.tags} />
                    ) : (
                      <CategoryBadge category={skill.category} />
                    )}
                  </span>
                </div>

                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-shelf-text-secondary">
                  {skill.description}
                </p>

                <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-shelf-text-tertiary transition-colors group-hover:text-accent">
                  View skill
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
