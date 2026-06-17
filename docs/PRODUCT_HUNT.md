# Skill Me — Product Hunt Launch Kit

Everything needed to launch Skill Me on Product Hunt. Save the PH listing as a
draft now; it can be edited until the moment it goes live.

> **Asset status**
> - ✅ `public/ph-thumbnail.png` (240×240) — generated, on-brand
> - ✅ `public/og-default.png` (1200×630) — generated, wired into social cards
> - ⬜ `public/ph-gallery-{1-5}.png` (1270×760) — **must be captured manually** from
>   the live site / claude.ai (see "Gallery images" below). These are real
>   screenshots and cannot be auto-generated.
>
> Regenerate the brand PNGs anytime with: `node scripts/generate-brand-assets.mjs`

---

## Listing

- **Product name:** Skill Me
- **Tagline (≤60 chars):** `The App Store for Claude Skills` (31 chars ✅)
- **Thumbnail:** `public/ph-thumbnail.png` (240×240)
- **Topics:** Artificial Intelligence, Productivity, Developer Tools, Open Source
- **Website:** https://skillshelf-ten.vercel.app
- **GitHub:** https://github.com/aouellets/skillshelf

**Description (≤260 chars):**

```
Browse 300+ curated Claude skills. Connect the MCP once, say "install it" — skills activate in every future conversation. No ZIP files. No terminal. No setup. Open source, MIT licensed.
```

---

## Gallery images (1270×760 each)

Capture at a 1270px viewport width and crop/pad to 1270×760. Save as
`public/ph-gallery-{n}.png`.

1. **Hero** — Homepage: dark UI, "Install intelligence." headline, 6 featured
   skill cards. Label: *Browse the catalog*
2. **Skill detail** — `/skill/karpathy-behavioral-rules`: name, stats, SKILL.md
   preview, "Install via Claude" sidebar. Label: *Install from inside Claude*
3. **Packs** — `/packs` with all pack cards visible. Label: *Skill Packs —
   install a bundle at once*
4. **Claude conversation** — A real claude.ai conversation showing:
   "show me writing skills" → browse_skills response → "install the LinkedIn Post
   Writer skill" → "Installed! This skill will activate in your next session."
   Label: *Install skills conversationally*
5. **Connect page** — `/connect` showing the step-by-step guide with amber step
   numbers. Label: *30-second setup*

---

## First comment (post at 12:01am PT on launch day)

```
Hey PH! 👋 Alex here, maker of Skill Me.

I built this because the Claude skills ecosystem exploded in 2026 — there are now
thousands of community skills on GitHub — but getting them still requires finding
a repo, downloading a file, uploading a ZIP, and repeating for every skill.
That's the developer path. It works but it excludes everyone else.

Skill Me is the consumer path: one MCP connection, then browse and install
from inside Claude in plain English. "Show me writing skills." "Install it."
Done. Skills auto-activate in every future conversation.

**What's in the box:**
- 300+ curated, safety-reviewed skills across 8 categories
- 10 themed skill packs (Engineering Workflow, Solo Founder Stack, etc.)
- Full MCP server (open source, MIT licensed, self-hostable)
- A media guide so skill authors can add animated GIF previews

**What I'd love from you:**
- Try connecting the MCP (takes 30 seconds, link in the hero)
- Tell me what skill you immediately wish existed — I'll add it
- Submit your own skills via GitHub if you've built any

Happy to answer any questions below. Would especially love feedback from anyone
who connects the MCP and actually uses it today.
```

---

## Launch-day tweet thread (schedule for 12:01am PT)

```
🚀 We just launched Skill Me on @ProductHunt!
The App Store for Claude Skills.
Connect one MCP, then say "show me writing skills" or "install the engineering workflow pack."
300+ curated skills. Active in every future conversation.
[PH link]
🧵
---
The problem: the Claude skills ecosystem has EXPLODED in 2026.
Thousands of community skills on GitHub.
But installing them still requires:
→ Find a GitHub repo
→ Read the README
→ Download a file
→ Upload a ZIP
→ Repeat for EVERY skill
That's the developer path.
---
Skill Me is the consumer path.
Connect the MCP once (30 seconds).
Then just say what you want:
"show me skills for writing LinkedIn posts"
"install it"
"install the engineering workflow pack"
Done. Skills activate in every future conversation.
---
What's in the catalog today:
→ 300+ curated, safety-reviewed skills
→ 8 categories (coding, writing, research, productivity...)
→ 10 themed skill packs
→ Full text search
→ Open source (MIT)
[browse link]
---
What makes Skill Me different from claude.ai's built-in skills UI?
claude.ai's built-in: upload a ZIP file. Technical. No discovery.
Skill Me: browse by voice. Install by voice. Zero friction.
It's the difference between a file manager and an App Store.
---
We also built a media guide for skill authors to add GIF previews.
Skills with animated thumbnails get 3x more installs (early data).
[media guide link]
---
If you build Claude skills:
Submit yours at [submit link]
We review and publish within a few days.
Authors get credited and linked back to their GitHub.
---
Try it now → [skillshelf-ten.vercel.app]
And if you can spare 30 seconds, we'd love an upvote on Product Hunt 🙏
[PH link]
```

---

## Pre-launch distribution checklist

- [ ] PH draft created via "Schedule for later"; launch set for a Tue/Wed/Thu at 12:01am PT
- [ ] All 5 gallery images + thumbnail uploaded to the draft
- [ ] 20–30 warm supporters messaged to upvote in the first 2 hours
- [ ] Soft-launch posts live in r/ClaudeAI, Anthropic community, indie/AI Slacks (3–5 days out)
- [ ] Top ~10 skill authors DM'd, offered featured placement for launch-day shares
- [ ] Tweet thread scheduled for 12:01am PT
- [ ] `TEST_FLOW.md` run end-to-end the morning of launch

## Launch-day execution

- 12:01am PT — listing goes live; post first comment; send tweet thread
- 12:05am PT — DM the 10 supporters "we're live, link is [X]"
- First 4 hours — respond to every PH comment within ~5 minutes
- 9am PT — post "X installs in Y hours" update on X if the number is strong
- End of day — thank everyone; post final vote count
