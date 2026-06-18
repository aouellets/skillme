'use client'

import { useState, useRef } from 'react'
import type { SkillCategory, PackCategory } from '@/lib/types'
import { categoryThumbnailSvg } from '@/lib/category-art'

interface Props {
  skill: {
    name: string
    category?: SkillCategory | PackCategory
    thumbnail_url?: string
    thumbnail_gif?: string
    thumbnail_video?: string
    media_alt?: string
  }
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
    return <SkillPlaceholder category={skill.category} seed={skill.name} size={size} />
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-shelf-void ${ASPECT[size]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static image — always rendered as base layer.
          Intentionally a plain <img>: thumbnails are remote, cross-opacity
          hover-swapped with the GIF/video layers, and not LCP-critical.
          next/image's layout/optimization gets in the way here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
 * Generated placeholder — shown when no media is provided. Renders the
 * category's art (brand color + line icon + label) as inline SVG so every
 * skill and pack gets a recognizable, on-brand thumbnail by category. Falls
 * back to the "collection" art for unknown/missing categories.
 */
function SkillPlaceholder({
  category,
  seed,
  size,
}: {
  category?: string
  seed?: string
  size: 'card' | 'detail'
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${ASPECT[size]}`}
      dangerouslySetInnerHTML={{ __html: categoryThumbnailSvg(category, { seed }) }}
    />
  )
}
