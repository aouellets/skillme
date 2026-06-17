# Skill Me Media Guide

## How to add thumbnails, GIFs, and video previews to your skill

Skill Me supports animated previews that play on hover in the catalog. This guide
explains how to add media to your skill so it shows a preview that converts browsers
into installers.

---

## Quick start

Add a `media` block to your SKILL.md frontmatter:

```yaml
---
name: My Skill
description: What this skill does in one sentence.
media:
  thumbnail: https://raw.githubusercontent.com/you/your-skill/main/assets/preview.png
  gif: https://raw.githubusercontent.com/you/your-skill/main/assets/preview.gif
  alt: "Short description of what the preview shows"
---
```

That's it. When Skill Me ingests your skill, it reads these fields and displays
them in the catalog.

---

## Media fields reference

| Field | Format | Dimensions | Max size | Purpose |
|-------|--------|------------|----------|---------|
| `thumbnail` | PNG, JPG, WebP | 1200×630px | 500 KB | Static preview, OG image |
| `gif` | Animated GIF | 1200×630px | 3 MB | Hover animation in catalog |
| `video` | MP4 or WebM | 1200×630px | 5 MB | Hover video loop (silent) |
| `lottie` | Lottie JSON URL | Any | 200 KB JSON | Vector animation |
| `alt` | Text | — | 125 chars | Screen reader description |

---

## Priority order

Skill Me shows media in this priority:

1. **Video loop** — if `video` is set and GIF is not, video plays on hover
2. **Animated GIF** — plays on hover if set
3. **Static thumbnail** — always shown at rest; shown if no animation exists
4. **Generated placeholder** — if no media, shows your skill's initial letter

---

## Creating a great thumbnail

### Static thumbnail (required)

The static thumbnail is shown:

- At rest in the skill card
- In Open Graph previews when the skill is shared on Twitter/X, Slack, Discord
- In search results

**Specs:**

