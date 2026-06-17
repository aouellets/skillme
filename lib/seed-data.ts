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
  thumbnail_url?:    string
  thumbnail_gif?:    string
  thumbnail_video?:  string
  thumbnail_lottie?: string
  media_alt?:        string
}

export const SEED_SKILLS: SeedSkill[] = [
  {
    slug: 'skillshelf',
    name: 'Skill Me',
    category: 'productivity',
    description:
      'Teaches Claude to use the Skill Me catalog itself — browse, install, and manage skills from any conversation. The first skill on the shelf.',
    author: 'skillshelf',
    source_url: 'https://github.com/aouellets/skillshelf',
    featured: true,
    verified: true,
    tags: ['mcp', 'skills', 'meta', 'productivity'],
    install_count: 240000,
    rating_avg: 5.0,
    rating_count: 3120,
    skill_content: `---
name: Skill Me
description: Use the Skill Me catalog from inside any conversation — discover, install, and manage Claude skills through the Skill Me MCP, and load installed skills automatically each session.
---

# Skill Me

Skill Me is the App Store for Claude skills. This skill teaches you how to use
it: how to find skills the user asks for, install them, keep track of what's
installed, and load installed skills at the start of every conversation.

You interact with Skill Me through its MCP tools. Use them whenever the user
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
  {
    slug: "caveman-mode",
    name: "Caveman Mode",
    category: "coding",
    description: "Cuts Claude output tokens 65% by stripping narration while keeping every technical fact and code block intact.",
    author: "julius-brussee",
    source_url: "https://github.com/julius-brussee/caveman",
    featured: false, verified: true,
    tags: ["tokens","efficiency","coding"],
    install_count: 72400, rating_avg: 4.7, rating_count: 980,
    skill_content: `---
name: Caveman Mode
description: Maximum technical density, minimum words. Strip narration, keep every fact and code byte.
---
# Caveman Mode
You speak caveman. Short. Dense. Accurate.
## Rules (never break)
- No filler: "The reason this works is" → gone
- No pleasantries: "Great question!" → gone
- No hedging: "You might want to consider" → "Do this:"
- No summaries of what you just said
- Code blocks: full, correct, copy-pasteable
- Facts: every single one preserved
- Error messages: exact, quoted
## Format
- Short declarative sentences
- Bullets over paragraphs
- Code over explanation when both would say the same thing
## Examples
Normal: "The reason your component is re-rendering is likely because you're creating a new object reference on each render cycle. I'd recommend using useMemo to memoize the object."
Caveman: "New object ref each render. Wrap in useMemo."
Normal: "You'll want to make sure to install the dependency first before running the command."
Caveman: "npm install first. Then run."
## When to break caveman
- When imprecision would cause a bug or misunderstanding
- When a single sentence of context prevents a wrong turn
- Never for style — only for correctness`,
  },
  {
    slug: "tdd-expert",
    name: "TDD Expert",
    category: "coding",
    description: "Enforces Red-Green-Refactor discipline: write the failing test first, then the minimum code to pass it.",
    author: "community",
    featured: false, verified: true,
    tags: ["tdd","testing","quality"],
    install_count: 28400, rating_avg: 4.6, rating_count: 390,
    skill_content: `---
name: TDD Expert
description: Enforce strict Red-Green-Refactor. Test first, minimum code to pass, then refactor.
---
# TDD Expert
Write tests before code. No exceptions.
## The cycle
1. **Red**: Write one failing test that describes the desired behavior
2. **Green**: Write the minimum code — ugly, hardcoded, whatever — to make it pass
3. **Refactor**: Clean up with all tests green
## Rules
- Never write production code without a failing test that requires it
- Minimum means minimum: hardcoding the expected return value to pass the test is correct
- One test at a time — no writing ahead
- Refactor only when green
- If you can't write a test for it, the design is wrong
## When TDD is most valuable
- New features with clear requirements
- Bug fixes (write a test that reproduces the bug first)
- Complex business logic
- API contract development
## When TDD is less useful
- Exploratory spikes (throw them away after)
- UI layout changes
- Simple CRUD with no logic
## Test quality rules
- One assertion per test (when possible)
- Test behavior, not implementation
- Tests should read like specifications
- Fast (no I/O in unit tests unless necessary)`,
  },
  {
    slug: "git-commit-writer",
    name: "Git Commit Writer",
    category: "coding",
    description: "Generates conventional commit messages from diffs with scope, breaking change flags, and issue refs.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["git","commits","workflow"],
    install_count: 65200, rating_avg: 4.6, rating_count: 830,
    skill_content: `---
name: Git Commit Writer
description: Write commit messages that follow Conventional Commits exactly and link to issues.
---
# Git Commit Writer
Generate commit messages that follow the Conventional Commits 1.0.0 specification.
## Format
\`\`\`
<type>(<scope>): <description>
[optional body]
[optional footer: BREAKING CHANGE, Closes #issue]
\`\`\`
## Types
- feat: new feature
- fix: bug fix
- docs: documentation only
- style: formatting, no logic change
- refactor: no feature or fix
- test: adding or correcting tests
- chore: build, deps, tooling
- perf: performance improvement
- ci: CI configuration
## Rules
- Subject line ≤ 72 characters
- Imperative mood: "add", not "added" or "adds"
- No period at end of subject
- Scope = the module/component affected
- Body explains WHY, not WHAT (the diff shows what)
- BREAKING CHANGE: footer required for breaking changes
- Reference issues: "Closes #123", "Fixes #456"
## Process
1. Read the diff
2. Identify the primary change (one commit = one concern)
3. Pick the type
4. Identify the scope from the files changed
5. Write the subject as "verb + object"
6. Add body only if the why is non-obvious
7. Add issue refs if known`,
  },
  {
    slug: "pr-description-writer",
    name: "PR Description Writer",
    category: "coding",
    description: "Turns a git diff into a structured pull request description with motivation, changes, and test plan.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["git","pull-request","workflow"],
    install_count: 36200, rating_avg: 4.5, rating_count: 450,
    skill_content: `---
name: PR Description Writer
description: Generate complete pull request descriptions with motivation, changes, and test plan.
---
# PR Description Writer
Write pull request descriptions that reviewers actually read.
## Structure
### What changed
One paragraph. What does this PR do? No "this PR" as the subject.
### Why
One paragraph. The problem being solved. Link the issue if one exists.
### How
A bulleted list of the significant implementation decisions.
One bullet per decision, not one per file changed.
### Testing
How was this tested? Automated tests? Manual steps? Screenshots if UI.
### Notes for reviewers
Anything non-obvious the reviewer should know. Highlight the risky parts.
## Rules
- Write for a reviewer who has zero context
- Technical decisions > file listing
- If you added tests, say what they test
- If you didn't add tests, say why
- Tag breaking changes explicitly
- Keep it scannable — reviewers skim`,
  },
  {
    slug: "readme-generator",
    name: "README Generator",
    category: "coding",
    description: "Generates a complete, professional README from a codebase scan — badges, usage, API docs, contributing guide.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["documentation","readme","open-source"],
    install_count: 49100, rating_avg: 4.6, rating_count: 610,
    skill_content: `---
name: README Generator
description: Generate a complete README.md by reading the codebase, not by guessing.
---
# README Generator
Read the codebase. Write a README that actually describes it.
## Process
1. Scan package.json / pyproject.toml / Cargo.toml for: name, description, version, license, dependencies
2. Read the main entry point to understand what the project does
3. Identify the tech stack
4. Find existing tests to understand the scope
5. Check for existing docs in /docs or inline comments
6. Write the README bottom-up: understand first, write second
## Required sections
- **Title + one-line description** — what it does, not what it is
- **Badges** — build status, version, license (use shields.io)
- **Quick start** — working example in < 5 lines
- **Installation** — exact commands, prerequisites
- **Usage** — the most common use case with a real example
- **API / Configuration** — if the project has one
- **Contributing** — how to run locally, how to submit a PR
- **License**
## Rules
- Every code block must be copy-pasteable and correct
- Don't document features that don't exist yet
- Use the actual project name, not a placeholder
- Quick start must work out of the box`,
  },
  {
    slug: "env-doctor",
    name: "Environment Doctor",
    category: "coding",
    description: "Diagnoses broken dev environments — missing deps, wrong versions, path issues, and env var problems.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["devtools","debugging","environment"],
    install_count: 30200, rating_avg: 4.7, rating_count: 410,
    skill_content: `---
name: Environment Doctor
description: Diagnose and fix broken development environments systematically.
---
# Environment Doctor
Debug environment issues methodically. Start from symptoms, work to root cause.
## Diagnostic order
1. **Node/runtime version** — check .nvmrc, .node-version, engines in package.json
2. **Dependency installation** — node_modules present? lockfile matches?
3. **Environment variables** — .env.local exists? required vars set?
4. **Port conflicts** — is the port already in use?
5. **Permission issues** — file permissions, symlinks, volume mounts
6. **PATH issues** — is the tool actually in PATH?
## Commands to run first
\`\`\`bash
node --version && npm --version  # version check
cat .nvmrc 2>/dev/null || echo "no .nvmrc"
ls node_modules/.bin | head -5   # modules installed?
env | grep -E "(NODE|PORT|DATABASE)" # env vars present?
lsof -i :3000 2>/dev/null        # port in use?
\`\`\`
## Common fixes
- Wrong Node version → nvm use / fnm use
- Missing modules → rm -rf node_modules && npm install
- Env vars missing → cp .env.example .env.local and fill in
- Port in use → kill $(lsof -t -i:3000) or change port
- Permission errors → check file ownership, not just chmod
## Escalation
If the above doesn't resolve it:
1. Check git status — are there uncommitted changes?
2. Pull latest main and re-install
3. Check CI logs for the same failure`,
  },
  {
    slug: "software-architecture",
    name: "Software Architecture",
    category: "coding",
    description: "Applies Clean Architecture, SOLID principles, and domain-driven design to structure new systems and refactors.",
    author: "yusufkaraaslan",
    featured: false, verified: true,
    tags: ["architecture","solid","design-patterns"],
    install_count: 22100, rating_avg: 4.6, rating_count: 290,
    skill_content: `---
name: Software Architecture
description: Design systems with Clean Architecture, SOLID principles, and clear dependency rules.
---
# Software Architecture
Design for change. Every decision is a trade-off — name it.
## Clean Architecture layers (inside → outside)
1. **Entities**: Business objects and rules. No framework dependencies.
2. **Use Cases**: Application-specific business rules. Orchestrate entities.
3. **Interface Adapters**: Controllers, presenters, gateways. Transform data.
4. **Frameworks & Drivers**: UI, DB, web framework. The outer ring.
**Dependency Rule**: Source code dependencies only point inward.
## SOLID applied
- **S**: One reason to change. If two actors own a class, split it.
- **O**: Open for extension, closed for modification. Use interfaces.
- **L**: Subtypes substitutable for their base type. No surprise behavior.
- **I**: Small, specific interfaces over one general one.
- **D**: Depend on abstractions. Pass dependencies in, don't instantiate.
## Decision checklist
- Where does this business rule live? (Entity or Use Case)
- What changes independently? (Separate those)
- What will likely change together? (Keep those together)
- What are the external dependencies? (Wrap them in interfaces)
- How do you test this in isolation?
## Red flags
- Import of framework code in entities or use cases
- Use case that knows about HTTP request/response
- Entity that knows about the database
- Constructor that does work (use factories)`,
  },
  {
    slug: "changelog-generator",
    name: "Changelog Generator",
    category: "coding",
    description: "Generates a Keep a Changelog formatted CHANGELOG.md from git history and PR titles.",
    author: "community",
    featured: false, verified: true,
    tags: ["changelog","git","documentation"],
    install_count: 27300, rating_avg: 4.5, rating_count: 340,
    skill_content: `---
name: Changelog Generator
description: Generate CHANGELOG.md following Keep a Changelog format from git history.
---
# Changelog Generator
Follow keepachangelog.com format exactly.
## Format
\`\`\`markdown
# Changelog
## [Unreleased]
## [1.2.0] - 2026-06-15
### Added
- New feature description (PR #123)
### Changed
- What changed and why
### Fixed
- Bug that was fixed
### Removed
- What was removed
### Deprecated
- What will be removed next version
### Security
- Security fixes always get their own section
\`\`\`
## Rules
- Newest version at top
- Human-readable — not git log output
- Each entry: one line, what changed from a user perspective
- Link PR numbers when available
- "Unreleased" section always present for upcoming changes
- Semantic version from commit type: feat→minor, fix/perf→patch, BREAKING→major
## Process
1. Group commits since last tag by type
2. Translate commit messages to user-facing language
3. Remove internal/chore commits
4. Sort: Added > Changed > Deprecated > Removed > Fixed > Security`,
  },
  {
    slug: "typescript-strict",
    name: "TypeScript Strict Mode",
    category: "coding",
    description: "Enforces TypeScript strict mode discipline — no any, explicit return types, exhaustive switches.",
    author: "community",
    featured: false, verified: true,
    tags: ["typescript","types","quality"],
    install_count: 33800, rating_avg: 4.7, rating_count: 460,
    skill_content: `---
name: TypeScript Strict Mode
description: Write TypeScript as if strict:true is enforced. No escape hatches.
---
# TypeScript Strict Mode
Strict TypeScript or nothing. Every \`any\` is a bug waiting to happen.
## Banned patterns
- \`any\` — use \`unknown\` and narrow, or define the type
- \`as SomeType\` — use type guards or narrowing instead
- \`!.property\` — handle null/undefined explicitly
- \`@ts-ignore\` — fix the type error, don't suppress it
- Implicit \`any\` in function parameters
## Required patterns
- Explicit return types on public functions
- \`unknown\` over \`any\` for truly unknown data (then narrow)
- \`satisfies\` over \`as\` for type assertions
- Discriminated unions over optional properties
- \`const\` assertions for literal types
- Exhaustive switches with \`never\` checks
## Narrowing toolkit
\`\`\`typescript
// Type guard
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x
}
// Exhaustive switch
function handle(action: Action): never {
  switch (action.type) {
    case 'A': return handleA(action)
    case 'B': return handleB(action)
    default: const _exhaustive: never = action; throw new Error()
  }
}
\`\`\`
## Config
tsconfig.json must have: \`"strict": true\` — this enables all strict checks.`,
  },
  {
    slug: "api-design",
    name: "REST API Design",
    category: "coding",
    description: "Designs RESTful APIs with consistent naming, versioning, error codes, and OpenAPI documentation.",
    author: "community",
    featured: false, verified: true,
    tags: ["api","rest","openapi"],
    install_count: 31200, rating_avg: 4.6, rating_count: 400,
    skill_content: `---
name: REST API Design
description: Design REST APIs that are consistent, discoverable, and easy to consume.
---
# REST API Design
APIs are products. Design for the consumer, not the implementation.
## Resource naming
- Plural nouns: /users, /orders, /products
- Nested for ownership: /users/{id}/orders
- Avoid verbs in paths — use HTTP methods instead
- Consistent case: kebab-case for multi-word paths
## HTTP methods
- GET: read, idempotent, no body
- POST: create, returns 201 + Location header
- PUT: full replace, idempotent
- PATCH: partial update (JSON Merge Patch or JSON Patch)
- DELETE: remove, idempotent, returns 204
## Status codes (use correctly)
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict
- 422 Unprocessable Entity (semantic errors)
- 500 Internal Server Error (never expose stack traces)
## Error response shape
\`\`\`json
{
  "error": "validation_error",
  "message": "Email is required",
  "field": "email",
  "request_id": "req_abc123"
}
\`\`\`
## Versioning: URL path (/v1/) for breaking changes
## Pagination: cursor-based preferred over offset for large datasets
## Filtering: query params (?status=active&sort=created_at:desc)`,
  },
  {
    slug: "prompt-engineer",
    name: "Prompt Engineer",
    category: "coding",
    description: "Writes structured prompts with role, context, format, and examples for any LLM task.",
    author: "community",
    featured: false, verified: true,
    tags: ["prompting","llm","ai"],
    install_count: 17200, rating_avg: 4.7, rating_count: 258,
    skill_content: `---
name: Prompt Engineer
description: Build reliable, structured prompts for any LLM task.
---

# Prompt Engineer

Turn a vague request into a prompt that produces consistent, high-quality output.

## Process

1. Clarify the task. State the single objective in one sentence before writing anything.
2. Pick the four blocks: Role, Context, Task, Format. Every prompt should have them.
3. Add 1-3 examples (few-shot) when the output shape is non-obvious.
4. Specify the failure mode: what to do when input is missing or ambiguous.
5. Iterate on real inputs, not imagined ones.

## Structure to follow

\`\`\`text
ROLE: You are a senior <domain> expert.
CONTEXT: <facts the model needs, constraints, audience>
TASK: <imperative, one goal>
FORMAT: Respond as <JSON schema / markdown table / bullets>.
RULES:
- If <field> is missing, return "UNKNOWN" rather than guessing.
- Keep reasoning internal; output only the final result.
\`\`\`

## Rules

- Prefer positive instructions ("respond in JSON") over negative ones ("don't use prose").
- Put the most important constraint last; recency bias makes it stick.
- Pin output format with a literal schema or example, not a description.
- For classification, enumerate the exact allowed labels. Forbid new labels.
- Delimit user-supplied content with XML-style tags so injection can't blur boundaries.
- Ask for structured output (JSON) when a downstream system parses it; ask for markdown when a human reads it.

## Few-shot example

\`\`\`text
Classify sentiment as POSITIVE, NEGATIVE, or NEUTRAL.

Input: "Shipping was fast but the box was crushed."
Output: NEGATIVE

Input: "Exactly what I expected."
Output: NEUTRAL

Input: \${userText}
Output:
\`\`\`

## Edge cases

- Long context: place the question both before and after the documents.
- Refusals on benign tasks: add a one-line justification of legitimate intent.
- Inconsistent JSON: lower temperature, and validate with a schema; retry once on parse failure.
- Hallucinated facts: instruct "only use the provided context; cite the sentence."

## Anti-patterns

- "Be creative and detailed" with no constraints — produces unpredictable length.
- Stuffing ten tasks into one prompt — split into a chain.
- Relying on the model to remember format across a long conversation without restating it.`,
  },
  {
    slug: "seo-optimizer",
    name: "SEO Optimizer",
    category: "coding",
    description: "Audits and rewrites content for search with keyword density, schema markup, and Core Web Vitals.",
    author: "community",
    featured: false, verified: true,
    tags: ["seo","content","marketing"],
    install_count: 21400, rating_avg: 4.5, rating_count: 321,
    skill_content: `---
name: SEO Optimizer
description: Audit and rewrite pages to rank, without keyword stuffing.
---

# SEO Optimizer

Improve organic visibility through content quality, technical signals, and structured data.

## Audit checklist

1. Title tag: 50-60 chars, primary keyword near the front, unique per page.
2. Meta description: 140-160 chars, includes a call to action. Not a ranking factor but drives CTR.
3. One \`<h1>\` per page; logical \`<h2>\`/\`<h3>\` hierarchy.
4. URL slug: short, hyphenated, keyword-bearing, no stop words.
5. Internal links: 2-5 contextual links to related pages with descriptive anchor text.
6. Image \`alt\` text describing the image, not keyword-stuffed.

## Keyword strategy

- Target one primary keyword plus 2-4 semantic variants per page.
- Aim for natural density (~0.5-1.5%). Optimize for topic coverage, not exact-match repetition.
- Map search intent: informational, navigational, transactional. Match content type to intent.
- Answer the query in the first 100 words for featured-snippet eligibility.

## Schema markup

Add JSON-LD in the \`<head>\`:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "\${title}",
  "author": { "@type": "Person", "name": "\${author}" },
  "datePublished": "\${isoDate}"
}
</script>
\`\`\`

Use \`FAQPage\`, \`Product\`, \`BreadcrumbList\`, and \`HowTo\` where they fit the content.

## Core Web Vitals

- LCP under 2.5s: preload the hero image, serve next-gen formats, avoid render-blocking CSS.
- CLS under 0.1: set explicit width/height on images and reserve space for ads/embeds.
- INP under 200ms: break up long tasks, defer non-critical JS.

## Rules

- Never cloak or stuff. Google's helpful-content system penalizes thin, AI-spun pages.
- Each page must serve a distinct intent — consolidate cannibalizing pages.
- Canonicalize duplicates with \`rel="canonical"\`.
- Submit an XML sitemap and keep it under 50k URLs per file.

## Edge cases

- Pagination: use self-referencing canonicals, not \`rel=prev/next\` (deprecated).
- JS-rendered content: ensure server-side rendering or dynamic rendering so crawlers see text.
- Migrations: 301-redirect old URLs one-to-one; never mass-redirect to the homepage.`,
  },
  {
    slug: "regex-master",
    name: "Regex Master",
    category: "coding",
    description: "Writes, explains, and debugs regular expressions with test cases for any language.",
    author: "community",
    featured: false, verified: true,
    tags: ["regex","parsing","validation"],
    install_count: 19800, rating_avg: 4.6, rating_count: 297,
    skill_content: `---
name: Regex Master
description: Author and debug regular expressions with confidence.
---

# Regex Master

Build correct, readable, and safe regular expressions, and explain exactly what they match.

## Process

1. State the language target — JS, PCRE, Python \`re\`, Go RE2 — since features differ.
2. Write 5+ test cases first: matches, near-misses, and adversarial inputs.
3. Build the pattern incrementally, anchoring early.
4. Verify every test case passes before delivering.
5. Annotate the pattern with verbose mode or an inline breakdown.

## Core building blocks

- Anchors: \`^\` start, \`$\` end, \`\\b\` word boundary. Anchor whenever validating a whole string.
- Character classes: \`[a-z0-9_]\`, negation \`[^...]\`, shorthand \`\\d \\w \\s\`.
- Quantifiers: \`*\` \`+\` \`?\` \`{m,n}\`. Prefer lazy \`*?\` when matching up to a delimiter.
- Groups: capturing \`(...)\`, non-capturing \`(?:...)\`, named \`(?<year>\\d{4})\`.
- Lookaround: \`(?=...)\` \`(?!...)\` \`(?<=...)\` \`(?<!...)\`.

## Readable patterns

Use verbose/extended mode for anything non-trivial:

\`\`\`python
import re
pattern = re.compile(r"""
    ^(?P<area>\\d{3})   # area code
    [-.\\s]?
    (?P<prefix>\\d{3})
    [-.\\s]?
    (?P<line>\\d{4})$
""", re.VERBOSE)
\`\`\`

## Rules

- Always anchor validation regexes; an unanchored \`\\d{4}\` matches inside \`abc12345\`.
- Escape literal metacharacters: \`. ^ $ * + ? ( ) [ ] { } | \\\`.
- Use RE2 (Go, re2) for untrusted patterns — it has no catastrophic backtracking.
- Don't parse HTML/JSON/CSV with regex when a real parser exists.

## ReDoS safety

Avoid nested quantifiers over overlapping classes like \`(a+)+\` or \`(\\w+\\s?)+\` — they backtrack exponentially. Rewrite with atomic groups \`(?>...)\` or possessive quantifiers \`\\w++\`, or restructure to be linear.

## Common recipes

- Email (pragmatic): \`^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$\`
- ISO date: \`^\\d{4}-\\d{2}-\\d{2}$\`
- Trim whitespace: replace \`^\\s+|\\s+$\` with empty.
- Extract \`\${var}\` placeholders: \`\\$\\{(\\w+)\\}\`

## Edge cases

- Unicode: use \`\\p{L}\` with the \`u\` flag in JS for letters beyond ASCII.
- Multiline: \`^\`/\`$\` match per line only with the \`m\` flag.
- Dotall: \`.\` skips newlines unless you set the \`s\` flag.`,
  },
  {
    slug: "database-schema",
    name: "Database Schema Designer",
    category: "coding",
    description: "Designs normalized relational schemas with indexes, constraints, and migration strategies.",
    author: "community",
    featured: false, verified: true,
    tags: ["database","sql","schema"],
    install_count: 24600, rating_avg: 4.7, rating_count: 369,
    skill_content: `---
name: Database Schema Designer
description: Design normalized, indexed, migration-friendly relational schemas.
---

# Database Schema Designer

Design schemas that stay correct and fast as data grows.

## Process

1. Model the entities and relationships before touching DDL.
2. Normalize to 3NF, then denormalize deliberately for proven read hotspots.
3. Choose primary keys; pick indexes from real query patterns.
4. Add constraints to make invalid states unrepresentable.
5. Write forward and rollback migrations.

## Keys and types

- Prefer \`BIGINT\` identity or UUIDv7 for primary keys. Avoid UUIDv4 as a clustered key — random inserts fragment the index.
- Use the narrowest correct type. \`TIMESTAMPTZ\` for time, never naive local time.
- Store money as \`NUMERIC(19,4)\`, never float.
- Use enums or a lookup table for fixed value sets.

## Constraints

\`\`\`sql
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status      TEXT NOT NULL CHECK (status IN ('pending','paid','shipped')),
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
\`\`\`

## Indexing rules

- Index foreign keys you join or filter on.
- Composite index column order: equality columns first, then range/sort columns.
- A covering index can serve a query from the index alone — include selected columns.
- Add a partial index for skewed predicates: \`WHERE status = 'pending'\`.
- Every index slows writes; remove unused ones (check \`pg_stat_user_indexes\`).

## Migrations

- One logical change per migration; always reversible.
- For large tables, add columns nullable first, backfill in batches, then add the NOT NULL constraint.
- Create indexes \`CONCURRENTLY\` to avoid locking writes.
- Never rename and reuse a column in the same deploy as code that reads it — split into two deploys.

## Edge cases

- Soft deletes: add \`deleted_at\` and filter; remember unique constraints must include it or use a partial unique index.
- Many-to-many: a join table with a composite PK on both FKs.
- Multi-tenancy: include \`tenant_id\` in every index prefix and unique key.`,
  },
  {
    slug: "oauth-flow",
    name: "OAuth & Auth Flow",
    category: "coding",
    description: "Implements OAuth 2.0, JWT, and session auth correctly with security best practices.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["auth","oauth","security"],
    install_count: 18300, rating_avg: 4.7, rating_count: 274,
    skill_content: `---
name: OAuth & Auth Flow
description: Implement OAuth 2.0, JWT, and sessions securely.
---

# OAuth & Auth Flow

Implement authentication that resists the common, well-documented attacks.

## Choosing a flow

- Web app with backend: Authorization Code + PKCE. Keep tokens server-side.
- SPA or mobile: Authorization Code + PKCE (never Implicit — it's deprecated).
- Service-to-service: Client Credentials.
- Never put a client secret in a browser or mobile binary.

## Authorization Code + PKCE

1. Generate \`code_verifier\` (random 43-128 chars) and \`code_challenge = base64url(sha256(verifier))\`.
2. Redirect to the authorize endpoint with \`state\` (CSRF) and \`code_challenge\`.
3. On callback, verify \`state\` matches, then exchange the code with the \`code_verifier\`.
4. Store tokens in an httpOnly, Secure, SameSite cookie or server session — not localStorage.

\`\`\`text
GET /authorize?response_type=code&client_id=...
  &redirect_uri=...&scope=openid%20email
  &state=\${state}&code_challenge=\${challenge}&code_challenge_method=S256
\`\`\`

## JWT rules

- Validate \`exp\`, \`iss\`, and \`aud\` on every request. Reject \`alg: none\`.
- Pin the expected algorithm (e.g. RS256); never trust the token's own header to pick the verifier.
- Keep access tokens short-lived (5-15 min). Use rotating refresh tokens with reuse detection.
- Don't store sensitive data in the payload — it's only base64, not encrypted.

## Sessions

- Use a server-side session store with a high-entropy opaque session ID.
- Regenerate the session ID on login (prevents fixation).
- Cookies: \`HttpOnly; Secure; SameSite=Lax\` (or \`Strict\` for sensitive actions).

## Rules

- Always check \`redirect_uri\` against an exact allowlist. Open redirects leak codes.
- Hash passwords with Argon2id or bcrypt (cost >= 12). Never roll your own.
- Implement logout that revokes the refresh token server-side.
- Rate-limit and lock out after failed login attempts; log auth events.

## Edge cases

- Token replay: bind refresh tokens to a device/session and detect reuse — revoke the whole family.
- Clock skew: allow a small leeway (60s) when validating \`exp\`/\`nbf\`.
- Multiple tabs: refresh via a single-flight lock to avoid concurrent refresh races.`,
  },
  {
    slug: "websocket-expert",
    name: "WebSocket Expert",
    category: "coding",
    description: "Builds real-time WebSocket systems with reconnection, backoff, and message queuing.",
    author: "community",
    featured: false, verified: true,
    tags: ["websockets","realtime","networking"],
    install_count: 12400, rating_avg: 4.6, rating_count: 186,
    skill_content: `---
name: WebSocket Expert
description: Build resilient real-time WebSocket systems.
---

# WebSocket Expert

Ship real-time connections that survive flaky networks and scale.

## Connection lifecycle

1. Connect with an auth token in the subprotocol or first message — not in the URL (URLs are logged).
2. On open, flush any queued outbound messages.
3. On close/error, reconnect with exponential backoff and jitter.
4. Use heartbeats to detect dead connections that never fire \`close\`.

## Reconnection with backoff

\`\`\`js
let attempt = 0;
function connect() {
  const ws = new WebSocket(url);
  ws.onopen = () => { attempt = 0; flushQueue(ws); };
  ws.onclose = () => {
    const delay = Math.min(30000, 2 ** attempt * 500) + Math.random() * 500;
    attempt++;
    setTimeout(connect, delay);
  };
}
\`\`\`

## Heartbeats

- Send a ping every 20-30s; if no pong within a timeout, force-close and reconnect.
- Server-side, terminate connections that miss N pongs to free resources.

## Message queuing and delivery

- Queue outbound messages while disconnected; cap the queue and drop oldest or surface backpressure.
- Add a monotonic sequence number to detect gaps after reconnect.
- For at-least-once delivery, ack messages and resend unacked ones; make handlers idempotent.

## Rules

- Always send \`wss://\` (TLS). Plain \`ws://\` over the internet is unacceptable.
- Validate and size-limit every inbound frame; never \`eval\` or trust payloads.
- Authenticate on connect and re-check authorization per sensitive message.
- Use rooms/channels server-side; never broadcast to all sockets blindly.

## Scaling

- A single node holds connections in memory; to scale horizontally use a pub/sub backplane (Redis, NATS) so any node can reach any subscriber.
- Sticky sessions or a shared session store are needed if you do per-connection state.

## Edge cases

- Mobile background/foreground: expect frequent disconnects; reconnect aggressively but with jitter to avoid thundering herd.
- Proxies that buffer: send periodic data so intermediaries don't time out idle connections.
- Slow consumers: monitor \`bufferedAmount\`; stop sending or disconnect clients that can't keep up.`,
  },
  {
    slug: "graphql-schema",
    name: "GraphQL Schema",
    category: "coding",
    description: "Designs GraphQL schemas with proper types, resolvers, N+1 prevention, and federation.",
    author: "community",
    featured: false, verified: true,
    tags: ["graphql","api","schema"],
    install_count: 15800, rating_avg: 4.5, rating_count: 237,
    skill_content: `---
name: GraphQL Schema
description: Design GraphQL schemas and resolvers that scale.
---

# GraphQL Schema

Design a schema clients love and a server that doesn't fall over.

## Schema design

1. Model the graph around domain nouns, not your database tables.
2. Use the schema-first SDL as the contract; generate types from it.
3. Prefer non-null (\`!\`) by default; make a field nullable only when null is a real, meaningful value.
4. Return rich object types, not scalars, so the schema can evolve.

\`\`\`graphql
type Query {
  order(id: ID!): Order
}
type Order {
  id: ID!
  status: OrderStatus!
  items: [LineItem!]!
  customer: Customer!
}
enum OrderStatus { PENDING PAID SHIPPED }
\`\`\`

## Pagination

- Use cursor-based connections (Relay spec) for large lists, not offset.
- Expose \`edges { node cursor }\` and \`pageInfo { hasNextPage endCursor }\`.

## Solving N+1

The classic trap: resolving \`items.customer\` fires one query per row. Fix it with DataLoader batching.

\`\`\`js
const customerLoader = new DataLoader(async (ids) => {
  const rows = await db.customers.whereIn('id', ids);
  return ids.map(id => rows.find(r => r.id === id));
});
// resolver:
Order.customer = (order) => customerLoader.load(order.customerId);
\`\`\`

## Rules

- Mutations return a payload type with the mutated entity and a \`userErrors\` list — don't only throw.
- Version by evolving the schema additively; deprecate fields with \`@deprecated(reason: ...)\` instead of removing.
- Enforce a query depth and complexity limit to prevent abusive nested queries.
- Never expose raw database errors; map them to typed, safe messages.

## Federation

- Split the graph by subgraph ownership; use \`@key\` to define entity references.
- Each subgraph owns its fields; the gateway composes them.
- Keep entities resolvable by their key in every subgraph that extends them.

## Edge cases

- Authorization: enforce per-field, not just per-resolver entry point.
- Caching: GraphQL POST defeats HTTP caching — use persisted queries or response caching keyed on the query+variables.
- Errors mid-list: use partial results with \`errors\` array rather than failing the whole response.`,
  },
  {
    slug: "monorepo-expert",
    name: "Monorepo Expert",
    category: "coding",
    description: "Structures monorepos with Turborepo or Nx — shared packages, CI caching, dependency management.",
    author: "community",
    featured: false, verified: true,
    tags: ["monorepo","turborepo","nx"],
    install_count: 14200, rating_avg: 4.6, rating_count: 213,
    skill_content: `---
name: Monorepo Expert
description: Structure and scale monorepos with Turborepo or Nx.
---

# Monorepo Expert

Make many packages build fast, share code cleanly, and keep CI green.

## Layout

\`\`\`text
apps/        deployable apps (web, api, mobile)
packages/    shared libraries (ui, config, utils)
\`\`\`

- Apps consume packages; packages never import from apps.
- Each package has its own \`package.json\`, build output, and clear public entry.

## Workspace setup

- Use workspaces (pnpm/npm/yarn) so internal packages resolve by name.
- Reference internal deps with \`workspace:*\` (pnpm) to pin to the local version.
- Hoist shared dev tooling (eslint, tsconfig base) into a \`config\` package.

## Task pipeline (Turborepo)

\`\`\`json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["build"], "outputs": [] },
    "lint":  { "outputs": [] }
  }
}
\`\`\`

\`^build\` means "build dependencies first." Declare \`outputs\` so caching works.

## Caching

- Cache keyed on input file hashes + task config. Identical inputs skip the task.
- Enable remote cache so CI and teammates share results — this is the biggest speedup.
- Never cache tasks with undeclared inputs (env vars, network); declare them as cache inputs.

## Affected-only CI

- Run only packages affected by the diff: \`turbo run test --filter=...[origin/main]\` or \`nx affected\`.
- This keeps PR CI time roughly constant as the repo grows.

## Rules

- One lockfile at the root; never per-package lockfiles.
- Pin the package manager version with \`packageManager\` in root \`package.json\`.
- Keep a single TypeScript version; use project references for incremental builds.
- Enforce import boundaries (Nx tags / eslint rules) so layers don't tangle.

## Edge cases

- Circular dependencies: detect with \`madge\` or Nx graph; break by extracting shared types.
- Versioning published packages: use Changesets for independent semver and changelogs.
- Docker builds: copy only the needed workspace with \`turbo prune\` to keep images small.`,
  },
  {
    slug: "web-performance",
    name: "Web Performance",
    category: "coding",
    description: "Audits and fixes Core Web Vitals — LCP, CLS, INP — with concrete code changes.",
    author: "community",
    featured: false, verified: true,
    tags: ["performance","web","cwv"],
    install_count: 22100, rating_avg: 4.7, rating_count: 331,
    skill_content: `---
name: Web Performance
description: Diagnose and fix Core Web Vitals with concrete changes.
---

# Web Performance

Make pages fast on real devices and pass Core Web Vitals.

## Measure first

1. Use field data (CrUX, RUM) for what users experience; lab data (Lighthouse, WebPageTest) to debug.
2. Test on a throttled mid-tier phone and 4G — not your laptop.
3. Track LCP, CLS, and INP at the 75th percentile.

## LCP (target < 2.5s)

- Identify the LCP element (usually the hero image or headline).
- Preload it: \`<link rel="preload" as="image" href="hero.webp" fetchpriority="high">\`.
- Serve AVIF/WebP, correctly sized via \`srcset\`/\`sizes\`.
- Eliminate render-blocking CSS/JS; inline critical CSS, defer the rest.
- Use a CDN and good cache headers; reduce TTFB with server caching.

## CLS (target < 0.1)

- Set explicit \`width\`/\`height\` (or \`aspect-ratio\`) on images, videos, and iframes.
- Reserve space for ads, embeds, and late-loading banners.
- Load web fonts with \`font-display: swap\` and preload the primary font to avoid layout shift.
- Never insert content above existing content after load.

## INP (target < 200ms)

- Break long tasks (> 50ms) with \`scheduler.yield()\` or chunking.
- Defer non-critical JS; remove unused third-party scripts.
- Debounce expensive handlers; move heavy work to a Web Worker.
- Use CSS for animation instead of JS where possible.

## Rules

- Ship less JavaScript — it's the dominant cost. Code-split per route.
- Lazy-load below-the-fold images with \`loading="lazy"\`.
- Audit third parties; each tag adds main-thread cost and risk.
- Re-measure after every change; don't trust intuition.

## Quick wins

\`\`\`html
<img src="hero.webp" width="1200" height="630" fetchpriority="high" alt="...">
<script src="analytics.js" defer></script>
\`\`\`

## Edge cases

- SPA route changes: instrument soft navigations; CWV now considers them.
- Hydration cost: prefer streaming SSR and islands to reduce main-thread blocking.
- Cache busting: hash filenames and set long \`max-age, immutable\` on static assets.`,
  },
  {
    slug: "accessibility-audit",
    name: "Accessibility Audit",
    category: "coding",
    description: "Reviews UI for WCAG 2.2 compliance — focus management, ARIA, keyboard nav, color contrast.",
    author: "community",
    featured: false, verified: true,
    tags: ["a11y","accessibility","wcag"],
    install_count: 19500, rating_avg: 4.7, rating_count: 293,
    skill_content: `---
name: Accessibility Audit
description: Audit and fix UI against WCAG 2.2.
---

# Accessibility Audit

Make interfaces usable by keyboard, screen reader, and low-vision users.

## Audit process

1. Tab through the entire page using only the keyboard. Everything interactive must be reachable and operable.
2. Run an automated pass (axe) to catch the ~30% it can detect.
3. Test with a screen reader (VoiceOver/NVDA) for the rest.
4. Check at 200% zoom and 400% reflow.

## Semantic HTML first

- Use native elements: \`<button>\`, \`<a href>\`, \`<nav>\`, \`<main>\`, \`<label>\`. They come with built-in roles and keyboard behavior.
- Reach for ARIA only when no native element fits. The first rule of ARIA: don't use ARIA.

## Keyboard and focus

- Visible focus indicator on every focusable element — never \`outline: none\` without a replacement.
- Logical tab order following the visual order; avoid positive \`tabindex\`.
- Trap focus inside modals; restore focus to the trigger on close.
- WCAG 2.2: focus must not be entirely hidden behind sticky headers (Focus Not Obscured).

## ARIA correctly

\`\`\`html
<button aria-expanded="false" aria-controls="menu">Options</button>
<ul id="menu" hidden>...</ul>
\`\`\`

- Keep \`aria-expanded\`/\`aria-selected\` state in sync with reality.
- Use \`aria-live="polite"\` regions to announce async updates.
- Label controls: \`<label>\`, \`aria-label\`, or \`aria-labelledby\`.

## Color and contrast

- Text contrast >= 4.5:1 (3:1 for large text). UI components and graphics >= 3:1.
- Never convey meaning by color alone — add text or icons.

## WCAG 2.2 additions

- Target size: interactive targets at least 24x24 CSS px (with spacing exceptions).
- Dragging movements need a single-pointer alternative.
- Accessible authentication: don't require memory/transcription puzzles.

## Rules

- Every image: meaningful \`alt\`, or \`alt=""\` if decorative.
- Form errors: associate messages with fields via \`aria-describedby\`; don't rely on color.
- Don't disable zoom (\`user-scalable=no\` is an accessibility violation).

## Edge cases

- Custom widgets (comboboxes, tabs): follow the WAI-ARIA Authoring Practices keyboard model exactly.
- Animations: respect \`prefers-reduced-motion\`.
- Skip link: provide a "skip to content" link as the first focusable element.`,
  },
  {
    slug: "error-handling",
    name: "Error Handling",
    category: "coding",
    description: "Designs robust error handling strategies — typed errors, error boundaries, observability hooks.",
    author: "community",
    featured: false, verified: true,
    tags: ["errors","reliability","typescript"],
    install_count: 17800, rating_avg: 4.6, rating_count: 267,
    skill_content: `---
name: Error Handling
description: Design typed, observable, recoverable error handling.
---

# Error Handling

Treat errors as a first-class part of the design, not an afterthought.

## Principles

1. Distinguish expected failures (validation, not-found) from bugs (nulls, type errors).
2. Model expected failures as values; let truly exceptional bugs throw.
3. Fail fast and loud in development; degrade gracefully in production.
4. Every error that reaches a user should be actionable; every error logged should be diagnosable.

## Typed errors

\`\`\`ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

class NotFoundError extends Error {
  readonly code = 'NOT_FOUND';
  constructor(readonly resource: string) { super(\\\`\${resource} not found\\\`); }
}
\`\`\`

- Give each error a stable \`code\` for programmatic handling and i18n.
- Use a Result type at API boundaries so callers must handle the error path.
- Never swallow errors with an empty \`catch {}\`.

## Boundaries

- Wrap independent units (a request, a React subtree, a job) in a boundary that catches, logs, and renders a fallback.
- A boundary should never re-throw silently; it owns the recovery decision.

## Observability hooks

- Attach context (request id, user id, inputs) when capturing, not at the throw site only.
- Log at the boundary once, not at every layer — duplicate logs hide the real cause.
- Send to an error tracker with grouping by \`code\` + stack; alert on new error types and rate spikes.

## Retries

- Retry only idempotent, transient failures (network, 5xx, timeouts) with exponential backoff + jitter.
- Cap attempts; add a circuit breaker so a dead dependency doesn't amplify load.
- Never retry on 4xx validation errors.

## Rules

- Preserve the cause chain: \`new Error(msg, { cause })\`.
- Don't leak internals (stack traces, SQL) to clients; return a safe message + correlation id.
- Validate input at the edge so the core can assume well-formed data.
- Make cleanup run on every path (\`finally\`, defer, context managers).

## Edge cases

- Async: unhandled promise rejections crash Node — add a global handler that logs and exits cleanly.
- Partial failures in batch jobs: collect per-item errors and continue; report a summary.
- Error in the error handler: keep the fallback path dependency-free and simple.`,
  },
  {
    slug: "microservices",
    name: "Microservices Design",
    category: "coding",
    description: "Designs microservice boundaries, inter-service communication, and data consistency strategies.",
    author: "community",
    featured: false, verified: true,
    tags: ["microservices","architecture","distributed"],
    install_count: 13600, rating_avg: 4.5, rating_count: 204,
    skill_content: `---
name: Microservices Design
description: Design service boundaries, communication, and consistency.
---

# Microservices Design

Split a system into services only where the boundaries pay for themselves.

## When (and when not)

- Start with a modular monolith. Extract a service when a module needs independent scaling, deployment, or ownership.
- Premature microservices add network latency, partial failure, and operational overhead for no benefit.

## Defining boundaries

- Align services to business capabilities (bounded contexts), not technical layers.
- A service owns its data exclusively; no other service touches its database.
- Aim for high cohesion inside, loose coupling across. If two services always change together, they're one service.

## Communication

- Synchronous (REST/gRPC) for request/response where the caller needs an immediate answer.
- Asynchronous (events/queues) for workflows and to decouple — prefer this for resilience.
- Define contracts explicitly (OpenAPI/protobuf/AsyncAPI) and version them.

\`\`\`text
Order Service --(OrderPlaced event)--> Inventory Service
                                   --> Notification Service
\`\`\`

## Data consistency

- You can't have distributed transactions cheaply — use the Saga pattern with compensating actions.
- Use the Outbox pattern to publish events atomically with the local DB write.
- Embrace eventual consistency; design UIs to tolerate it.
- Make consumers idempotent; deduplicate by event id.

## Resilience

- Timeouts on every remote call; never wait indefinitely.
- Circuit breakers to stop hammering a failing dependency.
- Retries with backoff + jitter for transient errors only.
- Bulkheads: isolate resource pools so one slow dependency doesn't exhaust threads.

## Rules

- No shared database. Shared DB = distributed monolith.
- Propagate a correlation/trace id across every hop.
- Keep services independently deployable; backward-compatible contract changes only.

## Edge cases

- Read-heavy cross-service views: build a read model (CQRS) fed by events rather than synchronous fan-out.
- Schema evolution: additive, tolerant readers; never break existing event consumers.
- Service discovery and config: externalize; don't hardcode endpoints.`,
  },
  {
    slug: "caching-strategy",
    name: "Caching Strategy",
    category: "coding",
    description: "Designs multi-layer caching — CDN, server, database — with invalidation and stampede prevention.",
    author: "community",
    featured: false, verified: true,
    tags: ["caching","performance","redis"],
    install_count: 16200, rating_avg: 4.6, rating_count: 243,
    skill_content: `---
name: Caching Strategy
description: Design correct multi-layer caching.
---

# Caching Strategy

Add caching where it helps, and keep it correct under invalidation and load.

## Layers

1. Browser/CDN: cache static and cacheable responses near the user.
2. Application: in-memory or Redis for computed results and hot objects.
3. Database: query cache, materialized views, read replicas.

Cache as close to the consumer as correctness allows.

## Patterns

- Cache-aside (lazy): on miss, load from source, store, return. Most common.
- Read-through / write-through: cache sits inline with the store.
- Write-behind: buffer writes, flush async (risk of loss).

\`\`\`text
get(key):
  v = cache.get(key)
  if v is None:
     v = db.load(key)
     cache.set(key, v, ttl=...)
  return v
\`\`\`

## Invalidation

- Prefer TTL for data that can be slightly stale.
- Event-based invalidation (delete/update key on write) for must-be-fresh data.
- Version keys (\`user:123:v2\`) to invalidate whole sets at once.
- Never cache without an expiry escape hatch.

## Stampede prevention

When a hot key expires, many requests rebuild it at once.

- Single-flight lock: only one request recomputes; others wait or serve stale.
- Add random jitter to TTLs so keys don't expire simultaneously.
- Serve-stale-while-revalidate: return the old value and refresh in the background.

## HTTP caching

- \`Cache-Control: public, max-age=31536000, immutable\` for hashed static assets.
- \`ETag\`/\`If-None-Match\` for conditional revalidation of dynamic content.
- \`stale-while-revalidate\` to hide refresh latency.

## Rules

- Never cache user-specific data in a shared/public cache (auth leak risk).
- Choose a sane eviction policy (LRU/LFU) and size the cache; monitor hit rate.
- Measure: a low hit rate cache just adds latency and complexity.

## Edge cases

- Cache penetration (missing keys queried repeatedly): cache negative results briefly.
- Big-key/hot-key in Redis: shard or replicate the hot value.
- Consistency across nodes: accept eventual consistency or use pub/sub invalidation.`,
  },
  {
    slug: "kubernetes-basics",
    name: "Kubernetes Basics",
    category: "coding",
    description: "Writes production-ready K8s manifests — Deployments, Services, ConfigMaps, health checks.",
    author: "community",
    featured: false, verified: true,
    tags: ["kubernetes","devops","containers"],
    install_count: 18900, rating_avg: 4.5, rating_count: 284,
    skill_content: `---
name: Kubernetes Basics
description: Write production-ready Kubernetes manifests.
---

# Kubernetes Basics

Write manifests that are safe, observable, and self-healing.

## Core objects

- Deployment: manages replica Pods and rolling updates.
- Service: stable network endpoint for a set of Pods.
- ConfigMap/Secret: configuration and credentials, injected as env or files.
- Ingress: HTTP routing into the cluster.

## A solid Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: registry/api:1.4.2
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }
          readinessProbe:
            httpGet: { path: /healthz, port: 8080 }
            initialDelaySeconds: 5
          livenessProbe:
            httpGet: { path: /healthz, port: 8080 }
\`\`\`

## Health checks

- Readiness: gate traffic until the pod can serve. Without it, rollouts route to cold pods.
- Liveness: restart a hung pod. Keep it cheap and dependency-free.
- Startup probe for slow-booting apps so liveness doesn't kill them early.

## Rules

- Always set resource requests and limits — without requests the scheduler can't place pods well; without limits one pod can starve the node.
- Pin image tags by digest or immutable version; never \`:latest\` in production.
- Set \`replicas >= 2\` and a PodDisruptionBudget for availability during node drains.
- Store secrets in a Secret (or external secrets manager), never in the image or ConfigMap.

## Rollouts

- Use \`RollingUpdate\` with \`maxUnavailable\` and \`maxSurge\` tuned for capacity.
- Keep deployments idempotent and declarative; apply via GitOps.

## Edge cases

- Graceful shutdown: handle SIGTERM and respect \`terminationGracePeriodSeconds\`; drain connections.
- Zero-downtime: readiness probe + preStop sleep so the endpoint is removed before the process exits.
- Config changes: ConfigMap updates don't restart pods — roll the deployment or use a checksum annotation.`,
  },
  {
    slug: "terraform-expert",
    name: "Terraform Expert",
    category: "coding",
    description: "Writes idiomatic Terraform with modules, state management, and safe upgrade paths.",
    author: "community",
    featured: false, verified: true,
    tags: ["terraform","iac","devops"],
    install_count: 22400, rating_avg: 4.7, rating_count: 336,
    skill_content: `---
name: Terraform Expert
description: Write idiomatic, safe, modular Terraform.
---

# Terraform Expert

Manage infrastructure declaratively with reproducible, reviewable changes.

## Project structure

\`\`\`text
modules/        reusable building blocks (vpc, ecs-service)
environments/   per-env roots (dev, staging, prod) wiring modules
\`\`\`

- Keep environments thin: they call modules and pass variables.
- A module exposes \`variables.tf\`, \`outputs.tf\`, and \`main.tf\` with no hardcoded env values.

## State

- Use a remote backend (S3 + DynamoDB lock, or Terraform Cloud) — never local state for shared infra.
- One state file per environment; never share state across envs.
- State holds secrets in plaintext — encrypt the backend and lock down access.
- Never edit state by hand; use \`terraform state mv\`/\`import\` for refactors.

## Idiomatic patterns

\`\`\`hcl
variable "instance_count" {
  type    = number
  default = 2
  validation {
    condition     = var.instance_count > 0
    error_message = "instance_count must be positive."
  }
}

resource "aws_instance" "app" {
  count         = var.instance_count
  instance_type = var.instance_type
  tags          = merge(local.common_tags, { Name = "app-\${count.index}" })
}
\`\`\`

## Rules

- Pin provider and module versions; use \`~>\` constraints and commit the lockfile.
- Always run \`terraform plan\` and review it in PRs before apply.
- Tag everything; use a \`common_tags\` local for consistency.
- Use \`for_each\` over \`count\` when items have stable identities (avoids destroy/recreate churn).
- Mark sensitive outputs \`sensitive = true\`.

## Safe upgrades

- Bump provider versions one minor at a time; read the upgrade guide.
- Use \`terraform plan\` to detect destroy-and-recreate; add \`lifecycle { prevent_destroy = true }\` on critical resources.
- Test changes in dev/staging before prod.

## Edge cases

- Drift: run plan regularly; reconcile manual changes back into code.
- Secrets: source from a secrets manager via data sources, don't hardcode.
- Large blast radius: split monolithic state into smaller, independently-applied stacks.`,
  },
  {
    slug: "observability-stack",
    name: "Observability Stack",
    category: "coding",
    description: "Instruments applications with structured logs, metrics, and distributed traces.",
    author: "community",
    featured: false, verified: true,
    tags: ["observability","monitoring","telemetry"],
    install_count: 14800, rating_avg: 4.6, rating_count: 222,
    skill_content: `---
name: Observability Stack
description: Instrument apps with logs, metrics, and traces.
---

# Observability Stack

Instrument systems so you can answer "what's wrong and why" from telemetry.

## The three signals

- Logs: discrete events with context. Use for debugging specifics.
- Metrics: aggregated numbers over time. Use for dashboards and alerts.
- Traces: the path of a request across services. Use to find latency and failure source.

Adopt OpenTelemetry so instrumentation is vendor-neutral.

## Structured logs

\`\`\`json
{ "level": "error", "msg": "payment failed", "trace_id": "abc", "user_id": 42, "amount_cents": 999 }
\`\`\`

- Always JSON, never free text. Include \`trace_id\` to correlate with traces.
- Standard fields: timestamp, level, service, trace_id, span_id.
- Log at boundaries; avoid logging in hot loops. Never log secrets or PII.

## Metrics

- Instrument the RED method for services: Rate, Errors, Duration.
- Use the USE method for resources: Utilization, Saturation, Errors.
- Use histograms for latency (so you can compute p50/p95/p99), counters for events, gauges for levels.
- Keep label cardinality low — high-cardinality labels (user_id) blow up the metrics store.

## Traces

- Propagate context (W3C \`traceparent\`) across every service hop and async boundary.
- Span each meaningful operation; add attributes (db.statement, http.status).
- Sample intelligently: head-sample a percentage, tail-sample to keep all errors/slow traces.

## Alerting

- Alert on symptoms users feel (error rate, latency SLO burn), not raw causes (CPU).
- Use SLOs and error budgets; page only on actionable, urgent conditions.
- Every alert needs a runbook link.

## Rules

- One correlation id flows through logs, metrics exemplars, and traces.
- Don't measure everything — instrument the critical paths and golden signals first.
- Keep dashboards few and meaningful; one per service showing RED.

## Edge cases

- Async/queues: propagate trace context in the message metadata.
- Batch jobs: emit start/finish metrics and duration; alert on missed runs.
- Cardinality explosions: drop or aggregate offending labels at the collector.`,
  },
  {
    slug: "swift-ui",
    name: "SwiftUI Expert",
    category: "coding",
    description: "Builds SwiftUI views with proper state management, animations, and accessibility.",
    author: "community",
    featured: false, verified: true,
    tags: ["swift","ios","swiftui"],
    install_count: 16100, rating_avg: 4.6, rating_count: 241,
    skill_content: `---
name: SwiftUI Expert
description: Build clean, performant, accessible SwiftUI views.
---

# SwiftUI Expert

Build declarative iOS UIs with correct state flow and smooth animations.

## State management

Pick the right property wrapper:

- \`@State\` — local, view-owned, value-type state.
- \`@Binding\` — a two-way reference to state owned elsewhere.
- \`@Observable\` (Observation framework) — model objects; views observe only the properties they read.
- \`@Environment\` — dependency injection down the tree.

\`\`\`swift
@Observable final class CounterModel { var count = 0 }

struct CounterView: View {
  @State private var model = CounterModel()
  var body: some View {
    Button("Count: \\(model.count)") { model.count += 1 }
  }
}
\`\`\`

## View composition

- Keep \`body\` small; extract subviews for reuse and to scope invalidation.
- Pass minimal data into subviews so only the affected views re-render.
- Use \`@ViewBuilder\` helpers instead of giant nested closures.

## Animations

- Drive animation from state: \`withAnimation { model.expanded.toggle() }\`.
- Prefer \`.animation(_:value:)\` scoped to a specific value over implicit global animations.
- Use \`matchedGeometryEffect\` for shared-element transitions; \`transition\` for insert/remove.

## Lists and performance

- Use \`LazyVStack\`/\`List\` for large collections so rows render on demand.
- Give items stable \`id\`s; unstable ids cause flicker and lost state.
- Avoid heavy work in \`body\`; compute in the model.

## Accessibility

- Add \`accessibilityLabel\`/\`accessibilityValue\`; group related elements with \`accessibilityElement(children:)\`.
- Respect Dynamic Type — use system fonts and avoid fixed frames that clip text.
- Support \`reduceMotion\` and sufficient contrast.

## Rules

- Never mutate state during \`body\` evaluation — it loops or warns.
- Do async work in \`.task {}\`, which cancels on disappear, not \`onAppear\` + Task.
- Keep models testable and free of view types.

## Edge cases

- Long-lived state: lift it above the view that can disappear, or it resets.
- Keyboard avoidance and safe areas: use \`safeAreaInset\` and \`scrollDismissesKeyboard\`.
- Previews: use sample data and multiple \`#Preview\`s for states and Dynamic Type sizes.`,
  },
  {
    slug: "react-native-pro",
    name: "React Native Pro",
    category: "coding",
    description: "Builds production React Native apps — navigation, performance, native modules, EAS builds.",
    author: "community",
    featured: false, verified: true,
    tags: ["react-native","mobile","expo"],
    install_count: 24300, rating_avg: 4.6, rating_count: 365,
    skill_content: `---
name: React Native Pro
description: Build and ship production React Native apps.
---

# React Native Pro

Ship reliable cross-platform mobile apps with good performance and DX.

## Project setup

- Prefer Expo with the managed/prebuild workflow and EAS for builds and OTA updates.
- Use the New Architecture (Fabric + TurboModules) for new apps.
- TypeScript everywhere; strict mode on.

## Navigation

- Use React Navigation (native stack) or Expo Router (file-based).
- Type your routes and params so navigation is checked at compile time.
- Lazy-load heavy screens; keep the initial route light for fast cold start.

\`\`\`tsx
<Stack.Screen name="Profile" component={ProfileScreen} />
// navigate('Profile', { userId })
\`\`\`

## Performance

- Use \`FlatList\`/\`FlashList\` for long lists; never \`map\` thousands of items in a ScrollView.
- Provide \`keyExtractor\`, \`getItemLayout\` when possible, and memoized row components.
- Memoize with \`React.memo\`, \`useCallback\`, \`useMemo\` to cut re-renders.
- Run animations on the UI thread with Reanimated worklets; avoid JS-driven \`Animated\` for gestures.
- Optimize images: correct resolution, caching, and \`expo-image\`.

## Native modules

- Reach for a native module only when JS can't do it. Check the ecosystem first.
- With the New Architecture, write TurboModules with a codegen spec for type-safe bridging.
- Keep the bridge chatty-free: batch calls and pass primitives, not large objects per frame.

## EAS builds and releases

- Configure \`eas.json\` profiles: development, preview, production.
- Use OTA updates for JS-only changes; submit a store build for native changes.
- Manage secrets via EAS secrets, not committed env files.

## Rules

- Handle platform differences with \`Platform.select\`, not copy-paste branches.
- Test on real low-end Android devices — the JS thread is the bottleneck.
- Catch errors with an error boundary and report to a crash service (Sentry).

## Edge cases

- Deep links and universal links: configure and test both platforms.
- Background tasks and notifications: respect OS limits; use Expo Notifications.
- App size: enable Hermes, remove unused locales/assets, and audit dependencies.`,
  },
  {
    slug: "rust-patterns",
    name: "Rust Patterns",
    category: "coding",
    description: "Writes idiomatic Rust with ownership, lifetimes, error handling, and performance patterns.",
    author: "community",
    featured: false, verified: true,
    tags: ["rust","systems","performance"],
    install_count: 13200, rating_avg: 4.7, rating_count: 198,
    skill_content: `---
name: Rust Patterns
description: Write idiomatic, safe, fast Rust.
---

# Rust Patterns

Write Rust that satisfies the borrow checker and reads cleanly.

## Ownership and borrowing

- Pass \`&T\` to read, \`&mut T\` to mutate, take \`T\` to consume. Default to borrowing.
- One mutable borrow XOR many shared borrows — design APIs so they don't fight this.
- Return owned values from constructors; accept borrows in functions that only read.
- Reach for \`Rc\`/\`Arc\` + \`RefCell\`/\`Mutex\` only when shared ownership is genuinely needed.

## Lifetimes

- Most lifetimes are elided. Annotate only when the compiler can't infer the relationship.
- Prefer owning data in structs over storing references with lifetimes; it's simpler and avoids self-referential headaches.

## Error handling

\`\`\`rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

fn load(path: &str) -> Result<String, AppError> {
    Ok(std::fs::read_to_string(path)?)
}
\`\`\`

- Use \`Result\` + \`?\` for recoverable errors; \`panic!\` only for unrecoverable bugs.
- \`thiserror\` for libraries (typed errors), \`anyhow\` for applications (context-rich).
- Avoid \`.unwrap()\` in production paths; use \`?\`, \`expect\` with a reason, or handle the case.

## Idiomatic patterns

- Prefer iterators and combinators (\`map\`, \`filter\`, \`collect\`) over index loops.
- Use \`Option\`/\`Result\` combinators (\`map\`, \`and_then\`, \`ok_or\`) instead of nested matches.
- Implement \`From\` for conversions; derive \`Debug\`, \`Clone\`, \`PartialEq\` where sensible.
- Newtype wrappers for domain types to get type safety for free.

## Performance

- Avoid needless \`clone()\` — borrow or move. Profile before optimizing.
- Use \`&str\` over \`String\`, \`&[T]\` over \`Vec<T>\` in function signatures.
- Pre-allocate with \`Vec::with_capacity\` when the size is known.

## Rules

- Let the type system enforce invariants; make illegal states unrepresentable.
- Keep \`unsafe\` tiny, justified by a comment, and wrapped in a safe API.
- Run \`clippy\` and \`fmt\` in CI.

## Edge cases

- Async: pick one runtime (Tokio); don't block the executor with sync I/O.
- Self-referential structs: use indices or \`Pin\`, not raw references.
- Trait objects vs generics: generics for performance, \`dyn\` for heterogeneity.`,
  },
  {
    slug: "python-async",
    name: "Python Async",
    category: "coding",
    description: "Writes correct asyncio code — event loops, tasks, cancellation, sync/async bridging.",
    author: "community",
    featured: false, verified: true,
    tags: ["python","async","asyncio"],
    install_count: 19700, rating_avg: 4.6, rating_count: 296,
    skill_content: `---
name: Python Async
description: Write correct, non-blocking asyncio code.
---

# Python Async

Use asyncio correctly: concurrency without blocking the event loop.

## Mental model

- One event loop runs many coroutines cooperatively on a single thread.
- \`await\` yields control; CPU-bound or blocking calls freeze the entire loop.
- Concurrency comes from running tasks, not from awaiting sequentially.

## Running things concurrently

\`\`\`python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(fetch(url1))
        tg.create_task(fetch(url2))
    # both complete here; exceptions propagate as a group

asyncio.run(main())
\`\`\`

- Prefer \`asyncio.TaskGroup\` (3.11+) for structured concurrency — it cancels siblings on failure.
- Use \`asyncio.gather\` when you need the list of results; pass \`return_exceptions=True\` to collect failures.

## Cancellation

- Cancelling a task raises \`CancelledError\` at the next await point.
- Never swallow \`CancelledError\` — re-raise it after cleanup.
- Protect critical cleanup with \`try/finally\`; use \`asyncio.shield\` sparingly for must-finish work.
- Add timeouts with \`async with asyncio.timeout(5):\`.

## Bridging sync and async

- Run blocking/CPU work off the loop: \`await asyncio.to_thread(blocking_fn, arg)\`.
- For heavy CPU, use a \`ProcessPoolExecutor\` via \`loop.run_in_executor\`.
- Call async from sync only at the top level via \`asyncio.run\`; don't nest event loops.

## Rules

- Never call blocking I/O (requests, time.sleep, sync DB drivers) inside a coroutine — use async libraries or \`to_thread\`.
- Don't create the loop manually; use \`asyncio.run\`.
- Keep references to background tasks or they may be garbage-collected mid-flight.
- Use \`async with\`/\`async for\` for async context managers and iterators.

## Concurrency control

- Bound parallelism with \`asyncio.Semaphore\` to avoid overwhelming a service.
- Use an \`asyncio.Queue\` for producer/consumer pipelines.

## Edge cases

- Fire-and-forget: store the task and add a done callback that logs exceptions.
- Mixing libraries: ensure all I/O libs are async-compatible (aiohttp, asyncpg, httpx).
- Debugging: enable \`PYTHONASYNCIODEBUG=1\` to catch slow callbacks and un-awaited coroutines.`,
  },
  {
    slug: "security-audit",
    name: "Security Audit",
    category: "coding",
    description: "Reviews code for OWASP Top 10 vulnerabilities with concrete fix recommendations.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["security","owasp","audit"],
    install_count: 25800, rating_avg: 4.8, rating_count: 387,
    skill_content: `---
name: Security Audit
description: Review code against the OWASP Top 10 with fixes.
---

# Security Audit

Find and fix the vulnerabilities that actually get exploited.

## Process

1. Map trust boundaries: where untrusted input enters the system.
2. Trace each input to where it's used (query, command, HTML, file path).
3. Check authentication and authorization on every sensitive action.
4. Give a concrete, minimal fix for each finding, with severity.

## OWASP Top 10 checks

- Broken access control: verify object-level authorization (IDOR). Don't trust IDs from the client.
- Injection: use parameterized queries; never concatenate user input into SQL/shell/LDAP.
- Cryptographic failures: TLS everywhere, no secrets in code, strong password hashing (Argon2id/bcrypt).
- Insecure design: rate limits, lockouts, and abuse cases designed in, not bolted on.
- Security misconfiguration: disable debug, lock down CORS, set security headers.
- Vulnerable components: scan dependencies; pin and patch.
- Auth failures: secure session management, MFA, no credential stuffing exposure.
- Integrity failures: verify update sources; avoid unsafe deserialization.
- Logging failures: log security events without logging secrets; alert on anomalies.
- SSRF: validate and allowlist outbound URLs; block internal metadata endpoints.

## Concrete fixes

\`\`\`python
# Vulnerable: SQL injection
cur.execute("SELECT * FROM users WHERE email = '" + email + "'")
# Fixed: parameterized
cur.execute("SELECT * FROM users WHERE email = %s", (email,))
\`\`\`

## XSS and output encoding

- Encode output for its context (HTML, attribute, JS, URL).
- Use framework auto-escaping; avoid \`dangerouslySetInnerHTML\`/\`innerHTML\` with user data.
- Set a Content-Security-Policy to limit script sources.

## Rules

- Validate input on the server (allowlist), even if the client validates too.
- Least privilege for DB users, tokens, and cloud roles.
- Set headers: \`Strict-Transport-Security\`, \`X-Content-Type-Options: nosniff\`, \`Content-Security-Policy\`.
- Never roll your own crypto; use vetted libraries.

## Edge cases

- Mass assignment: bind only allowed fields, not the whole request body.
- Path traversal: canonicalize and confine file paths to a base directory.
- Timing attacks: use constant-time comparison for secrets/tokens.`,
  },
  {
    slug: "pii-scrubber",
    name: "PII Scrubber",
    category: "coding",
    description: "Detects and redacts 18 categories of PII from text, logs, and structured data.",
    author: "community",
    featured: false, verified: true,
    tags: ["privacy","pii","compliance"],
    install_count: 17400, rating_avg: 4.6, rating_count: 261,
    skill_content: `---
name: PII Scrubber
description: Detect and redact PII from text, logs, and data.
---

# PII Scrubber

Find and remove personally identifiable information before it leaks into logs, prompts, or analytics.

## Categories to detect

Names, emails, phone numbers, postal addresses, government IDs (SSN, passport), dates of birth, credit card / bank account numbers, IP addresses, MAC addresses, geolocation, biometric refs, medical record numbers, vehicle plates, usernames, device IDs, URLs with tokens, and free-text quasi-identifiers.

## Detection strategy

1. Deterministic patterns for structured PII (regex + checksums).
2. Validate where possible — Luhn for cards, format checks for SSN/IBAN — to cut false positives.
3. Named-entity recognition for names, locations, and organizations in free text.
4. Context rules: a 9-digit number near "SSN" is higher-confidence than one standalone.

\`\`\`text
email:  [^\\s@]+@[^\\s@]+\\.[^\\s@]+
card:   \\b(?:\\d[ -]?){13,16}\\b   then Luhn-validate
ipv4:   \\b\\d{1,3}(\\.\\d{1,3}){3}\\b
\`\`\`

## Redaction modes

- Mask: \`j***@example.com\`, \`****-****-****-1234\` (keep last 4 for support).
- Tokenize: replace with a stable pseudonym so records still join (\`USER_a1b2\`).
- Hash: one-way for analytics where you only need equality.
- Remove: drop the field entirely when it's not needed.

Pick based on downstream need; default to the most aggressive that still works.

## Rules

- Scrub at the boundary: before logging, before sending to third parties, before LLM prompts.
- Keep an allowlist of fields safe to log rather than a blocklist of bad ones.
- Make tokenization deterministic with a secret salt so the same value maps consistently — and rotate carefully.
- Never log the raw value alongside the redacted one.

## Compliance notes

- GDPR/CCPA: support deletion and access requests — tokenization helps you find all records.
- Minimize: don't collect or retain PII you don't need.
- Audit: log that redaction ran, not what it redacted.

## Edge cases

- False negatives in free text (typos, unusual formats) — combine NER with patterns and review samples.
- Quasi-identifiers: combinations (zip + DOB + gender) can re-identify; consider k-anonymity for datasets.
- Internationalization: phone/ID formats vary by country; use locale-aware validators.`,
  },
  {
    slug: "load-testing",
    name: "Load Testing",
    category: "coding",
    description: "Designs k6 or Locust load test scenarios with ramp-up, assertions, and result interpretation.",
    author: "community",
    featured: false, verified: true,
    tags: ["testing","performance","load"],
    install_count: 12100, rating_avg: 4.5, rating_count: 181,
    skill_content: `---
name: Load Testing
description: Design and interpret realistic load tests.
---

# Load Testing

Find capacity limits before users do.

## Test types

- Smoke: minimal load, verify the system works at all.
- Load: expected peak traffic; confirm SLOs hold.
- Stress: push past peak to find the breaking point.
- Soak: sustained load for hours to catch leaks and degradation.
- Spike: sudden surge to test autoscaling and recovery.

## Designing a scenario

1. Model real user journeys, not single-endpoint hammering.
2. Use realistic think time, pacing, and a mix of read/write operations.
3. Ramp up gradually; a cold start spike measures the wrong thing.
4. Parameterize data so each virtual user uses distinct inputs (avoid cache cheating).

\`\`\`js
import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] },
};
export default function () {
  const res = http.get('https://api.example.com/items');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
\`\`\`

## Assertions and SLOs

- Set thresholds that fail the test: p95 latency, error rate, throughput.
- Track percentiles (p95/p99), never just the average — averages hide tail pain.

## Interpreting results

- Watch where latency knee-bends as load rises; that's your saturation point.
- Correlate with server metrics (CPU, memory, DB connections, GC) to find the bottleneck.
- Distinguish errors caused by the system vs the load generator's own limits.

## Rules

- Test against a production-like environment and data volume; toy data lies.
- Never load-test production without coordination and safeguards.
- Run from infrastructure that can actually generate the target load (distributed if needed).
- Establish a baseline and re-run on changes to catch regressions.

## Edge cases

- Rate limits/WAF may throttle your test — allowlist the generator.
- Connection pool exhaustion often shows before CPU; monitor it.
- Autoscaling lag: spike tests reveal how long recovery takes.`,
  },
  {
    slug: "feature-flags",
    name: "Feature Flags",
    category: "coding",
    description: "Implements feature flag systems with percentage rollouts, targeting, and kill switches.",
    author: "community",
    featured: false, verified: true,
    tags: ["feature-flags","deployment","experimentation"],
    install_count: 15400, rating_avg: 4.6, rating_count: 231,
    skill_content: `---
name: Feature Flags
description: Implement safe, controllable feature flags.
---

# Feature Flags

Decouple deploy from release; ship code dark and turn it on safely.

## Flag types

- Release flags: gate unfinished features. Short-lived; remove after rollout.
- Ops flags / kill switches: disable a feature or dependency in an incident.
- Experiment flags: A/B tests with metrics.
- Permission flags: gate features by plan or entitlement.

Don't mix purposes in one flag — lifecycle and ownership differ.

## Evaluation

\`\`\`ts
const ctx = { userId, plan, country };
if (flags.isEnabled('new-checkout', ctx)) {
  renderNewCheckout();
} else {
  renderOldCheckout();
}
\`\`\`

- Evaluate with context (user, attributes) for targeting.
- Default to the safe value (usually "off") if the flag service is unreachable.
- Cache evaluations and stream updates so flips take effect fast without per-request network calls.

## Rollout strategies

- Percentage rollout: hash a stable key (user id) into buckets so a user's experience is consistent.
- Ring deployment: internal -> beta -> small % -> full.
- Targeting rules: by plan, region, or allowlist for early access.

## Kill switches

- Every risky feature ships behind a flag you can flip off without a deploy.
- Keep kill switches simple, well-tested, and independent of the feature they guard.

## Rules

- Make flag checks side-effect free and fast.
- Avoid deeply nested flag combinations — they explode the test matrix.
- Log which variant served each request for debugging and experiment analysis.
- Treat flag config as auditable, access-controlled change.

## Flag hygiene

- Set an expiry/owner on every release flag. Stale flags rot into hidden dead code.
- Remove the flag and the dead branch once a feature is fully rolled out.

## Edge cases

- Consistency: use the same bucketing key across services so a user sees one variant everywhere.
- Server/client mismatch: evaluate on the server and pass the decision down to avoid flicker.
- Experiments: ensure random, sticky assignment and don't change allocation mid-experiment.`,
  },
  {
    slug: "stripe-integration",
    name: "Stripe Expert",
    category: "coding",
    description: "Implements Stripe subscriptions, webhooks, and idempotency with proper error handling.",
    author: "community",
    featured: false, verified: true,
    tags: ["stripe","payments","billing"],
    install_count: 29800, rating_avg: 4.8, rating_count: 447,
    skill_content: `---
name: Stripe Expert
description: Implement Stripe payments, subscriptions, and webhooks correctly.
---

# Stripe Expert

Integrate Stripe so money moves correctly and your state stays in sync.

## Core principle

Stripe is the source of truth for billing state. Your database mirrors it via webhooks — never infer subscription state from client-side success callbacks.

## Subscriptions with Checkout

1. Create a Checkout Session server-side for the price/plan.
2. Redirect the customer to the hosted page.
3. Listen for \`checkout.session.completed\` and \`customer.subscription.updated\` webhooks to update your DB.

\`\`\`ts
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: \\\`\${base}/success?session_id={CHECKOUT_SESSION_ID}\\\`,
  cancel_url: \\\`\${base}/pricing\\\`,
  customer: stripeCustomerId,
});
\`\`\`

## Webhooks

- Verify every webhook signature with the signing secret — reject unverified events.
- Return 200 fast; do heavy work async. Stripe retries on non-2xx.
- Handle events idempotently: store processed event ids and skip duplicates (Stripe delivers at-least-once).

\`\`\`ts
const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
\`\`\`

## Idempotency

- Pass an \`Idempotency-Key\` on create requests (charges, sessions) so retries don't double-charge.
- Make webhook handlers safe to run twice.

## Rules

- Never trust amounts or price ids from the client; look them up server-side.
- Use the raw request body for signature verification — body parsers break it.
- Store the Stripe customer id on your user; one customer per user.
- Handle \`invoice.payment_failed\` and dunning; communicate and gate access on \`past_due\`/\`canceled\`.

## Error handling

- Catch \`StripeCardError\` for declines and surface a friendly message.
- Retry only transient errors; never retry a card decline automatically.
- Test with test-mode keys and Stripe CLI \`stripe listen\` for local webhooks.

## Edge cases

- Proration on plan changes: decide whether to prorate and communicate it.
- Trials and cancellations: handle \`trial_will_end\` and grace periods.
- Strong Customer Authentication: handle \`requires_action\` with Payment Intents and 3DS.`,
  },
  {
    slug: "supabase-expert",
    name: "Supabase Expert",
    category: "coding",
    description: "Designs Supabase schemas, RLS policies, Edge Functions, and real-time subscriptions.",
    author: "community",
    featured: false, verified: true,
    tags: ["supabase","postgres","rls"],
    install_count: 34200, rating_avg: 4.8, rating_count: 513,
    skill_content: `---
name: Supabase Expert
description: Design Supabase schemas, RLS, Edge Functions, and realtime.
---

# Supabase Expert

Build secure, real-time apps on Supabase and Postgres.

## Security model

Supabase exposes Postgres directly to clients via the anon key, so Row Level Security IS your authorization layer. Enable RLS on every table holding user data — without it, the anon key can read everything.

## RLS policies

\`\`\`sql
alter table notes enable row level security;

create policy "owner can read" on notes
  for select using (auth.uid() = user_id);

create policy "owner can insert" on notes
  for insert with check (auth.uid() = user_id);
\`\`\`

- Write separate policies per operation (select/insert/update/delete).
- \`using\` filters which rows are visible; \`with check\` validates rows being written.
- Default-deny: with RLS on and no policy, nothing is accessible — add policies deliberately.

## Schema design

- Reference \`auth.users(id)\` for ownership; store \`user_id uuid references auth.users\`.
- Add a trigger to populate \`user_id\` from \`auth.uid()\` or set it server-side.
- Use generated columns, check constraints, and proper indexes (foreign keys especially).

## Edge Functions

- Use for server-side logic that needs the service role key (which bypasses RLS) — never expose that key to clients.
- Validate input and the caller's JWT; do privileged work, then return minimal data.

\`\`\`ts
Deno.serve(async (req) => {
  const { record } = await req.json();
  // privileged work with service role client
  return new Response(JSON.stringify({ ok: true }));
});
\`\`\`

## Realtime

- Enable replication on tables you subscribe to.
- Realtime respects RLS for Postgres changes — clients only receive rows they can read.
- Subscribe to specific events/filters to limit payload volume.

## Rules

- Never ship the service role key to the browser; it bypasses all RLS.
- Test RLS as different users; a missing policy fails closed (good) but a too-broad one leaks.
- Use migrations (supabase CLI) so schema and policies are versioned and reproducible.
- Index columns used in RLS predicates (\`user_id\`) — policies run per row.

## Edge cases

- Storage: buckets have their own RLS-style policies; set them explicitly.
- Joins under RLS: every joined table needs its own policies.
- Performance: complex policy subqueries can be slow; keep predicates simple and indexed.`,
  },
  {
    slug: "github-actions",
    name: "GitHub Actions",
    category: "coding",
    description: "Writes efficient CI/CD pipelines with caching, matrix builds, and deployment workflows.",
    author: "community",
    featured: false, verified: true,
    tags: ["ci","github-actions","devops"],
    install_count: 31600, rating_avg: 4.7, rating_count: 474,
    skill_content: `---
name: GitHub Actions
description: Write fast, secure CI/CD with GitHub Actions.
---

# GitHub Actions

Build pipelines that are fast, cached, and secure.

## Workflow basics

\`\`\`yaml
name: CI
on:
  pull_request:
  push: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm test
\`\`\`

## Caching

- Use the built-in cache in \`setup-node\`/\`setup-python\` for dependencies — biggest, easiest win.
- For custom caches, use \`actions/cache\` keyed on a lockfile hash with a restore-keys fallback.
- Cache build outputs (Turborepo/Nx remote cache) to skip unchanged work.

## Matrix builds

\`\`\`yaml
strategy:
  fail-fast: false
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, macos-latest]
\`\`\`

- Use matrices to test across versions/OS in parallel.
- Set \`fail-fast: false\` when you want all combinations to report.

## Speed

- Run independent jobs in parallel; use \`needs\` only for real dependencies.
- Only build what changed with path filters or affected-detection.
- Pin to specific runners; avoid reinstalling toolchains you can cache.

## Security

- Pin third-party actions to a full commit SHA, not a mutable tag.
- Set least-privilege \`permissions:\` (default to read-only) per workflow/job.
- Never echo secrets; pass them via \`secrets\` context, not \`run\` args.
- Be cautious with \`pull_request_target\` — it runs with write tokens against untrusted code.

## Deployment

- Use environments with required reviewers and protection rules for prod.
- Prefer OIDC to assume cloud roles instead of long-lived cloud keys.
- Gate deploys on passing tests via \`needs\`.

## Rules

- Keep workflows DRY with reusable workflows and composite actions.
- Use concurrency groups to cancel superseded runs on the same branch.
- Fail loudly; don't \`|| true\` away real failures.

## Edge cases

- Forked PRs: secrets aren't available — design CI to run safely without them.
- Flaky tests: quarantine and fix; don't blanket-retry green.
- Monorepo: trigger jobs by changed paths to keep CI fast.`,
  },
  {
    slug: "llm-evaluation",
    name: "LLM Evaluation",
    category: "coding",
    description: "Designs eval frameworks for LLM outputs — correctness, faithfulness, and human preference.",
    author: "community",
    featured: false, verified: true,
    tags: ["llm","evals","ai"],
    install_count: 11800, rating_avg: 4.6, rating_count: 177,
    skill_content: `---
name: LLM Evaluation
description: Build eval frameworks for LLM output quality.
---

# LLM Evaluation

Measure whether your LLM system actually works, and catch regressions.

## Why evals

Prompt/model changes that look fine on one example often break others. Evals turn "seems good" into a number you can track across changes.

## Build a dataset first

1. Collect 50-200 real, representative inputs — include hard and edge cases.
2. Label expected outputs or acceptance criteria.
3. Hold out a frozen test set; iterate on a separate dev set to avoid overfitting.

## Metric types

- Deterministic: exact match, regex, JSON-schema validity, contains/excludes — cheap and reliable when applicable.
- Reference-based: similarity to a gold answer (use sparingly; surface form varies).
- Faithfulness/groundedness: does the answer stay within provided context (for RAG)?
- LLM-as-judge: a strong model scores outputs against a rubric for subjective quality.
- Human preference: pairwise comparisons for the final say.

## LLM-as-judge

\`\`\`text
Rubric: Score 1-5 for whether the answer is correct AND grounded in the context.
Return JSON: { "score": n, "reason": "..." }.
\`\`\`

- Use a clear rubric and ask for a structured score + justification.
- Calibrate the judge against human labels on a sample; judges have biases (length, position).
- Prefer pairwise (A vs B) over absolute scoring — it's more reliable.

## Pipeline

- Run the eval on every prompt/model change in CI.
- Track per-metric scores over time; alert on regressions.
- Report not just averages but failures — inspect the worst cases.

## Rules

- Separate dev and test sets; never tune on the test set.
- Include adversarial and out-of-distribution inputs.
- Make evals reproducible: pin model versions, temperature, and seeds where possible.
- Measure cost and latency alongside quality.

## Edge cases

- Non-determinism: run multiple samples and report variance.
- Judge cost: use a cheaper model for screening, strong model for close calls.
- Data leakage: ensure eval inputs aren't in the prompt's few-shot examples.`,
  },
  {
    slug: "agent-orchestration",
    name: "Agent Orchestration",
    category: "coding",
    description: "Designs multi-agent systems with task routing, context passing, and failure recovery.",
    author: "community",
    featured: false, verified: true,
    tags: ["agents","orchestration","ai"],
    install_count: 14600, rating_avg: 4.6, rating_count: 219,
    skill_content: `---
name: Agent Orchestration
description: Design reliable multi-agent systems.
---

# Agent Orchestration

Coordinate multiple LLM agents to solve tasks a single prompt can't.

## When to use multiple agents

- The task decomposes into distinct skills (research, then write, then review).
- Context would overflow a single agent, so you split and summarize.
- You need parallelism across independent subtasks.

Don't multiply agents needlessly — each hop adds latency, cost, and failure surface. Prefer a single capable agent until it clearly can't cope.

## Topologies

- Orchestrator-workers: a planner decomposes the task and routes subtasks to specialized workers, then synthesizes results.
- Sequential pipeline: fixed stages, output of one feeds the next.
- Router: classify the input, dispatch to the right specialist.

## Task routing

\`\`\`text
1. Orchestrator plans: list subtasks + which worker handles each.
2. Dispatch subtasks (parallel where independent).
3. Each worker gets only the context it needs.
4. Orchestrator merges results and decides next step or finish.
\`\`\`

## Context passing

- Pass minimal, relevant context to each agent — not the whole history.
- Summarize long intermediate results before forwarding.
- Use a shared scratchpad/blackboard for artifacts agents produce.
- Keep a clear schema for inter-agent messages (task, inputs, expected output).

## Failure recovery

- Validate each agent's output against a schema before using it.
- Retry a failed subtask with feedback; cap retries to avoid loops.
- Add a critic/reviewer step for high-stakes outputs.
- Set global budgets (max steps, tokens, time) and a circuit breaker to stop runaway loops.

## Rules

- Make each agent's role and output contract explicit.
- Prefer deterministic orchestration code over an LLM that decides everything — keep control flow inspectable.
- Log every agent call (inputs, outputs, cost) for debugging and evals.
- Make tools idempotent; agents may retry.

## Edge cases

- Infinite delegation loops: track depth and forbid re-dispatching the same subtask.
- Conflicting outputs: have the orchestrator arbitrate with a tie-break rule.
- Partial failure: return best-effort results with a clear note on what failed.`,
  },
  {
    slug: "mcp-builder",
    name: "MCP Server Builder",
    category: "coding",
    description: "Builds MCP servers with proper tool definitions, error handling, and auth patterns.",
    author: "agensi",
    featured: false, verified: true,
    tags: ["mcp","tools","integration"],
    install_count: 19300, rating_avg: 4.7, rating_count: 290,
    skill_content: `---
name: MCP Server Builder
description: Build robust Model Context Protocol servers.
---

# MCP Server Builder

Build MCP servers that expose tools an LLM can use reliably and safely.

## Concepts

MCP servers expose three primitives:

- Tools: actions the model can invoke (functions with typed inputs).
- Resources: readable data the model can pull in (files, records).
- Prompts: reusable prompt templates the host can offer users.

The host (e.g. an LLM client) connects over stdio or HTTP and calls these.

## Defining good tools

\`\`\`ts
server.tool(
  "search_orders",
  "Search orders by customer email. Returns up to 20 matches.",
  { email: z.string().email(), limit: z.number().max(20).default(10) },
  async ({ email, limit }) => {
    const rows = await db.findOrders(email, limit);
    return { content: [{ type: "text", text: JSON.stringify(rows) }] };
  }
);
\`\`\`

- Name tools as clear verbs; write descriptions for the model, stating what it does, inputs, and limits.
- Validate inputs with a schema (zod/JSON Schema). Reject bad input with a helpful message.
- Keep each tool focused and side-effect-explicit.

## Error handling

- Return structured tool errors the model can act on, not raw stack traces.
- Distinguish user-fixable errors ("email not found") from system errors.
- Never crash the server on a single bad tool call; catch and return an error result.
- Time-box slow operations and return a clear timeout error.

## Auth and security

- Authenticate the connection; don't trust the transport alone.
- Apply least privilege — a tool should only reach the data its purpose needs.
- Validate and sanitize all inputs; treat tool args as untrusted.
- Avoid tools that execute arbitrary code/shell unless explicitly sandboxed and intended.
- Never embed long-lived secrets in tool outputs.

## Rules

- Keep tool output concise and structured; huge dumps waste the model's context.
- Make tools idempotent where possible; the model may retry.
- Document side effects in the tool description so the model uses it correctly.
- Version your tool contracts; changing inputs silently breaks callers.

## Edge cases

- Pagination: expose a cursor rather than returning unbounded lists.
- Long-running work: return a job id and a status tool instead of blocking.
- Ambiguous calls: return a clarifying error so the model can ask the user.`,
  },
  {
    slug: "product-hunt-launch",
    name: "Product Hunt Launch",
    category: "writing",
    description: "Writes PH taglines, descriptions, and first-comment strategies that maximize upvotes.",
    author: "community",
    featured: false, verified: true,
    tags: ["product-hunt","launch","copywriting"],
    install_count: 18200, rating_avg: 4.7, rating_count: 270,
    skill_content: `---
name: Product Hunt Launch
description: Craft taglines, descriptions, and maker comments that win the day on Product Hunt.
---

# Product Hunt Launch

You write launch copy for Product Hunt. The goal is upvotes and comments, which means clarity, momentum, and a human maker voice.

## Process

1. Ask for: product name, what it does in one sentence, the core differentiator, target user, and launch URL.
2. Identify the single most surprising or delightful capability. That is your lead.
3. Draft three assets: tagline, description, and first maker comment.

## Tagline (max 60 chars)

- State the outcome, not the mechanism. "Ship docs in minutes, not days" beats "AI-powered documentation engine."
- No buzzwords (revolutionary, seamless, next-gen). They read as filler.
- Use a concrete verb. Test by reading it aloud to a stranger.
- Provide 5 options ranked, with a one-line rationale for the top pick.

## Description (260 chars on the card)

- Sentence 1: who it's for and the problem.
- Sentence 2: what it does differently.
- Sentence 3: one proof point (speed, integrations, who uses it).
- End with momentum, not a period of doubt.

## First Maker Comment (the most important asset)

Structure:
- Hook: the personal frustration that started this. One or two sentences, real.
- What it does: 3 bullet points, benefit-led.
- What makes it different: one honest paragraph. Acknowledge the competition.
- The ask: invite feedback and questions explicitly. "Roast our onboarding" gets replies.
- Offer: a launch-day perk if there is one.

## Comment Reply Playbook

Prepare 5 templated-but-warm replies for predictable threads:
- "How is this different from [competitor]?" — answer with a specific, not a brag.
- "Is there a free tier?" — answer plainly.
- "Congrats!" — thank by name, ask a follow-up question to keep the thread alive.
- Feature requests — "Added to the board, want me to ping you when it ships?"
- Skeptics — agree with the valid part, then clarify.

## Timing and momentum rules

- Launch 12:01am PT. The clock resets then.
- Line up the first 10 comments from people who already love the product; threads beat raw votes.
- Never ask for upvotes directly (against the rules and reads as desperate). Ask for feedback; votes follow.

## Quality bar

- Every asset passes the "screenshot test": would a stranger understand it with no other context?
- Cut every adjective that isn't doing work.
- The maker comment must sound like a person typed it at midnight, excited and a little nervous.

## Output

Deliver: 5 ranked taglines, 1 description, 1 maker comment, and the 5 reply templates. Flag anything that needs a real metric you don't have yet.`,
  },
  {
    slug: "executive-summary",
    name: "Executive Summary",
    category: "writing",
    description: "Compresses long documents into one-page executive summaries with key insights and recommendations.",
    author: "community",
    featured: false, verified: true,
    tags: ["writing","executive","summary"],
    install_count: 22400, rating_avg: 4.8, rating_count: 330,
    skill_content: `---
name: Executive Summary
description: Turn long documents into a decision-ready one-page summary for busy leaders.
---

# Executive Summary

You compress reports, memos, and analyses into a one-page summary an executive can read in 90 seconds and act on.

## Core principle

Executives read to decide, not to learn. Lead with the conclusion. Everything else supports it.

## Process

1. Read the full source. Identify the single decision or question it serves.
2. Extract: the bottom line, 3-5 supporting findings, the recommendation, and the cost of inaction.
3. Draft top-down. The first sentence is the answer.

## Structure (one page, in this order)

1. **Bottom line up front (BLUF)** — 1-2 sentences. The conclusion and what you're asking for.
2. **Key findings** — 3-5 bullets, each a single insight with one number or fact attached.
3. **Recommendation** — what to do, who owns it, by when.
4. **Risks / trade-offs** — 2-3 bullets. What could go wrong and the mitigation.
5. **What we need from you** — the specific decision, approval, or resource.

## Rules

- One page. If it spills over, you haven't decided what matters.
- Every claim carries evidence: a number, a source, or a date. No "significant improvements."
- Use the active voice and present tense. "Revenue grew 18%" not "It was found that revenue had grown."
- No jargon the reader's boss wouldn't use.
- Numbers in numerals (18%, $2.4M, 3 weeks). They scan faster.

## Insight extraction

A finding is not a fact; it's a fact plus its meaning. "Churn is 7%" is a fact. "Churn is 7%, double the industry benchmark, and concentrated in month-two users" is a finding. Always push to the second form.

## Recommendation discipline

- Be specific enough to act on. "Improve onboarding" is not a recommendation; "Add a guided setup to the first session, owned by Product, shipping Q3" is.
- State the expected outcome and how you'll measure it.

## Length guidance

- BLUF: 25-40 words.
- Each finding bullet: under 25 words.
- Whole summary: 250-350 words.

## Anti-patterns

- Burying the recommendation at the bottom.
- Hedging everything ("it may possibly suggest"). Take a position; note uncertainty once.
- Restating the document's structure instead of its conclusions.

## Output

Deliver the one-pager. Then list, separately, any claims from the source you could not verify so the reader knows what to probe.`,
  },
  {
    slug: "vc-pitch-email",
    name: "VC Pitch Email",
    category: "writing",
    description: "Writes cold VC outreach emails: traction first, ask last, under 100 words.",
    author: "community",
    featured: false, verified: true,
    tags: ["fundraising","email","startups"],
    install_count: 24600, rating_avg: 4.6, rating_count: 360,
    skill_content: `---
name: VC Pitch Email
description: Write cold investor emails that earn a reply — traction first, ask last, under 100 words.
---

# VC Pitch Email

You write cold outreach to venture investors. A VC scans an inbox in seconds. The email's only job is to earn a 20-minute meeting.

## Process

1. Gather: company, one-line product, the strongest traction metric, who the founders are, the round (size + stage), and why THIS investor.
2. Pick the single most impressive, verifiable number. That is your subject and your opening.
3. Write under 100 words, plain text, no attachments.

## Structure

- **Subject line**: company + the number. "Acme: $40k MRR, growing 22% MoM." Specific, no hype.
- **Line 1 — why them**: one genuine, specific reason you're writing this person (a thesis they wrote, a portfolio company, a tweet). Proves it's not a blast.
- **Line 2 — what you do**: one sentence. The "X for Y" framing is fine if it's actually clarifying.
- **Line 3-4 — traction**: the hardest numbers you have. Revenue, growth rate, retention, notable customers, or waitlist. Numbers, not adjectives.
- **Line 5 — the team**: one phrase on why you're the people to do this.
- **Line 6 — the ask**: round size, and a low-friction next step. "Raising $1.5M seed — open to a 20-min call next week?"

## Rules

- Under 100 words. Count them.
- Traction before ask. Always. The reader decides interest before they reach the request.
- One metric per line, the best ones only. Three great numbers beat eight mediocre ones.
- No deck in the first email. Offer it: "Happy to send the deck if useful."
- No "I hope this finds you well." Start with substance.
- Never CC multiple partners; pick one and personalize.

## Metric selection (in rough priority)

1. Revenue and its growth rate.
2. Retention / net revenue retention.
3. Engagement (DAU/MAU, frequency).
4. Notable logos or design partners.
5. Waitlist or pre-orders (weakest; use only pre-revenue).

## Tone

Confident, concise, peer-to-peer. You're offering an opportunity, not begging. But no arrogance — let the numbers carry the confidence.

## Output

Deliver: 3 subject-line options, 1 email body (word count noted), and a one-line follow-up to send if no reply in 5 business days. Flag any metric that's weak so the founder can decide whether to lead with something else.`,
  },
  {
    slug: "job-application",
    name: "Job Application Writer",
    category: "writing",
    description: "Tailors resumes and cover letters to specific job descriptions with ATS optimization.",
    author: "community",
    featured: false, verified: true,
    tags: ["career","resume","job-search"],
    install_count: 31200, rating_avg: 4.7, rating_count: 460,
    skill_content: `---
name: Job Application Writer
description: Tailor resumes and cover letters to a specific job, optimized for ATS and human reviewers.
---

# Job Application Writer

You adapt a candidate's resume and write a cover letter targeted to one job description, balancing ATS keyword matching with genuine, human-readable impact.

## Process

1. Collect: the full job description, the candidate's current resume, and any extra context (target salary, why they want it).
2. Extract from the JD: required skills, preferred skills, the exact keywords/titles used, and the top 3 responsibilities.
3. Map the candidate's experience to those, prioritizing overlaps.
4. Rewrite bullets and draft a cover letter.

## Resume tailoring

- **Mirror the JD's language.** If they say "stakeholder management," use that exact phrase where true — ATS matches strings, not synonyms.
- **Reorder for relevance.** Put the most JD-relevant experience and bullets first within each role.
- **Quantify every bullet possible.** Format: action verb + what + measurable result. "Cut deploy time 60% by automating the release pipeline." If no number exists, show scope or outcome.
- **Match the title vocabulary.** If they hire a "Product Marketing Manager" and the candidate was a "Marketing Lead," note the equivalence in the summary.

## ATS rules

- Use standard section headings: Experience, Education, Skills.
- No tables, text boxes, columns, headers/footers, or images — many parsers drop them.
- Include a Skills section with the exact hard-skill keywords from the JD that the candidate genuinely has.
- Use both the acronym and the spelled-out form once ("SEO (search engine optimization)").
- Standard fonts, .docx or text-based PDF.

## Cover letter (3 short paragraphs)

1. **Hook**: why this company/role specifically — a real reason, not flattery. Name a product, value, or recent news.
2. **Proof**: 1-2 of the most relevant accomplishments, with numbers, tied directly to the JD's top responsibilities.
3. **Close**: what you'd bring and a confident, low-pressure call to talk.

Keep it under 250 words. No restating the resume line by line.

## Honesty guardrails

- Never invent experience, titles, or metrics. Reframe and surface what's real; do not fabricate.
- If the candidate lacks a hard requirement, address it briefly in the cover letter (a transferable skill or fast ramp), don't fake it.

## Anti-patterns

- Generic "I am a hard-working team player." Cut it.
- Keyword stuffing that reads like spam — ATS flags density too.
- One cover letter reused verbatim across companies.

## Output

Deliver: the tailored resume bullets (by role), a Skills section, and the cover letter. List which JD keywords you matched and which the candidate is missing so they can decide how to handle gaps.`,
  },
  {
    slug: "speech-writer",
    name: "Speech Writer",
    category: "writing",
    description: "Writes keynote speeches with narrative arc, memorable lines, and precise timing.",
    author: "community",
    featured: false, verified: true,
    tags: ["speaking","speeches","presentation"],
    install_count: 16800, rating_avg: 4.8, rating_count: 250,
    skill_content: `---
name: Speech Writer
description: Write keynotes with a clear arc, lines that land, and timing the speaker can actually hit.
---

# Speech Writer

You write speeches meant to be spoken aloud, not read. The ear forgets fast, so the structure must guide the listener and the lines must stick.

## Process

1. Gather: occasion, audience, time limit, the one idea they should leave with, and the speaker's natural voice (formal, warm, funny).
2. Find the through-line — a single message everything serves.
3. Outline, draft, then mark timing.

## Structure (narrative arc)

1. **Open with a hook** — a story, a surprising fact, a question, or a vivid image. Never "Thank you, it's an honor to be here." Earn attention in the first 20 seconds.
2. **State the stakes** — why this matters to THIS room, now.
3. **Develop in 3 movements** — three points, each anchored by a concrete story or example. The human mind holds three.
4. **Turn** — a moment of tension, contrast, or the hard truth. Speeches need a hinge.
5. **Land the close** — return to the opening image (a "callback"), then deliver the one line you want quoted.

## Writing for the ear

- Short sentences. One idea each. Fragments are fine for rhythm.
- Read every line aloud. If you stumble, rewrite it.
- Use the rule of three ("of the people, by the people, for the people").
- Repetition is a feature, not a bug — anchor a phrase and return to it.
- Concrete over abstract. "A nurse named Maria" beats "healthcare workers."
- Contractions and second person. Talk to one person in the room.

## Memorable lines

- Build toward 2-3 lines designed to be remembered or quoted. Make them short, balanced, and surprising.
- Use antithesis (X, not Y), and concrete imagery.
- Put the strongest word at the end of the sentence — that's where the ear lands.

## Timing

- Speaking pace is ~130 words/minute. A 10-minute speech is ~1,300 words. Budget accordingly.
- Mark [pause] after big lines — silence sells them.
- Build in breathing room; nervous speakers rush. Aim 10% under the limit.

## Delivery notes

Provide the speaker with: where to slow down, where to pause, which lines to land hard, and any phrase to memorize so they can lift their eyes from the page.

## Anti-patterns

- Reading a list of accomplishments. Tell stories instead.
- Jokes that don't fit the speaker's voice — they die on stage.
- A weak, trailing ending. The last line is the one they carry out the door.

## Output

Deliver the full speech with timing markers and pause/emphasis notes, plus the word count and estimated runtime.`,
  },
  {
    slug: "terms-of-service",
    name: "Terms of Service",
    category: "writing",
    description: "Drafts plain-English terms of service and privacy policies for SaaS products.",
    author: "community",
    featured: false, verified: true,
    tags: ["legal","tos","compliance"],
    install_count: 14200, rating_avg: 4.4, rating_count: 210,
    skill_content: `---
name: Terms of Service
description: Draft plain-English ToS and privacy policies for SaaS — clear, structured, and honest about limits.
---

# Terms of Service

You draft Terms of Service and Privacy Policies for SaaS products in plain English. Readable beats clever; users and regulators both reward clarity.

## Critical disclaimer

You produce a strong first draft, not legal advice. Always tell the user: have a qualified attorney review before publishing, especially for GDPR, CCPA, HIPAA, or payment handling. State this clearly in your output.

## Process

1. Gather: product name, what it does, who can use it (age, geography), data collected, payment model, third-party processors, and governing-law jurisdiction.
2. Draft ToS and Privacy Policy as separate documents.
3. Flag every section that needs a lawyer's eyes or a business decision.

## Terms of Service — standard sections

1. Acceptance of terms
2. Description of the service
3. Eligibility (age, accounts)
4. User accounts and responsibilities
5. Acceptable use / prohibited conduct
6. Subscription, billing, and refunds
7. Intellectual property (yours and theirs; user content license)
8. Termination and suspension
9. Disclaimers and limitation of liability
10. Indemnification
11. Governing law and dispute resolution
12. Changes to terms and how users are notified
13. Contact information

## Privacy Policy — standard sections

1. What data you collect (and how — directly, automatically, from third parties)
2. Why you collect it (legal basis under GDPR if applicable)
3. How you use it
4. Who you share it with (list processors: analytics, payments, hosting)
5. Cookies and tracking
6. Data retention periods
7. User rights (access, deletion, portability, opt-out)
8. Security measures
9. International data transfers
10. Children's data
11. How to contact you / your DPO
12. Effective date and change notification

## Plain-English rules

- Short sentences. Define a term once, then use it consistently.
- Prefer "you" and "we." Avoid "the Party of the first part."
- Use headers and numbered clauses so users can find things.
- Where law requires specific language (e.g., GDPR rights), keep it precise — don't oversimplify away meaning.

## Honesty guardrails

- Only describe data practices the product actually has. Don't claim "we never sell your data" unless that's a real commitment.
- Liability caps and arbitration clauses are business/legal decisions — flag them as [DECISION NEEDED], don't silently pick aggressive terms.
- Match the privacy policy to the real list of subprocessors.

## Output

Deliver both documents with section headers, an effective date placeholder, and a clearly marked list of [LAWYER REVIEW] and [DECISION NEEDED] items. Reiterate that this is a draft requiring legal review.`,
  },
  {
    slug: "wikipedia-style",
    name: "Wikipedia Style Writer",
    category: "writing",
    description: "Writes neutral, encyclopedic content in Wikipedia's manual of style with proper citation format.",
    author: "community",
    featured: false, verified: true,
    tags: ["writing","encyclopedic","content"],
    install_count: 8400, rating_avg: 4.5, rating_count: 130,
    skill_content: `---
name: Wikipedia Style Writer
description: Write neutral, verifiable, encyclopedic prose following Wikipedia's manual of style.
---

# Wikipedia Style Writer

You write content in the neutral, encyclopedic register of Wikipedia, following its core content policies and manual of style.

## The three core policies

- **Neutral point of view (NPOV)**: represent all significant views fairly and without bias. State facts about opinions, not opinions as facts.
- **Verifiability**: every claim likely to be challenged needs an inline citation to a reliable, published source. No original research.
- **No original research**: don't synthesize sources to reach a new conclusion they don't individually support.

## Article structure

1. **Lead section**: a concise summary standing on its own. First sentence defines the subject in bold ("**Subject** is a..."). The lead should let a reader stop after it and have the gist. No citations needed if everything is cited below, but controversial claims get them.
2. **Body**: organized by themes/chronology with section headers (== Heading ==, === Subheading ===).
3. **References / citations**.
4. **See also, External links** (sparingly).

## Manual of style essentials

- **Tone**: formal, impersonal, third person. No "you," no "we," no addressing the reader.
- **No peacock terms**: avoid "renowned," "world-class," "groundbreaking," "best." Show notability through facts and sources, don't assert it.
- **No weasel words**: "some say," "it is widely believed" — attribute specifically or cut.
- **No editorializing**: "fortunately," "interestingly," "notably" inject the writer's view.
- **Present tense** for current facts; past tense for historical events.
- **Dates and numbers**: be consistent within an article.

## Citation format

Use inline footnote markers and a structured citation. Example:

\`\`\`
The company was founded in 2009.<ref>{{cite news |title=... |url=... |work=... |date=... |access-date=...}}</ref>
\`\`\`

- Cite reliable, secondary, published sources. Avoid blogs, press releases (for claims about the subject), and self-published material.
- One citation per challengeable claim; bundle at the end of the sentence.

## Neutrality in practice

- For disputes, attribute each position: "Critics argue X, while supporters contend Y," each cited.
- Give weight proportional to coverage in reliable sources — don't elevate fringe views.
- Avoid loaded labels; prefer the most neutral accurate term.

## Anti-patterns

- Promotional language (reads like marketing — instant rejection).
- First-person or direct address.
- Unsourced superlatives or claims of "first," "only," "largest."
- Essay-like argumentation toward a conclusion.

## Output

Deliver the article with a bolded lead, themed sections, and inline {{cite}} references. Flag any claim where you lack a reliable source so the user can supply one rather than leaving it unverified.`,
  },
  {
    slug: "ghostwriter",
    name: "Ghostwriter",
    category: "writing",
    description: "Matches the voice and style of any provided text sample, then writes new content in that voice.",
    author: "community",
    featured: false, verified: true,
    tags: ["ghostwriting","voice","style"],
    install_count: 27800, rating_avg: 4.7, rating_count: 410,
    skill_content: `---
name: Ghostwriter
description: Analyze a writing sample, build a voice profile, and produce new content indistinguishable from the author.
---

# Ghostwriter

You write in someone else's voice. The reader should never sense a second hand. Success is invisibility.

## Process

1. Get 1-3 genuine samples of the author's writing (longer is better) plus the brief for the new piece.
2. Build a voice profile (below).
3. Draft in that voice, then audit against the profile.

## Voice profile — what to extract

Read the samples and document:

- **Sentence rhythm**: average length, and the mix. Does the author write long, winding sentences or short punchy ones? Do they vary, or stay even?
- **Vocabulary level**: plain vs. ornate. Latinate vs. Anglo-Saxon words. Any signature words or tics.
- **Punctuation habits**: em dashes? Semicolons? Ellipses? Parentheticals? Sentence fragments? Oxford comma?
- **Person and stance**: first person? How direct? Confident, hedging, ironic, earnest?
- **Paragraph shape**: short bursts or dense blocks? Do they open with the point or build to it?
- **Rhetorical moves**: rhetorical questions, lists, anecdotes, metaphors, humor. What kind of humor?
- **Tone register**: formal, conversational, academic, breezy.
- **Formatting habits**: headers, bold, bullets — or flowing prose.

Write this profile out explicitly before drafting. Naming the patterns is what lets you reproduce them.

## Drafting rules

- Match the rhythm first — it's the strongest fingerprint. If they write short, write short.
- Reuse signature words and constructions, but don't overdo it to the point of parody.
- Mirror how they transition between ideas.
- Keep their level of hedging or assertion. A cautious author shouldn't suddenly sound certain.
- Honor their formatting defaults.

## Audit (before delivering)

Compare your draft to the profile line by line:
- Sentence-length distribution similar?
- Any word you used that the author wouldn't?
- Punctuation habits matched?
- Does it open and close the way they would?

Read a sample and your draft back to back. If you can tell which is which by feel, revise.

## Honesty guardrails

- Don't impersonate the author to make factual claims they haven't made or wouldn't stand behind. Voice yes; fabricated assertions no.
- If the brief conflicts with the author's known views, flag it.

## Anti-patterns

- Defaulting to your own clean, neutral style — the most common failure.
- Smoothing out the author's quirks; the quirks ARE the voice.
- Over-polishing a deliberately casual writer.

## Output

Deliver the voice profile (so the user can confirm it), then the new content. Note any places you guessed at voice because the samples didn't cover that situation.`,
  },
  {
    slug: "fiction-scene-writer",
    name: "Fiction Scene Writer",
    category: "writing",
    description: "Writes vivid fiction scenes with sensory detail, subtext, and character interiority.",
    author: "community",
    featured: false, verified: true,
    tags: ["fiction","creative-writing","scenes"],
    install_count: 19400, rating_avg: 4.8, rating_count: 290,
    skill_content: `---
name: Fiction Scene Writer
description: Write immersive fiction scenes driven by sensory detail, subtext, and interiority.
---

# Fiction Scene Writer

You write individual fiction scenes that pull the reader into a moment. A scene is not a summary; it happens in real time, in a place, through a character who wants something.

## Process

1. Gather: the POV character and what they want in this scene, the other characters, the setting, the emotional turn the scene must accomplish, and any plot beats it must hit.
2. Find the scene's tension — what's at stake right now, even in a quiet moment.
3. Write the scene, then revise for subtext and sensory grounding.

## The anatomy of a scene

- **Goal**: the POV character wants something entering the scene.
- **Conflict**: something resists — a person, the environment, themselves.
- **Turn**: the scene changes the character's situation or understanding. They leave different than they entered.
- **Exit on a hook or a shift**: end on a beat that propels or resonates.

## Craft rules

- **Show, don't tell — selectively.** Dramatize the emotional core; summarize the connective tissue. Not everything needs full scene treatment.
- **Sensory specificity**: ground the reader with concrete, telling details — not a catalog. One sharp detail (the smell of cut grass, a chipped mug) beats a paragraph of description.
- **Filter words weaken immediacy**: trim "she saw," "he felt," "she noticed." Just show the thing. "She saw the door open" → "The door opened."
- **Interiority**: let us inside the POV character's thoughts and bodily sensations. This is what fiction can do that film cannot. But interleave it with action; don't stall in the head.
- **Subtext in dialogue**: characters rarely say exactly what they mean. The real conversation runs underneath. Let people deflect, change the subject, lie.
- **Beats over speech tags**: break dialogue with small physical actions that reveal character, rather than "he said angrily."

## Pacing

- Vary sentence length to control speed. Short sentences accelerate; longer ones slow and deepen.
- White space (paragraph breaks, dialogue) speeds a page; dense blocks slow it.
- Cut to the moment of change. Start as late into the scene as possible.

## Dialogue

- Each character should sound distinct — vocabulary, rhythm, what they avoid.
- Read it aloud; if it sounds like exposition, rewrite.
- Conflict in every exchange, even friendly ones (differing goals).

## Anti-patterns

- "Talking heads" — dialogue with no physical or emotional grounding.
- Describing emotions by naming them ("she was sad") instead of rendering them.
- Purple prose — adjectives stacked for their own sake.
- Info-dumping backstory mid-scene.

## Output

Deliver the scene. Then note, briefly, what the scene accomplishes (the turn) and one craft choice you made, so a writer revising their own work can learn from it.`,
  },
  {
    slug: "technical-spec",
    name: "Technical Spec Writer",
    category: "writing",
    description: "Writes engineering specs: background, requirements, non-goals, design, open questions.",
    author: "community",
    featured: false, verified: true,
    tags: ["specs","engineering","documentation"],
    install_count: 23600, rating_avg: 4.7, rating_count: 350,
    skill_content: `---
name: Technical Spec Writer
description: Write design docs engineers actually read — background, requirements, non-goals, design, open questions.
---

# Technical Spec Writer

You write engineering design documents (specs / RFCs) that align a team before code is written. A good spec surfaces disagreement early and makes the eventual implementation boring.

## Process

1. Gather: the problem, who's affected, constraints, the proposed approach, and what's explicitly out of scope.
2. Draft top-down: context first, then design.
3. Make the open questions prominent — a spec's value is often the questions it raises.

## Standard structure

1. **Title, author, status, date, reviewers.**
2. **Summary / TL;DR** — 3-5 sentences. What and why, readable by a non-expert.
3. **Background / context** — what exists today, why it's a problem, relevant history and links. Assume the reader hasn't been in your head.
4. **Goals** — what success looks like, ideally measurable.
5. **Non-goals** — what you are explicitly NOT solving. This section prevents scope creep and is the most-skipped, most-valuable part.
6. **Requirements / constraints** — functional and non-functional (latency, scale, security, compliance).
7. **Proposed design** — the meat. Data models, APIs, components, sequence of operations. Use diagrams (describe them if you can't draw). Explain how it works end to end.
8. **Alternatives considered** — other approaches and why you rejected them. Shows rigor and preempts "why didn't you just...".
9. **Trade-offs and risks** — what this design costs and what could go wrong.
10. **Rollout / migration plan** — how it ships, feature flags, backfills, rollback.
11. **Open questions** — unresolved decisions, flagged for reviewers.
12. **Appendix** — detailed schemas, benchmarks, references.

## Writing rules

- Lead with the decision, support with detail. Reviewers skim.
- Be concrete: real field names, real endpoints, real numbers. Vague specs hide the hard parts.
- State assumptions explicitly. Hidden assumptions cause the worst arguments.
- Prefer prose for reasoning, tables for comparisons, code blocks for interfaces.
- Quantify non-functional requirements: "p99 under 200ms at 10k RPS," not "fast."

## Design section quality bar

- A new engineer should be able to implement from it without a meeting.
- Every component's responsibility and interface is clear.
- Failure modes addressed: what happens on timeout, partial failure, retry, bad input.
- Backwards compatibility and data migration covered.

## Non-goals discipline

List 3-6 things readers might assume you're doing but aren't. Each prevents a future "but what about..." derailment.

## Anti-patterns

- Jumping to the solution with no problem statement.
- No alternatives — looks like you didn't think.
- Burying open questions at the bottom where reviewers miss them.
- Over-specifying trivial parts while hand-waving the risky core.

## Output

Deliver the spec with all sections. Where a diagram is needed, describe it precisely enough that someone could draw it. Surface the open questions at the top of your reply so reviewers engage with them first.`,
  },
  {
    slug: "content-brief",
    name: "Content Brief",
    category: "writing",
    description: "Creates SEO content briefs: target keyword, intent, outline, internal links, word count.",
    author: "community",
    featured: false, verified: true,
    tags: ["content","seo","brief"],
    install_count: 17800, rating_avg: 4.6, rating_count: 260,
    skill_content: `---
name: Content Brief
description: Build SEO content briefs that tell a writer exactly what to produce to rank and convert.
---

# Content Brief

You create the brief a writer follows to produce a page that ranks in search and serves the reader. The brief removes guesswork.

## Process

1. Gather: target keyword, the business goal of the page, the audience, and any competing URLs ranking now.
2. Determine search intent (below) — everything flows from it.
3. Build the brief.

## Brief components

1. **Primary keyword** — the exact phrase to target.
2. **Secondary / semantic keywords** — 5-15 related terms and entities to cover (the topic's vocabulary). These help relevance, not just repetition.
3. **Search intent** — informational, commercial, transactional, or navigational. This dictates format and depth.
4. **Target audience and their knowledge level** — beginner vs. expert changes everything.
5. **Recommended format** — listicle, how-to guide, comparison, definition + deep dive. Match what already ranks unless you can do better.
6. **Title and H1** — compelling, includes the keyword naturally.
7. **Meta description** — under 155 chars, includes keyword, written to earn the click.
8. **Outline** — full H2/H3 structure. This is the core of the brief.
9. **Target word count** — based on what ranking pages do, not an arbitrary number.
10. **Internal links** — specific existing pages to link to, with anchor suggestions.
11. **External / authority references** — types of sources to cite.
12. **Featured-snippet opportunity** — if a definition, list, or table could win position zero, specify it.
13. **Call to action** — what the reader should do next.

## Determining intent

Look at what currently ranks for the keyword:
- Mostly guides? Informational — write to teach.
- Product/category pages? Commercial/transactional — write to convert.
- Match the dominant format. Fighting intent rarely ranks.

## Outline quality

- Headers should answer the questions a searcher actually has (mine "People Also Ask" and related searches).
- Logical progression: what → why → how → what next.
- Each H2 is a sub-topic a reader (and Google) expects. Cover the topic comprehensively without padding.
- Note where to place the primary keyword (title, H1, first 100 words, one H2, naturally throughout).

## Word count guidance

- Derive from the SERP: roughly match or modestly exceed the top results' depth. Don't write 3,000 words because a tool said so if the intent is a quick answer.
- More words only help if they add value; thin padding hurts.

## Anti-patterns

- Keyword stuffing instructions — write for humans, optimize lightly.
- Ignoring intent and forcing a format.
- Outlines that just restate competitors instead of filling gaps they miss.

## Output

Deliver the complete brief. Highlight the content gap — what the top-ranking pages fail to cover that this piece should — because that's the page's best shot at outranking them.`,
  },
  {
    slug: "book-proposal",
    name: "Book Proposal",
    category: "writing",
    description: "Writes non-fiction book proposals: hook, market, author platform, chapter outline.",
    author: "community",
    featured: false, verified: true,
    tags: ["writing","publishing","books"],
    install_count: 9200, rating_avg: 4.6, rating_count: 140,
    skill_content: `---
name: Book Proposal
description: Write a non-fiction book proposal that convinces an agent or publisher to acquire.
---

# Book Proposal

You write non-fiction book proposals — the sales document agents and acquiring editors read before they ever see a manuscript. A proposal sells the book's idea, market, and the author's ability to reach readers.

## Process

1. Gather: the book's core idea, the author's credentials and platform, the intended reader, comparable titles, and a rough table of contents.
2. Lead with the hook — why this book, why now, why this author.
3. Assemble the standard proposal sections.

## Standard sections

1. **Overview / hook** (2-4 pages) — the most important section. Open like the book itself: a compelling story, statistic, or provocation. Articulate the big idea, the problem it solves, and the promise to the reader. An editor decides here.
2. **About the author** — credentials, why YOU can write this. Authority and access matter.
3. **Author platform** — your reach: audience size, newsletter, speaking, social, media relationships. Publishers fund books that can find readers. Be specific with numbers.
4. **Target market** — who buys this and how many of them exist. Name the reader concretely.
5. **Comparable titles (comps)** — 4-6 recent successful books in the space. For each: what it did well and how yours differs/improves. Avoid mega-bestsellers (unrealistic) and out-of-print titles.
6. **Marketing and promotion plan** — what YOU will do to sell it. Specific, actionable commitments.
7. **Chapter outline** — each chapter with a paragraph summary. Show the arc and that you have a full book, not one idea stretched thin.
8. **Sample chapters** — usually 1-2 polished chapters (often the intro + one strong middle chapter).

## The hook

- Start with tension or surprise, not "This book is about..."
- State the one big, fresh idea in a sentence the author could say at a party.
- Answer "why now?" — the cultural moment or gap that makes this timely.
- Make a clear promise: what the reader gains.

## Comps discipline

- Recent (last 3-5 years), real sales, same shelf.
- "X meets Y" framing works if it's honest and illuminating.
- Use comps to show a market exists AND a gap your book fills.

## Platform honesty

- Report real numbers; publishers verify. Frame modest platforms by growth and engagement, not vanity totals.

## Chapter outline quality

- Each summary shows what the reader learns and how the argument advances.
- The book should clearly have enough material — no padding, no repetition.

## Anti-patterns

- A weak, abstract overview that buries the idea.
- Ignoring platform/marketing — the parts publishers care about most.
- Comps that are decades old or wildly aspirational.

## Output

Deliver the full proposal draft, section by section. Flag where you need real platform numbers or sales context from the author rather than inventing them.`,
  },
  {
    slug: "app-store-copy",
    name: "App Store Copy",
    category: "writing",
    description: "Writes App Store titles, subtitles, descriptions, and keyword fields for iOS and Android.",
    author: "community",
    featured: false, verified: true,
    tags: ["app-store","aso","mobile"],
    install_count: 21400, rating_avg: 4.6, rating_count: 320,
    skill_content: `---
name: App Store Copy
description: Write ASO-optimized titles, subtitles, descriptions, and keyword fields for iOS and Android.
---

# App Store Copy

You write store listing copy that ranks in App Store / Play Store search AND converts browsers into installs. ASO and conversion are two jobs; you do both.

## Process

1. Gather: app name, what it does, top 3 features users love, target user, and key competitor apps.
2. Research the keyword vocabulary your users actually search.
3. Write each field to its platform's rules and limits.

## iOS fields and limits

- **App name** (30 chars): brand + a high-value keyword if room. "Notion - Notes & Docs."
- **Subtitle** (30 chars): your value prop, keyword-rich. Indexed for search.
- **Keyword field** (100 chars, hidden): comma-separated, no spaces, no repeats of the name/subtitle words, no plurals you've already used. Pure keyword fuel.
- **Promotional text** (170 chars): updatable without review; use for offers/news.
- **Description**: conversion-focused. NOT indexed for iOS search, so write it for humans.

## Android (Play Store) fields and limits

- **Title** (30 chars): brand + keyword. Indexed and heavily weighted.
- **Short description** (80 chars): indexed, shown prominently. Hook + keyword.
- **Full description** (4000 chars): indexed for Play search — keyword placement matters here (unlike iOS). Use keywords naturally a handful of times.

## Description structure (both platforms)

1. **First 1-2 lines**: the hook — most users only see these before "more." Lead with the core benefit, not a feature list.
2. **Social proof** (if any): awards, downloads, ratings, notable press.
3. **Feature/benefit bullets**: lead each with the benefit, name the feature second. "Never lose a thought — capture notes offline and sync everywhere."
4. **Use cases**: who it's for and when they'd reach for it.
5. **Close**: a download nudge and any free-tier/trial mention.

## Keyword strategy

- Mine real search terms: competitor titles, autocomplete, review language.
- Prioritize relevance + reasonable volume + achievable difficulty.
- iOS: don't waste the 100-char field on words already in name/subtitle (they're indexed once).
- Android: weave keywords into the full description naturally; avoid stuffing (it's penalized and reads badly).
- Single words combine — iOS builds phrases from your keyword set, so include the components.

## Conversion rules

- Benefit before feature, always.
- Specific over generic: "Scan a receipt in 2 seconds" beats "Powerful scanning."
- Scannable: short lines, bullets, no walls of text.
- Match the tone to the audience and the screenshots.

## Anti-patterns

- Keyword-stuffed titles that read like spam (and hurt conversion).
- A feature dump with no hook in the first line.
- Identical copy across iOS and Android, ignoring that Android indexes the description and iOS doesn't.

## Output

Deliver every field labeled with its character count and platform, a ranked keyword list with rationale, and 2-3 options for the title and subtitle/short description so the user can A/B test.`,
  },
  {
    slug: "error-message-writer",
    name: "Error Message Writer",
    category: "writing",
    description: "Rewrites error messages to be specific, actionable, and blame-free.",
    author: "community",
    featured: false, verified: true,
    tags: ["ux-writing","errors","microcopy"],
    install_count: 15600, rating_avg: 4.7, rating_count: 230,
    skill_content: `---
name: Error Message Writer
description: Rewrite error messages to be specific, actionable, and blame-free — so users recover, not rage.
---

# Error Message Writer

You rewrite error messages. A good error message turns a dead end into a next step. The user is already frustrated; your job is to help, not to scold.

## The three jobs of an error message

1. **Say what happened** — specifically, in plain language.
2. **Say why** (if it helps) — only if it aids recovery; skip blame.
3. **Say what to do next** — the most important part. Give a clear action.

## Process

1. For each error, identify: what actually failed, what the user can do about it, and whether it's the user's action or a system fault.
2. Rewrite to be specific, human, and actionable.
3. Keep a developer-facing detail (error code/log) separate from the user-facing message.

## Rules

- **Be specific, not generic.** "Something went wrong" tells the user nothing. "We couldn't save your changes because your connection dropped" tells them what and hints at the fix.
- **Be actionable.** End with what to do: "Check your connection and try again," "Use a password with at least 8 characters," "Contact support with code 4012."
- **Be blame-free.** Avoid "you" + accusation. Not "You entered an invalid email." Better: "That email address doesn't look right — check for typos." Passive or shared blame de-escalates.
- **Plain language.** No "null reference exception," "HTTP 500," or "malformed payload" in the user's face. Translate.
- **Match severity to tone.** A failed payment is serious; a wrong password is routine. Don't alarm over trivia, don't joke during data loss.
- **No dead ends.** Every error offers a path: retry, edit, go back, get help.
- **Preserve the user's work.** Tell them their input is saved, if it is. Losing a long form to a vague error is the worst case.

## Tone calibration

- Routine validation: light, helpful, even friendly.
- System failures: calm, apologetic-but-confident, reassuring (their data is safe).
- Security/destructive: clear and serious, no humor.

## Structure of a message

- **Title/lead**: what happened, in 3-8 words.
- **Body**: the recovery action, one or two sentences.
- **Optional**: a link to help, or an error code for support (small, secondary).

## Examples of the rewrite

- Before: "Error 403." After: "You don't have access to this page. Ask an admin to grant you permission, or switch to an account that does."
- Before: "Invalid input." After: "Phone numbers need 10 digits. Example: 555-123-4567."
- Before: "Upload failed." After: "That file is too large to upload (max 25 MB). Try compressing it or choosing a smaller file."

## Anti-patterns

- Humor during data loss or security errors.
- Jargon, codes, or stack traces shown to end users.
- "Please try again later" with no other guidance.
- Blaming the user.

## Output

Deliver the rewritten message(s). For each, note the user-facing text and, separately, any technical detail to log or show to support — keep the two layers distinct.`,
  },
  {
    slug: "onboarding-copy",
    name: "Onboarding Copy",
    category: "writing",
    description: "Writes product onboarding flows — welcome emails, tooltips, empty states, success messages.",
    author: "community",
    featured: false, verified: true,
    tags: ["onboarding","ux-writing","saas"],
    install_count: 18900, rating_avg: 4.7, rating_count: 280,
    skill_content: `---
name: Onboarding Copy
description: Write onboarding microcopy — welcome emails, tooltips, empty states, success messages — that drives activation.
---

# Onboarding Copy

You write the words a new user reads in their first session. The goal is activation: getting them to the moment they first feel the product's value (the "aha moment") with as little friction as possible.

## Process

1. Identify the activation milestone — the action that predicts a user will stick (e.g., "created first project," "invited a teammate").
2. Map the onboarding journey from signup to that milestone.
3. Write copy for each touchpoint that removes friction and builds momentum.

## Touchpoints and how to write them

### Welcome email
- Subject: warm, specific. Set the one next step.
- Body: 1 short paragraph + ONE clear CTA toward the activation action. Don't list every feature.
- Reassure: how to get help.

### Empty states
- The most underrated screen. A blank list is a chance, not a void.
- Explain what this space is for, why it's valuable, and give a button to fill it.
- Better: provide a sample/template or a "create your first X" CTA. Show the destination.

### Tooltips / coachmarks
- One idea per tip. Point to the action, not the whole UI.
- Benefit-led: tell them why, not just what. "Pin this to keep it at the top" beats "This is the pin button."
- Keep them skippable; respect users who explore on their own.

### Progress / checklists
- Break setup into 3-5 concrete steps with a sense of progress.
- Order by value, front-load an easy quick win to build momentum.

### Success / confirmation messages
- Celebrate the milestone, then point to the next valuable action.
- "Your project's live. Invite a teammate to start collaborating." Momentum, not a dead end.

## Writing rules

- **One step at a time.** Don't dump everything; reveal as needed (progressive disclosure).
- **Benefit over feature.** Always answer "why should I care?"
- **Action-oriented.** Buttons are verbs: "Create project," not "OK."
- **Encouraging, not condescending.** Assume competence; offer help without hand-holding.
- **Brevity.** New users skim. Cut every non-essential word.
- **Reduce choices.** Each decision is friction. Guide toward the path that activates.

## Tone

Friendly, confident, human. Like a helpful colleague showing you around, not a manual. Match the brand voice but keep it light — first impressions set the relationship.

## Measuring success

Tie copy to the activation metric. If a step has a high drop-off, the copy there is a prime suspect. Note where you'd test variants.

## Anti-patterns

- A feature tour that explains the UI instead of delivering value.
- Walls of text in tooltips.
- Empty states that are actually empty.
- Generic "Welcome!" with no next step.

## Output

Deliver copy for each touchpoint, organized by step in the journey, with the activation milestone named at the top and a note on which steps are highest-risk for drop-off.`,
  },
  {
    slug: "whitepapers",
    name: "Whitepaper Writer",
    category: "writing",
    description: "Structures and writes technical whitepapers with methodology, findings, and call to action.",
    author: "community",
    featured: false, verified: true,
    tags: ["whitepapers","b2b","content"],
    install_count: 12400, rating_avg: 4.5, rating_count: 190,
    skill_content: `---
name: Whitepaper Writer
description: Structure and write authoritative B2B whitepapers — problem, methodology, findings, recommendation.
---

# Whitepaper Writer

You write whitepapers: long-form, authoritative documents that educate a business audience and build trust, usually as part of a B2B marketing or sales motion. A whitepaper persuades through depth and evidence, not hype.

## Process

1. Gather: the topic, the target reader (role, industry, sophistication), the business goal (lead gen, sales enablement, thought leadership), and any data/research available.
2. Define the argument — the thesis the paper proves.
3. Structure, draft, support every claim with evidence.

## Standard structure

1. **Title and subtitle** — specific, benefit-or-insight-driven. Not clickbait; this signals authority.
2. **Executive summary** — one page. The problem, the key findings, and the recommendation. Many readers stop here; make it complete.
3. **Introduction / problem statement** — establish the problem's importance and cost. Use data to size it. Make the reader feel the stakes.
4. **Background / context** — current approaches and why they fall short. Educate without condescending.
5. **Methodology** (if research-based) — how you gathered data or reached conclusions. This is what separates a whitepaper from a blog post; it earns credibility.
6. **Findings / analysis** — the substance. Present evidence, data, charts, case examples. Build the argument step by step.
7. **Implications / recommendations** — what the reader should do with this. Practical, actionable.
8. **Conclusion** — restate the thesis and the path forward.
9. **Call to action** — the soft business ask (demo, consultation, further reading). Subtle; the paper earns it by being useful.
10. **References / about the author/company.**

## Writing rules

- **Evidence over assertion.** Every significant claim needs a stat, study, example, or logical proof. Cite sources.
- **Educate first, sell last.** A whitepaper that reads as an ad fails. Give real value; the credibility does the selling.
- **Professional, measured tone.** Confident but not breathless. No superlatives without proof.
- **Make data visual.** Recommend charts/tables where they clarify. Describe them precisely if you can't render them.
- **Skimmable.** Headers, pull quotes, callout stats, summaries. Executives skim before they read.
- **Define jargon** for the specific audience; don't over-explain to experts or under-explain to generalists.

## Credibility moves

- Cite reputable, recent sources.
- Use original data or analysis if available — it's the most valuable kind.
- Acknowledge limitations honestly; it builds trust.
- Quote or reference recognized authorities.

## Anti-patterns

- Thinly veiled product pitch with no real insight.
- Unsupported claims and vendor superlatives.
- No methodology — reads as opinion.
- A hard sell that overwhelms the value.

## Output

Deliver the whitepaper with all sections, an executive summary that stands alone, and notes on where charts/data are needed. Flag any claim that needs a real citation or dataset you don't have, rather than asserting it unsupported.`,
  },
  {
    slug: "academic-essay",
    name: "Academic Essay",
    category: "writing",
    description: "Structures argumentative academic essays with thesis, evidence, counterargument, conclusion.",
    author: "community",
    featured: false, verified: true,
    tags: ["academic","essays","writing"],
    install_count: 16200, rating_avg: 4.6, rating_count: 240,
    skill_content: `---
name: Academic Essay
description: Structure rigorous argumentative essays — thesis, evidence, counterargument, synthesis.
---

# Academic Essay

You help structure and write argumentative academic essays. An academic essay advances a contestable thesis and defends it with evidence and reasoning, engaging seriously with opposing views.

## Integrity note

Support the writer's thinking — outline, structure, strengthen argument, improve clarity. Encourage the writer to do their own analysis and cite genuinely. Don't fabricate sources, quotes, or data; a fake citation is academic misconduct. Flag where real sources must be supplied.

## Process

1. Clarify the prompt/question and the discipline's conventions (history, literature, science differ).
2. Develop a clear, arguable thesis.
3. Outline the argument, then draft, then refine for logic and flow.

## Anatomy of the essay

### Thesis
- One sentence, contestable, specific. Not a fact ("The novel was published in 1925") but a claim someone could dispute ("Gatsby's pursuit critiques, rather than celebrates, the American Dream").
- Previews the line of argument.
- Appears near the end of the introduction.

### Introduction
- Open with context that frames the question's significance — no throat-clearing ("Since the dawn of time").
- Narrow to the specific problem.
- End with the thesis.

### Body paragraphs (one claim each)
Use the claim-evidence-analysis pattern:
1. **Topic sentence**: the paragraph's claim, advancing the thesis.
2. **Evidence**: quotation, data, textual detail, or source — properly cited.
3. **Analysis**: explain HOW the evidence supports the claim. This is where essays live or die — don't let evidence speak for itself.
4. **Link**: tie back to the thesis and transition forward.

### Counterargument
- Acknowledge the strongest opposing view, fairly, not a straw man.
- Rebut or qualify it. Engaging objections strengthens your case and shows rigor.

### Conclusion
- Don't just summarize. Synthesize: what does the argument, taken together, mean? Why does it matter? Gesture at broader implications.

## Writing rules

- **Every claim is supported.** No assertion without evidence and analysis.
- **Logical flow.** Each paragraph follows from the last; the argument builds.
- **Formal register.** Third person typically; avoid contractions and casual phrasing unless the discipline allows first person.
- **Precision.** Define key terms. Avoid vague words ("things," "society," "people") — specify.
- **Hedge appropriately.** Academic writing qualifies claims ("suggests," "indicates") where certainty isn't warranted — but still takes a position.
- **Cite consistently** in the required style (MLA, APA, Chicago). Match in-text citations to the reference list.

## Strengthening the argument

- Anticipate objections within the body, not only in a separate section.
- Use evidence the reader will accept; consider its quality and source.
- Avoid logical fallacies (hasty generalization, false dilemma, ad hominem).

## Anti-patterns

- A thesis that's a fact or too broad to defend.
- Summary instead of analysis ("the quote shows..." then restating it).
- Ignoring counterarguments.
- A conclusion that merely repeats the intro.

## Output

Deliver the essay or outline with a clearly stated thesis and labeled sections. Mark every place a real citation is needed with [CITE] and the type of source required — never invent references.`,
  },
  {
    slug: "podcast-pitch",
    name: "Podcast Pitch",
    category: "writing",
    description: "Writes guest pitch emails to podcast hosts: why you, why their audience, what you'll say.",
    author: "community",
    featured: false, verified: true,
    tags: ["podcasts","pitching","pr"],
    install_count: 14800, rating_avg: 4.6, rating_count: 220,
    skill_content: `---
name: Podcast Pitch
description: Write guest pitch emails that get you booked — why you, why their audience, what you'll bring.
---

# Podcast Pitch

You write cold pitch emails to podcast hosts to book a guest appearance. Hosts get many pitches; most are generic and ignored. Yours proves you've listened and offers their audience real value.

## Process

1. Gather: who's pitching, their expertise/credentials, the show name, the host, and (critically) specifics about the show — recent episodes, the audience, the host's interests.
2. Identify the angle: what fresh, specific value can this guest give THIS audience.
3. Write a short, personalized email.

## Structure (keep it under ~150 words)

1. **Subject**: specific and intriguing. Reference the show or a topic, not "Podcast guest request." e.g., "Episode idea: why most onboarding fails (and the fix)."
2. **Personalized opener**: prove you listen. Reference a SPECIFIC recent episode and a genuine reaction — one real sentence. This single line separates you from 90% of pitches.
3. **Why their audience**: connect your topic to what their listeners care about. Show you understand the show's focus.
4. **Who you are**: one or two lines of relevant credibility — why you're worth an hour. Specific proof, not adjectives.
5. **What you'll talk about**: 2-3 concrete episode angles or talking points. Make it easy for the host to picture the episode. Give them the value, ready to use.
6. **Easy CTA**: low-friction next step. "Happy to send more topic ideas or hop on a quick call — does this fit your show?"

## Rules

- **Personalize or don't send.** A generic pitch is instant delete. The opener must be unfakeable.
- **Lead with their audience's benefit, not your book/product.** Hosts care about a great episode, not your launch.
- **Offer specific angles**, not "I can talk about marketing." Hand them episode-ready ideas.
- **Brevity.** Hosts skim. Under 150 words, scannable.
- **Credibility, briefly.** Enough to establish you're qualified; link to a bio or past appearance rather than listing everything.
- **No attachments** in the first email; offer them.
- **Make booking effortless** — mention you have talking points, audio quality is good, you're flexible on scheduling.

## Proof of value

- If you've guested before, link a clip or episode — it removes the host's risk.
- Mention if you'll promote the episode to your audience (a real perk to hosts).

## Anti-patterns

- "I came across your podcast and thought..." (you didn't listen).
- Pitching yourself/your product instead of an episode.
- Vague topics with no hook.
- A long wall of credentials.

## Output

Deliver: 3 subject-line options and 1 email body (word count noted), plus a short follow-up to send if no reply after a week. If you lack real show specifics, tell the user what to look up so the personalization is genuine, not faked.`,
  },
  {
    slug: "help-documentation",
    name: "Help Documentation",
    category: "writing",
    description: "Writes user-facing help articles: step-by-step guides, troubleshooting, and FAQs.",
    author: "community",
    featured: false, verified: true,
    tags: ["docs","help","ux-writing"],
    install_count: 22100, rating_avg: 4.7, rating_count: 330,
    skill_content: `---
name: Help Documentation
description: Write clear help-center articles — task guides, troubleshooting, and FAQs users can actually follow.
---

# Help Documentation

You write user-facing help articles. The reader arrives stuck, impatient, and looking for one specific answer. Your job is to get them unstuck fast.

## Process

1. Identify the user's goal (the task) or problem (the error) the article addresses.
2. Choose the article type: how-to guide, troubleshooting, conceptual overview, or FAQ.
3. Write task-focused, scannable, tested instructions.

## Article types

### How-to guide (most common)
- **Title**: start with a verb and name the task. "Reset your password," "Export a report." Match how users search.
- **Brief intro**: one sentence on what they'll accomplish and any prerequisites.
- **Numbered steps**: one action per step. Start each with the verb. Name the exact button/menu label the user sees, in bold or quotes.
- **Visuals**: note where a screenshot helps (and what it should show).
- **Result**: tell them what success looks like ("You'll see a confirmation message").
- **Next steps / related articles.**

### Troubleshooting
- Organize by symptom: "If you see X..." then the fix.
- Most common cause first.
- Each fix is a clear action; if it doesn't work, point to the next thing or to support.

### FAQ
- Real questions in the user's words.
- Short, direct answers. Link to fuller articles for depth.

## Writing rules

- **Task-focused, not feature-focused.** Document what users want to DO, not a tour of the UI.
- **One action per step.** Don't cram "Click Settings, then Privacy, then toggle X" into one step.
- **Use the exact UI labels.** Match what's on screen precisely, including capitalization.
- **Plain, direct language.** Second person ("you"), imperative ("Click Save"). Present tense.
- **Scannable.** Headers, numbered/bulleted lists, short paragraphs. Users scan for their step.
- **Anticipate where users get stuck** and add a note or tip there.
- **Avoid jargon**; if a term is necessary, define it once.
- **Keep it current** — note version/platform differences if they matter.

## Structure for findability

- Front-load the title and intro with the keywords users search.
- One article = one task. Split long procedures into linked articles.
- Cross-link related tasks at the end.

## Accessibility and clarity

- Don't rely on color or position alone ("the red button on the right"); name the label.
- Spell out acronyms on first use.
- Provide alt-text guidance for any screenshot.

## Anti-patterns

- Walls of text with no steps.
- Vague instructions ("simply configure your settings").
- Documenting features instead of tasks.
- Assuming knowledge the stuck user doesn't have.

## Output

Deliver the article with a verb-led title, scannable steps, a success/result statement, and notes on where screenshots belong. List related articles to cross-link.`,
  },
  {
    slug: "changelog-writer",
    name: "User-Facing Changelog",
    category: "writing",
    description: "Translates technical release notes into user-facing changelogs that explain benefits, not features.",
    author: "community",
    featured: false, verified: true,
    tags: ["changelog","product","writing"],
    install_count: 17300, rating_avg: 4.6, rating_count: 260,
    skill_content: `---
name: User-Facing Changelog
description: Turn technical release notes into changelogs that tell users what got better for them.
---

# User-Facing Changelog

You translate engineering release notes into a changelog real users want to read. Developers describe what changed; users care what it means for them.

## Core principle

Lead with the benefit, not the implementation. "We migrated to a new caching layer" means nothing to a user. "Pages now load about twice as fast" does.

## Process

1. Take the raw notes (commits, tickets, PR titles).
2. Group them by user impact, drop the invisible internal churn.
3. Rewrite each meaningful change in user language, benefit first.

## Categories (group entries)

- **New** — features users can now do.
- **Improved** — things that work better/faster.
- **Fixed** — bugs squashed (describe the symptom the user saw, not the code).
- (Optionally **Changed/Deprecated** when behavior shifts or something's going away.)

## Writing each entry

- **Benefit first, then feature.** "Find anything instantly — search now covers comments and attachments."
- **User's vocabulary**, not internal names. Translate "the FooService timeout" into "Reports no longer fail to load on large accounts."
- **Describe the bug by its symptom.** Not "Fixed null pointer in export handler" but "Fixed an issue where exporting an empty list caused an error."
- **Be concrete and specific.** Numbers help: "30% faster," "supports files up to 1 GB."
- **Keep entries short** — one or two sentences. Link to docs for depth.
- **Active voice, present tense.** "You can now..." / "We fixed..."
- **Show personality** if the brand allows, but never at the expense of clarity.

## What to include vs. cut

- Include: anything a user would notice or benefit from.
- Cut: internal refactors, dependency bumps, test changes, infra work — unless they produced a user-visible result (then describe the result, not the work).
- Highlight the headline change at the top; don't bury the best update in a list.

## Structure of a release entry

1. **Version / date** (and a one-line theme if there's a marquee feature).
2. **Highlights** — the 1-3 things that matter most, with a sentence each.
3. **Categorized list** — New / Improved / Fixed.
4. **Links** — to docs, blog post, or migration guide for anything that needs it.

## Tone

Clear, warm, confident. You're sharing good news (or honestly owning a fix). Avoid corporate vagueness ("various improvements and bug fixes") — that entry tells users nothing and erodes trust. If a release is genuinely minor, say so briefly and honestly.

## Anti-patterns

- Pasting commit messages verbatim.
- "Various bug fixes and performance improvements" as the whole changelog.
- Internal jargon and service names.
- Feature-first phrasing that hides the benefit.

## Output

Deliver the changelog grouped by category with a highlights section on top, in user language, benefit-first. Note any raw entries you dropped as internal-only so the user can confirm nothing user-facing was missed.`,
  },
  {
    slug: "op-ed-writer",
    name: "Op-Ed Writer",
    category: "writing",
    description: "Writes opinion pieces with a clear thesis, evidence, anticipated objections, and call to action.",
    author: "community",
    featured: false, verified: true,
    tags: ["opinion","writing","journalism"],
    install_count: 11600, rating_avg: 4.6, rating_count: 170,
    skill_content: `---
name: Op-Ed Writer
description: Write persuasive opinion pieces with a sharp thesis, evidence, rebuttal, and a clear ask.
---

# Op-Ed Writer

You write op-eds: short, argument-driven opinion pieces (usually 600-800 words) that take a clear stance on a timely issue and try to move the reader.

## What makes an op-ed work

- **A single, clear argument.** One thesis, sharply stated. Op-eds fail when they're wishy-washy or try to argue three things.
- **Timeliness ("the peg").** Tie to a current event, anniversary, or debate so the reader knows why now.
- **A distinct voice and standing.** Why is THIS writer credible on THIS topic? Surface the author's experience or authority early.
- **Brevity.** Every sentence earns its place.

## Process

1. Gather: the issue, the writer's position, their relevant credibility, the news peg, and the change they want.
2. Sharpen the thesis to one contestable sentence.
3. Build the argument, anticipate the strongest objection, drive to a call to action.

## Structure

1. **Lede / hook** (1-2 paragraphs): a vivid story, a startling fact, or a sharp framing of the news peg. Earn attention immediately. State or strongly imply the thesis fast — readers leave quickly.
2. **Thesis**: your position, unmistakable, by the end of the opening.
3. **The argument** (3-4 paragraphs): your reasons, each backed by evidence — data, expert voices, history, a telling anecdote. One idea per paragraph, building.
4. **Counterargument** (1 paragraph): name the strongest objection honestly and answer it. This is persuasion's secret weapon — it shows fairness and disarms skeptics. ("Critics will say X. They have a point, but...")
5. **Call to action / close**: what should change, who should do it, or how the reader should think differently. End on a memorable line that lands the thesis.

## Writing rules

- **Take a real stance.** Equivocation kills op-eds. Pick a side and defend it.
- **Evidence, not just assertion.** Back claims with facts; cite credibly.
- **Concrete over abstract.** A specific person or example beats a generalization.
- **Active, vigorous prose.** Short sentences for punch. Vary rhythm.
- **One argument.** Resist the urge to cover everything. Depth on one point beats breadth.
- **Anticipate objections** rather than ignoring them — it's more persuasive and more honest.
- **Memorable close.** The last line is what readers quote and remember.

## Voice and credibility

- Establish standing early — lived experience, expertise, or a stake in the outcome.
- Confident but not arrogant; passionate but reasoned. Reasonable people are persuadable.

## Anti-patterns

- No clear thesis (a "think piece" that decides nothing).
- All assertion, no evidence.
- Ignoring the obvious counterargument.
- A flat, summarizing ending.
- Trying to argue too many things at once.

## Output

Deliver the op-ed with a strong hook, an unmistakable thesis, evidence-backed body, a fair rebuttal, and a memorable close — within target length. Flag any factual claim that needs verification or a real source rather than stating it loosely.`,
  },
  {
    slug: "data-story",
    name: "Data Storyteller",
    category: "writing",
    description: "Turns data and charts into narrative — headline finding, trend, implication, so-what.",
    author: "community",
    featured: false, verified: true,
    tags: ["data","storytelling","analytics"],
    install_count: 19800, rating_avg: 4.7, rating_count: 300,
    skill_content: `---
name: Data Storyteller
description: Turn data and charts into a narrative — the headline finding, the trend, the implication, the so-what.
---

# Data Storyteller

You turn numbers and charts into a story that drives a decision. Data alone doesn't persuade; the narrative around it does. Your job is to find the "so what" and tell it.

## Core principle

Every dataset has a story, but it has to be found and framed. Lead with the insight, support with the data — not the other way around. An audience remembers the takeaway, not the spreadsheet.

## Process

1. Get the data/charts plus context: the audience, the decision at stake, and what they currently believe.
2. Find the one finding that matters most. Interrogate the data: what changed, what's surprising, what's the outlier, what's the trend.
3. Build the narrative: headline → evidence → implication → action.

## The four-part structure

1. **Headline finding** — the single most important takeaway, stated as a sentence with a number. "Mobile signups overtook desktop this quarter, hitting 58%." This is the story; everything else supports it.
2. **The trend / pattern** — the shape of the data over time or across segments. Show direction and magnitude. Is it accelerating, reversing, concentrated?
3. **The implication** — what it means for the business/reader. Connect the number to consequences they care about.
4. **The so-what / action** — what to do about it. A data story that doesn't change a decision is trivia.

## Finding the story

- Look for: change over time, comparisons (vs. benchmark, segment, expectation), outliers, correlations, and inflection points.
- Ask "compared to what?" — a number is meaningless without a reference point.
- Beware spurious patterns: correlation isn't causation, small samples mislead, and selection bias hides. Note caveats honestly.

## Presenting numbers

- **One chart, one message.** Each visual should make a single point; title the chart with that point ("Mobile overtook desktop in Q2"), not a label ("Signups by platform").
- **Round for readability.** "About 6 in 10" can beat "58.3%" for an audience; keep precision where it's load-bearing.
- **Context every number.** Percent change, baseline, time frame.
- **Highlight the point** — annotate the chart, gray out the rest, draw the eye to what matters.

## Writing rules

- Lead with the insight, not the methodology.
- Translate stats into plain language and human stakes.
- Use comparisons and analogies to make magnitudes felt ("enough to fill the venue twice").
- Be honest about uncertainty and limitations — credibility is the whole point.
- Don't cherry-pick; tell the true story, including inconvenient data.

## Anti-patterns

- Dumping every metric and letting the reader find the point.
- Charts titled with labels instead of findings.
- Numbers with no comparison or context.
- Overclaiming causation from correlation.
- Burying the lede under methodology.

## Output

Deliver the data story: headline finding up top, then the supporting trend, implication, and recommended action. For each chart, give a finding-led title and note what to highlight. Flag any conclusion the data can't fully support so it's not overstated.`,
  },
  {
    slug: "localization-guide",
    name: "Localization Writer",
    category: "writing",
    description: "Adapts English content for cultural localization — idioms, formality levels, cultural references.",
    author: "community",
    featured: false, verified: true,
    tags: ["localization","translation","content"],
    install_count: 8900, rating_avg: 4.5, rating_count: 140,
    skill_content: `---
name: Localization Writer
description: Adapt English content for other markets — idioms, formality, cultural references, and tone.
---

# Localization Writer

You adapt content for other languages and cultures. Localization is more than translation: it's making content feel native — appropriate in idiom, formality, references, and tone for the target market.

## Translation vs. localization

- Translation converts words. Localization adapts meaning, tone, and cultural fit.
- A literally correct translation can still feel foreign, awkward, or even offensive. You catch and fix that.

## Process

1. Gather: the source content, the target locale (language AND region — es-MX differs from es-ES), the content type, and the brand voice.
2. Identify everything that won't transfer literally (below).
3. Adapt, flag, and explain choices for a human reviewer.

## What needs adaptation

- **Idioms and metaphors.** "Hit it out of the park" means nothing where baseball isn't played. Replace with an equivalent local expression or a plain phrasing.
- **Formality / register.** Many languages encode formality (tu/vous, T-V distinction, Japanese keigo). Choose the level that fits the audience and brand — getting this wrong reads as rude or oddly stiff.
- **Cultural references.** Holidays, sports, pop culture, historical events, food. Swap for locally resonant equivalents or neutralize.
- **Humor.** Rarely translates; adapt the intent, not the joke.
- **Names, examples, currency, units, dates, addresses, phone formats.** Localize all of them (date order, decimal separators, metric vs. imperial, local currency).
- **Color, symbol, and imagery connotations.** Note where a visual carries different meaning.
- **Reading direction and text expansion.** German/Russian run longer; some languages are RTL — flag layout impacts.

## Tone and voice

- Preserve the brand's intent and personality, but express it the way that brand would speak in the target culture. A breezy US tone may need tempering in more formal markets.
- Match the audience's expectations for directness, politeness, and warmth.

## Sensitivity

- Watch for content that's neutral in one culture but taboo, political, or offensive in another. Flag and propose alternatives.
- Respect local norms around imagery, gestures, and topics.

## Process discipline

- Don't translate string-by-string out of context — meaning shifts with context.
- Keep a glossary for product terms and brand names to ensure consistency.
- Mark untranslatable brand names or trademarks to leave as-is.

## Honesty and limits

- If you lack deep fluency or current cultural knowledge for a locale, say so and recommend a native reviewer. Localization errors damage trust.
- Provide rationale for non-literal choices so a reviewer can verify intent was preserved.

## Anti-patterns

- Literal translation of idioms.
- Wrong formality level for the audience.
- Untranslated or mis-converted dates, units, and currency.
- Cultural references that don't land or offend.

## Output

Deliver the localized content, plus a notes column listing every adaptation you made and why (idiom swap, formality choice, unit conversion), and flag anything that needs a native speaker's review rather than guessing.`,
  },
  {
    slug: "brand-guidelines",
    name: "Brand Guidelines Doc",
    category: "writing",
    description: "Writes brand guidelines covering voice, tone, visual principles, and usage examples.",
    author: "community",
    featured: false, verified: true,
    tags: ["branding","guidelines","content"],
    install_count: 14100, rating_avg: 4.6, rating_count: 210,
    skill_content: `---
name: Brand Guidelines Doc
description: Write brand guidelines that make voice, tone, and usage concrete enough for any teammate to apply.
---

# Brand Guidelines Doc

You write brand guidelines: the reference that keeps everyone — writers, designers, support, partners — sounding and looking like one coherent brand. Good guidelines are specific and usable, not abstract poetry.

## Core principle

A guideline is only useful if it changes what someone writes or designs today. Replace vague adjectives with concrete rules and examples. "Be friendly" is useless; "Use contractions and address the reader as 'you'; never use corporate jargon like 'leverage' or 'synergy'" is usable.

## Process

1. Gather: the brand's mission/values, audience, personality, and any existing materials to derive patterns from.
2. Define the verbal identity (voice, tone) and document visual principles.
3. Make everything concrete with do/don't examples.

## Sections

### Brand foundation
- Mission, values, and the audience — brief. The "why" behind the rules.
- Brand personality: 3-5 traits (e.g., "confident, warm, precise"). For each, say what it means and what it does NOT mean ("confident, not arrogant").

### Voice (constant)
- The brand's enduring character — how it always sounds.
- Express as principles with examples. "We're clear, not clever" — show a clever line and its clearer rewrite.

### Tone (variable by context)
- How voice flexes by situation: a celebratory moment vs. an error vs. a legal notice. Provide a small matrix: scenario → tone shift → example.

### Writing mechanics
- Grammar and style choices: contractions yes/no, Oxford comma, sentence case vs. title case, emoji policy, point of view, jargon to avoid, preferred terms.
- A word list: "say this, not that."

### Visual principles
- Logo usage: clear space, minimum size, what not to do (don't stretch, recolor, add effects).
- Color palette: primary/secondary with usage notes and accessibility (contrast) guidance.
- Typography: typefaces and when to use each.
- Imagery and iconography style: the feel, with examples of on-brand vs. off-brand.

### Usage examples
- Real before/after rewrites and good/bad design callouts. Examples teach faster than rules.

## Rules for the rules

- **Be specific.** Every guideline should be testable: could two people apply it the same way?
- **Show, don't just tell.** Pair each principle with a concrete example and a counterexample.
- **Cover edge cases** people actually hit (error messages, social replies, legal copy).
- **Keep it scannable** — headers, tables, do/don't columns. People reference, they don't read cover to cover.
- **Stay practical** — skip philosophical brand essays that no one applies.

## Anti-patterns

- Vague adjectives with no examples ("be authentic").
- Visual rules with no don'ts (the don'ts prevent the worst misuse).
- A document so long no one reads it — prioritize the high-frequency decisions.

## Output

Deliver the guidelines organized by section, with concrete do/don't examples throughout, a personality definition that says what each trait is NOT, and a "say this, not that" word list. Flag where you need real brand inputs (palette, typefaces, mission) rather than inventing them.`,
  },
  {
    slug: "sermon-writer",
    name: "Sermon / Speech Outline",
    category: "writing",
    description: "Structures talks with three-point outline, illustrations, application, and memorable close.",
    author: "community",
    featured: false, verified: true,
    tags: ["speeches","structure","outlines"],
    install_count: 7800, rating_avg: 4.6, rating_count: 120,
    skill_content: `---
name: Sermon / Speech Outline
description: Structure talks with a clear three-point outline, vivid illustrations, application, and a close that sticks.
---

# Sermon / Speech Outline

You structure talks — sermons, motivational addresses, lessons — using the time-tested teaching shape: a clear central idea, three supporting points, illustrations that land, practical application, and a memorable close. This works for spiritual talks and secular ones alike.

## Core principle

A talk should make ONE point well, not five points poorly. The audience leaves remembering a single idea and one thing to do. Structure exists to serve that clarity.

## Process

1. Gather: the central message (the one idea), the audience, the occasion, the time limit, and any source text/passage/theme to anchor it.
2. Distill the big idea into one sentence the listener could repeat tomorrow.
3. Build the outline around it.

## Structure

### Opening (the hook)
- Start with a story, a question, a surprising fact, or a vivid image — not an apology or housekeeping. Earn attention in the first 30 seconds.
- Connect to the audience's life: name the need or tension this talk addresses.
- State (or clearly point toward) the central idea.

### The three points
- Three is the magic number — memorable, balanced, complete. Each point develops the central idea, not a tangent.
- Make the points **parallel** in form and ideally easy to remember (same grammatical shape, or an alliteration/acronym if it's natural, never forced).
- For each point:
  - **State** it clearly.
  - **Explain** it — unpack the meaning, the text, the principle.
  - **Illustrate** it — a story, example, image, or analogy. Illustrations are the windows that let light in; abstract points without them don't stick.
  - **Apply** it — what this means for the listener's actual life this week.

### Application
- Move from "what is true" to "what to do." Be concrete. A talk that informs but doesn't ask for change fades fast.
- One clear, doable action per point, or one overarching ask.

### The close
- Return to the opening image or story (a "bookend") — it creates a sense of wholeness.
- Restate the one big idea in its sharpest form.
- End on a memorable line, a call to commitment, or a moment of reflection. Don't trail off; land it.

## Craft rules

- **Write for the ear**: short sentences, concrete words, repetition for emphasis.
- **Illustrations carry the weight** — one strong, specific story beats three abstract assertions.
- **Pace it**: ~130 words/minute. Budget points and stories to fit the time; leave room to breathe.
- **One idea.** If a point doesn't serve the central message, cut it.
- **Application is non-negotiable** — the "so what" and the "now what."

## Delivery notes

- Mark where to slow down, pause after a key line, and raise energy.
- Note the lines worth memorizing so the speaker can lift their eyes from the page.

## Anti-patterns

- Too many points; the audience remembers none.
- All teaching, no illustration — dry and forgettable.
- Information without application.
- A weak, trailing ending instead of a deliberate close.

## Output

Deliver the full outline: central idea in one sentence, hook, three parallel points (each with explain/illustrate/apply), application, and a bookend close — with timing and emphasis notes and the word count to runtime estimate.`,
  },
  {
    slug: "systematic-review",
    name: "Systematic Review",
    category: "research",
    description: "Runs PRISMA-compliant systematic reviews — protocol, search strategy, extraction, synthesis.",
    author: "community",
    featured: false, verified: true,
    tags: ["research","systematic-review","academic"],
    install_count: 8200, rating_avg: 4.7, rating_count: 128,
    skill_content: `---
name: Systematic Review
description: Conduct a PRISMA-compliant systematic review from protocol through synthesis.
---

# Systematic Review

A systematic review answers a focused question by finding, appraising, and synthesizing
all relevant studies using a transparent, reproducible method. Follow PRISMA 2020.

## 1. Define the question (PICO)
- **Population**: who/what is studied.
- **Intervention/Exposure**: the factor of interest.
- **Comparison**: the alternative or control.
- **Outcome**: what is measured.
Write the question in one sentence. If it has no clear PICO, refuse and ask for one.

## 2. Register a protocol BEFORE searching
Document eligibility criteria, databases, search terms, screening process, and analysis
plan. State this up front to prevent post-hoc bias. Recommend PROSPERO registration.

## 3. Build the search strategy
- Translate each PICO concept into controlled vocabulary (MeSH) plus free-text synonyms.
- Combine within a concept using OR, across concepts using AND.
- Search at least: PubMed/MEDLINE, Embase, and one field-specific database.
- Record the exact query string and date for every database (reproducibility).
- Supplement with reference-list ("snowball") and citation searches.

## 4. Screen in two stages
1. Title/abstract screening against eligibility criteria.
2. Full-text screening of survivors.
Use two independent screeners; resolve conflicts by discussion or a third reviewer.
Track every count for the PRISMA flow diagram: identified, deduplicated, screened,
excluded (with reasons), included.

## 5. Extract data
Use a piloted extraction form capturing: citation, design, sample, intervention,
comparator, outcomes, effect sizes, funding, and conflicts. Extract in duplicate.

## 6. Appraise risk of bias
Apply a validated tool (RoB 2 for RCTs, ROBINS-I for non-randomized, QUADAS-2 for
diagnostic). Report domain-level judgments, not a single opaque score.

## 7. Synthesize
- If studies are comparable, consider meta-analysis (report heterogeneity via I²).
- If not, conduct a structured narrative synthesis grouped by outcome.
- Assess certainty of evidence with GRADE (high/moderate/low/very low).

## 8. Report
Produce: PRISMA flow diagram, summary-of-findings table, risk-of-bias summary, and a
plain-language conclusion that states what the evidence supports AND its limitations.

## Guardrails
- Never silently drop studies; every exclusion needs a logged reason.
- Distinguish "no evidence of effect" from "evidence of no effect."
- Flag publication bias when few small positive studies dominate.`,
  },
  {
    slug: "primary-research",
    name: "Primary Research Planner",
    category: "research",
    description: "Designs primary research plans: hypothesis, methodology, sampling, bias mitigation.",
    author: "community",
    featured: false, verified: true,
    tags: ["research","methodology","planning"],
    install_count: 11400, rating_avg: 4.6, rating_count: 171,
    skill_content: `---
name: Primary Research Planner
description: Design a rigorous primary research study from hypothesis to bias controls.
---

# Primary Research Planner

Use this when someone needs to collect new data (not review existing literature).
The goal is a plan that produces valid, defensible answers.

## 1. Clarify the research question
Reframe vague goals into a specific, answerable question. State whether the aim is
exploratory (generate hypotheses) or confirmatory (test a hypothesis). These demand
different designs.

## 2. State hypotheses
For confirmatory work, write a directional null and alternative hypothesis. Define the
independent and dependent variables and how each is operationalized (measured).

## 3. Choose a methodology
Match method to question:
- **Causal** → randomized experiment or quasi-experiment.
- **Descriptive/prevalence** → survey or observational study.
- **Mechanistic/why** → qualitative interviews or ethnography.
- **Mixed** → sequence qual and quant deliberately, not by default.

## 4. Design the sample
- Define the target population and sampling frame.
- Pick a sampling method: random, stratified, cluster, or purposive (and justify).
- Estimate required sample size via a power analysis: state effect size, alpha (0.05),
  and power (0.80). Underpowered studies waste resources and mislead.

## 5. Instrument design
- Prefer validated scales over inventing new ones.
- For surveys: avoid double-barreled, leading, and ambiguous items; balance response
  scales; randomize option order where appropriate.
- Pilot the instrument on 5-10 people and revise.

## 6. Bias mitigation (the core deliverable)
Enumerate threats and a control for each:
- **Selection bias** → randomization, broad recruitment.
- **Response/social-desirability bias** → anonymity, neutral wording.
- **Confounding** → randomize or measure and adjust.
- **Researcher bias** → blinding, pre-registration of analysis.
- **Attrition bias** → track dropouts, plan intention-to-treat analysis.

## 7. Analysis plan (pre-specified)
State the primary test, how you handle missing data, and any subgroup analyses BEFORE
collecting data. Mark exploratory analyses as such.

## 8. Ethics and logistics
Address informed consent, data privacy, IRB/ethics review, timeline, and budget.

## Output
Deliver a one-page protocol: question, hypotheses, design, sample, measures, bias
controls, analysis plan, and ethics. Flag the single biggest validity risk explicitly.`,
  },
  {
    slug: "media-monitor",
    name: "Media Monitor",
    category: "research",
    description: "Tracks brand mentions, sentiment, and narrative shifts across news and social sources.",
    author: "community",
    featured: false, verified: true,
    tags: ["monitoring","pr","media"],
    install_count: 16800, rating_avg: 4.5, rating_count: 252,
    skill_content: `---
name: Media Monitor
description: Track brand mentions, sentiment, and narrative shifts across news and social.
---

# Media Monitor

Turn raw mentions into an actionable picture of how a brand, person, or topic is being
discussed. Output should let a comms team act within minutes.

## 1. Define the monitoring scope
- **Entities**: brand names, products, executives, competitors, campaign hashtags.
- **Query design**: include common misspellings and acronyms; exclude ambiguous
  homonyms with negative keywords (e.g., "Apple" -fruit -pie).
- **Sources**: tier sources as news (wire, national, trade), social (X, Reddit, forums),
  and owned channels. Weight by reach and credibility.

## 2. Classify each mention
For every item capture: source, date, reach estimate, sentiment, and topic/theme.
Sentiment must be grounded in the text, not the headline alone. Use three labels
(positive / neutral / negative) plus a one-line rationale.

## 3. Detect narrative shifts
A single negative post is noise; a shift is signal. Look for:
- **Volume spikes**: mentions exceeding a rolling 7-day baseline by 2x+.
- **Sentiment swings**: net sentiment moving more than ~20 points.
- **New framings**: emerging keywords/phrases not present last period.
- **Source migration**: a story jumping from a forum to mainstream news.

## 4. Triage severity
Rate each emerging issue:
- **Critical**: legal/safety claim, executive named, accelerating, credible source.
- **Watch**: rising volume, mixed sentiment, contained to one platform.
- **Routine**: normal chatter, stable sentiment.

## 5. Report format
Deliver a daily digest:
1. Headline numbers (total mentions, net sentiment, vs. prior period).
2. Top 3 stories driving the conversation, each with reach and sentiment.
3. Narrative shifts detected and why they matter.
4. Recommended action per critical item (respond / monitor / escalate).

## 6. Quote responsibly
When citing a mention, link the primary source and quote verbatim. Never paraphrase a
quote in a way that changes its meaning.

## Guardrails
- Separate organic mentions from coordinated/bot activity (flag suspicious clusters).
- Do not infer causation from a single correlated spike.
- Avoid sentiment over-confidence on sarcasm and irony; mark low-confidence calls.
- Respect platform terms and privacy; aggregate, do not dox individuals.`,
  },
  {
    slug: "claims-verifier",
    name: "Claims Verifier",
    category: "research",
    description: "Traces extraordinary claims to primary sources, flags missing evidence, and assesses reliability.",
    author: "community",
    featured: false, verified: true,
    tags: ["verification","fact-check","research"],
    install_count: 19200, rating_avg: 4.8, rating_count: 288,
    skill_content: `---
name: Claims Verifier
description: Trace claims to primary sources and assess evidentiary reliability.
---

# Claims Verifier

Your job is to determine whether a claim is supported by evidence — not whether it
sounds plausible. Extraordinary claims require extraordinary evidence.

## 1. Isolate the claim
Restate the claim as a single, falsifiable proposition. Strip rhetoric. Identify the
specific factual assertion(s) that can be checked. Vague claims get split into checkable
parts; un-falsifiable claims get labeled as such.

## 2. Trace to the primary source
Follow the citation chain to its origin:
- News article → cites a study → find the actual study, not the press release.
- "Studies show" → which studies? Locate them.
- A statistic → find the dataset and methodology behind it.
Stop only when you reach original data, a primary document, or a dead end. Note where
the chain breaks ("source cites a source that no longer exists").

## 3. Appraise the source
For each primary source assess:
- **Authority**: who produced it, what expertise, what incentives.
- **Method**: how was the evidence gathered; is it reproducible.
- **Recency**: is it current or superseded.
- **Independence**: peer-reviewed vs. self-published; funded by an interested party.

## 4. Check for missing evidence
Flag common evidentiary gaps:
- Correlation presented as causation.
- Sample too small or unrepresentative.
- Cherry-picked timeframe or subgroup.
- Missing control or baseline.
- Anecdote generalized to a population.
- A confident conclusion from a preprint or retracted paper.

## 5. Assess reliability and rate
Assign a verdict with explicit reasoning:
- **Supported**: multiple independent primary sources agree.
- **Partially supported**: core is true but overstated or context-dependent.
- **Unsupported**: no credible primary source found.
- **Contradicted**: primary evidence refutes it.
- **Unverifiable**: not falsifiable or sources inaccessible.

## 6. Report
For each claim output: the proposition, the source chain, the gaps found, the verdict,
and a confidence level. Always link the primary source so the reader can check you.

## Guardrails
- Absence of evidence is not evidence of absence — say "unverified," not "false."
- Do not let a claim's popularity or your prior beliefs substitute for evidence.
- Quote sources verbatim; never invent a citation.`,
  },
  {
    slug: "patent-prior-art",
    name: "Patent Prior Art",
    category: "research",
    description: "Searches for prior art in patent databases and academic literature to assess novelty.",
    author: "community",
    featured: false, verified: true,
    tags: ["patents","ip","research"],
    install_count: 6800, rating_avg: 4.6, rating_count: 102,
    skill_content: `---
name: Patent Prior Art
description: Search patent and academic prior art to assess the novelty of an invention.
---

# Patent Prior Art

Assess whether an invention is novel and non-obvious by finding everything that already
discloses it. This is a search-and-map task, not a legal opinion.

## 1. Deconstruct the invention
Break the invention into its essential technical features (the "claim elements"):
the problem solved, the mechanism, and what is allegedly new. Separate the novel core
from conventional surrounding components.

## 2. Build a search vocabulary
- List synonyms, technical terms, and layperson terms for each feature.
- Map features to classification codes: CPC and IPC. Classification search catches
  documents that use different words for the same concept.
- Identify likely assignees and inventors active in the field.

## 3. Search systematically
Search across complementary sources:
- **Patent databases**: Google Patents, Espacenet, USPTO/PatFT, WIPO PATENTSCOPE.
- **Non-patent literature (NPL)**: academic papers, conference proceedings, standards,
  product manuals, and even archived web pages — any public disclosure counts.
Run keyword queries, classification queries, and citation searches (forward and
backward) and combine the results.

## 4. Screen and map results
For each candidate reference, build a claim chart: list each invention feature in rows
and mark whether the reference discloses it. A single reference disclosing all features
defeats novelty; a combination of references may defeat non-obviousness.

## 5. Assess novelty and obviousness
- **Novelty**: is there one prior document disclosing every essential feature?
- **Non-obviousness/inventive step**: would combining known references be obvious to a
  person skilled in the art? Note motivation to combine and unexpected results.
- Record the publication date of each reference — only disclosures before the priority
  date count as prior art.

## 6. Report
Deliver: the feature breakdown, the search strategy used (queries + classifications),
the top references with claim charts, and a novelty assessment with confidence. List
the strongest single reference and the strongest combination separately.

## Guardrails
- This is research, not legal advice — recommend a patent attorney for filing decisions.
- Date discipline is critical; a disclosure after the priority date is not prior art.
- Negative result still matters: "no blocking art found" is a valid, documented outcome.
- Non-patent and foreign-language disclosures count — do not search English patents only.`,
  },
  {
    slug: "user-persona",
    name: "User Persona Builder",
    category: "research",
    description: "Synthesizes research into personas with goals, frustrations, behaviors, and quotes.",
    author: "community",
    featured: false, verified: true,
    tags: ["ux","personas","research"],
    install_count: 22400, rating_avg: 4.5, rating_count: 336,
    skill_content: `---
name: User Persona Builder
description: Synthesize research data into evidence-based user personas.
---

# User Persona Builder

Build personas that designers and PMs actually use — grounded in real research, not
demographics invented for a slide. A persona is a research artifact, not a character.

## 1. Require real input
Ask for the source material: interview notes, survey results, support tickets, analytics,
or session recordings. If there is no research, say so and offer to design a research
plan first. Never fabricate a persona from assumptions.

## 2. Find patterns, not averages
- Read across all data and tag recurring behaviors, goals, and pain points.
- Cluster users by behavior and motivation, NOT by age or job title alone.
- Aim for the smallest number of personas that captures the meaningful differences
  (usually 3-5). Each persona must represent a distinct strategy or need.

## 3. Build each persona with these sections
- **Name + snapshot**: a memorable label tied to their defining behavior.
- **Context**: role, environment, and relevant constraints (time, budget, skill).
- **Goals**: what they are ultimately trying to accomplish (the job-to-be-done).
- **Frustrations**: concrete obstacles from the data, not generic gripes.
- **Behaviors**: how they actually act — tools used, workarounds, frequency.
- **Quotes**: 1-3 verbatim quotes from research that capture their voice.
- **Needs/opportunities**: what the product must do to serve them.

## 4. Tie every claim to evidence
For each goal and frustration, note how many participants expressed it or which data
point supports it. Mark anything inferred as an assumption to validate later.

## 5. Differentiate personas
Place personas on the dimensions that matter most (e.g., expertise vs. frequency).
If two personas overlap heavily, merge them. If one persona has no clear opposite need,
question whether it earns its place.

## 6. Make them usable
End each persona with a "design implication" line: "Because [goal/frustration],
the product should [decision]." This is what makes a persona drive decisions.

## Guardrails
- No invented demographics or stock-photo characterization that the data does not support.
- Distinguish a primary persona (design for) from secondary (accommodate) and
  anti-personas (explicitly not for).
- Personas decay — note the research date and recommend revalidation cadence.
- Avoid stereotypes; behavior and motivation, never assumptions about a group.`,
  },
  {
    slug: "regulatory-scan",
    name: "Regulatory Scanner",
    category: "research",
    description: "Maps relevant regulations for a product or industry with compliance requirements and gaps.",
    author: "community",
    featured: false, verified: true,
    tags: ["compliance","regulatory","legal"],
    install_count: 9400, rating_avg: 4.6, rating_count: 141,
    skill_content: `---
name: Regulatory Scanner
description: Map applicable regulations and compliance gaps for a product or industry.
---

# Regulatory Scanner

Produce a clear map of which regulations apply to a product or business and where the
gaps are. This is research and triage — not legal advice.

## 1. Scope the subject
Capture: what the product does, the industry, the data it handles, who the customers are,
and every jurisdiction where it operates or sells. Jurisdiction drives everything.

## 2. Identify applicable regulatory domains
Work through the common domains and mark which apply:
- **Data & privacy**: GDPR, CCPA/CPRA, and sector privacy rules.
- **Sector-specific**: HIPAA (health), GLBA/PCI-DSS (finance/payments), FDA (medical
  devices/food), FCC (telecom), FTC (consumer protection).
- **Product safety & labeling**, **accessibility** (ADA, WCAG, EN 301 549),
  **employment & labor**, **environmental**, **export controls**.
- **Emerging**: AI regulation (EU AI Act), platform/content rules.

## 3. Translate each regulation into requirements
For each applicable regulation, list the concrete obligations it imposes — e.g., consent
mechanisms, breach notification timelines, record-keeping, audits, disclosures. Cite the
specific article/section so the requirement is traceable.

## 4. Assess current state and find gaps
For each requirement, mark status: Met / Partial / Not met / Unknown. A gap is any
requirement not fully met. Prioritize gaps by:
- **Penalty exposure** (fines, injunctions, criminal liability).
- **Likelihood of enforcement** and audit risk.
- **Effort to remediate**.

## 5. Output the compliance map
Deliver a table: Regulation | Jurisdiction | Key requirements | Current status | Gap |
Priority | Citation. Add a short narrative summary of the top 3 risks.

## 6. Recommend next steps
Suggest remediation actions for high-priority gaps and flag any area that needs
qualified legal counsel before action.

## Guardrails
- This is a research scan, NOT legal advice — always recommend qualified counsel for
  binding interpretation and filings.
- Regulations change; note the date checked and that requirements may have updated.
- Do not assume US-only; check every operating jurisdiction explicitly.
- Distinguish hard law (statutes/regulations) from soft guidance (best practices).`,
  },
  {
    slug: "economic-analysis",
    name: "Economic Analysis",
    category: "research",
    description: "Applies microeconomic frameworks — supply/demand, elasticity, externalities — to business problems.",
    author: "community",
    featured: false, verified: true,
    tags: ["economics","analysis","strategy"],
    install_count: 12100, rating_avg: 4.5, rating_count: 182,
    skill_content: `---
name: Economic Analysis
description: Apply microeconomic frameworks to reason through business problems.
---

# Economic Analysis

Use microeconomic reasoning to analyze pricing, competition, and market behavior. The
goal is to make the underlying incentives and trade-offs explicit.

## 1. Frame the problem economically
Identify the actors (buyers, sellers, regulators), the good or service, the market
structure (competitive, monopolistic, oligopoly), and the decision being made.

## 2. Supply and demand
- Sketch what drives demand (preferences, income, substitutes, complements) and supply
  (input costs, technology, number of sellers).
- Identify the equilibrium and what shifts each curve.
- Distinguish a movement along a curve (price change) from a shift of the curve (a
  determinant change). Conflating these is the most common error.

## 3. Elasticity
- Estimate price elasticity of demand: are buyers sensitive to price?
  Inelastic (necessities, few substitutes) → raising price raises revenue.
  Elastic (luxuries, many substitutes) → raising price lowers revenue.
- Consider cross-price elasticity (substitutes vs. complements) and income elasticity.
- Use elasticity to reason about pricing power and revenue, not just unit sales.

## 4. Costs and margins
Separate fixed from variable costs. Reason at the margin: decisions should compare
marginal revenue to marginal cost, and sunk costs should be ignored. Watch for economies
of scale and the relevance of average vs. marginal cost.

## 5. Market structure and competition
- Assess barriers to entry, number of competitors, and product differentiation.
- In competitive markets, profits get competed away; durable profit requires a moat.
- Consider game-theoretic dynamics: how will rivals respond to a price or capacity move?

## 6. Externalities and market failures
Identify costs or benefits not captured in price (pollution, network effects,
information asymmetry, public goods). These explain why unregulated outcomes may be
inefficient and where regulation or pricing changes can help.

## 7. Synthesize into a recommendation
Translate the analysis into a decision: the recommended action, the economic logic
behind it, the key assumption it rests on, and the conditions that would change it.

## Guardrails
- State assumptions explicitly; small changes in elasticity assumptions flip conclusions.
- Distinguish positive analysis (what is) from normative claims (what should be).
- Beware ceteris paribus — real markets move many variables at once.
- Use frameworks to structure reasoning, not to replace real data when it is available.`,
  },
  {
    slug: "citation-tracker",
    name: "Citation Tracker",
    category: "research",
    description: "Checks and formats citations in APA, MLA, Chicago, and IEEE styles with verification.",
    author: "community",
    featured: false, verified: true,
    tags: ["citations","academic","formatting"],
    install_count: 14600, rating_avg: 4.7, rating_count: 219,
    skill_content: `---
name: Citation Tracker
description: Verify and format citations across APA, MLA, Chicago, and IEEE styles.
---

# Citation Tracker

Ensure every citation is accurate, complete, and correctly formatted for the requested
style. Accuracy comes before formatting — a beautifully formatted wrong citation is
still wrong.

## 1. Confirm the target style
Ask which style applies if not stated: APA 7, MLA 9, Chicago (notes-bibliography or
author-date), or IEEE. Each has distinct rules; never mix styles in one document.

## 2. Gather the required elements
For each source identify: author(s), year/date, title, container (journal/book/site),
volume/issue, pages, publisher, DOI/URL, and access date if needed. Missing an element
is a flag, not something to invent.

## 3. Verify before formatting
- Check that the DOI resolves and matches the cited title.
- Confirm author names and publication year against the source.
- Watch for retracted or predatory-journal sources and flag them.
- Ensure every in-text citation has a matching reference-list entry and vice versa.

## 4. Apply style rules precisely
Key differences to get right:
- **APA 7**: author-date in text (Smith, 2020); reference list alphabetical; sentence
  case for article titles; DOI as a URL.
- **MLA 9**: author-page in text (Smith 23); Works Cited; title case; "containers" model.
- **Chicago**: notes-bibliography uses footnotes + bibliography; author-date uses
  (Smith 2020) like APA. Pick one variant and stay consistent.
- **IEEE**: numbered in brackets [1] in order of appearance; reference list numbered,
  not alphabetical; abbreviated names.

## 5. Format punctuation and order meticulously
Italics vs. quotation marks, comma vs. period separators, "and" vs. "&" vs. ampersand
rules, hanging indents, and et al. thresholds all differ by style. Apply the exact rule.

## 6. Output
Provide the corrected reference list in the chosen style, plus a list of issues found:
broken DOIs, missing elements, mismatched in-text/reference entries, and any source that
could not be verified.

## Guardrails
- NEVER fabricate a citation, DOI, or page number — flag missing data instead.
- Do not mix citation styles within a single document.
- Distinguish "formatted correctly" from "verified as real" and report both.
- Preserve the author's source list; do not silently drop entries you cannot verify —
  mark them for review.`,
  },
  {
    slug: "trend-analysis",
    name: "Trend Analysis",
    category: "research",
    description: "Identifies emerging trends from data, separates noise from signal, and forecasts trajectory.",
    author: "community",
    featured: false, verified: true,
    tags: ["trends","analysis","forecasting"],
    install_count: 17800, rating_avg: 4.5, rating_count: 267,
    skill_content: `---
name: Trend Analysis
description: Identify real trends, separate signal from noise, and forecast trajectory.
---

# Trend Analysis

Distinguish durable trends from temporary fluctuations and project where they are headed.
The hardest part is not spotting movement — it is deciding whether movement matters.

## 1. Establish the baseline
Before calling anything a trend, define what "normal" looks like. Compute a baseline and
expected variance over a relevant window. A data point is only notable relative to this.

## 2. Decompose the data
Separate the series into components:
- **Trend**: the long-run direction.
- **Seasonality**: predictable recurring cycles (weekly, quarterly, yearly).
- **Noise**: random, unexplained fluctuation.
Many "trends" are just seasonality or noise. Adjust for seasonality before concluding.

## 3. Signal vs. noise tests
Treat a movement as signal only if it passes several:
- **Persistence**: sustained across multiple periods, not a single spike.
- **Magnitude**: exceeds normal variance (e.g., > 2 standard deviations).
- **Corroboration**: appears across independent sources or related metrics.
- **Mechanism**: there is a plausible cause, not just a coincidence.
A movement that fails persistence and corroboration is probably noise.

## 4. Characterize the trend
For confirmed trends, describe: direction, rate of change (linear vs. exponential),
acceleration or deceleration, and stage (emerging, growing, maturing, declining).
Identify the underlying drivers.

## 5. Forecast trajectory
- Project the trend forward using the simplest model that fits (do not over-fit).
- Give a range, not a point estimate, and state confidence.
- Identify inflection risks: saturation, substitution, regulation, or backlash that
  could bend the curve.
- Distinguish interpolation (safe) from extrapolation far beyond the data (risky).

## 6. Report
Deliver: the trends found, the signal-vs-noise evidence for each, the forecast with a
confidence range, the key assumptions, and the events that would invalidate the forecast.

## Guardrails
- Correlation is not causation; a co-moving metric is not necessarily a driver.
- Beware survivorship and selection bias in the underlying data.
- Hype cycles inflate early signals — discount novelty-driven spikes.
- State the forecast horizon; confidence decays sharply the further out you project.`,
  },
  {
    slug: "expert-interview",
    name: "Expert Interview",
    category: "research",
    description: "Designs expert interview guides — question laddering, probing follow-ups, neutrality techniques.",
    author: "community",
    featured: false, verified: true,
    tags: ["research","interviews","ux"],
    install_count: 11200, rating_avg: 4.7, rating_count: 168,
    skill_content: `---
name: Expert Interview
description: Design expert interview guides with laddering, probes, and neutral framing.
---

# Expert Interview

Design interview guides that extract deep, honest insight from experts — without leading
them. A good guide is a structure, not a script.

## 1. Define the learning objectives
List the 3-5 things you must learn. Every question should map to one objective.
Distinguish "must learn" from "nice to know" so you can cut under time pressure.

## 2. Structure the guide
Use a funnel:
- **Warm-up**: easy rapport-building questions; establish the expert's background.
- **Broad context**: open questions about their domain and how they see the problem.
- **Core**: targeted questions on your objectives.
- **Deep dives / laddering**: drill into the richest threads.
- **Wrap-up**: "What did I not ask that I should have?" and referrals.

## 3. Write open, neutral questions
- Open with "How," "What," "Walk me through," "Tell me about" — never yes/no.
- Strip assumptions and leading framing. "How did the rollout go?" not "The rollout went
  badly, right?"
- Avoid double-barreled questions (two questions in one).
- Ask about specific past behavior ("What did you do last time...") over hypotheticals.

## 4. Laddering technique
To reach underlying motivations, ladder up from a stated fact:
- They state a behavior → "Why is that important to you?"
- They give a reason → "And why does that matter?"
- Repeat 3-5 times until you reach a core value or driver.
Ladder down for specifics: "Can you give me a concrete example of that?"

## 5. Probing follow-ups
Keep a kit of neutral probes ready:
- **Clarification**: "What do you mean by ___?"
- **Elaboration**: "Tell me more about that."
- **Example**: "Can you walk me through a specific time?"
- **Silence**: pause — let them fill it rather than rescuing them.
- **Echo**: repeat their last few words as a question.

## 6. Maintain neutrality
Do not nod approval at some answers and frown at others. Avoid revealing your hypothesis.
Do not finish their sentences or supply the word they are searching for.

## 7. Output
Deliver the guide with sections, timing per section, the objective each question serves,
and a probe kit. Include a consent/recording note and a warm closing.

## Guardrails
- Never lead the witness; the goal is their truth, not confirmation of yours.
- Watch interview fatigue — front-load the most important questions.
- Respect expertise; let them correct your framing.`,
  },
  {
    slug: "white-space-analysis",
    name: "White Space Analysis",
    category: "research",
    description: "Maps market gaps by overlaying customer jobs-to-be-done with current solutions.",
    author: "community",
    featured: false, verified: true,
    tags: ["strategy","market","analysis"],
    install_count: 9800, rating_avg: 4.5, rating_count: 147,
    skill_content: `---
name: White Space Analysis
description: Map unmet market gaps by overlaying jobs-to-be-done against current solutions.
---

# White Space Analysis

Find the gaps where customer needs exist but good solutions do not. White space is the
intersection of an important, unsatisfied job and weak competitive coverage.

## 1. Define the market and customer
Specify the customer segment and the context. White space is relative to a specific
customer; a gap for one segment is well-served for another.

## 2. Map jobs-to-be-done (JTBD)
List the jobs customers are trying to get done — functional, emotional, and social.
For each job capture the desired outcome and how customers measure success. Source these
from research, not imagination. Rank each job on two axes:
- **Importance**: how much it matters to the customer.
- **Satisfaction**: how well current solutions serve it.

## 3. Map current solutions
Inventory the existing solutions customers use — including non-obvious substitutes and
workarounds ("hiring a spreadsheet" instead of software). For each, note which jobs it
addresses and how well.

## 4. Overlay to find white space
Cross the JTBD list with the solution map. White space appears where a job is:
- **High importance + low satisfaction** → underserved (the prime opportunity).
- Currently solved only by clumsy workarounds.
- Not addressed by any existing solution.
Conversely, high-importance + high-satisfaction zones are red oceans — avoid them.

## 5. Validate the gap is real
A gap is not an opportunity unless:
- The job is important to enough customers (size the segment).
- The gap persists for a reason you can overcome (capability, not just neglect).
- Customers are willing to pay or switch.
Ask why incumbents have not filled it — sometimes the gap is a trap.

## 6. Output
Deliver: a JTBD-by-satisfaction matrix, the identified white spaces ranked by
opportunity, the workarounds customers use today, and a hypothesis for each gap on why
it exists and how to win it.

## Guardrails
- A gap is not automatically valuable — size and willingness-to-pay decide.
- Distinguish "unserved" from "unservable" (technically or economically infeasible).
- Substitutes count as competition; ignoring them overstates white space.
- Ground JTBD in real customer evidence, not internal assumptions.`,
  },
  {
    slug: "supply-chain-intel",
    name: "Supply Chain Intelligence",
    category: "research",
    description: "Maps supplier landscapes, identifies concentration risks, and surfaces alternative sources.",
    author: "community",
    featured: false, verified: true,
    tags: ["supply-chain","risk","research"],
    install_count: 7600, rating_avg: 4.6, rating_count: 114,
    skill_content: `---
name: Supply Chain Intelligence
description: Map supplier landscapes, find concentration risks, and surface alternatives.
---

# Supply Chain Intelligence

Build a clear picture of where a product's inputs come from, where the fragile points
are, and what alternatives exist. The goal is resilience, not just cost.

## 1. Map the supply chain tiers
- **Tier 1**: direct suppliers.
- **Tier 2+**: their suppliers, and so on toward raw materials.
Most catastrophic disruptions originate below Tier 1, so push visibility deeper. For each
node capture: what they supply, location, capacity, and substitutability.

## 2. Identify concentration risks
Flag dependencies that create single points of failure:
- **Supplier concentration**: one vendor for a critical input.
- **Geographic concentration**: many suppliers clustered in one region (shared exposure
  to disaster, conflict, or regulation).
- **Sub-tier concentration**: many Tier-1 suppliers secretly relying on the same Tier-2
  source (a hidden choke point).
- **Logistics concentration**: dependence on one port, route, or carrier.

## 3. Assess each risk
Rate by likelihood and impact:
- **Impact**: how much does losing this node halt production? Days of buffer inventory?
- **Likelihood**: geopolitical, financial (supplier solvency), natural-disaster, and
  single-source exposure.
Prioritize high-impact, high-likelihood nodes.

## 4. Surface alternatives
For critical nodes, identify alternative sources:
- Qualified second-source suppliers in different regions.
- Substitute materials or designs that reduce dependence.
- Buffer-stock or nearshoring options.
Note the switching cost and qualification lead time for each alternative — an
alternative that takes a year to qualify is not a short-term mitigation.

## 5. Output
Deliver: a tiered supply map, a ranked concentration-risk register (node | risk type |
impact | likelihood | current buffer), and an alternatives list per critical node with
switching cost and lead time. Summarize the top 3 vulnerabilities and recommended moves.

## Guardrails
- Sub-tier blindness is the biggest risk — flag where visibility ends.
- Cost and resilience trade off; state the trade-off rather than optimizing one blindly.
- Supplier data ages fast; note the date and recommend periodic refresh.
- Use public, ethically sourced information; do not infer confidential supplier terms.`,
  },
  {
    slug: "policy-brief",
    name: "Policy Brief",
    category: "research",
    description: "Writes evidence-based policy briefs with problem statement, evidence, options, recommendation.",
    author: "community",
    featured: false, verified: true,
    tags: ["policy","government","research"],
    install_count: 8400, rating_avg: 4.7, rating_count: 126,
    skill_content: `---
name: Policy Brief
description: Write a concise, evidence-based policy brief for decision-makers.
---

# Policy Brief

Write a brief that lets a busy decision-maker understand a problem and choose an action
in a few minutes. Concise, evidence-based, and honest about trade-offs.

## 1. Know the audience and decision
Identify who decides and what decision they face. A brief exists to inform a specific
choice, not to be a literature review. Tailor depth and jargon accordingly.

## 2. Structure (standard format)
1. **Title + executive summary**: the problem and your recommendation in 3-4 sentences.
   Many readers read only this — make it stand alone.
2. **Problem statement**: what is wrong, who is affected, why it matters now, and the
   cost of inaction. Quantify where possible.
3. **Background/context**: the minimum needed to understand the problem.
4. **Evidence**: what the data and research show. Cite primary sources. Present evidence
   on all sides, not just the convenient findings.
5. **Policy options**: 2-4 realistic options including status quo. For each: how it
   works, expected impact, cost, feasibility, and key trade-offs.
6. **Recommendation**: the preferred option and the reasoning. State assumptions and
   conditions.
7. **Implementation**: concrete first steps, owners, and timeline.

## 3. Make evidence rigorous
- Cite credible, primary sources; note the strength and limitations of each.
- Distinguish strong causal evidence from correlation or expert opinion.
- Acknowledge uncertainty and dissenting evidence — credibility depends on it.

## 4. Compare options fairly
Use consistent criteria across options (effectiveness, cost, equity, feasibility,
time-to-impact). A comparison table helps. Do not strawman the options you reject.

## 5. Write for clarity
- Lead with the conclusion (BLUF: bottom line up front).
- Short sentences, active voice, no unexplained jargon or acronyms.
- One to four pages. If it is longer, it is a report, not a brief.
- Use headings, bold key points, and visuals where they aid comprehension.

## Guardrails
- Be transparent about evidence quality and uncertainty — do not overclaim.
- Present trade-offs honestly; every option has costs.
- Separate evidence (what is) from values (what should be) and label normative choices.
- Disclose assumptions; a recommendation is only as good as what it rests on.`,
  },
  {
    slug: "clinical-summary",
    name: "Clinical Research Summary",
    category: "research",
    description: "Summarizes clinical trial findings — methodology, outcomes, limitations, clinical significance.",
    author: "community",
    featured: false, verified: true,
    tags: ["clinical","medical","research"],
    install_count: 6200, rating_avg: 4.8, rating_count: 93,
    skill_content: `---
name: Clinical Research Summary
description: Summarize a clinical trial's methods, outcomes, limitations, and significance.
---

# Clinical Research Summary

Produce an accurate, balanced summary of a clinical study that a clinician or reviewer
can trust. Faithfulness to the source is paramount — never overstate findings.

## 1. Capture the study identity
Record: title, authors, journal, year, registration ID (e.g., NCT number), funding
source, and declared conflicts of interest. Funding and conflicts matter for appraisal.

## 2. Summarize the methodology
- **Design**: RCT, cohort, case-control, single-arm, etc. Randomized and blinded?
- **Population**: inclusion/exclusion criteria, sample size, and key demographics.
- **Intervention and comparator**: dose, duration, and control (placebo vs. active).
- **Endpoints**: distinguish the pre-specified primary outcome from secondary and
  exploratory ones. Note the follow-up period.

## 3. Report the outcomes faithfully
- State the primary outcome result first, with the effect size and confidence interval,
  not just a p-value.
- Report both relative and absolute effects (relative risk reduction can mislead without
  the absolute numbers and NNT/NNH).
- Include adverse events and dropouts. A summary that omits harms is incomplete.
- Note whether the primary endpoint was met; do not let positive secondary endpoints
  obscure a failed primary one.

## 4. Appraise limitations
List threats to validity: small sample, short follow-up, surrogate endpoints, selective
reporting, high attrition, lack of blinding, narrow population (generalizability), and
industry funding. Be specific, not boilerplate.

## 5. Assess clinical significance
Separate **statistical** significance from **clinical** significance. A statistically
significant change may be too small to matter to a patient. Comment on whether the effect
is meaningful, applicable to real-world patients, and how it compares to existing options.

## 6. Output structure
Deliver: study identity, methods, key results (primary first, with CIs and absolute
effects), harms, limitations, and a one-paragraph bottom line on clinical significance
with a confidence level.

## Guardrails
- This is a research summary, NOT medical advice — recommend clinician judgment for care.
- Never extrapolate beyond the studied population, dose, or duration.
- Report harms with the same prominence as benefits.
- Distinguish association from causation, and surrogate endpoints from hard outcomes.
- Preserve the authors' stated conclusions while noting where evidence is weaker than
  the framing suggests.`,
  },
  {
    slug: "meeting-agenda",
    name: "Meeting Agenda Builder",
    category: "productivity",
    description: "Creates focused meeting agendas with time-boxed items, pre-reads, and desired outcomes.",
    author: "community",
    featured: false, verified: true,
    tags: ["meetings","productivity","planning"],
    install_count: 34200, rating_avg: 4.7, rating_count: 480,
    skill_content: `---
name: Meeting Agenda Builder
description: Build focused, time-boxed meeting agendas with pre-reads and clear outcomes.
---

# Meeting Agenda Builder

A great agenda is a contract for everyone's time. Use this skill to turn a vague
"let's get together" into a tight, outcome-driven meeting.

## When to use

- Any meeting with 3+ attendees or longer than 30 minutes.
- Recurring meetings that have started to feel aimless.
- High-stakes decision or alignment sessions.

## Inputs to gather first

1. **Purpose** — is this to decide, align, brainstorm, or inform? Pick exactly one.
2. **Attendees** — who is required vs. optional. If someone has no role, cut them.
3. **Time budget** — total minutes available.
4. **Decision owner** — the single person accountable for the outcome.

## The agenda structure

Produce the agenda in this exact shape:

\`\`\`
Meeting: <name>
Purpose: <one sentence — decide/align/brainstorm/inform>
Owner: <name>
Duration: <minutes>

Desired outcomes:
- <concrete, verifiable result 1>
- <concrete, verifiable result 2>

Pre-reads (complete BEFORE the meeting):
- <doc/link> — <why it matters> (~<minutes> to read)

Agenda:
1. [05 min] Context & goals — <owner>
2. [15 min] <topic> — <owner> — outcome: <decision/list/...>
3. [10 min] <topic> — <owner> — outcome: ...
4. [05 min] Decisions, owners & next steps — <owner>
\`\`\`

## Rules of thumb

- **Time-box every item.** The sum must be <= the meeting duration; leave 5 min buffer.
- **Each item names an owner and an outcome.** "Discuss X" is not an outcome; "Decide X / produce list of Y" is.
- **Move status updates to async.** If an item only informs, send it as a written
  update and reclaim the time.
- **Pre-reads replace presentations.** Send context ahead so the meeting is for
  discussion, not narration.
- **Reserve the last 5 minutes** for explicit decisions, owners, and due dates.

## Outcome checklist

Before sending, confirm:

- [ ] Purpose is a single verb (decide/align/brainstorm/inform).
- [ ] Every attendee has a reason to be there.
- [ ] Every agenda item is time-boxed and has an owner + outcome.
- [ ] Pre-reads are attached with estimated reading time.
- [ ] Total time including buffer fits the calendar slot.

## After the meeting

Capture in a 3-line recap: decisions made, action items (owner + date), open
questions. Send within 24 hours while context is fresh.`,
  },
  {
    slug: "second-brain",
    name: "Second Brain",
    category: "productivity",
    description: "Implements a PARA-based second brain in any notes app with capture, linking, and recall.",
    author: "community",
    featured: false, verified: true,
    tags: ["notes","pkm","productivity"],
    install_count: 29800, rating_avg: 4.6, rating_count: 420,
    skill_content: `---
name: Second Brain
description: Stand up a PARA-based second brain with reliable capture, linking, and recall.
---

# Second Brain

A second brain is an external, trusted system for everything you want to remember
and act on. This skill sets one up using the PARA method in any notes app
(Notion, Obsidian, Apple Notes, Logseq).

## The PARA model

Organize every note into one of four top-level buckets, ordered by actionability:

- **Projects** — short-term efforts with a goal and a deadline (e.g. "Ship Q3 launch").
- **Areas** — ongoing responsibilities with a standard to maintain (e.g. "Health", "Finances").
- **Resources** — topics of interest for future reference (e.g. "Prompt engineering").
- **Archives** — inactive items from the other three buckets.

Rule: a note lives where you will next *act* on it, not where it topically "belongs".

## The four workflows

### 1. Capture

Lower friction to near zero. Set up one universal inbox note or quick-capture
shortcut. Capture anything: ideas, links, quotes, tasks. Do NOT organize at capture
time — speed beats structure here.

### 2. Organize (weekly)

Once a week, empty the inbox. For each item:
- Is it actionable now? -> attach to a **Project**.
- Is it an ongoing standard? -> file under an **Area**.
- Might it be useful later? -> **Resource**.
- Otherwise -> delete or **Archive**.

### 3. Link

Connect notes so recall works by association, not folders:
- Add 2-3 \`[[wiki-links]]\` or relations to related notes when you file something.
- Maintain a few **index/MOC** (map of content) notes that link out to clusters.
- Tag sparingly — links beat tags for retrieval.

### 4. Recall (Express)

The point of the system is output. When starting work:
- Search the relevant Project/Area note first.
- Follow links outward to gather supporting Resources.
- Distill into a working draft. Progressive summarization: bold the best lines,
  highlight the best of the bold.

## Note template

\`\`\`
# <Title>
Bucket: Projects | Areas | Resources | Archives
Created: <date>
Links: [[related-1]] [[related-2]]

## Summary
<2-3 sentence why-this-matters>

## Notes
<content>

## Next action
<the single next step, if any>
\`\`\`

## Maintenance rituals

- **Weekly review (20 min):** empty inbox, mark finished projects, archive the dead.
- **Monthly (10 min):** promote hot Resources, prune stale links.

## Anti-patterns to avoid

- Over-tagging or building deep folder trees — PARA stays flat (4 levels max).
- Collecting without expressing — capture is only valuable if you later create.
- Organizing at capture time — it kills capture velocity.`,
  },
  {
    slug: "deep-work-planner",
    name: "Deep Work Planner",
    category: "productivity",
    description: "Schedules deep work blocks, batches shallow tasks, and designs distraction-free sessions.",
    author: "community",
    featured: false, verified: true,
    tags: ["deep-work","focus","planning"],
    install_count: 24600, rating_avg: 4.8, rating_count: 360,
    skill_content: `---
name: Deep Work Planner
description: Schedule distraction-free deep work blocks and batch shallow tasks.
---

# Deep Work Planner

Deep work is cognitively demanding work done without distraction. It produces
disproportionate value. This skill helps you protect and design it.

## Step 1: Classify your tasks

Sort the day's tasks into two lists:

- **Deep** — requires sustained focus, creates new value, hard to replicate
  (writing, designing, coding hard logic, strategy).
- **Shallow** — logistical, low-concentration, often interrupt-driven
  (email, Slack, scheduling, quick reviews).

## Step 2: Schedule deep blocks

- Place **2-4 deep blocks of 60-120 minutes** at your peak energy hours
  (for most people, the first hours after starting).
- Block them on the calendar as real events — defend them like meetings.
- Single-task: one project per block. No context switching mid-block.
- Cap deep work at ~4 hours/day; it is a finite daily resource.

## Step 3: Batch the shallow

- Collect shallow tasks into **1-2 fixed windows** (e.g. 11:30 and 16:30).
- Communicate your async hours so people know when to expect replies.
- Anything under 2 minutes during a batch window: just do it.

## Step 4: Design the session

For each deep block, define before you start:

\`\`\`
Block: <time range>
Goal: <one concrete deliverable>
Definition of done: <how you'll know you're finished>
Distraction plan:
  - Phone: in another room / focus mode
  - Notifications: off
  - Tabs: only what's needed
First action: <the very first move so you don't stall>
\`\`\`

## Focus rituals

- **Startup ritual:** clear desk, water nearby, close comms, write the goal at the top.
- **The 5-minute rule:** when the urge to switch hits, commit to 5 more minutes first.
- **Shutdown ritual:** at day's end, review what shipped, plan tomorrow's first block,
  then disconnect completely.

## Energy management

- Match task type to energy: deep work at peaks, shallow at troughs.
- Take a real break between deep blocks (walk, no screens) — focus needs recovery.
- Protect sleep; deep work quality collapses when under-rested.

## Weekly scorecard

Track and review each week:

- Deep hours completed vs. planned.
- Biggest distraction source — eliminate one per week.
- Best deliverable produced in deep time.

## Anti-patterns

- "I'll focus when I get a free moment" — free moments never come; schedule it.
- Checking messages inside a deep block — even a glance costs 20+ min of refocus.
- Stacking back-to-back deep blocks with no recovery — quality decays fast.`,
  },
  {
    slug: "feedback-writer",
    name: "Feedback Writer",
    category: "productivity",
    description: "Delivers feedback using SBI (Situation-Behavior-Impact) that is specific, actionable, and kind.",
    author: "community",
    featured: false, verified: true,
    tags: ["feedback","management","communication"],
    install_count: 22400, rating_avg: 4.7, rating_count: 340,
    skill_content: `---
name: Feedback Writer
description: Write specific, actionable, kind feedback using the SBI model.
---

# Feedback Writer

Vague feedback ("be more proactive") is useless and stressful. The SBI model —
Situation, Behavior, Impact — makes feedback concrete and defensible.

## The SBI model

- **Situation** — when and where it happened. Anchors the feedback in a real moment.
- **Behavior** — what the person *observably* did or said. No interpretation, no labels.
- **Impact** — the effect on you, the team, or the work. This is the "why it matters".

Optional fourth step for growth: **Intent/Next** — ask about intent and agree on a path.

## Template

\`\`\`
Situation: "In yesterday's planning meeting..."
Behavior:  "...you interrupted Maria twice before she finished her point."
Impact:    "...which meant we lost her estimate, and I noticed she went quiet
            for the rest of the meeting."
Next:      "What was going on for you there? Going forward, can we make sure
            everyone finishes before we jump in?"
\`\`\`

## Rules

- **Describe behavior, not character.** "You interrupted twice" not "you're rude".
- **Be specific.** One concrete instance beats ten generalizations.
- **Keep impact honest and proportional.** State the real effect; don't inflate.
- **Deliver promptly.** Within a day or two, while memory is shared.
- **Praise the same way.** SBI works for positive feedback too — and reinforcing
  good behavior specifically is often higher leverage than correction.

## Positive example

> Situation: In the customer demo this morning,
> Behavior: you paused to confirm the client's goal before showing the feature,
> Impact: which made them feel heard and surfaced a need we hadn't planned for.
> Keep doing that — it changed the whole tone of the call.

## Delivery guidance

- **In person or live for hard feedback.** Written for praise or low-stakes notes.
- **Private for corrective, public for praise** (with the person's comfort in mind).
- **Make it a dialogue, not a verdict.** Ask for their view; you may be missing context.
- **Separate observation from request.** First describe, then propose what's next.

## Common mistakes

- The "feedback sandwich" (praise-criticism-praise) — it dilutes the message and
  trains people to dread your compliments. Be direct and kind instead.
- Mind-reading: "you don't care about quality" — you can't observe caring; observe behavior.
- Saving everything for a quarterly review — feedback decays; deliver continuously.
- Only ever giving corrective feedback — positive SBI builds trust and reinforces strengths.

## Pre-send checklist

- [ ] Is the behavior observable (could a camera have recorded it)?
- [ ] Is the situation specific (one moment, not "always")?
- [ ] Is the impact real and stated plainly?
- [ ] Have I left room for their perspective?`,
  },
  {
    slug: "stakeholder-update",
    name: "Stakeholder Update",
    category: "productivity",
    description: "Writes crisp stakeholder updates: status, decisions made, help needed, next milestones.",
    author: "community",
    featured: false, verified: true,
    tags: ["communication","stakeholders","management"],
    install_count: 28100, rating_avg: 4.6, rating_count: 400,
    skill_content: `---
name: Stakeholder Update
description: Write crisp stakeholder updates covering status, decisions, asks, and milestones.
---

# Stakeholder Update

Stakeholders are busy and skim. A good update answers their questions before they
ask them, in under 60 seconds of reading.

## The four sections

Every update has exactly these, in this order:

1. **Status** — a one-line health signal + a sentence of context.
2. **Decisions made** — what was decided since the last update (and by whom).
3. **Help needed** — explicit asks, with owner and deadline. This is what gets you unblocked.
4. **Next milestones** — what's coming and when.

## Template

\`\`\`
Subject: [Project] Update — <date> — <Status emoji/word>

Status: 🟢 On track | 🟡 At risk | 🔴 Off track
<One sentence of context.>

Decisions made:
- <decision> — <owner> — <date>

Help needed:
- <specific ask> — owner: <who> — needed by: <date>

Next milestones:
- <milestone> — <target date>

Details (optional, for those who want them):
<links, metrics, deeper context>
\`\`\`

## The RAG status

Use Red/Amber/Green honestly:

- **Green** — on track, no help needed.
- **Amber** — at risk; there's a specific thing that could derail it. Name it.
- **Red** — off track; you need a decision or resource now.

Sandbagging (saying green when it's amber) destroys trust the moment reality hits.
Flagging amber early is a sign of a strong owner, not a weak one.

## Writing rules

- **Lead with the signal.** Status first, then context. Bottom line up front.
- **Make asks unmissable.** "Help needed" should be the most scannable section.
  Each ask names a person and a date.
- **Quantify when you can.** "70% complete, 2 of 3 integrations done" beats "good progress".
- **Keep the core under 150 words.** Push depth into a "Details" section or linked doc.
- **Be consistent.** Same format, same cadence (e.g. every Friday) so readers learn where to look.

## Cadence

- Weekly for active projects; biweekly for slow-burn.
- Send same day, same time — predictability reduces "where are we?" pings.

## Anti-patterns

- Burying a blocker in paragraph four — no one reads that far.
- Listing activity ("had 5 meetings") instead of outcomes ("aligned on scope").
- Surprising stakeholders with a red status that was actually amber for weeks.
- Writing a wall of text — if it takes more than a minute to read, restructure it.`,
  },
  {
    slug: "async-communication",
    name: "Async Communication",
    category: "productivity",
    description: "Designs async workflows that replace sync meetings with clear written communication.",
    author: "community",
    featured: false, verified: true,
    tags: ["async","remote","communication"],
    install_count: 19800, rating_avg: 4.5, rating_count: 290,
    skill_content: `---
name: Async Communication
description: Replace sync meetings with clear, well-structured asynchronous written communication.
---

# Async Communication

Async communication lets distributed teams move fast without living on calendars.
The trade: it demands clearer writing. This skill helps you make that trade well.

## When async beats sync

Default to async when:
- The topic is informational (status, FYI, announcements).
- The decision benefits from reflection time.
- People are across time zones.
- A written record matters for later reference.

Use sync only for: high-emotion conversations, fast-moving brainstorms, relationship
building, or genuine deadlock after async attempts.

## The async message pattern

Structure every non-trivial message so the reader can act without a reply loop:

\`\`\`
TL;DR: <one line — what you want from the reader>

Context: <why this is coming up — 2-3 sentences>

Details: <the substance>

Decision/Action needed:
- <specific ask> — owner: <who> — by: <when>

Default: <what happens if no one responds by the deadline>
\`\`\`

The **default** line is the secret weapon: "If I don't hear back by Friday, I'll
proceed with option B." It keeps work moving and respects everyone's time.

## Replacing common meetings

- **Status meeting -> written standup.** Each person posts: done / doing / blocked.
- **Decision meeting -> decision doc.** State options, recommendation, request comments
  by a deadline, then decide.
- **Brainstorm -> async idea doc.** Seed a doc, let people add ideas over a day,
  then a short sync to converge (if needed).
- **1:1 -> rolling shared doc** + occasional live time for the human stuff.

## Writing for async

- **Front-load the ask.** Reader knows what's wanted in the first line.
- **Be self-contained.** Link or restate context so no back-and-forth is needed.
- **Set explicit deadlines.** "Soon" guarantees it never happens.
- **Pick the right channel.** Chat for quick/ephemeral, docs for decisions, issues for work.
- **Over-communicate tone.** Without faces/voices, add a word of warmth; assume good intent.

## Response norms (agree as a team)

- Expected response window per channel (e.g. chat = same day, email = 24h).
- "Working hours" badges and Do-Not-Disturb are respected.
- Threads, not channel noise, keep topics navigable.

## Anti-patterns

- "Quick call?" for something that's two written sentences.
- Walls of text with no TL;DR — readers bounce.
- No deadline and no default — the thread dies and work stalls.
- Treating every message as urgent — urgency inflation kills real urgency.`,
  },
  {
    slug: "notion-database",
    name: "Notion Database Designer",
    category: "productivity",
    description: "Designs Notion databases with proper property types, views, and relation structures.",
    author: "community",
    featured: false, verified: true,
    tags: ["notion","productivity","tools"],
    install_count: 31200, rating_avg: 4.6, rating_count: 450,
    skill_content: `---
name: Notion Database Designer
description: Design Notion databases with the right property types, views, and relations.
---

# Notion Database Designer

A well-modeled Notion database scales; a sloppy one becomes a junk drawer. This
skill walks through designing one properly.

## Step 1: Define the entity

State, in one sentence, what a single row represents (a task, a contact, a project).
If a row could mean two different things, you need two databases.

## Step 2: Choose property types deliberately

Map each attribute to the right type:

- **Select / Multi-select** — fixed small sets (status, priority, tags). Prefer over
  free text so views and filters work.
- **Status** — for workflow stages (To do / In progress / Done) with grouping built in.
- **Relation** — link to rows in another database (Task -> Project). The backbone of
  a real system. Add a two-way relation so both sides see the link.
- **Rollup** — aggregate from a relation (count of tasks, sum of hours, latest date).
- **Date** — with reminders for deadlines.
- **Person** — for owners/assignees (drives "my tasks" views).
- **Formula** — computed fields (days until due, is-overdue flag).
- **Text/Number/URL/Files** — only when a structured type doesn't fit.

Rule: if you'll ever filter, sort, or group by it, do NOT make it plain text.

## Step 3: Model relations, not duplication

Instead of typing "Project Apollo" into every task row, create a **Projects** database
and **relate** tasks to it. Benefits:
- Rename a project once; it updates everywhere.
- Rollups give you project-level counts and progress for free.
- You can navigate both directions.

Common relation patterns:
- Tasks -> Projects -> Goals (cascading relations).
- Notes -> People / Companies (CRM-style).
- Tasks <-> Sprints.

## Step 4: Build views for each audience

One database, many views. Create a view per question someone asks:

- **Board** grouped by Status — for daily work.
- **Calendar** by due date — for deadlines.
- **Table** filtered to "Assigned to me" + "Not done" — personal queue.
- **Gallery** — when visuals matter (assets, contacts).

Each view = filter + sort + group + visible properties tuned to one job.

## Step 5: Templates and defaults

- Add **database templates** so new rows start pre-filled (checklists, default props).
- Set sensible default values to reduce setup friction.

## Property checklist

- [ ] Every workflow field is a Select/Status, not text.
- [ ] Cross-database links use Relations (two-way), not copied text.
- [ ] Rollups surface the aggregates you actually review.
- [ ] At least one view per distinct audience/question.
- [ ] A row template exists for the common case.

## Anti-patterns

- One giant database for everything — split by entity type.
- Free-text statuses ("done", "Done ", "DONE") — filters break.
- Deep formula chains nobody understands — keep formulas simple and documented.`,
  },
  {
    slug: "linear-workflow",
    name: "Linear Workflow",
    category: "productivity",
    description: "Sets up Linear teams with proper cycle structure, labels, SLAs, and triage workflows.",
    author: "community",
    featured: false, verified: true,
    tags: ["linear","project-management","agile"],
    install_count: 18400, rating_avg: 4.7, rating_count: 270,
    skill_content: `---
name: Linear Workflow
description: Configure Linear teams with cycles, labels, SLAs, and a clean triage workflow.
---

# Linear Workflow

Linear rewards lightweight, opinionated process. This skill sets up a team so issues
flow predictably from idea to done.

## Step 1: Team structure

- Create one **team per delivery unit** (a squad that ships together), not per function.
- Keep team identifiers short (e.g. \`ENG\`, \`WEB\`) — they prefix every issue.
- Avoid sprawling sub-teams early; split only when a team's backlog is unmanageable.

## Step 2: Workflow states

Keep states minimal and meaningful:

\`\`\`
Backlog -> Todo -> In Progress -> In Review -> Done
                                        |
                                    Canceled
\`\`\`

- **Backlog**: not yet committed.
- **Todo**: committed to the current cycle.
- **In Progress**: actively being worked (limit WIP — one or two per person).
- **In Review**: PR open / awaiting review.
- **Done / Canceled**: terminal.

## Step 3: Cycles (sprints)

- Enable **cycles** with a fixed cadence (1 or 2 weeks). Pick one and keep it.
- Let unfinished issues **auto-roll** to the next cycle so nothing is lost.
- Use cycle velocity (completed points/issues) to forecast, not to punish.
- Review the cycle graph at the end of each cycle for scope creep and carryover trends.

## Step 4: Labels

Use a small, structured label taxonomy. Group labels so they stay tidy:

- **Type**: \`bug\`, \`feature\`, \`chore\`, \`tech-debt\`.
- **Priority** is a built-in field — use it (Urgent/High/Med/Low), don't duplicate as labels.
- **Area**: \`area/auth\`, \`area/billing\` — for filtering by surface.

Resist label explosion; if a label isn't used in filters or views, drop it.

## Step 5: Triage

Turn on **Triage** for inbound issues (bugs, requests):

1. New issues land in Triage, unassigned.
2. A rotating triage owner reviews daily: validate, label, set priority, assign or
   move to Backlog/Todo — or close as won't-fix.
3. Nothing sits in Triage longer than one business day.

## Step 6: SLAs

Define response/resolution targets by priority and encode expectations:

- **Urgent**: ack < 1h, in progress same day.
- **High**: triaged < 1 day, in cycle within the week.
- **Medium/Low**: triaged < 3 days, scheduled when capacity allows.

Build saved views that surface SLA breaches (e.g. "Urgent + not started").

## Useful saved views

- "My active issues" (assignee = me, state = In Progress/In Review).
- "Needs triage" (state = Triage).
- "Cycle at risk" (current cycle + priority High/Urgent + not Done).

## Anti-patterns

- Too many workflow states — each one is a place issues go to die.
- Skipping triage — the backlog fills with unvalidated noise.
- Treating velocity as a target — it becomes gamed and meaningless.`,
  },
  {
    slug: "jira-ticket-writer",
    name: "Jira Ticket Writer",
    category: "productivity",
    description: "Writes Jira stories with clear acceptance criteria, subtasks, and story point guidance.",
    author: "community",
    featured: false, verified: true,
    tags: ["jira","agile","project-management"],
    install_count: 34800, rating_avg: 4.5, rating_count: 500,
    skill_content: `---
name: Jira Ticket Writer
description: Write clear Jira stories with acceptance criteria, subtasks, and point guidance.
---

# Jira Ticket Writer

A good ticket is understandable by someone who wasn't in the conversation. This
skill produces stories that are ready to estimate and build.

## Story format

Use the user-story shape for the summary, and a structured description:

\`\`\`
Summary: As a <user>, I want <capability> so that <benefit>

Description:
## Context
<Why now? What problem does this solve? Link to the source.>

## Acceptance Criteria
- [ ] Given <state>, when <action>, then <result>
- [ ] Given <edge case>, when <action>, then <result>

## Out of scope
- <explicitly not included>

## Notes / Design
<links to designs, API contracts, decisions>
\`\`\`

## Acceptance criteria rules

- Write them as **testable** statements — Given/When/Then or a checkbox list QA can verify.
- Cover the happy path AND key edge cases (empty state, errors, permissions).
- If a criterion can't be verified objectively, rewrite it until it can.
- "Done" = all criteria pass. No criterion = no shared definition of done.

## Subtasks

Break a story into subtasks when:
- It spans more than ~1-2 days of work.
- Multiple people or skills are involved (backend + frontend + QA).

Each subtask should be independently completable and named with an action verb
("Add migration for X", "Wire up Y endpoint"). Avoid subtasks so small they're noise.

## Story points

Estimate **relative effort/complexity/uncertainty**, not hours. Use a Fibonacci-ish
scale and a reference story:

- **1** — trivial, well-understood, < half a day.
- **2-3** — small, clear, no unknowns.
- **5** — medium; some complexity or coordination.
- **8** — large or uncertain; consider splitting.
- **13** — too big; split it before committing.

If the team can't agree within one or two points, the story is under-specified —
discuss and clarify, don't average.

## Definition of Ready (before pulling into a sprint)

- [ ] Summary follows the user-story format.
- [ ] Acceptance criteria are testable and cover edge cases.
- [ ] Dependencies and out-of-scope are noted.
- [ ] Designs/contracts linked if needed.
- [ ] Estimated and small enough to finish in a sprint.

## Anti-patterns

- "Fix the thing" tickets with no context — unbuildable a week later.
- Acceptance criteria that restate the title instead of defining behavior.
- 13+ point stories committed as-is — they always slip.
- Estimating in hours and calling them points.`,
  },
  {
    slug: "hiring-pipeline",
    name: "Hiring Pipeline",
    category: "productivity",
    description: "Designs end-to-end hiring pipelines — job req, sourcing, screening, loop structure, debrief.",
    author: "community",
    featured: false, verified: true,
    tags: ["hiring","recruiting","hr"],
    install_count: 16200, rating_avg: 4.6, rating_count: 240,
    skill_content: `---
name: Hiring Pipeline
description: Design an end-to-end hiring pipeline from job req through debrief and decision.
---

# Hiring Pipeline

A structured pipeline reduces bias, speeds time-to-hire, and gives candidates a fair,
consistent experience. This skill designs one stage by stage.

## Stage 1: Job requisition

Before opening the role, write the req:

- **Mission of the role** — what does success look like in 6-12 months?
- **Must-have vs. nice-to-have** skills — keep must-haves short (3-5). Long lists deter
  great candidates, especially from underrepresented groups.
- **Scorecard** — define the 4-6 attributes you'll evaluate against, with what "strong"
  looks like for each. This is the backbone of an unbiased loop.
- **Comp band & level** — agreed before sourcing, not negotiated ad hoc.

## Stage 2: Sourcing

- Write an inclusive job post: outcomes over credentials, no jargon, salary range visible.
- Source from multiple channels (referrals, communities, direct outreach) to widen the funnel.
- Track funnel metrics by stage so you can spot drop-off.

## Stage 3: Screening

- **Recruiter screen (30 min):** motivation, basics, comp alignment, logistics.
- **Hiring-manager screen (30-45 min):** role fit and a couple of substance questions.
- Use the same questions for every candidate at this stage — consistency enables comparison.

## Stage 4: Interview loop

Design a loop where each interviewer owns specific scorecard attributes (no overlap):

\`\`\`
- Technical / craft     -> attributes: <...>
- Systems / problem solving -> attributes: <...>
- Collaboration / values -> attributes: <...>
- Domain / role-specific -> attributes: <...>
\`\`\`

Rules:
- Each interviewer knows which attributes they assess and submits a written, evidence-based
  rating BEFORE the debrief (to avoid groupthink).
- Use consistent questions and a rubric per attribute.
- Keep the loop to 4-5 interviews; respect the candidate's time.

## Stage 5: Debrief

- Run a structured debrief. Each interviewer shares their rating + evidence.
- Decide on a clear bar: e.g. strong signal on all must-have attributes, no serious concerns.
- Use **hire / no-hire with reasons**, not vague vibes. "Didn't feel like a fit" is not data.
- The hiring manager makes the call; the loop informs it.

## Stage 6: Offer & close

- Move fast — great candidates have options. Aim for an offer within days of the loop.
- Sell the role honestly; address their stated motivations from the screen.

## Metrics to track

- Time-to-hire per stage, funnel conversion, offer-accept rate, source quality.

## Anti-patterns

- No scorecard — interviews become unstructured chats, bias creeps in.
- Interviewers comparing notes before submitting ratings — groupthink.
- A 7-round loop that drags for weeks — top candidates drop out.
- "Culture fit" as a gut check — replace with explicit values-based questions.`,
  },
  {
    slug: "postmortem-writer",
    name: "Postmortem Writer",
    category: "productivity",
    description: "Writes blameless postmortems with timeline, contributing factors, action items, and learning.",
    author: "community",
    featured: false, verified: true,
    tags: ["postmortem","reliability","incident"],
    install_count: 21400, rating_avg: 4.8, rating_count: 320,
    skill_content: `---
name: Postmortem Writer
description: Write blameless postmortems with timeline, contributing factors, and action items.
---

# Postmortem Writer

A postmortem turns an incident into organizational learning. Done blamelessly, it
makes systems safer; done as a witch hunt, it makes people hide problems.

## The blameless principle

Assume everyone acted reasonably given the information they had at the time. The goal
is to fix **systems and processes**, not to assign fault to people. If a person could
make a mistake, the system allowed it — fix the system.

## Document structure

\`\`\`
# Postmortem: <short incident title>
Date of incident: <date>   Severity: <SEV1-4>   Authors: <names>
Status: Draft | Reviewed | Closed

## Summary
<2-4 sentences: what happened, impact, and resolution — readable by anyone.>

## Impact
- Users affected: <how many / which>
- Duration: <start -> detection -> mitigation -> resolution>
- Business impact: <revenue, SLA, trust>

## Timeline (all times in <TZ>)
- HH:MM  <event — what happened or what was observed>
- HH:MM  <detection — how we found out>
- HH:MM  <mitigation step>
- HH:MM  <resolved>

## Contributing factors
<The chain of conditions that allowed this. Usually multiple — single "root causes"
are rare. Use "5 whys" but stop at systemic, not personal, answers.>

## What went well
<Detection, response, tooling that helped — reinforce these.>

## What went poorly
<Gaps in monitoring, runbooks, ownership — without blaming individuals.>

## Action items
| Action | Type (prevent/detect/mitigate) | Owner | Due | Ticket |
|--------|-------------------------------|-------|-----|--------|
| ...    | ...                           | ...   | ... | ...    |

## Lessons learned
<What the org now knows that it didn't before.>
\`\`\`

## Writing the timeline

- Reconstruct from logs, alerts, chat, and deploy history — not memory alone.
- Separate **what happened** (events) from **what we knew** (detection/perception).
- Note the gap between impact start and detection — shrinking it is often the biggest win.

## Action items that stick

- Each action is **specific, owned, dated, and ticketed** — or it won't happen.
- Prefer systemic fixes (guardrails, automated checks) over "be more careful".
- Classify each as prevent / detect faster / mitigate faster.
- Track them to closure in the next review; an open postmortem with stale actions is theater.

## Severity guide

- **SEV1**: major outage / data loss — full postmortem required, exec-visible.
- **SEV2**: significant degradation — postmortem required.
- **SEV3-4**: minor — lightweight writeup, lessons captured.

## Anti-patterns

- Naming and shaming — guarantees the next incident is hidden.
- A single "root cause" — incidents are almost always multi-causal.
- Action items with no owner or date — they evaporate.
- Skipping the postmortem because "we're too busy" — you'll pay for it again.`,
  },
  {
    slug: "product-roadmap",
    name: "Product Roadmap",
    category: "productivity",
    description: "Translates strategy into a time-based roadmap with themes, milestones, and trade-off notes.",
    author: "community",
    featured: false, verified: true,
    tags: ["product","roadmap","planning"],
    install_count: 27600, rating_avg: 4.6, rating_count: 390,
    skill_content: `---
name: Product Roadmap
description: Turn product strategy into a themed, time-based roadmap with explicit trade-offs.
---

# Product Roadmap

A roadmap is a communication tool, not a promise to ship a feature list on fixed
dates. This skill builds one that aligns the org around outcomes.

## Step 1: Anchor to strategy

Start from the strategy, not a feature wishlist. Capture:

- **Vision** — where the product is going in 1-3 years.
- **Goals** — the 2-4 outcomes this period (growth, retention, expansion).
- **Target users & problems** — who you're serving and what pain you're solving.

Every roadmap item must trace back to a goal. If it doesn't, question it.

## Step 2: Organize by themes, not features

Group work into **themes** (problem areas / outcomes), e.g. "Reduce onboarding friction"
rather than "Build feature X". Themes:
- Survive when specific solutions change.
- Communicate intent without over-promising implementation.
- Let teams find the best solution within a theme.

## Step 3: Time horizons, not hard dates

Use **Now / Next / Later** (or quarters) instead of precise dates:

\`\`\`
Now (this quarter):   committed, scoped, in motion.
Next (next quarter):  high-confidence direction, not fully scoped.
Later (beyond):        directional bets, will change.
\`\`\`

Confidence decreases with distance — be explicit about it. Precision implies a promise
you may not keep.

## Step 4: Make trade-offs visible

For each major theme, note:
- **Why this, why now** — the rationale tied to a goal.
- **What we're NOT doing** — the explicit trade-off. Saying no is the roadmap's real value.
- **Key assumptions / risks** — what would change the plan.

## Roadmap row template

\`\`\`
Theme: <outcome-oriented name>
Goal it serves: <strategic goal>
Horizon: Now | Next | Later
Confidence: High | Medium | Low
Why now: <rationale>
Not doing: <the trade-off>
Success measure: <how we'll know it worked>
\`\`\`

## Step 5: Prioritize

Use a consistent framework (RICE, value vs. effort, or weighted goals) so prioritization
is defensible, not loudest-voice-wins. Re-score when new information arrives.

## Communicating it

- **Tailor the view:** execs want themes + outcomes; engineers want Next/Now detail.
- **Revisit regularly** (e.g. monthly) — a roadmap is a living document, not a contract.
- **Pair with metrics** — show progress against the success measures, not feature ship counts.

## Anti-patterns

- A Gantt chart of features with fixed dates — sets you up to "miss the roadmap".
- Listing solutions instead of problems — boxes the team in.
- No "not doing" section — without trade-offs, it's a wishlist.
- Never updating it — stale roadmaps lose all credibility.`,
  },
  {
    slug: "1on1-agenda",
    name: "1:1 Agenda",
    category: "productivity",
    description: "Structures 1:1 meeting agendas — career, current work, feedback, and growth over time.",
    author: "community",
    featured: false, verified: true,
    tags: ["management","1on1","meetings"],
    install_count: 29200, rating_avg: 4.7, rating_count: 410,
    skill_content: `---
name: 1:1 Agenda
description: Structure recurring 1:1s that balance current work, career, feedback, and growth.
---

# 1:1 Agenda

The 1:1 is the manager's highest-leverage meeting. It belongs to the report. This
skill structures it so it covers the human, not just the tasks.

## Core principle

The 1:1 is **their** meeting. Status updates should mostly happen elsewhere; protect
this time for the things that don't fit in standups: blockers, growth, feedback,
and how they're actually doing.

## Rolling agenda doc

Keep a shared, persistent doc per report. Both parties add items between meetings.
This avoids "so... how's it going?" and ensures continuity.

\`\`\`
# 1:1 — <Manager> & <Report>

## This week
- [Their topics first]
- [Your topics]

## Parking lot
- <bigger items to schedule time for>

## Action items (carried over)
- [ ] <item> — owner — due

## Career & growth (revisit monthly)
- Goals: <...>
- Development areas: <...>
\`\`\`

## A balanced agenda

Cover these over time (not all every week):

1. **Check-in (always):** "How are you doing — really?" Energy, workload, life.
2. **Their topics (first):** blockers, decisions they need, things on their mind.
3. **Current work:** only the parts that need *you* — unblocking, prioritization, context.
4. **Feedback (both ways):** give specific feedback (SBI); ask "what could I do better?"
5. **Career & growth (recurring):** progress toward goals, skills, opportunities.

## Cadence and timing

- **Weekly** for most reports; biweekly only for very senior, autonomous people.
- 30 minutes minimum; never cancel without rescheduling — cancelling signals they don't matter.
- Same time, recurring — predictability builds trust.

## Question bank

Rotate questions to go deeper than status:

- "What's the most frustrating part of your work right now?"
- "What would make next week better than this one?"
- "Where do you want to grow that you're not getting to?"
- "Is there anything I'm doing (or not doing) that's making your job harder?"
- "What are you most proud of since we last talked?"

## Following up

- Capture action items with owners; review them next time. Following through is how
  trust compounds.
- Note career conversations so you can advocate for them at review/promo time.

## Anti-patterns

- Turning the 1:1 into a status report — that's what standups/updates are for.
- Doing all the talking — aim for them to lead 70% of it.
- Skipping or routinely cutting it short — it tells the report they're low priority.
- Never discussing career until review season — growth should be continuous.`,
  },
  {
    slug: "team-charter",
    name: "Team Charter",
    category: "productivity",
    description: "Creates team charters — mission, working norms, decision rights, and communication protocols.",
    author: "community",
    featured: false, verified: true,
    tags: ["teams","management","culture"],
    install_count: 14600, rating_avg: 4.5, rating_count: 210,
    skill_content: `---
name: Team Charter
description: Create a team charter covering mission, norms, decision rights, and communication.
---

# Team Charter

A charter makes the implicit explicit. New teams (and reorganized ones) waste weeks
on misaligned expectations a charter would have prevented. Build it together.

## How to build it

Run a 60-90 minute workshop with the whole team. Draft collaboratively — a charter
imposed top-down has no buy-in. Revisit it quarterly.

## The five sections

### 1. Mission & purpose

- **Why this team exists** — the outcome only this team owns.
- **Who we serve** — internal/external customers.
- **What success looks like** — 2-3 measurable signals.

### 2. Scope & boundaries

- What's **in scope** for this team.
- What's **out of scope** / owned by others — prevents turf confusion.
- Key dependencies on and from other teams.

### 3. Working norms

Agree on the day-to-day operating rules:

- **Core hours / time zones** and async expectations.
- **Meetings** the team commits to (and what's deliberately async).
- **Definition of done** for shared work.
- **How we handle disagreement** — debate openly, then commit.

### 4. Decision rights

Make decision-making explicit so nothing stalls. Use a simple model:

\`\`\`
For decision type <X>:
  - Driver:   <who moves it forward>
  - Approver: <who has final say>
  - Consulted: <whose input is required>
  - Informed: <who's told after>
\`\`\`

Clarify which decisions are individual, which are consensus, and which escalate.

### 5. Communication protocols

- **Channels:** what goes in chat vs. docs vs. issues vs. meetings.
- **Response expectations:** per channel (e.g. chat same-day, email 24h).
- **Status & updates:** cadence and format.
- **Escalation path:** who to go to when blocked.

## Charter template

\`\`\`
# <Team Name> Charter
Last reviewed: <date>

## Mission
## Who we serve & success measures
## In scope / Out of scope
## Working norms
## Decision rights (Driver/Approver/Consulted/Informed)
## Communication protocols
## How we'll hold each other accountable
\`\`\`

## Keeping it alive

- Pin it where the team works; reference it when conflicts arise.
- Review quarterly and after any major change (new members, new mandate).
- Update it when reality diverges — a charter nobody follows is worse than none.

## Anti-patterns

- A charter written by the manager alone — no ownership, ignored within a week.
- Vague norms ("communicate well") — make them concrete and checkable.
- Skipping decision rights — the most common source of team friction.
- Writing it once and never revisiting — teams and contexts change.`,
  },
  {
    slug: "process-doc",
    name: "Process Documentation",
    category: "productivity",
    description: "Documents recurring processes as step-by-step SOPs with decision points and edge cases.",
    author: "community",
    featured: false, verified: true,
    tags: ["sop","documentation","process"],
    install_count: 19800, rating_avg: 4.5, rating_count: 290,
    skill_content: `---
name: Process Documentation
description: Document recurring processes as clear SOPs with decision points and edge cases.
---

# Process Documentation

A Standard Operating Procedure (SOP) lets anyone perform a recurring process correctly
without asking. Good SOPs reduce errors, enable delegation, and survive turnover.

## When to write an SOP

- A process is done repeatedly (weekly+) by more than one person.
- Mistakes are costly or the process is error-prone.
- The knowledge currently lives in one person's head (bus-factor risk).

## SOP structure

\`\`\`
# SOP: <Process Name>
Owner: <role>   Last updated: <date>   Frequency: <how often run>

## Purpose
<One sentence: what this accomplishes and why it matters.>

## When to run this
<Trigger: the event or schedule that starts the process.>

## Prerequisites
- Access/permissions needed
- Tools / inputs required

## Steps
1. <Action verb + object>. <Exactly what to do.>
   - Expected result: <what you should see>
2. ...

## Decision points
- If <condition> -> do <branch A>.
- If <condition> -> do <branch B>.

## Edge cases & troubleshooting
- <Symptom> -> <what it means> -> <how to fix>

## Done when
<Definition of done — the observable end state.>
\`\`\`

## Writing clear steps

- **One action per step.** If a step has an "and", consider splitting it.
- **Start each step with a verb** ("Open...", "Verify...", "Send...").
- **Make results observable** — "you should see X" so the reader can self-check.
- **Link, don't embed** for things that change (URLs, contacts) so the SOP ages well.
- **Write for the least-experienced person** who'll run it. No assumed tribal knowledge.

## Capture decision points and edge cases

The happy path is the easy part. The value of an SOP is in the branches:
- Document every **decision point** as an explicit if/then.
- List the **edge cases** you've actually hit and how you resolved them.
- Note who to escalate to when the SOP doesn't cover the situation.

## Validate the SOP

- **Test it:** have someone unfamiliar follow it start to finish without help. Every
  question they ask is a gap to fix.
- **Version it:** date and owner at the top; note what changed.

## Maintenance

- Assign an **owner** responsible for keeping it current.
- Review on a cadence (e.g. quarterly) and after any process change.
- Prune dead steps — outdated SOPs erode trust in all of them.

## Anti-patterns

- Walls of prose instead of numbered steps — readers lose their place.
- Documenting only the happy path — the branches are where people get stuck.
- No owner / no date — the doc silently rots.
- Over-documenting trivial processes — match detail to risk and frequency.`,
  },
  {
    slug: "conflict-resolution",
    name: "Conflict Resolution",
    category: "productivity",
    description: "Facilitates conflict resolution using non-violent communication and interest-based negotiation.",
    author: "community",
    featured: false, verified: true,
    tags: ["conflict","communication","management"],
    install_count: 17200, rating_avg: 4.7, rating_count: 250,
    skill_content: `---
name: Conflict Resolution
description: Facilitate conflict resolution using NVC and interest-based negotiation.
---

# Conflict Resolution

Most workplace conflict is solvable when people move from positions ("I want X") to
interests ("I want X because I need Y"). This skill combines Nonviolent Communication
(NVC) with interest-based negotiation.

## Prepare your mindset

- Assume good intent — most conflict comes from unmet needs, not malice.
- Separate the **person** from the **problem**. You're on the same side against the issue.
- Aim for understanding before agreement. People resist being fixed; they open up when heard.

## The NVC frame (for expressing yourself)

Speak in four parts, without blame:

\`\`\`
Observation: "When <specific, factual thing happened>..."
            (no evaluation — "you were late twice", not "you're unreliable")
Feeling:     "...I felt <emotion>..."
Need:        "...because I need <underlying need: clarity, respect, support>..."
Request:     "...Would you be willing to <specific, doable action>?"
\`\`\`

Requests are not demands — the other person can say no, which opens negotiation.

## Surface interests, not positions

A **position** is what someone says they want. An **interest** is why. Multiple
solutions can satisfy an interest.

- Ask "why is that important to you?" and "what would that get you?"
- Listen for the need under the demand.
- Example: two people fighting over a conference room (positions) actually need
  quiet focus and a place to call (interests) — different rooms solve it.

## Facilitating between two parties

1. **Set ground rules:** one person speaks at a time, no interrupting, focus on the issue.
2. **Each party states their view** using observation + feeling + need. The other
   **reflects it back** ("What I hear is...") until the speaker feels understood.
3. **List the interests** of both sides on a shared surface.
4. **Brainstorm options** that meet as many interests as possible — generate before judging.
5. **Choose by objective criteria** (fairness, data, precedent), not by who pushes hardest.
6. **Agree on concrete next steps** and a check-in date.

## De-escalation in the moment

- Lower your voice and slow down; calm is contagious.
- Acknowledge emotion explicitly: "I can see this is frustrating."
- Take a break if either party is flooded — resume when regulated.
- Find a sliver of agreement early to build momentum.

## When to escalate

- Safety, harassment, or ethics issues -> involve HR/leadership immediately.
- Genuine deadlock after good-faith effort -> bring in a neutral third party.

## Anti-patterns

- "You always / you never" — generalizations trigger defensiveness; stick to observations.
- Solving before both feel heard — solutions imposed too early get rejected.
- Splitting the difference on positions instead of meeting interests — leaves both unhappy.
- Avoiding the conflict — unaddressed tension compounds and poisons the team.`,
  },
  {
    slug: "goals-accountability",
    name: "Goals & Accountability",
    category: "productivity",
    description: "Sets SMART goals with leading indicators, weekly check-ins, and quarterly reflection prompts.",
    author: "community",
    featured: false, verified: true,
    tags: ["goals","accountability","planning"],
    install_count: 22800, rating_avg: 4.6, rating_count: 330,
    skill_content: `---
name: Goals & Accountability
description: Set SMART goals with leading indicators, weekly check-ins, and quarterly reflection.
---

# Goals & Accountability

Goals without a tracking system are wishes. This skill turns intentions into SMART
goals, then keeps them alive with weekly check-ins and quarterly reflection.

## Step 1: Write SMART goals

Every goal must be:

- **Specific** — names exactly what will change.
- **Measurable** — has a number you can verify (the target).
- **Achievable** — a stretch, but realistic with effort.
- **Relevant** — tied to a larger objective you care about.
- **Time-bound** — has a deadline.

\`\`\`
Weak:  "Get better at writing."
SMART: "Publish 8 blog posts by Sept 30, averaging 1,000+ words each."
\`\`\`

## Step 2: Separate lagging from leading indicators

- **Lagging indicator** — the outcome (e.g. "8 posts published"). You can only measure
  it after the fact; you can't act on it directly.
- **Leading indicator** — the behavior that drives the outcome (e.g. "write 30 min daily",
  "draft 1 outline per week"). These you control *now*.

Track leading indicators weekly — they're the steering wheel; lagging is the rear-view mirror.

## Step 3: Weekly check-in (10 minutes)

Each week, for every active goal:

\`\`\`
Goal: <name>   Target: <X by date>
- Leading indicator this week: <did I do the driving behavior? Y/N + number>
- Progress toward target: <current vs. target>
- On track? <green / yellow / red>
- Biggest obstacle: <...>
- One adjustment for next week: <...>
\`\`\`

Honesty beats optimism here — a red flag in week 2 is recoverable; a red flag in week 11 is not.

## Step 4: Accountability structure

- **Make it visible** — share goals with a manager, peer, or accountability partner.
- **Commit publicly** to next week's leading actions; report on them next check-in.
- **Pair up** — a weekly 15-minute partner check-in dramatically raises follow-through.

## Step 5: Quarterly reflection

At quarter's end, for each goal, journal:

- Did I hit the target? By how much?
- Which leading behaviors actually moved the needle?
- What got in the way repeatedly (systemic, not one-off)?
- What will I keep, drop, or change next quarter?
- What did I learn about how I work?

Reflection converts a quarter of effort into a permanent lesson.

## Tips

- **Limit to 3-5 goals** at once — focus beats breadth.
- **Review goals where you'll see them** (dashboard, pinned note) — out of sight, out of mind.
- **Celebrate progress**, not just completion — reinforces the leading behaviors.

## Anti-patterns

- Goals with no number — you can't tell if you're winning.
- Tracking only the outcome — by the time it's off, it's too late to act.
- Setting 12 goals — none get real attention.
- Setting goals in January and never looking again — review or it's theater.`,
  },
  {
    slug: "inbox-zero",
    name: "Inbox Zero",
    category: "productivity",
    description: "Processes email backlogs to zero using the 4Ds: Delete, Delegate, Defer, Do.",
    author: "community",
    featured: false, verified: true,
    tags: ["email","productivity","inbox-zero"],
    install_count: 36400, rating_avg: 4.7, rating_count: 520,
    skill_content: `---
name: Inbox Zero
description: Process any email backlog to zero using the 4Ds and keep it there.
---

# Inbox Zero

Inbox Zero isn't an empty inbox for its own sake — it's a clear mind. The inbox is a
processing queue, not a storage system or a to-do list. This skill clears it and keeps
it clear.

## The core idea

Your inbox should hold only **unprocessed** messages. Once you've looked at an email,
it should not stay in the inbox — it gets a decision. Touch each email once.

## The 4Ds

For every email, make one of four decisions immediately:

- **Delete** (or Archive) — no action needed, no future reference. Most email is this.
  Be ruthless; you can always search archive later.
- **Delegate** — someone else should own it. Forward with clear context and a deadline,
  then archive it from your inbox (track the handoff elsewhere if needed).
- **Defer** — needs action but not now, or takes > 2 minutes. Move it to your task system
  or a "Today/This week" follow-up label, then archive. The action lives in your tasks,
  not your inbox.
- **Do** — if it takes **under 2 minutes**, handle it right now, then archive. Deferring
  a 1-minute reply costs more than doing it.

## Processing the backlog

1. **Sort by sender or subject** to batch similar items.
2. **Mass-archive the obvious** — newsletters, old notifications, threads already resolved.
   "Select all older than 30 days" is often safe to archive en masse.
3. **Process top to bottom**, applying the 4Ds to each remaining message. No skipping back.
4. **Don't get pulled into deep work** mid-processing — if a "Do" item balloons, make it
   a "Defer" and keep moving. Processing and doing are separate modes.

## Keep it at zero

- **Batch your email** — process in 2-3 fixed windows a day, not continuously. Turn off
  notifications between windows.
- **Unsubscribe relentlessly** — every newsletter you don't read is recurring noise.
  Spend 10 minutes a week killing subscriptions.
- **Use filters/rules** — auto-archive or label predictable senders (CI, receipts) so they
  skip the inbox.
- **Templates / canned responses** for repeated replies.
- **One folder for archive** — search beats foldering. Don't build elaborate folder trees.

## Folder/label setup (minimal)

\`\`\`
Inbox        -> unprocessed only
Archive      -> everything else (searchable)
Follow-up    -> waiting on someone / deferred actions (optional)
\`\`\`

## A simple daily routine

- Morning window: process to zero, 4D each message.
- Midday window: clear what arrived, fire off quick replies.
- End of day: final pass to zero; deferred items already live in your task list.

## Anti-patterns

- Treating the inbox as a to-do list — it has no priority, no due dates, and others fill it.
- Reading an email and leaving it unread "to deal with later" — you'll touch it 5 times.
- Checking email constantly — it shatters focus; batch it.
- Building 40 folders — you'll spend more time filing than searching.`,
  },
  {
    slug: "research-synthesis",
    name: "Research Synthesis",
    category: "productivity",
    description: "Turns 20+ sources into a structured synthesis: themes, tensions, gaps, and so-what.",
    author: "community",
    featured: false, verified: true,
    tags: ["research","synthesis","analysis"],
    install_count: 18600, rating_avg: 4.7, rating_count: 270,
    skill_content: `---
name: Research Synthesis
description: Turn many sources into a structured synthesis of themes, tensions, gaps, and implications.
---

# Research Synthesis

Synthesis is not summary. A summary repeats what each source said; a synthesis finds
the patterns *across* sources and says what it means. This skill turns 20+ sources into
a decision-ready document.

## Step 1: Capture, don't just read

As you go through each source, extract atomic notes (one idea per note):

\`\`\`
Source: <author, title, date>
Claim: <a single finding or argument, in your own words>
Evidence: <what backs it — data, study, anecdote>
Confidence: <strong / moderate / weak>
\`\`\`

Keep claims atomic so you can later regroup them across sources. Tag each with a topic.

## Step 2: Cluster into themes

Lay all the claims out and group them by what they're *about*, regardless of source.
Patterns emerge when ideas from different authors sit together. Name each cluster with
a **theme** — a sentence that captures the shared insight, not just a topic word.

\`\`\`
Theme: "Remote teams ship faster but report weaker belonging."
  - [Source A] productivity up 12% remote
  - [Source C] async cuts cycle time
  - [Source B] belonging scores down in fully-remote orgs
\`\`\`

## Step 3: Find tensions and disagreements

The most valuable output is where sources **conflict**. For each tension:
- State both positions and who holds them.
- Hypothesize *why* they differ (different populations? definitions? time periods? incentives?).
- Note what evidence would resolve it.

Don't paper over disagreement — surfacing it is the point.

## Step 4: Identify gaps

What's **missing**? Note:
- Questions no source answers.
- Weakly-supported claims everyone repeats (an echo, not evidence).
- Populations / contexts not studied.

Gaps tell the reader where to be cautious and where new research/work is needed.

## Step 5: Write the "so what"

End every theme and the document overall with implications:

- **So what?** — why does this matter for the decision at hand?
- **Now what?** — what should we do given this? Concrete recommendations.

A synthesis that doesn't reach "so what" is just organized note-taking.

## Output structure

\`\`\`
# Synthesis: <question>

## Executive summary (the so-what, up front)
## Themes
  ### Theme 1 — <insight sentence>
    Evidence: [sources]. So what: <...>
## Tensions & disagreements
## Gaps & open questions
## Implications & recommendations
## Source list with confidence ratings
\`\`\`

## Tips

- **Synthesize across, not down** — organize by theme, never source-by-source.
- **Weight by quality** — three weak blog posts don't outweigh one rigorous study.
- **Quote sparingly**; paraphrase into your shared framework.
- **Show your confidence** so readers can calibrate.

## Anti-patterns

- A list of source summaries with a conclusion bolted on — that's not synthesis.
- Ignoring disagreement to present a tidy narrative.
- Treating volume of mentions as truth — popularity isn't evidence.
- Stopping at "what" without "so what / now what".`,
  },
  {
    slug: "sprint-planning",
    name: "Sprint Planning",
    category: "productivity",
    description: "Facilitates sprint planning — backlog refinement, capacity, commitment, and risk flags.",
    author: "community",
    featured: false, verified: true,
    tags: ["agile","sprint","scrum"],
    install_count: 24200, rating_avg: 4.6, rating_count: 350,
    skill_content: `---
name: Sprint Planning
description: Facilitate sprint planning from backlog refinement through commitment and risk flags.
---

# Sprint Planning

Sprint planning answers two questions: **what** can we deliver this sprint, and **how**
will we do it? This skill keeps planning focused, realistic, and fast.

## Before planning: refine the backlog

Hold backlog refinement *ahead* of planning (mid-previous-sprint), so stories arrive ready:

- Each candidate story meets the **Definition of Ready**: clear, has acceptance criteria,
  estimated, dependencies known, small enough to finish in a sprint.
- Order the backlog by priority so the top is "next up".
- Split any story too big to fit a sprint.

Going into planning with an unrefined backlog is the #1 cause of bad sprints.

## Step 1: Set the sprint goal

Start with a single **sprint goal** — a one-sentence objective the sprint serves
(e.g. "Users can reset their password end to end"). The goal:
- Gives coherence and a reason to say no to scope creep.
- Lets the team make trade-offs mid-sprint without re-planning.

## Step 2: Determine capacity

Don't plan to 100% — plan to realistic capacity:

\`\`\`
For each member:
  available days in sprint
  - planned PTO / holidays
  - meetings / on-call / support overhead (~20-30%)
  = effective capacity
\`\`\`

Use the team's recent **velocity** (avg points completed over last 3-4 sprints) as the
anchor for how much to pull in. Adjust for capacity changes this sprint.

## Step 3: Select and commit

- Pull stories from the top of the refined backlog until you reach capacity/velocity.
- For each, the team confirms it understands the work and acceptance criteria.
- The team **commits** to a forecast it believes is achievable — commitment is the team's,
  not imposed. Leave a small buffer for the unexpected.

## Step 4: Break down into tasks

For committed stories, decompose into tasks (the "how"):
- Tasks are concrete steps ("write migration", "add endpoint", "QA flow").
- Surfacing tasks reveals hidden work and dependencies *before* the sprint starts.

## Step 5: Flag risks and dependencies

Explicitly call out:
- **Dependencies** on other teams / external inputs — and their status.
- **Unknowns** that could blow up estimates.
- **Single points of failure** (only one person can do X).

Note a mitigation or owner for each risk. Risks named on day 1 are manageable; risks
discovered on day 8 are fire drills.

## Planning meeting checklist

- [ ] Sprint goal stated in one sentence.
- [ ] Capacity calculated, not assumed.
- [ ] Every committed story meets Definition of Ready.
- [ ] Stories broken into tasks.
- [ ] Risks and dependencies flagged with owners.
- [ ] Team genuinely believes the forecast is achievable.

## Anti-patterns

- Planning to maximum capacity with no buffer — one surprise sinks the sprint.
- Committing to unrefined stories — they expand and derail the plan.
- A manager dictating scope — kills ownership and accuracy.
- No sprint goal — the sprint becomes a disconnected task list with no way to prioritize.`,
  },
  {
    slug: "power-bi-dax",
    name: "Power BI DAX",
    category: "data",
    description: "Writes DAX measures and calculated columns with time intelligence and filter context.",
    author: "community",
    featured: false, verified: true,
    tags: ["powerbi","dax","analytics"],
    install_count: 19200, rating_avg: 4.7, rating_count: 288,
    skill_content: `---
name: Power BI DAX
description: Write correct, performant DAX measures with proper filter context and time intelligence.
---

# Power BI DAX

Use this skill to author DAX measures and calculated columns that are correct under filter context and fast in VertiPaq.

## Core principles

1. Prefer measures over calculated columns. Measures evaluate in the report's filter context and do not bloat the model. Use calculated columns only when you need a row-level value for slicing or relationships.
2. Always wrap aggregations so they respect context. \`SUM(Sales[Amount])\` is implicitly \`CALCULATE(SUM(...))\` inside a measure.
3. Understand the two contexts: filter context (slicers, rows, columns, CALCULATE) and row context (calculated columns, iterators like SUMX). \`CALCULATE\` is the only function that turns row context into filter context via context transition.

## Writing a base measure

\`\`\`dax
Total Sales = SUM ( Sales[Amount] )
\`\`\`

## Time intelligence

Always have a marked Date table with a contiguous date range. Then:

\`\`\`dax
Sales YTD =
CALCULATE ( [Total Sales], DATESYTD ( 'Date'[Date] ) )

Sales PY =
CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

Sales YoY % =
DIVIDE ( [Total Sales] - [Sales PY], [Sales PY] )
\`\`\`

Use \`DIVIDE\` instead of \`/\` to avoid divide-by-zero errors.

## Controlling filter context

\`\`\`dax
% of Total =
DIVIDE (
    [Total Sales],
    CALCULATE ( [Total Sales], ALLSELECTED ( Product[Category] ) )
)
\`\`\`

- \`ALL\` removes all filters from a column or table.
- \`ALLSELECTED\` respects outer slicers but ignores inner row/column grouping.
- \`KEEPFILTERS\` intersects rather than overrides a filter inside CALCULATE.
- \`REMOVEFILTERS\` is the modern alias for clearing filters.

## Iterators

Row-by-row math uses X functions:

\`\`\`dax
Weighted Margin =
SUMX ( Sales, Sales[Qty] * ( Sales[Price] - Sales[Cost] ) )
\`\`\`

Avoid wrapping iterators in unnecessary CALCULATE; each row triggers context transition and can be slow.

## Variables for clarity and speed

\`\`\`dax
Margin % =
VAR Revenue = [Total Sales]
VAR Cost = SUM ( Sales[Cost] )
RETURN DIVIDE ( Revenue - Cost, Revenue )
\`\`\`

Variables are evaluated once and reused, improving readability and performance.

## Performance checklist

- Reduce cardinality of columns used in relationships.
- Avoid bidirectional relationships unless required.
- Prefer integer keys over strings.
- Use \`SELECTEDVALUE\` instead of \`HASONEVALUE\` + \`VALUES\` patterns.
- Test measures with Performance Analyzer and DAX Studio to inspect the query plan and VertiPaq scans.

## Common pitfalls

- Forgetting context transition: a measure referenced inside SUMX is wrapped in implicit CALCULATE.
- Using calculated columns for aggregations that should be measures.
- Time intelligence failing because the Date table is not marked or has gaps.`,
  },
  {
    slug: "r-for-analysis",
    name: "R for Analysis",
    category: "data",
    description: "Writes tidyverse R code for data wrangling, visualization, and statistical analysis.",
    author: "community",
    featured: false, verified: true,
    tags: ["r","statistics","data-science"],
    install_count: 14800, rating_avg: 4.6, rating_count: 222,
    skill_content: `---
name: R for Analysis
description: Idiomatic tidyverse R for wrangling, visualization, and statistics.
---

# R for Analysis

Write clear, reproducible R using the tidyverse for data analysis tasks.

## Setup

\`\`\`r
library(tidyverse)
library(lubridate)
library(broom)
\`\`\`

Always set a seed for any stochastic operation: \`set.seed(42)\`.

## Reading data

\`\`\`r
sales <- read_csv("sales.csv", col_types = cols(
  date = col_date(),
  amount = col_double(),
  region = col_character()
))
\`\`\`

Specify \`col_types\` explicitly to avoid surprises with type inference.

## Wrangling with dplyr

Chain transformations with the pipe. Each verb does one thing:

\`\`\`r
summary_tbl <- sales %>%
  filter(amount > 0) %>%
  mutate(month = floor_date(date, "month")) %>%
  group_by(region, month) %>%
  summarise(
    total = sum(amount),
    n = n(),
    .groups = "drop"
  ) %>%
  arrange(region, month)
\`\`\`

Always pass \`.groups = "drop"\` to summarise to avoid silently grouped output.

## Reshaping

\`\`\`r
wide <- summary_tbl %>%
  pivot_wider(names_from = region, values_from = total)

long <- wide %>%
  pivot_longer(-month, names_to = "region", values_to = "total")
\`\`\`

## Joining

Use explicit \`by\` and the right join type:

\`\`\`r
result <- left_join(orders, customers, by = "customer_id")
\`\`\`

Check for unexpected row multiplication after joins with \`nrow()\` before and after.

## Visualization with ggplot2

\`\`\`r
ggplot(summary_tbl, aes(month, total, color = region)) +
  geom_line(linewidth = 1) +
  scale_y_continuous(labels = scales::comma) +
  labs(title = "Monthly sales by region", x = NULL, y = "Total") +
  theme_minimal()
\`\`\`

Build plots in layers; map variables inside \`aes()\`, set constants outside it.

## Statistics

Fit models and tidy the output for downstream use:

\`\`\`r
model <- lm(total ~ month + region, data = summary_tbl)
tidy(model, conf.int = TRUE)
glance(model)
\`\`\`

For group-wise modeling, nest and map:

\`\`\`r
models <- sales %>%
  group_by(region) %>%
  nest() %>%
  mutate(fit = map(data, ~ lm(amount ~ date, data = .x)),
         tidied = map(fit, tidy)) %>%
  unnest(tidied)
\`\`\`

## Best practices

- Keep raw data immutable; create new objects for each transformation.
- Use \`janitor::clean_names()\` to standardize column names.
- Prefer \`case_when()\` over nested \`ifelse()\`.
- Document assumptions in comments and validate with \`stopifnot()\`.
- Render reproducible reports with Quarto or R Markdown.`,
  },
  {
    slug: "spark-jobs",
    name: "Spark & PySpark",
    category: "data",
    description: "Writes optimized PySpark jobs with partitioning, caching, and UDF strategies.",
    author: "community",
    featured: false, verified: true,
    tags: ["spark","pyspark","bigdata"],
    install_count: 12400, rating_avg: 4.5, rating_count: 186,
    skill_content: `---
name: Spark & PySpark
description: Write optimized PySpark jobs with partitioning, caching, and join strategies.
---

# Spark & PySpark

Author PySpark jobs that scale, avoid shuffles where possible, and use cluster resources efficiently.

## SparkSession

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = (
    SparkSession.builder
    .appName("etl")
    .config("spark.sql.shuffle.partitions", "200")
    .config("spark.sql.adaptive.enabled", "true")
    .getOrCreate()
)
\`\`\`

Enable Adaptive Query Execution (AQE); it coalesces shuffle partitions and optimizes joins at runtime.

## Prefer the DataFrame API over RDDs

DataFrame operations go through Catalyst and Tungsten, giving query optimization and off-heap memory. Drop to RDDs only when no DataFrame primitive exists.

## Avoid Python UDFs

Python UDFs serialize each row to the Python worker and back, breaking codegen. Order of preference:

1. Built-in \`pyspark.sql.functions\` (e.g. \`F.regexp_extract\`, \`F.when\`).
2. Pandas (vectorized) UDFs when you must use Python.
3. Scalar Python UDFs only as a last resort.

\`\`\`python
from pyspark.sql.functions import pandas_udf

@pandas_udf("double")
def normalize(s):
    return (s - s.mean()) / s.std()
\`\`\`

## Joins and shuffles

- Broadcast the smaller side when it fits in memory:

\`\`\`python
from pyspark.sql.functions import broadcast
result = large.join(broadcast(small), "key")
\`\`\`

- Filter and project columns before joining to shrink the shuffle.
- Watch for skew; salt heavily skewed keys or rely on AQE skew join handling.

## Partitioning

- \`repartition(n, col)\` does a full shuffle to balance data; use before wide writes.
- \`coalesce(n)\` reduces partitions without a shuffle; use to avoid tiny output files.
- Partition output by low-cardinality columns:

\`\`\`python
df.write.partitionBy("dt").mode("overwrite").parquet("/data/out")
\`\`\`

## Caching

Cache only when a DataFrame is reused multiple times in the DAG:

\`\`\`python
df.cache()
df.count()  # materialize
\`\`\`

Unpersist when done to free memory. Caching a once-used DataFrame wastes memory.

## Performance checklist

- Read columnar formats (Parquet, ORC) with predicate pushdown.
- Avoid \`collect()\` on large data; it pulls everything to the driver.
- Inspect plans with \`df.explain(True)\`.
- Tune \`spark.sql.shuffle.partitions\` to roughly match cluster cores for the data size.
- Use \`F.col\` references rather than string columns when chaining for clarity.`,
  },
  {
    slug: "time-series",
    name: "Time Series Analysis",
    category: "data",
    description: "Applies ARIMA, Prophet, and decomposition to forecast and analyze time-series data.",
    author: "community",
    featured: false, verified: true,
    tags: ["time-series","forecasting","statistics"],
    install_count: 16800, rating_avg: 4.6, rating_count: 252,
    skill_content: `---
name: Time Series Analysis
description: Forecast and decompose time series with ARIMA, Prophet, and proper validation.
---

# Time Series Analysis

Analyze and forecast time-indexed data with sound methodology and honest validation.

## Always start with exploration

1. Plot the raw series. Look for trend, seasonality, level shifts, and outliers.
2. Decompose to separate components:

\`\`\`python
from statsmodels.tsa.seasonal import STL
result = STL(series, period=12).fit()
result.plot()
\`\`\`

3. Check stationarity with the ADF test:

\`\`\`python
from statsmodels.tsa.stattools import adfuller
adfuller(series.dropna())
\`\`\`

## Make the series stationary

ARIMA assumes stationarity. Difference to remove trend, and seasonally difference to remove seasonality:

\`\`\`python
diff = series.diff().dropna()
seasonal_diff = series.diff(12).dropna()
\`\`\`

Inspect ACF and PACF plots to choose AR (p) and MA (q) orders.

## ARIMA / SARIMA

\`\`\`python
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(series, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
fit = model.fit(disp=False)
forecast = fit.get_forecast(steps=12)
ci = forecast.conf_int()
\`\`\`

Use \`pmdarima.auto_arima\` to search orders by AIC, but verify residuals afterward.

## Prophet

Prophet is robust for business series with strong seasonality and holidays:

\`\`\`python
from prophet import Prophet
m = Prophet(yearly_seasonality=True, weekly_seasonality=True)
m.add_country_holidays(country_name="US")
m.fit(df)  # df has columns ds, y
future = m.make_future_dataframe(periods=90)
fc = m.predict(future)
\`\`\`

## Validation: never random split

Use rolling or expanding window backtests that respect time order:

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
\`\`\`

Report MAPE, MAE, and RMSE on the held-out future windows, not in-sample fit.

## Residual diagnostics

After fitting, residuals should look like white noise:

- Ljung-Box test for autocorrelation.
- Plot residual ACF; no significant lags should remain.
- Check residual histogram for normality if you need prediction intervals.

## Best practices

- Handle missing timestamps by reindexing to a regular frequency before modeling.
- Apply a log transform to stabilize variance for multiplicative seasonality.
- Keep forecast horizons honest; uncertainty grows with distance.
- Compare against a naive seasonal baseline; a model that cannot beat it is not useful.`,
  },
  {
    slug: "causal-inference",
    name: "Causal Inference",
    category: "data",
    description: "Applies DiD, RDD, and IV methods to establish causality from observational data.",
    author: "community",
    featured: false, verified: true,
    tags: ["causal","econometrics","statistics"],
    install_count: 9200, rating_avg: 4.7, rating_count: 138,
    skill_content: `---
name: Causal Inference
description: Estimate causal effects from observational data with DiD, RDD, and IV.
---

# Causal Inference

Move from correlation to causation using credible identification strategies. Always state assumptions explicitly.

## Frame the question

Define the treatment, the outcome, the unit, and the counterfactual. Draw a DAG to encode assumptions about confounders, mediators, and colliders. Never condition on a collider or a post-treatment variable.

## Difference-in-Differences (DiD)

Compares the change in outcomes over time between a treated and control group.

Key assumption: parallel trends. Absent treatment, both groups would have moved together.

\`\`\`python
import statsmodels.formula.api as smf
model = smf.ols("y ~ treated * post", data=df).fit(
    cov_type="cluster", cov_kwds={"groups": df["unit"]}
)
\`\`\`

The interaction coefficient \`treated:post\` is the average treatment effect on the treated. Validate parallel trends by plotting pre-period trends and running an event-study with leads and lags.

## Regression Discontinuity (RDD)

When treatment is assigned by a threshold on a running variable, units just above and below are comparable.

\`\`\`python
# Local linear regression within a bandwidth around the cutoff
band = df[(df.x > cutoff - h) & (df.x < cutoff + h)].copy()
band["above"] = (band.x >= cutoff).astype(int)
smf.ols("y ~ above * I(x - @cutoff)", data=band).fit()
\`\`\`

- Choose bandwidth with a data-driven method (Imbens-Kalyanaraman).
- Run a McCrary density test to check for manipulation of the running variable.
- Plot the discontinuity; the jump at the cutoff is the local effect.

## Instrumental Variables (IV)

Use when treatment is endogenous and you have an instrument that affects the outcome only through the treatment.

Requirements: relevance (instrument predicts treatment) and exclusion (no direct path to outcome).

\`\`\`python
from linearmodels.iv import IV2SLS
res = IV2SLS.from_formula("y ~ 1 + controls + [treatment ~ instrument]", df).fit()
\`\`\`

Check the first-stage F-statistic; weak instruments (F < 10) produce biased estimates.

## Common pitfalls

- Controlling for a mediator absorbs the effect you want to measure.
- Selection on the dependent variable biases estimates.
- Standard errors must account for clustering and serial correlation.
- A robustness section should test placebo cutoffs, alternative bandwidths, and sensitivity to confounders.

## Reporting

State the estimand, the identifying assumption, the threats, and the falsification tests you ran. Causal claims are only as strong as the design that supports them.`,
  },
  {
    slug: "data-quality",
    name: "Data Quality Framework",
    category: "data",
    description: "Designs data quality checks — completeness, validity, consistency, timeliness — with monitoring.",
    author: "community",
    featured: false, verified: true,
    tags: ["data-quality","governance","dbt"],
    install_count: 14600, rating_avg: 4.6, rating_count: 219,
    skill_content: `---
name: Data Quality Framework
description: Design and monitor data quality across completeness, validity, consistency, and timeliness.
---

# Data Quality Framework

Build systematic data quality checks and monitoring so problems are caught before they reach consumers.

## The six dimensions

1. Completeness: required fields are populated; expected rows arrive.
2. Validity: values conform to types, ranges, and formats.
3. Consistency: values agree across tables and over time.
4. Uniqueness: keys are not duplicated.
5. Timeliness: data lands within the expected SLA.
6. Accuracy: values reflect the real-world entity (hardest to test automatically).

## Implement tests in dbt

dbt provides generic tests in schema YAML:

\`\`\`yaml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['pending', 'shipped', 'delivered', 'cancelled']
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: customer_id
\`\`\`

Add singular tests (SQL that returns failing rows) for business rules:

\`\`\`sql
-- tests/assert_positive_amount.sql
select order_id from {{ ref('orders') }} where amount <= 0
\`\`\`

## Use dbt packages

\`dbt_utils\` and \`dbt_expectations\` add tests like \`expect_column_values_to_be_between\`, freshness checks, and row count anomalies.

## Freshness monitoring

\`\`\`yaml
sources:
  - name: raw
    tables:
      - name: events
        freshness:
          warn_after: {count: 6, period: hour}
          error_after: {count: 12, period: hour}
        loaded_at_field: ingested_at
\`\`\`

## Anomaly detection

Beyond static thresholds, track metrics over time:

- Row counts per load vs a rolling baseline.
- Null rate per column trended daily.
- Distribution drift on key numeric columns.

Alert when a metric deviates more than a few standard deviations from its recent history.

## Operationalize

- Run tests in CI on every pull request against a sample.
- Run full suites on a schedule after each load; fail the pipeline on errors.
- Route warnings and errors to a channel with the failing table and row examples.
- Maintain a data quality dashboard showing pass rates per source.

## Governance

- Assign an owner to every dataset.
- Document each test's intent and the action to take on failure.
- Track quality SLAs and report them to stakeholders.
- Treat recurring failures as incidents with root-cause analysis, not noise to silence.`,
  },
  {
    slug: "customer-analytics",
    name: "Customer Analytics",
    category: "data",
    description: "Builds cohort analysis, LTV models, and churn prediction from transactional data.",
    author: "community",
    featured: false, verified: true,
    tags: ["analytics","customer","ltv"],
    install_count: 21800, rating_avg: 4.7, rating_count: 327,
    skill_content: `---
name: Customer Analytics
description: Cohort analysis, LTV modeling, and churn prediction from transactions.
---

# Customer Analytics

Turn transactional data into cohort, lifetime value, and churn insights.

## Build cohorts

Group customers by acquisition period and track behavior across subsequent periods.

\`\`\`sql
with first_order as (
  select customer_id,
         date_trunc('month', min(order_date)) as cohort_month
  from orders group by 1
),
activity as (
  select o.customer_id,
         f.cohort_month,
         date_trunc('month', o.order_date) as active_month
  from orders o join first_order f using (customer_id)
)
select cohort_month,
       date_diff('month', cohort_month, active_month) as month_number,
       count(distinct customer_id) as active_customers
from activity group by 1, 2 order by 1, 2;
\`\`\`

Render as a retention triangle: cohorts on rows, months-since-acquisition on columns.

## Retention curves

Compute the share of each cohort still active at month N. Retention usually drops fast then flattens; the flattening level is your durable base.

## Lifetime value (LTV)

Two approaches:

1. Historical: sum realized margin per customer to date.
2. Predictive: model expected future value.

A simple contractual LTV:

\`\`\`
LTV = ARPU * gross_margin / churn_rate
\`\`\`

For non-contractual (e-commerce), use a BG/NBD model for purchase frequency and a Gamma-Gamma model for monetary value:

\`\`\`python
from lifetimes import BetaGeoFitter, GammaGammaFitter
bgf = BetaGeoFitter(penalizer_coef=0.01)
bgf.fit(rfm['frequency'], rfm['recency'], rfm['T'])
\`\`\`

## RFM segmentation

Score customers on Recency, Frequency, and Monetary value into quintiles, then group into segments like Champions, At Risk, and Hibernating to target campaigns.

## Churn prediction

Define churn precisely (e.g. no purchase in 90 days). Build features:

- Recency, frequency, monetary, tenure.
- Trend features: change in order rate quarter over quarter.
- Engagement: logins, support tickets, feature usage.

Train a gradient boosting classifier, evaluate with AUC and precision at the top decile, and calibrate probabilities. Use SHAP to explain drivers so the business can act.

## Best practices

- Always exclude the most recent incomplete period from cohort charts.
- Use margin, not revenue, for LTV.
- Validate churn models on a held-out future window.
- Tie every metric to an action: who do you contact, and with what offer.`,
  },
  {
    slug: "funnel-analysis",
    name: "Funnel Analysis",
    category: "data",
    description: "Builds conversion funnels with drop-off attribution, segment comparison, and significance testing.",
    author: "community",
    featured: false, verified: true,
    tags: ["funnel","analytics","product"],
    install_count: 18400, rating_avg: 4.6, rating_count: 276,
    skill_content: `---
name: Funnel Analysis
description: Build conversion funnels with drop-off attribution and significance testing.
---

# Funnel Analysis

Measure where users drop off in a multi-step flow and find statistically real differences between segments.

## Define the funnel precisely

1. List the ordered steps (e.g. view -> add to cart -> checkout -> purchase).
2. Decide on the conversion window (e.g. complete within 7 days of step 1).
3. Choose ordered vs unordered: must steps happen in sequence, or just all occur?

Ambiguous definitions produce misleading funnels; write them down.

## Compute the funnel in SQL

\`\`\`sql
with steps as (
  select user_id,
         min(case when event = 'view' then event_time end) as t_view,
         min(case when event = 'add_to_cart' then event_time end) as t_cart,
         min(case when event = 'checkout' then event_time end) as t_checkout,
         min(case when event = 'purchase' then event_time end) as t_purchase
  from events group by user_id
)
select
  count(t_view) as viewed,
  count(t_cart) as carted,
  count(t_checkout) as checked_out,
  count(t_purchase) as purchased
from steps
where t_cart > t_view or t_cart is null;
\`\`\`

Enforce ordering by requiring each timestamp to exceed the prior one.

## Drop-off attribution

For each adjacent pair compute step conversion = stage_n / stage_n-1. The largest drop is the biggest opportunity. Also report overall conversion = final / first.

## Segment comparison

Break the funnel by device, channel, plan, or cohort. Differences in step conversion point to where a segment struggles.

## Significance testing

Do not eyeball rate differences. Compare two conversion rates with a two-proportion z-test:

\`\`\`python
from statsmodels.stats.proportion import proportions_ztest
stat, p = proportions_ztest([conv_a, conv_b], [n_a, n_b])
\`\`\`

For many segments, control the false discovery rate (Benjamini-Hochberg). Report confidence intervals on each rate, not just point estimates.

## Time-to-convert

Beyond whether users convert, analyze how long each step takes. A long median time at a step often signals friction even if conversion looks fine.

## Best practices

- Deduplicate events before counting.
- Account for users still in the conversion window (right-censoring) so you do not understate conversion.
- Track funnels over time; a sudden step drop often signals a release bug.
- Pair quantitative drop-off with session recordings or surveys to learn why.`,
  },
  {
    slug: "ml-feature-engineering",
    name: "Feature Engineering",
    category: "data",
    description: "Designs ML features: encoding, scaling, interaction terms, and leakage prevention.",
    author: "community",
    featured: false, verified: true,
    tags: ["ml","features","data-science"],
    install_count: 13200, rating_avg: 4.5, rating_count: 198,
    skill_content: `---
name: Feature Engineering
description: Design ML features with correct encoding, scaling, and leakage prevention.
---

# Feature Engineering

Transform raw data into features that improve model performance without leaking the target.

## Prevent leakage first

Leakage is the most common and most damaging mistake. Rules:

1. Fit all transformers (scalers, encoders, imputers) on the training fold only, then apply to validation and test.
2. Never use future information relative to the prediction time.
3. Exclude features that are proxies for the label or only known after the outcome.
4. For time series, split by time and never shuffle.

Use scikit-learn Pipelines and ColumnTransformer so fitting always happens inside cross-validation:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
pre = ColumnTransformer([
    ("num", StandardScaler(), num_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
])
model = Pipeline([("pre", pre), ("clf", GradientBoostingClassifier())])
\`\`\`

## Categorical encoding

- One-hot for low cardinality.
- Target/mean encoding for high cardinality, but compute it with out-of-fold means to avoid leakage.
- Hashing for very high cardinality when memory matters.
- Ordinal encoding only when categories have a true order.

## Numeric transforms

- Scale (standardize or min-max) for distance and gradient based models; trees do not need it.
- Apply log or Box-Cox to skewed positive features.
- Bin into quantiles when the relationship is non-monotonic and the model is linear.

## Interaction and derived features

- Ratios and differences often encode domain meaning (price per unit, days since last event).
- Polynomial or explicit interaction terms help linear models capture combined effects.
- Aggregations: group-by statistics (mean, count, std) per entity, computed out-of-fold.

## Datetime features

Extract hour, day of week, month, is_weekend, and cyclical sine/cosine encodings for periodic values. Add elapsed-time features like days since signup.

## Missing values

- Add a binary missing-indicator before imputing; missingness can be informative.
- Impute numerics with median, categoricals with a dedicated category.
- Avoid mean imputation on skewed data.

## Selection and validation

- Remove near-constant and highly collinear features.
- Use permutation importance or SHAP rather than raw model importances.
- Always validate that a new feature improves cross-validated metrics, not just training fit.
- Keep a feature catalog documenting source, transformation, and refresh cadence.`,
  },
  {
    slug: "tableau-best-practices",
    name: "Tableau Best Practices",
    category: "data",
    description: "Designs Tableau dashboards with proper aggregation, LOD expressions, and performance optimization.",
    author: "community",
    featured: false, verified: true,
    tags: ["tableau","bi","visualization"],
    install_count: 16200, rating_avg: 4.5, rating_count: 243,
    skill_content: `---
name: Tableau Best Practices
description: Build performant Tableau dashboards with LOD expressions and clean design.
---

# Tableau Best Practices

Design Tableau workbooks that compute the right numbers and stay fast.

## Understand aggregation

Tableau aggregates measures based on the dimensions in the view. A SUM at the row level differs from a SUM across the whole view. Always ask: at what grain is this number computed?

## Level of Detail (LOD) expressions

LOD expressions control the grain independently of the view.

- FIXED computes at a stated grain regardless of the view filters (except context filters):

\`\`\`
{ FIXED [Customer] : SUM([Sales]) }
\`\`\`

- INCLUDE adds dimensions to the view grain, then aggregates up.
- EXCLUDE removes dimensions from the view grain.

Common use: customer-level metrics shown on a less granular chart, like average sales per customer by region:

\`\`\`
AVG({ FIXED [Customer] : SUM([Sales]) })
\`\`\`

## Filter order matters for performance

Tableau applies filters in this order: Extract, Data Source, Context, Dimension, Measure, Table Calc. FIXED LODs are computed before dimension filters but after context filters. Promote a slow categorical filter to a context filter to reduce the data the rest of the workbook scans.

## Performance optimization

- Use extracts (Hyper) rather than live connections for large or slow sources.
- Reduce marks: high mark counts slow rendering. Aggregate before plotting.
- Avoid blending when a join or relationship will do; blends are computed client-side.
- Minimize quick filters with many values; use a relevant-values or wildcard filter.
- Hide unused fields and reduce the number of worksheets on a dashboard.
- Run Performance Recorder to find slow queries and rendering steps.

## Table calculations vs LODs

Table calcs (RUNNING_SUM, RANK, WINDOW_AVG) operate on the rendered table after aggregation and depend on partitioning and addressing. Use them for running totals, percent of total, and rank. Use LODs when you need a fixed grain regardless of the view.

## Design principles

- One clear question per dashboard; lead with the headline metric.
- Use consistent color encoding and a restrained palette.
- Right-size: build for the target screen and device.
- Add tooltips with context, not clutter.
- Use parameters and dashboard actions for interactivity instead of many separate sheets.

## Maintainability

- Name calculated fields clearly and comment complex logic.
- Organize fields into folders.
- Document data source assumptions and refresh schedules.`,
  },
  {
    slug: "mongodb-expert",
    name: "MongoDB Expert",
    category: "data",
    description: "Designs MongoDB schemas, indexes, aggregation pipelines, and change streams.",
    author: "community",
    featured: false, verified: true,
    tags: ["mongodb","nosql","database"],
    install_count: 14800, rating_avg: 4.6, rating_count: 222,
    skill_content: `---
name: MongoDB Expert
description: Design MongoDB schemas, indexes, and aggregation pipelines that perform.
---

# MongoDB Expert

Model data, index it, and query it the MongoDB way.

## Schema design: model for your queries

Unlike relational design, model around access patterns, not normalization.

- Embed when data is accessed together and the child is bounded (e.g. order line items inside an order).
- Reference when data is large, unbounded, or shared (e.g. users referenced by many orders).
- Watch the 16 MB document limit; unbounded arrays are an anti-pattern. Use the subset or bucket pattern for growing collections of children.

## Indexing

Indexes are the single biggest performance lever.

\`\`\`js
db.orders.createIndex({ customerId: 1, createdAt: -1 })
\`\`\`

Follow the ESR rule for compound indexes: Equality fields first, then Sort fields, then Range fields. A query filtering on customerId, sorting by createdAt is served fully by the index above.

- Use \`explain("executionStats")\` and confirm an IXSCAN, not a COLLSCAN.
- Create partial indexes to index only relevant documents.
- Use covered queries (projection limited to indexed fields) to avoid fetching documents.
- Avoid too many indexes; each one slows writes.

## Aggregation pipeline

Build pipelines that filter early to shrink the working set:

\`\`\`js
db.orders.aggregate([
  { $match: { status: "shipped", createdAt: { $gte: start } } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" }, n: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 100 }
])
\`\`\`

- Place \`$match\` and \`$project\` as early as possible so indexes apply and less data flows downstream.
- \`$lookup\` performs a join; index the foreign field.
- Use \`$facet\` for multiple aggregations in one pass.
- Beware pipeline memory limits; allow \`{ allowDiskUse: true }\` for large groupings.

## Change streams

React to data changes in real time:

\`\`\`js
const stream = db.collection("orders").watch([
  { $match: { operationType: "insert" } }
])
for await (const change of stream) { handle(change.fullDocument) }
\`\`\`

Resume after failures with a stored resume token. Change streams require a replica set.

## Operational best practices

- Use a replica set for durability; set an appropriate write concern (\`w: "majority"\`).
- Choose read concern based on consistency needs.
- Shard on a high-cardinality key that distributes writes evenly; avoid monotonically increasing shard keys.
- Monitor slow queries with the database profiler.
- Use transactions only when truly needed; single-document operations are already atomic.`,
  },
  {
    slug: "kafka-pipelines",
    name: "Kafka Pipelines",
    category: "data",
    description: "Designs Kafka topics, consumer groups, offset management, and dead-letter queues.",
    author: "community",
    featured: false, verified: true,
    tags: ["kafka","streaming","data-engineering"],
    install_count: 11600, rating_avg: 4.5, rating_count: 174,
    skill_content: `---
name: Kafka Pipelines
description: Design Kafka topics, consumer groups, offsets, and dead-letter handling.
---

# Kafka Pipelines

Design reliable streaming pipelines with Apache Kafka.

## Topic design

- Partition count sets the maximum consumer parallelism in a group; choose for peak throughput and future growth, since increasing partitions later rehashes keys.
- The partition key determines ordering. Records with the same key go to the same partition and preserve order. Pick a key that both balances load and groups what must stay ordered (e.g. \`customerId\`).
- Set retention by time or size based on replay needs. Use log compaction for changelog-style topics keyed by entity.
- Set replication factor to at least 3 in production and \`min.insync.replicas=2\`.

## Producers

\`\`\`properties
acks=all
enable.idempotence=true
max.in.flight.requests.per.connection=5
compression.type=zstd
\`\`\`

Idempotent producers with \`acks=all\` give exactly-once delivery to a partition and prevent duplicates from retries. Batch with \`linger.ms\` and \`batch.size\` for throughput.

## Consumer groups and offsets

- All consumers in a group share the partitions; each partition is consumed by exactly one member.
- Disable auto-commit and commit offsets only after successful processing to get at-least-once semantics:

\`\`\`java
props.put("enable.auto.commit", "false");
// process records, then:
consumer.commitSync();
\`\`\`

- Commit after processing, not before, or you will lose records on a crash.
- Tune \`max.poll.records\` and \`max.poll.interval.ms\` so processing finishes before the consumer is considered dead and a rebalance kicks in.

## Dead-letter queues

When a record cannot be processed after retries, route it to a dead-letter topic rather than blocking the partition:

\`\`\`
orders -> [process] --fail--> orders.DLQ (with headers: error, original-offset, timestamp)
\`\`\`

- Add headers capturing the exception, source topic, partition, and offset for debugging.
- Apply bounded retries with backoff before sending to the DLQ.
- Monitor DLQ depth and build tooling to inspect and replay messages.

## Exactly-once processing

For read-process-write within Kafka, use transactions to commit offsets and output atomically, or use Kafka Streams which manages this for you.

## Operational best practices

- Monitor consumer lag per partition; rising lag signals undersized consumers.
- Use a schema registry (Avro or Protobuf) to enforce compatibility and evolve schemas safely.
- Plan for rebalances: make processing idempotent so reprocessing is safe.
- Size partitions and brokers with headroom; rebalancing a hot cluster is risky.`,
  },
  {
    slug: "clickhouse-analytics",
    name: "ClickHouse Analytics",
    category: "data",
    description: "Writes ClickHouse queries with proper table engines, materialized views, and projections.",
    author: "community",
    featured: false, verified: true,
    tags: ["clickhouse","olap","analytics"],
    install_count: 8800, rating_avg: 4.6, rating_count: 132,
    skill_content: `---
name: ClickHouse Analytics
description: Model and query ClickHouse with the right engines, views, and projections.
---

# ClickHouse Analytics

Get fast analytical queries from ClickHouse by modeling for its columnar, sorted storage.

## Choose the right table engine

- MergeTree is the workhorse for analytical tables.
- ReplacingMergeTree deduplicates rows with the same sorting key during background merges (eventual, use FINAL or aggregation to read deduped).
- SummingMergeTree and AggregatingMergeTree pre-aggregate on merge.
- ReplicatedMergeTree variants add replication for production.

## The ORDER BY clause is the index

ClickHouse has no traditional secondary index by default; the sorting key defines the primary index and physical order.

\`\`\`sql
CREATE TABLE events (
  event_date Date,
  user_id UInt64,
  event_type LowCardinality(String),
  value Float64
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_type, event_date, user_id);
\`\`\`

Put the columns you filter and group by most, in order of selectivity, into ORDER BY. Queries that filter on a prefix of the sorting key skip irreplevant granules.

## Partitioning

Partition by a coarse column like month. Partitions enable fast \`DROP PARTITION\` for retention and let queries prune whole partitions. Do not over-partition; too many partitions hurt merges.

## Data types matter

- Use \`LowCardinality(String)\` for columns with few distinct values; it dictionary-encodes them.
- Use the smallest integer type that fits.
- Prefer \`DateTime\` over strings for timestamps.

## Materialized views

A materialized view is an insert trigger that writes transformed rows into a target table as data arrives:

\`\`\`sql
CREATE MATERIALIZED VIEW daily_mv
TO daily_agg AS
SELECT event_date, event_type, count() AS cnt, sum(value) AS total
FROM events GROUP BY event_date, event_type;
\`\`\`

Combine with an AggregatingMergeTree target and \`-State\`/\`-Merge\` combinators to maintain rollups incrementally.

## Projections

Projections store an alternative sort order or pre-aggregation inside the same table; ClickHouse picks the best one per query automatically:

\`\`\`sql
ALTER TABLE events ADD PROJECTION by_user
( SELECT user_id, count() GROUP BY user_id );
\`\`\`

## Query tips

- Avoid \`SELECT *\`; read only needed columns since storage is columnar.
- Filter on sorting-key prefixes to enable granule skipping.
- Use \`PREWHERE\` for highly selective filters to read fewer columns.
- Inspect plans with \`EXPLAIN\` and check parts read in the query log.
- Prefer approximate functions like \`uniqHLL12\` when exactness is not required.`,
  },
  {
    slug: "revenue-modeling",
    name: "Revenue Modeling",
    category: "data",
    description: "Builds SaaS revenue models: MRR, expansion, churn, and scenario forecasting.",
    author: "community",
    featured: false, verified: true,
    tags: ["finance","revenue","saas"],
    install_count: 22400, rating_avg: 4.7, rating_count: 336,
    skill_content: `---
name: Revenue Modeling
description: Build SaaS revenue models covering MRR, expansion, churn, and scenarios.
---

# Revenue Modeling

Build a rigorous SaaS revenue model that ties recurring revenue movements together correctly.

## The MRR bridge

Every period, MRR moves through these components. They must reconcile:

\`\`\`
Ending MRR = Beginning MRR
           + New MRR          (newly acquired customers)
           + Expansion MRR    (upgrades, seat adds, cross-sell)
           + Reactivation MRR (returning churned customers)
           - Contraction MRR  (downgrades)
           - Churned MRR       (cancellations)
\`\`\`

Always validate: the sum of components equals the change in MRR. A model that does not reconcile is wrong.

## Key rates

- Gross revenue churn = churned + contraction MRR / beginning MRR.
- Net revenue retention (NRR) = (beginning + expansion - contraction - churn) / beginning. NRR above 100% means the existing base grows without new logos.
- Logo churn = customers lost / customers at start.

## Cohort-based forecasting

Forecast retained revenue from existing customers using cohort retention curves, then layer new-customer cohorts on top.

\`\`\`
For each acquisition cohort:
  revenue_t = cohort_initial_mrr * retention_curve[t] * expansion_factor[t]
Total_MRR_t = sum over cohorts of revenue_t + new_cohorts
\`\`\`

Fit the retention curve from historical cohorts; do not assume linear decay.

## Driver-based new revenue

Model New MRR bottom-up from drivers, not a single growth rate:

\`\`\`
New MRR = leads * lead_to_opp * opp_to_win * average_deal_size
\`\`\`

This lets you connect marketing spend and sales capacity to revenue.

## Scenario forecasting

Build base, upside, and downside cases by flexing the key assumptions: win rate, churn, expansion, and average deal size. Keep assumptions in a single inputs sheet so scenarios are one toggle away.

\`\`\`
Sensitivity: vary NRR and new-logo growth on a 2D grid, read ending ARR.
\`\`\`

## Connect to cash and unit economics

- ARR = MRR * 12.
- CAC payback = CAC / (ARPA * gross margin).
- LTV:CAC ratio should exceed 3 for healthy economics.
- Model billing terms (annual prepay vs monthly) for the cash forecast, which differs from recognized revenue.

## Best practices

- Separate bookings, billings, and recognized revenue; they are not the same.
- Reconcile the MRR bridge every period against the general ledger.
- Show actuals vs forecast and track forecast accuracy over time.
- Document every assumption and its source.
- Stress-test the downside: what happens to runway if churn doubles.`,
  },
  {
    slug: "growth-accounting",
    name: "Growth Accounting",
    category: "data",
    description: "Decomposes growth into new, retained, resurrected, and churned users with framework.",
    author: "community",
    featured: false, verified: true,
    tags: ["growth","analytics","product"],
    install_count: 17800, rating_avg: 4.6, rating_count: 267,
    skill_content: `---
name: Growth Accounting
description: Decompose active-user growth into new, retained, resurrected, and churned.
---

# Growth Accounting

Explain why your active user count changed by decomposing it into its underlying flows.

## The core identity

For any period, the change in active users reconciles exactly:

\`\`\`
Active(t) = Active(t-1) + New + Resurrected - Churned
\`\`\`

Where, comparing the set of active users this period vs last:

- New: active this period, never active before.
- Retained: active this period and last period.
- Resurrected: active this period, inactive last period, but active sometime earlier.
- Churned: active last period, not active this period (a negative contribution).

Net new users = New + Resurrected - Churned. This must equal Active(t) - Active(t-1).

## Quick Ratio

A single health metric summarizing growth efficiency:

\`\`\`
Quick Ratio = (New + Resurrected) / Churned
\`\`\`

A ratio above 1 means you are adding more users than you lose. Best-in-class consumer products sit well above 1; a ratio near or below 1 means growth is stalling even if the top line still rises.

## Computing it in SQL

Define an activity table with one row per user per active period, then compare consecutive periods with window functions:

\`\`\`sql
with activity as (
  select user_id, date_trunc('month', activity_date) as period
  from events group by 1, 2
),
flags as (
  select user_id, period,
    lag(period) over (partition by user_id order by period) as prev_period,
    min(period) over (partition by user_id) as first_period
  from activity
)
select period,
  count(*) filter (where period = first_period) as new_users,
  count(*) filter (where prev_period = period - interval '1 month') as retained,
  count(*) filter (where period <> first_period
                   and (prev_period is null
                        or prev_period < period - interval '1 month')) as resurrected
from flags group by period order by period;
\`\`\`

Compute churned separately as users active last period but absent this period.

## Revenue growth accounting

The same framework applies to revenue (the MRR bridge). Decompose revenue change into new, expansion, contraction, churned, and resurrected dollars. This connects user-level growth accounting to financial outcomes.

## How to use it

- Track each flow over time, not just net actives. A flat active count can hide rising churn offset by rising acquisition, which is fragile.
- When growth slows, the decomposition tells you whether the problem is acquisition, retention, or resurrection so you fix the right thing.
- Segment the flows by cohort, channel, and plan to localize problems.
- Pair churn flow with reason analysis to drive retention work.

## Best practices

- Define "active" with a meaningful action, not just a login.
- Keep the period (daily, weekly, monthly) consistent and matched to your usage cadence.
- Always validate the identity reconciles before trusting the chart.`,
  },
  {
    slug: "design-critique",
    name: "Design Critique",
    category: "design",
    description: "Runs structured design critiques using jobs-to-be-done, clarity, and delight dimensions.",
    author: "community",
    featured: false, verified: true,
    tags: ["design","critique","feedback"],
    install_count: 14800, rating_avg: 4.7, rating_count: 222,
    skill_content: `---
name: Design Critique
description: Run a structured design critique across jobs-to-be-done, clarity, and delight.
---

# Design Critique

Use this skill to give a designer or PM a rigorous, structured critique of a screen,
flow, or component. Avoid vague reactions ("I don't like it") and instead anchor every
note to a dimension and a concrete fix.

## When to use

- A new design or redesign is up for review.
- A flow feels "off" but no one can articulate why.
- You need to prioritize design debt against shipping goals.

## Before you start

Gather three things first. If any is missing, ask for it before critiquing:

1. The primary **job** the user is hiring this design to do.
2. The **context** of use (device, urgency, frequency, emotional state).
3. The **success metric** the team cares about.

## The three dimensions

### 1. Jobs-to-be-done (does it work?)

- Restate the user's job in one sentence.
- Trace the shortest path from intent to completion. Count the steps.
- Flag any step that does not advance the job.
- Check failure paths: what happens when input is wrong, empty, or slow?

### 2. Clarity (can they understand it?)

- Read the screen top to bottom in 5 seconds. What is the one obvious action?
- Verify visual hierarchy matches task priority (size, weight, color, position).
- Check labels: are they written in the user's language, not the system's?
- Test for ambiguity — could any control be misread as something else?

### 3. Delight (do they enjoy it?)

- Identify one moment that could feel effortless or rewarding.
- Check motion, microcopy, and empty states for personality without noise.
- Ensure delight never costs clarity or speed.

## Output format

Produce a critique table. For each finding:

| Dimension | Severity | Observation | Suggested fix |
|-----------|----------|-------------|---------------|

Severity scale:

- **Blocker** — breaks the job, ship-stopping.
- **Major** — measurable friction, fix this cycle.
- **Minor** — polish, backlog it.

## Rules of engagement

- Lead with what works before what doesn't.
- Separate observation from prescription — describe the problem, then propose.
- Never give more than 3 blockers per critique; if there are more, the design needs a reset, not a critique.
- Tie every Major and Blocker to the success metric or the job.

## Closing

End every critique with a single prioritized recommendation: "If you change one
thing before shipping, change X." This forces focus and gives the team a clear next step.`,
  },
  {
    slug: "component-api-design",
    name: "Component API Design",
    category: "design",
    description: "Designs React/Vue component APIs — props, composition, event handling, accessibility.",
    author: "lena-fox",
    featured: false, verified: true,
    tags: ["components","api","design"],
    install_count: 19200, rating_avg: 4.8, rating_count: 320,
    skill_content: `---
name: Component API Design
description: Design clean, composable React/Vue component APIs with accessibility built in.
---

# Component API Design

Use this skill to design the public API of a UI component before writing
implementation. A good API is learnable, hard to misuse, and composable.

## Principles

1. **Make the common case effortless, the complex case possible.**
2. **Prefer composition over configuration** — slots beat boolean explosions.
3. **The prop name is documentation** — it should read aloud as English.
4. **Accessibility is not a prop** — it is the default behavior.

## Step 1: Name the responsibilities

List every job the component does. If it does more than one thing that could vary
independently, split it. A \`Menu\` that also manages a button is two components:
\`Menu\` and \`MenuTrigger\`.

## Step 2: Choose the composition model

Pick one and stay consistent:

- **Props model** — flat config for simple, leaf components (\`Badge\`, \`Avatar\`).
- **Compound components** — shared context for related parts (\`Tabs\`, \`Tab\`, \`TabPanel\`).
- **Render props / slots** — when the consumer must control rendering.

## Step 3: Design the props

For each prop, decide:

- **Controlled vs uncontrolled.** Offer both with the \`value\` / \`defaultValue\` pair
  plus \`onChange\`. Never silently switch modes.
- **Type.** Prefer string unions over booleans: \`variant="ghost"\` not \`ghost={true}\`.
- **Default.** Every optional prop needs a sensible default documented in one place.

Avoid these smells:

- More than two boolean props that interact (combinatorial explosion).
- Props named after implementation (\`useFlexbox\`) instead of intent (\`align\`).
- A \`style\` or \`className\` escape hatch as the only customization path.

## Step 4: Events

- Name handlers \`onSomethingHappened\`, past or present tense consistently.
- Pass semantic payloads, not raw DOM events: \`onSelect(item)\` beats \`onClick(e)\`.
- Make events cancelable only when the consumer can meaningfully prevent default.

## Step 5: Accessibility contract

- Forward \`ref\` to the focusable root.
- Spread remaining props (\`...rest\`) onto the semantic element so \`aria-*\` works.
- Manage focus, roles, and keyboard interaction internally; expose hooks to override.
- Document the rendered semantics (role, tab order) in the API notes.

## Step 6: Write the usage examples first

Before implementing, write three example call sites: the trivial case, the typical
case, and the hardest case you expect. If any reads awkwardly, revise the API now —
it is free to change before code exists and expensive after.

## Output

Deliver a typed interface (TypeScript props or Vue \`defineProps\`), three usage
examples, and a one-paragraph rationale for the composition model chosen.`,
  },
  {
    slug: "ux-writing-audit",
    name: "UX Writing Audit",
    category: "design",
    description: "Audits product copy for clarity, consistency, tone, and actionability.",
    author: "community",
    featured: false, verified: true,
    tags: ["ux-writing","content","audit"],
    install_count: 16400, rating_avg: 4.6, rating_count: 246,
    skill_content: `---
name: UX Writing Audit
description: Audit product copy for clarity, consistency, voice, and actionability.
---

# UX Writing Audit

Use this skill to systematically review the words in a product — buttons, labels,
errors, empty states, and notifications — and produce concrete rewrites.

## Inventory first

Collect every string in scope into a single list with its surface and context:
button, field label, error, toast, modal title, empty state, tooltip. You cannot
audit copy in isolation from the moment it appears.

## The four lenses

### Clarity

- Can a first-time user understand it without prior knowledge?
- Remove jargon, internal terms, and feature codenames.
- Prefer concrete nouns and verbs over abstractions ("Delete project" not "Manage").
- One idea per sentence. Cut filler ("simply", "just", "please").

### Consistency

- Build a mini glossary: pick one term per concept (is it "log in" or "sign in"?).
- Match capitalization style (sentence case vs title case) everywhere.
- Standardize number, date, and unit formats.
- Reuse phrasing for parallel actions across the product.

### Voice and tone

- Define the voice once: e.g. "plain, confident, warm."
- Modulate tone by moment: celebratory on success, calm and blame-free on error.
- Never blame the user. "We couldn't save your changes" beats "You entered invalid data."

### Actionability

- Every error states what happened AND what to do next.
- Buttons name the action they perform ("Save changes"), never "OK" or "Submit".
- Empty states tell the user how to fill them.

## Error message formula

Use this three-part structure:

1. **What happened** — plain, specific.
2. **Why** (only if it helps) — brief.
3. **What to do** — an actionable next step or recovery path.

Example rewrite:

- Before: "Error 403."
- After: "You don't have permission to edit this file. Ask the owner for access."

## Scoring

Rate each string Pass / Revise / Rewrite. Tally results to show the team where the
copy debt concentrates (often errors and empty states).

## Output

Deliver a table: original copy, surface, issue (lens), proposed rewrite. Append the
glossary and a short voice-and-tone reference the team can reuse going forward.

## Guardrails

- Never lengthen copy for its own sake — shorter is usually better.
- Preserve legal or regulated wording verbatim; flag it, don't rewrite it.
- Localize-friendly: avoid idioms and concatenated sentence fragments that break translation.`,
  },
  {
    slug: "animation-system",
    name: "Animation System",
    category: "design",
    description: "Designs motion systems — easing curves, durations, choreography — for UI components.",
    author: "community",
    featured: false, verified: true,
    tags: ["animation","motion","design"],
    install_count: 12800, rating_avg: 4.7, rating_count: 192,
    skill_content: `---
name: Animation System
description: Design a coherent motion system of durations, easing, and choreography for UI.
---

# Animation System

Use this skill to build a motion system that feels intentional and consistent
instead of ad-hoc transitions scattered across components.

## Motion has a job

Animation should do work: direct attention, show cause and effect, express
hierarchy, or soften a change. If a motion does none of these, cut it.

## Step 1: Define duration tokens

Establish a small scale. Faster for small/near elements, slower for large/far ones.

- \`instant\`: 0ms (state with no transition)
- \`fast\`: 100ms (hovers, small toggles)
- \`base\`: 200ms (most transitions)
- \`slow\`: 300ms (modals, sheets, page-level)
- \`deliberate\`: 500ms (large or first-run reveals)

Never exceed ~500ms for interactive feedback — it starts to feel sluggish.

## Step 2: Define easing curves

- \`ease-out\` (\`cubic-bezier(0, 0, 0.2, 1)\`) — for elements **entering**. Fast start, gentle stop.
- \`ease-in\` (\`cubic-bezier(0.4, 0, 1, 1)\`) — for elements **exiting**. They accelerate away.
- \`ease-in-out\` (\`cubic-bezier(0.4, 0, 0.2, 1)\`) — for elements **moving** on screen.
- \`spring\` — for playful, physical interactions (drag release, bouncy toggles).

Rule of thumb: things that appear should decelerate in; things that leave accelerate out.

## Step 3: Choreography

When multiple elements animate, sequence them:

- **Stagger** list items by 20–40ms so they cascade, not flash.
- **Anchor** transitions to the trigger — a menu grows from the button that opened it.
- Animate the **most important** element first; supporting elements follow.
- Avoid animating more than ~5 things at once; group the rest.

## Step 4: Properties to animate

Prefer GPU-friendly properties: \`transform\` and \`opacity\`. Avoid animating
\`width\`, \`height\`, \`top\`, or \`left\` — they trigger layout and stutter.

## Step 5: Accessibility

Always honor reduced-motion. Provide a non-animated fallback:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
\`\`\`

Replace large motions with simple cross-fades rather than removing feedback entirely.

## Step 6: Document as tokens

Express the system as named tokens so engineers reuse them:

\`\`\`js
const motion = {
  duration: { fast: '100ms', base: '200ms', slow: '300ms' },
  easing: { enter: 'cubic-bezier(0,0,0.2,1)', exit: 'cubic-bezier(0.4,0,1,1)' },
};
\`\`\`

## Output

Deliver the duration scale, easing set, choreography rules, and a per-component
mapping (what animates, which duration, which curve) the team can implement directly.`,
  },
  {
    slug: "dark-mode-design",
    name: "Dark Mode Design",
    category: "design",
    description: "Designs dark mode systems with proper elevation, surface hierarchy, and reduced contrast.",
    author: "priya-deshmukh",
    featured: false, verified: true,
    tags: ["dark-mode","design","accessibility"],
    install_count: 18600, rating_avg: 4.8, rating_count: 297,
    skill_content: `---
name: Dark Mode Design
description: Build a dark theme with correct elevation, surface hierarchy, and contrast.
---

# Dark Mode Design

Use this skill to design a dark theme that is more than an inverted light theme.
Dark mode has its own rules for depth, color, and contrast.

## Core mistakes to avoid

- **Pure black backgrounds** (\`#000\`). Use a dark gray (e.g. \`#121212\`) so shadows and
  elevation are visible and OLED smearing is reduced.
- **Pure white text** (\`#FFF\`) on dark. Use ~87% opacity white for body text to cut
  harsh contrast and eye strain.
- **Saturated colors** carried over from light mode. They vibrate against dark
  backgrounds — desaturate and lighten brand colors for dark surfaces.

## Step 1: Establish surface elevation

In dark mode, higher elevation = lighter surface (light "falls" from above), not
bigger shadows. Define an elevation scale:

- Level 0 (base): \`#121212\`
- Level 1 (card): \`#1E1E1E\`
- Level 2 (raised): \`#242424\`
- Level 3 (dialog): \`#2C2C2C\`
- Level 4 (menu/popover): \`#333333\`

Each step adds a subtle white overlay (~5% per level). Shadows still help but carry
less weight than in light mode.

## Step 2: Text opacity hierarchy

Layer text with opacity rather than separate hex colors:

- High emphasis (headings, body): 87% white
- Medium emphasis (secondary, labels): 60% white
- Disabled: 38% white

## Step 3: Color adaptation

For each brand and semantic color, create a dark variant:

- Lower saturation by ~15–25%.
- Raise lightness so it reads on dark surfaces.
- Verify contrast against the surface it sits on, not against pure black.

## Step 4: Contrast targets

- Body text: at least 4.5:1 against its surface (WCAG AA).
- Large text and UI components: at least 3:1.
- Don't over-shoot to maximum contrast everywhere — that recreates the eye strain
  you came to dark mode to avoid. Aim for comfortable, not blinding.

## Step 5: Elevation + color interaction

When a colored surface is elevated, blend it toward the lighter elevation tone so it
still reads as "higher" without losing its hue.

## Step 6: Tokenize for theming

Define semantic tokens that swap by theme:

\`\`\`js
const surface = {
  light: { base: '#FFFFFF', raised: '#F5F5F5' },
  dark:  { base: '#121212', raised: '#1E1E1E' },
};
\`\`\`

Components reference \`surface.base\`, never a raw hex, so a single switch flips themes.

## Step 7: Test in context

- Check images and illustrations — add a subtle border or dim overlay if they glow.
- Verify shadows are still perceptible.
- Test in a dark room and a bright room; comfort changes with ambient light.

## Output

Deliver the elevation scale, text opacity tiers, adapted color set with contrast
checks, and the semantic token map for both themes.`,
  },
  {
    slug: "icon-system",
    name: "Icon System",
    category: "design",
    description: "Designs consistent icon systems — grid, stroke weight, optical sizing, naming conventions.",
    author: "community",
    featured: false, verified: true,
    tags: ["icons","design","system"],
    install_count: 11200, rating_avg: 4.6, rating_count: 168,
    skill_content: `---
name: Icon System
description: Design a consistent icon set with shared grid, stroke, sizing, and naming.
---

# Icon System

Use this skill to design or audit an icon set so every glyph feels like it belongs
to the same family.

## Step 1: Define the grid

Pick a base canvas, commonly 24x24px. Inside it define:

- **Live area** — typically 20x20, where the icon body sits.
- **Padding** — the 2px margin keeping icons from touching their bounds.
- **Keylines** — reference shapes (square, circle, rectangles) that anchor the
  optical size of different forms so a circle and a square feel equally large.

## Step 2: Choose stroke weight

- Pick one stroke (commonly 1.5px or 2px at 24px) and apply it everywhere.
- Keep stroke weight **constant** across the set — mixing weights breaks cohesion.
- Use consistent corner radius on stroke endpoints (round vs butt caps) and joins.

## Step 3: Optical sizing

Mathematical size != perceived size. Adjust so glyphs feel balanced:

- Circles must slightly overshoot the live area to look the same size as squares.
- Triangles and diagonal forms need optical centering, not geometric centering.
- Test icons side by side at target size and nudge until none looks heavier.

## Step 4: Establish drawing rules

- Align edges to the pixel grid at the base size for crispness.
- Standardize how you depict recurring metaphors (a "plus" is always the same plus).
- Choose a level of detail and hold it — don't mix detailed and minimal glyphs.
- Decide handling of filled vs outline variants up front if you need both.

## Step 5: Naming conventions

Name by meaning, not appearance, so swaps don't require renames:

- Prefer \`delete\` over \`trash-can\`, \`settings\` over \`gear\`.
- Use a consistent pattern: \`category-name-variant\`, e.g. \`arrow-left\`, \`arrow-left-filled\`.
- Keep names lowercase-hyphenated and singular.
- Maintain an alias list mapping synonyms to canonical names.

## Step 6: Delivery format

- Export optimized SVGs with consistent \`viewBox\` and no hard-coded fills where you
  want color to inherit (\`currentColor\`).
- Strip editor metadata; run through an SVG optimizer.
- Provide multiple sizes only if optically redrawn — never just scale 24px to 16px.

## Step 7: Multi-size variants

For small sizes (16px), redraw with reduced detail and adjusted stroke so the icon
stays legible. A scaled-down 24px icon looks muddy.

## Output

Deliver the grid spec, stroke and corner rules, optical-sizing notes, the naming
convention with an alias table, and an export checklist for engineering handoff.`,
  },
  {
    slug: "design-token-system",
    name: "Design Token System",
    category: "design",
    description: "Creates multi-tier token systems: global → semantic → component, with dark mode variants.",
    author: "marcus-lee",
    featured: false, verified: true,
    tags: ["tokens","design-system","theming"],
    install_count: 22400, rating_avg: 4.9, rating_count: 380,
    skill_content: `---
name: Design Token System
description: Build a three-tier token architecture (global, semantic, component) with theming.
---

# Design Token System

Use this skill to design a scalable token architecture that survives rebrands,
theming, and growth — instead of hard-coded values sprinkled through the codebase.

## The three tiers

### Tier 1: Global (primitive) tokens

Raw values with no meaning attached. The full palette of options.

\`\`\`js
const global = {
  blue500: '#3B82F6',
  gray900: '#111827',
  space4: '16px',
  fontSize3: '18px',
};
\`\`\`

Rules: name by value, never by use. \`blue500\`, not \`primary\`. Components never
reference these directly.

### Tier 2: Semantic (alias) tokens

Assign meaning by pointing at globals. This is where theming lives.

\`\`\`js
const semantic = {
  colorTextPrimary: global.gray900,
  colorActionDefault: global.blue500,
  colorSurfaceBase: global.white,
  spaceInline: global.space4,
};
\`\`\`

Rules: name by intent (\`colorActionDefault\`), not appearance (\`colorBlue\`). Most
components consume this tier.

### Tier 3: Component tokens

Optional, for components that need fine control. Point at semantic tokens.

\`\`\`js
const button = {
  buttonBackground: semantic.colorActionDefault,
  buttonText: semantic.colorTextOnAction,
  buttonPaddingX: semantic.spaceInline,
};
\`\`\`

## Why three tiers

- A rebrand changes **global** values; semantics and components follow automatically.
- A theme (dark mode) re-points **semantic** tokens to different globals.
- A one-off component tweak touches only its **component** tokens, not the system.

## Theming with token sets

Define one semantic set per theme that re-points to the same global palette:

\`\`\`js
const semanticDark = {
  colorTextPrimary: global.gray050,
  colorSurfaceBase: global.gray900,
  colorActionDefault: global.blue400, // lightened for dark surfaces
};
\`\`\`

Components reference \`colorSurfaceBase\`; switching the active semantic set flips
the whole theme with zero component changes.

## Naming convention

Adopt a predictable structure: \`category-property-variant-state\`.

- \`color-text-primary\`
- \`color-action-default-hover\`
- \`space-inline-sm\`

Keep it consistent and machine-parseable so tooling can generate platform outputs.

## Token categories to cover

Color, spacing, typography (family, size, weight, line-height, letter-spacing),
radii, borders, shadows, z-index, motion (duration, easing), and breakpoints.

## Tooling

- Store source tokens as JSON (W3C DTCG format) so they are platform-agnostic.
- Use Style Dictionary or similar to transform into CSS variables, JS, iOS, Android.
- Validate references resolve and no component points directly at a global.

## Guardrails

- No raw hex or px in component code — everything resolves through tokens.
- Every semantic token must have a value in every theme.
- Deprecate, don't delete: keep an alias when renaming so consumers migrate gradually.

## Output

Deliver the three-tier JSON source, a light and dark semantic set, the naming
convention doc, and the build config that emits platform-specific token files.`,
  },
  {
    slug: "user-flow-mapper",
    name: "User Flow Mapper",
    category: "design",
    description: "Maps complete user flows — happy path, error states, edge cases, and re-engagement.",
    author: "community",
    featured: false, verified: true,
    tags: ["ux","flows","design"],
    install_count: 17800, rating_avg: 4.7, rating_count: 267,
    skill_content: `---
name: User Flow Mapper
description: Map complete user flows including happy path, errors, edge cases, and re-engagement.
---

# User Flow Mapper

Use this skill to map a feature's full flow before design or build — surfacing the
error and edge states teams usually discover too late.

## Step 1: Frame the flow

State three things:

- **Entry points** — every way a user can arrive (deep link, nav, notification, search).
- **Goal** — the single outcome that means success.
- **Actors and pre-conditions** — who, with what permissions and prior state.

## Step 2: Map the happy path

List the minimal sequence of steps from entry to goal when everything works. Use
verb-led step names: "Enter email", "Verify code", "Set password". Keep it linear
and short; this is the spine everything else hangs from.

## Step 3: Branch the decision points

At each step, ask "what can the user choose or what can the system decide here?"
Draw branches for each. Common branch types:

- Validation outcomes (valid / invalid input)
- Permission checks (allowed / denied)
- Existence checks (new / returning, exists / not found)

## Step 4: Enumerate error states

For every step that can fail, define:

- **Trigger** — what causes the error.
- **Message** — what the user sees (blame-free, actionable).
- **Recovery** — the path back to the happy path.

Cover at minimum: network failure, timeout, server error, invalid input, and
permission denial.

## Step 5: Edge cases checklist

Walk this list against every flow:

- Empty states (no data yet) and overflow states (too much data).
- Slow connection / partial load.
- Interrupted flow (user leaves and returns mid-flow).
- Concurrent edits or stale data.
- First-time vs power user.
- Boundary inputs: zero, maximum length, special characters, time zones.
- Accessibility paths: keyboard-only and screen-reader traversal.

## Step 6: Re-engagement and exits

A flow doesn't end at the goal. Map:

- **Success exit** — what's next? Confirmation, next action, or dead end?
- **Abandonment** — if the user drops, how do you bring them back (email, push, saved progress)?
- **Loops** — can they repeat the flow easily?

## Step 7: Notate the map

Use a consistent visual grammar:

- Rectangle = screen/step, diamond = decision, rounded = system process,
  red = error state, dashed = re-engagement path.
- Number steps for reference in specs and tickets.

## Output

Deliver the flow diagram (or structured outline) covering happy path, all branches,
error states with recovery, the edge-case audit, and re-engagement paths. Flag the
top three risks where the flow is most likely to break for users.`,
  },
  {
    slug: "prototype-spec",
    name: "Prototype Spec",
    category: "design",
    description: "Writes detailed prototype specs: interactions, transitions, states, and edge cases.",
    author: "community",
    featured: false, verified: true,
    tags: ["prototyping","design","spec"],
    install_count: 14200, rating_avg: 4.6, rating_count: 213,
    skill_content: `---
name: Prototype Spec
description: Write an implementation-ready prototype spec covering interactions, states, and edges.
---

# Prototype Spec

Use this skill to turn a static design into a precise, build-ready specification of
behavior — so engineering doesn't guess at the parts the mockup can't show.

## What a spec must answer

A static design shows what something looks like at rest. A spec answers:

- What happens when I touch it?
- What does it look like in every state?
- What happens when something goes wrong?

## Step 1: Inventory the interactive elements

List every control: buttons, inputs, toggles, draggables, scroll regions, gestures.
For each, you will specify its states and interactions below.

## Step 2: Specify states

For each interactive element, define every visual state:

- Default, hover, focus, active/pressed, disabled.
- Loading, success, error (where applicable).
- Selected / unselected, expanded / collapsed.

Describe what changes between states (color, elevation, label, icon) referencing
tokens, not raw values.

## Step 3: Specify interactions

For each interaction, write a trigger → response statement:

- **Trigger** — the input (tap, hover 300ms, drag, key press, scroll past threshold).
- **Response** — what changes and how (state change, navigation, data mutation).
- **Transition** — duration, easing, and what animates (reference the motion system).
- **Feedback** — immediate acknowledgment (ripple, spinner, optimistic update).

## Step 4: Transitions between screens

For navigations and overlays, specify:

- Enter and exit animation (direction, duration, easing).
- Whether the previous screen persists, dims, or unmounts.
- Shared-element transitions if any element morphs across screens.

## Step 5: Edge and error behavior

Document the unhappy paths the prototype must handle:

- Empty data, loading, and error states for every data-driven view.
- What happens on slow network (skeletons, progressive reveal, timeout).
- Validation timing — on blur, on submit, or live?
- Concurrency: double-tap, rapid navigation, offline.

## Step 6: Conditional logic

Spell out rules in plain language: "If the cart is empty, the Checkout button is
disabled and shows tooltip X." Cover every branch a designer implied but didn't draw.

## Step 7: Accessibility behavior

- Focus order and focus trapping for modals.
- Keyboard equivalents for every pointer interaction.
- Announcements for dynamic content (live regions).

## Format

Write specs as numbered, testable statements. Each should be verifiable by a QA
engineer without asking a follow-up. Group by screen, then by element.

## Output

Deliver a spec document: element inventory, state matrices, interaction statements
with timing, transition specs, edge-case behaviors, and accessibility notes — ready
to hand directly to engineering.`,
  },
  {
    slug: "print-layout",
    name: "Print Layout",
    category: "design",
    description: "Designs print-ready layouts — bleed, safe zones, color profiles, and prepress checks.",
    author: "community",
    featured: false, verified: true,
    tags: ["print","layout","design"],
    install_count: 8400, rating_avg: 4.5, rating_count: 126,
    skill_content: `---
name: Print Layout
description: Prepare print-ready layouts with correct bleed, safe zones, color, and prepress checks.
---

# Print Layout

Use this skill to take a design to print without the costly surprises that screen
designers hit — cut-off content, color shifts, and rejected files.

## Step 1: Set up the document correctly

- **Trim size** — the final cut dimensions of the piece.
- **Bleed** — extend any artwork that touches the edge by 3mm (0.125in) past trim,
  so a slightly off cut never reveals white paper.
- **Safe zone** — keep all critical content (text, logos) at least 3–5mm inside the
  trim to survive cutting tolerance.
- **Document resolution** — design at 300 DPI for the final print size; 150 DPI may
  suffice for large-format viewed from a distance.

## Step 2: Color management

- Work in **CMYK** for offset/digital print, not RGB — screen colors won't all
  reproduce on press. Convert and review before delivery.
- Assign the correct **ICC profile** for the press/paper (ask the printer; e.g.
  US Web Coated SWOP, FOGRA39 for European coated).
- Use **spot/Pantone** colors only when specified; they cost extra plates.
- Rich black for large dark areas (e.g. C60 M40 Y40 K100), pure K100 for small text.

## Step 3: Typography for print

- Embed or outline all fonts so the printer's system doesn't substitute them.
- Minimum text size ~6pt; ensure fine text prints in a single plate (K only) to
  avoid registration blur.
- Avoid hairline rules thinner than 0.25pt — they may not print reliably.

## Step 4: Images and links

- All raster images at 300 DPI **at placed size**, not source size.
- Links embedded or packaged — never deliver a file with missing links.
- Total ink coverage under the press limit (commonly ~300%) to prevent smearing.

## Step 5: Prepress checklist

Before sending to print, verify:

- Bleed present on every edge-touching element.
- No critical content in the bleed or outside the safe zone.
- Color mode CMYK, correct ICC profile attached.
- Fonts embedded or outlined.
- Images 300 DPI, no missing links, ink limit respected.
- Overprint and knockout set correctly (watch white text set to overprint — it vanishes).
- Crop marks and bleed marks included on the export.

## Step 6: Export

- Export to **PDF/X-1a** or **PDF/X-4** (confirm which the printer wants).
- Include bleed and trim marks; set the correct output intent.
- Flatten transparency if the printer requires it.

## Step 7: Proof

- Request a hard proof for color-critical jobs; soft proofs miss paper and press shifts.
- Check a physical proof for registration, color, and trim before the full run.

## Output

Deliver the print-ready PDF/X file plus a prepress checklist confirming bleed, safe
zone, color profile, fonts, image resolution, and ink limits were all verified.`,
  },
  {
    slug: "fundraising-narrative",
    name: "Fundraising Narrative",
    category: "business",
    description: "Crafts the founder story arc for seed and Series A — origin, insight, traction, vision.",
    author: "community",
    featured: false, verified: true,
    tags: ["fundraising","startups","pitch"],
    install_count: 28400, rating_avg: 4.7, rating_count: 426,
    skill_content: `---
name: Fundraising Narrative
description: Build a compelling founder story arc for seed and Series A pitches.
---

# Fundraising Narrative

Investors back conviction before they back numbers. This skill builds the
narrative spine that makes a deck memorable and a founder credible.

## The Five-Beat Arc

1. **Origin** — Why you, why now. The personal or earned-secret reason this
   problem chose you. Keep it to two sentences; specificity beats drama.
2. **Insight** — The non-obvious truth about the market that most people get
   wrong. State it as a contrarian claim a smart investor would push back on.
3. **Wedge** — The narrow, winnable beachhead. Show you can dominate something
   small before you claim something large.
4. **Traction** — Proof the insight is real. Lead with the single metric that
   most reduces investor doubt (retention, payback, week-over-week growth).
5. **Vision** — The category you create if the wedge works. Paint the
   ten-year picture, then connect it back to the next 18 months of execution.

## Process

- Interview the founder for raw material before writing anything. Ask: "What
  did you believe a year ago that you no longer believe?" The answer is usually
  the insight.
- Draft the arc as six spoken sentences first. If it does not survive being
  read aloud, the deck will not survive a partner meeting.
- Map each beat to exactly one slide. Resist the urge to add supporting slides
  until the spine holds.

## Tightening Rules

- Cut every adjective that an investor could not verify.
- Replace "huge market" with a bottom-up number and the assumption behind it.
- Name the risk the investor is already thinking about, then answer it. Naming
  it first signals self-awareness and defuses the objection.
- Every claim of traction needs a denominator. "40% growth" means nothing
  without the base.

## Stage Calibration

- **Seed**: weight Origin and Insight. You are selling the founder and the
  bet. Traction can be qualitative (design partners, waitlist conversion).
- **Series A**: weight Traction and Vision. Now the bet is partially proven;
  the question is whether it scales. Show the engine, not just the spark.

## Anti-Patterns

- The "we have no competitors" slide — it reads as naivety. Map the landscape
  and explain why incumbents structurally cannot follow you.
- Vision before proof. A grand TAM with no wedge signals you do not know where
  to start.
- Burying the lede. The strongest fact belongs in the first 90 seconds.

## Deliverable

Produce a one-page narrative memo with the five beats, the single hero metric,
the named risk-and-answer, and three sentences of vision. The deck is built
from this memo, never the reverse.`,
  },
  {
    slug: "term-sheet-explainer",
    name: "Term Sheet Explainer",
    category: "business",
    description: "Explains VC term sheet clauses in plain English with negotiation guidance.",
    author: "community",
    featured: false, verified: true,
    tags: ["fundraising","legal","vc"],
    install_count: 21800, rating_avg: 4.8, rating_count: 327,
    skill_content: `---
name: Term Sheet Explainer
description: Decode VC term sheet clauses and know what is worth negotiating.
---

# Term Sheet Explainer

A term sheet is non-binding but path-dependent — what you sign here sets the
template for every future round. This skill translates the jargon and flags
what actually matters.

## The Two Buckets

Every term falls into **economics** (who gets what money) or **control**
(who decides what). Negotiate economics for fairness; negotiate control for
survival. Founders who only fight over valuation often give away the company.

## Economics Terms

- **Valuation (pre vs post)**: Post-money = pre + investment. Always confirm
  which the term sheet quotes; option pool sizing hides here.
- **Option pool shuffle**: A pool created pre-money dilutes founders, not
  investors. Push to size the pool against an actual hiring plan, not a round
  number.
- **Liquidation preference**: 1x non-participating is standard and founder-fair.
  Participating preferred ("double dip") and multiples above 1x are red flags
  in normal markets — resist hard.
- **Pro-rata rights**: Investor's right to maintain ownership in future rounds.
  Standard for leads; watch for super pro-rata that lets them take your next
  round.

## Control Terms

- **Board composition**: At seed, a 2-1 founder-favorable board is healthy.
  A balanced or investor-controlled board this early is a warning sign.
- **Protective provisions**: List of actions requiring investor consent. Normal
  to cover selling the company or issuing senior stock; abnormal to cover
  hiring or annual budgets.
- **Drag-along**: Forces minority holders to join a sale approved by the
  majority. Confirm the threshold and whether common gets a say.
- **Founder vesting**: Re-vesting your own shares is common; negotiate
  acceleration on termination-without-cause and on acquisition (single vs
  double trigger).

## Negotiation Playbook

1. Get the lead committed emotionally before negotiating terms; leverage comes
   from their conviction, not your spreadsheet.
2. Pick three terms to fight for, concede the rest gracefully. Fighting every
   line burns goodwill you will need on the board.
3. Always counter with a reason tied to future-round signaling, not greed.
   "This will hurt our Series A optics" lands better than "I want more."
4. Use a second offer as your strongest lever; nothing moves terms like
   competition.

## Red Flags Checklist

- Full-ratchet anti-dilution (vs broad-based weighted average — the standard).
- Redemption rights forcing buyback on a timeline.
- Liquidation multiple > 1x or participating preferred.
- Investor board control at seed.

## Deliverable

Produce a clause-by-clause table: term, plain-English meaning, market-standard
position, this sheet's position, and a recommended ask. Flag deviations from
standard in priority order. Always recommend a startup-specialist lawyer for
the binding documents.`,
  },
  {
    slug: "competitive-moat",
    name: "Competitive Moat Analysis",
    category: "business",
    description: "Identifies and stress-tests competitive moats: switching costs, network effects, scale.",
    author: "community",
    featured: false, verified: true,
    tags: ["strategy","competition","business"],
    install_count: 19200, rating_avg: 4.6, rating_count: 288,
    skill_content: `---
name: Competitive Moat Analysis
description: Identify durable competitive advantages and pressure-test them honestly.
---

# Competitive Moat Analysis

A moat is a structural reason your advantage compounds rather than erodes.
Most "moats" founders cite are features a funded competitor copies in a
quarter. This skill separates real moats from wishful thinking.

## The Seven Real Moats

1. **Network effects** — Each user makes the product more valuable to others.
   Test: does value scale with n, n-squared, or not with n at all?
2. **Switching costs** — Leaving is expensive in time, data, or risk. Test:
   what would a customer lose by churning on Monday?
3. **Scale economies** — Unit costs fall as you grow, structurally below
   what a smaller rival can reach.
4. **Counter-positioning** — Incumbents cannot copy you without damaging their
   existing business. The strongest moat against giants.
5. **Cornered resource** — Exclusive access to talent, IP, data, or supply.
6. **Brand** — Customers pay more or choose faster because of trust, not
   features.
7. **Process power** — An organizational capability rivals cannot replicate
   even knowing how it works (rare; Toyota-class).

## Stress-Test Protocol

For each claimed moat, run the adversary test:

- **The funded copycat**: A competitor with 50M dollars and your full feature
  list launches tomorrow. What still protects you? If nothing, it was a
  feature, not a moat.
- **The incumbent pivot**: The market leader decides you are a threat. Which
  moats survive their distribution advantage?
- **The time test**: Does the moat strengthen or weaken with each passing
  quarter? Real moats compound.

## Measuring Moat Strength

- Network effects: track the correlation between cohort size and retention.
- Switching costs: measure the gross retention rate of multi-year cohorts.
- Scale: model your cost curve against a sub-scale competitor's.
- Counter-positioning: name the specific revenue the incumbent protects by NOT
  copying you.

## Common Mistakes

- Confusing a head start with a moat. Being first only matters if it builds one
  of the seven.
- Claiming brand before you have pricing power to prove it.
- Assuming proprietary data is a moat — it only is if the data improves the
  product in a flywheel competitors cannot bootstrap.

## Building Moats Deliberately

Map which moat your strategy is actually building. If the answer is "none yet,"
that is the most important strategic finding. Sequence the business model to
create network effects or switching costs early, before competition arrives.

## Deliverable

Produce a moat scorecard: each of the seven types rated absent / emerging /
strong, with the evidence and the adversary-test result. Conclude with the one
moat to invest in deliberately over the next year.`,
  },
  {
    slug: "saas-pricing",
    name: "SaaS Pricing Model",
    category: "business",
    description: "Designs SaaS pricing tiers with value metric, packaging, and expansion revenue structure.",
    author: "community",
    featured: false, verified: true,
    tags: ["pricing","saas","strategy"],
    install_count: 24600, rating_avg: 4.7, rating_count: 369,
    skill_content: `---
name: SaaS Pricing Model
description: Design SaaS tiers, value metrics, and packaging that grow with the customer.
---

# SaaS Pricing Model

Pricing is the highest-leverage growth lever and the least-tested. A 1% price
improvement often beats a 1% gain in acquisition or retention. This skill
designs pricing that aligns what you charge with the value you create.

## Step 1: Choose the Value Metric

The value metric is the unit you charge by — seats, events, GB, transactions.
A good value metric:

- Scales with the value the customer receives.
- Is easy for the customer to predict and budget.
- Grows naturally as the customer succeeds (this is your expansion engine).

Per-seat is simple but caps with headcount. Usage-based aligns with value but
hurts predictability. Hybrid (platform fee + usage) is increasingly standard.

## Step 2: Package into Tiers

Use three tiers as the default. The middle tier should be the one you want most
customers to choose — anchor it with a deliberately under-featured low tier and
a premium high tier.

- **Good**: removes friction for the self-serve buyer; gates the features that
  signal you are ready to pay.
- **Better**: the target. Includes the features 70% of buyers need.
- **Best / Enterprise**: security, SSO, SLAs, support. Price on value, often
  "contact us."

Gate features by buyer sophistication and willingness to pay, not by cost to
build. SSO and audit logs belong in the top tier because they signal budget.

## Step 3: Design Expansion

Net revenue retention above 100% is the engine of SaaS compounding. Build
expansion in from the start:

- The value metric should grow with usage so good customers pay more naturally.
- Add expansion seats, premium modules, and usage overages.
- Price the first unit to land, price expansion to monetize.

## Step 4: Set the Numbers

- Anchor on value delivered, not cost-plus. Estimate the dollar value the
  customer captures and price at 10-25% of it.
- Use round, confident numbers. Odd prices read as consumer, not B2B.
- Always offer annual billing at a 15-20% discount to improve cash and
  retention.

## Validation

- Run the "too cheap / too expensive" Van Westendorp survey on real prospects.
- Check that fewer than ~20% of deals close without a single objection — if
  nobody balks, you are underpriced.
- Test price increases on new logos first; never surprise existing customers.

## Anti-Patterns

- Charging by a metric the customer wants to minimize (e.g. per-API-call when
  they want fewer calls).
- Too many tiers — analysis paralysis kills conversion.
- Grandfathering forever; build price-increase rights into contracts.

## Deliverable

Produce a pricing page spec: the value metric and its rationale, three tiers
with feature gates, list prices, annual discount, and the expansion path with
target net revenue retention.`,
  },
  {
    slug: "channel-strategy",
    name: "Channel Strategy",
    category: "business",
    description: "Selects and prioritizes distribution channels with acquisition economics and sequencing.",
    author: "community",
    featured: false, verified: true,
    tags: ["marketing","channels","strategy"],
    install_count: 18400, rating_avg: 4.5, rating_count: 276,
    skill_content: `---
name: Channel Strategy
description: Pick, sequence, and scale the distribution channels that fit your economics.
---

# Channel Strategy

Most startups die from lack of distribution, not lack of product. Channel
strategy is the discipline of finding the one channel that works before
diluting effort across ten that do not.

## The Core Principle

At any given stage, one channel drives the majority of growth. The job is to
find it, saturate it, and only then add the next. Spreading thin across many
channels is the most common cause of stalled growth.

## Channel Inventory

- **Paid acquisition** (search, social, programmatic): fast feedback, scales
  with cash, margins compress as you scale spend.
- **Content / SEO**: slow to start, compounding, defensible. Best when buyers
  search for solutions.
- **Sales-led** (inbound or outbound): essential for high ACV; expensive per
  rep; needs a repeatable motion.
- **Product-led / virality**: the product is the channel. Requires built-in
  sharing or collaboration loops.
- **Partnerships / channel sales**: leverage someone else's distribution; slow
  to negotiate, high ceiling.
- **Community / marketplaces**: high trust, hard to manufacture.

## Selection Framework

Score each channel against:

1. **Fit with ACV**: Sales-led needs >5K ACV to pay for reps; PLG needs low
   friction and short time-to-value.
2. **Fit with buyer behavior**: Do they search, scroll, or get referred?
3. **CAC and payback**: Estimate fully-loaded cost per customer and months to
   recover it. Anything over 12 months needs strong retention to justify.
4. **Saturation ceiling**: How big can this channel get before it caps?
5. **Defensibility**: Can a competitor outbid you? Paid is rentable; content
   and community are owned.

## Sequencing

- Start with the channel that gives the fastest learning loop, usually paid for
  testing demand or founder-led sales for high ACV.
- Use early paid spend to learn messaging and ICP, even if uneconomical — buy
  data, then shift budget to compounding channels.
- Layer in one compounding channel (content, product loops) early so you are
  not renting all your growth forever.

## Economics Discipline

For each active channel track CAC, payback period, and the trend as you scale
spend. Kill or cap any channel where CAC rises faster than LTV. Reallocate to
the channel with the best marginal return, not the best average return.

## Anti-Patterns

- "We'll do a bit of everything." Focus beats breadth at every early stage.
- Copying a competitor's channel without their economics — their ACV may
  support what yours cannot.
- Scaling spend before the unit economics work; you only multiply losses.

## Deliverable

Produce a channel matrix scoring each channel on fit, CAC, payback, ceiling,
and defensibility, then a 12-month sequencing plan naming the single primary
channel and the one compounding channel to build alongside it.`,
  },
  {
    slug: "unit-economics",
    name: "Unit Economics",
    category: "business",
    description: "Calculates and optimizes CAC, LTV, payback, and contribution margin.",
    author: "community",
    featured: false, verified: true,
    tags: ["finance","unit-economics","saas"],
    install_count: 29800, rating_avg: 4.8, rating_count: 447,
    skill_content: `---
name: Unit Economics
description: Calculate and improve CAC, LTV, payback, and contribution margin correctly.
---

# Unit Economics

Unit economics answer one question: does each customer make money, and how
fast? Get the definitions wrong and you will scale a business that loses money
faster the more it grows. This skill enforces honest math.

## The Four Core Metrics

### CAC (Customer Acquisition Cost)
Fully-loaded: all sales and marketing spend (salaries, tools, ad spend,
commissions) divided by new customers in the same period. The most common
mistake is counting ad spend only and ignoring people.

### Contribution Margin
Revenue per customer minus the variable cost to serve them (hosting, payment
fees, support, third-party APIs). This is the real margin that funds CAC and
overhead — not gross revenue.

### LTV (Lifetime Value)
LTV = (ARPA × gross margin %) / churn rate. Use gross margin, never raw
revenue. For SaaS, cap the horizon at 3 years for credibility; infinite-life
LTV math flatters early-stage churn.

### Payback Period
CAC / (monthly contribution margin per customer). The number of months to earn
back acquisition cost. The metric VCs trust most because it is hard to fake.

## Healthy Benchmarks

- **LTV:CAC** — 3:1 or better. Below 1:1 you lose money per customer; above 5:1
  you may be underinvesting in growth.
- **Payback** — under 12 months for SMB, under 18-24 for enterprise.
- **Contribution margin** — 70%+ for software; structurally lower for
  usage-heavy or services-heavy models.

## Segment Before You Conclude

Blended unit economics hide the truth. A great SMB segment can mask a brutal
enterprise one, or vice versa. Always compute by:

- Acquisition channel (paid vs organic CAC differ wildly).
- Customer segment / size.
- Cohort (newer cohorts may churn differently).

## Optimization Levers

To improve LTV:CAC, in order of usual leverage:

1. **Reduce churn** — the single biggest LTV lever; compounds.
2. **Expand revenue** — upsell and net-revenue-retention above 100%.
3. **Raise prices** — direct margin, often under-tested.
4. **Lower CAC** — shift to compounding channels, improve conversion.
5. **Improve gross margin** — renegotiate infra, automate support.

## Common Traps

- Using revenue instead of gross margin in LTV.
- Excluding fully-loaded headcount from CAC.
- Averaging across segments that should be separated.
- Ignoring the time value — a 30-month payback is a financing problem even if
  LTV:CAC looks fine.

## Deliverable

Produce a unit economics model: CAC, contribution margin, LTV, LTV:CAC, and
payback — computed blended and split by at least channel and segment — plus the
top three levers ranked by expected impact on payback period.`,
  },
  {
    slug: "m-and-a-analysis",
    name: "M&A Analysis",
    category: "business",
    description: "Structures acquisition analysis: strategic fit, synergies, valuation, and integration risk.",
    author: "community",
    featured: false, verified: true,
    tags: ["ma","strategy","finance"],
    install_count: 12800, rating_avg: 4.5, rating_count: 192,
    skill_content: `---
name: M&A Analysis
description: Structure an acquisition case from strategic fit through integration risk.
---

# M&A Analysis

Most acquisitions destroy value. They fail not on the spreadsheet but on the
thesis and the integration. This skill structures the analysis so the deal is
judged on strategy first and synergies second.

## Start With the Thesis

Before any model, write the one-sentence reason for the deal:

- **Capability** — buy what would take too long to build (team, tech, IP).
- **Market access** — buy customers, geography, or a channel.
- **Consolidation** — buy a competitor to gain scale or pricing power.
- **Defensive** — keep an asset out of a rival's hands.

A deal that fits more than one cleanly is rare; a deal that fits none is a
vanity acquisition. Name the thesis and test everything against it.

## Strategic Fit Assessment

- Does the target accelerate the existing strategy, or distract from it?
- Cultural and operating-model fit — the most common silent killer.
- Build vs buy vs partner: is acquisition genuinely the best path, or the one
  that flatters egos?

## Synergy Analysis

Separate and discount honestly:

- **Cost synergies** (overlapping functions, infra) — more reliable; still
  haircut by 20-30% for execution risk.
- **Revenue synergies** (cross-sell, bundling) — notoriously overestimated;
  haircut by 50%+ and delay the realization timeline.
- Always net out **dis-synergies**: customer churn from the deal, attrition of
  key staff, integration cost and distraction.

## Valuation

- Anchor on standalone DCF of the target, then add risk-adjusted synergies.
- Cross-check with comparable transaction multiples and the target's last
  financing.
- Define your walk-away price before negotiation and write down why.
- Structure matters: earn-outs and retention packages align the seller and
  de-risk overpayment.

## Integration Risk

The deal closes; the value is realized (or lost) in the next 12 months.

- Name the integration owner before signing.
- Identify the 5-10 people whose departure would break the thesis; build
  retention for them specifically.
- Decide the integration depth: full absorption vs run-it-separately. Mismatch
  here is a frequent failure mode.
- Plan the first-100-days communication for both customer bases.

## Red Flags

- Synergies needed to justify the price (the deal only works if everything goes
  right).
- Founder or key-team flight risk with no retention.
- Customer concentration in the target.
- A thesis that keeps changing to fit the price.

## Deliverable

Produce a deal memo: the one-line thesis, strategic-fit assessment,
risk-adjusted synergy bridge, valuation with walk-away price, integration plan
with named owner, and the top three risks with mitigations.`,
  },
  {
    slug: "board-management",
    name: "Board Management",
    category: "business",
    description: "Prepares board materials, manages board dynamics, and gets the most from advisory boards.",
    author: "community",
    featured: false, verified: true,
    tags: ["board","governance","startups"],
    install_count: 14200, rating_avg: 4.6, rating_count: 213,
    skill_content: `---
name: Board Management
description: Run effective boards — great materials, no surprises, real decisions.
---

# Board Management

A board meeting is not a status update; it is the highest-leverage governance
and strategy session you get. Run it badly and it becomes theater. This skill
turns boards into a useful instrument.

## The Golden Rule: No Surprises

Every material decision and every piece of bad news should reach board members
before the meeting, one-on-one. The meeting ratifies and debates; it never
ambushes. A surprised board member is a defensive board member.

## Board Materials

Send the deck 3-5 days ahead. Structure:

1. **CEO summary** (1 page): the three things that matter, the one thing you
   need help with, candid lowlights included.
2. **Metrics dashboard**: the same KPIs every meeting so trends are visible —
   revenue, growth, burn, runway, the north-star metric.
3. **Deep dive**: one strategic topic per meeting, framed as a decision or a
   debate, not a report.
4. **Financials and cash**: runway in months, stated plainly.
5. **Asks**: specific help requests — intros, hiring, decisions.

Pre-reading means the meeting is for discussion, not narration. Spend < 20% of
the meeting presenting.

## Running the Meeting

- Open with the hardest topic while energy is high.
- Drive to decisions; capture them and owners explicitly.
- Manage the dominant voice; draw out the quiet expert.
- Reserve a closed session (founders out, or investors out) — it is healthy and
  expected.

## Managing Dynamics

- Build one-on-one relationships with each member between meetings; the meeting
  is the worst place to first surface a concern.
- Treat the board as a resource, not a judge. Bring real problems; founders who
  only present wins get less useful boards.
- Align investor directors before contentious votes; never let a split surprise
  you in the room.

## Advisory Boards (Distinct from Governance)

- Advisors have no fiduciary duty; use them for domain depth and intros.
- Structure with modest equity (0.1-1%) vesting over 1-2 years, tied to actual
  engagement.
- Hold them accountable to specific deliverables; most advisory relationships
  decay without a cadence.

## Cadence

- Monthly for early stage, shifting to every 6-8 weeks as you scale.
- Send a brief monthly update even in non-meeting months to keep no-surprises
  intact.

## Anti-Patterns

- Spin. Sophisticated boards detect it instantly and discount everything else.
- Decks built the night before — the prep is where the thinking happens.
- Asking for nothing; a board with no asks is underused.

## Deliverable

Produce a board-meeting kit: a deck outline, the standing KPI dashboard
definition, a pre-meeting one-on-one checklist, and a meeting agenda with time
boxes and a decisions-and-owners template.`,
  },
  {
    slug: "series-a-readiness",
    name: "Series A Readiness",
    category: "business",
    description: "Assesses Series A readiness: metrics, narrative, team, and data room preparation.",
    author: "community",
    featured: false, verified: true,
    tags: ["fundraising","series-a","startups"],
    install_count: 19800, rating_avg: 4.7, rating_count: 297,
    skill_content: `---
name: Series A Readiness
description: Assess and close the gaps before you open a Series A process.
---

# Series A Readiness

The Series A bar is repeatability, not just traction. Seed proved someone wants
the product; the A proves you have found a scalable, predictable engine. This
skill audits readiness across four dimensions and builds the data room.

## The Four Pillars

### 1. Metrics
The A is a metrics conversation. Know your benchmarks for your model:

- **SaaS**: roughly 1-2M ARR, growing 3x+ year-over-year, net revenue retention
  > 100%, payback < 18 months, gross margin > 70%.
- **Consumer**: strong retention curves that flatten (not decay to zero),
  organic growth share, engagement depth.
- The exact thresholds move with the market; the principle is consistent
  growth plus efficiency, not one stellar month.

### 2. Narrative
- A clear, contrarian insight (see fundraising-narrative).
- Evidence the wedge is working and the path to the next wedge.
- A category vision that justifies venture-scale returns.

### 3. Team
- Key leadership gaps identified and either filled or with a credible hiring
  plan. Investors fund the team that scales the engine, not just the founders.
- Demonstrated ability to recruit above your weight.

### 4. Data Room
A clean, complete data room signals operational maturity and shortens
diligence.

## Data Room Checklist

- **Financials**: historical P&L, balance sheet, monthly model, the next
  18-month forecast with assumptions.
- **Metrics**: cohort retention, CAC/LTV by channel and segment, pipeline,
  the KPI dashboard.
- **Cap table**: current, fully diluted, with option pool.
- **Customers**: contracts, churn log, top-account concentration, references.
- **Legal**: incorporation, IP assignments, employee agreements, prior
  financing docs.
- **Team**: org chart, key hires, comp bands.

## Readiness Audit

Rate each pillar red / yellow / green with evidence. Be brutal — a process
opened a quarter early, before metrics support the story, burns reputation with
the exact investors you want.

## Timing the Raise

- Raise from a position of strength: 6-9 months of runway and an up-and-to-the-
  right trend, not from desperation.
- Build relationships with target funds 2-3 quarters before the raise so the
  process opens warm.

## Common Gaps

- Growth without efficiency (great top line, ugly payback).
- A single channel that has already saturated.
- Founder-dependent sales with no repeatable motion.
- A messy cap table or unsigned IP assignments surfacing in diligence.

## Deliverable

Produce a readiness scorecard across the four pillars with red/yellow/green
ratings and evidence, a prioritized 90-day gap-closing plan, and a complete
data-room index with owners for each item.`,
  },
  {
    slug: "customer-success-qbr",
    name: "Customer Success QBR",
    category: "business",
    description: "Designs quarterly business reviews — value delivered, health score, expansion conversation.",
    author: "community",
    featured: false, verified: true,
    tags: ["customer-success","qbr","saas"],
    install_count: 22400, rating_avg: 4.6, rating_count: 336,
    skill_content: `---
name: Customer Success QBR
description: Run quarterly business reviews that prove value and open expansion.
---

# Customer Success QBR

A QBR is not a product demo or a support recap. It is a business conversation
that proves the value you delivered, aligns on the customer's goals, and opens
the door to expansion and renewal. Done well it is the single best retention
tool you have.

## Who Should Be in the Room

A QBR with only your champion is a status call. Get the economic buyer and the
executive sponsor present — the people who renew and expand. If you cannot get
them, that absence is itself a churn signal to escalate.

## The QBR Structure

### 1. Recap of Goals (their words)
Open with the objectives the customer set last quarter, in their language.
This reframes the meeting around their success, not your software.

### 2. Value Delivered (quantified)
The heart of the QBR. Translate usage into business outcomes:

- Tie product usage to the customer's metrics — hours saved, revenue
  influenced, cost avoided, risk reduced.
- Use their numbers, validated with them, not vanity usage stats.
- This is the evidence base for the renewal six months before it happens.

### 3. Health and Adoption
- Where adoption is strong and where it lags.
- Specific recommendations to deepen usage of underutilized features.
- Honest about blockers; co-own the plan to fix them.

### 4. Roadmap and Asks
- Preview what is coming that matters to them.
- Solicit their priorities; make them feel heard in the product direction.

### 5. The Expansion / Renewal Conversation
- When value is demonstrated, the expansion ask is natural, not pushy.
- Frame expansion as the next stage of their outcome, not an upsell.
- Surface renewal timing early so there are no last-minute surprises.

## Health Score Discipline

Bring a health score built from leading indicators, not lagging ones:

- Product adoption depth and breadth.
- Executive engagement and champion strength.
- Support sentiment and escalation history.
- Outcome attainment vs stated goals.

Use the score to decide QBR cadence and to flag at-risk accounts a quarter
before they would churn.

## Cadence and Segmentation

- High-value accounts: true quarterly QBRs with executives.
- Mid-market: semi-annual, lighter touch.
- Long-tail: digital / one-to-many programs, not live QBRs.

## Anti-Patterns

- Leading with the product roadmap instead of their outcomes.
- Surfacing renewal only at renewal time.
- Reporting usage without translating it to business value.
- No clear next steps or owners at the end.

## Deliverable

Produce a QBR template: agenda, a value-delivered slide format that maps usage
to customer outcomes, a health-score definition, and an expansion-conversation
script anchored on the customer's stated goals.`,
  },
  {
    slug: "market-sizing",
    name: "Market Sizing",
    category: "business",
    description: "Builds defensible TAM/SAM/SOM models with bottom-up and top-down triangulation.",
    author: "community",
    featured: false, verified: true,
    tags: ["strategy","market","sizing"],
    install_count: 26800, rating_avg: 4.7, rating_count: 402,
    skill_content: `---
name: Market Sizing
description: Build a credible TAM/SAM/SOM with bottom-up and top-down triangulation.
---

# Market Sizing

A market size number is only useful if it is defensible. Investors have seen a
thousand "100B TAM" slides and discount all of them. This skill builds a number
you can defend under questioning by showing your work.

## The Three Layers

- **TAM (Total Addressable Market)**: total spend if everyone who could buy,
  did, at your price. The ceiling.
- **SAM (Serviceable Addressable Market)**: the slice you can actually reach
  given product, geography, and segment.
- **SOM (Serviceable Obtainable Market)**: what you can realistically win in
  3-5 years given competition and execution. The number that matters for
  planning.

## Build Bottom-Up First

Bottom-up is the credible method; build it before you ever cite a top-down
analyst report.

TAM = (number of potential customers) × (annual contract value)

- Count customers from a real source: company databases, license counts,
  industry registries — not a guess.
- Use your actual or expected ACV, not an aspirational one.
- Segment the customer count by size; a mid-market customer and an enterprise
  pay very differently.

Bottom-up forces you to state your assumptions, which is exactly what a sharp
investor will probe.

## Triangulate Top-Down

Cross-check with top-down: take a credible total-spend figure from analyst
reports and narrow it by the addressable fraction. If bottom-up and top-down
land within ~2x of each other, you have a defensible range. If they diverge
wildly, your assumptions are wrong somewhere — find out where.

## SAM and SOM

- SAM: apply realistic filters — the segments your product actually serves, the
  geographies you operate in, the buyers you can reach.
- SOM: model market share capture over time against named competition. A 1-3%
  share of a large SAM in five years is more credible than 30% of a tiny one.

## Show the Math

The number is worthless without the assumptions. Always present:

- The customer count and its source.
- The ACV and its basis.
- The narrowing logic from TAM to SAM to SOM.
- A sensitivity range (low / base / high) on the key assumptions.

## Common Mistakes

- "1% of a huge market" — lazy and instantly discounted.
- Confusing market size with revenue opportunity for you specifically.
- Citing a single analyst report as the whole case.
- A SOM that implies implausible market share.

## When the Market Is New

If you are creating a category, size the adjacent budget you displace and the
problem's current cost (including the cost of doing nothing). New-category
sizing is about the pain, not an existing line item.

## Deliverable

Produce a sizing model with bottom-up TAM, top-down cross-check, SAM and SOM
with explicit filters, a low/base/high sensitivity, and a one-paragraph
defense of the SOM as the planning number.`,
  },
  {
    slug: "expansion-revenue",
    name: "Expansion Revenue",
    category: "business",
    description: "Designs upsell and cross-sell playbooks with triggers, talk tracks, and success metrics.",
    author: "community",
    featured: false, verified: true,
    tags: ["revenue","expansion","cs"],
    install_count: 18200, rating_avg: 4.6, rating_count: 273,
    skill_content: `---
name: Expansion Revenue
description: Build upsell and cross-sell playbooks driven by usage triggers.
---

# Expansion Revenue

In a mature SaaS business, the majority of new revenue comes from existing
customers, not new logos. Net revenue retention above 100% means you grow even
if you stop acquiring. This skill builds the systematic expansion motion.

## Why Expansion Wins

Selling more to a happy customer costs a fraction of acquiring a new one and
closes faster. Expansion revenue carries higher margin and signals product
value. A business with NRR > 120% compounds; one with NRR < 90% is a leaky
bucket no acquisition spend can fill.

## The Two Motions

- **Upsell**: more of what they have — seats, usage tiers, higher plans.
- **Cross-sell**: adjacent products or modules they do not yet own.

Upsell scales with the value metric; cross-sell scales with product breadth.
Build upsell into pricing first, then layer cross-sell as the product line
grows.

## Trigger-Based Expansion

The key to systematic expansion is triggers — signals that a customer is ready
to buy more. Instrument the product to detect them:

- **Usage approaching a limit** (seats near cap, usage near tier ceiling) — the
  highest-converting trigger.
- **New use case or team adopting** the product organically.
- **A new champion or executive sponsor** joining.
- **A milestone hit** — they achieved the outcome the product promised.
- **Feature interest** — repeated visits to a gated feature.

Route each trigger to the right motion: low-friction upsells can be self-serve
or PLG; strategic cross-sells go to the account team.

## Talk Tracks

Anchor every expansion conversation on the customer's outcome, never on your
quota:

- "You've hit [milestone]; teams at this stage usually expand to [capability]
  to [next outcome]."
- Lead with value already delivered (use the QBR data), then connect expansion
  to the next goal.
- Make the path frictionless — pre-build the quote, remove approval drag.

## Ownership and Incentives

- Decide who owns expansion: CSMs, account managers, or a hybrid. Misaligned
  ownership is the top reason expansion stalls.
- Compensate for net revenue retention, not just gross renewal, so the team is
  motivated to grow accounts, not merely keep them.

## Metrics

- **Net revenue retention** — the headline; target > 110%.
- **Expansion as % of new ARR**.
- **Trigger-to-expansion conversion rate** per trigger type.
- **Time from trigger to expansion close**.

## Anti-Patterns

- Pushing expansion before value is proven; it reads as a money grab and risks
  the renewal.
- No instrumentation, so expansion depends on the rep noticing manually.
- Comping renewal only, which makes the team defensive instead of growth-
  oriented.

## Deliverable

Produce an expansion playbook: the trigger catalog with routing rules, talk
tracks per trigger, the ownership and comp model, and the metric set led by net
revenue retention.`,
  },
  {
    slug: "churn-reduction",
    name: "Churn Reduction",
    category: "business",
    description: "Diagnoses churn root causes and designs intervention playbooks by segment.",
    author: "community",
    featured: false, verified: true,
    tags: ["churn","saas","customer-success"],
    install_count: 24100, rating_avg: 4.7, rating_count: 362,
    skill_content: `---
name: Churn Reduction
description: Diagnose churn root causes and build segmented intervention playbooks.
---

# Churn Reduction

Churn is the silent killer of SaaS — a 5% monthly churn caps your business no
matter how fast you acquire. Reducing churn is the highest-leverage retention
move because it compounds into LTV, NRR, and valuation. This skill diagnoses
causes before prescribing fixes.

## Measure It Correctly First

- **Logo churn** vs **revenue churn** — track both; a small customer leaving
  and a whale leaving are different problems.
- **Gross revenue retention** (churn + contraction only) vs **net revenue
  retention** (includes expansion). GRR isolates the leak; NRR can hide it.
- Cohort the data by signup month, segment, and channel. Blended churn averages
  away the insight.

## Diagnose Root Cause

Do not treat the symptom. Categorize every churn:

1. **Bad fit** — they were never the ICP. Fix: tighten qualification, not
   retention. Cheapest churn to eliminate (stop acquiring them).
2. **Poor onboarding** — never reached first value. Fix: time-to-value and
   activation. Often the single biggest lever.
3. **Low adoption** — bought it, never embedded it in workflow.
4. **Missing value** — used it, did not get the outcome. Fix: product or
   success motion.
5. **Champion left** — your sponsor changed jobs. Fix: multi-thread accounts.
6. **Price / budget** — economic, often macro-driven.
7. **Competitor** — lost a head-to-head. Fix: product or positioning.

Interview churned customers and read the cancellation reasons; the categories
shift your roadmap, not just your CS scripts.

## Leading Indicators

Build an early-warning system. Churn is decided months before it happens:

- Declining usage or login frequency.
- Drop in active seats.
- Champion disengagement (no QBR attendance, slow email replies).
- Support escalations or unresolved tickets.
- Failure to hit the activation milestone in onboarding.

Score accounts on these and trigger intervention before renewal, not at it.

## Intervention Playbooks by Segment

- **Onboarding churn**: a structured first-30-day activation program with a
  clear "aha" milestone.
- **Adoption churn**: usage nudges, training, executive business reviews to
  re-anchor value.
- **At-risk accounts**: a save play — executive outreach, success plan reset,
  targeted offer if economic.
- **Involuntary churn** (failed payments): dunning, card-update flows, retry
  logic. Often 20-40% of churn and the easiest to recover.

## Prioritize the Fix

Rank causes by (frequency × revenue at stake × addressability). Fixing
onboarding usually beats heroic save plays because it prevents churn at scale
rather than rescuing one account at a time.

## Metrics to Track

- Gross and net revenue retention by cohort.
- Churn by root-cause category.
- Activation rate and time-to-value.
- Save rate on at-risk interventions.

## Deliverable

Produce a churn analysis: retention by cohort and segment, root-cause
breakdown, a leading-indicator early-warning model, and prioritized
intervention playbooks ranked by frequency and revenue impact.`,
  },
  {
    slug: "product-analytics",
    name: "Product Analytics",
    category: "business",
    description: "Sets up product analytics: event taxonomy, funnel tracking, cohort analysis.",
    author: "community",
    featured: false, verified: true,
    tags: ["analytics","product","metrics"],
    install_count: 28600, rating_avg: 4.7, rating_count: 429,
    skill_content: `---
name: Product Analytics
description: Stand up product analytics with a clean event taxonomy and the right metrics.
---

# Product Analytics

You cannot improve what you do not measure, but most teams measure the wrong
things badly. A messy event taxonomy is technical debt that misleads every
decision built on it. This skill sets up analytics that actually inform product
work.

## Start With Questions, Not Events

Before instrumenting anything, write the decisions analytics must inform:

- Where do users drop off before first value?
- Which features correlate with retention?
- What does an activated user do that a churned one did not?

Instrument backward from these questions. Tracking everything "just in case"
produces noise nobody queries.

## Event Taxonomy

A disciplined naming convention is the foundation. Get it wrong and you spend a
year cleaning data.

- Use a consistent structure: object-action (e.g. \`project_created\`,
  \`invite_sent\`). Pick one convention and enforce it.
- Define properties deliberately: each event carries the context you will
  segment by (plan, source, role).
- Maintain a tracking plan — a single source of truth listing every event, its
  properties, and its owner. This is the contract between product, eng, and
  data.
- Govern changes: new events go through review so the taxonomy does not rot.

## The North Star and Inputs

- Pick one north-star metric that captures delivered value (e.g. weekly active
  teams, queries run, documents shipped) — not a vanity count.
- Decompose it into input metrics you can actually move (acquisition,
  activation, engagement, retention).

## Core Analyses

### Funnels
Map the path to first value and measure conversion at each step. The biggest
drop-off is your highest-leverage fix. Watch time-to-convert, not just rate.

### Cohort Retention
Group users by signup period and track retention over time. A healthy product
shows a retention curve that flattens (a "smile" for the best products); a
curve decaying to zero means no product-market fit yet.

### Activation
Define the activation event — the action that predicts long-term retention
(the "aha moment"). Find it by comparing what retained users did early versus
churned users. Then optimize the funnel to it.

### Feature Adoption
Track breadth (how many use a feature) and depth (how often). Correlate
adoption with retention to prioritize the roadmap.

## Avoid Vanity Metrics

- Total signups, total pageviews, cumulative anything — they only go up and
  inform nothing.
- Prefer rates and cohorts over totals; prefer leading indicators over lagging
  ones.

## Tooling and Hygiene

- Choose one analytics tool as the source of truth; pipe to a warehouse for
  deep analysis.
- Validate instrumentation regularly — silent tracking bugs corrupt every
  downstream decision.
- Document metric definitions so "active user" means the same thing to everyone.

## Deliverable

Produce an analytics plan: the decision questions, a north-star metric with
input-metric tree, an event tracking plan with naming convention, and the
priority analyses (activation funnel, cohort retention) to build first.`,
  },
  {
    slug: "growth-model",
    name: "Growth Model",
    category: "business",
    description: "Builds a growth model with acquisition loops, activation rates, and compounding projections.",
    author: "community",
    featured: false, verified: true,
    tags: ["growth","modeling","saas"],
    install_count: 22400, rating_avg: 4.6, rating_count: 336,
    skill_content: `---
name: Growth Model
description: Build a driver-based growth model with loops, not a hockey-stick guess.
---

# Growth Model

A growth model is not a revenue forecast with a hopeful curve. It is a
driver-based system that shows how inputs (traffic, conversion, retention)
compound into output (users, revenue) — and where the leverage is. This skill
builds one you can actually steer with.

## Loops, Not Funnels

Funnels are linear and leak. Loops compound — the output of one cycle feeds the
input of the next. The most defensible growth comes from loops:

- **Viral loop**: users invite users (each new user brings k more).
- **Content loop**: usage creates content that attracts new users (SEO,
  user-generated pages).
- **Paid loop**: revenue funds acquisition that funds more revenue (works only
  if payback < cycle time).
- **Sales loop**: customers refer or expand, funding more sales capacity.

Identify which loop is your primary engine. A business with no loop rents all
its growth and stalls when spend stops.

## Model Structure

Build the model from drivers, top to bottom:

1. **Acquisition**: new users per period, split by channel, each with its own
   volume and cost.
2. **Activation**: the % who reach first value. A small activation gain
   multiplies everything downstream.
3. **Retention**: the % who stay each period — the single most powerful input
   because it compounds.
4. **Monetization**: revenue per retained user, including expansion.
5. **Referral / loop factor**: how many new users each user generates.

Output = the compounding interaction of these, period over period.

## Why Retention Dominates

Run the sensitivity: a 5-point improvement in monthly retention usually beats a
20% increase in acquisition over a 12-month horizon, because retention
compounds while acquisition is a one-time add. Model this explicitly so the
team invests where leverage is, not where it feels busy.

## Building the Projection

- Use real cohort data for retention and activation, not assumptions, wherever
  you have it.
- Project bottom-up from drivers; never draw the output curve first and
  back-fill.
- Show base / upside / downside scenarios by flexing the two or three most
  sensitive drivers.
- Tie the model to the growth instrumentation (see product-analytics) so it
  updates with reality.

## Using the Model

- Identify the constraint: the one driver that, if improved, unlocks the most
  growth. Focus the roadmap there.
- Set targets per driver, not just a top-line number, so teams own inputs they
  control.
- Re-forecast monthly against actuals; a model that is not compared to reality
  is fiction.

## Anti-Patterns

- A spreadsheet that grows revenue by a fixed % with no driver behind it.
- Ignoring retention decay — assuming everyone you acquire stays forever.
- Modeling a loop factor above 1 without evidence (true sustained virality is
  rare).

## Deliverable

Produce a driver-based growth model: the primary growth loop identified, the
acquisition / activation / retention / monetization / referral inputs, a
12-month projection with base/upside/downside, and the named constraint to
focus on next.`,
  },
  {
    slug: "due-diligence-checklist",
    name: "Due Diligence Checklist",
    category: "business",
    description: "Runs through commercial, financial, technical, and legal due diligence for investments.",
    author: "community",
    featured: false, verified: true,
    tags: ["due-diligence","investing","startup"],
    install_count: 16800, rating_avg: 4.6, rating_count: 252,
    skill_content: `---
name: Due Diligence Checklist
description: Run structured commercial, financial, technical, and legal diligence.
---

# Due Diligence Checklist

Diligence is about disconfirming the thesis, not confirming it. The goal is to
find the reason not to invest before you wire the money. This skill structures
the four workstreams and the killer questions in each.

## Mindset

Enter assuming the deal is flawed and look for the flaw. Confirmation bias
kills returns — founders are persuasive and decks are polished. Diligence is
where you earn your skepticism.

## 1. Commercial Diligence

The market and the right to win.

- **Market**: real size (validate the TAM bottom-up, see market-sizing),
  growth rate, and whether timing is right.
- **Customers**: talk to real ones. Why did they buy, would they recommend,
  what would make them leave? Reference calls are the single most informative
  step.
- **Competition**: who else solves this, and why this company wins.
- **Moat**: what protects the business as it scales (see competitive-moat).
- **Unit economics**: CAC, LTV, payback validated from raw data, not the deck.

## 2. Financial Diligence

The numbers behind the story.

- Reconcile reported revenue to bank statements and contracts — confirm it is
  real, recurring, and recognized correctly.
- Quality of revenue: concentration, churn, contract length, one-time vs
  recurring.
- Burn rate and runway; the real cash position.
- The forecast's assumptions — are they grounded or aspirational?
- Cap table: ownership, option pool, any unusual preferences or debt.

## 3. Technical Diligence

For technology investments.

- Architecture scalability and key technical risk.
- Code and infrastructure health; tech debt that will slow the roadmap.
- Security and data-handling posture; compliance exposure (privacy, regulated
  data).
- Team's engineering depth and key-person risk.
- IP ownership — confirm all code is assigned to the company.

## 4. Legal Diligence

The structural landmines.

- Clean incorporation and cap table.
- IP assignments signed by all founders, employees, and contractors (a frequent
  gap that can sink a deal).
- Material contracts and any change-of-control clauses.
- Litigation, regulatory issues, outstanding liabilities.
- Employment compliance and any co-founder disputes.

## Synthesis

- Score each workstream and list every red flag found.
- Distinguish deal-killers (fraud, broken cap table, no real moat) from
  manageable risks (fixable with a board condition or a covenant).
- Tie findings back to the original thesis: does it still hold?

## Red Flags

- Revenue that will not reconcile to cash.
- Unsigned IP assignments or contested ownership.
- Customer concentration above ~25% in one account.
- Founders evasive on a specific topic — follow the evasion.

## Deliverable

Produce a diligence report: findings by workstream, a red-flag register split
into deal-killers vs manageable risks, the validated unit economics, and a
go / no-go recommendation tied to the original investment thesis.`,
  },
  {
    slug: "partnership-strategy",
    name: "Partnership Strategy",
    category: "business",
    description: "Identifies and structures partnerships: co-marketing, technology, distribution, OEM.",
    author: "community",
    featured: false, verified: true,
    tags: ["partnerships","strategy","business"],
    install_count: 14200, rating_avg: 4.5, rating_count: 213,
    skill_content: `---
name: Partnership Strategy
description: Identify, prioritize, and structure partnerships that actually move the needle.
---

# Partnership Strategy

Most partnerships are press releases that produce nothing. A real partnership
creates measurable value for both sides and has an owner accountable for
outcomes. This skill separates strategic partnerships from logo-swap theater.

## Partnership Types

- **Co-marketing**: shared content, events, audiences. Low commitment, fast,
  modest upside.
- **Technology / integration**: your product connects to theirs, increasing
  stickiness and reach. Often the highest ROI for software.
- **Distribution / channel**: they sell or resell your product to their
  customers. High ceiling, slow to build, needs enablement.
- **OEM / embed**: your product is built into theirs, white-labeled. Deep,
  durable, but you cede the customer relationship.

Match the type to your goal. Need awareness? Co-marketing. Need reach into a
locked market? Distribution. Need stickiness? Integration.

## Strategic Fit Test

Before pursuing any partner, confirm:

1. **Shared customer, non-competing product** — you serve the same buyer
   without cannibalizing each other.
2. **Mutual value** — both sides get something they cannot easily build alone.
   One-sided partnerships die quietly.
3. **Strategic, not opportunistic** — it advances your distribution or product
   strategy, not just a logo for the website.
4. **Capacity to execute** — both sides can actually staff it.

## Structuring the Deal

- Define the value exchange concretely: who provides what, who gets what.
- Set economics where money moves: revenue share, referral fees, co-sell
  splits. Get the incentive right or the partner's reps will ignore you.
- Agree on success metrics up front — leads, sourced revenue, integrations
  adopted — with a review cadence.
- Start with a lightweight pilot before a deep contractual commitment; prove
  the motion works.

## Making Partnerships Produce

The reason partnerships fail is almost never the contract; it is the lack of an
operating motion:

- Name an owner on each side accountable for the number.
- Enable the partner's team: training, collateral, a clear pitch. An untrained
  partner sales force sells nothing.
- Create a regular sync and a shared pipeline view.
- Make it easy: the lower the friction for their reps, the more they sell.

## Prioritization

You cannot pursue every partnership. Score candidates on (reach × fit × ease of
execution) and concentrate on the few that could materially move your numbers.
One deep partnership beats ten shallow MOUs.

## Anti-Patterns

- Signing partnerships for the press release with no operating plan.
- No economic incentive for the partner's sales team.
- No owner, so it becomes nobody's job after the announcement.
- Pursuing a logo whose customers are not your buyers.

## Deliverable

Produce a partnership plan: target partners scored on reach/fit/ease, the
recommended partnership type per target, a deal structure with value exchange
and economics, success metrics, and the operating motion with named owners.`,
  },
  {
    slug: "revenue-operations",
    name: "Revenue Operations",
    category: "business",
    description: "Aligns sales, marketing, and CS around a unified revenue funnel with shared metrics.",
    author: "community",
    featured: false, verified: true,
    tags: ["revops","saas","operations"],
    install_count: 19600, rating_avg: 4.6, rating_count: 294,
    skill_content: `---
name: Revenue Operations
description: Unify marketing, sales, and CS around one funnel, one data model, shared metrics.
---

# Revenue Operations

RevOps exists because marketing, sales, and customer success usually optimize
their own metrics while the customer experience and the revenue number fall
through the cracks between them. This skill aligns the three functions around
one funnel, one source of truth, and shared accountability.

## The Core Problem

- Marketing is measured on leads, so it sends volume.
- Sales is measured on closed deals, so it cherry-picks.
- CS is measured on renewals, so it inherits bad-fit customers.

Each team is locally optimal and globally broken. RevOps fixes the seams.

## One Funnel, One Definition

Define the full revenue funnel end to end and get all three teams to agree on
stage definitions:

- Lead -> MQL -> SQL -> Opportunity -> Closed -> Onboarded -> Renewed/Expanded.
- Write down exactly what qualifies a lead to move stages. Most pipeline
  disputes are definitional, not real.
- Agree on the hand-off criteria between teams (the SLA): what marketing owes
  sales, what sales owes CS.

## One Source of Truth

- A single CRM/data model that all teams use; no shadow spreadsheets.
- Clean, governed data — deduped accounts, consistent fields, enforced hygiene.
  Bad data quietly corrupts every report and forecast.
- Instrument the funnel so every stage conversion and velocity is measurable.

## Shared Metrics and Accountability

Replace siloed vanity metrics with shared revenue metrics:

- **Pipeline coverage** (pipeline vs target) across the whole funnel.
- **Stage conversion rates** and **velocity** — where deals stall.
- **CAC and payback** (ties marketing and sales to efficiency, not just
  volume).
- **Net revenue retention** (ties CS and sales to expansion).
- Give teams shared goals at the seams: marketing partly on pipeline-sourced
  revenue, not just leads; sales partly on quality of accounts passed to CS.

## Forecasting

- Build a forecast from the pipeline data, weighted by stage conversion, not
  from rep optimism.
- Track forecast accuracy and tighten the model each quarter.
- Run a single revenue forecast all three leaders sign up to.

## Process and Tooling

- Map the lead-to-cash process and remove manual handoffs that lose deals.
- Automate routing, enrichment, and alerts so reps spend time selling, not
  data-entering.
- Keep the tech stack consolidated; tool sprawl recreates the silos RevOps
  removes.

## Operating Cadence

- Weekly pipeline review across functions.
- Monthly funnel-health review (conversion, velocity, leakage).
- Quarterly planning that allocates targets across the unified funnel.

## Anti-Patterns

- Teams keeping private metrics that contradict the shared dashboard.
- Optimizing lead volume over lead quality.
- A forecast based on rep gut rather than pipeline math.

## Deliverable

Produce a RevOps blueprint: the unified funnel with stage definitions and
hand-off SLAs, the shared-metric set, a single-source-of-truth data model, a
weighted forecasting method, and the cross-functional operating cadence.`,
  },
  {
    slug: "employment-contract",
    name: "Employment Contract Review",
    category: "business",
    description: "Flags non-standard clauses in employment contracts: non-competes, IP assignment, severance.",
    author: "community",
    featured: false, verified: true,
    tags: ["legal","hr","employment"],
    install_count: 17800, rating_avg: 4.6, rating_count: 267,
    skill_content: `---
name: Employment Contract Review
description: Flag non-standard and risky clauses in employment agreements.
---

# Employment Contract Review

An employment contract is where a lot of risk hides in standard-looking
boilerplate. This skill walks the key clauses, flags what deviates from market
norms, and frames the negotiation. It is not legal advice — material concerns
go to a qualified employment lawyer.

## How to Read a Contract

Read it as the party with less power. Every clause that is vague, broad, or
one-sided favors the drafter (usually the employer). Your job is to surface
those and ask whether they are standard or aggressive.

## Compensation and Equity

- **Base, bonus, and variable**: confirm the bonus is defined, not purely
  discretionary, and the conditions to earn it.
- **Equity**: grant size, vesting schedule (4-year with 1-year cliff is
  standard), strike price, and what happens on termination or acquisition.
- **Acceleration**: single-trigger (vests on acquisition) vs double-trigger
  (acquisition + termination). Double-trigger is market-standard.
- **Exercise window**: the post-termination period to exercise options. The
  90-day default can be punishing; extended windows are increasingly common.

## Restrictive Covenants (highest-risk area)

- **Non-compete**: scope, duration, and geography. Broad, long, worldwide
  non-competes are red flags and unenforceable in some jurisdictions — flag for
  legal review.
- **Non-solicit**: of customers and of employees. Check duration and breadth.
- **IP assignment**: confirm it covers work-related IP but does NOT sweep in
  prior inventions or unrelated personal projects. Look for a carve-out and a
  prior-inventions schedule.
- **Confidentiality**: reasonable scope and duration; perpetual obligations on
  ordinary information are overbroad.

## Termination and Severance

- Notice period both ways.
- Definition of "cause" — a vague or expansive cause definition lets the
  employer fire without severance; push for a tight, objective definition.
- Severance terms and what triggers them.
- "Good reason" / constructive-dismissal protections.

## Other Clauses to Watch

- **Clawbacks** on bonus or equity.
- **Change-of-control** treatment.
- **Governing law and dispute resolution** — mandatory arbitration waives your
  right to sue; flag it.
- **Assignment** — can the employer move your contract to another entity?

## Negotiation Guidance

- Prioritize: equity acceleration, exercise window, cause definition, and
  non-compete scope usually matter most.
- Frame asks as alignment ("standard double-trigger so we are aligned on
  outcomes"), not adversarially.
- Get every verbal promise into the written contract; side conversations are
  unenforceable.

## Red Flags Summary

- Broad/long non-compete; IP assignment with no prior-inventions carve-out;
  vague "cause"; discretionary bonus with no definition; 90-day exercise with
  no flexibility.

## Deliverable

Produce a clause-by-clause review table: clause, what it says, market-standard
position, deviation flagged (yes/no), and a recommended ask — with a clear note
that material legal concerns require a licensed employment attorney.`,
  },
  {
    slug: "annual-plan",
    name: "Annual Planning",
    category: "business",
    description: "Structures annual planning cycles: priorities, OKRs, resource allocation, and CEO memo.",
    author: "community",
    featured: false, verified: true,
    tags: ["planning","strategy","leadership"],
    install_count: 21200, rating_avg: 4.7, rating_count: 318,
    skill_content: `---
name: Annual Planning
description: Run an annual planning cycle that produces focus, alignment, and OKRs.
---

# Annual Planning

Annual planning fails when it becomes a budget exercise disconnected from
strategy, or a wish-list with no prioritization. Done well, it produces a small
set of priorities the whole company can rally behind. This skill structures the
cycle end to end.

## Start With Strategy, Not the Calendar

Before any goals, answer the strategic questions:

- Where are we now, honestly? (Reflect on last year: what worked, what did not,
  what surprised us.)
- What is the single most important thing we must achieve this year to win?
- What are we explicitly NOT doing? A plan with no "no" is not a plan.

The output of this stage is a point of view, not a spreadsheet.

## The Planning Cadence

A typical 6-8 week cycle:

1. **Leadership offsite**: agree the strategic context and the 3-5 company
   priorities for the year.
2. **Top-down framing**: leadership publishes the priorities and rough resource
   envelope.
3. **Bottom-up planning**: teams propose how they will contribute, with OKRs
   and resource needs.
4. **Reconciliation**: align top-down ambition with bottom-up capacity; cut
   until it is realistic.
5. **Finalize and communicate**: lock OKRs, budget, and the CEO memo.

The bottom-up step matters — plans imposed top-down get compliance, not
commitment.

## Setting OKRs

- **Objectives**: qualitative, ambitious, memorable — what we want to achieve.
- **Key Results**: measurable outcomes that prove the objective, not a task
  list. "Ship feature X" is a task; "Increase activation to 40%" is a KR.
- Limit to 3-5 objectives at the company level; more means no focus.
- Cascade so every team's OKRs ladder up to a company priority. If a team's
  work maps to none, question whether it should be funded.

## Resource Allocation

- Allocate people and budget to the priorities deliberately; if everything is
  funded, nothing is prioritized.
- Run the trade-offs explicitly: to fund priority A, what gets cut or delayed?
- Leave slack — a fully-committed plan has no room for the year's surprises.

## The CEO Memo

Cap the cycle with a written narrative memo (not just slides):

- The strategic context and why these priorities.
- The 3-5 priorities and what success looks like.
- What we are deliberately not doing and why.
- How resources are allocated to match.

A written memo forces clarity that bullet points let you dodge, and it becomes
the reference all year.

## Keeping It Alive

- Review OKRs quarterly; grade them honestly and re-plan as reality shifts.
- Make priorities visible — the plan should be referenced in everyday
  decisions, not filed away.

## Anti-Patterns

- Too many priorities (focus dies).
- KRs that are tasks, not outcomes.
- A plan that is never revisited until next year's cycle.
- Budget-led planning with strategy bolted on afterward.

## Deliverable

Produce an annual plan package: the strategic reflection, 3-5 company
priorities with cascaded OKRs, a resource-allocation view with explicit
trade-offs, a quarterly review cadence, and the CEO narrative memo.`,
  },
  {
    slug: "habit-builder",
    name: "Habit Builder",
    category: "personal",
    description: "Designs habit stacks using cue-routine-reward with implementation intentions and tracking.",
    author: "community",
    featured: false, verified: true,
    tags: ["habits","behavior","personal"],
    install_count: 34800, rating_avg: 4.7, rating_count: 520,
    skill_content: `---
name: Habit Builder
description: Design durable habits with cue-routine-reward loops, implementation intentions, and lightweight tracking.
---

# Habit Builder

Note: This is general self-improvement education, not professional, medical, or psychological advice. Consult a qualified professional for clinical concerns.

Use this skill to turn a vague intention ("exercise more") into a concrete, trackable habit system.

## 1. Define the target behavior
Make it specific and small. Bad: "read more." Good: "read one page after I pour my morning coffee."
Ask the user:
- What is the smallest version of this habit that still counts? (the "two-minute rule")
- What identity does this habit reinforce? ("I am someone who reads daily")

## 2. Map the habit loop
Every habit has four parts. Fill each one in explicitly:
- Cue: the trigger that starts the behavior (time, location, preceding action, emotional state).
- Craving: the motivation or anticipated reward.
- Routine: the action itself, kept minimal.
- Reward: the satisfying payoff that closes the loop.

## 3. Write an implementation intention
Use the format: "I will [BEHAVIOR] at [TIME] in [LOCATION]."
Example: "I will meditate for 2 minutes at 7:00am in my bedroom."
Specificity dramatically increases follow-through versus a generic goal.

## 4. Stack the habit
Anchor the new habit to a stable existing routine:
"After I [CURRENT HABIT], I will [NEW HABIT]."
Example: "After I brush my teeth at night, I will lay out tomorrow's workout clothes."
Chain no more than one new habit per anchor at first.

## 5. Design the environment
- Make good habits obvious: put the cue in your line of sight (book on pillow, water bottle on desk).
- Make them easy: reduce friction (gym bag packed the night before).
- Make bad habits invisible and hard: remove the cue, add friction (log out of distracting apps).

## 6. Track without perfectionism
Use a simple streak tracker (calendar X's or a habit app).
- Never miss twice. One miss is an accident; two starts a new (bad) pattern.
- Track the action, not the outcome. "Did I show up?" beats "Did I hit my goal?"

## 7. Review weekly
Each week, ask:
- Did I complete the habit at least 5 of 7 days?
- Was the cue reliable? If not, pick a stronger anchor.
- Was the routine too big? Shrink it until it is effortless.
- Is the reward still satisfying? If not, add an immediate reinforcement.

## 8. Scale gradually
Once a habit is automatic (typically 4-8 weeks), increase difficulty by ~10% or add a second stacked habit. Avoid scaling more than one habit at a time.

## Output for the user
Produce a one-page plan containing: the implementation intention, the habit stack sentence, the environment changes, the tracking method, and the weekly review questions.`,
  },
  {
    slug: "sleep-optimizer",
    name: "Sleep Optimizer",
    category: "personal",
    description: "Creates personalized sleep protocols based on chronotype, environment, and recovery goals.",
    author: "community",
    featured: false, verified: true,
    tags: ["sleep","health","wellness"],
    install_count: 28400, rating_avg: 4.6, rating_count: 430,
    skill_content: `---
name: Sleep Optimizer
description: Build a personalized sleep protocol from chronotype, light exposure, environment, and recovery goals.
---

# Sleep Optimizer

Note: This is general wellness education, not medical advice. If you have insomnia, sleep apnea, or other persistent sleep problems, consult a licensed physician or sleep specialist.

## 1. Assess the baseline
Ask the user for:
- Typical bedtime and wake time (weekday vs weekend).
- Time to fall asleep and number of night wakings.
- Caffeine, alcohol, and screen habits in the evening.
- Energy dips and peaks across the day.

## 2. Identify chronotype
Roughly classify as early (lark), intermediate, or late (owl) based on natural wake time when unconstrained. Align the target schedule with the chronotype where life allows, rather than forcing an unnatural schedule.

## 3. Set a consistent sleep window
- Pick a fixed wake time and hold it every day, including weekends (within ~30 minutes).
- Count back 7.5-9 hours to set the target bedtime.
- Consistency of wake time is the single strongest lever.

## 4. Manage light
- Morning: get 10-30 minutes of bright/outdoor light within an hour of waking to anchor the circadian clock.
- Evening: dim lights and reduce blue light 1-2 hours before bed.
- Keep the bedroom dark; use blackout curtains or an eye mask.

## 5. Optimize the environment
- Temperature: cool room, roughly 16-19C (60-67F).
- Noise: use earplugs or steady white noise if needed.
- Bed is for sleep only; remove work and avoid scrolling in bed.

## 6. Tune inputs
- Caffeine: none within 8-10 hours of bedtime (caffeine half-life is long).
- Alcohol: fragments sleep; keep it modest and not close to bedtime.
- Large meals: finish 2-3 hours before bed.
- Exercise: helpful, but vigorous sessions are best earlier in the day.

## 7. Build a wind-down routine
A 30-60 minute buffer of low-stimulation activities: reading, stretching, a warm shower, journaling. The routine becomes a cue that signals sleep.

## 8. Handle wakefulness
- If awake more than ~20 minutes, get up and do something calm in dim light, then return when sleepy.
- Avoid clock-watching, which raises anxiety.

## 9. Recovery goals
For athletic or cognitive recovery, prioritize total sleep duration and regularity. Consider a short early-afternoon nap (10-20 min) only if it does not harm nighttime sleep.

## 10. Review
After 2 weeks, compare sleep latency, wakings, and morning energy. Adjust one variable at a time.

## Output for the user
Deliver a protocol with: fixed wake time, target bedtime, light plan, environment checklist, evening input rules, and the wind-down sequence.`,
  },
  {
    slug: "study-system",
    name: "Study System",
    category: "personal",
    description: "Applies spaced repetition, active recall, and interleaving to any learning curriculum.",
    author: "community",
    featured: false, verified: true,
    tags: ["learning","study","productivity"],
    install_count: 31200, rating_avg: 4.8, rating_count: 560,
    skill_content: `---
name: Study System
description: Apply spaced repetition, active recall, and interleaving to learn any curriculum efficiently.
---

# Study System

Use this skill to convert a syllabus or topic list into an evidence-based study plan.

## 1. Clarify the target
Ask:
- What is being learned and by when (exam, project, fluency level)?
- How will success be tested (recall, application, performance)?
- Hours per week available?

## 2. Break the material into atoms
Decompose the curriculum into small, testable units (concepts, formulas, vocabulary, procedures). Each atom should be answerable in one question.

## 3. Active recall over rereading
Replace passive rereading and highlighting with retrieval:
- After reading a section, close the material and write/say what you remember.
- Turn notes into questions, not summaries.
- Use the Feynman technique: explain the concept in plain language as if teaching a beginner; gaps reveal what to restudy.

## 4. Spaced repetition
Schedule reviews at expanding intervals so each item is revisited just before it would be forgotten.
- A practical schedule: review at 1 day, 3 days, 7 days, 16 days, 35 days.
- Use a flashcard app with a spaced algorithm, or a manual Leitner box of physical cards moving through boxes.
- Cards that are missed reset to the shortest interval.

## 5. Interleaving
Mix related topics within a study session rather than blocking one topic at a time. Interleaving feels harder but improves the ability to choose the right method on a test.
Example: alternate problem types instead of doing 20 of the same type in a row.

## 6. Practice testing
- Do full practice problems and past exams under realistic conditions.
- Grade honestly and log every error with its cause (concept gap, careless, misread).
- Restudy only the items you missed.

## 7. Manage cognitive load
- Study in focused blocks (e.g., 25-50 minutes) with short breaks.
- Sleep consolidates memory; review lightly before bed and re-test in the morning.
- Avoid cramming; distribute sessions across days.

## 8. Weekly review loop
Each week:
- What proportion of cards/questions am I answering correctly?
- Which atoms keep failing? Rewrite those cards more clearly.
- Is the schedule realistic, or do I need to cut scope?

## Output for the user
Produce: the atomized topic list, a flashcard plan with intervals, an interleaved weekly schedule, and a practice-testing cadence with an error log template.`,
  },
  {
    slug: "journal-framework",
    name: "Journal Framework",
    category: "personal",
    description: "Designs a journaling practice with morning pages, gratitude, and evening reflection prompts.",
    author: "community",
    featured: false, verified: true,
    tags: ["journaling","reflection","personal"],
    install_count: 22800, rating_avg: 4.5, rating_count: 340,
    skill_content: `---
name: Journal Framework
description: Build a sustainable journaling practice combining morning pages, gratitude, and evening reflection.
---

# Journal Framework

Note: Journaling supports general wellbeing but is not a substitute for therapy or mental-health care. If you are struggling, reach out to a licensed professional.

## 1. Choose the medium
Paper or digital both work. Pick whichever you will actually open daily. Keep it within arm's reach of where the habit will live (bedside, desk).

## 2. Morning pages (5-15 min)
On waking, write freely without editing or judging. The goal is to clear mental clutter, not produce good prose.
Prompts when stuck:
- What is on my mind right now?
- What am I avoiding?
- What would make today a good day?

## 3. Gratitude (2-3 min)
List 3 specific things you are grateful for. Specificity matters: "my friend called to check in" beats "my friends." Vary the items to avoid autopilot. Occasionally note WHY each one matters.

## 4. Intention setting
Pick one to three priorities for the day. Frame as outcomes or as how you want to show up:
- Top priority: ___
- How I want to feel/act: ___

## 5. Evening reflection (5-10 min)
At day's end, review:
- What went well today, and what was my part in it?
- What drained me or went poorly, and what can I learn?
- One thing I will do differently tomorrow.

## 6. Weekly and monthly review
- Weekly: skim the week's entries; note recurring themes, wins, and stressors.
- Monthly: identify patterns, celebrate progress, and reset goals.

## 7. Prompt library for variety
Rotate deeper prompts to avoid staleness:
- What belief is no longer serving me?
- When did I feel most alive recently?
- What am I tolerating that I could change?
- Who do I want to thank, and have I told them?

## 8. Keep it frictionless
- Set a tiny minimum (even two sentences counts).
- Anchor it to an existing habit (after coffee, before lights out).
- Never aim for perfect entries; consistency beats eloquence.

## 9. Protect privacy
Keep the journal private so you write honestly. If digital, use a passcode or encrypted note app.

## Output for the user
Deliver a daily template (morning pages, gratitude, intentions, evening reflection), a rotating prompt list, and a weekly review checklist.`,
  },
  {
    slug: "salary-negotiation",
    name: "Salary Negotiation",
    category: "personal",
    description: "Scripts salary and offer negotiations with anchoring, BATNA preparation, and timing.",
    author: "community",
    featured: false, verified: true,
    tags: ["career","negotiation","salary"],
    install_count: 29400, rating_avg: 4.7, rating_count: 470,
    skill_content: `---
name: Salary Negotiation
description: Prepare and script salary and offer negotiations using anchoring, BATNA, and timing.
---

# Salary Negotiation

Note: This is general career education, not legal or financial advice. Employment law and norms vary by location and contract.

## 1. Research the market
Before any conversation, gather data:
- Salary ranges for the role, level, and location (multiple sources).
- The company's pay bands if discoverable.
- Total compensation: base, bonus, equity, signing bonus, benefits.
Set three numbers: your target (ambitious but justified), your walk-away minimum, and a reach anchor above target.

## 2. Define your BATNA
Your Best Alternative To a Negotiated Agreement is your source of power. Strengthen it:
- Pursue multiple offers in parallel when possible.
- Know your current situation's value (staying is an alternative).
A strong BATNA lets you negotiate calmly and decline bad offers.

## 3. Control timing
- Never name a number first if you can deflect: "I'd like to understand the full role before discussing compensation."
- If pressed for a number, give a researched range anchored at or above your target.
- Negotiate after you have the offer and they want you, not before.

## 4. Anchor high (but defensible)
The first concrete number frames the discussion. Anchor at the top of your researched range with a brief justification tied to value and market data, not personal need.

## 5. Scripts
Initial deflection:
"I'm really excited about this role. I'd love to learn more about the team's goals before we talk numbers."

Counter to an offer:
"Thank you for the offer. Based on my research for this level and the scope of the role, I was targeting [X]. Can we get to [X]?"

Handling "that's our max":
"I understand base may be fixed. Could we look at signing bonus, equity, or an early review at [date]?"

## 6. Negotiate the whole package
If base is capped, trade on: signing bonus, equity, title, start date, remote flexibility, professional development budget, vacation, and a 6-month review.

## 7. Stay collaborative
Frame it as solving a shared problem ("how do we make this work?") rather than a fight. Be warm, firm, and silent after stating your number; let them respond.

## 8. Get it in writing
Confirm the final agreed terms in email before resigning anything. Verbal promises are not binding.

## Output for the user
Produce: a target/minimum/anchor table, a BATNA summary, tailored scripts for each stage, and a list of non-base levers to trade.`,
  },
  {
    slug: "networking-system",
    name: "Networking System",
    category: "personal",
    description: "Builds a systematic professional network: outreach, follow-up cadence, and relationship maintenance.",
    author: "community",
    featured: false, verified: true,
    tags: ["networking","career","relationships"],
    install_count: 24600, rating_avg: 4.5, rating_count: 360,
    skill_content: `---
name: Networking System
description: Build and maintain a professional network with structured outreach, follow-up cadence, and upkeep.
---

# Networking System

Use this skill to turn networking from awkward, sporadic effort into a calm, repeatable system built on genuine relationships.

## 1. Define goals
Clarify why you are networking: job search, learning, partnerships, mentorship, or visibility. Goals shape who you reach out to and what you ask for.

## 2. Map your network in tiers
- Tier 1: close contacts you can reach anytime.
- Tier 2: warm acquaintances worth nurturing.
- Tier 3: aspirational contacts you want to meet.
Keep a simple CRM (spreadsheet or contacts app) with name, context, last touch, and next action.

## 3. Lead with generosity
Give before you ask. Share a useful article, make an introduction, offer feedback, or congratulate a milestone. Relationships compound when you are a net giver.

## 4. Outreach templates
Cold but warm intro:
"Hi [Name], I admired your work on [specific thing]. I'm exploring [topic] and would value 15 minutes of your perspective. No worries if the timing isn't right."

Reconnect:
"Hi [Name], it's been a while since [shared context]. I came across [thing relevant to them] and thought of you. How have you been?"

Keep messages short, specific, and easy to say yes to.

## 5. Run good conversations
- Prepare 2-3 thoughtful questions.
- Listen more than you talk; ask about their challenges.
- Close with a clear, small next step and a thank-you.

## 6. Follow-up cadence
- Within 24 hours: send a thank-you noting one specific takeaway.
- Tier 1: meaningful touch every 1-2 months.
- Tier 2: every quarter.
- Tier 3: when you have genuine value to offer.
Batch a weekly 30-minute "relationship hour" to send touches.

## 7. Track and remember
Log personal details (kids' names, interests, goals) so future messages feel personal, not transactional. Set reminders for birthdays and follow-ups.

## 8. Maintain, don't only mine
Stay in touch when you need nothing. The strongest networks are built before you need them.

## Output for the user
Deliver: a tiered contact tracker template, outreach and reconnect scripts, a follow-up cadence calendar, and a weekly relationship-hour routine.`,
  },
  {
    slug: "decision-making",
    name: "Decision Making",
    category: "personal",
    description: "Applies pre-mortem, second-order thinking, and decision journals to important choices.",
    author: "community",
    featured: false, verified: true,
    tags: ["decisions","thinking","mental-models"],
    install_count: 26200, rating_avg: 4.7, rating_count: 410,
    skill_content: `---
name: Decision Making
description: Make better high-stakes decisions with pre-mortems, second-order thinking, and decision journals.
---

# Decision Making

Use this skill for important, hard-to-reverse choices where a structured process beats gut instinct.

## 1. Classify the decision
- Reversible and low-stakes: decide fast, do not over-analyze.
- Irreversible or high-stakes: slow down and use the full process below.

## 2. Frame the real question
State the decision precisely and surface hidden assumptions:
- What exactly am I deciding?
- What problem is this solving, and is it the right problem?
- What are the actual options (avoid false binaries; generate a third option)?

## 3. Define criteria up front
List what matters and weight it before evaluating options, so you do not rationalize a favorite afterward. Separate must-haves from nice-to-haves.

## 4. Second-order thinking
Ask "and then what?" Trace consequences beyond the immediate effect:
- First order: the obvious result.
- Second order: the result of that result.
- Third order: longer-term and systemic effects.
Many bad decisions look good only at first order.

## 5. Run a pre-mortem
Imagine it is a year later and the decision failed badly. Write the story of why.
- What were the warning signs?
- What did we overlook?
Then mitigate the top risks before committing. This counters optimism bias.

## 6. Check for biases
- Confirmation bias: actively seek disconfirming evidence.
- Sunk cost: ignore past spend; decide on future value.
- Anchoring: question the first number or framing.
- Overconfidence: assign honest probabilities and a confidence range.

## 7. Inversion
Instead of "how do I succeed?", ask "what would guarantee failure?" and avoid those things. Inverting often reveals clearer action.

## 8. Keep a decision journal
For each significant decision, record:
- The date and the decision.
- What you expected to happen and your confidence.
- The reasoning and key assumptions.
- How you felt (tired, rushed, emotional).
Review months later to separate good decisions from lucky outcomes and to calibrate judgment.

## 9. Decide and commit
After due diligence, set a deadline, make the call, and commit fully. Endless analysis is itself a costly choice.

## Output for the user
Produce: the decision framing, weighted criteria, a second-order consequence map, a pre-mortem risk list with mitigations, and a decision-journal entry template.`,
  },
  {
    slug: "stress-management",
    name: "Stress Management",
    category: "personal",
    description: "Designs a personalized stress toolkit: triggers, interventions, recovery, and prevention.",
    author: "community",
    featured: false, verified: true,
    tags: ["stress","wellness","mental-health"],
    install_count: 31800, rating_avg: 4.6, rating_count: 520,
    skill_content: `---
name: Stress Management
description: Build a personalized stress toolkit covering triggers, in-the-moment interventions, recovery, and prevention.
---

# Stress Management

Note: This is general wellness education, not medical or mental-health treatment. If stress is severe, persistent, or affecting your safety, please contact a licensed professional or a crisis line.

## 1. Identify triggers
Track stress for a week. For each spike, note:
- The situation and time.
- Physical signs (tight chest, shallow breath, clenched jaw).
- Thoughts running through your head.
Patterns reveal whether stress is from workload, relationships, finances, uncertainty, or self-talk.

## 2. Separate controllable from uncontrollable
For each trigger, sort into: things you can change, things you can influence, and things you can only accept. Direct energy to the first two; practice acceptance for the third.

## 3. In-the-moment interventions
Have fast tools ready for acute stress:
- Physiological sigh: two inhales through the nose, one long exhale; repeat for a minute to calm the nervous system.
- Box breathing: inhale 4, hold 4, exhale 4, hold 4.
- Grounding: name 5 things you see, 4 you hear, 3 you feel.
- Brief movement: a short walk discharges stress hormones.

## 4. Reframe the thought
Stress is amplified by interpretation. Ask:
- Is this thought true, or a worst-case story?
- What would I tell a friend in this situation?
- Will this matter in a week, a year?

## 5. Recovery practices
Build deliberate recovery into the day and week:
- Micro-breaks every 60-90 minutes.
- Time in nature and daylight.
- Connection with people who restore you.
- Hobbies and play that produce flow.

## 6. Prevention and resilience
Lower your baseline stress load:
- Sleep: protect 7-9 hours.
- Movement: regular exercise buffers stress.
- Nutrition and hydration: avoid running on caffeine alone.
- Boundaries: learn to say no and protect focus time.
- Reduce inputs: limit doom-scrolling and notifications.

## 7. Build a written toolkit
Create a one-page personal plan listing your top triggers, your three go-to fast interventions, your recovery menu, and your prevention habits. Keep it visible.

## 8. Weekly check-in
Rate stress 1-10, note what helped, and adjust the toolkit. Escalate to professional support if stress stays high.

## Output for the user
Deliver: a trigger log template, a controllable/uncontrollable sort, a curated list of fast interventions, a recovery menu, and prevention habits.`,
  },
  {
    slug: "investment-basics",
    name: "Investment Basics",
    category: "personal",
    description: "Explains personal investment fundamentals: asset allocation, rebalancing, tax-efficient accounts.",
    author: "community",
    featured: false, verified: true,
    tags: ["investing","personal-finance","basics"],
    install_count: 28900, rating_avg: 4.6, rating_count: 450,
    skill_content: `---
name: Investment Basics
description: Explain personal investing fundamentals - asset allocation, diversification, rebalancing, and tax-efficient accounts.
---

# Investment Basics

Note: This is general financial education, not personalized investment, tax, or legal advice. Markets carry risk and you can lose money. Consult a licensed financial advisor for decisions specific to your situation.

## 1. Build the foundation first
Before investing in markets:
- Have an emergency fund (typically 3-6 months of expenses) in cash.
- Pay off high-interest debt; few investments beat avoiding 20% interest.
- Know your time horizon and goals (retirement, house, education).

## 2. Understand the core asset classes
- Stocks (equities): higher long-term growth, higher short-term volatility.
- Bonds (fixed income): steadier, lower expected return, cushion in downturns.
- Cash: safety and liquidity, but loses to inflation over time.
- Real assets (real estate, commodities): optional diversifiers.

## 3. Diversify
Do not bet on single stocks for core holdings. Broad, low-cost index funds spread risk across hundreds or thousands of companies. Diversification reduces the impact of any one failure.

## 4. Set an asset allocation
Allocation (the stock/bond mix) drives most of your returns and risk. A common starting point ties stock weight loosely to time horizon and risk tolerance: longer horizon and higher tolerance favor more stocks. Write down your target percentages.

## 5. Mind costs
- Favor low expense-ratio index funds; fees compound against you over decades.
- Avoid frequent trading and high-fee products.
- A 1% annual fee can cost a large share of lifetime returns.

## 6. Use tax-efficient accounts
- Tax-advantaged retirement accounts can defer or eliminate taxes on growth.
- Capture any employer match first; it is an immediate return.
- Hold tax-inefficient assets in sheltered accounts where rules allow.
(Specific account types and limits vary by country; verify your local rules.)

## 7. Automate and stay the course
- Invest regularly regardless of headlines (dollar-cost averaging).
- Time in the market generally beats timing the market.
- Avoid panic selling in downturns; that locks in losses.

## 8. Rebalance
Once or twice a year, sell a bit of what grew and buy what lagged to return to your target allocation. This enforces buy-low, sell-high and controls risk drift.

## 9. Keep learning, ignore noise
Tune out hype and get-rich-quick pitches. Boring, consistent, diversified investing wins for most people.

## Output for the user
Deliver: a readiness checklist, a sample target allocation, an account-priority order, an automation plan, and a rebalancing schedule, with a reminder to verify local tax rules.`,
  },
  {
    slug: "side-project-launch",
    name: "Side Project Launch",
    category: "personal",
    description: "Plans a side project from idea to launch: validation, MVP scope, launch strategy, growth.",
    author: "community",
    featured: false, verified: true,
    tags: ["entrepreneurship","side-project","launch"],
    install_count: 22400, rating_avg: 4.7, rating_count: 350,
    skill_content: `---
name: Side Project Launch
description: Take a side project from idea to launch with validation, tight MVP scope, a launch plan, and early growth.
---

# Side Project Launch

Use this skill to ship a side project without burning out or over-building. The biggest risk is spending months building something nobody wants.

## 1. Sharpen the idea
Write one sentence: "I help [audience] do [job] better by [approach]."
- Who exactly is the user?
- What painful problem does this solve?
- Why would they switch from their current solution?

## 2. Validate before building
Talk to 5-10 potential users. Ask about their current behavior, not your idea:
- How do you handle this today?
- What is frustrating about that?
- Have you paid for or sought a solution?
Look for evidence of real pain. A landing page with a waitlist or a small pre-sale is a stronger signal than compliments.

## 3. Define a ruthless MVP
List every feature you imagine, then cut to the one core flow that delivers the promise. Ask: what is the smallest thing that lets a user get the main value once?
- Cut accounts, settings, and edge cases for v1 if possible.
- Manual is fine: do things that do not scale (concierge MVP) before automating.

## 4. Set a timebox
Pick a launch date 2-6 weeks out and scope to fit it, not the reverse. A deadline forces hard cuts. Track work in a simple kanban (To do / Doing / Done).

## 5. Build lean
- Use boring, familiar tools and no-code where it speeds you up.
- Avoid premature optimization and scaling concerns.
- Ship something embarrassing but working.

## 6. Plan the launch
- Build an audience early (waitlist, social posts, a small community).
- Prepare assets: a clear landing page, a demo, a short story of why you built it.
- Launch where your users already gather (relevant communities, forums, newsletters, Product Hunt, etc.). Respect each community's norms.
- Personally invite your early conversations from step 2.

## 7. Measure what matters
Pick one north-star metric (signups, activations, or revenue). Ignore vanity metrics. Watch whether users reach the core value (activation), not just visit.

## 8. Early growth loops
- Talk to every early user; fix the top friction.
- Ask happy users for referrals and testimonials.
- Iterate weekly on the single biggest drop-off point.

## 9. Decide: persevere or pivot
After a few weeks of real usage, judge honestly: is there pull? Double down on what works, cut what does not, or pivot the idea while keeping the audience.

## Output for the user
Deliver: a one-line value statement, a validation interview script, a cut-down MVP feature list, a timeboxed plan, a launch checklist, and a north-star metric.`,
  },
]
