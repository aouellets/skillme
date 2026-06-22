import type { ResolvedPartner } from '@/lib/partners'

/**
 * A partner's brand mark rendered in full brand color (not grayscale). Shared by
 * the marquee, the trust strip, and the inline PartnerLogo so colorization is
 * consistent. Microsoft is special-cased into its four real tile colors; every
 * other brand fills its single path with the partner's `logoColor` (the official
 * hex where it reads on the dark UI, white for monochrome-dark brands).
 */

// Microsoft's four-square logo, in its real tile colors. viewBox 0 0 24 24.
const MS_TILES = [
  { x: 1, y: 1, fill: '#f25022' },
  { x: 13, y: 1, fill: '#7fba00' },
  { x: 1, y: 13, fill: '#00a4ef' },
  { x: 13, y: 13, fill: '#ffb900' },
]

export function PartnerMark({
  partner,
  size = 20,
  className = '',
}: {
  partner: ResolvedPartner
  size?: number
  className?: string
}) {
  if (partner.logo === 'microsoft') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
        {MS_TILES.map((t) => (
          <rect key={t.fill} x={t.x} y={t.y} width={10} height={10} fill={t.fill} />
        ))}
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={partner.mark.viewBox}
      fill={partner.logoColor}
      aria-hidden
      className={className}
    >
      <path d={partner.mark.path} />
    </svg>
  )
}