- 1200 × 630 pixels (2:1 ratio, standard OG image)
- PNG or WebP recommended
- Dark background preferred (matches Skill Me's dark UI)
- Show the skill *doing something* — not a logo or text-only image

**Good thumbnail examples:**

- A before/after showing input vs output
- A screenshot of Claude using the skill
- A diagram of the skill's workflow

**Tools:**

- [Figma](https://figma.com) — free, great for designed thumbnails
- [Carbon](https://carbon.now.sh) — code screenshots
- [Excalidraw](https://excalidraw.com) — diagrams
- [Shots.so](https://shots.so) — browser mockups

---

## Creating an animated GIF preview

The GIF plays when a user hovers over your skill card. A good GIF:

- Shows the skill running in a real Claude session (3–8 seconds)
- Has no audio dependency (GIFs are silent)
- Is loopable — the last frame transitions naturally to the first
- Is under 3 MB (compress aggressively)

### Recommended tools

**Screen recording → GIF:**

- [Kap](https://getkap.co) (macOS) — records screen to GIF/MP4 natively
- [LICEcap](https://www.cockos.com/licecap/) (Win/Mac) — lightweight, direct GIF recording
- [Gifox](https://gifox.app) (macOS) — high quality, loop trimming
- [ScreenToGif](https://www.screentogif.com/) (Windows) — full editing suite

**Optimize your GIF:**

- [Gifsicle](https://www.lcdf.org/gifsicle/) — `gifsicle -O3 --colors 256 input.gif > output.gif`
- [Ezgif](https://ezgif.com/optimize) — web-based optimizer
- [Gifski](https://gif.ski) — highest quality GIF from video

**Target: under 2 MB at 1200×630.** If over, reduce color palette to 128 or crop to 800×420.

### Recording a good GIF walkthrough

1. Open Claude with the skill active
2. Type a prompt that demonstrates the skill
3. Record from when you press Enter to when the output completes
4. Trim any waiting/loading frames
5. Make sure no personal info (API keys, emails, names) is visible
6. Loop seamlessly — pause at the final output

---

## Creating a video preview (MP4/WebM)

Video plays silently on hover and loops. Use this when:

- The skill output is best shown in motion (e.g. an animation skill)
- The preview is too large/complex for a GIF

**Specs:**

- MP4 (H.264) or WebM (VP9)
- 1200×630px, 30fps max
- Under 5 MB
- No audio track (it's muted anyway)
- Maximum 10 seconds — loops after that

**Convert GIF to MP4 (much smaller):**

```bash
ffmpeg -i preview.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" preview.mp4
```

**Screen record directly to MP4:**

- macOS: `⌘ + Shift + 5` → record selected area
- Windows: `Win + G` → Xbox Game Bar → record
- Linux: OBS Studio or `wf-recorder`

---

## Hosting your media

Media must be publicly accessible via HTTPS. Options:

### Option 1: In your GitHub repo (recommended)

Store media in an `assets/` folder in your skill repo:

```
your-skill/
├── SKILL.md
└── assets/
    ├── preview.png     ← static thumbnail
    ├── preview.gif     ← animated preview
    └── preview.mp4     ← video preview
```

Reference with raw GitHub URLs:

```
https://raw.githubusercontent.com/you/your-skill/main/assets/preview.gif
```

**Note:** GitHub raw URLs work but have rate limits for very high traffic. For popular
skills, consider moving to a CDN.

### Option 2: GitHub Releases (no size limits)

Upload media as assets to a GitHub Release. The URL is permanent and CDN-backed:

```
https://github.com/you/your-skill/releases/download/v1.0.0/preview.gif
```

### Option 3: Cloudflare R2 or AWS S3

For production-grade hosting:

```bash
# Cloudflare R2 (free tier: 10 GB)
wrangler r2 object put my-bucket/skills/preview.gif --file=preview.gif --content-type=image/gif

# AWS S3 + CloudFront
aws s3 cp preview.gif s3://my-bucket/skills/ --acl public-read
```

### Option 4: Cloudinary (free tier)

Upload via dashboard or API. Cloudinary auto-optimizes and serves from CDN:

```bash
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload \
  -F "file=@preview.gif" -F "upload_preset=YOUR_PRESET"
```

---

## Lottie animations

For vector animations (crisp at any size, tiny file):

```yaml
media:
  lottie: https://raw.githubusercontent.com/you/your-skill/main/assets/preview.json
```

**Create Lottie animations:**

- [LottieFiles](https://lottiefiles.com) — large free library + editor
- [Adobe After Effects + Bodymovin plugin](https://lottiefiles.com/plugins/after-effects) — professional
- [SVGator](https://www.svgator.com) — browser-based SVG animation → Lottie export
- [Rive](https://rive.app) — interactive animations (exports Lottie-compatible)

**Specs:** Under 200 KB JSON. Loop should be 2–4 seconds.

---

## Full SKILL.md example with media

```markdown
---
name: Git Commit Writer
description: Generates Conventional Commits messages from diffs with scope and breaking change flags.
license: MIT
media:
  thumbnail: https://raw.githubusercontent.com/example/git-commit-skill/main/assets/preview.png
  gif: https://raw.githubusercontent.com/example/git-commit-skill/main/assets/preview.gif
  alt: "Claude generating a conventional commit message from a git diff"
---

# Git Commit Writer

[... rest of skill instructions ...]
```

---

## Skill Me ingestion

When you submit your skill to Skill Me (via PR or the ingest script), the media
fields from your frontmatter are automatically parsed and stored. No additional
configuration needed.

The Skill Me OG image for your skill page will use your `thumbnail` as the
background, making social shares look like this:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   [your thumbnail image]                          Skill Me     │
│                                                                  │
│   Git Commit Writer                              ★ 4.6 · coding │
│   Generates Conventional Commits messages...                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Media checklist

Before submitting your skill with media:

- [ ] Thumbnail is 1200×630px, under 500 KB
- [ ] GIF is under 3 MB, loops cleanly
- [ ] No personal info visible (API keys, emails, names)
- [ ] Video has no audio track
- [ ] Alt text is descriptive (what does the preview show?)
- [ ] URLs are permanent (not localhost, not expiring signed URLs)
- [ ] Media loads over HTTPS
- [ ] Tested on a dark background (Skill Me is dark)

---

## Questions?

Open an issue at https://github.com/aouellets/skillshelf or start a discussion.
