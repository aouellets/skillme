# Instagram Trend Post Builder

A weekly Instagram content workflow as a three-skill pack. It separates the three jobs most "AI caption writers" mash together:

1. **Scout** what's actually trending in your niche — without an Instagram API key.
2. **Learn** *why* those trends are working, so you build judgment, not dependence.
3. **Build** an original post around what *you* want to say, packaged ready to ship.

Research → teach → create. Each stage feeds the next, so by the time you're writing a caption you already know what's landing and why.

```
S1 instagram-trend-scout  →  S2 trend-educator  →  S3 instagram-post-builder
   (what's working)            (why it works)         (your post, built)
```

## Skills

| Stage | Skill | What it does |
|-------|-------|--------------|
| S1 | **instagram-trend-scout** | Web-searches your niche for top Reels/carousels. Returns winning formats, hook styles, caption lengths, hashtag patterns, content gaps, and an engagement benchmark. No API required. |
| S2 | **trend-educator** | Translates the scout's data into a plain-language **trend card**: what's working, why (algorithm + psychology + format), and where your opening is. |
| S3 | **instagram-post-builder** | Interviews you one question at a time, then generates a complete post package: 3 hook variants, caption, CTA, 15–20 hashtags, alt text, and a visual direction. |

## Install

### Via SkillMe (recommended)
Install the whole pack so the three skills stay connected:

```
install_pack instagram-trend-post-builder
```

Or grab a single stage:

```
install_skill instagram-trend-scout
install_skill trend-educator
install_skill instagram-post-builder
```

### Manual (Claude Code / Agent Skills)
Copy each skill folder into your skills directory:

```bash
cp -r instagram-trend-post-builder/instagram-trend-scout   ~/.claude/skills/
cp -r instagram-trend-post-builder/trend-educator          ~/.claude/skills/
cp -r instagram-trend-post-builder/instagram-post-builder  ~/.claude/skills/
```

Each skill is a self-contained `SKILL.md` with YAML frontmatter — no dependencies to install.

## Usage walkthrough

A full weekly cycle is one conversation:

**1. Scout the niche**
> "Scout Instagram trends for home baristas this week."

The scout returns a brief and a structured report, then offers to explain it.

**2. Get the briefing**
> "Yes, explain why these are working."

`trend-educator` produces a trend card you can screenshot — the durable *principles* behind the trends, not just the trends themselves.

**3. Build your post**
> "Now help me make a post about my new single-origin Ethiopian beans."

`instagram-post-builder` asks you a few quick questions (message, audience, tone, goal, format), then hands back a copy-paste-ready package.

You can also run any skill standalone — e.g. `instagram-post-builder` works without a scout report (it just asks one extra question to stay on-target).

## How the data flows

The skills share a clean contract so output drops straight into the next input:

- `instagram-trend-scout` → emits `winning_formats`, `winning_hooks`, `content_gaps`, `engagement_benchmark`.
- `trend-educator` → consumes that whole report, emits `trend_summary`, `why_it_works`, `opportunity_angles`.
- `instagram-post-builder` → consumes the brief + your message, emits the final post package.

## Honesty notes

- The scout uses **web search**, not Instagram's private API. Engagement figures are **estimates** with a stated confidence level — never presented as exact metrics.
- Trends fade; the educator deliberately teaches the **transferable principle** behind each one so the pack stays useful after a specific format cools off.

## License

MIT — see each skill's frontmatter. Use, remix, and ship.
