import Link from 'next/link'
import { Marquee } from './Marquee'
import { PARTNER_STRIP, getPartner } from '@/lib/partners'

/**
 * The trust band beneath the hero: official partner marks gliding past in one
 * continuous marquee, each linking to that team's pack. Logos only (brand mark +
 * wordmark), no category labels. A credibility signal, not a banner.
 */
export function PartnerMarquee() {
  const partners = PARTNER_STRIP.map((p) => ({ ...p, partner: getPartner(p.author) })).filter(
    (p): p is typeof p & { partner: NonNullable<typeof p.partner> } => Boolean(p.partner)
  )
  if (!partners.length) return null

  return (
    <Marquee gapClassName="gap-x-10 sm:gap-x-16">
      {partners.map(({ packSlug, partner }) => (
        <Link
          key={packSlug}
          href={`/pack/${packSlug}`}
          title={`${partner.label} — official skills`}
          className="inline-flex items-center gap-2.5 text-shelf-text-tertiary grayscale transition-all duration-300 hover:text-shelf-text-primary hover:grayscale-0"
        >
          <svg
            width={22}
            height={22}
            viewBox={partner.mark.viewBox}
            fill="currentColor"
            aria-hidden
          >
            <path d={partner.mark.path} />
          </svg>
          <span className="whitespace-nowrap text-[15px] font-medium">{partner.label}</span>
        </Link>
      ))}
    </Marquee>
  )
}
