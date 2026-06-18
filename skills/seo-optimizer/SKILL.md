---
name: SEO Optimizer
description: Audit and rewrite pages to rank, without keyword stuffing.
---

# SEO Optimizer

Improve organic visibility through content quality, technical signals, and structured data.

## Audit checklist

1. Title tag: 50-60 chars, primary keyword near the front, unique per page.
2. Meta description: 140-160 chars, includes a call to action. Not a ranking factor but drives CTR.
3. One `<h1>` per page; logical `<h2>`/`<h3>` hierarchy.
4. URL slug: short, hyphenated, keyword-bearing, no stop words.
5. Internal links: 2-5 contextual links to related pages with descriptive anchor text.
6. Image `alt` text describing the image, not keyword-stuffed.

## Keyword strategy

- Target one primary keyword plus 2-4 semantic variants per page.
- Aim for natural density (~0.5-1.5%). Optimize for topic coverage, not exact-match repetition.
- Map search intent: informational, navigational, transactional. Match content type to intent.
- Answer the query in the first 100 words for featured-snippet eligibility.

## Schema markup

Add JSON-LD in the `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "author": { "@type": "Person", "name": "${author}" },
  "datePublished": "${isoDate}"
}
</script>
```

Use `FAQPage`, `Product`, `BreadcrumbList`, and `HowTo` where they fit the content.

## Core Web Vitals

- LCP under 2.5s: preload the hero image, serve next-gen formats, avoid render-blocking CSS.
- CLS under 0.1: set explicit width/height on images and reserve space for ads/embeds.
- INP under 200ms: break up long tasks, defer non-critical JS.

## Rules

- Never cloak or stuff. Google's helpful-content system penalizes thin, AI-spun pages.
- Each page must serve a distinct intent — consolidate cannibalizing pages.
- Canonicalize duplicates with `rel="canonical"`.
- Submit an XML sitemap and keep it under 50k URLs per file.

## Edge cases

- Pagination: use self-referencing canonicals, not `rel=prev/next` (deprecated).
- JS-rendered content: ensure server-side rendering or dynamic rendering so crawlers see text.
- Migrations: 301-redirect old URLs one-to-one; never mass-redirect to the homepage.
