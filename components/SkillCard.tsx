'use client'

import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { VerifiedMark } from './VerifiedMark'
import { SkillThumbnail } from './SkillThumbnail'
import { formatInstalls, isNewSkill } from '@/lib/categories'
import { track } from '@/lib/analytics'
import type { Skill } from '@/lib/types'

type SkillCardData = Omit<Skill, 'skill_content'> & { skill_content?: string }

export function SkillCard({ skill }: { skill: SkillCardData }) {
  return (
    <Link
      href={`/skill/${skill.slug}`}
      className="card card-interactive group relative flex h-full flex-col overflow-hidden"
      onClick={() => track('skill_viewed', { skill: skill.slug, category: skill.category })}
    >
      {isNewSkill(skill.created_at) && (
        <span className="absolute right-3 top-3 z-10 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 font-mono text-xs text-success">
          New
        </span>
      )}
      <SkillThumbnail skill={skill} size="card" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-snug text-shelf-text-primary transition-colors group-hover:text-accent-hover">
            {skill.name}
          </h3>
          <CategoryBadge category={skill.category} />
        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-shelf-text-secondary">
          {skill.description}
        </p>

        <div className="flex items-center justify-between border-t border-shelf-border pt-3 font-mono text-xs text-shelf-text-tertiary">
          <span>{formatInstalls(skill.install_count)} installs</span>
          <span className="flex items-center gap-3">
            {skill.rating_count > 0 && (
              <span className="text-shelf-text-secondary">
                <span className="text-accent">★</span> {skill.rating_avg.toFixed(1)}
              </span>
            )}
            {skill.verified && <VerifiedMark label={false} />}
          </span>
        </div>
      </div>
    </Link>
  )
}
