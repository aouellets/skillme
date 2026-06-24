---
name: Instagram Post Builder
slug: instagram-post-builder
description: Interactively builds a complete, ready-to-post Instagram package — three hook variants, caption body, CTA, a 15-20 hashtag set, alt text, and a visual direction — grounded in a trend briefing but driven by what the USER actually wants to say. Asks one question at a time. Use this as the final step after trend-educator, or whenever someone wants help writing an Instagram post. Trigger when the user wants to build, write, draft, or create an Instagram post or caption.
version: 1.0.0
stage: S3
tags: [instagram, social-media, copywriting, captions, hashtags, content-creation]
license: MIT
---

# Instagram Post Builder

**Stage: S3 — Build** (final skill in the Instagram Trend Post Builder flywheel)

This is where trend awareness becomes an actual post. It takes the trend card from `trend-educator` as *fuel*, but the post is built around the user's own message — the trend informs the packaging, it does not dictate the content. The result is a copy-paste-ready package.

The defining behavior of this skill is **conversational, one question at a time**. Do not interrogate the user with a form. Ask, listen, then ask the next thing — adapting to what they said.

## Input Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `user_message` | string | yes* | — | What the user wants to say / the topic of the post. *If absent, the skill elicits it as the first question rather than failing. |
| `educator_brief` | object | no | — | The output from `trend-educator` (`trend_summary`, `why_it_works`, `opportunity_angles`, `confidence_note`). When present, the build is grounded in these trends. When absent, the skill still works in standalone mode. |
| `tone` | string | no | _(asked)_ | Desired voice (e.g. "warm", "punchy", "expert", "playful"). Elicited if not provided. |
| `audience` | string | no | _(asked)_ | Who the post is for. Elicited if not provided. |
| `cta_goal` | string | no | _(asked)_ | The action the post should drive (e.g. "save it", "comment a word", "visit link in bio", "follow"). Elicited if not provided. |

## Workflow

The skill runs as a short guided interview, then generates. **Ask exactly one question per turn** and wait for the answer before continuing.

1. **Open and orient.** If `educator_brief` is present, lead with one line referencing the opportunity it unlocks ("The scout found that contrarian Reels are landing in your niche — let's use that."). If absent, say you'll build from scratch.
2. **Q1 — The message.** If `user_message` is missing, ask: "What's the one thing you want this post to say or teach?" If it is present, reflect it back in a sentence and confirm before moving on.
3. **Q2 — The audience.** Ask who it's for and what they're struggling with. (Skip if `audience` already supplied.)
4. **Q3 — The tone.** Ask how they want to sound, offering 3 quick options anchored to their brand. (Skip if `tone` supplied.)
5. **Q4 — The goal.** Ask what one action a viewer should take after seeing it (maps to `cta_goal`). (Skip if supplied.)
6. **Q5 — Format pick.** Recommend a `format` from the `opportunity_angles` (or ask, if standalone) and confirm reel vs carousel vs single image — because it changes hook and visual direction.
7. **Confirm the brief.** Echo a one-line summary: message + audience + tone + goal + format. Ask "Build it?" Proceed on confirmation; revise if not.
8. **Generate hooks.** Write **3 distinct hook variants**, each using a different proven pattern from the trend card's `winning_hooks` where available (e.g. one curiosity-gap, one contrarian, one direct-promise). Keep each under ~12 words and front-load the stakes.
9. **Write the caption body.** Open by paying off the chosen hook, deliver the message with one clear idea per line/short paragraph, and write in the agreed `tone` for the stated `audience`. Match caption length to the chosen format.
10. **Write the CTA.** One clear ask aligned to `cta_goal`. Make it specific and low-friction ("comment 'GUIDE' and I'll send it" beats "let me know your thoughts").
11. **Build the hashtag set.** Produce **15–20 hashtags** mixing three tiers: a few broad (high-volume), several mid-size (niche-defining), and a few specific/long-tail (low-competition). Avoid banned or spammy tags. Tie them to the niche from the brief.
12. **Write the alt text.** One to two sentences describing the visual for screen-reader accessibility — literal and descriptive, not keyword-stuffed.
13. **Suggest a visual direction.** Concrete art direction for the chosen format: shot list / slide breakdown, on-screen text placement, and a first-frame or cover idea that matches the hook.
14. **Assemble and deliver** the complete post package as copy-paste blocks (see Output Format).

## Output Schema

```json
{
  "format": "string — reel | carousel | single_image | story",
  "hooks": [
    {
      "variant": "string — pattern name, e.g. 'curiosity-gap'",
      "text": "string — the hook line (on-screen text for reels, first line for static)"
    }
  ],
  "caption_body": "string — the full caption, formatted with line breaks",
  "cta": "string — the single call to action",
  "hashtags": ["string — 15 to 20 tags, '#'-prefixed, mixed reach tiers"],
  "alt_text": "string — 1 to 2 sentence accessibility description",
  "visual_direction": {
    "concept": "string — the core visual idea",
    "shot_or_slides": "string — shot list (reel) or slide-by-slide breakdown (carousel)",
    "on_screen_text": "string — text overlay guidance",
    "cover_idea": "string — first-frame / cover-slide concept tied to the hook"
  },
  "post_brief": {
    "message": "string",
    "audience": "string",
    "tone": "string",
    "cta_goal": "string"
  }
}
```

## Output Format

Deliver as labeled, copy-paste-ready blocks under the header `📦 Post Package — {format}`:

1. **Hooks (pick one)** — the 3 variants as a numbered list, each tagged with its pattern.
2. **Caption** — in a fenced block so the user can copy it cleanly, CTA included as the final line.
3. **Hashtags** — in a fenced block, space-separated, ready to paste.
4. **Alt text** — in a fenced block.
5. **Visual direction** — concept, shots/slides, on-screen text, cover idea as a short bulleted brief.
6. Close with: `Want a second angle, a different tone, or a carousel version? Say the word.`

## Error Handling

- **No user_message:** Don't stall or guess the topic — make eliciting it Q1 (Workflow step 2). The skill is designed to start empty.
- **No educator_brief (standalone use):** Proceed in standalone mode. Ask one extra question about the niche so hooks and hashtags are still targeted, and note that trend-grounding is skipped.
- **Vague answers ("idk", "anything"):** Offer 2–3 concrete options to react to rather than asking the same open question again. Reacting is easier than generating.
- **User abandons mid-interview:** Build the best package you can from what's been gathered so far, clearly mark the assumptions you filled in, and invite the user to refine any field. Never leave them empty-handed.
- **User wants edits after delivery:** Treat the package as a draft. Regenerate only the requested part (e.g. just new hooks) rather than rebuilding everything.
- **Over/under hashtag count:** Always land in the 15–20 range; if the niche is narrow, fill with adjacent and long-tail tags rather than padding with generic ones or dropping below 15.

## Flywheel Connections

- **Fed by:** `trend-educator` — consumes its `opportunity_angles`, `trend_summary`, and `why_it_works` as `educator_brief` to ground the post in working trends.
- **Feeds into:** _(end of cycle — the post ships; next week the loop restarts at `instagram-trend-scout`)._ Optionally hand the published post's performance back into `instagram-trend-scout` as a future signal.
- **Part of pack:** Instagram Trend Post Builder (S1 → S2 → S3).
