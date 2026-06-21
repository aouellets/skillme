'use client'

import { useEffect, useRef, useState } from 'react'

interface DemoVideoProps {
  url: string
  posterUrl?: string | null
  width: number
  height: number
  className?: string
  /** 'inview' autoplays a muted loop when scrolled into view (hero/main demo);
   *  'hover' stays on the poster and previews on hover (gallery thumbnails). */
  playMode?: 'inview' | 'hover'
  rounded?: boolean
  /** When false, clicks don't toggle sound/controls (e.g. the tile is wrapped in
   *  a link that should navigate instead). Defaults to true. */
  interactive?: boolean
}

/**
 * Honest demo player: a muted, looping, poster-backed preview that plays in view
 * (or on hover), and on click switches to full playback with sound + native
 * controls. Lazy — the source is only attached once the element is near the
 * viewport, so a page full of these doesn't fetch every MP4 up front.
 */
export function DemoVideo({
  url,
  posterUrl,
  width,
  height,
  className = '',
  playMode = 'inview',
  rounded = true,
  interactive = true,
}: DemoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false) // user clicked → sound + controls
  const [near, setNear] = useState(false) // near viewport → attach src

  // Attach the source only when near the viewport.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
        } else if (!active) {
          el.pause()
        }
      },
      { rootMargin: '200px', threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active])

  // Autoplay once the source is actually attached (setNear triggers the render
  // that sets src). Playing inside the observer callback races the src attach —
  // the element is already in view on load, so the observer never re-fires and
  // play() silently fails on a source-less element.
  useEffect(() => {
    if (near && playMode === 'inview' && !active) {
      ref.current?.play().catch(() => {})
    }
  }, [near, playMode, active])

  function handleClick() {
    const el = ref.current
    if (!el) return
    setActive(true)
    el.muted = false
    el.controls = true
    el.loop = false
    el.currentTime = 0
    el.play().catch(() => {})
  }

  return (
    <video
      ref={ref}
      src={near ? url : undefined}
      poster={posterUrl ?? undefined}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      onClick={interactive && !active ? handleClick : undefined}
      onMouseEnter={playMode === 'hover' && !active ? () => ref.current?.play().catch(() => {}) : undefined}
      onMouseLeave={playMode === 'hover' && !active ? () => ref.current?.pause() : undefined}
      aria-label={interactive ? 'Demo video — click to play with sound' : 'Demo video preview'}
      className={[
        'h-auto w-full bg-shelf-surface',
        rounded ? 'rounded-lg' : '',
        interactive && !active ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    />
  )
}
