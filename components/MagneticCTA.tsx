'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

/**
 * A primary call-to-action with a subtle magnetic pull toward the cursor.
 * Motivated motion (feedback): the button leans into the pointer so the page's
 * single most important action feels physical. Continuous pointer values are
 * written straight to the element's style via rAF — never React state — so this
 * never re-renders the tree (the rule from the motion system). Collapses to a
 * plain button under prefers-reduced-motion.
 */
export function MagneticCTA({
  href,
  children,
  className = 'btn btn-primary',
  strength = 0.35,
}: {
  href: string
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = 0
    let ty = 0

    const apply = () => {
      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`
      raf.current = null
    }
    const schedule = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(apply)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * strength
      ty = (e.clientY - (r.top + r.height / 2)) * strength
      schedule()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      schedule()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [strength])

  return (
    <Link ref={ref} href={href} className={`magnetic ${className}`}>
      {children}
    </Link>
  )
}
