'use client'

/**
 * Fire a custom analytics event. Works with Vercel Analytics and Plausible.
 * Safe to call from anywhere — no-ops if analytics isn't loaded.
 */
export function track(event: string, props?: Record<string, string | number>) {
  // Vercel Analytics
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { va?: (e: string, p?: unknown) => void }).va
  ) {
    ;(window as unknown as { va: (e: string, p?: unknown) => void }).va('event', {
      name: event,
      ...props,
    })
  }
  // Plausible
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { plausible?: (e: string, o?: unknown) => void }).plausible
  ) {
    ;(window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible(event, {
      props,
    })
  }
}
