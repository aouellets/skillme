---
name: Trend Educator
slug: trend-educator
description: Turns a raw Instagram trend-scout report into a plain-language briefing that teaches WHY each trend is working — the algorithm mechanics, audience psychology, and format dynamics behind it — and surfaces opportunity angles. Use this right after instagram-trend-scout, when the user has trend data but needs to understand it before creating. Trigger when the user wants trends explained, a trend briefing, or to learn why content is performing.
version: 1.0.0
stage: S2
tags: [instagram, social-media, education, content-strategy, briefing, creator-coaching]
license: MIT
---

# Trend Educator

**Stage: S2 — Teach** (second skill in the Instagram Trend Post Builder flywheel)

Data alone does not change what a creator makes — understanding does. This skill takes the structured report from `instagram-trend-scout` and converts it into a short, jargon-free briefing the user can actually internalize. The goal is that after reading the trend card, the user could explain *why* a format is working to a friend, and reuse the underlying principle even after the specific trend fades.

Teach, do not dump. Every claim ties back to a mechanism: how the Instagram ranking system rewards it, what it does to the viewer's brain, or how the format itself carries attention. No buzzwords without a plain-English unpacking.

## Input Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `scout_report` | object | yes | — | The full output object from `instagram-trend-scout` (`top_content`, `winning_formats`, `winning_hooks`, `content_gaps`, `engagement_benchmark`, plus `keyword`/`time_range`). |
| `depth` | string | no | `"standard"` | Briefing length. One of `"quick"` (summary + top 2 explanations), `"standard"` (full card), `"deep"` (adds extra mechanism detail per trend). |
| `audience_literacy` | string | no | `"beginner"` | How much the user already knows. One of `"beginner"` (define everything), `"intermediate"` (skip basics). Controls how much jargon gets unpacked. |

## Workflow

1. **Validate input.** Confirm `scout_report` is present and contains at least `winning_formats` or `winning_hooks`. If it is empty or malformed, fall back to the error path (see Error Handling) — do not invent trends.
2. **Pick the teachable trends.** Select the 3–5 strongest signals across `winning_formats` and `winning_hooks`, prioritizing items that recurred (`frequency` = common/dominant) and have corroborating `top_content`. If `depth` = `"quick"`, take the top 2.
3. **Write the trend_summary.** Produce 3–5 bullets that state, in plain language, what is working in this niche right now. Each bullet is one sentence a busy creator could read in five seconds. No metrics dumps — translate bands into meaning ("saves are the signal that matters here, not likes").
4. **Explain WHY for each trend.** For every selected trend, write a `why_it_works` entry that names three forces in plain English:
   - **`algorithm_factor`** — what the ranking system rewards about it (e.g. "rewatches and saves push it to non-followers"), stated mechanically, not mystically.
   - **`psychology_factor`** — what it does to the viewer (e.g. "an open loop makes the brain need the resolution, so they finish the video").
   - **`format_mechanics`** — how the format itself carries attention (e.g. "text-on-screen lets it work muted in-feed").
   Unpack any term a `beginner` would not know inline.
5. **Derive opportunity angles.** Combine the `content_gaps` from the scout with the explained trends to produce `opportunity_angles`: specific, do-able angles the user could own. Each angle pairs a *what to say* with the *format to say it in* and *why it should land*.
6. **Build the trend card.** Assemble everything into one internalizable "trend card" — the summary, the why's, and the angles — sized to `depth`.
7. **Sanity check for jargon.** Re-read the briefing. Replace or define any term that a beginner would not understand. If a sentence does not tie to a mechanism, cut it.
8. **Return** the output object and hand `opportunity_angles` + the trend card forward to `instagram-post-builder`.

## Output Schema

```json
{
  "keyword": "string — echoed from the scout report",
  "trend_summary": [
    "string — 3 to 5 plain-language bullets on what is working now (5-second reads)"
  ],
  "why_it_works": [
    {
      "trend": "string — the format or hook being explained",
      "plain_explanation": "string — one-paragraph, no-jargon summary of why it works",
      "algorithm_factor": "string — what the ranking system rewards about it",
      "psychology_factor": "string — the effect on the viewer's attention or emotion",
      "format_mechanics": "string — how the format itself carries or holds attention",
      "transferable_principle": "string — the durable lesson that outlives this specific trend"
    }
  ],
  "opportunity_angles": [
    {
      "angle": "string — a specific thing the user could make/say",
      "format_to_use": "string — reel | carousel | single_image | story",
      "rationale": "string — why this angle should land for this audience now",
      "from_gap": "boolean — true if this angle came from a content_gap the scout found"
    }
  ],
  "confidence_note": "string — restates the scout's confidence so the user weighs the briefing accordingly"
}
```

## Output Format

Render as a single **Trend Card** the user can screenshot and keep:

- **Title:** `🧠 Trend Card — {keyword}`
- **What's working now** — the `trend_summary` bullets.
- **Why it works** — one short block per trend: bold the trend name, then 3 labeled lines (Algorithm · Psychology · Format), then an italic _"Principle: …"_ line for the transferable lesson.
- **Where your opening is** — `opportunity_angles` as a numbered list, each tagged with its `format_to_use`.
- **Read with this in mind** — the `confidence_note` as a closing caveat.
- Close with: `→ Ready to build a post? Tell instagram-post-builder what you actually want to say.`

## Error Handling

- **Empty or missing scout_report:** Do not fabricate trends. Tell the user: "I don't have a trend report to explain yet — run `instagram-trend-scout` first, or paste its output here." Then stop.
- **Low-confidence scout data:** If `engagement_benchmark.confidence` is `"low"`, lead the briefing with that caveat and frame explanations as hypotheses ("this is likely working because…"), not certainties.
- **Thin report (1–2 signals):** Teach what is there honestly rather than padding. Note that the briefing is narrow and suggest re-scouting with a broader keyword.
- **Jargon leak:** If the draft contains an unexplained term for a `beginner` audience, rewrite that section before returning (enforced by Workflow step 7).
- **User asks to skip the teaching:** Offer a one-line "quick" summary and pass straight through to `instagram-post-builder`, but keep the `opportunity_angles` intact so the next stage still has direction.

## Flywheel Connections

- **Fed by:** `instagram-trend-scout` — consumes its full output object as `scout_report`.
- **Feeds into:** `instagram-post-builder` — passes `opportunity_angles` and the trend card so the build stage is grounded in what is working.
- **Part of pack:** Instagram Trend Post Builder (S1 → S2 → S3).
