'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SkillCard } from './SkillCard'
import type { Skill } from '@/lib/types'

type SkillSummary = Omit<Skill, 'skill_content'>

/**
 * Featured-skills carousel. Native CSS scroll-snap (the right tool for a
 * horizontal card rail) with prev/next controls, dot indicators, and a gentle
 * autoplay. Motion is motivated (storytelling: surfaces breadth of the catalog)
 * and fully reduced-motion safe: autoplay and smooth scrolling are disabled
 * under prefers-reduced-motion, leaving a plain swipeable rail.
 *
 * No scroll listeners: the active dot is tracked with IntersectionObserver,
 * autoplay with a paused-on-hover interval.
 */
export function FeaturedCarousel({
  skills,
  title,
  href,
}: {
  skills: SkillSummary[]
  title: string
  href: string
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const ratiosRef = useRef<number[]>([])
  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(false)
  // Edge-fade flags: only fade a side when there is hidden content that way,
  // so the first/last cards stay crisp at the rail edges. Driven by the same
  // IntersectionObserver — no scroll listener.
  const [fadeStart, setFadeStart] = useState(false)
  const [fadeEnd, setFadeEnd] = useState(true)
  const pausedRef = useRef(false)

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current
      const item = itemRefs.current[index]
      if (!track || !item) return
      // Measure from live rects so the scroll target is robust to the track's
      // inline scroll-padding (which aligns the first card to the content edge
      // while letting the rail bleed full-width for un-clipped hover shadows).
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
      const delta =
        item.getBoundingClientRect().left - track.getBoundingClientRect().left - pad
      track.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' })
    },
    [reduce]
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = (active + dir + skills.length) % skills.length
      scrollToIndex(next)
    },
    [active, skills.length, scrollToIndex]
  )

  // Detect reduced motion once.
  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Track the most-visible card to drive the active dot, plus the edge-fade
  // flags — all from one IntersectionObserver, no scroll listener.
  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof IntersectionObserver === 'undefined') return
    const last = skills.length - 1
    const io = new IntersectionObserver(
      (entries) => {
        let best: { i: number; ratio: number } | null = null
        for (const entry of entries) {
          const i = itemRefs.current.indexOf(entry.target as HTMLLIElement)
          if (i < 0) continue
          ratiosRef.current[i] = entry.intersectionRatio
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { i, ratio: entry.intersectionRatio }
          }
        }
        if (best && best.ratio > 0.5) setActive(best.i)
        // Fade an edge only while its boundary card is not (nearly) fully shown.
        setFadeStart((ratiosRef.current[0] ?? 1) < 0.99)
        setFadeEnd((ratiosRef.current[last] ?? 1) < 0.99)
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.75, 0.99, 1] }
    )
    itemRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [skills.length])

  // Gentle autoplay, paused on hover/focus, disabled under reduced motion.
  useEffect(() => {
    if (reduce || skills.length <= 1) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setActive((prev) => {
        const next = (prev + 1) % skills.length
        scrollToIndex(next)
        return next
      })
    }, 4800)
    return () => clearInterval(id)
  }, [reduce, skills.length, scrollToIndex])

  return (
    <div
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-shelf-text-primary">{title}</h2>
        <div className="flex items-center gap-3">
          <Link
            href={href}
            className="shrink-0 text-sm text-shelf-text-secondary transition-colors hover:text-accent-hover"
          >
            View all →
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <CarouselButton label="Previous skills" onClick={() => step(-1)} dir="prev" />
            <CarouselButton label="Next skills" onClick={() => step(1)} dir="next" />
          </div>
        </div>
      </div>

      {/* Full-bleed rail: negative margins cancel the page gutter so the track's
          own padding gives cards room to lift and cast shadows without clipping,
          while the first card still lines up with the page content edge. */}
      <div className="-mx-4 mt-3 sm:-mx-6 lg:-mx-8">
        <ul
          ref={trackRef}
          style={{
            WebkitMaskImage: edgeMask(fadeStart, fadeEnd),
            maskImage: edgeMask(fadeStart, fadeEnd),
          }}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 py-10 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
          aria-label={title}
        >
          {skills.map((skill, i) => (
            <li
              key={skill.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="w-[82%] shrink-0 snap-start sm:w-[340px]"
            >
              <SkillCard skill={skill} />
            </li>
          ))}
        </ul>
      </div>

      {skills.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Carousel position">
          {skills.map((skill, i) => (
            <button
              key={skill.id}
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to ${skill.name}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-shelf-border-strong hover:bg-shelf-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Horizontal alpha mask for the rail. Cards dissolve into the gutter on any
 * side that still hides content, so the rail reads as a seamless surface
 * rather than a hard-cut row. The fade lives in the bleed gutter, so a card
 * resting against the content edge stays fully crisp.
 */
function edgeMask(fadeStart: boolean, fadeEnd: boolean): string {
  const fade = '2.5rem'
  const left = fadeStart ? `transparent 0` : `black 0`
  const right = fadeEnd ? `transparent 100%` : `black 100%`
  return `linear-gradient(to right, ${left}, black ${fade}, black calc(100% - ${fade}), ${right})`
}

function CarouselButton({
  label,
  onClick,
  dir,
}: {
  label: string
  onClick: () => void
  dir: 'prev' | 'next'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-shelf-border-strong bg-shelf-surface text-shelf-text-secondary transition-colors hover:border-shelf-muted hover:text-shelf-text-primary active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
