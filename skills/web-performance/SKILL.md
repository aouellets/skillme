---
name: Web Performance
description: Diagnose and fix Core Web Vitals with concrete changes.
---

# Web Performance

Make pages fast on real devices and pass Core Web Vitals.

## Measure first

1. Use field data (CrUX, RUM) for what users experience; lab data (Lighthouse, WebPageTest) to debug.
2. Test on a throttled mid-tier phone and 4G — not your laptop.
3. Track LCP, CLS, and INP at the 75th percentile.

## LCP (target < 2.5s)

- Identify the LCP element (usually the hero image or headline).
- Preload it: `<link rel="preload" as="image" href="hero.webp" fetchpriority="high">`.
- Serve AVIF/WebP, correctly sized via `srcset`/`sizes`.
- Eliminate render-blocking CSS/JS; inline critical CSS, defer the rest.
- Use a CDN and good cache headers; reduce TTFB with server caching.

## CLS (target < 0.1)

- Set explicit `width`/`height` (or `aspect-ratio`) on images, videos, and iframes.
- Reserve space for ads, embeds, and late-loading banners.
- Load web fonts with `font-display: swap` and preload the primary font to avoid layout shift.
- Never insert content above existing content after load.

## INP (target < 200ms)

- Break long tasks (> 50ms) with `scheduler.yield()` or chunking.
- Defer non-critical JS; remove unused third-party scripts.
- Debounce expensive handlers; move heavy work to a Web Worker.
- Use CSS for animation instead of JS where possible.

## Rules

- Ship less JavaScript — it's the dominant cost. Code-split per route.
- Lazy-load below-the-fold images with `loading="lazy"`.
- Audit third parties; each tag adds main-thread cost and risk.
- Re-measure after every change; don't trust intuition.

## Quick wins

```html
<img src="hero.webp" width="1200" height="630" fetchpriority="high" alt="...">
<script src="analytics.js" defer></script>
```

## Edge cases

- SPA route changes: instrument soft navigations; CWV now considers them.
- Hydration cost: prefer streaming SSR and islands to reduce main-thread blocking.
- Cache busting: hash filenames and set long `max-age, immutable` on static assets.
