---
name: Image License & Usage Rights
description: Decide whether you can legally use a stock image, what the license requires, and whether you need a model or property release. Use when you are about to publish, advertise, sell, or ship anything containing a stock photo and need to confirm the rights, or when someone asks "is this free for commercial use", "do I need to credit the photographer", "can I use this in an ad / on merchandise", "what is royalty-free vs rights-managed", "is editorial-use-only a problem", or "do I need a model release". It covers CC0/public domain, the Unsplash, Pexels and Pixabay licenses, Adobe Stock standard vs extended, Getty / iStock royalty-free vs rights-managed and editorial-use-only, attribution and redistribution rules, model and property releases, and AI-generated image caveats. Do NOT use to find or search for a photo -> use stock-photo-finder; do NOT use to fetch images via an API -> use stock-photo-api.
---

# Image License & Usage Rights

The license travels with the image, not with the website you found it on. The
same photo can be free on one site and $500 on another. This skill decides
whether a specific use is permitted, what the license obligates you to do, and
when you need a release. It is the gate before anything commercial ships.

**First principle: verify on the source page, never from memory.** Licenses
change (Pixabay left CC0 in 2019; sites revise terms). Open the image's actual
license/terms on the provider before you rely on anything below.

## When to use a sibling instead

- **"Where do I even find a photo of X?"** -> **stock-photo-finder**.
- **"Fetch and attribute images in code."** -> **stock-photo-api** (it has the
  per-API attribution and hotlinking rules).

## Step 1: Classify YOUR use first

The same image can be fine or forbidden depending on use. Pin these down:

- **Commercial or editorial?** Commercial = promotes, advertises, or sells
  something (ads, packaging, a product site, merch). Editorial = illustrates news,
  commentary, or education with no commercial pitch. **Editorial-use-only images
  cannot be used commercially - this is the single most common violation.**
- **Internal or public?** A deck shown in a meeting is lower-risk than a public
  ad, but "internal" is not a blanket license.
- **Scale** - print run, impressions, or whether it goes on a *product for resale*
  (mugs, t-shirts, templates, app UI sold to others). High scale and
  resale/merchandise usually require an **extended/enhanced** license.

## Step 2: Read the license type

Common license families and what they actually allow:

- **CC0 / Public Domain** - do anything, no attribution, no permission. (e.g.
  many museum/government archives.) Still check for identifiable people/property.
- **Unsplash License** - free for commercial and non-commercial use, no
  permission needed; attribution appreciated, not required. You may **not** sell
  unaltered copies, and may **not** compile Unsplash photos to build a competing
  stock service.
- **Pexels License** - free, commercial and personal, no attribution required
  (appreciated). You may modify. You may **not** sell unaltered copies,
  redistribute them on a similar/competing stock platform, or imply that
  identifiable people/brands endorse you.
- **Pixabay Content License** - free, no attribution required. **Not CC0 since
  2019.** Cannot sell/distribute as-is on other stock sites; identifiable persons
  may not be used commercially in a way that is portrayed negatively or implies
  endorsement without a release.
- **Adobe Stock - Standard vs Extended.** Standard covers most web/print up to a
  cap (commonly up to 500,000 impressions/copies) but **not** merchandise for
  resale or use in templates/products sold to others. **Extended** lifts the cap
  and allows merchandise/resale. Match the tier to Step 1's scale.
- **Getty / iStock - Royalty-Free (RF) vs Rights-Managed (RM).** RF: pay once,
  reuse broadly within the license terms. RM: licensed for a specific use,
  duration, region, and exclusivity - going outside that scope is a breach. Plus
  the **editorial-use-only** flag (see Step 1).
- **Shutterstock - Standard vs Enhanced.** Same shape as Adobe: enhanced is
  required for merchandise/resale and very high print runs.

If the license is not one of these, read it; do not analogize.

## Step 3: Releases - people and property

A license to use the *image* is not consent from the *people or property in it*.

- **Model release** - needed to use an image with **identifiable people** for
  **commercial** purposes. Without it, the image is editorial-only regardless of
  the stock license.
- **Property release** - needed for recognizable **private property, artworks,
  trademarks/logos, or distinctive buildings** in commercial use.
- Paid sites (Adobe, Getty, Shutterstock) usually mark "model released" /
  "property released" and hold the paperwork. **Free libraries usually do not** -
  treat free images of identifiable people as editorial-only unless proven
  otherwise.
- Editorial use generally does not need releases, but then you cannot use the
  image commercially. You cannot have it both ways.

## Step 4: Attribution & redistribution

- **Attribution:** follow the exact license. "Appreciated" != required, but if
  required (some CC BY images, some boutique tiers), credit precisely as
  specified. For API usage, attribution rules are stricter - see
  **stock-photo-api**.
- **Redistribution:** nearly every license - even the "free, no attribution"
  ones - forbids **selling unaltered copies** and **re-uploading the images to a
  competing stock library**. You licensed a *use*, not ownership.

## AI-generated images

Stock sites now host AI-generated images and also offer AI generators. Rights are
unsettled and vary by provider: some grant commercial use, some require
disclosure, some exclude depictions of real people/brands. Copyright status of
purely AI output is itself contested in several jurisdictions. Read that
provider's AI terms specifically and prefer assets that come with an explicit
commercial grant.

## Quality bar - keep a license record

For every shipped image, record: **source URL, license name, license/asset ID,
date acquired, attribution text (if any), and release status.** If you cannot
produce that record for a commercial asset, do not ship it. When in doubt,
default to the more restrictive reading or pick a clearly-licensed alternative
via **stock-photo-finder**.
