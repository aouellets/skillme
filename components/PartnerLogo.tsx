import { getPartner } from '@/lib/partners'
import { PartnerMark } from './PartnerMark'

/**
 * Official partner brand mark, shown as a trust signal next to the author of a
 * skill or pack from a known organization (Anthropic, Google, Vercel, …).
 * Renders nothing when the author isn't a recognized partner.
 *
 * - `size` controls the mark in px.
 * - `withLabel` appends the brand name ("Anthropic").
 * - `asLink` wraps it in a link to the partner's repo (use on detail pages,
 *   not inside an existing <Link> like a card).
 */
export function PartnerLogo({
  author,
  size = 14,
  withLabel = false,
  asLink = false,
  className = '',
}: {
  author?: string | null
  size?: number
  withLabel?: boolean
  asLink?: boolean
  className?: string
}) {
  const partner = getPartner(author)
  if (!partner) return null

  const inner = (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <PartnerMark partner={partner} size={size} className="shrink-0" />
      {withLabel && <span>{partner.label}</span>}
    </span>
  )

  const title = `Official skill from ${partner.label}`

  if (asLink) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className="inline-flex items-center text-shelf-text-secondary transition-colors hover:text-shelf-text-primary"
      >
        {inner}
      </a>
    )
  }

  return (
    <span title={title} className="inline-flex items-center text-shelf-text-secondary">
      {inner}
    </span>
  )
}
