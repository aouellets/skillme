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
    slug: 'skillshelf',
    name: 'SkillShelf',
    category: 'productivity',
    description:
      'Teaches Claude to use the SkillShelf catalog itself — browse, install, and manage skills from any conversation. The first skill on the shelf.',
    author: 'skillshelf',
    source_url: 'https://github.com/aouellets/skillshelf',
    featured: true,
    verified: true,
    tags: ['mcp', 'skills', 'meta', 'productivity'],
    install_count: 240000,
    rating_avg: 5.0,
    rating_count: 3120,
    skill_content: `---
name: SkillShelf
description: Use the SkillShelf catalog from inside any conversation — discover, install, and manage Claude skills through the SkillShelf MCP, and load installed skills automatically each session.
---

# SkillShelf

SkillShelf is the App Store for Claude skills. This skill teaches you how to use
it: how to find skills the user asks for, install them, keep track of what's
installed, and load installed skills at the start of every conversation.

You interact with SkillShelf through its MCP tools. Use them whenever the user
talks about finding, adding, removing, or rating skills — even casually
("got anything for writing cold emails?").

## Load installed skills first

At the start of a conversation, call \`get_active_skills\` once. It returns the
full content of every skill the user has installed. Treat that content as active
instructions for the rest of the session. Do this silently — don't announce it
unless the user asks what's loaded.

## Finding skills

When the user wants a capability ("show me writing skills", "anything for SQL?"),
call \`browse_skills\` with a short query or category. Then summarize the matches
in plain language — name, one-line description, and why each fits. Don't dump raw
JSON. Offer to install the best fit.

- Lead with the single best match, not an exhaustive list.
- If nothing fits well, say so rather than forcing a weak match.

## Installing

When the user says "install it", "add that", or names a skill, call
\`install_skill\` with the skill's slug. Confirm in one line ("Installed
Cold Email Craft — it'll be active next session"). Installed skills activate
automatically in future conversations via \`get_active_skills\`.

## Managing

- \`list_installed\` — show the user what they currently have on their shelf.
- \`uninstall_skill\` — remove a skill the user no longer wants.
- \`rate_skill\` — when the user gives feedback ("this one's great" / "didn't
  help"), offer to record a 1–5 rating so the catalog stays useful.

## Etiquette

- Never install, uninstall, or rate without the user asking for it.
- Confirm destructive actions (uninstalling) before doing them.
- Keep catalog chatter brief — the goal is to get the user a working skill, not
  to narrate the API.`,
  },
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
  {
    slug: 'code-review-checklist',
    name: 'Code Review Checklist',
    category: 'coding',
    description:
      'Comprehensive pull-request review across correctness, security, performance, and developer experience.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['coding', 'code-review', 'quality'],
    install_count: 47000,
    rating_avg: 4.7,
    rating_count: 880,
    skill_content: `---
name: Code Review Checklist
description: Review a diff systematically for correctness, security, performance, and readability — and report findings ordered by severity.
---

# Code Review Checklist

Review the change, not the whole codebase. Read the diff first, then the
surrounding context only where the diff demands it.

## Pass 1 — Correctness
- Does the code do what the PR says it does?
- Edge cases: empty inputs, nulls, zero, very large values, concurrency.
- Error handling: are failures caught, surfaced, and not swallowed silently?
- Off-by-one, boundary conditions, and incorrect comparisons.

## Pass 2 — Security
- Untrusted input validated and escaped (injection, XSS, path traversal).
- No secrets, tokens, or credentials in code or logs.
- AuthN/AuthZ checks present where state changes.

## Pass 3 — Performance
- Obvious N+1 queries or loops doing I/O.
- Unbounded memory or result sets.
- Work that could be cached or batched.

## Pass 4 — Readability & maintainability
- Names say what things are; no surprises.
- The change matches the surrounding style.
- Tests cover the new behavior and the failure paths.
- No unrelated/orthogonal edits sneaking in.

## Reporting

Order findings by severity: blocking → should-fix → nit. For each, give the
location, the problem in one line, and a concrete suggestion. Praise what's
genuinely good — review is also signal, not just defect-finding.`,
  },
  {
    slug: 'sql-query-optimizer',
    name: 'SQL Query Optimizer',
    category: 'coding',
    description:
      'Explains and rewrites slow queries with index recommendations and execution-plan reasoning.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['sql', 'performance', 'database'],
    install_count: 35000,
    rating_avg: 4.6,
    rating_count: 540,
    skill_content: `---
name: SQL Query Optimizer
description: Diagnose slow SQL, explain why it is slow, and rewrite it with the right indexes and query shape.
---

# SQL Query Optimizer

Make queries fast by understanding the plan, not by guessing.

## Diagnose first
- Ask for (or reason about) the EXPLAIN/EXPLAIN ANALYZE output.
- Identify the cost drivers: sequential scans on big tables, nested loops over
  large row counts, sorts that spill, and repeated subquery execution.
- Find the row counts: optimization only matters where the data is large.

## Common fixes
- **Missing index**: add a B-tree index on the columns in WHERE/JOIN/ORDER BY.
  Composite indexes follow the left-to-right rule — order columns by selectivity
  and the query's access pattern.
- **Non-sargable predicates**: avoid wrapping indexed columns in functions
  (\`where date(created_at) = ...\`); rewrite as a range instead.
- **SELECT \***: project only needed columns so the planner can use covering
  indexes.
- **N+1 / correlated subqueries**: rewrite as a JOIN or a single aggregate.
- **OR across columns**: consider UNION of two indexable queries.

## Rules
- Always show the rewritten query AND the index DDL to create.
- Explain the expected plan change in one or two sentences.
- Note the write-side cost of any new index — they are not free.
- Verify with EXPLAIN before claiming a speedup.`,
  },
  {
    slug: 'cold-email-craft',
    name: 'Cold Email Craft',
    category: 'writing',
    description:
      'B2B cold outreach that gets replies: tight personalization, brevity, and a low-friction ask.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['cold-email', 'sales', 'writing'],
    install_count: 41000,
    rating_avg: 4.5,
    rating_count: 610,
    skill_content: `---
name: Cold Email Craft
description: Write short, personalized B2B cold emails with one clear, low-friction call to action.
---

# Cold Email Craft

A cold email earns a reply by respecting the reader's time and making the next
step trivial. Short beats clever.

## Structure (under 90 words)
1. **Opener** — a specific, true observation about *them* (a launch, a hire, a
   post). Never "I hope this finds you well".
2. **Relevance** — one sentence connecting their situation to what you do.
3. **Proof** — one concrete result, with a number, from a comparable company.
4. **Ask** — a single low-friction CTA ("Worth a 15-min call next week?" or
   "Want me to send a 2-min Loom?").

## Rules
- One idea, one ask. No menus of options.
- No jargon, no buzzwords, no "synergy".
- Subject line: 3–5 words, specific, lowercase is fine. No clickbait.
- Personalization must be real — a merge tag that says {{first_name}} only is
  not personalization.
- Mobile-first: it should read in one thumb-scroll.

## Follow-ups
- 3–4 follow-ups, spaced 3–5 days, each adding a *new* angle or proof point —
  never "just bumping this".
- Always make it easy to say no; that builds the relationship for later.`,
  },
  {
    slug: 'tweet-thread-builder',
    name: 'Tweet Thread Builder',
    category: 'writing',
    description:
      'Viral thread structure: a scroll-stopping hook, one idea per post, and cliffhangers that pull readers down.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['twitter', 'threads', 'social'],
    install_count: 52000,
    rating_avg: 4.6,
    rating_count: 770,
    skill_content: `---
name: Tweet Thread Builder
description: Turn an idea into a tight thread — strong hook, one beat per post, momentum to the end.
---

# Tweet Thread Builder

Threads live or die on the first post. Earn each scroll.

## The hook (post 1)
- Promise a specific payoff: a number, a transformation, a contrarian take.
- No preamble. The first line is the whole pitch.
- Patterns: "I did X for N days. Here's what happened." / "Everyone believes X.
  They're wrong." / "N lessons from [hard thing]:"

## The body
- One idea per post. If a post has two ideas, split it.
- Keep momentum: end posts on a small open loop so the reader wants the next.
- Make it concrete — examples, numbers, and specifics over abstractions.
- Use short lines and white space; threads are read on phones.

## The close
- Restate the single takeaway.
- One CTA: follow for more, or a link, or "reply with your version".
- Optional: a one-line summary post people can quote-tweet.

## Rules
- 5–12 posts is the sweet spot. Cut anything that doesn't advance the argument.
- Don't bury the value behind "a thread 🧵" with no substance.
- Read it top to bottom once: if any post makes you want to stop, fix it.`,
  },
  {
    slug: 'landing-page-copy',
    name: 'Landing Page Copy',
    category: 'writing',
    description:
      'Conversion-focused hero, feature, and social-proof copy structured around one core promise.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['copywriting', 'landing-page', 'conversion'],
    install_count: 43000,
    rating_avg: 4.6,
    rating_count: 650,
    skill_content: `---
name: Landing Page Copy
description: Write landing-page copy that leads with one promise and proves it down the page.
---

# Landing Page Copy

A landing page makes one promise and spends the rest of the page making it
believable. Clarity outsells cleverness.

## The hero
- **Headline**: the core promise in plain language — the outcome, not the
  feature. The reader should know what they get in 5 seconds.
- **Subhead**: who it's for and how it works, in one sentence.
- **CTA**: a verb + the value ("Start free", "Get the template"), not "Submit".

## The body, in order
1. **Problem** — name the pain in the reader's own words.
2. **Solution** — how you remove it, framed as outcomes.
3. **Proof** — testimonials, logos, numbers, screenshots.
4. **Objections** — answer the top 2–3 reasons they'd hesitate.
5. **Repeat CTA** — same action, now that they're convinced.

## Rules
- Write to one person, in second person ("you").
- Features → benefits: "encrypted backups" becomes "you never lose your work".
- Specific beats grand: "set up in 3 minutes" beats "incredibly easy".
- Cut adjectives; let the proof carry weight.
- Every section should move the reader one step closer to the CTA.`,
  },
  {
    slug: 'fact-checker',
    name: 'Fact Checker',
    category: 'research',
    description:
      'Multi-source claim verification with explicit confidence scoring and citations.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['fact-check', 'research', 'verification'],
    install_count: 56000,
    rating_avg: 4.7,
    rating_count: 920,
    skill_content: `---
name: Fact Checker
description: Verify claims against multiple independent sources and report a calibrated confidence with citations.
---

# Fact Checker

Treat every claim as unproven until corroborated. Your job is calibrated truth,
not a verdict for its own sake.

## Process
1. **Isolate the claim** — restate it precisely. Vague claims get split into
   checkable parts.
2. **Gather sources** — prefer primary sources (official data, original papers,
   direct statements) over summaries. Find at least two independent ones.
3. **Check independence** — three outlets citing the same wire story is one
   source, not three.
4. **Weigh evidence** — note recency, authority, and any conflict of interest.

## Verdict scale
- **Verified** — multiple strong, independent sources agree.
- **Likely true / Likely false** — leaning, but evidence is thin or mixed.
- **Unverifiable** — no adequate sourcing exists; say so plainly.
- **False** — credible sources contradict it.

## Rules
- Always cite sources with enough detail to find them.
- Separate the factual core from interpretation; check the core.
- State your confidence and *why* — what would change it.
- "I can't verify this" is a valid, honest answer. Never fabricate a citation.`,
  },
  {
    slug: 'email-triage',
    name: 'Email Triage',
    category: 'productivity',
    description:
      'Process an email backlog into clear actions: reply now, defer, delegate, archive, or delete.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['email', 'productivity', 'inbox'],
    install_count: 63000,
    rating_avg: 4.6,
    rating_count: 840,
    skill_content: `---
name: Email Triage
description: Turn an overflowing inbox into a short action list using a fast, consistent decision rule.
---

# Email Triage

Process, don't browse. Touch each message once and decide its fate.

## The decision rule
For each email, in order:
1. **Delete / archive** — no action, no reference value. Most email is this.
2. **Do now** — if a reply takes under two minutes, send it immediately.
3. **Delegate** — someone else owns it; forward with a clear ask and track it.
4. **Defer** — needs real work; turn it into a task with a next action and a
   due date, then archive the email.
5. **Reference** — keep only if you'll genuinely need it; file it.

## Output
When triaging a batch, return:
- **Reply now** — a list with a one-line drafted response each.
- **Delegate** — who, and the forwarded ask.
- **Tasks** — deferred items as next actions with suggested due dates.
- **Archived/deleted** — a count, so the user trusts nothing was lost silently.

## Rules
- Never leave an item in limbo — every email gets a decision.
- Draft replies in the sender's register: brief to brief, formal to formal.
- Flag anything time-sensitive or from a VIP at the top.`,
  },
  {
    slug: 'pandas-expert',
    name: 'Pandas Expert',
    category: 'data',
    description:
      'DataFrame cleaning, merging, reshaping, and grouping with idiomatic, vectorized pandas.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['pandas', 'python', 'data'],
    install_count: 48000,
    rating_avg: 4.7,
    rating_count: 700,
    skill_content: `---
name: Pandas Expert
description: Write correct, vectorized pandas for cleaning, joining, reshaping, and aggregating tabular data.
---

# Pandas Expert

Prefer vectorized, readable pandas over loops. Correctness on messy real data
matters more than cleverness.

## Cleaning
- Inspect first: \`df.info()\`, \`df.describe()\`, \`df.isna().sum()\`, \`df.nunique()\`.
- Fix dtypes early — parse dates with \`pd.to_datetime\`, downcast numerics, use
  \`category\` for low-cardinality strings.
- Handle missing data deliberately: drop, fill, or flag — and say which and why.

## Reshaping & joining
- \`merge\` for SQL-style joins; always state \`how\` and \`on\`, and check row
  counts before/after to catch unintended fan-out.
- \`pivot_table\` to go long→wide, \`melt\` to go wide→long.
- \`groupby().agg({...})\` with named aggregations for clear multi-stat summaries.

## Performance & correctness
- Avoid \`apply\` over rows when a vectorized op or \`np.where\` exists.
- Avoid chained indexing (\`df[a][b] = ...\`); use \`.loc[rows, cols]\`.
- Beware silent dtype upcasts to \`object\` — they kill performance.

## Rules
- Show the transformation step by step with a comment on each.
- Validate joins by asserting expected row counts.
- Never mutate the caller's DataFrame unexpectedly; copy when in doubt.`,
  },
  {
    slug: 'color-accessibility',
    name: 'Color Accessibility',
    category: 'design',
    description:
      'WCAG 2.2 contrast compliance, accessible palettes, and color choices that survive color blindness.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['accessibility', 'color', 'wcag'],
    install_count: 29000,
    rating_avg: 4.6,
    rating_count: 410,
    skill_content: `---
name: Color Accessibility
description: Build color systems that meet WCAG 2.2 contrast and stay legible for color-blind users.
---

# Color Accessibility

Color should never be the only thing carrying meaning, and text must always be
readable.

## Contrast targets (WCAG 2.2)
- Body text: at least **4.5:1** against its background.
- Large text (≥24px, or ≥19px bold): at least **3:1**.
- UI components and focus indicators: at least **3:1** against adjacent colors.
- Always test the *actual* pairing, including text over images and on hover.

## Don't rely on color alone
- Pair color with a label, icon, or pattern (e.g. error = red + icon + text).
- Links in body text need an underline or another non-color cue.
- Charts: use shape, position, or direct labels, not just hue.

## Color-blind safety
- Avoid red/green as the only distinction (8% of men can't separate them).
- Prefer blue/orange palettes; verify with a simulator (deuteranopia,
  protanopia, tritanopia).

## Process
1. Define tokens, then check every text/surface pair against the targets.
2. Fix failures by adjusting lightness, not by nudging hue.
3. Verify focus states and disabled states meet contrast too.
4. Re-check in dark mode — it has its own pairings.`,
  },
  {
    slug: 'go-to-market-planner',
    name: 'Go-To-Market Planner',
    category: 'business',
    description:
      'Launch sequencing, channel selection, and a messaging hierarchy tied to a clear ICP.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['gtm', 'launch', 'strategy'],
    install_count: 44000,
    rating_avg: 4.6,
    rating_count: 560,
    skill_content: `---
name: Go-To-Market Planner
description: Build a focused GTM plan — ICP, positioning, channels, and a sequenced launch — instead of a scattershot.
---

# Go-To-Market Planner

A GTM plan is a series of bets about who you serve, why they switch, and where
you reach them. Make the bets explicit.

## 1. ICP — who, specifically
- Define the ideal customer by firmographics + the trigger that creates urgency.
- Name who you are *not* for — focus is the whole game early.

## 2. Positioning
- The one-line statement: for [ICP] who [need], [product] is the [category] that
  [key benefit], unlike [alternative].
- Anchor against the real alternative (often a spreadsheet or doing nothing).

## 3. Messaging hierarchy
- One core promise, supported by 3 pillars, each with proof.
- Translate features into outcomes the ICP already wants.

## 4. Channels
- Pick 1–2 channels where the ICP already is; don't spread thin.
- For each: the message, the offer, and the success metric.

## 5. Launch sequence
- Pre-launch (build list, design partners) → launch (coordinated, one week) →
  post-launch (nurture, iterate on what converted).

## Rules
- Every choice ties back to the ICP. If it doesn't serve them, cut it.
- Define the one metric that tells you the bet is working.
- Sequence beats simultaneity — concentrate force, then expand.`,
  },
  {
    slug: 'meal-planner',
    name: 'Meal Planner',
    category: 'personal',
    description:
      'Weekly meal plans with balanced macros, a consolidated shopping list, and a batch-prep guide.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['meal-planning', 'health', 'personal'],
    install_count: 38000,
    rating_avg: 4.7,
    rating_count: 590,
    skill_content: `---
name: Meal Planner
description: Produce a realistic weekly meal plan with macros, a grouped shopping list, and a prep schedule.
---

# Meal Planner

Plan meals people will actually cook: realistic effort, sensible nutrition, and
minimal food waste.

## Intake
First confirm: number of people, days to cover, dietary restrictions, calorie or
macro targets (if any), cooking skill/time, budget, and disliked foods. Don't
assume — ask what's missing.

## The plan
- Cover the requested meals per day with variety across the week.
- Reuse ingredients across meals to cut cost and waste (buy a bunch of cilantro,
  use it three ways).
- Balance each day roughly: protein, vegetables, complex carbs, healthy fats.
- Note approximate calories/macros per meal when targets were given.

## Outputs
1. **Day-by-day plan** — each meal with a one-line description and rough macros.
2. **Shopping list** — grouped by store section (produce, protein, pantry,
   dairy), with quantities, deduplicated across the week.
3. **Prep guide** — what to batch on prep day (cook grains, chop veg, marinate)
   so weeknights are fast.

## Rules
- Respect restrictions absolutely (allergies are non-negotiable).
- Keep weeknight meals under the stated time budget; save ambitious cooking for
  weekends.
- Suggest one or two leftovers-as-lunch loops to reduce effort.`,
  },
  {
    slug: 'fitness-program',
    name: 'Fitness Program',
    category: 'personal',
    description:
      'Progressive-overload training with sensible volume, deload weeks, and form-first guidance.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['fitness', 'training', 'personal'],
    install_count: 35000,
    rating_avg: 4.6,
    rating_count: 480,
    skill_content: `---
name: Fitness Program
description: Design a safe, progressive strength program matched to the user's goal, experience, and equipment.
---

# Fitness Program

Build a program the person can sustain. Consistency and progressive overload
beat any single perfect workout.

## Intake
Confirm before programming: goal (strength, hypertrophy, endurance, general
health), experience level, days per week available, equipment, injuries or
limitations, and session length.

## Principles
- **Progressive overload** — add reps, then load, gradually over weeks. Track it.
- **Recovery** — schedule rest days; muscle is built between sessions.
- **Deload** — every 4–6 weeks, cut volume ~40% for a week to recover.
- **Compound first** — squat, hinge, push, pull, carry before isolation work.

## Structure
- Lay out the weekly split (e.g. full-body 3x, or upper/lower 4x).
- Per session: warm-up, main lifts with sets/reps/RPE, accessories, cooldown.
- Define the progression rule explicitly ("add 2 reps; once you hit the top of
  the range across all sets, add load and drop to the bottom").

## Rules
- Form before load — cue the key points and say when to stop a set.
- Stay within the user's equipment and time; don't prescribe a gym they lack.
- Add a clear safety note: stop on sharp pain, and consult a professional for
  injuries. You are not a medical provider.`,
  },
  {
    slug: 'life-coach',
    name: 'Life Coach',
    category: 'personal',
    description:
      'Values clarification, goal setting, and an accountability structure that turns intentions into action.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['coaching', 'goals', 'personal'],
    install_count: 51000,
    rating_avg: 4.7,
    rating_count: 720,
    skill_content: `---
name: Life Coach
description: Help the user clarify values, set meaningful goals, and build a lightweight accountability loop.
---

# Life Coach

Coach by asking, not telling. The user owns the answers; you hold the structure
and the mirror.

## Approach
- Ask open questions before offering frameworks. Listen for what they actually
  want versus what they think they should want.
- Reflect back what you hear, including tensions and avoidance.
- Keep them in the driver's seat — suggest, don't prescribe their life.

## Clarify values
- Surface what matters most with concrete prompts ("describe a recent day that
  felt right — what was present?").
- Distill 3–5 core values; future goals get checked against them.

## Set goals
- Translate a vague wish into one specific, time-bound outcome.
- Break it into the smallest next action that can happen this week.
- Identify the likely obstacle and a pre-committed "if-then" plan for it.

## Accountability
- End each session with: the one action, by when, and how they'll know it's done.
- Next session, review honestly — what happened, what got in the way, adjust.

## Boundaries
- Encourage and challenge; don't flatter.
- This is coaching, not therapy or medical advice. If serious distress surfaces,
  gently point toward a qualified professional.`,
  },
  {
    slug: 'nextjs-app-router',
    name: 'Next.js App Router',
    category: 'coding',
    description:
      'Server components, streaming, and route patterns for the Next.js App Router done right.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['nextjs', 'react', 'app-router'],
    install_count: 44000,
    rating_avg: 4.7,
    rating_count: 720,
    skill_content: `---
name: Next.js App Router
description: Build with the Next.js App Router using server components, correct data fetching, and streaming by default.
---

# Next.js App Router

Default to Server Components; reach for Client Components only when you need
interactivity, state, or browser APIs.

## Core rules
- Mark a file \`'use client'\` only at the leaf that needs it — keep client
  boundaries small so most of the tree stays server-rendered.
- Fetch data in server components with \`async\`/\`await\`; no \`useEffect\` data
  fetching unless it's genuinely client-driven.
- Pass data down as props; don't lift everything into client state.
- Use \`loading.tsx\` and \`<Suspense>\` to stream — show structure fast, fill in
  slow data.
- \`error.tsx\` for route-level error boundaries; \`not-found.tsx\` for 404s.

## Caching & dynamics
- Be explicit: \`export const dynamic = 'force-dynamic'\` for per-request data,
  or rely on static + \`revalidate\` for cacheable content.
- Remember \`fetch\` is cached by default — opt out with \`{ cache: 'no-store' }\`
  when you need fresh data.

## Server Actions
- Use them for mutations; validate input on the server, never trust the client.
- Revalidate affected paths/tags after a mutation.

## Checklist
1. Is this component client-only for a real reason? If not, keep it server.
2. Is there a loading state for every async boundary?
3. Are dynamic vs cached choices explicit, not accidental?`,
  },
  {
    slug: 'docker-compose-wizard',
    name: 'Docker Compose Wizard',
    category: 'coding',
    description:
      'Generate production-ready docker-compose files with healthchecks, volumes, and sane defaults.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['docker', 'devops', 'compose'],
    install_count: 31000,
    rating_avg: 4.5,
    rating_count: 430,
    skill_content: `---
name: Docker Compose Wizard
description: Produce clean, production-minded docker-compose configurations with healthchecks, named volumes, and explicit networking.
---

# Docker Compose Wizard

Write compose files that are reproducible and safe to run, not just ones that
start.

## Defaults to apply
- Pin image tags to specific versions, never \`latest\`.
- Add a \`healthcheck\` to every long-running service so dependents can wait.
- Use \`depends_on\` with \`condition: service_healthy\` for real ordering.
- Persist state in **named volumes**, not bind mounts, for databases.
- Put services on an explicit user-defined network; don't rely on the default.
- Pass secrets via environment from an \`.env\` file — never hardcode them.

## Production hygiene
- Set \`restart: unless-stopped\` for services that should survive crashes.
- Constrain resources where it matters (\`deploy.resources.limits\`).
- Expose only the ports you need; keep internal services internal.
- Run as a non-root user where the image allows.

## Rules
- Explain each non-obvious setting in a comment.
- Provide the matching \`.env.example\` with placeholder values.
- Validate mentally: would \`docker compose up\` work on a clean machine?`,
  },
  {
    slug: 'playwright-testing',
    name: 'Playwright Testing',
    category: 'coding',
    description:
      'Reliable end-to-end browser tests with resilient selectors and no flaky waits.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['playwright', 'testing', 'e2e'],
    install_count: 37000,
    rating_avg: 4.6,
    rating_count: 510,
    skill_content: `---
name: Playwright Testing
description: Write end-to-end Playwright tests that are resilient, readable, and free of flakiness.
---

# Playwright Testing

Tests should fail only when the app is broken — never because of timing.

## Selectors
- Prefer user-facing locators: \`getByRole\`, \`getByLabel\`, \`getByText\`.
- Use \`data-testid\` only when semantics aren't enough.
- Avoid brittle CSS/XPath tied to layout.

## No flaky waits
- Never \`waitForTimeout\` with a magic number.
- Rely on Playwright's auto-waiting and web-first assertions
  (\`await expect(locator).toBeVisible()\`), which retry until true.
- Wait for the condition you care about (a response, a URL, an element), not a
  fixed duration.

## Structure
- One behavior per test; arrange-act-assert.
- Isolate state: reset/seed data so tests don't depend on order.
- Use fixtures for shared setup (auth, base URL).

## Rules
- Make tests deterministic — mock network where the backend is out of scope.
- Name tests by user intent ("user can reset password"), not implementation.
- Run headed locally to debug, headless in CI with traces on failure.`,
  },
  {
    slug: 'technical-blog-engine',
    name: 'Technical Blog Engine',
    category: 'writing',
    description:
      'Long-form technical writing with clear structure, runnable examples, and narrative flow.',
    author: 'walter-writes',
    featured: false,
    verified: true,
    tags: ['blogging', 'technical-writing', 'writing'],
    install_count: 33000,
    rating_avg: 4.6,
    rating_count: 470,
    skill_content: `---
name: Technical Blog Engine
description: Write technical posts that teach — a sharp hook, a logical build, and code the reader can actually run.
---

# Technical Blog Engine

A good technical post takes the reader from "I don't get it" to "I can do it."

## Structure
- **Hook**: the problem and why it matters, in the first paragraph. Promise a
  concrete outcome.
- **Context**: just enough background; link out for the rest.
- **Build**: develop the idea in steps, each with a runnable example.
- **Payoff**: the working result, then the caveats and trade-offs.
- **Next**: where to go from here.

## Code examples
- Every snippet should run as shown, or clearly state what's elided.
- Build complexity incrementally — don't drop a 200-line block.
- Show the output, not just the input.

## Voice
- Write to one curious peer, not a committee.
- Prefer concrete verbs and short sentences; cut hedging.
- Explain the "why" behind choices, not only the "how".

## Before publishing
1. Could a reader reproduce this from the post alone?
2. Is every claim either obvious, demonstrated, or cited?
3. Did I cut every sentence that doesn't earn its place?`,
  },
  {
    slug: 'email-newsletter-pro',
    name: 'Email Newsletter Pro',
    category: 'writing',
    description:
      'Subject lines, structure, and pacing that get newsletters opened and read to the end.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['newsletter', 'email', 'writing'],
    install_count: 36000,
    rating_avg: 4.5,
    rating_count: 500,
    skill_content: `---
name: Email Newsletter Pro
description: Write newsletters with subject lines that earn the open and a body that respects the reader's time.
---

# Email Newsletter Pro

A newsletter competes with the whole inbox. Earn the open, then reward it.

## Subject & preview
- Subject: specific and curiosity-driven, under ~50 characters. No clickbait you
  can't pay off.
- Preview text: extend the subject, don't repeat it.

## Body
- Open with the single most interesting thing — front-load value.
- One core idea per issue; supporting links are secondary.
- Short paragraphs, clear subheads, scannable on a phone.
- A consistent structure each issue builds a reading habit.

## The close
- One clear next step (reply, read, share) — not five.
- Make replying easy; replies train deliverability and build relationship.

## Rules
- Write like a person, not a brand announcement.
- Cut anything that doesn't serve the reader's interest.
- Keep cadence consistent — predictability is a feature.`,
  },
  {
    slug: 'case-study-builder',
    name: 'Case Study Builder',
    category: 'writing',
    description:
      'Customer success stories with the problem → solution → measurable outcome arc.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['case-study', 'marketing', 'writing'],
    install_count: 28000,
    rating_avg: 4.5,
    rating_count: 360,
    skill_content: `---
name: Case Study Builder
description: Turn a customer win into a credible narrative: who, the problem, the solution, and the measurable result.
---

# Case Study Builder

A case study sells by proof, not adjectives. Let the customer and the numbers
do the talking.

## The arc
1. **The customer** — who they are and why a reader like them should care.
2. **The problem** — the pain, in their words, with stakes.
3. **The solution** — what they did, concretely; your role, honestly scoped.
4. **The result** — measurable outcomes (%, time saved, revenue) with a quote.

## Rules
- Lead with the headline result; readers skim.
- Use real numbers; if you can't share exact figures, use ranges, not vagueness.
- Include a direct customer quote that sounds human, not approved-by-legal.
- Keep your product in a supporting role — the customer is the hero.

## Format
- One page. Pull-quote the key metric.
- End with a soft CTA relevant to readers in the same situation.`,
  },
  {
    slug: 'deep-research',
    name: 'Deep Research',
    category: 'research',
    description:
      'Comprehensive research synthesis across many sources with structured findings and citations.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['research', 'synthesis', 'citations'],
    install_count: 49000,
    rating_avg: 4.7,
    rating_count: 690,
    skill_content: `---
name: Deep Research
description: Run a thorough, multi-source research process and synthesize findings into a structured, cited brief.
---

# Deep Research

Go wide, then deep. Triangulate across independent sources and report what you
actually found — including the gaps.

## Process
1. **Frame** — restate the question and define what a good answer looks like.
2. **Map** — list sub-questions; research each rather than the topic as a blob.
3. **Gather** — collect diverse, independent sources; prefer primary ones.
4. **Cross-check** — flag where sources agree, disagree, or are thin.
5. **Synthesize** — answer the original question with the weight of evidence.

## Output
- **Summary**: the answer up top, in a few sentences.
- **Findings**: organized by sub-question, each with citations.
- **Confidence & gaps**: what's well-supported, what's uncertain, what's unknown.
- **Sources**: enough detail to locate each.

## Rules
- Separate evidence from inference; label your inferences.
- Note recency and potential bias of each source.
- Never invent a citation. "Not found" is a legitimate finding.`,
  },
  {
    slug: 'literature-review',
    name: 'Literature Review',
    category: 'research',
    description:
      'Systematic literature review with themes, gaps, and a defensible synthesis.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['academic', 'literature-review', 'research'],
    install_count: 24000,
    rating_avg: 4.6,
    rating_count: 300,
    skill_content: `---
name: Literature Review
description: Produce a structured literature review that organizes the field by theme and surfaces the open gaps.
---

# Literature Review

A literature review is an argument about the state of knowledge, not a list of
summaries.

## Process
1. **Scope** — define the question, inclusion criteria, and timeframe.
2. **Collect** — gather the key works; prioritize seminal and recent papers.
3. **Organize by theme** — group works by approach or finding, not by author.
4. **Synthesize** — for each theme, state the consensus, the disputes, and the
   evidence quality.
5. **Find the gap** — what hasn't been answered? That's the point of the review.

## Output
- Thematic sections, each comparing and contrasting works.
- A synthesis that takes a position on where the field stands.
- An explicit "gaps and future directions" section.
- Accurate citations throughout.

## Rules
- Compare and evaluate; never just summarize one paper after another.
- Note methodology and limitations, not just conclusions.
- Be honest about contradictory evidence.`,
  },
  {
    slug: 'weekly-review',
    name: 'Weekly Review',
    category: 'productivity',
    description:
      'A structured weekly review: clear the inbox, review commitments, and set next week up.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['review', 'productivity', 'planning'],
    install_count: 41000,
    rating_avg: 4.7,
    rating_count: 560,
    skill_content: `---
name: Weekly Review
description: Run a consistent weekly review that empties the inbox, checks every commitment, and plans the week ahead.
---

# Weekly Review

The weekly review is what keeps a productivity system trustworthy. Make it a
repeatable ritual, not a guilt session.

## Get clear
- Empty every inbox: email, notes, messages, the physical desk.
- Process each item to a decision (do, defer, delegate, drop).

## Get current
- Review the calendar: last week (loose ends?) and the next two weeks (prep?).
- Review every open project — does each still have a clear next action?
- Review waiting-for items; nudge anything stalled.

## Get ahead
- Pick the 3–5 outcomes that would make next week a win.
- Block time for the most important, not just the most urgent.
- Scan someday/maybe for anything to activate.

## Rules
- Same time, same checklist, every week — consistency beats intensity.
- Be honest about what didn't get done and why; adjust, don't pile on.
- End with a clear, short plan for Monday.`,
  },
  {
    slug: 'okr-builder',
    name: 'OKR Builder',
    category: 'productivity',
    description:
      'Objectives and Key Results that are ambitious, measurable, and actually tracked.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['okr', 'goals', 'planning'],
    install_count: 35000,
    rating_avg: 4.5,
    rating_count: 420,
    skill_content: `---
name: OKR Builder
description: Draft clear OKRs — a qualitative objective with measurable key results — and a cadence to score them.
---

# OKR Builder

OKRs align effort around outcomes. Keep them few, measurable, and honest.

## Structure
- **Objective**: a qualitative, inspiring goal — where you want to be. Short.
- **Key Results**: 3–5 measurable outcomes that prove the objective is met.
  Each must be a number, not a task.

## Rules
- Key results measure **outcomes** (revenue, retention, NPS), not activity
  (shipped X). "Launched feature" is a task; "30% of users adopt it" is a KR.
- Set them ambitious — ~70% is a good score for stretch OKRs.
- Limit to a handful of objectives; focus is the point.
- Make each KR's owner and current baseline explicit.

## Cadence
- Set quarterly; check in weekly with a confidence score.
- Score at quarter end honestly, then learn from the misses.

## Checklist
1. Could two people disagree on whether a KR was hit? If so, make it measurable.
2. Are these outcomes, or a to-do list in disguise?
3. Is there a baseline and a target for every KR?`,
  },
  {
    slug: 'ab-test-analyzer',
    name: 'A/B Test Analyzer',
    category: 'data',
    description:
      'Statistical significance, confidence intervals, and an honest read of experiment results.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['experimentation', 'statistics', 'data'],
    install_count: 39000,
    rating_avg: 4.6,
    rating_count: 480,
    skill_content: `---
name: A/B Test Analyzer
description: Evaluate an experiment correctly — significance, confidence intervals, and the traps that fake a win.
---

# A/B Test Analyzer

Read experiments like a skeptic. Most "wins" are noise until proven otherwise.

## Analysis
- State the metric, the hypothesis, and the minimum effect that would matter.
- Compute the difference with a **confidence interval**, not just a point.
- Report statistical significance (p-value or Bayesian posterior) AND practical
  significance — a tiny but "significant" lift may not be worth shipping.

## Traps to flag
- **Peeking**: stopping when it looks good inflates false positives. Pre-commit
  the sample size or use sequential methods.
- **Underpowered**: too few samples → can't detect real effects.
- **Multiple comparisons**: testing many metrics finds spurious winners; correct
  for it.
- **Novelty / seasonality**: short tests can mislead.
- **Sample ratio mismatch**: if the split isn't ~50/50, the setup is suspect.

## Output
- Verdict: ship / don't ship / inconclusive — with the interval and the why.
- Be explicit when the honest answer is "we need more data."`,
  },
  {
    slug: 'pricing-strategy',
    name: 'Pricing Strategy',
    category: 'business',
    description:
      'Value-based, competitive, and cost-plus pricing analysis with a defensible recommendation.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['pricing', 'strategy', 'business'],
    install_count: 33000,
    rating_avg: 4.6,
    rating_count: 410,
    skill_content: `---
name: Pricing Strategy
description: Reason about pricing from value, competition, and cost, and land on a structure that fits the business.
---

# Pricing Strategy

Price is positioning. Anchor on the value delivered, then sanity-check against
competition and cost.

## Three lenses
- **Value-based**: what is the outcome worth to the customer? This sets the
  ceiling and the story.
- **Competitive**: what do alternatives charge, and how are you differentiated?
- **Cost-plus**: your floor — never price below sustainable margin.

## Structure choices
- Per-seat, usage-based, tiered, or flat — match how the customer perceives and
  grows value.
- Design tiers around willingness-to-pay segments; gate features that matter to
  larger buyers.
- Keep the entry point low-friction; create a clear reason to move up.

## Rules
- Quantify value in the customer's terms (time saved, revenue gained).
- Avoid pricing on cost alone — it leaves value on the table.
- Recommend one structure with the reasoning, plus what you'd test next.`,
  },
  {
    slug: 'language-learning',
    name: 'Language Learning',
    category: 'personal',
    description:
      'Immersive, spaced-repetition language practice tuned to your level and goals.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['language', 'learning', 'personal'],
    install_count: 38000,
    rating_avg: 4.6,
    rating_count: 520,
    skill_content: `---
name: Language Learning
description: Coach a language learner with comprehensible input, spaced repetition, and speaking practice at the right level.
---

# Language Learning

Drive learning with comprehensible input — material just above the learner's
level — and consistent retrieval.

## Intake
Confirm: target language, current level (roughly A1–C2), goal (travel,
conversation, exam, work), and time per day.

## Method
- **Comprehensible input**: read/listen to content slightly above current level;
  translate sparingly, infer from context.
- **Spaced repetition**: review vocabulary on an expanding schedule; prioritize
  high-frequency words.
- **Output early**: practice speaking/writing from day one, even imperfectly.
- **Error correction**: gently correct, restate the natural form, move on.

## Session shape
- Warm up with review of due cards.
- New input with a few target structures.
- Active use: prompt the learner to produce sentences; correct kindly.
- End with 3–5 new items to add to review.

## Rules
- Calibrate difficulty to keep ~80–90% comprehension — frustration kills habit.
- Encourage daily small reps over rare long sessions.
- Use the target language as much as the level allows.`,
  },
  {
    slug: 'financial-planner',
    name: 'Personal Financial Planner',
    category: 'personal',
    description:
      'Budgeting, debt payoff, and savings planning grounded in the user\'s real numbers.',
    author: 'community',
    featured: false,
    verified: true,
    tags: ['finance', 'budgeting', 'personal'],
    install_count: 46000,
    rating_avg: 4.7,
    rating_count: 640,
    skill_content: `---
name: Personal Financial Planner
description: Help the user build a realistic budget, a debt-payoff plan, and savings goals from their actual numbers.
---

# Personal Financial Planner

Plan from the user's real situation, not a template. Be clear, practical, and
non-judgmental.

## Intake
Gather: take-home income, fixed costs, variable spending, debts (balance, rate,
minimum), savings, and goals (emergency fund, payoff, a purchase).

## Build the plan
- **Budget**: allocate income to needs, wants, and savings; a 50/30/20 split is
  a starting point, not a rule.
- **Emergency fund**: target 3–6 months of essential expenses first.
- **Debt payoff**: avalanche (highest rate first) saves the most; snowball
  (smallest balance first) builds momentum — recommend based on the user.
- **Savings goals**: translate each into a monthly amount and a timeline.

## Rules
- Use the user's actual numbers; show the math.
- Prioritize high-interest debt and a starter emergency fund before investing.
- Flag unrealistic plans honestly and adjust.
- This is general education, not licensed financial advice — suggest a
  professional for complex or tax-specific decisions.`,
  },
]
