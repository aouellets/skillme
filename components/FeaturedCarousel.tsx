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
  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(false)
  const pausedRef = useRef(false)

  const behavior = (): ScrollBehavior => (reduce ? 'auto' : 'smooth')

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current
      const item = itemRefs.current[index]
      if (!track || !item) return
      // Track is position:relative, so item.offsetLeft is measured from the
      // track's own padding edge, which equals the target scrollLeft.
      track.scrollTo({ left: item.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
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

  // Track the most-visible card to drive the active dot (no scroll listener).
  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        let best: { i: number; ratio: number } | null = null
        for (const entry of entries) {
          const i = itemRefs.current.indexOf(entry.target as HTMLLIElement)
          if (i < 0) continue
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { i, ratio: entry.intersectionRatio }
          }
        }
        if (best && best.ratio > 0.5) setActive(best.i)
      },
      { root: track, threshold: [0.25, 0.5, 0.75] }
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
        const track = trackRef.current
        const item = itemRefs.current[next]
        if (track && item) {
          track.scrollTo({ left: item.offsetLeft, behavior: 'smooth' })
        }
        return next
      })
    }, 4800)
    return () => clearInterval(id)
  }, [reduce, skills.length])

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

      <ul
        ref={trackRef}
        className="no-scrollbar relative mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
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

      {skills.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Carousel position">
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
