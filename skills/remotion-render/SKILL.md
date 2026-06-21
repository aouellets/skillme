---
name: Remotion Render
description: Renders a Remotion composition to MP4 and runs the iterate loop — CLI render command, 1080p/4K/9:16 presets, --concurrency tuning, surgical edit-and-re-render cycles, batch variants from a JSON data file, and Lambda for cloud rendering. Use to render, export, iterate on, update, or batch a Remotion video.
---
# Remotion Render

You drive the **render-and-iterate loop**: turn a composition into an MP4, take
natural-language feedback, make the *smallest* edit that satisfies it, and
re-render. You also handle resolution presets, concurrency tuning, batch variants,
and Lambda when local is too slow.

Trigger on any mention of rendering, exporting, iterating, updating copy, changing
a transition, "the animation is too fast," batch variants, or "deploy rendering to
Lambda."

## Step 1 — The basic render command

```bash
npx remotion render src/index.ts <CompositionId> out/video.mp4
```

- `src/index.ts` is the entry that calls `registerRoot`.
- `<CompositionId>` is the `id` of the `<Composition>` in `src/Root.tsx` (not the
  filename).
- The last arg is the output path; Remotion creates `out/` if needed.

Default output is H.264 MP4 at the composition's own `width`/`height`/`fps`.

## Step 2 — Resolution & format presets

Resolution and fps come from the **`<Composition>`** (width/height/fps) — the
cleanest way to change them is at the source. Use `--scale` to multiply the
canvas, `--codec` to change the container/codec:

```bash
# 1080p / 30fps — standard landscape (Composition already 1920×1080@30)
npx remotion render src/index.ts ProductDemo out/1080p.mp4

# 4K / 60fps — premium. Set fps=60 on the Composition, then upscale 1920×1080 → 4K:
npx remotion render src/index.ts ProductDemo out/4k.mp4 --scale=2

# 9:16 vertical for social — render a Composition authored at 1080×1920:
npx remotion render src/index.ts ProductDemoVertical out/vertical.mp4
```

Notes:
- `--scale=2` doubles the pixel dimensions (1080p → 4K) without editing layout.
- True 60fps means `fps={60}` on the Composition (and frame counts scaled to
  match), not a render flag — flag-only fps changes desync the animation timing.
- For transparent output use `--codec=vp8`/`vp9` (WebM) or `--codec=prores` with
  alpha; standard social/web delivery stays H.264 MP4.

## Step 3 — Concurrency

Rendering is CPU-bound (each frame is a headless-Chromium screenshot). On a
multi-core machine, raise concurrency:

```bash
npx remotion render src/index.ts ProductDemo out/video.mp4 --concurrency=8
```

Rule of thumb: start at the number of physical cores; back off if the machine
swaps or thermal-throttles. `--concurrency=50%` accepts a percentage of cores.
Default is roughly half the cores — explicit tuning is the easiest local speedup.

## Step 4 — The iterative refinement loop

This is the core workflow. Keep Studio open (`npx remotion studio`,
http://localhost:3000) so the user previews instantly; reserve full renders for
sign-off.

1. **User previews** in Studio and gives feedback in plain language.
2. **You translate it to a surgical edit** — change *only* the relevant component,
   not the whole file:
   - "Too fast" → widen the `interpolate` input range or raise spring `damping`.
   - "Logo should pop more" → lower spring `damping` / add overshoot.
   - "Change the CTA copy" → edit the prop / `defaultProps`, touch nothing else.
   - "Different accent color" → change one hex in `colors`.
   - "Hold the last feature longer" → bump that `<Sequence>`'s `durationInFrames`
     **and** the Composition's total `durationInFrames`.
3. **Re-render** (or just let Studio hot-reload for a visual check).

**Surgical edit vs full rewrite:** edit in place when the change is a value, a
prop, a color, or a single scene's timing. Rewrite only when the *scene structure*
changes (adding/removing/reordering scenes). Default to surgical — it preserves
everything the user already approved.

> Whenever you change a scene's duration or add a scene, re-derive the
> Composition's total `durationInFrames`. A mismatch is the #1 render surprise
> (see troubleshooting).

## Step 5 — Batch rendering variants

The composition is data-driven (props), so N variants = N prop sets. Keep them in
a JSON file and pass each with `--props`:

```json
// data/variants.json
[
  { "out": "out/acme.mp4",  "props": { "logoText": "Acme",  "colors": { "bg": "#0B0B0F", "fg": "#FFF", "accent": "#6C5CE7" }, "cta": "Try Acme" } },
  { "out": "out/globex.mp4","props": { "logoText": "Globex","colors": { "bg": "#06121A", "fg": "#FFF", "accent": "#00B894" }, "cta": "Try Globex" } }
]
```

Drive it with a tiny shell loop (`--props` takes inline JSON or a file path):

```bash
# one render per variant
npx remotion render src/index.ts ProductDemo out/acme.mp4 \
  --props='{"logoText":"Acme","cta":"Try Acme"}'
```

For more than a couple, write a Node script that reads `data/variants.json` and
shells out to `npx remotion render … --props=<file>` per entry, or use
`@remotion/renderer`'s `renderMedia()` programmatically for a typed loop. Localize
or A/B-test copy/colors entirely by editing the JSON — no re-prompting.

## Step 6 — Remotion Lambda (cloud rendering)

When clips are long, resolution is high, or the team renders at volume, local
machines are the bottleneck. Lambda fans frames out across serverless workers:

```bash
# one-time per AWS account/region
npx remotion lambda functions deploy
npx remotion lambda sites create src/index.ts --site-name=product-demo

# render on Lambda
npx remotion lambda render <serve-url-or-site-name> ProductDemo \
  --props='{"logoText":"Acme"}'
```

Requires AWS credentials and IAM permissions per Remotion's Lambda setup docs.
Reach for it when a single render takes minutes locally or you are batch-rendering
many variants — otherwise local is simpler and free.

## Step 7 — Troubleshooting the three common failures

1. **Frame-count / timing mismatch** — animation cuts off early or the clip has a
   dead tail. Cause: a `<Sequence>` duration changed but the Composition's total
   `durationInFrames` did not (or vice-versa). Fix: make the Composition total
   equal the sum of its sequences; recompute after every timing edit.
2. **Missing `staticFile()` references** — render fails or an asset is blank.
   Cause: an asset imported by path or sitting outside `public/`. Fix: put it in
   `public/assets/` and reference it as `staticFile("assets/<name>")`; confirm the
   file exists at that path.
3. **Font load order / flash** — text renders in a fallback font or shifts.
   Cause: `@remotion/google-fonts` `loadFont()` not called (or called too late).
   Fix: call `loadFont()` at module top-level in the composition file and apply
   the returned `fontFamily`; the render then waits for the font.

After a clean render, point the user at the MP4 in `out/` and offer the next loop:
*"Here's the render. Anything to tweak — pacing, copy, color — and I'll edit and
re-render."*
