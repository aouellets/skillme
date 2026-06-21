import type { ReactNode } from 'react'

/**
 * A single, slow horizontal marquee (the page uses exactly one). Pure CSS: the
 * track holds two identical copies and translates -50%, so the loop is seamless;
 * it pauses on hover and goes static under prefers-reduced-motion (see the
 * `.marquee` rules). Motivated motion (breadth): a quiet, continuous band of
 * partner marks that reads as "many", without demanding individual attention.
 */
export function Marquee({
  children,
  className = '',
  gapClassName = 'gap-x-12',
}: {
  children: ReactNode
  className?: string
  gapClassName?: string
}) {
  return (
    <div className={`marquee ${className}`}>
      <div className={`marquee-track ${gapClassName}`}>
        <div className={`flex shrink-0 items-center ${gapClassName}`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gapClassName}`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
