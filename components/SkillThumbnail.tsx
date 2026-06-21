'use client'

import { useState, useRef } from 'react'
import type { SkillCategory, PackCategory } from '@/lib/types'
import { categoryThumbnailSvg } from '@/lib/category-art'
import { partnerThumbnailSvg, hasPartnerArt } from '@/lib/partner-art'

interface Props {
  skill: {
    name: string
    author?: string | null
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
    return (
      <SkillPlaceholder
        category={skill.category}
        author={skill.author}
        seed={skill.name}
        size={size}
      />
    )
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

      <ThumbSheen />
    </div>
  )
}

/**
 * Decorative light treatment shared by every thumbnail (media + placeholder).
 * A top sheen + inset edge ring make the art read as a lit screen, and the
 * bottom scrim/seam grounds it cleanly against the card body. Pointer-events
 * off so it never intercepts hover/clicks.
 */
function ThumbSheen() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* top sheen — catches light along the upper edge */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" />
      {/* bottom grounding scrim into the card body */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-shelf-void/45 to-transparent" />
      {/* inset edge ring + 1px seam at the base */}
      <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(245,247,245,0.07),inset_0_-1px_0_rgba(8,10,10,0.7)]" />
    </div>
  )
}

/**
 * Generated placeholder — shown when no media is provided. For official partner
 * authors (Anthropic, Google, Vercel, …) we render *branded* art (their logo +
 * brand glow + category label) so "skills straight from the source" read as
 * distinct. Everything else falls back to the category's art (brand color +
 * line icon + label), and unknown/missing categories to "collection".
 */
function SkillPlaceholder({
  category,
  author,
  seed,
  size,
}: {
  category?: string
  author?: string | null
  seed?: string
  size: 'card' | 'detail'
}) {
  const svg = hasPartnerArt(author)
    ? partnerThumbnailSvg(author!, category)
    : categoryThumbnailSvg(category, { seed })
  return (
    <div className={`relative w-full overflow-hidden ${ASPECT[size]}`}>
      <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: svg }} />
      <ThumbSheen />
    </div>
  )
}
