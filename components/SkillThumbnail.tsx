'use client'

import { useState, useRef } from 'react'
import type { Skill } from '@/lib/types'

interface Props {
  skill: Pick<Skill, 'name' | 'thumbnail_url' | 'thumbnail_gif' | 'thumbnail_video' | 'media_alt'>
  size?: 'card' | 'detail'
}

const ASPECT: Record<'card' | 'detail', string> = {
  card: 'aspect-[16/9]',
  detail: 'aspect-[2/1]',
}

/**
 * Renders a skill (or pack) thumbnail with animation on hover.
 * Priority: video loop > animated GIF > static image > generated placeholder.
 * Falls back gracefully at every level — no broken image states.
 */
export function SkillThumbnail({ skill, size = 'card' }: Props) {
  const [hovering, setHovering] = useState(false)
  const [gifError, setGifError] = useState(false)
  const [staticError, setStaticError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const alt = skill.media_alt ?? `${skill.name} skill preview`

  const hasStatic = Boolean(skill.thumbnail_url) && !staticError
  const hasGif = Boolean(skill.thumbnail_gif) && !gifError
  const hasVideo = Boolean(skill.thumbnail_video)
  const hasAnyMedia = hasStatic || hasGif || hasVideo

  function handleMouseEnter() {
    setHovering(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  function handleMouseLeave() {
    setHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  if (!hasAnyMedia) {
    return <SkillPlaceholder name={skill.name} size={size} />
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-shelf-void ${ASPECT[size]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static image — always rendered as base layer */}
      {hasStatic && (
        <img
          src={skill.thumbnail_url!}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering && (hasGif || hasVideo) ? 'opacity-0' : 'opacity-100'
          }`}
          onError={() => setStaticError(true)}
          loading="lazy"
        />
      )}

      {/* Animated GIF — shown on hover, hidden at rest */}
      {hasGif && (
        <img
          src={skill.thumbnail_gif!}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering ? 'opacity-100' : 'opacity-0'
          }`}
          onError={() => setGifError(true)}
          loading="lazy"
        />
      )}

      {/* Video loop — shown on hover, muted autoplay */}
      {hasVideo && !hasGif && (
        <video
          ref={videoRef}
          src={skill.thumbnail_video!}
          aria-label={alt}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            hovering ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Play hint overlay — appears briefly on hover when animation exists */}
      {(hasGif || hasVideo) && hovering && (
        <div className="pointer-events-none absolute bottom-2 right-2">
          <span className="rounded border border-shelf-border bg-shelf-void/80 px-1.5 py-0.5 font-mono text-xs text-shelf-text-tertiary">
            preview
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Generated placeholder — shown when no media is provided.
 * Uses the skill name to pick a stable color and renders the first letter.
 */
function SkillPlaceholder({ name, size }: { name: string; size: 'card' | 'detail' }) {
  // Stable color from first char code, cycling through the category palette.
  const colors = [
    ['#16210b', '#b4f33e'], // lime
    ['#0e1f21', '#4fd1d9'], // teal
    ['#0f2117', '#6ee787'], // green
    ['#191428', '#a797ff'], // purple
    ['#0f1d33', '#5b9df9'], // blue
    ['#26140c', '#ff8a5c'], // coral
    ['#221024', '#df8ad9'], // pink
    ['#16180f', '#aab4a4'], // sage
  ]
  const idx = (name.charCodeAt(0) || 0) % colors.length
  const [bg, fg] = colors[idx]
  const letter = (name.trim().charAt(0) || '?').toUpperCase()

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${ASPECT[size]}`}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 50% -10%, ${bg}, var(--shelf-void) 80%)`,
      }}
      aria-hidden
    >
      <span
        className="select-none font-display text-6xl font-semibold opacity-50"
        style={{ color: fg }}
      >
        {letter}
      </span>
    </div>
  )
}
