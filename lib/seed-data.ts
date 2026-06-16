import type { SkillCategory } from './types'

export interface SeedSkill {
  slug: string
  name: string
  category: SkillCategory
  description: string
  author: string
  source_url?: string
  featured: boolean
  verified: boolean
  tags: string[]
  install_count: number
  rating_avg: number
  rating_count: number
  skill_content: string
}

export const SEED_SKILLS: SeedSkill[] = [
  {
    slug: 'karpathy-behavioral-rules',
    name: 'Karpathy Behavioral Rules',
    category: 'coding',
    description:
      'Four hard rules that stop Claude from silently over-engineering, making wrong assumptions, or touching code it was never supposed to.',
    author: 'multica-ai',
    source_url: 'https://github.com/multica-ai/andrej-karpathy-skills',
    featured: true,
    verified: true,
    tags: ['coding', 'behavior', 'best-practices'],
    install_count: 172000,
    rating_avg: 4.9,
    rating_count: 2140,
    skill_content: `---
name: Karpathy Behavioral Rules
description: Four hard rules that keep Claude honest while writing code — no silent assumptions, no over-engineering, no orthogonal edits, no invented APIs.
---

# Karpathy Behavioral Rules

These four rules apply to every coding task. They are not suggestions. When a
rule would be violated, stop and surface the conflict instead of proceeding.

## Rule 1 — No silent assumptions

When a requirement is ambiguous, do not guess and move on. State the assumption
you would make, mark it explicitly, and ask before building on top of it if the
choice is hard to reverse.

- Name the ambiguity in one sentence.
- Offer the default you would pick and why.
- Only ask when the answer changes what you build.

## Rule 2 — No over-engineering

Build the smallest thing that satisfies the request. Do not add abstraction
layers, config options, or "future-proofing" the user did not ask for.

- No new abstraction until there are three concrete call sites.
- No options nobody requested.
- Prefer deleting code over adding it.
- If you find yourself writing a framework, stop.

## Rule 3 — No orthogonal changes

Touch only the code the task requires. Do not reformat, rename, or "clean up"
unrelated lines in the same change — it hides the real diff and breaks review.

- Keep the diff scoped to the request.
- Unrelated improvements go in a separate, clearly labeled change.
- Match the surrounding style exactly; do not impose your own.

## Rule 4 — No hallucinated libraries or APIs

Never call a function, flag, or package you have not verified exists. If you are
unsure whether an API is real, say so and check before using it.

- Verify imports against what is actually installed.
- Do not invent method names that "should" exist.
- When unsure, read the source or the docs first.
- Prefer the standard library you can confirm over a dependency you cannot.

## Self-check before finishing

Before declaring a task done, confirm:

1. Did I make any assumption I did not surface? (Rule 1)
2. Did I add anything that was not asked for? (Rule 2)
3. Does the diff touch only what it needs to? (Rule 3)
4. Have I verified every API I called actually exists? (Rule 4)

If any answer is uncertain, fix it before reporting completion.`,
  },
  {
    slug: 'anthropic-frontend-design',
    name: 'Frontend Design',
    category: 'design',
    description:
      'Official Anthropic skill. Guides Claude to create distinctive, production-grade UIs — not the default Inter + purple gradient.',
    author: 'anthropics',
    source_url: 'https://github.com/anthropics/skills',
    featured: true,
    verified: true,
    tags: ['design', 'frontend', 'ui', 'official'],
    install_count: 124000,
    rating_avg: 4.8,
    rating_count: 1680,
    skill_content: `---
name: Frontend Design
description: Produce distinctive, production-grade interfaces with intentional typography, color, and layout — never the generic default look.
---

# Frontend Design

Default to design that has a point of view. Generic is a failure mode, not a
safe choice.

## Start with a direction, not a component

Before writing markup, decide the personality in one line: "editorial and
restrained", "dense and technical", "warm and tactile". Every later choice
serves that direction.

## Typography

- Pick a display face with character for headings; pair it with a clean
  workhorse for body. Avoid shipping Inter-on-everything by reflex.
- Establish a real type scale (e.g. 1.250 or 1.333 ratio). Do not eyeball sizes.
- Set body line-height around 1.5–1.65 and constrain measure to 60–75 chars.
- Use one or two weights deliberately; weight is hierarchy.

## Color

- Build from a small token set: one background, 2–3 surface steps, one accent.
- Avoid purple gradients and the generic SaaS palette unless asked.
- Reserve the accent for actions and active states — not decoration.
- Check contrast against WCAG AA for every text/background pair.

## Layout & space

- Use an 8px spacing system; align everything to it.
- Give content room — generous whitespace reads as quality.
- Strong alignment beats centered everything; pick a grid and hold it.
- Establish clear hierarchy: one primary action per view.

## Components

- Buttons: restrained radius, clear primary/secondary distinction, real hover
  and focus states.
- Cards: subtle borders over heavy shadows on dark UIs.
- Inputs: visible focus ring, never rely on placeholder as label.
- Empty states: always designed, never a blank panel.

## Motion

- Animate to clarify, not to impress. 120–200ms, ease-out for entrances.
- Respect \`prefers-reduced-motion\`.

## Before shipping

1. Does this look like a default template? If yes, push it further.
2. Is hierarchy obvious within one second of looking?
3. Are focus, hover, disabled, and empty states all handled?
4. Does it hold up at 375px width?`,
  },
  {
    slug: 'meeting-notes-to-actions',
    name: 'Meeting Notes → Actions',
    category: 'productivity',
    description:
      'Transforms raw meeting notes into structured action items with owners, deadlines, and follow-ups.',
    author: 'community',
    featured: true,
    verified: true,
    tags: ['meetings', 'productivity', 'actions'],
    install_count: 91000,
    rating_avg: 4.7,
    rating_count: 1320,
    skill_content: `---
name: Meeting Notes to Actions
description: Convert messy meeting notes into a clean summary plus a tracked action list with owner, due date, and status.
---

# Meeting Notes → Actions

When given raw meeting notes, transcripts, or bullet dumps, produce a structured
output. Never just reformat — extract decisions and commitments.

## Output structure

Always return these four sections in order:

### 1. Summary
Three to five sentences capturing what was discussed and why it mattered. No
filler.

### 2. Decisions
A list of decisions actually made. Each line: the decision and, if stated, the
rationale. If something was debated but not decided, put it under Open Questions
instead.

### 3. Action items
A table with: Owner · Action · Due · Status. Rules:
- Every action has an owner. If none was named, mark owner as "UNASSIGNED" so it
  is visible.
- Phrase actions as verbs ("Send the pricing draft"), not topics.
- Infer due dates only when explicitly stated; otherwise write "TBD".
- Default status is "Not started".

### 4. Open questions / follow-ups
Anything unresolved, plus who should resolve it.

## Extraction rules

- A commitment ("I'll handle X", "we should do Y by Friday") becomes an action.
- A choice between options that was settled becomes a decision.
- Do not invent owners, dates, or tasks that were not in the notes.
- Preserve names exactly as written.
- Collapse duplicate mentions of the same action into one row.

## Tone

Neutral and factual. You are a recorder, not a participant. Do not editorialize
or add advice unless asked.

## Example action row

| Owner | Action | Due | Status |
|-------|--------|-----|--------|
| Priya | Send revised pricing deck to sales | Fri | Not started |
| UNASSIGNED | Book venue for Q3 offsite | TBD | Not started |`,
  },
  {
    slug: 'linkedin-post-writer',
    name: 'LinkedIn Post Writer',
    category: 'writing',
    description:
      'Viral LinkedIn posts: hook formulas, formatting patterns, and CTAs that actually get engagement.',
    author: 'community',
    featured: true,
    verified: true,
    tags: ['linkedin', 'writing', 'social'],
    install_count: 64000,
    rating_avg: 4.6,
    rating_count: 980,
    skill_content: `---
name: LinkedIn Post Writer
description: Write LinkedIn posts that earn attention — strong hooks, scannable structure, and a clear call to engage.
---

# LinkedIn Post Writer

Write posts built for how people actually read LinkedIn: on a phone, fast, in a
crowded feed.

## The hook (first 2 lines)

The feed truncates after ~2 lines, so the opening must earn the "see more" click.

- Lead with tension, a number, a contrarian claim, or a concrete moment.
- No throat-clearing ("I've been thinking lately...").
- Avoid hashtags in the hook — they read as spam up top.

Hook patterns that work:
- "I [did X]. It [unexpected result]. Here's what I learned."
- "Most people get [topic] wrong. Here's the part they miss."
- "[Number] [thing] in [time]. The breakdown:"

## Structure

- One idea per line. Short lines. Generous line breaks (the white space is the
  format).
- 5–12 short paragraphs, most only 1–2 lines.
- Build toward one takeaway, not five.
- Optional: a simple list with line-break bullets, not markdown bullets.

## Voice

- Conversational, first person, specific.
- Concrete details beat adjectives. "Cut onboarding from 9 days to 2" beats
  "improved onboarding dramatically".
- No buzzword stacking. No "thrilled to announce" unless it's truly an
  announcement.

## The close

End with a single clear call to engage:
- A question that's easy to answer from experience.
- "Agree? What would you add?"
- An offer ("Comment 'guide' and I'll send the template").

## Hashtags

3–5 max, at the very bottom, specific to the topic.

## Before posting checklist

1. Does line 1 make me want to read line 3?
2. Could this be 30% shorter? Cut it.
3. Is there exactly one takeaway?
4. Does the ending invite a comment, not a sale?`,
  },
  {
    slug: 'supermemory',
    name: 'Supermemory',
    category: 'research',
    description:
      'Persistent AI memory with temporal awareness and hybrid RAG. #1 on three major memory benchmarks.',
    author: 'supermemoryai',
    source_url: 'https://github.com/supermemoryai/supermemory',
    featured: true,
    verified: true,
    tags: ['memory', 'rag', 'research'],
    install_count: 16700,
    rating_avg: 4.8,
    rating_count: 410,
    skill_content: `---
name: Supermemory
description: Maintain durable, temporally-aware memory across sessions and retrieve it with hybrid semantic + keyword recall.
---

# Supermemory

Give long-running work a memory that survives across conversations. Capture what
matters, structure it, and recall it precisely when relevant.

## What to remember

Capture stable, reusable facts — not transient chatter:
- Decisions and their rationale ("We chose Postgres over Mongo because...").
- Preferences and constraints ("Always deploy via Vercel", "No external CDNs").
- Entities: people, projects, systems, and how they relate.
- Open threads and their status.

Do NOT memorize secrets, credentials, or one-off scratch values.

## How to store

Each memory is a short, self-contained statement with metadata:
- **fact**: one clear sentence.
- **timestamp**: when it became true.
- **source**: where it came from (conversation, file, decision).
- **tags**: 2–4 topical tags for retrieval.

Temporal awareness matters: when a new fact contradicts an old one, mark the old
one superseded rather than deleting it, and record the transition date.

## How to retrieve (hybrid RAG)

For a query, combine two signals:
1. **Semantic**: meaning-based match against stored facts.
2. **Keyword/lexical**: exact terms, names, identifiers.

Rank by relevance × recency. Prefer the most recent fact when two conflict, and
note that a prior fact was superseded.

## Recall discipline

- Cite the source and date of each recalled fact.
- Distinguish "I remember X (recorded 2026-03)" from inference.
- If memory is empty or thin on a topic, say so rather than confabulating.

## Session routine

- At start: recall facts relevant to the current task.
- During: capture new decisions and constraints as they appear.
- At end: write a 2–3 line summary of what changed.`,
  },
  {
    slug: 'sql-to-insights',
    name: 'SQL to Insights',
    category: 'data',
    description:
      'Turns raw SQL results into business narrative with visualization recommendations.',
    author: 'community',
    featured: true,
    verified: true,
    tags: ['sql', 'data', 'analytics'],
    install_count: 52000,
    rating_avg: 4.6,
    rating_count: 760,
    skill_content: `---
name: SQL to Insights
description: Translate query results into a plain-language business narrative and recommend how to visualize them.
---

# SQL to Insights

Turn rows and columns into something a decision-maker can act on. The audience
is a business stakeholder, not an analyst.

## Process

1. **Understand the question behind the query.** What decision does this data
   inform? State it before interpreting.
2. **Read the result, not just the schema.** Identify the headline number, the
   trend, and the outliers.
3. **Write the narrative.** Lead with the "so what", then support it.
4. **Recommend a visualization** that matches the data shape.

## Narrative structure

- **Headline** (1 sentence): the single most important finding.
- **Context** (1–2 sentences): the trend or comparison that makes it meaningful.
- **Drivers** (bullets): what's pushing the number — segments, periods, outliers.
- **Recommendation** (1–2 sentences): what to do or look at next.

## Visualization guide

Match chart to intent:
- Trend over time → line chart.
- Part-to-whole → stacked bar or, sparingly, a single donut.
- Comparison across categories → horizontal bar, sorted by value.
- Correlation → scatter.
- Distribution → histogram or box plot.
- Single KPI vs target → big number with a delta.

Avoid: 3D charts, dual axes unless unavoidable, pie charts with >4 slices.

## Honesty rules

- Never claim causation from a correlation; say "associated with".
- Call out sample size when it's small.
- Flag when a spike is likely a data quality issue, not a real change.
- If the query can't answer the stated question, say what query would.

## Example output

> **Revenue grew 18% MoM, driven almost entirely by the Enterprise tier.**
> Self-serve was flat. Three accounts account for 60% of the lift, so the
> growth is concentrated and fragile. Recommend a chart of revenue-by-tier over
> the last 6 months, and a watchlist for those three accounts.`,
  },
  {
    slug: 'gtd-system',
    name: 'Getting Things Done',
    category: 'productivity',
    description:
      "David Allen's GTD system encoded for Claude: capture, clarify, organize, reflect, engage.",
    author: 'community',
    featured: false,
    verified: true,
    tags: ['gtd', 'productivity', 'organization'],
    install_count: 72000,
    rating_avg: 4.7,
    rating_count: 1100,
    skill_content: `---
name: Getting Things Done
description: Run the user's tasks through the five-step GTD workflow — capture, clarify, organize, reflect, engage.
---

# Getting Things Done

Help the user maintain a trusted system using David Allen's GTD method. The goal
is a clear head: everything captured, nothing lurking.

## The five steps

### 1. Capture
Collect everything on the user's mind into an inbox. Do not judge or organize
yet — just get it all out. Prompt: "What else is taking up space? Keep going."

### 2. Clarify
Process each item with one question: **Is it actionable?**

- **No** → trash it, file it as reference, or put it on a Someday/Maybe list.
- **Yes** → what's the very next physical action?
  - Takes < 2 minutes → do it now.
  - Delegate → track it on a Waiting For list.
  - Defer → it becomes a next action or a project.

A **project** is any outcome needing more than one action.

### 3. Organize
Sort actions into lists:
- **Next Actions** — concrete, by context (@calls, @computer, @errands).
- **Projects** — outcomes with a defined "done", each with a next action.
- **Waiting For** — delegated items, with who and since when.
- **Calendar** — only things that must happen on a specific day/time.
- **Someday/Maybe** — not now, revisit later.

### 4. Reflect
Run a **Weekly Review**: empty the inbox, review every list, mark completed
items, ensure each project has a next action, scan Someday/Maybe.

### 5. Engage
Choose what to do by context, time available, energy, and priority.

## Operating rules

- Every project must always have a defined next action. If it doesn't, that's the
  first thing to fix.
- Phrase next actions as concrete physical verbs ("Call the dentist"), never
  vague nouns ("Dentist").
- Keep the calendar sacred — only hard, time-specific commitments go there.
- When the user feels overwhelmed, return to Capture. It almost always helps.`,
  },
  {
    slug: 'competitive-intelligence',
    name: 'Competitive Intelligence',
    category: 'research',
    description:
      'Competitor mapping across product, pricing, and positioning. Battle cards ready.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['competitive', 'research', 'strategy'],
    install_count: 38000,
    rating_avg: 4.5,
    rating_count: 520,
    skill_content: `---
name: Competitive Intelligence
description: Map competitors across product, pricing, and positioning and produce sales-ready battle cards.
---

# Competitive Intelligence

Build a clear, current picture of the competitive landscape and turn it into
something sales and product can use.

## Dimensions to map

For each competitor, capture:
- **Positioning**: who they say they're for, and the one promise they lead with.
- **Product**: core capabilities, notable gaps, recent shipped features.
- **Pricing**: model (seat, usage, tiered), entry price, what's gated.
- **Proof**: marquee customers, funding, momentum signals.
- **Weaknesses**: where they're vulnerable — verified, not assumed.

## Method

1. Work from primary sources first: their site, pricing page, docs, changelog,
   public reviews. Cite each claim's source.
2. Separate **fact** (stated on their site) from **inference** (your read).
   Label inferences clearly.
3. Note the date — competitive facts go stale fast.
4. Flag unknowns explicitly instead of guessing.

## Outputs

### Comparison matrix
Rows = competitors, columns = the dimensions above. Keep cells terse.

### Battle card (per competitor)
- **When you'll see them**: which deals they show up in.
- **Their pitch**: how they'll frame it.
- **Where we win**: 2–3 honest, provable advantages.
- **Where they win**: be honest; sales needs to know.
- **Landmines**: questions to plant that expose their weaknesses.
- **Objection handling**: their likely attack → your response.

## Integrity rules

- Never fabricate pricing, customers, or features. "Unknown" is a valid answer.
- Avoid disparagement that can't be backed by a source.
- Update or expire claims older than ~6 months.`,
  },
  {
    slug: 'investor-update-writer',
    name: 'Investor Update Writer',
    category: 'business',
    description:
      'Monthly and quarterly investor updates: traction metrics, team highlights, ask, and forward-looking view.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['investor', 'business', 'writing'],
    install_count: 58000,
    rating_avg: 4.7,
    rating_count: 690,
    skill_content: `---
name: Investor Update Writer
description: Draft crisp monthly or quarterly investor updates that build trust through transparency and a clear ask.
---

# Investor Update Writer

Write updates that investors actually read and that compound trust over time.
The best updates are honest, brief, and consistent.

## Structure

### 1. TL;DR (top, 2–3 lines)
The month in three sentences: headline metric, one win, one challenge. Busy
readers stop here, so make it count.

### 2. Metrics
The 3–5 numbers that define the business, each shown as **current vs prior**
with the delta. Common: revenue/ARR, growth rate, burn, runway, key usage
metric. Keep the same metrics every period so trends are legible.

### 3. Highlights
What went well — shipped product, closed customers, key hires. Specific and
attributable, not vague optimism.

### 4. Lowlights / challenges
What didn't work and what you're doing about it. This section builds the most
trust. Never hide a miss; frame it with the plan to address it.

### 5. The ask
Exactly what you need from investors this period: intros (name the profile),
hiring referrals, advice on a specific decision. Make it easy to act on.

### 6. Looking ahead
The 1–3 priorities for next period.

## Voice & rules

- Direct and unembellished. No hype words, no "crushing it".
- Numbers over adjectives. "Added $40k ARR" beats "strong growth".
- Same format and cadence every time — predictability is the point.
- Lead with the truth, including bad news. Investors fund honesty.
- Keep it to one screen of reading where possible.
- Never invent metrics; if a number is an estimate, say so.

## Tone calibration

Confident but grounded. You're reporting to partners, not pitching strangers.`,
  },
  {
    slug: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    category: 'design',
    description:
      '50+ visual styles, 161 color palettes, 57 font pairings across React, Next.js, SwiftUI, React Native, and more.',
    author: 'nextlevelbuilder',
    source_url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    featured: true,
    verified: true,
    tags: ['design', 'ui', 'ux', 'components'],
    install_count: 89600,
    rating_avg: 4.8,
    rating_count: 1450,
    skill_content: `---
name: UI/UX Pro Max
description: A deep design toolkit — curated visual styles, color systems, and type pairings — applied correctly per platform.
---

# UI/UX Pro Max

A reference toolkit for building polished interfaces across stacks. Use it to
pick a coherent style fast and implement it correctly for the target platform.

## Step 1 — Choose a visual style

Pick ONE direction and commit. Each implies its own color, type, spacing, and
motion language:
- **Editorial** — serif display, high contrast, generous margins.
- **Technical/Dense** — compact, monospace accents, data-first.
- **Soft/Neumorphic** — low contrast, subtle depth. Use sparingly.
- **Brutalist** — raw borders, system type, no shadows.
- **Warm/Tactile** — muted earth tones, rounded but restrained.
- **Glass/Layered** — translucency over depth. Watch contrast.

Generic SaaS (Inter + purple gradient) is a fallback, not a choice. Avoid it
unless asked.

## Step 2 — Build the color system

Work from tokens, never ad-hoc hex values:
- 1 background, 2–3 surface steps, 1 border, 1 accent, semantic success/danger.
- Verify every text/surface pair against WCAG AA (4.5:1 body, 3:1 large).
- Dark mode: lift surfaces with lightness, not pure black-on-black.

## Step 3 — Pair the type

- Display + body pairing chosen for contrast in voice, not just looks.
- One modular scale; no arbitrary sizes.
- Body 15–17px, line-height ~1.6, measure 60–75 chars.

## Step 4 — Implement per platform

- **React / Next.js**: tokens as CSS variables; Tailwind theme extends them.
- **SwiftUI**: an \`Asset\` color set + a \`Theme\` environment object.
- **React Native**: a typed theme object passed via context.
- Keep the token names identical across platforms so the system stays portable.

## Quality bar

1. Responsive and legible at 375px.
2. Focus, hover, disabled, loading, and empty states all designed.
3. Spacing on a consistent 4/8px grid.
4. One primary action per screen.
5. Contrast checked, motion respects reduced-motion.`,
  },
]
