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
  /** Above-the-fold hero use: on desktop, attach the source immediately and use
   *  the native muted-autoplay attribute (reliable in Safari, which won't always
   *  honor a JS play()). Mobile keeps the lazy poster + tap-to-play to save data. */
  eager?: boolean
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
  eager = false,
  rounded = true,
  interactive = true,
}: DemoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false) // user clicked → sound + controls
  const [near, setNear] = useState(false) // near viewport → attach src
  const [eagerDesktop, setEagerDesktop] = useState(false) // desktop hero → native autoplay

  // Desktop hero: attach the source up front and let the browser autoplay via the
  // native `autoplay` attribute. Gated to >=lg so phones keep the lazy poster.
  useEffect(() => {
    if (!eager || typeof window === 'undefined') return
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setEagerDesktop(true)
      setNear(true)
    }
  }, [eager])

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
      const el = ref.current
      if (!el) return
      // React's `muted` JSX prop doesn't reliably set the live `muted` property
      // at mount, and the browser's autoplay policy gates on that property — so
      // an unmuted-looking element gets its play() (and native autoplay) blocked.
      // Force it imperatively before playing so muted autoplay is actually allowed.
      el.muted = true
      el.play().catch(() => {})
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
      autoPlay={eagerDesktop}
      preload={eagerDesktop ? 'metadata' : 'none'}
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
