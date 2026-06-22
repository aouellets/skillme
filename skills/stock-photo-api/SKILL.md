---
name: Stock Photo APIs
description: Fetch stock photos programmatically through the Unsplash, Pexels, and Pixabay APIs, with the auth, rate-limit, attribution, and hotlinking rules each one requires. Use when you are building a feature that searches or embeds stock imagery in code - an image picker, a CMS integration, an auto-illustrated blog, a placeholder service, or a script that pulls candidates - or when someone says "integrate the Unsplash API", "pull images from Pexels in my app", "stock photo API", or "how do I trigger the Unsplash download endpoint". Do NOT use to choose a source by hand or write a search brief -> use stock-photo-finder; do NOT use to decide if a license permits your use or whether you need a release -> use image-license-rights; do NOT use to art-direct the results -> use visual-asset-curation.
---

# Stock Photo APIs

Programmatic image sourcing. This skill covers the three main free APIs -
**Unsplash, Pexels, Pixabay** - their auth, search, rate limits, and the
compliance rules that get apps deactivated when skipped. It assumes you already
know *which* source and *what* to search (that is `stock-photo-finder`) and that a
human will own the license call for anything commercial (`image-license-rights`).

## When to use the API at all

Use an API for dynamic, repeated, or in-product image needs. For a one-off hero
image, just download it by hand - an API key is overkill. The reason teams get
this wrong is not the fetch; it is the **compliance obligations** below, which are
contractual, not optional.

## Provider quick reference

| Provider | Auth | Search endpoint | Default rate limit | The gotcha most people miss |
|---|---|---|---|---|
| **Unsplash** | `Authorization: Client-ID <ACCESS_KEY>` | `GET /search/photos` | Demo 50 req/hr; Production 5000 req/hr (after app review) | You MUST trigger the per-photo **download endpoint** on use, attribute the photographer + Unsplash with UTM links, and hotlink the `urls` they return (do not rehost). |
| **Pexels** | `Authorization: <API_KEY>` | `GET /v1/search` | 200 req/hr, 20,000 req/mo (default) | Show attribution to Pexels and the photographer; do not build a clone of Pexels. Respect the `X-Ratelimit-*` response headers. |
| **Pixabay** | `?key=<API_KEY>` query param | `GET /api/` | ~100 req/min | You must **cache/download images to your own server** (per their terms) rather than permanently hotlinking Pixabay-served URLs; cache API responses ~24h. |

Always confirm current limits and terms in each provider's live docs - these are
the documented defaults but providers revise them.

## Unsplash: the full compliant flow

Unsplash's API Guidelines are strict and enforced. The three non-negotiables are
**hotlink, trigger-download, attribute**.

```ts
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!; // server-side only
const H = { Authorization: `Client-ID ${ACCESS_KEY}` };

// 1. Search. Hotlink the urls Unsplash returns; do not rehost the file.
async function searchPhotos(query: string) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
    { headers: H },
  );
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const { results } = await res.json();
  return results; // each has urls.regular, links.download_location, user{name, links.html}
}

// 2. REQUIRED: when the user actually uses/downloads a photo, ping its
//    download_location. This is how photographers get credited usage. Skipping
//    it is the #1 reason Unsplash deactivates apps.
async function triggerDownload(downloadLocation: string) {
  await fetch(downloadLocation, { headers: H });
}

// 3. REQUIRED: attribute with UTM params back to the photographer and Unsplash.
function attribution(photo: { user: { name: string; links: { html: string } } }) {
  const u = `${photo.user.links.html}?utm_source=your_app&utm_medium=referral`;
  return `Photo by <a href="${u}">${photo.user.name}</a> on ` +
         `<a href="https://unsplash.com/?utm_source=your_app&utm_medium=referral">Unsplash</a>`;
}
```

## Compliance checklist (the part that is actually the work)

- **Keys are secret and server-side.** Never ship an access/secret key in client
  JS. Proxy requests through your backend or a serverless function.
- **Unsplash:** hotlink `urls`, fire `download_location` on use, attribute with
  UTM links. Demo apps are capped at 50 req/hr until you apply for production.
- **Pexels:** render the required Pexels + photographer attribution; do not
  replicate Pexels as a product.
- **Pixabay:** download/cache images to your server; cache responses ~24h; do not
  permanently hotlink.
- **Rate limits:** read the response headers (`X-Ratelimit-Remaining`, etc.),
  back off on `429`, and **cache search results** so one query is not re-fetched
  on every render.
- **License still applies.** The API does not grant rights it does not have -
  identifiable people/brands and editorial-only assets are still governed by
  **image-license-rights**. Surface that to whoever publishes the result.

## Robustness

- Wrap calls with timeouts, retry-with-backoff on `429`/`5xx`, and a graceful
  empty-state for "no results".
- Store the provider, photo ID, photographer, profile URL, and attribution HTML
  alongside any image you persist - you will need them to render credit and to
  answer a license question later.
- Normalize the three providers behind one internal interface
  (`searchImages(query): Promise<Image[]>`) so callers do not depend on each
  provider's response shape.
