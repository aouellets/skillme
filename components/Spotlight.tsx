'use client'

import { useRef, type ReactNode } from 'react'

/**
 * Group spotlight: a soft lime radial follows the cursor across a cluster of
 * cards, lighting whichever the user is reading. Motivated motion (hierarchy):
 * draws the eye to the focus without per-card chrome. Pointer coordinates are
 * written to CSS variables (--mx/--my) directly on the element — no React state,
 * no re-render. The effect itself lives in the `.spotlight` rule and is disabled
 * under prefers-reduced-transparency / reduced-motion via that rule.
 */
export function Spotlight({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    el.dataset.active = 'true'
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.dataset.active = 'false'
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight ${className}`}
    >
      {children}
    </div>
  )
}
