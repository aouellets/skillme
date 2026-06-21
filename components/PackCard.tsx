import Link from 'next/link'
import { SkillThumbnail } from './SkillThumbnail'
import { VerifiedMark } from './VerifiedMark'
import { OfficialBadge } from './OfficialBadge'
import { PartnerLogo } from './PartnerLogo'
import { installLabel } from '@/lib/categories'
import { isOfficial } from '@/lib/skill-source'
import { isPartner } from '@/lib/partners'
import type { Pack } from '@/lib/types'

type PackCardData = Omit<Pack, 'skills'>

export function PackCard({ pack }: { pack: PackCardData }) {
  return (
    <Link
      href={`/pack/${pack.slug}`}
      className="card card-interactive group flex h-full flex-col overflow-hidden"
    >
      <SkillThumbnail
        skill={{
          name: pack.name,
          author: pack.author,
          category: pack.category,
          thumbnail_url: pack.thumbnail_url,
          thumbnail_gif: pack.thumbnail_gif,
          media_alt: pack.media_alt,
        }}
        size="card"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Pack badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-xs border border-accent-border bg-accent-dim px-2 py-0.5 font-mono text-xs text-accent">
            Pack
          </span>
          {isOfficial(pack) ? (
            <OfficialBadge label={false} />
          ) : isPartner(pack.author) ? (
            <PartnerLogo author={pack.author} size={15} withLabel />
          ) : (
            pack.verified && <VerifiedMark label={false} />
          )}
        </div>

        <h3 className="font-display text-base font-semibold leading-snug text-shelf-text-primary transition-colors group-hover:text-accent-hover">
          {pack.name}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-shelf-text-secondary">
          {pack.tagline}
        </p>

        <div className="flex items-center justify-between border-t border-shelf-border pt-3 font-mono text-xs text-shelf-text-tertiary">
          <span>{pack.skill_count ?? '?'} skills</span>
          {installLabel(pack.install_count) && <span>{installLabel(pack.install_count)}</span>}
        </div>
      </div>
    </Link>
  )
}
