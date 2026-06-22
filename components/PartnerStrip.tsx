import Link from 'next/link'
import { PartnerMark } from './PartnerMark'
import { PARTNER_STRIP, getPartner } from '@/lib/partners'

/**
 * Landing-page trust strip: a quiet row of official partner logos ("skills
 * straight from the teams who build your tools"), each linking to that
 * partner's pack. A credibility signal, not a marketing banner.
 */
export function PartnerStrip() {
  const partners = PARTNER_STRIP.map((p) => ({ ...p, partner: getPartner(p.author) })).filter(
    (p): p is typeof p & { partner: NonNullable<typeof p.partner> } => Boolean(p.partner)
  )
  if (!partners.length) return null

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-shelf-text-tertiary">
        Official skills from the teams who build your tools
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-5">
        {partners.map(({ packSlug, partner }) => (
          <Link
            key={packSlug}
            href={`/pack/${packSlug}`}
            title={`${partner.label} — official skills`}
            className="inline-flex items-center gap-2 text-shelf-text-secondary opacity-90 transition-all hover:text-shelf-text-primary hover:opacity-100"
          >
            <PartnerMark partner={partner} size={20} />
            <span className="text-sm font-medium">{partner.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
