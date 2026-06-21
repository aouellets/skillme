import type { SkillCategory } from './types'
import { EXPANSION_SKILLS } from './seed-data-expansion'

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

const CORE_SEED_SKILLS: SeedSkill[] = [
  {
    slug: 'skillme',
    name: 'Skill Me',
    category: 'productivity',
    description:
      'Teaches Claude to use the Skill Me catalog itself — browse, install, and manage skills from any conversation. The first skill on the shelf.',
    author: 'Skill Me',
    source_url: 'https://github.com/aouellets/skillme',
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
    author: 'Anthropic',
    source_url: 'https://github.com/anthropics/skills/tree/main/skills/frontend-design',
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
    slug: 'ponytail',
    name: 'Ponytail',
    category: 'coding',
    description:
      'Makes your AI agent think like the laziest senior dev in the room. The best code is the code you never wrote — applies a decision ladder that cuts ~54% of generated code before a line is written.',
    author: 'DietrichGebert',
    source_url: 'https://github.com/DietrichGebert/ponytail',
    featured: true,
    verified: true,
    tags: ['agents', 'code-quality', 'minimalism', 'claude-code'],
    install_count: 41200,
    rating_avg: 4.9,
    rating_count: 612,
    skill_content: `---
name: Ponytail
description: Write the minimum viable code. Before adding anything, walk the decision ladder — does it need to exist, can stdlib or a native feature do it, can it be one line — and only then write the smallest thing that works.
---

# Ponytail

Think like the laziest senior dev in the room. The best code is the code you
never wrote. Over-engineering is the default failure mode of AI coding agents;
your job is to resist it on every change.

## The decision ladder

Before writing any new code, walk these rungs in order and stop at the first
that works:

1. **Does it need to exist at all?** Delete the requirement before writing the
   solution. The cheapest feature is the one you talked the user out of.
2. **Can the standard library do it?** Reach for stdlib before a dependency.
3. **Is there a native language/framework feature?** Prefer built-ins over
   hand-rolled helpers.
4. **Is an already-installed dependency enough?** Don't add a package for what
   you already ship.
5. **Can it be one line?** A comprehension or a single call beats a helper
   function and a test for it.
6. **Only now:** write the minimum viable code — no speculative abstraction, no
   "we might need it later", no configuration nobody asked for.

## Intensity

Match the rigor to the task. \`lite\` for quick edits, \`full\` for normal work,
\`ultra\` when the diff is getting large and you want maximum pushback, \`off\`
when the user explicitly wants a scaffold. When unsure, default to \`full\`.

## Companion reviews

- **Audit a diff** before committing: flag every line that fails the ladder.
- **Audit a repo** for accumulated over-engineering: dead abstractions, wrapper
  functions with one caller, config that's never varied.
- **Defer debt**: name what you chose *not* to build and why, so the next person
  sees the seam instead of guessing.

## The test

For every block you're about to write, ask: "Would a senior dev who hates
maintenance write this?" If they'd delete it in review, delete it now. Keep
behavior identical; only the code gets smaller.`,
  },
  {
    slug: 'codegraph',
    name: 'CodeGraph',
    category: 'coding',
    description:
      'Cross-language code intelligence for AI agents. Builds a semantic graph of functions, classes, imports, and call chains across 38 languages and exposes it through MCP tools — so you query structure instead of grepping files.',
    author: 'codegraph-ai',
    source_url: 'https://github.com/codegraph-ai/CodeGraph',
    featured: true,
    verified: true,
    tags: ['mcp', 'code-intelligence', 'graph', 'agents'],
    install_count: 26400,
    rating_avg: 4.8,
    rating_count: 318,
    skill_content: `---
name: CodeGraph
description: Understand a codebase as a graph, not a pile of files. When you need structure — who calls this, what does it import, what breaks if I change it — query CodeGraph's MCP tools instead of grepping, and trust the structured result.
---

# CodeGraph

CodeGraph gives you structured code understanding through a semantic graph of
the codebase — functions, classes, imports, and call chains across 38 languages
— served over MCP. Use it whenever a question is about *structure* rather than
text.

## When to reach for it

Prefer CodeGraph over raw \`grep\`/file reads when the user asks:

- "Who calls this function?" / "What does this depend on?"
- "What's the blast radius if I change X?" — impact and call-graph traversal.
- "Where is this concept implemented?" — semantic search over full-body
  embeddings, not just string matches.
- "Why did we do it this way?" — the persistent memory layer surfaces past
  debugging insights across sessions.

## How to use it well

- **Pick a tool profile** (\`core\`, \`graph\`, \`memory\`, \`security\`) to keep the
  tool surface — and your context budget — small. Don't load all 42 tools when
  you only need call-graph traversal.
- **Ask for intent-aware context** in one call rather than chaining many file
  reads; CodeGraph returns the relevant slice of the graph.
- **Trust the graph.** Once a result comes back, don't re-verify it by grepping
  — that's the workflow CodeGraph exists to replace.
- **Record insights** to the memory layer when you debug something non-obvious,
  so the next session starts ahead.

## PR and review work

For pull requests, use the analysis tools for blast radius, test-gap detection,
and reviewer suggestions before reading the diff line by line. Verify design
against code where the two can drift.`,
  },
  {
    slug: 'codegraph-local',
    name: 'CodeGraph Local',
    category: 'coding',
    description:
      'A pre-indexed code knowledge graph that auto-syncs on every change and runs 100% locally. One MCP call returns entry points, related symbols, and snippets — fewer tokens, fewer tool calls, no data leaves your machine.',
    author: 'colbymchenry',
    source_url: 'https://github.com/colbymchenry/codegraph',
    featured: true,
    verified: true,
    tags: ['mcp', 'code-intelligence', 'local', 'agents'],
    install_count: 18700,
    rating_avg: 4.8,
    rating_count: 241,
    skill_content: `---
name: CodeGraph Local
description: A local, always-fresh knowledge graph of the codebase. When you need to orient — entry points, a symbol's source and dependents, call sites — ask CodeGraph in one call instead of reading many files, and trust the result without re-grepping.
---

# CodeGraph Local

CodeGraph Local keeps a pre-indexed SQLite knowledge graph of the project's
symbols and relationships, auto-synced on code changes by native OS file
watchers. Everything runs locally — no external APIs, no data leaves the
machine. Use it to orient fast and spend fewer tokens and tool calls.

## The four tools

- **explore** — answer a structural question ("how does auth flow work?") in a
  single call: entry points, related symbols, and code snippets together.
- **node** — one symbol's source plus everything that depends on it.
- **search** — locate symbols by name across the codebase (FTS5 full-text).
- **callers** — find every call site of a function.

## How to use it well

- **Start with \`explore\`** for any "where do I begin" question — it builds the
  context for you in one shot, instead of opening files one at a time.
- **Use \`node\` and \`callers\`** to scope a change before editing: see the source
  and its dependents so you know the blast radius.
- **Trust the index.** It auto-syncs on save, so results are current — don't
  re-verify with \`grep\`. That's the whole point: fewer tokens, fewer calls.
- **Lean on framework awareness.** It understands 17+ web frameworks and
  cross-language bridges (Swift/ObjC, React Native, Expo), so route and
  component questions resolve correctly.

## When to prefer it

Reach for CodeGraph Local first on large or unfamiliar repos where grepping
would be slow or noisy, and any time you'd otherwise read five files to answer
one structural question.`,
  },
  {
    slug: 'meeting-notes-to-actions',
    name: 'Meeting Notes → Actions',
    category: 'productivity',
    description:
      'Transforms raw meeting notes into structured action items with owners, deadlines, and follow-ups.',
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    name: "Conditioning & HIIT Program",
    category: 'personal',
    description:
      "Use when someone asks to build a HIIT plan, interval-training block, metabolic conditioning or metcon, circuit training, work-capacity training, conditioning for fat loss, or high-intensity \"get in shape\" cardio (not easy steady-state). Builds a metabolic-conditioning block — interval and circuit work using EMOM, AMRAP, Tabata, and intervals — with format selection, work-to-rest ratios, weekly structure, and progression. General fitness guidance, not medical advice. This skill owns high-intensity interval conditioning only. Do NOT use to design a resistance/strength program for getting stronger or bigger (use Strength Training Plan), a steady-state aerobic-base or Zone 2 block (use Zone 2 Cardio Plan), or a mobility/flexibility routine (use Mobility Routine).",
    author: 'Skill Me',
    featured: false,
    verified: true,
    tags: ['fitness', 'training', 'personal'],
    install_count: 35000,
    rating_avg: 4.6,
    rating_count: 480,
    skill_content: "---\nname: Conditioning & HIIT Program\ndescription: Use when someone asks to build a HIIT plan, interval-training block, metabolic conditioning or metcon, circuit training, work-capacity training, conditioning for fat loss, or high-intensity \"get in shape\" cardio (not easy steady-state). Builds a metabolic-conditioning block — interval and circuit work using EMOM, AMRAP, Tabata, and intervals — with format selection, work-to-rest ratios, weekly structure, and progression. General fitness guidance, not medical advice. This skill owns high-intensity interval conditioning only. Do NOT use to design a resistance/strength program for getting stronger or bigger (use Strength Training Plan), a steady-state aerobic-base or Zone 2 block (use Zone 2 Cardio Plan), or a mobility/flexibility routine (use Mobility Routine).\n---\n\n# Conditioning & HIIT Program\n\nThis skill builds a high-intensity metabolic-conditioning block: interval work, circuits, and timed formats (EMOM, AMRAP, Tabata, fixed intervals) aimed at work capacity and fat-loss conditioning. The default is a 4-week block, 3 conditioning sessions per week, repeatable. This is general fitness guidance, not medical advice — anyone with cardiac risk factors, on heart-rate-affecting medication, pregnant, or returning from illness or injury should clear high-intensity training with a physician first.\n\n## Confirm Scope Before Programming\n\nEstablish four things first: the goal (fat-loss conditioning, work capacity for a sport, or general high-intensity fitness), training age and current conditioning level, available equipment and space, and days per week. If the request is actually about getting stronger or bigger, building an aerobic base at easy effort, or improving flexibility, stop and hand off — strength belongs to Strength Training Plan, steady-state and Zone 2 to Zone 2 Cardio Plan, mobility to Mobility Routine. This skill is for high-intensity intermittent work, not easy continuous cardio.\n\n## Gate Intensity to Readiness\n\nTrue HIIT means near-maximal efforts; it is potent and easy to overdo. Beginners (under ~3 months of consistent training) start with longer rest and circuit formats, not all-out intervals — work-to-rest around 1:3 or 1:4. Intermediates tolerate 1:1 to 1:2. Only well-conditioned trainees should run 2:1 or true Tabata (20s on / 10s off, all-out). Cap genuine high-intensity work at 2–3 sessions per week regardless of level; the adaptation comes from recovering between hard efforts, not from doing them daily.\n\n## Select the Format to the Goal\n\nMatch the format to the intent, not to novelty:\n- **Intervals** (fixed work / fixed rest, e.g. 30s hard / 90s easy ×8): cleanest way to dose intensity; best default for fat-loss conditioning and for beginners.\n- **EMOM** (every minute on the minute — do the prescribed work, rest the remainder of the minute): self-regulating; rest shrinks as fatigue grows. Good for skill-plus-conditioning and pacing.\n- **AMRAP** (as many rounds/reps as possible in a fixed window): measures and builds work capacity; pace it or it collapses into a sprint-then-stall.\n- **Tabata** (8 rounds of 20s all-out / 10s rest, 4 min total): a specific, brutal protocol — reserve for one or two well-chosen movements, not a whole session.\n- **Circuits** (stations in sequence with short transitions): highest volume and lowest skill demand; best for beginners and for full-body fat-loss work.\n\n## Choose Movements That Survive Fatigue\n\nPrefer movements that stay safe when the user is gassed: machines (bike, rower, ski erg), bodyweight (squats, push-ups, burpees, mountain climbers), sled work, kettlebell swings, and low-skill carries. Avoid high-skill barbell lifts (snatch, clean) and heavy near-maximal lifting under metabolic fatigue — that is where form breaks and injuries happen. Keep external load light to moderate; in conditioning, the clock and the heart rate are the stimulus, not the weight on the bar.\n\n## Build the Weekly Structure\n\nLay out the week explicitly. A typical 3-day conditioning week: two interval/circuit sessions and one mixed-format session, each on non-consecutive days with at least one easy or rest day between hard efforts. Each session: 5–10 min progressive warm-up (raise heart rate, prime the movements used), the conditioning piece with format, work-to-rest ratio, total duration, and target effort named, then a short cooldown. Keep the hard piece to 12–25 minutes for most goals — quality of effort drops fast past that, and longer is the job of a Zone 2 block, not this one.\n\n## Progress Without Just Adding Intensity\n\nDefault progression is density before intensity: same work in less time, more rounds in the same window, more reps per interval, or shortened rest — before making the efforts harder. Build for 3 weeks, then take a recovery week at ~50% volume before repeating or rotating formats. Tie progress to a re-testable benchmark: AMRAP score, a fixed-distance row/bike time, total rounds at a set work-to-rest, or how fast heart rate recovers in the minute after a hard interval. Re-test at the end of each block.\n\n## Quality Bar\n\nA plan is done well when: every conditioning piece names a format, a work-to-rest ratio, total duration, and a target effort; intensity is gated to the user's conditioning level with hard sessions capped at 2–3 per week; movements stay safe under fatigue; the week separates hard efforts with recovery; progression is density-first, capped, and includes a recovery week; success is a concrete re-testable score; and the medical-clearance caveat is present.\n\n## What NOT to Do\n\n- Don't program a strength/hypertrophy block, an easy aerobic/Zone 2 block, or a mobility routine here — hand those to Strength Training Plan, Zone 2 Cardio Plan, and Mobility Routine.\n- Don't prescribe daily HIIT or stack hard sessions back-to-back; the recovery between efforts is where adaptation happens.\n- Don't load high-skill or near-maximal lifts under metabolic fatigue — it trades a marginal stimulus for an injury.\n- Don't let an AMRAP or \"for time\" piece run so long it becomes slow steady-state; if effort can't stay high, the format or duration is wrong.\n- Don't progress by piling on intensity every week; raise density first and keep the recovery week.\n- Don't pose as a medical provider; flag the clearance need and stop short of diagnosing or treating.\n",
  },
  {
    slug: 'life-coach',
    name: 'Life Coach',
    category: 'personal',
    description:
      'Values clarification, goal setting, and an accountability structure that turns intentions into action.',
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: 'Skill Me',
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
    author: "Skill Me",
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
  // ════════ Phase 2 expansion: persona/workflow packs ════════
  // ── customer-support-copilot ──
  {
    slug: "support-ticket-reply",
    name: "Support Ticket Reply",
    category: "business",
    description: "Draft empathetic, accurate, action-first support replies that resolve tickets in one touch. Use when composing responses to customer issues, complaints, or requests.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["support","customer-service","email","cx","one-touch"],
    install_count: 47200,
    rating_avg: 4.8,
    rating_count: 1840,
    skill_content: "---\nname: Support Ticket Reply\ndescription: Drafts empathetic, accurate, action-first support replies that resolve tickets in one touch. Use when composing responses to customer issues, complaints, or feature requests.\n---\n\n# Support Ticket Reply\n\nEvery support reply has one job: give the customer exactly what they need to move forward, without making them write back. Lead with the resolution, follow with context, close with a clear next step.\n\n## Reply structure (always in this order)\n\n1. Acknowledge the specific issue in one sentence — name it, do not paraphrase vaguely.\n2. State the resolution or the concrete next action immediately.\n3. Explain the 'why' only if it reduces future confusion or builds trust. Keep it to two sentences.\n4. Close with a single, unambiguous next step: a link, a yes/no question, or a confirmation request.\n5. Sign off warmly but briefly.\n\n## Tone calibration\n\nMatch urgency level to ticket severity. Use plain language — no jargon, no product-internal terms. For frustrated customers, name the frustration before moving to the fix: 'That should not have happened, and I am sorry it did.' Never use hollow phrases like 'Great question!' or 'I totally understand your frustration' without immediately proving it.\n\n## One-touch discipline\n\nBefore sending, run a mental check: does this reply answer every question in the ticket? If the customer asks three things, address all three, numbered. Partial answers guarantee a follow-up and damage CSAT. If a full answer requires information you do not have, say what you are doing to get it and give a time window.\n\n## What to avoid\n\n- Do not open with 'I' — start with the customer or the action.\n- Do not paste policy text verbatim; translate it into what it means for this customer.\n- Do not hedge with 'should' or 'might' when you know the answer; use 'will' or 'is'.\n- Do not apologize more than once; repeated apologies shift focus from resolution to performance.\n\n## Templates\n\nIssue confirmed and resolved: 'Your [specific issue] is now fixed — [what changed]. You will see [outcome] within [timeframe]. Let me know if anything looks off.'\n\nIssue requires investigation: 'I have flagged [specific issue] to our [team] and will follow up by [day/time] with a status update. In the meantime, [workaround if any].'\n\nFeature request acknowledged: 'I have logged this as a feature request under [theme]. I cannot promise a timeline, but your use case is now on record. I will reach out if it ships.'",
  },
  {
    slug: "support-macro-library",
    name: "Support Macro Library",
    category: "business",
    description: "Design a reusable macro and canned-response library that stays human and on-brand. Use when building or auditing a team's response templates and support playbooks.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["support","macros","templates","cx","efficiency"],
    install_count: 28600,
    rating_avg: 4.6,
    rating_count: 920,
    skill_content: "---\nname: Support Macro Library\ndescription: Designs a reusable macro and canned-response library that stays human and on-brand. Use when building, auditing, or expanding a support team's template playbook.\n---\n\n# Support Macro Library\n\nA macro library fails in one of two ways: it sounds robotic and customers notice, or it is so generic that agents spend more time editing than if they had typed from scratch. Good macros are 80% done and 100% on-brand.\n\n## Taxonomy first\n\nBefore writing a single macro, map the top 20 ticket categories from the last 90 days. Group them into five to eight parent buckets (billing, onboarding, bugs, feature requests, account management, policy questions, escalations, general how-to). Every macro belongs to exactly one bucket. Name macros with the pattern '[Bucket] — [Specific Scenario]' so agents can find them in two seconds without a search.\n\n## Anatomy of a high-quality macro\n\nEvery macro has three zones:\n- Opening (1 sentence): acknowledge the specific scenario without being sycophantic.\n- Body (2-4 sentences): the actual answer, action, or next step. Use '[placeholder]' tokens for values agents must personalize — customer name, order number, date, etc.\n- Close (1 sentence): a single clear next step or an open door for follow-up.\n\nKeep every macro under 150 words. If it exceeds that, split it into two.\n\n## Personalization tokens\n\nUse consistent token syntax across the whole library. The recommended pattern is double brackets: [[customer_name]], [[order_id]], [[product_name]], [[resolution_date]]. Document all tokens in a shared reference sheet. Agents must fill every token before sending — build a checklist reminder into your helpdesk workflow if possible.\n\n## Brand voice guardrails\n\nWrite macros to match the brand voice guide. If no guide exists, define three adjectives that describe how the company talks (e.g., direct, warm, no-nonsense) and use them as a filter when drafting. Run every new macro past one senior agent for voice review before publishing.\n\n## Maintenance cadence\n\nReview the full macro library quarterly. Archive macros unused in 60 days. Flag macros with CSAT scores below the team average for rewrite. Assign macro ownership — each bucket has one owner responsible for accuracy.\n\n## What to avoid\n\n- Do not create macros for edge cases that occur fewer than twice a month; handle those manually.\n- Do not use macros as a substitute for a missing knowledge-base article — if a macro is being sent constantly, turn the body into a help article and link to it instead.",
  },
  {
    slug: "escalation-summary",
    name: "Escalation Summary",
    category: "business",
    description: "Write a tight escalation summary to engineering or management with repro steps, customer impact, and a clear ask. Use when a ticket must leave the support queue.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["support","escalation","incident","cx","engineering"],
    install_count: 19400,
    rating_avg: 4.7,
    rating_count: 680,
    skill_content: "---\nname: Escalation Summary\ndescription: Writes a tight escalation summary to engineering or management with repro steps, customer impact, and a clear ask. Use when a ticket must leave the support queue for specialist action.\n---\n\n# Escalation Summary\n\nEngineers and managers receive escalations all day. A good escalation summary gets a response; a vague one gets queued. Write as if the reader has zero context and thirty seconds.\n\n## Required sections (always include all five)\n\n1. One-line summary: what is broken or wrong, for whom, since when.\n2. Customer impact: number of affected accounts or users, revenue or tier, business impact (cannot complete checkout, cannot log in, data loss, etc.). Use hard numbers where available; estimate where not, and label estimates as such.\n3. Repro steps: numbered, precise, environment-specific. Include what was expected vs. what happened. If you cannot repro, say so explicitly and explain what evidence you do have.\n4. What support has already tried: list every action taken so the escalation team does not repeat work.\n5. The ask: one sentence stating exactly what you need — a fix, a workaround, a timeline, a decision.\n\n## Severity language\n\nUse consistent severity labels: P1 (service down or data loss, immediate response needed), P2 (major feature broken, significant customer impact, response within 4 hours), P3 (degraded feature, workaround exists, response within 1 business day). Include the severity label in the subject line or ticket title.\n\n## Evidence package\n\nAttach or link: the original customer ticket(s), any screenshots or screen recordings the customer provided, relevant log excerpts (not full logs — only the lines that show the failure), and the account or order IDs needed to reproduce.\n\n## Tone and framing\n\nEscalation summaries are factual, not emotional. Do not editorialize about how the customer felt. Do not assign blame. If the issue has a known workaround, state it — this often changes the urgency calculation. If the issue is time-sensitive because of a customer SLA or renewal, say so plainly.\n\n## What to avoid\n\n- Do not escalate without first confirming the issue is outside support's scope to resolve.\n- Do not send partial escalations and promise to 'follow up with more details' — gather everything first.\n- Do not copy the customer on an internal escalation.",
  },
  {
    slug: "csat-root-cause",
    name: "CSAT Root Cause Analysis",
    category: "data",
    description: "Analyze CSAT and NPS verbatims to find root-cause themes and prioritize fixes. Use when interpreting customer satisfaction data to drive product or process improvements.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["csat","nps","analytics","support","cx"],
    install_count: 14800,
    rating_avg: 4.5,
    rating_count: 410,
    skill_content: "---\nname: CSAT Root Cause Analysis\ndescription: Analyzes CSAT and NPS verbatims to surface root-cause themes and prioritize fixes by frequency and impact. Use when interpreting customer satisfaction data to inform product or process decisions.\n---\n\n# CSAT Root Cause Analysis\n\nRaw CSAT scores tell you that something is wrong. Verbatim comments tell you what and why. The goal of root-cause analysis is to turn hundreds of individual comments into a ranked list of fixable problems.\n\n## Data preparation\n\nBefore analyzing, filter the dataset: remove blank verbatims, remove comments that mention only a specific agent by name (these are agent-performance signals, not product/process signals), and separate detractor verbatims (score 0-6 on NPS, 1-3 on CSAT) from promoter verbatims. Analyze detractors first — they drive churn.\n\n## Coding scheme\n\nApply a two-level coding scheme. Level 1 is the broad category (product bug, slow response time, unclear communication, pricing confusion, onboarding friction, feature gap, policy frustration). Level 2 is the specific sub-theme within that category. Code each verbatim with exactly one Level 1 and one Level 2 code. If a verbatim contains multiple distinct complaints, split it into sub-comments before coding.\n\n## Prioritization matrix\n\nAfter coding, calculate two numbers for each theme: frequency (what percentage of verbatims mention it) and impact (what is the average CSAT score for tickets that mention it versus those that do not). Plot themes on a 2x2 matrix: high frequency + high impact = fix immediately, high frequency + low impact = quick wins, low frequency + high impact = critical edge cases, low frequency + low impact = monitor.\n\n## Presenting findings\n\nReport findings as: the top three to five themes by priority, with verbatim examples for each, a proposed fix or owner for each theme, and a success metric (what does a fixed version look like in the data). Avoid reporting a theme without a proposed action — analysis without a recommendation is noise.\n\n## Thresholds that signal urgency\n\nEscalate immediately if any single theme appears in more than 15% of detractor verbatims within a 30-day window, or if average CSAT for a theme drops below 2.5/5. These thresholds indicate systemic failure, not statistical noise.\n\n## What to avoid\n\n- Do not present word clouds — they conflate frequency with font size and obscure causality.\n- Do not conflate correlation with causation; a theme appearing alongside low scores does not prove it caused the low score without further validation.\n- Do not analyze fewer than 30 verbatims; sample size below that produces unreliable theme distributions.",
  },
  {
    slug: "kb-article-writer",
    name: "Knowledge Base Article Writer",
    category: "writing",
    description: "Turn a resolved support ticket into a clear, searchable knowledge-base or help center article. Use when converting ticket resolutions into self-service documentation.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["knowledge-base","documentation","self-service","support","writing"],
    install_count: 33100,
    rating_avg: 4.7,
    rating_count: 1150,
    skill_content: "---\nname: Knowledge Base Article Writer\ndescription: Turns a resolved support ticket into a clear, searchable knowledge-base or help center article. Use when converting ticket resolutions into self-service documentation to deflect future tickets.\n---\n\n# Knowledge Base Article Writer\n\nEvery ticket that gets answered manually is a ticket that could have been self-served. A good knowledge-base article is written for the customer who is about to open a ticket, not for the agent who already knows the answer.\n\n## When to create an article\n\nCreate an article when a ticket has been answered by two or more different customers in the past 60 days, or when a support lead flags a topic as recurring. Do not create articles for one-off edge cases or deprecated features.\n\n## Article structure\n\nUse this structure for every article:\n1. Title: a plain-language question or task the customer is trying to accomplish ('How to reset your password', 'Why was I charged twice'). Use the exact words a customer would type into a search box.\n2. Summary (2-3 sentences): what this article covers and who it is for.\n3. Prerequisites (if applicable): what the customer needs before starting.\n4. Steps or explanation: numbered steps for procedural articles, short paragraphs for conceptual ones. Each step has one action. Use plain language, no internal jargon.\n5. What to do if it does not work: one to three common failure modes and their fixes.\n6. Related articles: two to four links to directly related help content.\n\n## Writing rules\n\nWrite in second person ('you', not 'the user'). Use active voice. Keep sentences under 20 words. Screenshots or short screen recordings reduce confusion for procedural articles — include them where possible. Avoid mentioning specific version numbers or dates unless the content is truly version-specific; these make articles go stale.\n\n## SEO and findability\n\nThe article title and first paragraph must contain the keywords the customer would naturally use. Think about synonyms: a customer might search 'cancel subscription', 'end plan', 'stop billing', or 'delete account' for the same workflow — address each variant either in the title or in the first two sentences.\n\n## Review and freshness\n\nSet a review date of 90 days on every new article. Mark articles as 'needs review' when the underlying product or policy changes. Archive articles that have not received a visit in 180 days — they add noise to search results.\n\n## What to avoid\n\n- Do not copy-paste the agent's reply verbatim; ticket language is written for one customer, not all customers.\n- Do not bury the answer — lead with the most common scenario, not the edge case.",
  },
  {
    slug: "refund-deescalation",
    name: "Refund and De-escalation",
    category: "business",
    description: "Handle angry customers, refund requests, and de-escalation with policy-safe, calm language. Use when a conversation is emotionally charged or a refund decision must be communicated.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["refunds","de-escalation","cx","support","policy"],
    install_count: 41700,
    rating_avg: 4.9,
    rating_count: 2180,
    skill_content: "---\nname: Refund and De-escalation\ndescription: Handles angry customers, refund requests, and de-escalation with policy-safe, calm language. Use when a conversation is emotionally charged or a refund decision must be communicated clearly and empathetically.\n---\n\n# Refund and De-escalation\n\nAn angry customer is not attacking you — they are in pain and looking for someone to fix it. De-escalation is not about calming the customer down; it is about giving them a reason to trust you again.\n\n## The three-step de-escalation sequence\n\n1. Validate without agreeing: acknowledge the specific frustration ('Having a charge appear that you did not expect is genuinely alarming'). Do not say 'I understand how you feel' — it is hollow. Name the exact thing that went wrong.\n2. Take ownership: use 'I will' and 'we will', not 'the system' or 'the team'. Customers want a person responsible.\n3. State the next action in 10 words or fewer. Vague promises ('we will look into it') increase anger. Specific commitments ('I am issuing the refund now — you will see it in 3-5 business days') reduce it.\n\n## Refund communication\n\nApproved refunds: state the amount, the method, and the timeline in the first sentence. Do not make the customer search for the confirmation. Example: 'I have processed a full refund of [amount] to your [payment method] — it will appear within [timeframe].'\n\nDenied refunds: explain the specific policy reason, offer the best available alternative (account credit, partial refund, service extension), and close with a genuine acknowledgment that the outcome is disappointing. Do not repeat the denial multiple times — once is enough.\n\nPartial refunds or goodwill gestures: frame these as a choice the company is making, not as a compromise. 'As a goodwill gesture I am applying a [amount] credit to your account' lands better than 'unfortunately I can only offer...'\n\n## Language guardrails\n\n- Never say 'calm down' — it escalates every time.\n- Never say 'that is our policy' as a standalone explanation — it sounds dismissive.\n- Never make promises you cannot keep to end a conversation quickly; this creates a second, worse complaint.\n- Use 'I am sorry this happened' not 'I am sorry you feel that way' — the latter implies the customer's reaction is the problem.\n\n## Escalation threshold\n\nIf a customer uses threatening language, requests to speak to a specific senior person, or has contacted the company more than three times on the same issue, escalate to a senior agent or manager immediately. Include a full context summary with the handoff so the customer does not have to repeat themselves.\n\n## Closing an emotionally charged conversation\n\nEnd with a specific check: 'Is there anything else I can help you with today?' If the customer is satisfied, note the resolution and the tone shift in the ticket for QA review. Positive recovery moments are strong training material.",
  },
  // ── designer-to-dev-handoff ──
  {
    slug: "design-qa-checklist",
    name: "Design QA Checklist",
    category: "design",
    description: "QA an implemented UI against the design spec — spacing, interactive states, typography, color tokens, and responsiveness. Use during implementation review or before sign-off.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["design-qa","ui-review","frontend","accessibility","handoff"],
    install_count: 41200,
    rating_avg: 4.8,
    rating_count: 1840,
    skill_content: "---\nname: Design QA Checklist\ndescription: Reviews an implemented UI against design specs — spacing, states, typography, color, and responsiveness. Use during implementation review or before design sign-off.\n---\n\n# Design QA Checklist\n\nA systematic review catches drift between design intent and shipped code before it compounds. Work through each section top-to-bottom; flag deviations with a file path or component name and the exact expected vs. actual value.\n\n## Spacing and Layout\n\n- Verify all margin, padding, and gap values match the design token or explicit spec (e.g. space-4 = 16px, not 15px or 18px).\n- Check that grid columns, gutters, and container max-widths are correct at every breakpoint.\n- Confirm that element alignment is pixel-accurate — use a grid overlay or browser devtools ruler, not eyeballing.\n- Flag any 'magic number' hardcoded values that should reference a token.\n\n## Typography\n\n- Font family, weight, size, line-height, and letter-spacing must match the spec exactly.\n- Check truncation behavior on long strings — does it ellipsize, wrap, or clip as designed?\n- Verify heading hierarchy is semantically correct (H1 > H2 > H3) even if visual size differs.\n- Confirm no system fallback fonts are rendering in place of the intended typeface.\n\n## Color and Tokens\n\n- Every color must reference a design token, not a raw hex. Flag any raw hex values in CSS/Tailwind.\n- Check that semantic tokens are used correctly: 'surface-danger' on error states, not 'red-500'.\n- Verify color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text and UI components).\n- Test both light and dark modes if the product supports them.\n\n## Interactive States\n\n- Hover, focus, active, disabled, and loading states must all be implemented and match the spec.\n- Focus rings must be visible and styled — never 'outline: none' without an equivalent replacement.\n- Confirm that disabled controls are non-interactive (not just visually muted) and excluded from tab order.\n- Animated transitions must match specified duration and easing — check the motion spec if one exists.\n\n## Responsiveness and Touch\n\n- Resize from the narrowest supported viewport (typically 320px) up to the widest. No horizontal overflow.\n- Touch targets must be at least 44x44px on mobile — check buttons, links, and icon controls.\n- Test at 1x, 1.5x, and 2x pixel density for image sharpness.\n- Verify text does not become unreadable (too small or overflowing) at any breakpoint.\n\n## Accessibility Baseline\n\n- Run an automated check (axe, Lighthouse) as a first pass; review all violations before sign-off.\n- All images have descriptive alt text; decorative images use alt=''.\n- Form inputs have visible, associated labels — not placeholder-only.\n- Screen reader announces dynamic content changes (loading states, errors, success messages).",
  },
  {
    slug: "redline-annotation",
    name: "Redline Annotation",
    category: "design",
    description: "Produce precise redline and spec annotations — spacing, sizes, behavior notes — that engineers can build from without guessing. Use when preparing design files for development.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["redline","specs","handoff","annotation","frontend"],
    install_count: 28700,
    rating_avg: 4.7,
    rating_count: 1120,
    skill_content: "---\nname: Redline Annotation\ndescription: Produces precise redline and spec annotations — spacing, sizes, and behavior notes — engineers can build from directly. Use when preparing design files or specs for a development handoff.\n---\n\n# Redline Annotation\n\nRedlines eliminate guesswork. Every measurement, color, and behavior that is not self-evident in the design tool must be annotated. Annotate for the engineer who has never seen the design before and cannot ask a question mid-sprint.\n\n## What Always Gets Annotated\n\n- Spacing: all padding, margin, and gap values in pixels (or the token name if a token system exists).\n- Sizing: width, height, and min/max constraints for every non-trivially-sized element.\n- Type: font family, weight, size, line-height, letter-spacing, and color for every text style not covered by a named style.\n- Color: token name first; raw hex only if no token exists. Include opacity if not 100%.\n- Corner radius: per-corner values if they differ (e.g. top-left: 8, top-right: 8, bottom: 0).\n- Layer/z-index relationships for overlapping elements (e.g. 'dropdown sits above modal overlay').\n\n## Behavior Notes\n\nAnnotate anything a developer cannot infer from a static frame:\n- Hover, focus, active, and disabled visual states with delta description ('background shifts from surface-primary to surface-hover, 150ms ease-out').\n- Overflow behavior: scroll direction, hidden vs. clipped vs. visible.\n- Conditional visibility: what triggers show/hide, and whether it is CSS display:none or removed from DOM.\n- Truncation rules: max lines before ellipsis, tooltip on truncate yes/no.\n\n## Spacing Annotation Format\n\nUse a consistent notation so engineers scan quickly:\n- Internal padding: annotate as 'padding: 12 16' (top/bottom left/right) or all four values if asymmetric.\n- Gap between siblings: draw a gap arrow and label the value.\n- 'Auto' widths: note 'grows to fill container' vs. 'shrinks to content'.\n- Never annotate only half of a symmetrical component — annotate fully so there is no ambiguity.\n\n## What Not to Annotate\n\n- Values already defined in a shared style or component (if the engineer has access to the design system, do not re-document every token).\n- Structural markup or class names — that is the engineer's domain. Annotate intent, not implementation.\n- Every single pixel when a 4px or 8px grid is the explicit convention — annotate exceptions to the grid, not the grid itself.\n\n## Delivery Checklist\n\n- All annotations are visible without needing to click into layers.\n- A legend is included if custom notation is used.\n- The file includes a 'last updated' date and the name of the design owner.\n- Responsive behavior is called out inline or linked to the responsive spec.",
  },
  {
    slug: "motion-spec",
    name: "Motion Spec",
    category: "design",
    description: "Specify animation and motion precisely — duration, easing, trigger, and intent — so engineers implement exactly what was designed. Use when handing off transitions, micro-interactions, or loading states.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["motion","animation","transitions","micro-interactions","handoff"],
    install_count: 14300,
    rating_avg: 4.6,
    rating_count: 390,
    skill_content: "---\nname: Motion Spec\ndescription: Specifies animation and motion precisely — duration, easing curve, trigger, and intent — for accurate engineer implementation. Use when handing off transitions, micro-interactions, or loading states.\n---\n\n# Motion Spec\n\nMotion that is vaguely specified gets implemented incorrectly or skipped. Every animation needs five pieces of information: what moves, when it triggers, how long it takes, what easing curve it follows, and why it exists. Provide all five.\n\n## The Five Required Fields\n\nFor every animated element, document:\n1. Element: the component or property being animated (e.g. 'modal overlay opacity', 'button background color').\n2. Trigger: the event that starts the animation (e.g. 'user clicks confirm', 'data fetch resolves', 'component mounts').\n3. Duration: in milliseconds. Do not use vague terms like 'fast' or 'subtle'.\n4. Easing: the named curve or cubic-bezier values (e.g. 'ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)'). Note if the design tool curve must be converted.\n5. Intent: one sentence on why the motion exists — it guides engineers when they must adapt the spec to constraints.\n\n## Standard Duration Reference\n\nCalibrate against these ranges; deviate only with intent:\n- Micro-interactions (button press, toggle, checkbox): 100-200ms.\n- Element enter/exit (dropdown, tooltip, popover): 200-300ms.\n- Panel or sheet transitions (side drawer, modal): 300-400ms.\n- Page-level transitions or complex orchestrations: 400-600ms.\n- Never exceed 600ms for UI feedback; reserve longer durations for deliberate narrative motion.\n\n## Easing Conventions\n\n- Elements entering the screen: ease-out (starts fast, decelerates into place).\n- Elements leaving the screen: ease-in (starts slow, accelerates off).\n- Elements repositioning within the screen: ease-in-out.\n- Spring or bounce effects: provide the stiffness and damping values, not just 'spring'.\n- If using a design system token (e.g. 'motion-ease-standard'), include the resolved cubic-bezier so engineers without design-tool access can verify.\n\n## Orchestration and Sequencing\n\nWhen multiple elements animate together:\n- List each element in order with its offset delay (e.g. 'icon fades in at 0ms, label fades in at 60ms').\n- State whether elements overlap in time or wait for the previous to complete.\n- Describe the 'feel' goal in one phrase (e.g. 'staggered reveal, content appears to cascade down') so engineers catch drift during review.\n\n## Reduced Motion\n\nEvery motion spec must include a reduced-motion variant:\n- State which animations are removed entirely vs. replaced with an instant state change vs. reduced in duration.\n- Default: respect 'prefers-reduced-motion: reduce' by removing decorative motion and collapsing durations to 0ms for essential transitions.\n- Mark any animation that conveys information (not just decoration) — these must have a non-motion fallback.",
  },
  {
    slug: "responsive-spec",
    name: "Responsive Spec",
    category: "design",
    description: "Specify responsive behavior across breakpoints — reflow rules, content priority, touch targets, and layout logic. Use when designing or documenting adaptive layouts for multi-device products.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["responsive","breakpoints","layout","mobile","handoff"],
    install_count: 22500,
    rating_avg: 4.7,
    rating_count: 870,
    skill_content: "---\nname: Responsive Spec\ndescription: Specifies responsive behavior across breakpoints — reflow, content priority, and touch targets — engineers can implement directly. Use when designing adaptive layouts for multi-device products.\n---\n\n# Responsive Spec\n\nA static design at one viewport does not specify a responsive product. A responsive spec documents the rules that govern how layout, content, and interaction change as the viewport changes — not just a set of static frames.\n\n## Breakpoint Definitions\n\nState the breakpoints explicitly with pixel values and their semantic name:\n- 'mobile': 0-767px\n- 'tablet': 768-1023px\n- 'desktop': 1024-1439px\n- 'wide': 1440px and above\n\nIf the product uses a different grid system (e.g. a 5-breakpoint Tailwind config), match those values exactly. Never use vague names like 'small' without a pixel value.\n\n## Layout Changes Per Breakpoint\n\nFor each breakpoint transition, document:\n- Column count and gutter width.\n- Which elements stack, collapse, or disappear.\n- Container max-width and horizontal padding.\n- Any changes to element ordering (e.g. 'CTA moves above image on mobile').\n\nAn explicit table works well: rows are breakpoints, columns are layout properties.\n\n## Content Priority\n\nOn mobile, not all content fits without compromising usability. Document:\n- Which elements are hidden below a breakpoint and the rationale (progressive disclosure, not arbitrary omission).\n- Which elements change behavior instead of disappearing (e.g. 'horizontal tabs become a select dropdown below 768px').\n- Text truncation rules that apply only on mobile.\n- Navigation patterns: desktop nav bar becomes bottom tab bar or hamburger menu — specify which and at what breakpoint.\n\n## Touch Targets\n\nAll interactive elements on touch viewports must meet minimum target size:\n- Minimum 44x44px for any tappable element. If the visual size is smaller, add invisible padding.\n- Spacing between adjacent touch targets: minimum 8px to prevent mis-taps.\n- Swipe gestures: document direction, threshold, and what action they trigger. Note if swipe conflicts with system gestures (e.g. back swipe on iOS).\n\n## Fluid vs. Fixed Behavior\n\nFor every significant element, specify whether it scales fluidly between breakpoints or snaps at discrete points:\n- 'Fluid': element width is a percentage; font size uses clamp() or viewport units.\n- 'Fixed': element width locks to a pixel value at each breakpoint and snaps.\n- Images: specify object-fit (cover vs. contain), aspect ratio at each breakpoint, and whether focal point shifts.\n\n## Edge Cases to Specify\n\n- Landscape phone orientation: is the layout treated as mobile or tablet?\n- Very long text strings in labels and headings: does the layout break? What is the overflow rule?\n- 320px minimum: the spec must remain functional at the minimum supported width — verify this explicitly.",
  },
  {
    slug: "design-handoff-doc",
    name: "Design Handoff Doc",
    category: "design",
    description: "Write a complete design handoff document covering components, tokens, states, and edge cases. Use when preparing a feature or screen for engineering implementation.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["handoff","documentation","components","design-system","collaboration"],
    install_count: 33800,
    rating_avg: 4.9,
    rating_count: 2140,
    skill_content: "---\nname: Design Handoff Doc\ndescription: Writes a complete design handoff document covering components, design tokens, interaction states, and edge cases for engineering implementation. Use when handing off a feature or screen to developers.\n---\n\n# Design Handoff Doc\n\nA handoff document is the single source of truth for what is being built. It replaces Slack threads, live walkthroughs, and guesswork. Write it for an engineer who joins the project the day implementation starts and has no prior context.\n\n## Document Structure\n\nEvery handoff doc contains these sections in order:\n1. Overview: what the feature does and why it exists (2-4 sentences max).\n2. Design file link: direct link to the specific page or frame, not the project root.\n3. Component inventory: list of every new or modified component.\n4. Design tokens used: all color, spacing, typography, and radius tokens referenced.\n5. Interaction states: every state for every interactive element.\n6. Edge cases and constraints: what can go wrong and what the design does about it.\n7. Out of scope: explicit list of what is NOT being built in this iteration.\n8. Open questions: unresolved decisions that engineering may need to flag or unblock.\n\n## Component Inventory\n\nFor each component, document:\n- Name (must match the design system component name exactly, or note if it is new).\n- Variants or props that this feature uses.\n- Any one-off overrides applied that deviate from the base component.\n- Whether the component is new, modified, or used as-is.\n\nDo not attach a full component API spec here — link to the design system documentation and annotate only the delta.\n\n## Design Tokens\n\nList tokens in four groups: color, spacing, typography, shadow/elevation. For each:\n- Token name as it appears in the design system (e.g. 'color-surface-primary').\n- Where it is used in this feature (e.g. 'card background, modal overlay').\n- Flag any place where a raw value was used instead of a token — these are tech debt and must be resolved before implementation or explicitly accepted as exceptions.\n\n## Interaction States\n\nFor every interactive element, enumerate all states:\n- Default, hover, focus, active, disabled.\n- Loading, empty, error, and success states where applicable.\n- For each state: what changes visually (color, icon, text, layout shift) and what triggers it.\n- Do not assume engineers will infer states from a single default-state frame.\n\n## Edge Cases and Constraints\n\nThis section prevents the most implementation bugs. Document:\n- Empty states: what renders when a list has zero items, a field is blank, or an image fails to load.\n- Long content: maximum character counts, what happens when they are exceeded (truncate, wrap, error).\n- Error states: per-field and form-level errors, API failure states, and timeout messaging.\n- Internationalization: if the product is translated, flag any layout that breaks with 2x text length.\n- Permission and role variations: if the UI differs by user role, document each variant.\n\n## Acceptance Criteria Alignment\n\nClose the document with a checklist an engineer can use to self-QA before handing back for design review. Each item is a binary pass/fail statement (e.g. 'Empty state illustration renders when zero results are returned'). Limit to 8-12 items focused on design fidelity, not engineering correctness.",
  },
  // ── document-studio ──
  {
    slug: "slide-deck-builder",
    name: "Slide Deck Builder",
    category: "productivity",
    description: "Structures a persuasive slide deck with a clear narrative arc, one-idea-per-slide discipline, and headlines that are takeaways not labels. Use when building any presentation that needs to move an audience to action.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["presentations","slides","storytelling","decks","persuasion"],
    install_count: 28400,
    rating_avg: 4.8,
    rating_count: 1240,
    skill_content: "---\nname: Slide Deck Builder\ndescription: Structure a persuasive slide deck — narrative arc, one-idea-per-slide discipline, and headlines written as takeaways not labels. Use when building any presentation that must move an audience to a decision.\n---\n\n# Slide Deck Builder\n\nA slide deck is an argument, not a filing cabinet. Every structural choice either advances or dilutes the central point. Build the narrative before touching any slide.\n\n## Build the spine first\n\nBefore writing a single slide, answer three questions in writing:\n1. What does the audience believe now?\n2. What should they believe or do after?\n3. What is the single most important thing standing between those two states?\n\nThat gap is the deck's job. Every slide serves the journey across it. A deck that does not answer all three is not ready to build.\n\n## Narrative arc\n\nDefault structure for a decision-driving deck:\n- Situation — shared context the audience already holds as true\n- Complication — what changed or what is broken; the tension\n- Resolution — the proposed path forward\n- Proof — evidence the resolution works\n- Ask — the specific decision or action requested\n\nNever start with the ask. Never bury the complication in slide 9.\n\n## One idea per slide\n\nIf a slide requires a sub-bullet to be understood, it has two ideas. Split it. The test: cover the body and read only the headline. If the point still lands, the slide is right. If the body is doing the work, the headline is wrong.\n\nDo not use slides as documents. If content requires more than 40 words to be understood, it belongs in an appendix or a leave-behind — not on a live slide.\n\n## Headlines as takeaways\n\nEvery headline should be a complete, opinionated sentence — not a topic label.\n\n- Wrong: 'Market Analysis'\n- Right: 'The market is growing 3x faster than our current capacity'\n\nA reader who only reads headlines should get the whole argument. If the headlines form a logical chain, the deck is structurally sound.\n\n## Slides to audit before finalizing\n\n- Slide 1 (title): Does it name the audience's problem, not the presenter's topic?\n- Agenda slide: Cut it unless the deck is longer than 20 slides or the audience is unfamiliar with each other.\n- 'About us' slide: Move it to the appendix unless credibility is genuinely in question.\n- Last slide: The final slide should show the ask, not 'Thank You'.\n\n## Escape hatches\n\nFor conference talks, lead with the resolution — audiences came to learn, not to be convinced. For investor decks, follow the problem / solution / traction / team / ask sequence. For board updates, lead with the decision needed; context comes after.",
  },
  {
    slug: "spreadsheet-model-builder",
    name: "Spreadsheet Model Builder",
    category: "data",
    description: "Builds clean, auditable spreadsheet models with proper layout, separated assumptions, and formula hygiene. Use when creating financial models, operational forecasts, or any analytical model a second person must review or extend.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["spreadsheets","models","finance","data","forecasting"],
    install_count: 19700,
    rating_avg: 4.7,
    rating_count: 890,
    skill_content: "---\nname: Spreadsheet Model Builder\ndescription: Build clean, auditable spreadsheet models — separated assumptions, consistent formula hygiene, and a layout a second analyst can navigate without a guide. Use for financial models, forecasts, or any model reviewed by others.\n---\n\n# Spreadsheet Model Builder\n\nA good spreadsheet model is auditable, extensible, and self-documenting. The goal is not to impress with complexity but to be right in a way anyone can verify.\n\n## Sheet structure\n\nSeparate the model into distinct sheets with clear roles:\n- 'Inputs' or 'Assumptions' — every editable variable lives here, and only here\n- 'Calcs' or intermediate sheets — derived values, never raw inputs\n- 'Output' or 'Summary' — the final numbers a reader cares about\n- 'Data' — raw imported or pasted data, never edited by hand\n\nNo hardcoded number should appear inside a formula. If a value might ever change, it is an input.\n\n## Assumption sheet rules\n\nGroup assumptions by theme (revenue, costs, headcount, timing). Label every row clearly — include units and the basis for the assumption in an adjacent note column. Color-code inputs distinctly (e.g., blue text on white) so auditors can identify them at a glance without reading a legend.\n\nDate the assumption set. When a model has multiple scenarios, each scenario is a separate column in the Inputs sheet — not a separate file.\n\n## Formula hygiene\n\nOne formula per row, consistent across all columns. If row 5 sums differently in column D than in column E, something is wrong. Audit with Ctrl+backslash (Windows) or Cmd+backslash (Mac) to spot inconsistencies.\n\nAvoid:\n- Nested IF chains deeper than two levels — use a lookup table or helper column\n- INDIRECT — it hides dependencies and breaks refactoring\n- Volatile functions (NOW, RAND, OFFSET) in calculation paths — they recalculate constantly and obscure change\n\nPrefer INDEX+MATCH over VLOOKUP; it handles column insertions without breaking.\n\n## Navigation and legibility\n\n- Freeze the top row and leftmost label column on every sheet\n- Use consistent date formatting (YYYY-MM or MMM-YY) across all sheets\n- Left-align text labels, right-align numbers, center column headers\n- Keep column widths consistent within a section\n- Never merge cells in data ranges — it breaks sorting, filtering, and formulas\n\n## Audit trail\n\nBefore sharing, document three things in a 'Cover' sheet: what the model does, what the key assumptions are, and what changed in the last update. A model without a cover note is incomplete.",
  },
  {
    slug: "formatted-report-writer",
    name: "Formatted Report Writer",
    category: "writing",
    description: "Produces well-structured long-form reports with clear hierarchy, executive summaries, and visual skimmability. Use when writing consulting reports, research documents, strategy briefs, or any document over 1,000 words that a busy reader must navigate.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["reports","writing","structure","business","documents"],
    install_count: 22100,
    rating_avg: 4.6,
    rating_count: 1050,
    skill_content: "---\nname: Formatted Report Writer\ndescription: Produce well-structured long-form reports with clear hierarchy, executive summaries, and skimmability. Use when writing consulting reports, research documents, or strategy briefs a busy reader must navigate in under two minutes.\n---\n\n# Formatted Report Writer\n\nA business report has two audiences: the executive who reads only the summary, and the analyst who reads everything. A good report serves both without making either feel like a second-class reader.\n\n## Before writing: purpose and audience\n\nAnswer in one sentence each:\n- What decision or action does this report enable?\n- Who is the primary reader, and what do they already know?\n- What does the reader need to believe by the end?\n\nIf these are unclear, the report structure will be unclear. Do not begin drafting until these are settled.\n\n## Document skeleton\n\nDefault structure for a business or consulting report:\n1. Title block — title, author, date, version\n2. Executive summary — 150 to 250 words; stands alone; includes the recommendation\n3. Background / context — shared facts and scope boundaries\n4. Findings — the substance, organized by theme not chronology\n5. Analysis — what the findings mean and why it matters\n6. Recommendations — numbered, prioritized, actionable\n7. Appendix — supporting data, methodology, raw research\n\nEach section begins with a one-sentence statement of what it covers. Readers navigating quickly will thank you.\n\n## Heading hierarchy\n\nThree levels maximum. Use them consistently:\n- H1 for major sections (numbered in formal reports)\n- H2 for subsections within a major section\n- H3 only when a subsection has meaningful internal structure\n\nNever use heading levels for visual emphasis. If content needs emphasis, bold a sentence or use a callout box.\n\n## Skimmability rules\n\n- No paragraph longer than 6 lines in the findings and analysis sections\n- Every section has a clear topic sentence in the first or second line\n- Use numbered lists for sequences and ranked items; bullet lists for parallel non-sequential items\n- Tables beat prose for any comparison of 3 or more items across 2 or more attributes\n- Bold the key term or finding once per paragraph — not every important word\n\n## Tone and register\n\nMatch the register to the context: formal for board and regulatory documents, plain for internal ops reports. Default to plain — clear sentences over impressive vocabulary. A report that requires a second read to be understood has failed.\n\nPassive voice is a red flag. 'Revenue declined 18%' beats 'An 18% decline in revenue was observed.'",
  },
  {
    slug: "data-table-design",
    name: "Data Table Design",
    category: "data",
    description: "Designs tables that are easy to read and interpret — proper alignment, consistent precision, meaningful sort order, and correct totals. Use when presenting tabular data in reports, dashboards, or documents where misreading a number has consequences.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["tables","data","design","readability","formatting"],
    install_count: 14300,
    rating_avg: 4.5,
    rating_count: 580,
    skill_content: "---\nname: Data Table Design\ndescription: Design tables that communicate clearly — alignment, consistent precision, meaningful sort order, and well-placed totals. Use when presenting tabular data where a misread number has real consequences.\n---\n\n# Data Table Design\n\nA table is not a spreadsheet dump. Every formatting choice either helps or hinders the reader's ability to compare, rank, and interpret values.\n\n## Alignment\n\n- Right-align all numeric columns without exception — alignment makes magnitude visible at a glance\n- Left-align text columns\n- Center column headers only when the column is narrow and centering does not create visual disconnection from the values below\n- Never mix alignments within a single column\n\n## Numeric precision\n\nConsistency within a column matters more than absolute precision. Rules:\n- Currency: two decimal places for unit prices; zero for large aggregates (1,240,000 not 1,240,000.00)\n- Percentages: one decimal place unless the context is scientific\n- Large numbers: use K, M, B suffixes with a note of the unit in the header rather than printing eight digits\n- If a column mixes values at different scales (some in thousands, one in millions), flag the outlier with a footnote rather than changing the column format\n\nNever imply false precision — round to the significant figures the data actually supports.\n\n## Sort order\n\nDefault to the sort order that answers the reader's most likely question:\n- Rankings: descending by primary metric\n- Time series: chronological\n- Categories with no natural order: alphabetical or by a meaningful grouping variable\n- Never present data in database row order unless that order is meaningful\n\n## Totals and subtotals\n\n- Totals belong at the bottom of the column, not the top\n- Use a visible separator (bold row, horizontal rule, or shaded background) above totals\n- Averages and totals should not appear in the same row unless explicitly labeled — they are different statistics\n- For percentage columns, a column total is rarely meaningful; show it only when the column sums to 100% by design\n\n## Column and row density\n\n- Include only columns the reader needs to act on or compare. Every unnecessary column adds cognitive load.\n- For tables wider than 8 columns, consider whether a chart or two smaller tables communicate better\n- Freeze or repeat the label column when a table scrolls horizontally\n- Alternate row shading (zebra striping) is acceptable for tables taller than 15 rows; avoid it for short tables\n\n## Headers\n\nEvery column header should name the metric and the unit. 'Revenue' is incomplete. 'Revenue (USD, thousands)' is correct. Avoid abbreviations unless they are universal in the reader's context.",
  },
  {
    slug: "one-pager-designer",
    name: "One-Pager Designer",
    category: "writing",
    description: "Writes a tight one-pager that lands a single decision or pitch — problem, solution, evidence, and ask in one page. Use when preparing a proposal, product brief, project pitch, or any document where the reader should finish in under three minutes.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["one-pager","writing","pitch","brevity","documents"],
    install_count: 31600,
    rating_avg: 4.9,
    rating_count: 1780,
    skill_content: "---\nname: One-Pager Designer\ndescription: Write a tight one-pager that lands a single decision or pitch — problem, proof, and ask in one page. Use when preparing a proposal, brief, or pitch where the reader should finish in under three minutes.\n---\n\n# One-Pager Designer\n\nA one-pager is a commitment device. By confining the argument to one page, you are forced to know what matters and discard what does not. It is not a short document; it is a complete argument at compression.\n\n## One-pager vs. executive summary\n\nAn executive summary condenses a longer document. A one-pager is the whole argument — it stands alone and does not require a parent document to make sense. Design it to be forwarded, printed, or shared independently.\n\n## Structure\n\nDefault layout for a decision-driving one-pager:\n\n1. Header — title, author, date, and a single-sentence purpose statement\n2. Problem or Opportunity — two to four sentences stating what is broken or what is at stake; ground it in a specific fact or number\n3. Proposed solution or recommendation — two to four sentences; concrete, not aspirational\n4. Evidence or rationale — three to five bullets; each one fact or precedent, not assertion\n5. Impact — what success looks like, quantified if possible\n6. Ask — the exact decision or action, named precisely\n\nSix sections. One page. No exceptions.\n\n## Density rules\n\n- Every sentence should earn its place. Read each line and ask: does removing this change anything? If not, cut it.\n- No introductory sentences that restate the title ('This one-pager addresses...')\n- No hedging unless the hedge changes the ask ('This assumes budget approval')\n- Numbers beat adjectives. 'Reduces processing time by 40%' beats 'significantly faster'\n\n## The ask\n\nThe ask must be:\n- Specific — name the exact decision, resource, or approval needed\n- Actionable — something the reader can say yes or no to right now\n- Time-bounded — include a deadline or decision window when relevant\n\nVague asks ('support this initiative') are not asks. They are requests to feel good about something.\n\n## Format\n\nSingle column of text is preferable to a two-column layout for most use cases — it reads faster and prints cleanly. Use one level of hierarchy: a bold label per section. No nested bullets. Whitespace is not waste; a one-pager that tries to fill every pixel is harder to read than one with breathing room.",
  },
  {
    slug: "document-template-system",
    name: "Document Template System",
    category: "productivity",
    description: "Creates reusable document templates and style conventions for a team — naming, structure, variables, and maintenance. Use when establishing a shared documentation standard or building a library of repeatable business document formats.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["templates","standards","team","productivity","documentation"],
    install_count: 11800,
    rating_avg: 4.6,
    rating_count: 640,
    skill_content: "---\nname: Document Template System\ndescription: Create reusable document templates and style conventions for a team — structure, variables, naming, and maintenance protocols. Use when establishing shared documentation standards or building a repeatable library of business document formats.\n---\n\n# Document Template System\n\nA template is not a filled-out document with blanks. It is a decision made once so the team does not have to make it again. The best template systems are lightweight, self-explanatory, and maintained by one person.\n\n## Before building templates\n\nAudit what documents the team actually produces. List the top 10 by frequency. Build templates only for the top 5. Attempting to template everything produces a system nobody uses.\n\nFor each candidate template, answer:\n- Who authors this document, and how often?\n- Who reads it, and what do they do with it?\n- What varies between instances, and what should stay constant?\n\n## Template anatomy\n\nEvery template should contain four elements:\n\n1. Purpose block — a single paragraph (for the author's eyes) stating what the template is for, when to use it, and what it is not for. This block is deleted before sending the document.\n2. Required sections — sections that must appear in every instance; label them 'REQUIRED'\n3. Optional sections — sections relevant only in some cases; label them 'OPTIONAL — include if [condition]' and remove the label when used\n4. Variables — clearly marked placeholders for instance-specific content, written as [VARIABLE NAME IN CAPS] so they are visually distinct and easy to find with text search\n\n## Style conventions\n\nDocumentation style is a team-level decision, not a document-level decision. Establish once and enforce everywhere:\n- Date format: YYYY-MM-DD for machine-readable contexts, 'June 17, 2026' for documents intended for executives or external parties\n- Version numbering: v1.0 for first publish, v1.1 for minor updates, v2.0 for structural changes\n- Owner field: every document has exactly one owner; ownership is a person, not a team\n- Status values: use a fixed set (Draft / In Review / Approved / Archived) and apply them consistently\n\n## Naming conventions\n\nA file name should answer three questions without opening the file: what is it, who owns it, and how current is it.\n\nDefault format: [DocumentType]-[Subject]-[Owner]-[Date or Version]\nExample: Report-Q2-Revenue-Ouellet-2026-06\n\nAvoid descriptors like 'final', 'final-v2', or 'latest' in file names — they are lies waiting to happen.\n\n## Template maintenance\n\nAssign one maintainer per template library. Schedule a quarterly review. At each review: retire templates unused in the past year, update style conventions, and collect one piece of author feedback per active template. A system that cannot be maintained will be abandoned.",
  },
  // ── engineering-manager-toolkit ──
  {
    slug: "tech-debt-prioritizer",
    name: "Tech Debt Prioritizer",
    category: "productivity",
    description: "Inventory and prioritize tech debt by cost-of-delay and leverage. Use when planning a quarter, grooming a debt backlog, or defending investment to stakeholders.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["tech-debt","prioritization","planning","engineering-management"],
    install_count: 18400,
    rating_avg: 4.7,
    rating_count: 612,
    skill_content: "---\nname: Tech Debt Prioritizer\ndescription: Inventories and prioritizes tech debt items using cost-of-delay and leverage scoring. Use during quarterly planning, backlog grooming, or when preparing a debt investment proposal for leadership.\n---\n\n# Tech Debt Prioritizer\n\nTech debt decisions fail when made on vibes ('this code is ugly') or recency bias. This skill applies a lightweight economic frame so the right items get funded and the rest stay parked.\n\n## Step 1 — Build the Inventory\n\nCollect candidate items from three sources: team retros and Slack complaints (friction signals), recent incident post-mortems (reliability signals), and areas with high cycle time or frequent revert rate (velocity signals). Each item needs a one-line description, the system it lives in, and the owner who raised it. Resist the urge to filter at this stage.\n\n## Step 2 — Score Each Item on Two Axes\n\nUse a 1-3 scale for each axis. Cost of delay: how much does leaving this unaddressed cost per sprint in engineer time, incident risk, or opportunity cost? Leverage: how many future features or workflows does fixing this unblock or accelerate? Multiply the two scores to get a priority index. Items scoring 9 are immediate candidates; items scoring 1-2 belong in a parking lot.\n\n## Step 3 — Classify by Quadrant\n\nPlot items on a 2x2: high cost-of-delay / high leverage (do now), high cost-of-delay / low leverage (schedule this quarter), low cost-of-delay / high leverage (opportunistic — fold into adjacent work), low / low (document and defer). Never let the parking lot grow without a quarterly review gate that drops items older than 6 months.\n\n## Step 4 — Size and Assign\n\nFor each 'do now' or 'this quarter' item, capture a rough t-shirt size (S / M / L / XL) and a proposed owner. Avoid assigning all debt to the same two senior engineers. Debt work is a career-growth opportunity when scoped well.\n\n## Step 5 — Write the Proposal\n\nWhen pitching to leadership, lead with business impact, not code quality. Frame it as: 'This item currently costs us X per sprint / caused Y incident / blocks Z initiative. Fixing it takes N engineer-weeks. The expected return is...' Skip the architecture lecture.\n\n## Escape Hatches\n\nIf the backlog is enormous, timebox the inventory phase to 60 minutes and cap the list at 20 items. If stakeholders resist all debt investment, propose a 'debt tax': reserve 15-20% of each sprint and never negotiate below 10%.",
  },
  {
    slug: "sprint-retro-facilitator",
    name: "Sprint Retro Facilitator",
    category: "productivity",
    description: "Facilitates a sprint retrospective that surfaces real issues and produces owned, specific actions. Use before or during a retro to structure agenda, prompts, and action tracking.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["retrospective","agile","team-process","facilitation","engineering-management"],
    install_count: 22100,
    rating_avg: 4.6,
    rating_count: 843,
    skill_content: "---\nname: Sprint Retro Facilitator\ndescription: Structures and facilitates sprint retrospectives that surface real issues and generate owned, specific action items. Use before or during a retro to prepare agenda, prompts, and follow-up tracking.\n---\n\n# Sprint Retro Facilitator\n\nMost retros produce the same three actions every sprint and close nothing. This skill forces specificity, surfaces the issues people are actually thinking, and ends with someone's name on every action.\n\n## Before the Session (10 minutes)\n\nReview the previous retro's action items first. Open with their status: done, in progress, or dropped. If more than half were dropped, say so plainly — this is itself a retro topic. Set a timer and a note-taker. Aim for 60 minutes maximum; 45 is better.\n\n## Gathering Data (15 minutes)\n\nUse a silent brainstorm before discussion — individuals write items on sticky notes or a shared board without seeing each other's input. This prevents the most vocal person from anchoring the group. Prompt with three columns: 'What slowed us down?', 'What went well that we should protect?', 'What are we not saying out loud?' The third column is the most valuable and most often skipped.\n\n## Dot-Vote and Cluster (5 minutes)\n\nGive each person 3 votes. Cluster near-duplicate items. The top 2-3 clusters by votes become the discussion topics. This respects the group's actual priorities, not the facilitator's.\n\n## Discussion (20 minutes)\n\nFor each topic: state the observation as a system problem, not a person problem. Ask 'what made this likely to happen?' before 'what should we do?' Root-cause one level deeper than the surface complaint — if the answer is 'we need better communication,' that is not a root cause. Push for the structural or process condition that produced the failure.\n\n## Action Items (10 minutes)\n\nEvery action item needs three fields: what exactly will change, who owns it (one name, not 'the team'), and when it will be done or reviewed. Cap actions at 3 per retro. More than 3 almost never close. If there are more, vote on the top 3 and park the rest in a visible backlog.\n\n## Anti-Patterns to Name Aloud\n\nIf the same item appears in three consecutive retros with no progress, escalate it — it is either blocked by something outside the team's control or no one actually owns it. Name both possibilities explicitly.",
  },
  {
    slug: "hiring-scorecard",
    name: "Hiring Scorecard Builder",
    category: "productivity",
    description: "Builds a structured interview scorecard tied to role-specific signals. Use when opening a new role or calibrating an existing loop to reduce inconsistency and interviewer bias.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["hiring","interviews","scorecard","bias-reduction","engineering-management"],
    install_count: 14700,
    rating_avg: 4.8,
    rating_count: 480,
    skill_content: "---\nname: Hiring Scorecard Builder\ndescription: Builds structured interview scorecards tied to role-specific signals to reduce bias and improve calibration. Use when opening a new role or auditing an existing interview loop for consistency.\n---\n\n# Hiring Scorecard Builder\n\nUnstructured interviews have poor predictive validity and amplify the biases of whoever talks most. A scorecard forces interviewers to decide what matters before meeting the candidate and to gather evidence, not impressions.\n\n## Step 1 — Define the Role's Top 4-6 Signals\n\nStart from the first 90-day outcomes, not a list of desired traits. Ask: what does success look like concretely at 30, 60, and 90 days? Then work backward to the signals a candidate would have to demonstrate to make those outcomes likely. Good signals are observable in a conversation. Bad signals are adjectives ('smart', 'passionate', 'culture fit').\n\n## Step 2 — Map Signals to Interview Slots\n\nEach interviewer owns 1-2 signals. Never have two interviewers independently assess the same signal with no calibration plan — duplication wastes time and creates conflicting data. Assign technical depth signals to engineers, cross-functional signals to PMs or peers, and leadership/judgment signals to the hiring manager.\n\n## Step 3 — Write the Scoring Rubric\n\nFor each signal, write what a 1 (does not meet bar), 3 (meets bar), and 5 (exceeds bar) looks like in observable terms. Example for 'navigates ambiguity': a 1 asks for requirements to be fully specified before acting; a 3 defines scope, makes assumptions explicit, and validates them; a 5 proactively creates structure where none exists and coaches others through it. The rubric must be written before interviews start.\n\n## Step 4 — Require Evidence, Not Ratings\n\nThe scorecard submission form has two fields per signal: a numeric score AND a required evidence quote from the candidate. No evidence, no score. This prevents post-hoc rationalization and makes debrief discussions concrete.\n\n## Step 5 — Run a Calibrated Debrief\n\nCollect scores independently before the debrief meeting. Start by reading scores aloud before anyone speaks. Then discuss only the signals where scores diverge by 2 or more points — those are the interesting ones. The hiring manager does not share their view first; they synthesize last.\n\n## Escape Hatches\n\nFor a high-volume pipeline, reduce to 3 signals and a 3-point scale. For a senior or staff role, add a written exercise component and score the artifact, not the person's delivery style.",
  },
  {
    slug: "eng-status-rollup",
    name: "Eng Status Rollup",
    category: "productivity",
    description: "Rolls up team engineering status into a concise exec-ready update covering progress, risks, and asks. Use weekly or before leadership syncs to communicate clearly without noise.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["communication","status-update","leadership","reporting","engineering-management"],
    install_count: 31200,
    rating_avg: 4.5,
    rating_count: 1140,
    skill_content: "---\nname: Eng Status Rollup\ndescription: Rolls up team engineering status into an exec-ready update covering progress, risks, and asks. Use weekly or before leadership syncs to replace noise with a clear signal.\n---\n\n# Eng Status Rollup\n\nExecs do not need a feature list. They need to know: are we on track, what might go wrong, and what do you need from them? Everything else is noise that buries the signal.\n\n## The Three-Section Format\n\nEvery rollup uses exactly three sections. Progress: what shipped or advanced materially since the last update. Risk and blockers: what is threatening the plan, and what is the current mitigation. Asks: what decision or resource is needed from leadership, with a deadline.\n\n## Progress Section Rules\n\nLead with outcomes, not activities. 'Auth service is live for 20% of users' beats 'We finished the auth service work.' If nothing shipped, say so and explain why in one sentence. Avoid velocity metrics that require context to interpret; use milestone language instead. Cap this section at 4 bullet points.\n\n## Risk and Blockers Section Rules\n\nEach risk gets: a one-line description, the likelihood (high / medium / low), the impact if it materializes, and the current mitigation. Do not soft-pedal risks to look in control — the rollup's credibility depends on raising real issues before they blow up. A status report with no risks is almost always missing something.\n\n## Asks Section Rules\n\nAn ask is a specific decision or resource with a clear owner and a date by which a response is needed. 'We need more headcount' is not an ask. 'We need approval to hire 1 senior backend engineer in Q3 to hit the platform migration date; decision needed by July 1' is an ask. No more than 2 asks per update — more than that suggests prioritization has not happened yet.\n\n## Delivery and Tone\n\nSend in writing before any verbal sync so recipients can read it in advance. Use plain language; avoid internal jargon or acronyms without definition. The rollup should be scannable in under 90 seconds. If it takes longer, cut it.\n\n## When to Add a Fourth Section\n\nA 'Looking Ahead' section is appropriate when a significant decision point, launch, or dependency falls in the next two weeks. Keep it to 2-3 bullets. Do not add it by default — it often becomes a place to hide the real news in future-tense optimism.",
  },
  {
    slug: "performance-review-writer",
    name: "Performance Review Writer",
    category: "productivity",
    description: "Writes fair, specific, evidence-based performance reviews and ratings. Use when drafting or calibrating reviews to reduce recency bias, vague language, and inconsistent ratings.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["performance-reviews","feedback","people-management","calibration","engineering-management"],
    install_count: 26800,
    rating_avg: 4.9,
    rating_count: 2180,
    skill_content: "---\nname: Performance Review Writer\ndescription: Writes fair, specific, evidence-based performance reviews and ratings. Use when drafting or preparing for calibration to reduce recency bias and vague praise or criticism.\n---\n\n# Performance Review Writer\n\nPerformance reviews are legally significant, career-defining, and often written in 20 minutes from memory. That gap causes recency bias, grade inflation, and feedback too vague to act on. This skill closes it.\n\n## Before Writing: Gather Evidence First\n\nCollect raw material from four sources before writing a word: the employee's self-review, peer feedback verbatims, the role's defined expectations for their level, and a concrete list of their work from the review period (PRs merged, projects owned, incidents handled, cross-functional contributions). Do not write from memory. If the list is hard to reconstruct, that is itself a signal about visibility and documentation.\n\n## Rating Calibration\n\nStart from the role expectations document, not a bell curve. Ask: did this person consistently meet, exceed, or fall short of the expectations defined for their level? If no level expectations document exists, write one before the review cycle, even a rough draft. Ratings applied without a standard are arbitrary.\n\n## Writing the Narrative\n\nOpen with a one-sentence summary of the overall rating and why. Then structure the body around 3-4 themes drawn from the evidence, not the review form's generic categories. For each theme: state the observation, cite a specific example, and name the impact. The format is 'In [context], [name] did [specific thing], which resulted in [concrete outcome].' Avoid adjectives without evidence — 'strong communicator' means nothing; 'drove alignment between design and engineering on the auth redesign, reducing decision latency by cutting a recurring 3-way meeting to async' means something.\n\n## Development Section\n\nEvery review includes one primary growth area and one specific suggested action for the next review period. Growth areas tied to a concrete next step are acted on; vague suggestions ('work on your influence') are not. Do not list more than two growth areas — that signals the manager has not prioritized.\n\n## Common Mistakes to Avoid\n\nHalo effect: one visible win or loss skewing the whole rating. Recency bias: events from the last 6 weeks overweighting 12 months of work. Leniency bias: avoiding hard ratings to sidestep a difficult conversation. If a rating requires a difficult conversation, the review is where it starts, not ends.",
  },
  {
    slug: "team-health-check",
    name: "Team Health Check",
    category: "productivity",
    description: "Assesses team health across delivery, morale, and clarity dimensions and surfaces actionable signals. Use quarterly or when sensing drift, burnout, or process breakdown.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["team-health","morale","delivery","people-management","engineering-management"],
    install_count: 11900,
    rating_avg: 4.6,
    rating_count: 395,
    skill_content: "---\nname: Team Health Check\ndescription: Assesses team health across delivery, morale, and clarity signals and maps them to concrete manager actions. Use quarterly or when sensing drift, burnout, or process breakdown on the team.\n---\n\n# Team Health Check\n\nTeam health degrades slowly and then suddenly. By the time attrition or missed deadlines make it visible to leadership, the manager has had months of earlier signals to act on. This skill makes those signals explicit.\n\n## The Three Dimensions\n\nAssess health across three dimensions independently: delivery (are we shipping reliably?), morale (do people want to be here and work together?), and clarity (does the team know what to build, why, and how decisions get made?). A team can be green on delivery and red on morale — treating them as a single score masks the actual problem.\n\n## Delivery Signals\n\nReview the last 8 weeks: sprint completion rate, number of items carried over more than twice, frequency of unplanned work interrupting the sprint, and time from 'done' to deployed. Declining trends in any two of these warrant a process conversation. High carry-over usually points to scoping problems or dependency mismanagement, not team effort.\n\n## Morale Signals\n\nMorale is harder to measure but not invisible. Early signals: declining participation in optional meetings, shorter 1:1s initiated by the team member, increase in PTO clustering, drop in Slack/async engagement, or more closed-door conversations the manager is not part of. Survey data helps but lags reality by weeks. The primary instrument is weekly 1:1 quality — if 1:1s feel performative, that is a morale indicator.\n\n## Clarity Signals\n\nAsk three questions in your next team meeting without priming: What is the team's top priority this quarter? Why does that priority matter to the company? Who makes the final call when the team disagrees on an approach? Misaligned answers indicate a clarity gap. Clarity problems are almost always a manager communication problem, not a team comprehension problem.\n\n## Action Mapping\n\nAfter assessing, map each red or yellow signal to a specific action with a 2-week horizon. Do not try to fix all three dimensions at once — pick the one that is both most degraded and most within the manager's direct control. Delivery problems often respond to process changes. Morale problems often require individual conversations before structural changes. Clarity problems require the manager to write things down and repeat them consistently.\n\n## When to Escalate\n\nIf morale is red for two consecutive quarters despite intervention, this is not a team problem — it is a signal about team-org fit, leadership above the manager, or a systemic issue the manager cannot resolve alone. Escalate with a written summary of what was tried and what did not move.",
  },
  // ── incident-response-command ──
  {
    slug: "sev-triage",
    name: "SEV Triage",
    category: "coding",
    description: "Classify incident severity (SEV1-4) using impact, scope, and urgency signals. Decides who to page and what response posture to take. Use when an alert fires or a report comes in.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sre","incidents","on-call","triage","alerting"],
    install_count: 18400,
    rating_avg: 4.8,
    rating_count: 412,
    skill_content: "---\nname: SEV Triage\ndescription: Classifies incident severity (SEV1-4) using impact, scope, and urgency signals and decides who to page. Use when an alert fires or a report comes in and a severity call must be made quickly.\n---\n\n# SEV Triage\n\nSeverity is a paging decision, not a feelings meter. Assign the highest SEV that any single signal justifies, then downgrade only with evidence.\n\n## Severity Definitions\n\n- SEV1 — Revenue-impacting or total service loss. More than 5% of users cannot complete a critical flow. Data loss or breach possible. Page IC + engineering lead + exec on-call immediately.\n- SEV2 — Significant degradation. Core feature broken for a subset, elevated error rate above SLO breach threshold, or a workaround exists but is unacceptable long-term. Page IC + team on-call within 5 minutes.\n- SEV3 — Partial or minor degradation. Non-critical feature affected, SLO still within budget, no customer escalations yet. Ticket created, team notified async, fix before next business day.\n- SEV4 — Cosmetic or edge case. No user impact, caught proactively. Ticket only.\n\n## Signal Checklist\n\nAnswer these to land on a SEV. First 'yes' that matches wins.\n\n1. Is a payment, auth, or data-integrity flow broken for any user? -> SEV1 candidate.\n2. Is error rate above your SLO threshold for the last 10 minutes? -> SEV2 at minimum.\n3. Are multiple regions or availability zones affected? -> Escalate one level.\n4. Is there active data exfiltration or corruption risk? -> SEV1 regardless of user count.\n5. Is a single non-critical endpoint slow but the rest healthy? -> SEV3.\n\n## Scope Multipliers\n\n- Blast radius: estimate percentage of users affected. Below 1% rarely justifies SEV1 unless the 1% are paying customers or the data risk is severe.\n- Growth rate: is impact spreading? A SEV3 that doubles every 10 minutes is a SEV2.\n- Detection lag: if the issue started more than 30 minutes ago undetected, assume blast radius is larger than current signals show.\n\n## Who to Page\n\n- SEV1: IC (incident commander), service owner, on-call SRE, and engineering lead. Open a war room immediately.\n- SEV2: IC and service owner on-call. Invite others as needed.\n- SEV3: Service team on-call async. No war room.\n- SEV4: Ticket, no page.\n\n## Do / Don't\n\n- Do: assign SEV before investigating root cause. Severity is about impact now, not cause.\n- Do: re-triage every 30 minutes. A SEV2 resolved is a SEV4; a SEV3 spreading is a SEV1.\n- Don't: under-SEV to avoid waking people. False SEV1s are cheaper than missed ones.\n- Don't: wait for a second data point before paging on a potential SEV1.\n",
  },
  {
    slug: "runbook-writer",
    name: "Runbook Writer",
    category: "coding",
    description: "Writes an operational runbook for a service covering symptoms, diagnostic checks, mitigations, and escalation paths. Use when a new service ships or an existing one lacks documented incident procedures.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sre","runbook","operations","incidents","documentation"],
    install_count: 22700,
    rating_avg: 4.7,
    rating_count: 538,
    skill_content: "---\nname: Runbook Writer\ndescription: Writes an operational runbook for a service covering symptoms, diagnostic checks, mitigations, and escalation paths. Use when shipping a new service or when an existing service lacks incident procedures.\n---\n\n# Runbook Writer\n\nA runbook is a recipe for a tired engineer at 2 AM. It must answer: what is broken, how do I confirm it, what do I try first, and when do I give up and escalate.\n\n## Required Sections\n\nEvery runbook gets exactly these sections in this order.\n\n### 1. Service Overview (3-5 lines)\n\nState what the service does, its criticality (which SEVs it can cause), its SLO target, and its direct dependencies. Skip history and rationale.\n\n### 2. Symptoms and Alerts\n\nList each alert that fires for this service. For each:\n- Alert name and what condition triggers it.\n- What it means in plain language (not the PromQL).\n- Expected SEV range when it fires.\n\n### 3. Diagnostic Checks\n\nNumbered, runnable steps. Each step must be executable in under 2 minutes.\n\n1. Check service health endpoint and current error rate dashboard link.\n2. Check dependency health (upstream/downstream) — list the specific dashboards or commands.\n3. Check recent deploys: confirm or rule out a code change as cause.\n4. Check resource saturation: CPU, memory, disk, connection pool exhaustion.\n5. Check logs for the first occurrence of the error pattern.\n\nUse real command patterns (no placeholders left for the user to invent). Mark any step that requires elevated permissions.\n\n### 4. Mitigations (ordered by speed)\n\n- Fast (under 5 min): rollback last deploy, toggle feature flag off, redirect traffic to healthy region.\n- Medium (5-30 min): scale out replicas, drain and restart unhealthy pods, flush a poisoned cache.\n- Slow (over 30 min): restore from backup, run a data repair job, coordinate with a dependency team.\n\nLabel each mitigation with its risk: Low / Medium / High. High-risk mitigations require IC approval.\n\n### 5. Escalation Path\n\n- First escalation: service team on-call. Include Slack handle or PagerDuty policy name.\n- Second escalation: platform/infra team if the issue is infrastructure-layer.\n- Third escalation: vendor support contact if a managed service (include account ID and SLA tier).\n\n### 6. Post-Incident\n\nLink to the postmortem template. Note any automatic rollback or alerting that should trigger after resolution.\n\n## Do / Don't\n\n- Do: include real URLs and command templates. A runbook without links is a paragraph, not a procedure.\n- Do: version the runbook with the service. Stale runbooks cause more harm than none.\n- Don't: document root-cause analysis in a runbook. That belongs in a postmortem.\n- Don't: write steps that require guessing or judgment without a fallback. If a step can fail, say what to do when it fails.\n",
  },
  {
    slug: "status-page-update",
    name: "Status Page Update",
    category: "writing",
    description: "Writes clear, honest customer-facing incident status updates at each lifecycle stage: investigating, identified, monitoring, and resolved. Use during active incidents to communicate with users and stakeholders.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["incidents","communication","status-page","writing","customer-facing"],
    install_count: 31200,
    rating_avg: 4.9,
    rating_count: 874,
    skill_content: "---\nname: Status Page Update\ndescription: Writes clear, honest customer-facing incident status updates at each lifecycle stage: investigating, identified, monitoring, and resolved. Use during active incidents to communicate with customers and stakeholders.\n---\n\n# Status Page Update\n\nCustomers do not need your stack trace. They need to know what is broken, whether you know about it, and when it will be fixed. Every update earns trust or burns it.\n\n## Four Stages, Four Templates\n\n### Investigating\n\nUse immediately when an issue is confirmed. You do not need a cause yet.\n\nPattern: 'We are investigating [symptom] affecting [who]. Customers may experience [observable impact]. We will post an update within [time window].'\n\nRules: Never speculate on cause. Never promise a fix time. Give a concrete next-update time and keep it.\n\n### Identified\n\nUse once root cause is understood, even if fix is not deployed.\n\nPattern: 'We have identified the cause of [symptom] as [plain-language cause — no jargon]. We are [specific action in progress] and expect [outcome] by [time]. We will post an update by [next update time].'\n\nRules: Plain-language cause only. No internal system names. Acknowledge if impact was broader than previously stated.\n\n### Monitoring\n\nUse after deploying a fix but before declaring resolved.\n\nPattern: 'We have deployed a fix for [symptom]. [Metric or signal] has returned to normal levels. We are monitoring to confirm stability and will resolve this incident once we are confident in the fix.'\n\nRules: State what you are watching. Give a realistic resolve window (usually 30-60 minutes). Do not rush to resolve — a premature resolve followed by re-open destroys trust.\n\n### Resolved\n\nUse after sustained normal operation.\n\nPattern: 'This incident is resolved. [Symptom] affected [scope] from [start time] to [end time] ([duration]). We have confirmed normal operation. A full postmortem will be published within [48-72 hours] for SEV1/2 incidents.'\n\nRules: Give actual times in the user's timezone or UTC with label. Commit to a postmortem only if you will publish one.\n\n## Tone Rules\n\n- Write at a 7th-grade reading level. No acronyms without expansion.\n- Use 'we' not 'the team' or passive voice.\n- Do not say 'sorry for the inconvenience'. Say 'We understand this impacts your work and we are moving as fast as possible.'\n- Every update must have a timestamp and a next-update time or a resolution statement.\n\n## Anti-Patterns to Avoid\n\n- Vague cause ('due to an unexpected issue'). Give at least 'a configuration error in our database layer'.\n- Missing impact scope. Say 'customers using API key authentication in us-east-1' not 'some customers'.\n- Back-to-back 'Investigating' posts with no new information. Add one new fact per update or explicitly say 'No new information yet; next update in 30 minutes.'\n",
  },
  {
    slug: "oncall-handoff",
    name: "On-Call Handoff",
    category: "productivity",
    description: "Produces a crisp on-call shift handoff note covering open incidents, watch items, recent changes, and context the incoming engineer needs. Use at the end of each on-call shift.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["on-call","handoff","sre","incidents","productivity"],
    install_count: 14800,
    rating_avg: 4.6,
    rating_count: 293,
    skill_content: "---\nname: On-Call Handoff\ndescription: Produces a crisp on-call shift handoff note covering open incidents, watch items, recent changes, and context the incoming engineer needs. Use at the end of each on-call shift to ensure continuity.\n---\n\n# On-Call Handoff\n\nA handoff note transfers your mental model, not just your ticket queue. The incoming engineer should be able to respond to the next alert without asking you anything.\n\n## Structure (use this order)\n\n### 1. Shift Summary (2-3 lines)\n\nSEV count by level, total pages received, and one-sentence characterization of the shift. 'Quiet — 2 SEV4 tickets, no pages.' or 'Rough — 1 SEV2 that took 4 hours to resolve, system is stable now.'\n\n### 2. Open Incidents\n\nFor each open or partially-resolved incident:\n- Ticket or incident ID and title.\n- Current status and last action taken.\n- What you expect to happen next and by when.\n- Who owns it if it is not on-call.\n\nIf there are none, say so explicitly. 'No open incidents.'\n\n### 3. Watch Items\n\nThings that are not incidents yet but could become one. Limit to 3-5 items.\n\nFor each: describe the signal, why it is concerning, and what threshold should trigger paging. Include the dashboard link.\n\nExample: 'Payment latency at p99 = 820ms, normal is under 400ms. No SLO breach yet. If it crosses 1s for 10 minutes, page the payments team. Link: [dashboard].'\n\n### 4. Recent Changes\n\nAny deploy, config change, migration, or infrastructure change in the last 24 hours. These are the first suspects when the next alert fires.\n\nFormat: [Time] [Service] [What changed] [Who made it] [Rollback? Y/N]\n\n### 5. Context and Notes\n\nAnything the incoming engineer needs that does not fit above. Vendor communications in progress, a scheduled maintenance window, a known flaky alert, a fix that is pending review. Keep it to bullet points.\n\n### 6. Escalation Contacts (only if non-standard)\n\nIf a vendor ticket is open or an unusual escalation path is active, list the contact and reference number here.\n\n## Do / Don't\n\n- Do: write the handoff before your shift ends, not after the next person has already started.\n- Do: link to tickets, dashboards, and Slack threads — do not copy-paste their contents.\n- Don't: include solved incidents with no follow-up. Past is past unless a watch item remains.\n- Don't: under-communicate a watch item because you think it will probably resolve. If you are watching it, they need to know.\n- Don't: use jargon the incoming engineer might not know. If the service has an unusual architecture, add one sentence of context.\n",
  },
  {
    slug: "alert-tuning",
    name: "Alert Tuning",
    category: "coding",
    description: "Reduces alert noise by making alerts actionable, symptom-based, and tied to SLOs. Identifies and kills flappy, duplicate, and cause-based alerts. Use when alert fatigue is degrading on-call response quality.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["alerting","sre","slo","observability","on-call"],
    install_count: 27600,
    rating_avg: 4.8,
    rating_count: 621,
    skill_content: "---\nname: Alert Tuning\ndescription: Reduces alert noise by making alerts actionable, symptom-based, and tied to SLOs. Identifies and kills flappy, duplicate, and cause-based alerts. Use when alert fatigue is degrading on-call response quality.\n---\n\n# Alert Tuning\n\nEvery alert that fires without requiring human action trains engineers to ignore alerts. Alert fatigue kills real incidents. The goal: every page wakes someone up for a reason they cannot automate away.\n\n## The Audit — Run First\n\nBefore writing new alert rules, audit what you have.\n\n1. Pull the last 30 days of alert history. Calculate: total pages, pages outside business hours, pages that resulted in no action taken.\n2. Identify flappy alerts: any alert that fires and resolves more than 3 times in a 24-hour window without a corresponding incident.\n3. Identify cause-based alerts: anything that fires on a system-internal metric (queue depth, pod restart count, CPU) without a direct user-impact correlation.\n4. Calculate the actionability rate: (pages with a documented remediation / total pages). Below 80% means your alert set is broken.\n\n## Symptom vs Cause\n\nPage on symptoms, not causes. Symptoms are what users experience. Causes are what engineers investigate.\n\n- Wrong: alert on CPU above 80%.\n- Right: alert on p99 latency above SLO threshold.\n- Wrong: alert on pod restart count above 2.\n- Right: alert on error rate above 1% for 5 minutes.\n\nFor every cause-based alert, ask: 'Would a user notice if this fired and nobody acted?' If no, delete it. If yes, rewrite it as the symptom the user would notice.\n\n## SLO-Based Alerting\n\nTie alerts to error budget burn rate, not raw thresholds.\n\n- Fast burn: burn rate above 14x for 5 minutes (consumes 1 hour of 30-day budget). Page immediately.\n- Slow burn: burn rate above 1x for 1 hour. Ticket or warn.\n- No burn: no page, regardless of cause-based signals.\n\nThis approach eliminates most threshold-tuning debates and makes alert severity self-documenting.\n\n## Fixing Flappy Alerts\n\n- Add a 'for' duration to the alert rule. A threshold must be sustained for at least 2-5 minutes before paging.\n- Add hysteresis: alert fires at 95% threshold, resolves only when it drops below 85%.\n- For bursty metrics, use a rate or average over a longer window (10-15 minutes) instead of instantaneous value.\n\n## Routing and Severity\n\n- Route by SLO impact, not by which team owns the metric. The team that can fix it fastest gets the page.\n- SEV1/2-level alerts: immediate page.\n- SEV3-level alerts: ticket, notify via Slack, no wake-up.\n- Never route the same alert to more than one person simultaneously. Shared ownership is no ownership.\n\n## Do / Don't\n\n- Do: delete alerts you cannot improve rather than leaving them muted. A muted alert is a lie.\n- Do: review alert history quarterly. Thresholds drift as systems scale.\n- Don't: add a new alert without deleting or merging one. Alert sets grow monotonically unless you enforce a budget.\n- Don't: alert on absence of data without accounting for scrape intervals. Missing data is not always an outage.\n",
  },
  {
    slug: "error-budget-policy",
    name: "Error Budget Policy",
    category: "coding",
    description: "Defines and applies an SLO error-budget policy that gates feature work versus reliability work based on remaining budget. Use when setting up SLOs or when burn rate is consistently high and teams lack a formal response protocol.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sre","slo","error-budget","reliability","policy"],
    install_count: 9300,
    rating_avg: 4.7,
    rating_count: 187,
    skill_content: "---\nname: Error Budget Policy\ndescription: Defines and applies an SLO error-budget policy that gates feature work versus reliability work based on remaining budget. Use when setting up SLOs or when high burn rate lacks a formal team response protocol.\n---\n\n# Error Budget Policy\n\nAn error budget without a policy is a number nobody acts on. The policy converts budget state into team behavior automatically, without requiring a manager decision each time.\n\n## Define the Budget\n\nError budget = (1 - SLO target) x window duration.\n\nExample: 99.9% SLO over 30 days = 0.1% x 30 days x 24 hours = 43.2 minutes of allowed downtime.\n\nTrack budget as a percentage remaining, not as raw minutes. 'Budget: 34% remaining' is actionable. 'Budget: 14.7 minutes remaining' is not.\n\n## Four Policy States\n\nDefine exactly four states and the automatic team behavior each one triggers.\n\n### Green (budget above 50%)\n\nFeature work proceeds at full velocity. No reliability-only sprints required. On-call improvements are encouraged but not mandatory. Treat this state as the reward for good reliability work.\n\n### Yellow (budget between 20% and 50%)\n\nFeature work continues but every sprint must include at least one reliability or observability ticket. The team reviews burn rate trend weekly. No new non-critical migrations or risky deploys without IC sign-off.\n\n### Orange (budget between 0% and 20%)\n\nFeature work is paused for engineers on the service. The team shifts to reliability work: fixing root causes of recent incidents, improving alert coverage, reducing toil. No new features ship until budget is back above 20%. Exception: security patches and compliance work.\n\n### Red (budget exhausted or SLO breach active)\n\nFreeze all feature deploys immediately. Escalate to engineering lead and product manager. Convene a reliability review within 48 hours to decide: (a) improve reliability, or (b) formally lower the SLO to match actual capability. Do not silently operate below SLO.\n\n## Budget Consumption Rules\n\n- Planned maintenance counts against the budget unless users were notified and no user-impacting errors occurred.\n- Incidents caused by a dependency consume budget. Track them separately and use the data in vendor reviews.\n- Budget does not roll over month to month. Surplus in January does not excuse a breach in February.\n\n## Governance\n\n- Publish the current budget state in the team's Slack channel weekly. One line: service name, SLO, budget remaining, state color.\n- Review SLO targets annually. An SLO that is always green without effort is set too low.\n- Product and engineering agree on the policy in writing before it is enforced. Policy surprises cause more damage than missed SLOs.\n\n## Do / Don't\n\n- Do: automate the state calculation and publish it. Manual tracking fails within two months.\n- Do: tie the policy to a real window (rolling 30 days is standard). Calendar month windows create perverse incentives at month-end.\n- Don't: let teams renegotiate the policy during an Orange or Red state. That is when pressure to bend it is highest and discipline matters most.\n- Don't: apply the same SLO to every endpoint. Tier your services: critical, standard, best-effort. Different tiers, different policies.\n",
  },
  // ── outbound-sales-engine ──
  {
    slug: "discovery-call-prep",
    name: "Discovery Call Prep",
    category: "business",
    description: "Prepares a rep for a B2B discovery call — company research, hypothesis stack, question plan, and clear call goals. Use before any first or second call with a prospect.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","discovery","b2b","research"],
    install_count: 18400,
    rating_avg: 4.8,
    rating_count: 940,
    skill_content: "---\nname: Discovery Call Prep\ndescription: Prepares a rep for a B2B discovery call — company research, hypothesis stack, question plan, and clear call goals. Use before any first or second call with a prospect.\n---\n\n# Discovery Call Prep\n\nA discovery call only earns the next step if the rep walks in with sharp hypotheses and leaves with the information needed to qualify and tailor the pitch. This skill structures that preparation.\n\n## Company and contact research\n\nBefore the call, pull these five things: (1) company size, revenue range, and growth trajectory; (2) the contact's role, tenure, and recent activity (posts, interviews, job listings); (3) any visible pain signal — layoffs, reorgs, new product launches, or pricing page changes; (4) the tech stack they advertise or use based on job listings and integrations pages; (5) any existing relationship history in the CRM.\n\nDo not spend more than 20 minutes here. Surface the one or two signals most relevant to the rep's solution.\n\n## Hypothesis stack\n\nForm two to three hypotheses about what the prospect likely cares about, based on the research. Write them as falsifiable statements: 'They are probably struggling with X because Y.' These drive the question plan — each hypothesis gets at least one question designed to confirm or kill it.\n\nA good hypothesis is specific. 'They have pain' is not a hypothesis. 'Their ops team is manually reconciling data because they outgrew their current tool six months ago' is.\n\n## Question plan\n\nStructure questions in three layers: situation (confirm context), problem (surface pain and urgency), and impact (quantify the cost of the status quo). Prioritize problem and impact questions — situation data the rep already knows from research should not burn call time.\n\nPrepare five to seven questions. Flag the two most important ones to protect if the call runs short. Always include one question about decision process: 'Walk me through how you would evaluate and decide on something like this.'\n\n## Call goals\n\nDefine exactly two to three outcomes the rep needs to leave with: a qualified or disqualified deal, a specific pain confirmed, and an agreed next step with a date. If the call ends without a next step, it did not go well regardless of how friendly the conversation felt.\n\n## Escape hatches\n\nIf research turns up nothing useful, lead with a lightweight agenda-setting opener: 'I did some homework but I want to hear it from you — what does the world look like from your seat right now?' If the contact is a new name added late, focus entirely on understanding their role before pitching anything.",
  },
  {
    slug: "objection-handler",
    name: "Objection Handler",
    category: "business",
    description: "Handles common B2B sales objections — price, timing, incumbent competitor, and status quo — with calibrated, non-pushy responses. Use when a rep needs a response framework, not a script to recite.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","objections","negotiation","b2b"],
    install_count: 22100,
    rating_avg: 4.7,
    rating_count: 1280,
    skill_content: "---\nname: Objection Handler\ndescription: Handles common B2B sales objections — price, timing, incumbent competitor, and status quo — with calibrated, non-pushy responses. Use when a rep needs a response framework, not a script to recite.\n---\n\n# Objection Handler\n\nAn objection is not a rejection. It is information. The goal is to understand what is actually behind it before responding. Jumping to a rebuttal before diagnosing the real concern is the fastest way to lose trust.\n\n## The universal first move\n\nFor every objection: pause, acknowledge, and ask a clarifying question before responding. 'That makes sense — can you help me understand what is driving that?' This surfaces the real concern. Skip this step and almost every rebuttal lands hollow.\n\n## Price objection\n\nThe price objection almost always means one of three things: (1) the value is not clear yet, (2) budget is genuinely constrained, or (3) they are using price to stall.\n\nFor (1): Reanchor to the cost of the problem, not the cost of the solution. 'What does the current situation cost you per quarter — in time, lost deals, or rework?' Then map the price to the delta.\nFor (2): Explore flexibility — phased rollout, smaller initial scope, or a different payment structure. Do not discount before understanding what they can actually do.\nFor (3): Ask directly what would need to be true for them to move forward. Silence after a price objection is often more powerful than a counter.\n\n## Timing objection ('not right now')\n\nFind out whether timing is a symptom of a bigger issue or a genuine constraint. 'Is there a specific event or milestone you are waiting for, or is it more that the priority is not there yet?' These are very different situations.\n\nIf priority is the issue, reconnect to the pain. If there is a real external constraint (budget cycle, reorg, ongoing project), agree on a specific date to reconnect and send a calendar hold immediately. 'Not right now' without a date is not a next step — it is a polite no.\n\n## Competitor objection\n\nNever trash the competitor. It looks insecure and buyers hate it. Instead: 'A lot of our customers came from there — what is it about them that has been working well for you?' This surfaces what the buyer values and creates a genuine comparison opportunity.\n\nOnly differentiate on dimensions that matter to this specific buyer. Generic feature comparisons are noise.\n\n## Status quo objection ('we are fine with what we have')\n\nThe status quo objection means the rep has not yet made the cost of inaction concrete. 'I hear you — what would it take for the current approach to stop working well enough to change?' Then be quiet.\n\nIf they cannot name a trigger, the problem is not painful enough. Qualify out gracefully. Manufactured urgency destroys trust.\n\n## What not to do\n\nDo not immediately offer a discount when price comes up. Do not promise to 'check with the team' unless you will actually follow up within 24 hours. Handle one objection at a time.",
  },
  {
    slug: "sales-proposal-writer",
    name: "Sales Proposal Writer",
    category: "writing",
    description: "Writes a crisp B2B proposal or SOW that leads with the buyer's problem, frames value clearly, defines scope, and drives a specific next step. Use after discovery is complete.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","proposal","writing","sow"],
    install_count: 15700,
    rating_avg: 4.6,
    rating_count: 820,
    skill_content: "---\nname: Sales Proposal Writer\ndescription: Writes a crisp B2B proposal or SOW that leads with the buyer's problem, frames value clearly, defines scope, and drives a specific next step. Use after discovery is complete.\n---\n\n# Sales Proposal Writer\n\nA proposal should make the buyer feel understood before it sells anything. If the first page is about the vendor, the buyer stops reading. Start with their situation, confirm the diagnosis, and only then present the solution.\n\n## Structure\n\nUse this order, and keep the whole document under three pages for a typical mid-market deal:\n\n1. Situation summary — two to three sentences mirroring back what the buyer said in discovery. Quote them where possible. This signals the vendor was listening.\n2. Impact of the problem — make the cost of inaction concrete. Use numbers from the discovery conversation. If no numbers surfaced, use a reasonable range and note it as an estimate.\n3. Proposed approach — what the vendor will do, at a high level. Emphasize outcomes, not activities. 'Your team will be able to X' beats 'We will deliver Y.'\n4. Scope and deliverables — one section per phase or workstream. Be specific enough to be credible, loose enough to avoid scope arguments before the contract is signed.\n5. Investment — present price as a single number or a small range. Do not itemize unless the buyer asked for it or the deal is complex enough to require it. Itemized pricing invites nickel-and-diming.\n6. Next step — one clear action with a suggested date. 'If this looks right, the simplest path forward is a 30-minute call on Tuesday to align on the start date.'\n\n## Tone and length\n\nWrite in plain English. No jargon, no buzzwords, no passive voice. If a sentence does not add information the buyer needs to make a decision, cut it.\n\nA proposal that takes more than five minutes to read will not get read in full. Err short. Appendices are fine for technical specs or legal terms — keep the body clean.\n\n## Common mistakes to avoid\n\nDo not lead with a company bio or awards page — it signals the proposal is a template. Do not list features the buyer never asked about. Do not include a generic ROI calculator that was not built from the buyer's actual data — it undermines credibility more than it helps.\n\n## Customization cues\n\nEvery proposal should contain at least three details that could only apply to this specific buyer: their team size, a specific pain they named, a named stakeholder. If those details are not there, the proposal reads as a mail merge and will be treated like one.\n\n## Escape hatch\n\nFor a small or transactional deal, a well-structured email works better than a formal document. Use the same structure — situation, value, scope, price, next step — but in three short paragraphs.",
  },
  {
    slug: "mutual-action-plan",
    name: "Mutual Action Plan",
    category: "business",
    description: "Builds a mutual action plan (MAP) with shared milestones, owners, and dates to drive a deal to close. Use once a prospect is qualified and has expressed intent to move forward.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","deal-management","closing","b2b"],
    install_count: 9800,
    rating_avg: 4.8,
    rating_count: 530,
    skill_content: "---\nname: Mutual Action Plan\ndescription: Builds a mutual action plan (MAP) with shared milestones, owners, and dates to drive a deal to close. Use once a prospect is qualified and has expressed intent to move forward.\n---\n\n# Mutual Action Plan\n\nA mutual action plan is a shared document that aligns the buyer and seller on every step between 'we want to move forward' and 'the contract is signed and live.' The word 'mutual' matters — if the buyer has not contributed to and agreed on the plan, it is just a vendor's wishlist.\n\n## When to introduce the MAP\n\nIntroduce the MAP after the buyer has expressed clear intent to evaluate seriously — not at the first call. Framing: 'A lot of our customers find it helpful to build a shared timeline so nothing gets stuck waiting on anyone. Would you be open to putting one together?' Never present it as a closing tool — present it as a coordination tool.\n\n## Core structure\n\nThe MAP should have exactly these columns: milestone, owner (buyer or seller, by name or role), due date, and status. Keep it in a shared doc the buyer can edit. A MAP that only the vendor can update is not mutual.\n\nTypical milestones for a mid-market SaaS deal:\n- Technical review / security questionnaire completed\n- Legal review started\n- Reference calls completed\n- Final business case signed off internally\n- Contract redlines exchanged\n- Signatures collected\n- Kickoff scheduled\n\nAsk the buyer to add any milestones on their side that the rep might not know about — budget approval cycles, procurement reviews, or board sign-offs that need to happen before a commitment can be made.\n\n## Working backward from the go-live date\n\nStart with the buyer's desired go-live date and work backward. If the buyer does not have a go-live date, ask: 'Is there a business outcome or event this needs to be live before?' That question surfaces urgency or reveals that urgency does not yet exist.\n\nBuild in buffer. If legal typically takes two weeks, put three on the plan. Slipping a MAP date by a day looks sloppy. Finishing early is fine.\n\n## Keeping the MAP alive\n\nReview the MAP at the start of every subsequent call. 'Before we dive in, let me pull up our plan — we have three items due this week.' This keeps momentum and makes it uncomfortable to let dates slip silently.\n\nWhen a milestone slips, update the date and note why. A MAP with perfect completion is a sign someone is not tracking honestly.\n\n## Escape hatch\n\nFor a simple or short-cycle deal, a MAP can be as light as a bullet list in the follow-up email: three to five actions, who owns each, and a deadline. The goal is shared accountability, not administrative overhead.",
  },
  {
    slug: "demo-script",
    name: "Demo Script",
    category: "business",
    description: "Structures a product demo around the buyer's specific use case and pain, not a feature tour. Use before any live demo to align the narrative to what the buyer actually cares about.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","demo","presentation","b2b"],
    install_count: 27300,
    rating_avg: 4.7,
    rating_count: 1640,
    skill_content: "---\nname: Demo Script\ndescription: Structures a product demo around the buyer's specific use case and pain, not a feature tour. Use before any live demo to align the narrative to what the buyer actually cares about.\n---\n\n# Demo Script\n\nA feature tour is not a demo. Buyers do not care about features — they care about outcomes. The job of a demo is to make the buyer see themselves solving a specific problem they described in discovery. Every screen shown should connect directly to something the buyer said.\n\n## Before building the script\n\nPull the discovery notes and identify: (1) the primary pain the buyer named, (2) the current workaround they are using, and (3) the metric or outcome they care about improving. The demo script is built around these three things, not around what the product team considers impressive.\n\nIf these three things are not known, the demo should not happen yet. Run discovery first.\n\n## Script structure\n\nOpen with a 60-second situation recap, not with a product login. 'Based on what you shared last week, your team spends about eight hours a week on X and the biggest pain is Y. Today I want to show you specifically how that looks different.' This signals the rep was listening and sets a clear frame.\n\nThen walk through three to four moments, not features. A 'moment' is a before-and-after narrative: here is the painful thing your team does today, here is how it works with the product, here is what changes for the person doing it. For each moment: (1) name the role affected, (2) show the painful current state briefly if possible, (3) show the product solving it, (4) connect back to the metric or outcome the buyer named.\n\nClose the demo before showing everything. Save one strong moment for questions or a follow-up. Ending on 'and there's so much more' is weak — ending on 'what would be most useful to dig into next?' is strong.\n\n## What to skip\n\nDo not show the admin panel unless the buyer is an admin and asked about it. Do not show every integration available — show the one that connects to their stack. Do not apologize for missing features during the demo. If a gap comes up, acknowledge it cleanly and move on.\n\n## Pacing\n\nA 30-minute demo slot should have 20 minutes of content and 10 minutes of conversation. If the demo runs to the end of the slot, something went wrong. Buyers who are engaged ask questions — protect time for that.\n\n## Escape hatch\n\nFor a async or recorded demo, the same structure applies but the script needs to be tighter. Open with the specific use case in the first 15 seconds, or the viewer will stop watching. Use chapter markers if the platform supports them.",
  },
  {
    slug: "sales-followup-cadence",
    name: "Sales Follow-Up Cadence",
    category: "business",
    description: "Designs a multi-touch follow-up cadence that adds value at each touch, maintains momentum after a call or demo, and knows when to stop. Use when a deal goes quiet or after any key meeting.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["sales","cadence","follow-up","outbound"],
    install_count: 31500,
    rating_avg: 4.6,
    rating_count: 1920,
    skill_content: "---\nname: Sales Follow-Up Cadence\ndescription: Designs a multi-touch follow-up cadence that adds value at each touch, maintains momentum after a call or demo, and knows when to stop. Use when a deal goes quiet or after any key meeting.\n---\n\n# Sales Follow-Up Cadence\n\nFollow-up is where most deals are won or lost. The rep who follows up with something useful every time earns the right to stay in the conversation. The rep who sends 'just checking in' loses it. Every touch needs a reason to exist.\n\n## The core rule\n\nEvery follow-up message must do one of three things: add new information, move an action item forward, or give the buyer something genuinely useful for their job. 'Touching base' and 'circling back' are not reasons to send a message.\n\n## Post-meeting cadence (first 7 days)\n\nDay 0 (same day, within 2 hours): Send a meeting recap. Include: what was discussed, what the buyer said their top priority is, agreed next steps with owners and dates, and any open questions. This email does not sell — it confirms shared understanding and creates a paper trail.\n\nDay 2: Send one relevant piece of value — a case study from a similar company, a short article on the problem they named, or an answer to a question that came up and was left open. One attachment or link, one sentence of context. Do not restate the sales pitch.\n\nDay 5: Follow up on the specific action item the buyer owned from the recap. 'Just wanted to check — were you able to get time with your IT lead? Happy to join that conversation if it helps.'\n\nDay 7: If no response, send a brief forward of the Day 0 email with a single line: 'Wanted to make sure this did not get buried — let me know if the timing has shifted.'\n\n## When a deal goes cold (8-30 days of silence)\n\nDay 10: Try a different channel — LinkedIn message or phone call, not another email.\n\nDay 17: Send a 'useful without expectation' message — a relevant resource or insight with no ask attached. The subject line should not reference the deal.\n\nDay 25: The breakup email. 'I do not want to keep reaching out if the timing is off. If things have changed on your end and you want to revisit, I am here. Otherwise I will close this out on my side.' This message gets more replies than almost any other in the cadence.\n\n## What to stop doing\n\nStop after the breakup email unless the buyer re-engages. Continuing to follow up after a polite close destroys the relationship and the brand. Park the contact for a 90-day re-engagement drip if the product is a fit — not an immediate return to the same cadence.\n\n## Escape hatch\n\nFor a transactional or short-cycle deal, compress the cadence: Day 0 recap, Day 2 value add, Day 5 breakup. Do not over-engineer follow-up for a deal that should close in a week.",
  },
  // ── security-compliance-hardening ──
  {
    slug: "threat-model-stride",
    name: "Threat Model STRIDE",
    category: "coding",
    description: "Runs a STRIDE threat model on a feature or system, surfaces high-priority threats, and recommends concrete mitigations. Use before shipping auth, data flows, or external integrations.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["security","threat-modeling","appsec","architecture","stride"],
    install_count: 18400,
    rating_avg: 4.8,
    rating_count: 612,
    skill_content: "---\nname: Threat Model STRIDE\ndescription: Applies STRIDE threat modeling to a described feature or system, enumerates threats per category, and prioritizes mitigations by exploitability and impact. Load when reviewing auth, data flows, or new external integrations.\n---\n\n# Threat Model STRIDE\n\nSTRIDE is a structured framework for identifying security threats early, when fixes are cheapest. Apply it to any feature touching auth, data storage, external calls, or privilege changes.\n\n## Scope the System First\n\nBefore enumerating threats, establish a minimal data-flow diagram in prose:\n- Identify actors (users, services, external APIs).\n- Identify trust boundaries (browser/server, service/DB, internal/external network).\n- List data assets and their sensitivity tiers (PII, credentials, financial, public).\nDo not proceed until boundaries are explicit — vague scope produces vague threats.\n\n## Apply STRIDE Per Component\n\nFor each component crossing a trust boundary, evaluate all six categories:\n\n- Spoofing: can an attacker impersonate a user, service, or token? Check auth mechanisms at every entry point.\n- Tampering: can inputs, stored records, or in-flight data be modified without detection? Check integrity controls and audit logs.\n- Repudiation: can an actor deny an action? Check whether sensitive operations are logged with actor identity and timestamp.\n- Information Disclosure: can data leak to unauthorized parties? Check access controls, error messages, logs, and caches.\n- Denial of Service: can an attacker exhaust resources or degrade availability? Check rate limiting, queue depth limits, and timeouts.\n- Elevation of Privilege: can an actor gain permissions beyond their role? Check authorization checks at every privilege boundary, not just at entry.\n\n## Prioritize by DREAD-Light\n\nScore each threat on two axes only — exploitability (how easy to trigger without special access) and impact (data loss, service loss, or compliance violation). Produce a ranked short list: Critical, High, Medium. Ignore Low findings unless they chain into a higher-severity path.\n\n## Mitigation Standards\n\nFor each Critical and High finding, recommend one concrete control:\n- Prefer existing platform primitives (JWT validation middleware, ORM parameterization, IAM roles) over custom code.\n- Specify the control, not just the category ('add HMAC signature on webhook payload' not 'add integrity check').\n- Flag any mitigation that requires a schema change or new dependency — those need separate review.\n\n## Output Format\n\nReturn a structured list: threat category, affected component, attack scenario in one sentence, severity, recommended control, and owner team. Keep it reviewable in under ten minutes by a non-security engineer.",
  },
  {
    slug: "dependency-risk-audit",
    name: "Dependency Risk Audit",
    category: "coding",
    description: "Assesses third-party dependency risk across CVEs, maintenance health, license exposure, and supply-chain hygiene. Use when onboarding new packages or reviewing a lockfile before a release.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["security","dependencies","supply-chain","sca","appsec"],
    install_count: 24100,
    rating_avg: 4.7,
    rating_count: 839,
    skill_content: "---\nname: Dependency Risk Audit\ndescription: Audits third-party dependencies for CVEs, abandoned packages, license risk, and supply-chain hygiene indicators. Load when adding new packages, reviewing a lockfile, or preparing for a security review.\n---\n\n# Dependency Risk Audit\n\nThird-party packages are the most common source of supply-chain compromise and known-vulnerability exploitation. Treat dependency selection as a security decision, not just a convenience one.\n\n## CVE and Known Vulnerability Triage\n\nRun the ecosystem's native audit tool first (npm audit, pip-audit, bundle audit, govulncheck). For each finding:\n- Confirm exploitability in context — a CVE in a CLI-only code path of a server-side lib may not be reachable.\n- Check whether a fixed version exists and whether upgrading is a semver-compatible bump.\n- Flag any CVSS 7.0+ finding with no available fix as a blocking risk requiring a compensating control or replacement.\nDo not dismiss findings without a written reason.\n\n## Maintenance Health Signals\n\nA dependency with no CVEs today can become a liability tomorrow. For any new or high-traffic dependency check:\n- Last release date and commit activity (no release in 24+ months on an active ecosystem is a yellow flag).\n- Number of open security issues versus closed.\n- Whether the package has a documented security policy or contact.\n- Single-maintainer packages without a succession plan carry concentration risk — flag them.\n\n## Supply-Chain Hygiene\n\nInstall-time attacks abuse package publication pipelines. Apply these checks:\n- Verify the package name exactly matches the intended project — typosquatting is common.\n- Confirm the publisher identity on the registry matches the known author or organization.\n- Prefer packages that publish provenance attestations (SLSA, npm provenance, sigstore) when available.\n- Pin transitive dependencies in lockfiles and commit them to source control. Never allow floating ranges in production lockfiles.\n- Enable automated lockfile integrity checks in CI (npm ci, not npm install).\n\n## License Risk\n\nLicenses create legal exposure, not just engineering risk. Flag any dependency with a copyleft license (GPL, AGPL, EUPL) in a proprietary codebase — these require legal review before shipping. Acceptable defaults for most commercial projects: MIT, Apache-2.0, BSD-2, BSD-3, ISC.\n\n## Remediation Priority\n\nRank findings: (1) exploitable CVE with available fix, (2) exploitable CVE no fix — needs replacement, (3) abandoned package on a critical path, (4) license conflict, (5) maintenance concern only. Address (1) and (2) before any release. Defer (5) to a scheduled dependency hygiene sprint.",
  },
  {
    slug: "secrets-hygiene",
    name: "Secrets Hygiene",
    category: "coding",
    description: "Prevents and remediates leaked secrets and credentials in source code, CI, logs, and config. Covers detection, rotation procedures, and secure storage patterns. Use after a suspected leak or during a security review.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["security","secrets","credentials","appsec","devops"],
    install_count: 31200,
    rating_avg: 4.9,
    rating_count: 1140,
    skill_content: "---\nname: Secrets Hygiene\ndescription: Guides detection, remediation, and prevention of leaked secrets and credentials across source code, CI pipelines, logs, and config. Load when a secret may have been exposed or when reviewing secrets management practices.\n---\n\n# Secrets Hygiene\n\nA leaked secret is a live incident until rotated. Treat any suspected exposure as confirmed until proven otherwise — the cost of unnecessary rotation is always lower than the cost of a breach.\n\n## Immediate Response to a Suspected Leak\n\nIn order, without delay:\n1. Rotate the credential immediately through the issuing system (cloud console, API portal, identity provider). Do not wait to confirm exposure first.\n2. Revoke any active sessions or tokens derived from the compromised credential.\n3. Scan audit logs for the credential's usage over the prior 90 days to assess blast radius.\n4. Assess whether the secret was committed to a git repo — if yes, treat the full history as compromised even after deletion, because git history is persistent and forks may exist.\n\n## Detection: Finding Secrets in Code and Config\n\nRun a secret scanner across the full git history, not just HEAD. Recommended tools: trufflehog (history-aware), gitleaks, or detect-secrets. Configure patterns for your stack's credential formats (AWS AKIA prefixes, GCP service account JSON keys, Stripe sk_live_ prefixes, PEM headers).\n\nAlso scan: CI/CD pipeline logs (they frequently echo env vars), Terraform state files, Docker image layers, and Kubernetes configmaps/secrets stored in plaintext.\n\n## Secure Storage Patterns\n\nThe right store depends on the runtime:\n- Local development: use a .env file listed in .gitignore plus a .env.example with placeholder values. Never commit real values.\n- CI/CD: use the platform's native secret store (GitHub Actions encrypted secrets, GitLab CI variables, etc.). Never interpolate secrets into log output.\n- Application runtime: use a dedicated secrets manager (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager). Fetch at runtime, not at build time. Prefer short-lived credentials with automatic rotation over long-lived API keys.\n- Kubernetes: use external secrets operators to sync from a secrets manager rather than storing values in etcd via native Secrets objects.\n\n## Prevention Controls\n\n- Install a pre-commit hook that runs a secret scanner before every commit (pre-commit framework with detect-secrets or gitleaks).\n- Add the scanner to CI as a required check that blocks merge on findings.\n- Set minimum IAM permissions for every credential — a leaked read-only key is less damaging than a leaked admin key.\n- Enforce secret expiry: no credential should live longer than 90 days without automated rotation.\n\n## What Not to Do\n\n- Do not base64-encode a secret and consider it safe — encoding is not encryption.\n- Do not store secrets in environment variable files that are committed to source control, even in non-production branches.\n- Do not log request headers or POST bodies at INFO level — auth tokens and API keys appear there routinely.",
  },
  {
    slug: "soc2-evidence-helper",
    name: "SOC 2 Evidence Helper",
    category: "coding",
    description: "Organizes SOC 2 Type I and Type II evidence collection, maps controls to Trust Service Criteria, and reduces audit busywork. Use when preparing for an audit or responding to auditor requests.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["compliance","soc2","audit","security","controls"],
    install_count: 9800,
    rating_avg: 4.6,
    rating_count: 284,
    skill_content: "---\nname: SOC 2 Evidence Helper\ndescription: Organizes SOC 2 Type I and Type II evidence, maps engineering controls to Trust Service Criteria, and guides efficient evidence collection. Load when preparing for an audit, closing auditor findings, or building a compliance program.\n---\n\n# SOC 2 Evidence Helper\n\nSOC 2 audits measure whether your security controls exist (Type I) and operate consistently over time (Type II). Engineering teams waste the most time gathering evidence reactively. Build collection into normal operations.\n\n## Understand the Five Trust Service Criteria\n\nSOC 2 is organized around five criteria — Security (CC) is required; the others are optional scope extensions:\n- Security (CC): logical access, change management, risk assessment, incident response, monitoring.\n- Availability (A): uptime commitments, capacity planning, backup and recovery.\n- Processing Integrity (PI): complete and accurate data processing, error handling.\n- Confidentiality (C): data classification, encryption in transit and at rest, NDA controls.\n- Privacy (P): personal data lifecycle — collection notice, consent, retention, deletion.\n\nScope your audit before collecting any evidence. Auditors will only test criteria in scope.\n\n## Map Controls to Criteria\n\nFor each in-scope criterion, identify the control, the evidence artifact, and the system of record. Example mapping:\n- CC6.1 (logical access): evidence is access reviews from your IdP (Okta, Entra) exported quarterly, plus offboarding tickets showing timely deprovisioning.\n- CC7.2 (monitoring): evidence is your SIEM or CloudTrail alert configuration plus a sample of alerts investigated in the period.\n- CC8.1 (change management): evidence is your PR merge policy (required review, passing CI) plus a sample of merged PRs.\n\nCreate this map in a shared doc before the audit begins. Do not create evidence artifacts that do not reflect how the system actually operates — auditors test consistency, and fabricated evidence is a finding.\n\n## Evidence Collection Efficiency\n\nAutomate collection wherever the system supports it:\n- Access reviews: export from IdP on a scheduled basis and store in a designated compliance folder.\n- Vulnerability scans: schedule the scanner and archive reports automatically; do not run ad hoc scans only when the auditor asks.\n- Penetration test reports: retain the full report including findings, not just the executive summary.\n- Policy attestations: use a GRC tool or a simple form with timestamps — manual sign-off with no timestamp is not auditable.\n\n## Responding to Auditor Requests\n\n- Provide the minimum necessary evidence — do not over-share system diagrams or internal design docs not required by the control.\n- When a control has a gap (the control was not operating for part of the period), disclose it proactively with a documented remediation date. Auditors respond better to transparency than to discovering gaps themselves.\n- For Type II, auditors will sample from the full review period. Maintain artifacts continuously, not just in the month before fieldwork.\n\n## Common Engineering Findings to Avoid\n\n- Access not revoked within 24 hours of offboarding (automate deprovisioning).\n- No documented change management policy even when the team does use pull requests.\n- Encryption enabled but no evidence it is configured correctly (export config screenshots or IaC).\n- Incident response plan exists but was never tested — run at least one tabletop exercise annually.",
  },
  {
    slug: "vulnerability-triage",
    name: "Vulnerability Triage",
    category: "coding",
    description: "Triages and prioritizes vulnerability findings by real-world exploitability and business impact, cutting through scanner noise. Use when processing pentest reports, bug bounty submissions, or scanner output.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["security","vulnerability","triage","appsec","pentest"],
    install_count: 15700,
    rating_avg: 4.7,
    rating_count: 498,
    skill_content: "---\nname: Vulnerability Triage\ndescription: Prioritizes vulnerability findings from scanners, pentest reports, or bug bounty submissions by real exploitability and impact. Load when processing security findings and deciding what to fix first.\n---\n\n# Vulnerability Triage\n\nVulnerability scanners produce volume, not priority. Effective triage cuts the list to an actionable queue engineers can work without burning out or ignoring legitimate risk.\n\n## Start with Exploitability, Not CVSS\n\nCVSS base scores measure theoretical severity in an ideal attacker environment. They do not measure your environment. For each finding, answer these questions before assigning internal priority:\n\n- Is the vulnerable component reachable from an untrusted input source (public internet, anonymous API, user-controlled data)?\n- Does exploiting it require authentication? If yes, what privilege level?\n- Is there a public proof-of-concept exploit or active in-the-wild exploitation (check CISA KEV catalog)?\n- Does your deployed configuration match the vulnerable configuration? (Example: a path traversal in a feature your app does not use.)\n\nA CVSS 9.8 finding in an internal-only admin service behind VPN with MFA is lower priority than a CVSS 6.5 finding on a public unauthenticated endpoint.\n\n## Assign Internal Severity\n\nUse four tiers:\n- Critical: remotely exploitable, no auth required, leading to RCE, data exfiltration, or full account takeover. Fix within 24 hours.\n- High: exploitable with low privilege or requires chaining one step, significant data exposure or service disruption possible. Fix within 7 days.\n- Medium: requires significant user interaction or specific non-default config, limited impact scope. Fix within 30 days.\n- Low: defense-in-depth improvement, informational, or requires physical access. Schedule in the next sprint cycle.\n\n## Distinguish False Positives Systematically\n\nDo not mark a finding as a false positive based on intuition alone. Document the specific reason:\n- Component not deployed in this environment.\n- Vulnerable code path is dead code (reference the specific unreachable call path).\n- Compensating control prevents exploitation (name the control and where it is enforced).\n\nFalse positive decisions require a second reviewer for Critical and High findings.\n\n## Deduplication and Grouping\n\nScanners frequently report the same root cause through multiple symptoms. Before building a fix list, group findings by root cause (example: all XSS findings from the same template engine misconfiguration). One fix may close ten findings — identify these first for maximum leverage.\n\n## Tracking and SLAs\n\nEvery finding above Low needs a ticket with the internal severity, the finding source, the assigned owner, and the SLA due date. Track SLA breach rate as an engineering health metric. Escalate to engineering leadership when Critical or High findings miss SLA — do not silently extend deadlines.",
  },
  {
    slug: "secure-code-review",
    name: "Secure Code Review",
    category: "coding",
    description: "Reviews code for high-impact security flaws including broken authorization, injection, SSRF, and unsafe deserialization. Use before merging auth changes, new endpoints, or code handling untrusted input.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["security","code-review","appsec","injection","authorization"],
    install_count: 42600,
    rating_avg: 4.8,
    rating_count: 1870,
    skill_content: "---\nname: Secure Code Review\ndescription: Reviews code for the highest-impact security flaws: broken authorization, injection, SSRF, mass assignment, and unsafe deserialization. Load when reviewing auth code, new API endpoints, or any code that handles untrusted input.\n---\n\n# Secure Code Review\n\nSecure code review is not a checklist audit — it is a focused search for the flaw categories that cause the most breaches. Spend time proportional to risk: auth logic and input handling deserve more scrutiny than rendering or config.\n\n## Authorization Before Authentication\n\nBroken authorization (OWASP A01) is the most common high-severity finding. For every action that reads or mutates a resource:\n- Confirm the code checks that the authenticated user owns or has permission to access the specific resource ID, not just that the user is logged in.\n- Look for IDOR patterns: resource IDs passed in request parameters without ownership verification.\n- Verify that admin or privileged actions enforce role checks at the function level, not only at the route level — middleware-only checks are bypassed by internal calls.\n- Check that authorization logic is centralized. Duplicated per-endpoint auth checks drift and create gaps.\n\n## Injection Surfaces\n\nFor any code that constructs queries, commands, or markup from user input:\n- SQL: confirm parameterized queries or a safe ORM API throughout — no string concatenation into query bodies, even for identifiers or ORDER BY clauses.\n- Shell commands: flag any exec/spawn call that includes user input. The correct fix is to avoid shell execution; if unavoidable, use argument arrays not string interpolation.\n- HTML/template: confirm output encoding is applied for the correct context (HTML, attribute, JavaScript, URL). Verify that rich-text user content passes through a sanitization library with an allowlist, not a blocklist.\n- Path traversal: any user-supplied filename or path must be normalized and confined to an expected root directory before use.\n\n## Server-Side Request Forgery (SSRF)\n\nAny code that makes outbound HTTP requests with a URL derived from user input is an SSRF candidate:\n- Confirm the target URL is validated against an allowlist of permitted hosts/schemes before the request is made.\n- Cloud-hosted services: verify the code blocks requests to instance metadata endpoints (169.254.169.254, fd00:ec2::254).\n- Redirects: confirm the HTTP client is configured to not follow redirects automatically, or that each redirect destination is re-validated.\n\n## Mass Assignment and Deserialization\n\n- Mass assignment: confirm that model or ORM binding uses an explicit allowlist of permitted fields, not a deny-list. Any field that controls permissions, ownership, or internal state must be excluded from user-supplied binding.\n- Deserialization: flag any deserialization of user-supplied data using native object serialization formats (Java ObjectInputStream, Python pickle, PHP unserialize, Ruby Marshal). These are almost always unsafe with untrusted input. Prefer JSON or protobuf with explicit schema validation.\n\n## What to Raise vs. What to Skip\n\nRaise: any finding that allows an attacker to access data or perform actions beyond their authorization, execute code, or exfiltrate secrets. Skip: style issues, missing logging (unless the logging gap affects audit requirements), or theoretical issues with no realistic attack path in the current deployment context. Keep the review focused so engineers engage with findings rather than ignoring a long list.",
  },
  // ── ux-research-discovery ──
  {
    slug: "interview-guide-builder",
    name: "Interview Guide Builder",
    category: "research",
    description: "Writes a user-interview discussion guide with non-leading, open questions. Use when planning generative or evaluative interviews to avoid priming participants.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["user-interviews","discussion-guide","qualitative","generative","research"],
    install_count: 18400,
    rating_avg: 4.8,
    rating_count: 940,
    skill_content: "---\nname: Interview Guide Builder\ndescription: Writes a non-leading user-interview discussion guide with open questions, warm-up flows, and probes. Use before conducting generative or evaluative interviews.\n---\n\n# Interview Guide Builder\n\nA discussion guide is scaffolding, not a script. It keeps the researcher oriented while leaving room for the participant to lead. This skill produces a guide that protects against interviewer bias from the first question to the last.\n\n## Structure Every Guide This Way\n\nOpen with a 2-3 minute intro that covers: who you are, why you are talking, that there are no right answers, and that you will record (if applicable). Then move through: warm-up (low-stakes context questions), core topics (3-5 areas max), edge probes, and a close ('anything else you wish I had asked?').\n\n## Writing Open, Non-Leading Questions\n\nEvery core question must pass three tests: (1) it cannot be answered yes or no, (2) it does not contain the answer or an assumption, (3) it invites storytelling. Prefer 'Tell me about a time when...' and 'Walk me through how you...' over 'Do you find it frustrating when...'. Strip adjectives like 'easy', 'hard', 'frustrating', 'helpful' from question stems — those are your hypotheses, not the participant's words.\n\n## Probe Bank\n\nAfter each core question, attach 2-3 probes. Reliable probes: 'What happened next?', 'Can you say more about that?', 'How did that make you feel?', 'What were you trying to accomplish at that point?', 'Was that typical for you?'. Avoid 'Why?' as a standalone probe — it can feel accusatory; reframe as 'What was driving that for you?'.\n\n## Scope and Timing\n\nA 60-minute interview fits 4-5 core questions with probes. Each topic block should have a soft time budget noted in the margin. Include a 'must cover' flag on the one or two questions the team cannot go without — these get prioritized if the conversation runs long.\n\n## Bias Traps to Audit Before Fielding\n\nReview the final draft for: confirmation bias (questions that assume the product works), leading language, compound questions (two questions joined by 'and'), and any question that could be answered by 'yes' or 'no'. Read every question aloud — awkward phrasing rarely survives being spoken.\n\n## Escape Hatches\n\nFor concept or prototype testing, add a 'react aloud' task block after core questions. For longitudinal studies, version the guide across waves and mark which questions are repeated verbatim for comparability.",
  },
  {
    slug: "interview-synthesis",
    name: "Interview Synthesis",
    category: "research",
    description: "Synthesizes interview notes into themes, insights, and supporting quotes. Use after completing a round of qualitative interviews to move from raw data to actionable findings.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["synthesis","thematic-analysis","qualitative","insights","affinity"],
    install_count: 14700,
    rating_avg: 4.7,
    rating_count: 720,
    skill_content: "---\nname: Interview Synthesis\ndescription: Synthesizes interview notes into themes, insights, and supporting quotes. Use after a qualitative research round to move raw data to actionable findings ready for stakeholders.\n---\n\n# Interview Synthesis\n\nSynthesis is where data becomes insight. The job is not to summarize what people said — it is to identify the underlying pattern that explains why they said it and what it means for design or strategy.\n\n## Prepare Your Data\n\nBefore synthesizing, ensure every interview has a cleaned transcript or structured notes with participant ID, date, and key verbatim quotes marked. Do not rely on memory. Minimum viable dataset: 5 interviews for foundational themes; fewer requires explicitly noting low confidence.\n\n## Extract Observations First, Interpretations Second\n\nPass one: extract atomic observations — one idea per sticky note or row. These are factual ('Participant said she checks the app every morning before coffee') not interpretive. Pass two: group observations by similarity, ignoring the source participant. Name each cluster with a verb-noun label ('avoids manual entry', 'relies on notifications as reminders'). Only then elevate a cluster to an insight.\n\n## Writing Insights\n\nAn insight is a non-obvious, actionable statement that connects observed behavior to an underlying motivation or friction. Format: '[User type] [does behavior] because [motivation/belief], but [tension or barrier].' Weak: 'Users find notifications helpful.' Strong: 'Power users treat push notifications as their primary task queue because they distrust the in-app home screen, but this breaks down when notification volume exceeds ~15 per day.'\n\n## Selecting Supporting Quotes\n\nEach insight needs one strong verbatim quote and ideally two corroborating ones from different participants. A strong quote is specific, vivid, and free of researcher interpretation. Anonymize to 'P3' or persona label before sharing externally.\n\n## Confidence and Frequency\n\nTag each insight with frequency (how many participants) and confidence (high / medium / low). A single-participant observation is a signal, not a finding — keep it in an 'outliers worth watching' section rather than promoting it to a theme.\n\n## Output Structure\n\nDeliver findings as: executive summary (3-5 bullets), themes table (theme name, insight statement, frequency, confidence, top quote), and a 'so what' recommendation for each theme. Outliers and open questions go in an appendix.",
  },
  {
    slug: "survey-designer",
    name: "Survey Designer",
    category: "research",
    description: "Designs unbiased surveys — question types, scales, and avoiding leading or loaded items. Use when quantifying attitudes, behaviors, or satisfaction at scale.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["survey","quantitative","scales","unbiased","measurement"],
    install_count: 21300,
    rating_avg: 4.6,
    rating_count: 1180,
    skill_content: "---\nname: Survey Designer\ndescription: Designs unbiased surveys with correct question types, scales, and structure. Use when quantifying attitudes, behaviors, or satisfaction; pairs with qualitative methods for triangulation.\n---\n\n# Survey Designer\n\nA poorly designed survey produces precise measurements of the wrong thing. This skill covers question construction, scale selection, and structural decisions that determine whether survey data is trustworthy.\n\n## Question Type Selection\n\nUse closed questions (single-select, multi-select, scale) when you need quantifiable, comparable data. Use open-ended questions sparingly — they drive up completion time and require qualitative analysis. A well-designed survey is mostly closed with one or two open fields for 'anything else'. Matrix questions look efficient but inflate satisficing (participants clicking the same column down the page); limit to 5 rows max.\n\n## Scale Design\n\nFor attitude or satisfaction measurement, 5-point Likert scales are the standard. Use labeled endpoints and a neutral midpoint. Do not reverse-code items without clear analytical need — it confuses respondents. For frequency, use concrete anchors ('never', 'once a month', 'once a week', 'daily') rather than vague ones ('rarely', 'sometimes', 'often'). NPS (0-10) is appropriate only for likelihood-to-recommend; do not repurpose it as a general satisfaction scale.\n\n## Avoiding Bias\n\nLeading questions embed an assumption ('How much did you enjoy the new feature?'). Fix: 'How would you rate your experience with the new feature?'. Loaded questions contain emotional framing ('Do you agree that the cluttered interface slows you down?'). Double-barreled questions ask two things at once ('The product is easy to use and saves me time') — always split these. Social desirability bias is reduced by framing sensitive questions in third person ('Some users find X useful, others do not — which best describes you?').\n\n## Survey Flow\n\nStart with a screener to qualify respondents. Follow with behavioral questions (easier, less sensitive) before attitudinal ones. Place sensitive or demographic questions last — respondents who abandon mid-survey still yield data from earlier questions. Total length: under 10 minutes for general audiences; under 5 for transactional intercepts.\n\n## Pilot Before Fielding\n\nRun a cognitive pilot with 3-5 participants who think aloud while completing the survey. Look for: confused question wording, missing answer options, scale direction errors, and unexpected drop-off points. Fix before launching at scale.",
  },
  {
    slug: "jtbd-extractor",
    name: "JTBD Extractor",
    category: "research",
    description: "Extracts Jobs To Be Done — job stories, hiring/firing forces, and functional/emotional/social dimensions — from research data. Use after interviews or diary studies.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["jtbd","jobs-to-be-done","job-stories","forces","frameworks"],
    install_count: 9800,
    rating_avg: 4.7,
    rating_count: 430,
    skill_content: "---\nname: JTBD Extractor\ndescription: Extracts Jobs To Be Done — job stories, hiring/firing forces, and functional/emotional/social dimensions — from qualitative research data. Use after interviews or diary studies.\n---\n\n# JTBD Extractor\n\nJobs To Be Done reframes research findings around what people are trying to accomplish — the progress they seek — rather than product features or user attributes. This skill extracts jobs from raw research data using the Intercom/Ulwick lineage, not a cargo-culted template.\n\n## Identifying a Job\n\nA job is a stable, solution-agnostic goal a person is trying to achieve in a specific situation. Jobs do not change when products change. Look for moments in research data where participants describe: switching products, hiring a workaround, feeling frustrated that a tool does not do something, or a recurring task they do across multiple tools. These are candidate jobs.\n\n## The Forces of Progress\n\nFor each candidate job, map the four forces: (1) Push — the frustration or limitation with the current solution that motivates action; (2) Pull — the appeal of a new or better solution; (3) Anxiety — fear or uncertainty about switching or adopting; (4) Habit — inertia and comfort with the current way. Use direct quotes from research as evidence for each force. A job with weak push and strong habit explains low adoption even when a solution is objectively better.\n\n## Writing Job Stories\n\nJob stories follow: 'When [situation], I want to [motivation/goal], so I can [expected outcome].' The situation is specific, not generic. 'When I am reviewing my team's output at the end of a sprint' is better than 'when I am at work'. Write one job story per identified job. Avoid embedding solution language ('so I can use the dashboard to...').\n\n## Functional, Emotional, and Social Dimensions\n\nEvery job has three layers. Functional: what the person literally needs to do. Emotional: how they want to feel (or avoid feeling) during and after. Social: how they want to be perceived by others. Extract evidence for each layer from research. Missing emotional or social dimensions usually means the interviews did not go deep enough.\n\n## Output Format\n\nPresent findings as a jobs inventory: job title (verb-noun), job story, forces map (one bullet per force with a supporting quote), and the three dimensions. Group related jobs under a higher-order 'main job' if the data supports it. Note which jobs have strong evidence versus are inferred.",
  },
  {
    slug: "usability-test-plan",
    name: "Usability Test Plan",
    category: "design",
    description: "Plans a usability test — tasks, success criteria, metrics, and recruiting requirements. Use before running moderated or unmoderated usability studies on interfaces or prototypes.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["usability-testing","test-plan","tasks","recruiting","metrics"],
    install_count: 16200,
    rating_avg: 4.8,
    rating_count: 810,
    skill_content: "---\nname: Usability Test Plan\ndescription: Plans a usability test — task scenarios, success criteria, metrics, and recruiting. Use before running moderated or unmoderated studies on interfaces or prototypes.\n---\n\n# Usability Test Plan\n\nA test plan is the contract between the research question and the study execution. Without one, teams run sessions, gather impressions, and call it usability testing. With one, findings are defensible and actionable.\n\n## Define the Research Questions First\n\nBefore writing tasks, state 2-4 specific research questions the test must answer. Examples: 'Can users complete onboarding without assistance?', 'Do users understand the permission model before granting access?'. Tasks flow from questions — not the other way around. Reject any task that does not map to a research question.\n\n## Writing Task Scenarios\n\nTask scenarios must be realistic, motivated, and free of interface terminology. Good: 'You need to share the monthly report with your manager so she can review it before the board meeting. Please show me how you would do that.' Bad: 'Use the Share button to export the document.' Give participants context and a goal, not instructions. Each task should have a clear end state the observer can recognize.\n\n## Success Criteria and Metrics\n\nFor each task, define: completion rate (binary: completed/not), time on task, error count, and any task-specific criteria (e.g., selected the correct permission level). Post-task, use a single-question scale — SEQ (Single Ease Question, 1-7) is the standard. Post-session, use SUS (System Usability Scale, 10 items) for a comparable satisfaction score. Define 'success' thresholds before testing, not after seeing results.\n\n## Recruiting\n\nWrite a screener that targets the actual user population, not a convenient approximation. Specify: primary criteria (role, behavior, experience level), disqualifying criteria (competitor employees, UX researchers, anyone who has seen the prototype), and the target n. For most formative studies, 5 participants per distinct user segment surfaces the majority of usability issues. Moderated remote studies need 45-60 minutes per session; unmoderated can be shorter.\n\n## Moderated vs. Unmoderated\n\nModerated is the default for complex flows, early-stage prototypes, or when the team needs to understand the 'why' behind failures. Unmoderated is appropriate for validating specific tasks on mature interfaces at higher sample sizes. Never run unmoderated tests on low-fidelity prototypes — participant confusion cannot be disambiguated from usability issues.\n\n## Plan Deliverables\n\nThe written plan includes: research questions, participant profile and screener, task list with scenarios and success criteria, session guide outline, metrics table, and logistics (tool, recording consent, incentive).",
  },
  {
    slug: "research-readout",
    name: "Research Readout",
    category: "research",
    description: "Turns research findings into a crisp stakeholder readout with recommendations and confidence levels. Use after synthesis to communicate findings to product, design, or leadership audiences.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["readout","stakeholder-communication","recommendations","findings","synthesis"],
    install_count: 12600,
    rating_avg: 4.9,
    rating_count: 560,
    skill_content: "---\nname: Research Readout\ndescription: Turns synthesized research findings into a crisp stakeholder readout with recommendations and confidence levels. Use after synthesis to communicate to product, design, or leadership.\n---\n\n# Research Readout\n\nA readout is not a research report. Its job is to transfer the minimum necessary context for stakeholders to make a decision or change direction — then get out of the way. Most research goes unacted on because the readout is too long, too hedged, or buries recommendations at the end.\n\n## Lead With the 'So What'\n\nOpen with 2-3 bullets that state the most important findings and their implications for the product or business. Stakeholders decide in the first 60 seconds whether to stay engaged. 'Users cannot find the billing page' is a finding. 'The current navigation structure is causing users to cancel because they cannot find billing, which is the trigger for most churn calls to support' is an implication.\n\n## Structure\n\nUse this five-section structure: (1) Context — study goal, method, sample, dates (one paragraph max). (2) Key Findings — 3-5 numbered insights, each with a confidence level and the number of participants it is based on. (3) Supporting Evidence — selected quotes, clips, or data that back each finding; keep it tight. (4) Recommendations — one to three concrete actions per major finding, written as imperatives ('Redesign the onboarding flow to surface the core action within the first screen'). (5) Open Questions — what this study did not answer and what to study next.\n\n## Confidence Levels\n\nEvery finding must be tagged: High (5+ participants, consistent pattern), Medium (3-4 participants, some variation), Low (1-2 participants, or inferred). Do not hedge everything — stakeholders treat a sea of 'mights' and 'possiblys' as noise. Be direct on high-confidence findings and explicit on limitations for low-confidence ones.\n\n## Recommendations That Stick\n\nA recommendation must be specific, owned, and actionable within the team's control. Avoid 'do more research'. If the right next step is more research, say what specific question it would answer and what decision it would unlock. Pair each recommendation with the finding that motivates it so the team can disagree with the evidence rather than the researcher.\n\n## Format Choices\n\nFor async stakeholders: a slide deck with one finding per slide and a clear headline in the title bar. For a live readout: 20-30 minutes of findings, 10-15 minutes of discussion. For engineering audiences: a one-page brief with a findings table. Always make the recording or full report available as an appendix; never assume everyone will watch it.",
  },

  // ════════ Phase 3 expansion: domain & lifestyle packs ════════
  // ── creator-studio ──
  {
    slug: "youtube-script-writer",
    name: "YouTube Script Writer",
    category: "writing",
    description: "Write retention-optimized YouTube scripts with a strong hook, clear structure, and satisfying payoff. Use when drafting a new video or tightening an existing outline.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["youtube","scriptwriting","video","retention","storytelling"],
    install_count: 41200,
    rating_avg: 4.8,
    rating_count: 1840,
    skill_content: "---\nname: YouTube Script Writer\ndescription: Writes retention-optimized YouTube scripts with hook, structured body, and payoff. Use when drafting or tightening a video script for any niche.\n---\n\n# YouTube Script Writer\n\nThis skill produces full YouTube scripts engineered for audience retention. It follows a proven three-part architecture: a hook that earns the first 30 seconds, a structured body that delivers on the promise, and a payoff that rewards the viewer and drives action.\n\n## The Hook (first 30 seconds)\n\nOpen with a pattern interrupt. The first line must create a knowledge gap or surface a pain the viewer already feels. Use one of three formulas: Shocking Stat (\"Most people waste X doing Y\"), Bold Claim (\"You have been doing X wrong for years\"), or Story Drop (drop into the middle of a high-stakes moment). Never start with \"Hey guys, welcome back.\" Tease the payoff explicitly: tell the viewer exactly what they will know or be able to do by the end.\n\n## Body Structure\n\nDivide the body into 3-5 beats. Each beat gets a mini-hook at its start (a micro-promise), delivers its point, and ends with a bridge that pulls the viewer into the next beat. Use the word \"but\" or \"here is the thing\" as natural reengagement triggers at the midpoint. Keep sentences short when spoken aloud. Mark any visual or B-roll cues in brackets.\n\n## Pacing and Pattern Interrupts\n\nEvery 90-120 seconds, insert a pattern interrupt: a new camera angle cue, a bold on-screen graphic suggestion, a rhetorical question, or a brief story. These reset viewer attention. Flag them in the script with the label [PATTERN INTERRUPT] so the editor knows.\n\n## The Payoff\n\nThe ending must deliver more than the viewer expected. Summarize the three key takeaways in one sentence each, then add one bonus insight not mentioned in the hook. This creates a reward loop that boosts average view duration. Close with a single, specific CTA tied to the video topic, not a generic subscribe ask.\n\n## Do and Do Not\n\nDo write for the ear, not the eye: read every line aloud and cut anything that trips. Do include timestamps or section labels to guide editing. Do not pad with filler transitions. Do not bury the main point past the two-minute mark. Do not end abruptly; the outro is part of the retention signal.\n\n## Escape Hatches\n\nFor educational or tutorial content, swap the Story Drop hook for a Before/After hook (show the messy before state, promise the clean after). For opinion or commentary videos, lead with the contrarian take and justify it in the body.",
  },
  {
    slug: "video-hook-writer",
    name: "Video Hook Writer",
    category: "writing",
    description: "Write high-impact opening hooks for short-form video that stop the scroll in the first 3 seconds. Use when creating Reels, TikToks, or YouTube Shorts openers.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["hooks","short-form","tiktok","reels","scroll-stopping"],
    install_count: 53700,
    rating_avg: 4.9,
    rating_count: 2310,
    skill_content: "---\nname: Video Hook Writer\ndescription: Generates scroll-stopping opening hooks for short-form video in the first 3 seconds. Use for TikTok, Reels, and YouTube Shorts openers across any niche.\n---\n\n# Video Hook Writer\n\nOn short-form video, the first three seconds are the entire audition. This skill produces spoken and visual hook combinations that arrest the scroll and create enough curiosity to keep the viewer watching.\n\n## The Three-Second Rule\n\nA hook has two components: what the viewer hears and what the viewer sees. Both must deliver signal, not setup. The spoken line must be complete enough to create a question in the viewer's mind. The visual frame must be unexpected, specific, or slightly unresolved. Avoid black frames, slow zooms, or talking-head setups with no context.\n\n## Six Hook Formulas\n\nUse one of these proven structures. First: the Callout Hook, which addresses the viewer directly (\"If you do X, stop right now\"). Second: the Curiosity Gap (\"The reason most people fail at X is not what you think\"). Third: the Transformation Promise (\"I went from X to Y in Z days and here is how\"). Fourth: the Controversy Opener (\"Unpopular opinion: X is actually killing your Y\"). Fifth: the List Tease (\"Three things I wish I knew before starting X\"). Sixth: the Visual-First Hook, where the action or result is shown before a word is spoken, then the caption or voiceover names it.\n\n## Matching Hook to Platform\n\nTikTok rewards raw authenticity: start mid-sentence or mid-action. Instagram Reels rewards a polished first frame and clear text overlay that reinforces the spoken hook. YouTube Shorts rewards the curiosity gap most reliably because the audience skews toward information. Calibrate tone and register to match the platform default.\n\n## Writing Multiple Variants\n\nFor any single video concept, produce three hook variants using different formulas. Test the one that matches the creator's existing voice best; the highest-performing hook is almost never the first draft. Label each variant by formula type so the creator can A/B test and build intuition over time.\n\n## Do and Do Not\n\nDo keep the hook line under 12 words for spoken delivery. Do make a specific claim, not a vague one. Do not use \"In this video I will show you\" as an opener. Do not start with pleasantries, context, or backstory. The viewer owes nothing; every word must earn its place.",
  },
  {
    slug: "content-repurposing",
    name: "Content Repurposing",
    category: "writing",
    description: "Turn one long-form piece of content into platform-native assets across channels. Use when maximizing reach from a video, podcast, blog post, or newsletter.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["repurposing","content-strategy","multi-platform","distribution","social-media"],
    install_count: 38900,
    rating_avg: 4.7,
    rating_count: 1620,
    skill_content: "---\nname: Content Repurposing\ndescription: Transforms one long-form content asset into platform-native pieces across channels. Use to maximize distribution from a single video, podcast episode, or article.\n---\n\n# Content Repurposing\n\nRepurposing is not copying and pasting. It is extracting the strongest signal from a long-form asset and recasting it in the native language of each platform. This skill produces a full repurposing map from a single source piece.\n\n## Start With the Source Audit\n\nBefore generating derivatives, identify the three strongest moments in the source material: the sharpest insight, the most relatable story beat, and the most actionable tip. These three moments become the nucleus of every derivative. If a moment would not work as a standalone asset, it is not strong enough to repurpose.\n\n## The Repurposing Stack\n\nFrom one long-form piece, a standard stack produces: one short-form video clip (60-90 seconds, the sharpest insight), one quote card or carousel pulling two to three lines verbatim, one tweet or X post leading with the contrarian or surprising claim, one LinkedIn post framing the insight as a professional lesson, one email newsletter paragraph adding one layer of context not in the original, and one SEO-focused blog paragraph if the source was audio or video. Each output is native, not resized.\n\n## Platform-Native Rewriting\n\nEach platform has a default register. Twitter/X rewards brevity and edge. LinkedIn rewards vulnerability and structured lessons. Instagram rewards visual metaphor and personal story. TikTok rewards immediacy and voice. Rewrite each derivative to fit the register, not just the format. A direct transcript clip posted on LinkedIn will underperform a properly framed lesson pulled from the same clip.\n\n## Timing and Sequencing\n\nPublish the original first, then stagger derivatives over five to seven days. Short-form video clips perform best in the first 48 hours post-original. Quote cards and carousels work on day three or four as reinforcement. The newsletter and blog paragraph can live longer as evergreen traffic drivers.\n\n## Do and Do Not\n\nDo add one new sentence of context to each derivative that was not in the original. Do not post the same text verbatim on multiple platforms. Do not repurpose weak moments just to fill a calendar. Do label each output with its target platform and format when delivering the repurposing map.",
  },
  {
    slug: "show-notes-writer",
    name: "Show Notes Writer",
    category: "writing",
    description: "Write complete podcast show notes with episode summary, timestamped chapters, key takeaways, and guest or resource links. Use after recording or from a transcript.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["podcast","show-notes","timestamps","seo","audio"],
    install_count: 22400,
    rating_avg: 4.6,
    rating_count: 910,
    skill_content: "---\nname: Show Notes Writer\ndescription: Produces complete podcast show notes including summary, timestamped chapters, key takeaways, and links. Use from a transcript or episode outline after recording.\n---\n\n# Show Notes Writer\n\nShow notes are the SEO and discoverability layer of a podcast episode. They serve three audiences simultaneously: the search engine that indexes the episode, the new listener deciding whether to play it, and the returning listener skimming for a specific moment. This skill produces show notes that serve all three.\n\n## Episode Summary\n\nOpen with a two-to-three sentence summary written in present tense, active voice. The first sentence names the guest (if any) and the central topic. The second sentence names the key insight or tension explored. The third sentence states what the listener will take away. This block doubles as the podcast app description and the social share text, so it must stand alone without context.\n\n## Timestamped Chapters\n\nProvide chapters at the natural topic breaks in the episode. Each chapter entry follows the format: time code, then a six-to-ten word title that names what happens, not just the topic. Bad example: \"00:04:22 - Marketing.\" Good example: \"00:04:22 - Why most creators price too low and burn out.\" Aim for five to eight chapters per hour of content. If a transcript is available, pull the exact chapter titles from the strongest sentence in each section.\n\n## Key Takeaways\n\nList three to five bullet points, each a single actionable or quotable sentence. These are the lines a listener would share or screenshot. Prioritize surprising, specific, or counterintuitive insights over generic summaries. Each bullet should work as a standalone social post.\n\n## Guest Bio and Links\n\nIf the episode has a guest, include a two-sentence bio written in third person. Follow with a links block: the guest's primary website, social profiles the guest prefers, any product or resource mentioned, and the host's own newsletter or community link last. Keep anchor text descriptive, not generic (not \"click here\").\n\n## SEO Optimization\n\nWork the episode's primary keyword into the first sentence of the summary and into at least two chapter titles. Use the guest's full name if the episode is an interview. Do not keyword-stuff; one natural occurrence per key term is sufficient. A well-structured show notes page ranks for the guest's name, the topic, and long-tail question phrases.\n\n## Do and Do Not\n\nDo write show notes every episode without exception; skipping them destroys compounding SEO value. Do not copy the transcript verbatim as the summary. Do not include every link mentioned; curate to the most useful five.",
  },
  {
    slug: "thumbnail-concept",
    name: "Thumbnail Concept",
    category: "writing",
    description: "Ideate high-CTR thumbnail concepts and paired title options for YouTube videos. Use before production to align visuals, text overlay, and title into a single click signal.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["thumbnail","youtube","ctr","title","visual-design"],
    install_count: 29800,
    rating_avg: 4.7,
    rating_count: 1340,
    skill_content: "---\nname: Thumbnail Concept\ndescription: Generates high-CTR YouTube thumbnail concepts with visual direction, text overlay, and paired title options. Use before filming or design to align click signal.\n---\n\n# Thumbnail Concept\n\nA thumbnail is not a decoration; it is the first ad for the video. This skill produces concrete thumbnail concepts with a visual direction, text overlay copy, and a paired title so the creator enters production with a clear click-through target.\n\n## The CTR Triangle\n\nEvery high-performing thumbnail has three elements working together: a clear focal point (a face with a strong expression, a dramatic object, a before/after split), a text overlay of two to five words that adds information the image alone does not carry, and a color contrast that makes the thumbnail pop against YouTube's white and dark backgrounds. If any leg of the triangle is weak, CTR drops. Concept all three together, never in isolation.\n\n## Facial Expression Direction\n\nWhen the thumbnail includes a face, the expression does most of the emotional signaling. Specify the expression precisely: not \"surprised\" but \"mouth open, eyes wide, leaning toward camera.\" The expression should match the emotional payoff of the video. Curiosity, disbelief, and genuine excitement are the three highest-performing emotion categories. Avoid neutral or posed smiles; they read as stock photography.\n\n## Text Overlay Rules\n\nThe overlay should answer the question the image raises, or raise the question the image cannot. Maximum five words. Use sentence case, not all caps except for a single emphasis word. Avoid restating the title exactly; the thumbnail and title together should create a two-part message. Font should be bold, high-contrast, and legible at 120 pixels wide (mobile size). Never put text in the bottom third where the duration badge covers it.\n\n## Title Pairing\n\nFor each thumbnail concept, provide two title variants: one curiosity-gap title (\"The reason your X keeps failing\") and one direct-benefit title (\"How to fix X in under 10 minutes\"). The curiosity-gap title pairs best with a high-emotion image. The direct-benefit title pairs best with a clear result or transformation image. Match the pair before committing to production.\n\n## Concept Volume\n\nDeliver three distinct thumbnail concepts per video, each with a different visual approach (face-forward, object/result, text-heavy minimal). Creators should never go to production with a single concept. The winning thumbnail is rarely the obvious one.\n\n## Do and Do Not\n\nDo include a background color or scene direction in every concept brief. Do specify where the text overlay sits (upper left, center, etc.). Do not design thumbnails with more than three visual elements. Do not use low-contrast color combinations.",
  },
  {
    slug: "creator-content-calendar",
    name: "Creator Content Calendar",
    category: "writing",
    description: "Plan a sustainable content calendar with defined pillars, posting cadence, and theme rotation. Use when starting a channel or resetting a creator's content strategy.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["content-calendar","strategy","planning","pillars","consistency"],
    install_count: 17600,
    rating_avg: 4.5,
    rating_count: 780,
    skill_content: "---\nname: Creator Content Calendar\ndescription: Plans a sustainable content calendar with pillars, cadence, and theme rotation for solo creators. Use when launching a channel or auditing a stalled content strategy.\n---\n\n# Creator Content Calendar\n\nA content calendar is a sustainability tool, not a content idea list. Its job is to prevent decision fatigue, ensure pillar balance, and make consistency achievable at the creator's real energy level. This skill produces a calendar structure, not a filled-in schedule.\n\n## Define Three to Four Content Pillars\n\nPillars are the recurring content categories the channel is known for. A pillar is not a topic; it is a content type with a predictable format and audience expectation. Examples: Tutorial (how-to, educational), Story (experience, case study), Opinion (take, commentary), and Showcase (product, result, before/after). Every piece of content should map to one pillar. If a channel has more than four pillars, it has no pillars; collapse them.\n\n## Set a Sustainable Cadence\n\nCadence is set by the creator's consistent floor, not their best-week ceiling. If the creator can produce two pieces per week every week without exception, the cadence is two per week. Common sustainable structures: one long-form per week plus two to three short-form repurposes; one long-form every two weeks with daily short-form; or three mid-form pieces per week with no short-form. The right cadence is the one that survives a bad week.\n\n## Rotate Pillars on a Fixed Schedule\n\nOnce pillars and cadence are set, assign pillars to slots. A four-pillar channel publishing twice a week runs a two-week rotation: week one covers pillars one and two; week two covers pillars three and four. This guarantees every pillar gets coverage monthly and removes the \"what do I post today\" question entirely. Theme weeks (a week dedicated to one topic across all pillars) can be layered on top for seasonal or campaign moments.\n\n## Build a 30-Day Idea Bank\n\nFor each pillar, generate eight to ten specific ideas before the calendar goes live. An idea bank removes the blank-page problem and allows batching. Batching (filming or writing multiple pieces in one session) is the primary lever for consistency. A 30-day bank means the creator is never fewer than 30 days behind on ideation.\n\n## Review and Audit Cadence\n\nSchedule a monthly 20-minute calendar audit: what published, what did not, and why. Track one metric per pillar (views, shares, replies) to identify which pillar is growing the audience fastest. Adjust pillar weight quarterly based on data, not preference.\n\n## Do and Do Not\n\nDo build the calendar around the creator's real constraints (job, family, energy), not an ideal scenario. Do not plan more than four weeks out in detail; leave week five onward as pillar slots only. Do not treat a missed post as a failure; treat it as a cadence recalibration signal.",
  },
  // ── data-science-ml ──
  {
    slug: "eda-playbook",
    name: "EDA Playbook",
    category: "data",
    description: "Run a structured exploratory data analysis before modeling. Use when starting a new dataset, debugging model failures, or auditing data quality.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["eda","data-quality","visualization","statistics","preprocessing"],
    install_count: 41200,
    rating_avg: 4.7,
    rating_count: 1840,
    skill_content: "---\nname: EDA Playbook\ndescription: Guides an analyst through a structured exploratory data analysis before any modeling begins. Apply when receiving a new dataset, debugging unexpected model behavior, or auditing data quality upstream.\n---\n\n# EDA Playbook\n\nSkipping EDA before modeling is the single most common source of silent failures in ML pipelines. This skill establishes a repeatable, thorough checklist that surfaces problems early.\n\n## 1. Shape and Schema Audit\n\nBefore anything else, verify the dataset dimensions and types match expectations.\n\n- Confirm row count is in the expected range; flag if orders of magnitude off\n- Check every column dtype; coerce-or-drop mismatches before downstream steps\n- List columns with any null values and their null rates\n- Flag columns with null rate above 20% for explicit handling decisions\n\n## 2. Target Variable Analysis\n\nUnderstand the label distribution before touching features.\n\n- For classification: compute class frequencies and imbalance ratio\n- For regression: plot the full distribution; check skew and kurtosis\n- Identify any label values that are implausible or out of range\n- Document the target definition precisely — ambiguity here cascades everywhere\n\n## 3. Univariate Feature Profiling\n\nProfile each feature independently before studying interactions.\n\n- Numeric: min, max, mean, median, std, 1st and 99th percentiles\n- Categorical: cardinality, top-5 values, frequency of the modal value\n- Flag near-zero-variance features (std / mean below 0.01 for numerics; single value covering more than 98% for categoricals)\n- Do NOT drop anything yet — document and defer\n\n## 4. Missingness Patterns\n\nRandom missingness and structural missingness require different treatment.\n\n- Compute a missingness correlation matrix across columns\n- Columns that are always missing together suggest a data pipeline branch — investigate the source\n- MCAR vs MNAR determination should be documented as an assumption when not verifiable\n\n## 5. Bivariate and Leakage Checks\n\nCorrelation with the target is useful; perfect correlation is a red flag.\n\n- Any feature with Pearson or Spearman r above 0.95 with the target warrants a leakage investigation\n- Timestamp-derived features must be verified to use only information available at prediction time\n- Identifiers (IDs, keys) should be excluded from modeling features unless deliberate\n\n## 6. Summary and Decision Log\n\nEDA output is only valuable if it drives decisions.\n\n- Produce a written summary: dataset health, top risks, proposed handling for each flagged issue\n- Record decisions (drop, impute, transform, flag) with rationale — not just the outcome\n- Treat this log as a living document that gets updated when modeling reveals new issues",
  },
  {
    slug: "model-evaluation-report",
    name: "Model Evaluation Report",
    category: "data",
    description: "Evaluate an ML model honestly against baselines, metrics, and error slices. Use before shipping, after retraining, or when stakeholders ask if the model is good enough.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["evaluation","metrics","baselines","error-analysis","ml"],
    install_count: 36800,
    rating_avg: 4.8,
    rating_count: 2150,
    skill_content: "---\nname: Model Evaluation Report\ndescription: Produces a rigorous, honest evaluation of an ML model including baselines, business-relevant metrics, and slice-level error analysis. Apply before any model promotion, stakeholder demo, or retraining decision.\n---\n\n# Model Evaluation Report\n\nA model that beats a naive baseline on aggregate accuracy can still be worse than useless in production. Honest evaluation means choosing the right metrics, establishing real baselines, and examining where the model fails.\n\n## 1. Establish Baselines First\n\nNo model result is meaningful without a comparison point.\n\n- Majority-class classifier (classification) or mean-predictor (regression) is the floor\n- Prior production model or rule-based system is the real bar to beat\n- Human-level performance should be noted when it is measurable\n- Report all baselines in the same table as the candidate model\n\n## 2. Choose Metrics That Match the Business Problem\n\nAccuracy is rarely the right primary metric.\n\n- For imbalanced classification: prefer F1, precision-recall AUC, or Matthews Correlation Coefficient\n- For ranking: use NDCG or MAP, not accuracy\n- For regression: report both MAE and RMSE; large RMSE-to-MAE ratios signal outlier sensitivity\n- Identify one primary metric and state it before looking at results — post-hoc metric selection is p-hacking\n\n## 3. Confidence Intervals and Statistical Significance\n\nPoint estimates without uncertainty are incomplete.\n\n- Bootstrap confidence intervals (1000 resamples minimum) for all primary metrics\n- For A/B-style comparisons: report p-value and effect size, not just significance\n- Flag any evaluation set smaller than 500 samples as underpowered\n\n## 4. Slice-Level Error Analysis\n\nAggregate metrics hide the groups where the model fails.\n\n- Segment performance by: each categorical feature, buckets of key numeric features, and time (if applicable)\n- Flag any slice where performance is more than 10 percentage points below overall\n- Report slice sample sizes — a slice with 12 examples is not actionable\n- Equity audit: check performance parity across demographic-correlated features if data permits\n\n## 5. Calibration and Confidence Quality\n\nFor probabilistic models, calibration matters as much as discrimination.\n\n- Plot a reliability diagram (calibration curve) for classifiers\n- Expected Calibration Error (ECE) should be reported\n- A well-discriminating but poorly calibrated model needs Platt scaling or isotonic regression before deployment\n\n## 6. Evaluation Report Structure\n\nThe report is the artifact, not the notebook.\n\n- One-page executive summary: task, primary metric, baseline, result, recommendation\n- Full metric table with confidence intervals\n- Slice analysis table with flagged underperformers\n- Known failure modes and mitigations\n- Go / No-go recommendation with explicit criteria",
  },
  {
    slug: "feature-store-design",
    name: "Feature Store Design",
    category: "data",
    description: "Design reusable, leakage-safe features and a feature store schema. Use when building ML infrastructure, sharing features across models, or preventing training-serving skew.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["feature-store","feature-engineering","mlops","leakage","data-pipeline"],
    install_count: 18400,
    rating_avg: 4.6,
    rating_count: 620,
    skill_content: "---\nname: Feature Store Design\ndescription: Guides the design of a reusable, leakage-safe feature store including entity modeling, transformation versioning, and point-in-time correctness. Apply when sharing features across models, building ML platform infrastructure, or diagnosing training-serving skew.\n---\n\n# Feature Store Design\n\nFeature stores exist to solve three problems at once: reuse across models, point-in-time correctness during training, and consistency between training and serving. A design that solves only one of these is incomplete.\n\n## 1. Entity and Feature Naming Conventions\n\nConsistent naming is load-bearing — it is the API contract for every downstream model.\n\n- Entity format: <entity-type>_id (e.g., user_id, item_id, session_id)\n- Feature format: <entity-type>__<source>__<transformation>__<window> (e.g., user__payments__sum__30d)\n- Avoid abbreviations not defined in a project glossary\n- Each feature must have exactly one owning team or owner string in metadata\n\n## 2. Point-in-Time Correctness\n\nThe most common feature store bug is silent label leakage from future data.\n\n- Every feature retrieval must accept an as-of timestamp parameter\n- Offline training joins must use point-in-time correct lookups — never a naive left join on entity ID\n- Audit any feature derived from a slowly-changing dimension for the correct SCD type\n- Document the event-time vs processing-time distinction for every feature source\n\n## 3. Feature Versioning and Backfills\n\nChanging a feature definition without a new version is a breaking change.\n\n- Increment feature version when: transformation logic changes, source table changes, window size changes\n- Old version must remain readable during any transition period\n- Backfills must be idempotent; document the backfill strategy (full vs incremental)\n- Store the transformation code reference (git commit or DAG run ID) alongside feature values\n\n## 4. Online vs Offline Store Split\n\nOnline and offline stores have different consistency requirements.\n\n- Offline store: append-only, partitioned by entity and date, optimized for bulk training retrieval\n- Online store: low-latency key-value lookup, serves latest value only\n- Dual-write pipelines must have a lag monitor — divergence beyond acceptable threshold triggers an alert\n- Document acceptable staleness SLOs per feature (e.g., 15-minute max lag for online store)\n\n## 5. Governance and Discovery\n\nA feature store no one can discover is a feature store no one reuses.\n\n- Every feature must have: description, entity, dtype, source table, owner, SLO, and a freshness check\n- Deprecation process: mark deprecated, notify owners of dependent models, hard-delete after 90 days\n- Track feature usage by model to identify orphaned features and high-value shared features",
  },
  {
    slug: "experiment-tracking",
    name: "Experiment Tracking",
    category: "data",
    description: "Set up disciplined ML experiment tracking for reproducibility and comparison. Use when starting a new model project, onboarding a team, or when results cannot be reproduced.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["mlops","reproducibility","experiment-tracking","versioning","ml"],
    install_count: 29700,
    rating_avg: 4.7,
    rating_count: 1120,
    skill_content: "---\nname: Experiment Tracking\ndescription: Establishes a disciplined experiment tracking setup covering logging, artifact versioning, and reproducibility standards. Apply when bootstrapping a new ML project, onboarding a team to a tracking tool, or investigating why a result cannot be reproduced.\n---\n\n# Experiment Tracking\n\nAn experiment no one can reproduce is a result no one can trust. Disciplined tracking is not overhead — it is the minimum viable scientific practice for ML.\n\n## 1. What to Log on Every Run\n\nInconsistent logging is as bad as no logging.\n\n- Hyperparameters: every value, including defaults — do not rely on code to reconstruct them\n- Dataset: name, version or hash, split sizes, and any sampling applied\n- Code: git commit SHA; fail the run if the working tree is dirty unless explicitly allowed\n- Environment: Python version, key library versions (framework, numpy, pandas minimum)\n- Metrics: train, validation, and test values; log per-epoch curves for iterative models\n- Artifacts: model checkpoint path, preprocessor path, and evaluation report path\n\n## 2. Experiment Naming and Organization\n\nNaming is the index — garbage names make the tracker useless.\n\n- Format: <project>/<hypothesis>/<variant> (e.g., churn/feature-selection/drop-low-variance)\n- Never reuse a run name; each run is immutable once logged\n- Group runs into experiments by hypothesis, not by date or author\n- Tag runs with: dataset version, model family, and outcome (promoted / rejected / inconclusive)\n\n## 3. Reproducibility Requirements\n\nA run is reproducible only if it can be re-executed to within metric tolerance.\n\n- Random seeds must be set and logged for: Python random, numpy, framework RNG, and data shuffling\n- Dataset splits must be deterministic — hash-based splitting is preferred over random splits\n- Containerized environments (Docker image SHA or conda lock file) are the gold standard\n- Spot-check reproducibility: re-run the top experiment from scratch quarterly\n\n## 4. Comparison and Promotion Workflow\n\nTracking only has value if it drives decisions.\n\n- Promotion criterion must be defined before any experiment starts — not after results are in\n- Compare runs using the same held-out test set; changing the test set resets the comparison\n- Record the reason a run was rejected — negative results are valuable data\n- Link every promoted model artifact back to the exact run that produced it\n\n## 5. Tooling Defaults\n\nMLflow is the default for self-hosted setups; Weights and Biases for teams needing collaboration features. Both satisfy the requirements above.\n\n- Use the tracking server, not local file logging, for any team setting\n- Set artifact storage to a shared location (S3 or GCS) from day one\n- Automate the logging scaffold — a run that requires manual logging steps will be logged inconsistently",
  },
  {
    slug: "model-card-writer",
    name: "Model Card Writer",
    category: "data",
    description: "Write a model card documenting intended use, training data, evaluation, and limitations. Use before deploying any model that affects people or will be shared externally.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["model-card","documentation","ai-governance","transparency","ml"],
    install_count: 22100,
    rating_avg: 4.5,
    rating_count: 890,
    skill_content: "---\nname: Model Card Writer\ndescription: Produces a complete model card covering intended use, training data, evaluation results, limitations, and ethical considerations. Apply before deploying any model that affects people or will be shared beyond the immediate team.\n---\n\n# Model Card Writer\n\nA model card is the contract between the team that built a model and the people who will use or be affected by it. It documents not just what the model does but what it should and should not be used for.\n\n## 1. Model Overview Section\n\nStart with the facts any reader needs to orient themselves.\n\n- Model name, version, and release date\n- Model type: architecture family (e.g., gradient boosted trees, transformer) in plain language\n- Intended use cases: specific, bounded statements of what the model is designed to do\n- Out-of-scope uses: explicit list of uses the model is NOT designed for\n- Primary contact or owning team\n\n## 2. Training Data Section\n\nData documentation is as important as model documentation.\n\n- Dataset name(s) and version(s)\n- Collection method and time range\n- Geographic and demographic scope\n- Known gaps or underrepresented populations\n- Data preprocessing steps that affect interpretation\n- Do NOT include PII or specifics that would allow reconstruction of training records\n\n## 3. Evaluation Results Section\n\nReport results honestly, including failures.\n\n- Primary metric and value with confidence interval\n- Baseline comparisons (majority class, prior model, human performance if measured)\n- Slice-level results for demographic and domain subgroups\n- Known failure modes with estimated frequency\n- Evaluation dataset description (distinct from training data)\n\n## 4. Limitations and Risks Section\n\nThis section requires more honesty than most teams are comfortable with — do it anyway.\n\n- Performance degradation conditions: distribution shifts, edge cases, adversarial inputs\n- Potential for misuse and how it has been mitigated\n- Fairness considerations: which groups may be disadvantaged and what was done about it\n- Uncertainty: what the team does not know about model behavior in production\n\n## 5. Usage Guidance Section\n\nGive the consumer enough information to use the model responsibly.\n\n- Recommended confidence threshold or decision rules\n- Human-in-the-loop requirements for high-stakes decisions\n- Monitoring requirements: what signals indicate the model needs retraining\n- Version policy: how long this version will be maintained and what triggers a new version\n\n## 6. Format and Publishing\n\n- Model cards should be stored with the model artifact, not in a separate documentation system\n- Review and update the card at every model version bump\n- A model card that has not been updated in over 12 months should be treated as stale",
  },
  {
    slug: "data-drift-monitor",
    name: "Data Drift Monitor",
    category: "data",
    description: "Monitor production models for data and concept drift, set alert thresholds, and decide when to retrain. Use when deploying a model, setting up MLOps pipelines, or investigating model degradation.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["drift-detection","mlops","monitoring","retraining","production-ml"],
    install_count: 15600,
    rating_avg: 4.6,
    rating_count: 540,
    skill_content: "---\nname: Data Drift Monitor\ndescription: Establishes a monitoring strategy for data drift and concept drift in production ML systems, including statistical tests, alert thresholds, and retraining triggers. Apply when deploying a model, building an MLOps pipeline, or investigating unexplained model performance degradation.\n---\n\n# Data Drift Monitor\n\nModels trained on historical data degrade when the world changes. Drift monitoring is the early-warning system that distinguishes a model aging gracefully from one silently failing.\n\n## 1. Types of Drift to Monitor\n\nNot all drift requires the same response.\n\n- Data drift (covariate shift): input feature distribution changes; model may still work if the label relationship is stable\n- Concept drift: the relationship between features and labels changes; requires retraining regardless of input distribution\n- Label drift: ground truth label distribution shifts; relevant for classification thresholds\n- Upstream data drift: schema changes or pipeline failures masquerading as real drift\n\n## 2. Statistical Tests by Feature Type\n\nChoose tests matched to the feature type.\n\n- Continuous features: Kolmogorov-Smirnov test or Population Stability Index (PSI)\n- Categorical features: chi-squared test or Jensen-Shannon divergence\n- PSI thresholds: below 0.1 is stable, 0.1-0.2 is moderate (investigate), above 0.2 is significant (act)\n- Use a rolling reference window (last 30 days of training data) rather than a fixed baseline\n\n## 3. Monitoring Cadence and Coverage\n\nMonitor everything at the same frequency is wasteful.\n\n- High-frequency inputs: monitor daily; low-frequency inputs: monitor weekly\n- Always monitor the top 10 features by model importance at maximum frequency\n- Ground truth labels often lag predictions — account for this delay in concept drift checks\n\n## 4. Alert Thresholds and Escalation\n\nAlerts with no action plan create alert fatigue.\n\n- Warning: PSI above 0.1 or KS p-value below 0.05 — investigate, do not retrain yet\n- Critical: PSI above 0.2 or primary business metric drops more than 5% from 30-day baseline — initiate retraining evaluation\n- Every alert must route to a named owner; suppress alerts during known events with documented windows\n\n## 5. Retraining Decision Criteria\n\nRetraining has a cost; trigger it on evidence, not on schedule alone.\n\n- Triggers: critical drift alert, primary metric degradation above threshold, or quarterly review minimum\n- Before retraining: verify new training data does not contain the drift as label leakage\n- After retraining: shadow-deploy and compare metrics on recent production data before full promotion\n- Document each retraining event: trigger reason, data window used, metric delta, and promotion decision",
  },
  // ── educators-toolkit ──
  {
    slug: "lesson-plan-builder",
    name: "Lesson Plan Builder",
    category: "writing",
    description: "Designs structured lesson plans with clear objectives, activities, and assessments. Use when creating or refining a lesson from scratch or adapting existing material.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["lesson-plan","education","teaching","objectives","curriculum"],
    install_count: 41200,
    rating_avg: 4.8,
    rating_count: 1840,
    skill_content: "---\nname: Lesson Plan Builder\ndescription: Designs complete lesson plans with clear objectives, scaffolded activities, and aligned assessments. Load when drafting or refining a lesson from scratch.\n---\n\n# Lesson Plan Builder\n\nA strong lesson plan is a contract between the teacher and the learners: here is where we start, here is what we will do, here is how we will know we arrived. Every element earns its place or gets cut.\n\n## Start With the Objective\n\nWrite the objective before anything else. Use the form: Students will be able to [observable verb] [specific content] [condition or standard]. Bloom's verbs sharpen the cognitive level: identify, compare, construct, evaluate. Avoid vague verbs like \"understand\" or \"appreciate.\" One primary objective per lesson; secondary objectives are optional and clearly labeled as such.\n\n## Structure the Flow\n\nUse a four-part arc: Hook (3-7 minutes), Instruction/Modeling, Guided Practice, Closure. Label each segment with an estimated time. The hook activates prior knowledge or creates a productive puzzle. Instruction is direct and concise. Guided practice has students doing, not watching. Closure requires students to synthesize, not just summarize.\n\n## Choose Activities With Purpose\n\nEach activity must connect to the objective. Ask: if a student does this activity well, are they closer to meeting the objective? If the answer is no, cut the activity. Prefer activities that generate evidence of learning over activities that generate engagement alone. Think-pair-share, exit tickets, and mini-whiteboards create low-stakes evidence quickly.\n\n## Build In Assessment\n\nFormative checks are non-negotiable. Identify at least one moment mid-lesson to gauge understanding before moving on. Name the signal that means re-teach and the signal that means proceed. The summative assessment or exit task should directly mirror the objective wording.\n\n## Materials and Differentiation Notes\n\nList only materials that are actually required. Flag any item that needs advance preparation. Note one modification for students who need more support and one extension for students who finish early. These are brief notes, not separate plans.\n\n## Output Format\n\nDeliver the lesson plan as a clean, scannable document: Objective, Grade/Level, Duration, Standards Alignment (if provided), Flow Table (Segment / Time / Description / Materials), Formative Check, Differentiation Notes. Use plain language. A substitute teacher should be able to run this lesson.",
  },
  {
    slug: "rubric-builder",
    name: "Rubric Builder",
    category: "writing",
    description: "Builds fair, specific grading rubrics tied to learning objectives. Use when creating or calibrating an assessment rubric for any subject or grade level.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["rubric","grading","assessment","feedback","education"],
    install_count: 28700,
    rating_avg: 4.7,
    rating_count: 1120,
    skill_content: "---\nname: Rubric Builder\ndescription: Builds fair, specific grading rubrics aligned to learning objectives. Load when designing or calibrating a rubric for any assignment or assessment.\n---\n\n# Rubric Builder\n\nA rubric does two jobs: it tells students exactly what mastery looks like before they begin, and it gives teachers a consistent, defensible standard when scoring. A rubric that fails either job is a liability, not a tool.\n\n## Anchor to the Objective\n\nEvery criterion in the rubric must map directly to a stated learning objective. Start by listing the objectives being assessed, then derive one criterion per objective or cluster of tightly related objectives. If a criterion cannot be traced to an objective, cut it. This keeps rubrics lean and defensible.\n\n## Choose the Right Format\n\nAnalytic rubrics score each criterion separately and are preferred for complex work. Holistic rubrics give a single score based on an overall impression and are appropriate for quick checks or short tasks. Single-point rubrics describe only the proficient level and invite narrative feedback on either side; they are efficient and popular for iterative draft work. Default to analytic for any graded assignment worth more than minor credit.\n\n## Write Descriptors That Distinguish, Not Just Rank\n\nEach performance level must describe observable, specific behaviors, not vague gradations. Avoid: \"excellent,\" \"good,\" \"needs improvement.\" Instead: describe what the work contains, how it is structured, or what is missing. Write the proficient level first, then adjust up and down. Each descriptor should answer the question: what would I see in this student's work?\n\n## Set Performance Levels\n\nFour levels is the standard: Exceeds Expectations, Meets Expectations, Approaching Expectations, Does Not Yet Meet Expectations. Three levels work for simple tasks. Five or more levels create scoring drift and are rarely worth the calibration effort. Label levels with descriptive language, not just numbers or letters, so feedback is inherent in the score.\n\n## Weight the Criteria\n\nNot all criteria matter equally. Assign point values or percentages that reflect the relative importance of each criterion to the objective. Document the weighting rationale so it can be shared with students and defended to stakeholders.\n\n## Output Format\n\nDeliver the rubric as a table: rows are criteria, columns are performance levels. Include a point value per level per criterion, a total points row, and a brief header note stating the assignment and the objectives the rubric assesses. Offer to generate a student-facing version with plain-language descriptors on request.",
  },
  {
    slug: "quiz-generator",
    name: "Quiz Generator",
    category: "writing",
    description: "Writes quizzes and assessments across varied cognitive levels using Bloom's Taxonomy. Use when building formative checks, unit tests, or review materials for any subject.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["quiz","assessment","blooms-taxonomy","education","testing"],
    install_count: 53400,
    rating_avg: 4.6,
    rating_count: 2210,
    skill_content: "---\nname: Quiz Generator\ndescription: Writes quizzes and assessments at varied cognitive levels using Bloom's Taxonomy. Load when building formative checks, unit tests, or review materials.\n---\n\n# Quiz Generator\n\nA well-constructed quiz is a learning event, not just a measuring event. Questions at the right cognitive level reveal what students actually understand, surface misconceptions before they calcify, and give teachers actionable data.\n\n## Map to Bloom's Taxonomy First\n\nBefore writing a single question, list the cognitive levels the assessment should cover. Bloom's six levels from lower to higher order: Remember, Understand, Apply, Analyze, Evaluate, Create. A typical formative quiz covers Remember through Apply. A unit exam should reach Analyze and Evaluate. A performance task reaches Evaluate and Create. State the target distribution before generating questions; do not drift toward all-recall by default.\n\n## Question Type Selection\n\nMatch the question type to the cognitive level. Multiple choice is efficient for Remember and Understand; use it sparingly for Apply and above. Short answer is versatile across Apply, Analyze, and Evaluate. Constructed response and scenario-based questions are best for Analyze and above. True/false is low signal and should be used only for diagnostic pre-checks, never for graded summative work.\n\n## Write Distractors That Teach\n\nFor multiple choice, distractors should represent predictable misconceptions, not random wrong answers. Each distractor should be plausible to a student who partially understands the concept. Avoid \"all of the above\" and \"none of the above\" except in carefully controlled contexts. The correct answer must be unambiguously correct; if a second answer requires a defensible interpretation, rewrite the stem.\n\n## Vary the Stem Complexity\n\nLower-order questions use direct, simple stems: define, identify, list. Higher-order questions use scenarios, data sets, or documents as stimulus material. When using stimulus material, keep it concise and relevant. Avoid culturally specific references that create construct-irrelevant difficulty.\n\n## Include an Answer Key With Rationale\n\nThe answer key is part of the deliverable. For each question, provide the correct answer and a one-sentence rationale explaining why it is correct and why common wrong answers are wrong. This enables faster grading and supports student review.\n\n## Output Format\n\nDeliver questions grouped by cognitive level, labeled clearly. Provide a summary table: question number, cognitive level, point value, and question type. Total points should be stated. Offer to generate a student-facing version with instructions and a teacher version with the answer key as separate documents.",
  },
  {
    slug: "student-feedback-writer",
    name: "Student Feedback Writer",
    category: "writing",
    description: "Writes specific, growth-oriented written feedback for student work. Use when drafting comments on assignments, portfolios, or progress reports.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["feedback","student-writing","growth-mindset","education","assessment"],
    install_count: 34100,
    rating_avg: 4.9,
    rating_count: 1560,
    skill_content: "---\nname: Student Feedback Writer\ndescription: Writes specific, growth-oriented written feedback for student work. Load when drafting comments on assignments, progress reports, or portfolio reviews.\n---\n\n# Student Feedback Writer\n\nEffective feedback closes the gap between where a student is and where they need to be. Vague praise and undirected criticism both fail this goal. Every piece of feedback must give the student something specific to hold onto and a clear direction to move.\n\n## The Core Structure: Glow, Grow, Go\n\nDefault to three-part feedback: Glow (what is working and why), Grow (the highest-leverage thing to improve), Go (a concrete next action). Each part is one to three sentences. The Glow is not perfunctory praise; name the specific technique, choice, or skill the student demonstrated. The Grow identifies one thing, not five. The Go translates the Grow into an actionable step the student can take immediately.\n\n## Be Specific About Evidence\n\nReference the student's actual work. Cite a specific sentence, calculation, choice, or moment. Feedback that could apply to any student in the class has no value to this student. Compare: \"Good introduction\" versus \"Your opening question pulls the reader in because it creates a puzzle the essay then answers.\" The second comment teaches and motivates; the first does neither.\n\n## Match Tone to Context\n\nFor draft feedback, be direct and developmental: the goal is revision, so be honest about what is not working. For summative feedback, balance honesty with acknowledgment of effort and growth over time. For progress reports, write in third person and address both the parent and student. For peer feedback coaching, model the language students should use with each other.\n\n## Avoid Feedback That Undermines Agency\n\nDo not rewrite the student's work in the feedback comment. Describe what is missing or unclear, then ask a question that guides the student to find the solution. Avoid hedging language that softens feedback into meaninglessness: \"You might want to consider possibly...\" is not actionable. Be warm and direct simultaneously.\n\n## Calibrate Length to Stakes\n\nFormative draft feedback: three to six sentences. Summative end-of-unit feedback: one short paragraph. Progress report narrative: two to four sentences per subject area. Portfolio or capstone feedback: two to three paragraphs. Longer is not more helpful; precision is more helpful.\n\n## Output Format\n\nDeliver feedback as plain prose in the format appropriate to the context. For batches of student work, use a consistent template so feedback is comparable across students. Flag any feedback that touches sensitive areas (behavior, family context, learning differences) and recommend teacher review before delivery.",
  },
  {
    slug: "curriculum-mapper",
    name: "Curriculum Mapper",
    category: "productivity",
    description: "Maps a curriculum or scope-and-sequence across a term or year. Use when planning unit sequences, aligning standards, or identifying gaps in a course of study.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["curriculum","scope-and-sequence","planning","standards","education"],
    install_count: 19300,
    rating_avg: 4.5,
    rating_count: 890,
    skill_content: "---\nname: Curriculum Mapper\ndescription: Maps a curriculum or scope-and-sequence across a term or year. Load when planning unit sequences, aligning standards, or auditing a course of study for gaps.\n---\n\n# Curriculum Mapper\n\nCurriculum mapping makes the invisible visible: it shows what is taught, when, in what order, and whether the sequence actually serves student learning. A good map prevents redundancy, surfaces gaps, and creates a shared language across a department or school.\n\n## Establish the Parameters First\n\nBefore mapping, confirm: the grade level or course, the duration (semester, trimester, year), the number of instructional days available after subtracting testing windows and non-instructional days, the standards or framework being used, and the non-negotiable anchor events (state testing dates, major projects, schedule breaks). These parameters constrain and define the map.\n\n## Identify the Big Units\n\nBreak the course into four to eight major units. Fewer than four suggests insufficient granularity; more than eight creates scheduling fragility. Name each unit by its essential question or central concept, not just its topic. \"How do ecosystems respond to disruption?\" is more useful than \"Ecosystems Unit 3.\" Assign each unit a preliminary time allocation in weeks.\n\n## Sequence With Intention\n\nUnit sequence should follow a learning logic, not a textbook order. Consider: which concepts are prerequisite to others? Which units benefit from prior real-world context students will have in a given season? Where is the year's most cognitively demanding work placed, and does that placement account for student stamina and assessment load? Surface any unit that could move without damaging the sequence; these are your scheduling flexibility reserves.\n\n## Align Standards Explicitly\n\nFor each unit, list the primary standards addressed and whether each standard is introduced, developed, or mastered in that unit. A standard that appears only once is a coverage flag, not a mastery plan. Standards that never appear are gaps. Standards that appear in every unit may indicate over-reliance or a scope problem.\n\n## Identify Vertical and Horizontal Connections\n\nHorizontal connections are links to other subjects taught at the same grade level in the same time window: opportunities for interdisciplinary reinforcement. Vertical connections are links to what students learned the prior year and what they will learn the next year. Flag both, even briefly; they inform pacing and depth decisions.\n\n## Output Format\n\nDeliver the map as a table: columns for Unit Name, Essential Question, Weeks Allocated, Primary Standards (with I/D/M notation), Key Assessments, and Connection Notes. Include a summary row with total weeks and a gap/redundancy flag column. Offer a condensed one-page visual overview and a detailed unit-by-unit breakdown as separate views.",
  },
  {
    slug: "differentiated-instruction",
    name: "Differentiated Instruction",
    category: "productivity",
    description: "Adapts a lesson or unit for different readiness levels and learning needs. Use when modifying existing instruction to reach a wider range of learners.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["differentiation","inclusion","accessibility","teaching","education"],
    install_count: 22800,
    rating_avg: 4.7,
    rating_count: 1030,
    skill_content: "---\nname: Differentiated Instruction\ndescription: Adapts a lesson or unit for different readiness levels and learning needs. Load when modifying existing instruction to reach a wider range of learners in one classroom.\n---\n\n# Differentiated Instruction\n\nDifferentiation is not about creating separate lessons for every student. It is about designing one lesson with intentional entry points, flexible pathways, and multiple ways to demonstrate mastery. The goal is the same objective for all students; the scaffolds and extensions adjust the path, not the destination.\n\n## Start With the Core Task Intact\n\nDo not dilute the learning objective when differentiating. A student who receives only low-complexity tasks is being denied access to grade-level learning. Identify the core task every student will do, then design supports that allow struggling learners to access it and extensions that deepen it for students who are ready. The core task is the anchor; everything else is scaffolding or extension.\n\n## Differentiate by Readiness, Interest, or Learning Profile\n\nReadiness differentiation adjusts complexity: vocabulary support, sentence frames, worked examples, or reduced problem sets for students who need more time; additional constraints, abstract extensions, or cross-disciplinary connections for students who need more challenge. Interest differentiation offers choice in topic or application context while holding the skill constant. Learning profile differentiation varies representation and response mode: visual organizers, oral response, physical manipulation. Default to readiness differentiation first; it has the highest instructional return.\n\n## Use Tiered Assignments\n\nTiered assignments address the same essential concept at different levels of complexity. Design three tiers: approaching grade level, at grade level, and above grade level. Each tier uses the same essential question but varies the text complexity, the number of steps, the degree of abstraction, or the amount of scaffolding provided. Tiers should not be visible to students as ranked; frame them as different versions, not easy and hard.\n\n## Build in Flexible Grouping\n\nGroup students by readiness for skill-specific instruction; use mixed-readiness groups for collaborative problem-solving and discussion. Never use permanent ability groups. Regroup based on data from recent formative assessments, not historical placement. Students should experience both peer teaching and peer learning across the year.\n\n## Design Supports That Fade\n\nScaffolds are temporary by design. Sentence frames, graphic organizers, and worked examples should be gradually removed as students demonstrate independence. If a support never fades, it has become a crutch rather than a scaffold. Build a release plan into the differentiation design: when does this support go away and what signals that the student is ready?\n\n## Output Format\n\nDeliver differentiation plans as annotated additions to the original lesson plan. Label each modification with the differentiation type (readiness/interest/profile), the target group, and the scaffold/extension strategy. Include a one-row summary table for quick teacher reference during the lesson. Avoid jargon; use plain descriptors a substitute or paraprofessional can follow.",
  },
  // ── finance-accounting-ops ──
  {
    slug: "month-end-close",
    name: "Month-End Close",
    category: "business",
    description: "Run a clean, fast month-end close with a controlled checklist. Triggers on close process, reconciliation, journal entries, accruals, or month-end.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["accounting","close","reconciliation","accruals","controls"],
    install_count: 18400,
    rating_avg: 4.7,
    rating_count: 820,
    skill_content: "---\nname: Month-End Close\ndescription: Guides finance teams through a structured, controlled month-end close process covering journal entries, reconciliations, accruals, and sign-off. Use when closing books, preparing for audit, or reducing close cycle time.\n---\n\n# Month-End Close\n\nA fast, clean close is the result of consistent preparation, not heroics at deadline. This skill walks through the close sequence with hard checkpoints so nothing slips and the books reflect economic reality.\n\n## Pre-Close Preparation (days -3 to -1)\n\nBefore the period ends, confirm sub-ledger cutoffs with AP, AR, payroll, and inventory. Distribute a close calendar with hard deadlines for each team. Pre-build recurring journal entry templates (depreciation, prepaid amortization, deferred revenue release) so Day 1 is execution, not drafting. Flag any unusual transactions from the period for senior review.\n\n## Day 1: Sub-Ledger Lock and Journal Entries\n\nPost all recurring and standard journals first. Order matters: payroll accruals, then depreciation, then prepaid releases, then deferred revenue, then one-time items. Each entry must carry a preparer, reviewer, and source document reference. Lock sub-ledgers (AP, AR, inventory) before any G/L reconciliation begins.\n\n## Day 2-3: Reconciliations\n\nReconcile every balance sheet account, not just cash. Priority order: bank accounts (tie to bank statement), intercompany balances (zero-sum across entities), AR aging (match to G/L control), AP aging (match to G/L control), fixed asset roll-forward, prepaid schedule, accrued liabilities schedule. Flag any variance over your materiality threshold for explanation before moving on.\n\n## Day 3-4: Review and Flux Analysis\n\nRun a P&L flux: compare each line to prior month and prior year same month. Any variance above 10% or your materiality floor needs a one-line explanation. This is not a memo exercise — it is error detection. Unexplained swings almost always indicate a misposted entry or missed accrual.\n\n## Day 5: Sign-Off and Lock\n\nController or CFO reviews the flux pack and reconciliation sign-off sheet. No adjustment after lock without a documented correcting entry. Post the trial balance to your reporting tool. Distribute the close package to stakeholders with a summary of any significant items.\n\n## Common Failure Modes\n\nDo not skip the sub-ledger lock step — late invoices posted after reconciliation are the leading cause of restatements. Do not carry forward unreconciled variances with a note to fix next month. Require same-day correction. Accruals should be estimated from actuals (vendor invoices in transit, payroll days worked), never rounded guesses.",
  },
  {
    slug: "financial-statement-builder",
    name: "Financial Statement Builder",
    category: "business",
    description: "Build and interpret the three core financial statements and explain how they interconnect. Use when preparing, reviewing, or explaining income statements, balance sheets, or cash flow statements.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["financial-statements","accounting","income-statement","balance-sheet","cash-flow"],
    install_count: 24700,
    rating_avg: 4.8,
    rating_count: 1340,
    skill_content: "---\nname: Financial Statement Builder\ndescription: Builds and interprets the income statement, balance sheet, and cash flow statement, and explains how they connect. Use when preparing financials, reviewing a package, explaining statements to stakeholders, or auditing for errors.\n---\n\n# Financial Statement Builder\n\nThe three core statements are one system, not three documents. An error in one surfaces in another. This skill covers construction order, the mechanical links between statements, and the most common mistakes to catch on review.\n\n## Construction Order\n\nAlways build in this sequence: Income Statement first, then Balance Sheet, then Cash Flow Statement. The net income from the income statement flows into retained earnings on the balance sheet and into the top of the indirect cash flow statement. Building out of order breaks the linkages and forces reconciliation loops.\n\n## Income Statement\n\nStart with revenue recognized in the period (not cash received). Deduct cost of goods sold or cost of revenue to get gross profit. Deduct operating expenses by natural category (compensation, software, marketing, facilities, D&A) to get operating income (EBIT). Deduct interest expense, add interest income, to get pre-tax income. Apply the effective tax rate to get net income. Include a gross margin percentage and operating margin percentage as sanity checks on every draft.\n\n## Balance Sheet\n\nAssets equal liabilities plus equity — always. Build assets top to bottom: current assets (cash, AR, inventory, prepaid), then non-current (PP&E net of depreciation, intangibles, investments). Build liabilities top to bottom: current (AP, accrued liabilities, deferred revenue, current portion of debt), then non-current (long-term debt, deferred tax). Retained earnings closes the loop: prior retained earnings plus net income minus dividends equals current retained earnings.\n\n## Cash Flow Statement (Indirect Method)\n\nStart with net income. Add back non-cash charges (depreciation, amortization, stock-based compensation). Adjust for working capital changes: increase in AR is a use of cash; increase in AP is a source. This section is operating cash flow. Investing activities capture capex and acquisitions. Financing activities capture debt draws, repayments, equity issuances, and dividends. Ending cash must match the cash line on the balance sheet.\n\n## The Three Links to Verify\n\nNet income on the P&L equals the net income line at the top of the cash flow statement. The change in cash on the cash flow statement equals the change in cash between opening and closing balance sheets. Retained earnings on the closing balance sheet equals opening retained earnings plus net income minus dividends declared.\n\n## Red Flags on Review\n\nBalance sheet does not balance: find the period where it first broke and trace backward. Operating cash flow is negative while net income is positive over multiple periods: check revenue recognition timing and AR growth. Cash flow from financing is the largest positive line every period: the business is not self-funding, which is a strategic flag not an accounting error.",
  },
  {
    slug: "budget-vs-actual",
    name: "Budget vs. Actual Variance Analysis",
    category: "data",
    description: "Produce a budget-vs-actual variance analysis that explains the why behind each gap, not just the numbers. Use when reporting monthly results, presenting to leadership, or diagnosing performance misses.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["variance-analysis","budgeting","reporting","fpa","performance"],
    install_count: 31200,
    rating_avg: 4.6,
    rating_count: 1870,
    skill_content: "---\nname: Budget vs. Actual Variance Analysis\ndescription: Structures a variance analysis that isolates root causes behind budget gaps rather than restating numbers. Use when reporting monthly financials, presenting to the board, or diagnosing why a line missed plan.\n---\n\n# Budget vs. Actual Variance Analysis\n\nVariance analysis is diagnostic, not descriptive. A report that says revenue was 8% below budget is not analysis. Analysis says why, which team or product drove it, whether it is recoverable, and what it means for the full-year forecast.\n\n## Set Up the Right Columns\n\nThe base table has five columns: Actual, Budget, Variance (Actual minus Budget), Variance Percent, and a one-line explanation. Add a YTD Actual and YTD Budget pair if the review is mid-year. Do not add a Prior Year column to the variance table — that belongs in a separate trend view. Mixing budget variance and year-over-year in one table confuses the reader.\n\n## Materiality Threshold Before You Write\n\nDefine a materiality floor before writing any explanations. A reasonable default is the greater of 5% variance or a fixed dollar amount tied to total budget (e.g., 0.5% of monthly revenue budget). Variances below that threshold get no narrative. This discipline keeps the report focused on decisions, not accounting noise.\n\n## Decompose Revenue Variances First\n\nRevenue variances decompose into price, volume, and mix. Volume variance equals (actual units minus budgeted units) times budgeted price. Price variance equals (actual price minus budgeted price) times actual units. Mix variance is the residual when segment composition differs from plan. Identify which driver is largest before writing the explanation. A volume miss and a price miss have different remedies.\n\n## Expense Variance Categories\n\nGroup expense variances into three buckets: timing (the spend happened, just not in this period), volume-driven (spend moved with a revenue or headcount driver), and structural (the cost base is different from plan regardless of volume). Timing variances resolve themselves and need a one-line note. Volume-driven variances need a rate check (is cost per unit in line?). Structural variances require a decision.\n\n## Writing the Explanation\n\nEach material line gets one sentence in the format: what happened, why it happened, and whether it is expected to continue. Example: Revenue was 120k below budget due to a three-week delay in a contracted implementation project; the project began in the following period and the shortfall is not expected to recur. Avoid passive voice and avoid blaming external factors without evidence.\n\n## Full-Year Reforecast Flag\n\nAfter completing the variance table, flag any line where the YTD variance is structural and requires a full-year reforecast. Do not carry a known miss forward in the budget without an updated number. A budget that no longer reflects reality is not a management tool.",
  },
  {
    slug: "cash-flow-forecast",
    name: "Cash Flow Forecast",
    category: "business",
    description: "Build a rolling cash-flow forecast and runway view to know how much cash the business has and when it runs out. Use when managing liquidity, planning fundraising, or stress-testing the balance sheet.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["cash-flow","runway","forecasting","liquidity","treasury"],
    install_count: 27900,
    rating_avg: 4.7,
    rating_count: 1120,
    skill_content: "---\nname: Cash Flow Forecast\ndescription: Builds a rolling 13-week and 12-month cash flow forecast with runway view. Use when managing liquidity, planning for fundraising, preparing board materials, or stress-testing the business under downside scenarios.\n---\n\n# Cash Flow Forecast\n\nA cash forecast is not a P&L on a different template. It tracks when cash actually moves, not when revenue is recognized or expenses are accrued. Precision on timing is the entire point.\n\n## Two Horizons, Two Approaches\n\nRun two forecasts in parallel. The 13-week forecast is a bottom-up, week-by-week view of actual cash in and out. It is operational. The 12-month forecast is a top-down driver-based model used for planning and runway. They should agree in the overlapping weeks — if they diverge, the 13-week is right and the 12-month needs recalibration.\n\n## 13-Week Forecast Structure\n\nFor each week, project: collections from customers (use AR aging plus expected new bookings converted with your average days-to-collect), payroll runs (use the exact pay schedule), vendor payments (use AP aging plus expected new invoices), recurring SaaS and fixed costs (pull from your vendor contracts), and any scheduled debt or tax payments. Sum to net cash change per week, accumulate to ending cash balance. Flag any week where ending cash falls below your minimum operating reserve (typically one to two months of fixed costs).\n\n## 12-Month Forecast Structure\n\nDrive revenue collections from a bookings or ARR model. Drive COGS from a gross margin assumption. Drive opex from a headcount plan (compensation is usually 60 to 75% of opex) plus a non-headcount opex line per department. Capex from the asset plan. Working capital changes from DSO, DPO, and inventory turn assumptions. The 12-month model does not need weekly precision — monthly is sufficient.\n\n## Runway Calculation\n\nRunway equals current cash divided by average monthly net cash burn. Use the trailing three-month average burn, not the worst month or the best month. Show three scenarios: base (current trajectory), upside (20% better collections, 10% lower spend), and downside (20% worse collections, flat spend). Board materials should always show the downside runway. If downside runway is under 12 months, that is a fundraising trigger.\n\n## Working Capital Levers\n\nBefore assuming a fundraise, model the working capital levers: accelerate collections (incentivize early payment, tighten credit terms), extend payables (negotiate net-60 with key vendors), reduce inventory (if applicable), or defer non-essential capex. Each lever should show a dollar and week impact on the 13-week view.\n\n## Common Mistakes\n\nDo not use net income as a proxy for cash flow — revenue recognition timing and non-cash charges make this unreliable. Do not forecast collections as a flat percentage of revenue without aging-based validation. Do not show a single-scenario forecast to a board — it signals overconfidence.",
  },
  {
    slug: "fpa-model",
    name: "FP&A Operating Model",
    category: "data",
    description: "Build a driver-based FP&A operating model that ties business inputs to financial outputs. Use when building an annual plan, preparing investor materials, or stress-testing assumptions.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["fpa","modeling","forecasting","drivers","planning"],
    install_count: 14300,
    rating_avg: 4.5,
    rating_count: 390,
    skill_content: "---\nname: FP&A Operating Model\ndescription: Builds a driver-based FP&A operating model linking business inputs to P&L, balance sheet, and cash flow outputs. Use when building an annual plan, preparing investor materials, running scenario analysis, or stress-testing the business.\n---\n\n# FP&A Operating Model\n\nA driver-based model is built on the belief that financial outputs are the result of measurable business actions. Revenue is not a number pulled from a goal — it is a function of pipeline, conversion rate, average contract value, and sales capacity. Every assumption should be traceable to a business driver, not a wish.\n\n## Model Architecture\n\nStructure the model in four layers. The Assumptions layer holds every input: growth rates, hiring plan, pricing, margins, DSO, and macro variables. The Revenue layer translates demand drivers into recognized revenue. The Expense layer translates the headcount plan and operational drivers into opex and COGS line items. The Output layer assembles the three financial statements automatically from the above. Never hardcode a number in the output layer — it must flow from the assumptions.\n\n## Revenue Build\n\nFor SaaS or subscription: start with beginning ARR, add new ARR from new logos (pipeline times close rate times ACV), add expansion ARR, subtract churn ARR (beginning ARR times churn rate), to get ending ARR. Monthly revenue equals ending ARR divided by 12. For transaction businesses: units sold times ASP, by segment. For services: billable headcount times utilization rate times bill rate. Make the revenue build auditable — one row per driver.\n\n## Expense Build\n\nHeadcount is the anchor. Build a headcount roster with role, department, start month, fully-loaded cost per head (salary plus benefits plus payroll tax, typically 1.2 to 1.3 times base). Derive compensation expense from the roster. Non-headcount opex should be modeled as either a fixed amount per month or a variable rate tied to a driver (e.g., hosting costs as a percentage of revenue, sales commissions as a percentage of new ARR). Avoid modeling opex as a flat year-over-year growth rate — it obscures the underlying drivers.\n\n## Scenario Framework\n\nBuild three scenarios into the assumptions layer: Base (most likely), Bull (upside on revenue drivers, flat costs), Bear (revenue miss, cost reduction response). The model outputs should change automatically when the scenario selector changes. The gap between Bull and Bear operating cash flow in month 18 is your planning uncertainty band. If that band is wider than your cash on hand, you need either a larger reserve or a tighter cost structure.\n\n## Model Hygiene\n\nOne formula per row — do not mix hardcoded numbers and formulas in the same column range. Color-code inputs (blue) versus calculated cells (black) so any reviewer can spot manual overrides. Date the version and lock the prior actuals columns. A model that is easy to audit will be used; one that is not will be replaced with a spreadsheet in someone's desktop.\n\n## Key Outputs to Surface\n\nGross margin percentage by period. Operating margin. Headcount by department end of period. Net new ARR (for SaaS). Operating cash flow. Runway in months. These six metrics should appear on a summary dashboard tab that updates from the model automatically.",
  },
  {
    slug: "expense-policy",
    name: "Expense & Approval Policy",
    category: "business",
    description: "Write a clear, enforceable expense and approval policy that sets limits, approval chains, and reimbursement rules. Use when drafting company policy, updating spend controls, or preparing for a finance audit.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["expense-policy","controls","compliance","approvals","spend-management"],
    install_count: 9800,
    rating_avg: 4.4,
    rating_count: 215,
    skill_content: "---\nname: Expense and Approval Policy\ndescription: Drafts a clear, enforceable expense and approval policy covering spend limits, approval chains, reimbursement rules, and audit requirements. Use when writing or updating company policy, onboarding a finance system, or preparing for a compliance review.\n---\n\n# Expense and Approval Policy\n\nAn expense policy that employees ignore is worse than no policy — it creates a false sense of control. A good policy is short enough to read, specific enough to apply, and enforced consistently. This skill produces a policy that covers the decisions people actually face.\n\n## Policy Structure\n\nA complete expense policy covers five topics: what is reimbursable, spend limits by category, approval authority by amount, documentation requirements, and submission deadlines. Each section should be a table or a short bulleted list — not prose paragraphs. Employees should be able to scan to the answer in under 30 seconds.\n\n## Reimbursable Categories and Limits\n\nDefine per-transaction limits for the most common categories. Travel: airfare in economy for flights under six hours, reasonable hotel rate with a nightly cap (typically set to the median business hotel rate in that city). Meals: per-person daily cap (a common default is 75 USD per day for domestic travel, 100 USD for international). Client entertainment: separate cap per-person per-event, requires client names documented. Software and tools: anything over a defined threshold (e.g., 500 USD annually) requires manager pre-approval. Equipment: requires pre-approval and becomes company property. Anything not listed is not reimbursable without explicit pre-approval.\n\n## Approval Authority Matrix\n\nDefine who can approve what by dollar amount. A common structure: up to 1,000 USD — direct manager; 1,000 to 10,000 USD — department head; over 10,000 USD — CFO or equivalent. Purchases above the threshold require pre-approval before the expense is incurred, not after. Emergency exceptions require CFO notification within 24 hours. No one approves their own expense.\n\n## Documentation Requirements\n\nEvery reimbursable expense requires a receipt showing vendor, date, and amount. Credit card statements do not substitute for receipts. Meal and entertainment expenses require a note on business purpose and attendee names. Lost receipts require a signed attestation — allow no more than one per quarter per employee before flagging for review.\n\n## Submission Deadlines and Reimbursement\n\nExpenses must be submitted within 30 days of the transaction date. Expenses submitted after 90 days may be denied. Reimbursements are processed on the standard payroll cycle following submission and approval. This is not a negotiable timeline — late submissions create audit exposure and distort period expenses.\n\n## Enforcement and Violations\n\nState the consequences plainly: expenses submitted without receipts will not be reimbursed; policy violations may result in disciplinary action; patterns of late submission or policy avoidance will be escalated to HR. A policy without stated consequences is a suggestion. Audit a random sample of five percent of all expenses each month and report findings to the CFO quarterly.",
  },
  // ── health-and-longevity ──
  {
    slug: "nutrition-planner",
    name: "Nutrition Planner",
    category: "personal",
    description: "Build a sustainable nutrition plan around protein targets, whole foods, and long-term adherence. Not medical advice; consult a registered dietitian for clinical needs.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["nutrition","protein","meal-planning","diet","wellness"],
    install_count: 41200,
    rating_avg: 4.7,
    rating_count: 1840,
    skill_content: "---\nname: Nutrition Planner\ndescription: Helps users build a sustainable nutrition plan centered on protein targets, whole foods, and adherence strategies. Use when planning meals, adjusting macros, or building lasting dietary habits. Not medical advice.\n---\n\n# Nutrition Planner\n\nThis skill builds a practical, sustainable nutrition plan. It prioritizes protein adequacy, whole-food sourcing, and habits that hold up over months, not days. This is general wellness guidance, not medical advice — consult a registered dietitian or physician for clinical dietary needs.\n\n## Set a Protein Target First\n\nProtein is the highest-leverage macro. The default target is 1.6–2.2 g per kg of body weight per day. Start at the low end for sedentary individuals and move toward the high end for anyone training 3+ days per week. Distribute protein across at least 3 meals to maximize muscle protein synthesis. Good anchors: eggs, Greek yogurt, cottage cheese, chicken, fish, legumes, tofu.\n\n## Calorie Framework\n\nEstimate total daily energy expenditure using body weight in lbs multiplied by 14–16 for maintenance (lower end for desk workers, higher for active individuals). For fat loss, apply a 300–500 kcal deficit. For muscle gain, a 200–300 kcal surplus. Avoid extremes: deficits beyond 750 kcal/day reliably destroy adherence and muscle mass.\n\n## Food Quality Over Complexity\n\nBuild 80% of the diet from whole, minimally processed foods: vegetables, fruits, legumes, whole grains, lean proteins, nuts, and seeds. The remaining 20% can be flexible — rigid perfection is the enemy of long-term adherence. No food is categorically off-limits; frequency and portion govern outcomes.\n\n## Meal Structure for Adherence\n\nDesign a repeatable template of 3–4 meals rather than tracking every bite forever. A useful default: protein + vegetable + starchy carb at each main meal, with one or two protein-anchored snacks if needed. Batch-cook grains, proteins, and roasted vegetables once or twice per week to eliminate decision fatigue.\n\n## Hydration and Fiber\n\nTarget 2.5–3.5 L of water per day, more with heavy training or heat. Fiber target is 25–35 g per day from vegetables, fruit, legumes, and whole grains. Fiber intake strongly predicts diet quality and satiety.\n\n## Adjusting and Troubleshooting\n\nReview progress every 2–3 weeks, not daily. Scale changes are unreliable day-to-day. If weight is not moving as intended after 3 weeks, adjust calories by 10–15% before overhauling the whole plan. If adherence is breaking down, reduce complexity first — simplicity beats precision.",
  },
  {
    slug: "strength-training-plan",
    name: "Strength Training Plan",
    category: "personal",
    description: "Use when someone starts lifting, hits a strength or hypertrophy plateau, restructures a lifting program, or wants to build strength or muscle — designing a progressive resistance program with splits, compound movement patterns, sets/reps, progressive overload, and deloads from barbells and dumbbells. General fitness guidance, not medical advice. Owns resistance/strength training only. Do NOT use to program high-intensity interval conditioning or circuits (use fitness-program), a steady-state aerobic-base or Zone 2 block (use zone-2-cardio-plan), or a mobility/flexibility routine (use mobility-routine).",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["strength","lifting","progressive-overload","fitness","muscle"],
    install_count: 38700,
    rating_avg: 4.8,
    rating_count: 2210,
    skill_content: "---\nname: Strength Training Plan\ndescription: Use when someone starts lifting, hits a strength or hypertrophy plateau, restructures a lifting program, or wants to build strength or muscle — designing a progressive resistance program with splits, compound movement patterns, sets/reps, progressive overload, and deloads from barbells and dumbbells. General fitness guidance, not medical advice. Owns resistance/strength training only. Do NOT use to program high-intensity interval conditioning or circuits (use fitness-program), a steady-state aerobic-base or Zone 2 block (use zone-2-cardio-plan), or a mobility/flexibility routine (use mobility-routine).\n---\n\n# Strength Training Plan\n\nDesign a structured, progressive strength program based on training age, available days, and equipment. Default to a barbell-and-dumbbells gym environment; note escapes for home and minimal equipment. This is general fitness guidance, not medical advice — consult a qualified coach or sports medicine professional for injuries or complex needs.\n\n## Establish Training Age and Frequency\n\nBeginners (under 12 months consistent training) respond best to full-body sessions 3 days per week. Intermediates (1–3 years) benefit from 3–4 days using an upper/lower or push/pull/legs split. Advanced trainees (3+ years) typically need 4–5 days to drive progress. Match frequency to recovery capacity — more is not always better.\n\n## Core Movement Patterns\n\nEvery program should include all five patterns: hip hinge (deadlift, Romanian deadlift), squat (back squat, goblet squat), horizontal push (bench press, push-up), horizontal pull (row), and vertical pull (pull-up, lat pulldown). Vertical push (overhead press) is the sixth and should be included when shoulder health allows. These are the pillars; accessories are optional.\n\n## Progressive Overload Protocol\n\nThe default progression scheme for beginners: add weight every session (linear progression). For intermediates: add weight every week or every other week. Track every working set. When the prescribed reps are hit across all sets with good form, add 2.5–5 kg to upper body lifts and 5 kg to lower body lifts next session. If progression stalls for 2 consecutive weeks, deload (reduce load by 10–15% for one week) before pushing again.\n\n## Rep and Set Ranges\n\nFor strength (1RM focus): 3–5 sets of 3–5 reps at 80–90% effort. For hypertrophy (size focus): 3–5 sets of 6–12 reps. For endurance or work capacity: 2–4 sets of 12–20 reps. Mixing ranges across a program is normal — compound lifts heavier, accessories lighter.\n\n## Warm-Up and Session Structure\n\nStart every session with 5 minutes of light cardio or general movement, then 2–3 warm-up sets of the first compound lift (50% and 70% of working weight). Keep sessions to 45–75 minutes. Compound lifts first when fresh, isolation accessories last.\n\n## Recovery and Deload\n\nSchedule a deload week every 4–8 weeks of hard training: reduce volume by 40–50% while keeping intensity moderate. Sleep 7–9 hours per night — it is the single most effective recovery tool available. Protein timing matters less than total daily protein; focus there first.\n\n## Quality Bar\n\nA finished program must:\n\n- Match weekly frequency and split to the trainee's training age and stated recovery capacity, not to ambition.\n- Cover all five core movement patterns across the week (add vertical push when shoulders allow).\n- Specify a concrete progression rule and a stall trigger — what to add, when, and what to do when it stops working.\n- Assign explicit sets, reps, and effort per lift, tied to the trainee's goal (strength, hypertrophy, or work capacity).\n- Schedule deloads up front, not reactively.\n- Fit each session inside 45–75 minutes with compounds before isolation.\n\n## What NOT to Do\n\n- Do not prescribe a 5–6 day advanced split to a beginner — frequency outruns recovery and progress stalls.\n- Do not write open-ended progression (\"just add weight when you can\"). Name the increment and the stall rule.\n- Do not skip the hinge or vertical pull because they are uncomfortable; rebalanced programs build imbalances.\n- Do not bolt conditioning intervals, an aerobic base, or a mobility flow into this program — hand those off to fitness-program, zone-2-cardio-plan, and mobility-routine.\n- Do not give injury rehab or medical advice. Refer out.\n",
  },
  {
    slug: "bloodwork-explainer",
    name: "Bloodwork Explainer",
    category: "personal",
    description: "Explains common lab panels in plain language, typical reference ranges, and what questions to bring to a doctor. For education only; not a diagnostic tool and not medical advice.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["bloodwork","labs","health-literacy","biomarkers","wellness"],
    install_count: 29400,
    rating_avg: 4.6,
    rating_count: 1420,
    skill_content: "---\nname: Bloodwork Explainer\ndescription: Explains common lab panels in plain language and what questions to bring to a doctor. Use when reviewing blood test results and wanting to understand what markers mean. Education only; not medical advice or diagnosis.\n---\n\n# Bloodwork Explainer\n\nThis skill translates common blood test results into plain language and helps formulate informed questions for a physician. It does not diagnose conditions or recommend treatments. Lab interpretation is always context-dependent — age, sex, medications, and symptoms matter. Bring all questions to a qualified healthcare provider.\n\n## Complete Blood Count (CBC)\n\nThe CBC measures red blood cells (RBCs), white blood cells (WBCs), and platelets. Key markers: hemoglobin (oxygen-carrying capacity; low suggests anemia), hematocrit (percentage of blood that is RBCs), WBC count (immune activity; high can indicate infection or inflammation), and platelets (clotting). A single out-of-range value in isolation rarely means much — trends and clinical context matter.\n\n## Comprehensive Metabolic Panel (CMP)\n\nThe CMP screens organ function. Liver markers: ALT and AST (elevated with liver stress, heavy alcohol, or intense exercise); ALP (bile ducts and bone). Kidney markers: creatinine and BUN (waste clearance); eGFR (estimated kidney filtration rate). Electrolytes: sodium, potassium, chloride, bicarbonate. Glucose (fasting): normal is 70–99 mg/dL; 100–125 is pre-diabetic range. Calcium: relevant for bone and nerve function.\n\n## Lipid Panel\n\nMeasures cardiovascular risk markers. Total cholesterol alone is a poor predictor. Focus on: LDL (low-density lipoprotein — the primary target; optimal is generally under 100 mg/dL for most adults, lower for high-risk individuals), HDL (high-density lipoprotein — higher is better; under 40 mg/dL is a risk factor), and triglycerides (under 150 mg/dL is normal; high levels correlate with poor metabolic health). Ask the doctor about ApoB if cardiovascular risk is a concern.\n\n## Hormones and Thyroid\n\nTSH (thyroid-stimulating hormone) is the standard thyroid screen; abnormal values prompt follow-up with free T4 and T3. Testosterone (total and free) is relevant for symptoms of fatigue, low libido, or body composition changes in both men and women. HbA1c reflects average blood glucose over roughly 3 months and is the standard diabetes screen. Vitamin D (25-OH) is frequently low; optimal range is debated but most clinicians target 30–60 ng/mL.\n\n## What to Ask Your Doctor\n\nUseful questions: What is the trend versus my previous results? Which out-of-range values require action now versus monitoring? Are any medications or supplements affecting these results? What lifestyle changes would move the most important markers? When should I retest?\n\n## Understanding Reference Ranges\n\nReference ranges are statistical, not absolute — they represent the middle 95% of a tested population, which includes undiagnosed sick people. Optimal ranges for longevity sometimes differ from standard lab reference ranges. Never self-diagnose from a single panel. Use results as a starting point for a productive conversation with a doctor.",
  },
  {
    slug: "injury-prehab",
    name: "Injury Prehab",
    category: "personal",
    description: "Designs prehab and mobility work to reduce injury risk at common problem areas: shoulders, knees, lower back, and hips. General movement guidance; consult a physio for existing injuries.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["prehab","injury-prevention","mobility","rehab","movement"],
    install_count: 22100,
    rating_avg: 4.7,
    rating_count: 980,
    skill_content: "---\nname: Injury Prehab\ndescription: Designs prehab and mobility work to reduce injury risk for shoulders, knees, lower back, and hips. Use when starting a training program or addressing chronic tightness. General movement guidance; not medical advice; consult a physio for existing injuries.\n---\n\n# Injury Prehab\n\nThis skill designs prehab routines — proactive work to build resilience and reduce injury risk at common problem areas before problems start. It covers the four most common zones: shoulders, knees, lower back, and hips. This is general movement guidance, not medical advice or physical therapy. Consult a licensed physiotherapist or sports medicine physician for any existing injury or pain.\n\n## Shoulder Prehab\n\nThe rotator cuff is the most common failure point. Core exercises: band or cable external rotation (3 sets of 15 at light load), face pulls (3 sets of 15–20), and YTW raises (2 sets of 10–12). Additionally, serratus anterior work (wall slides, scapular push-up plus) protects shoulder mechanics under load. Perform 2–3 days per week, ideally before pressing sessions. Avoid internal impingement by keeping pressing volume in check and balancing it with equal or greater pulling volume.\n\n## Knee Prehab\n\nKnee injuries most often originate in weak glutes and hips, not the knee itself. Priority exercises: glute bridges and hip thrusts (3 sets of 15–20), lateral band walks (2 sets of 15 per side), and terminal knee extensions with a band (3 sets of 15 per side). For the VMO (inner quad): Spanish squats or sissy squats at slow tempo. Add single-leg work (split squats, step-ups) to identify and correct side-to-side asymmetry.\n\n## Lower Back Prehab\n\nThe lower back needs stability, not mobility. Core endurance is the target. The McGill Big Three are the evidence-based default: curl-up (not a crunch — keep the lumbar neutral), side plank, and bird dog. Perform each for 3 sets of 8–10 reps with a 10-second hold, or progress to timed sets. Additionally, hip flexor mobility (couch stretch, 90/90 hip stretch) directly unloads the lumbar spine. Avoid heavy spinal flexion under fatigue.\n\n## Hip Prehab\n\nHip health requires both strength and range of motion. Strength work: Copenhagen plank (adductors), clamshells with a band, and single-leg RDL. Mobility work: 90/90 hip stretch (internal and external rotation), deep squat holds with thoracic rotation, and hip flexor stretch with posterior tilt. Spend 5 minutes on hips daily — it has outsized returns for lower body longevity.\n\n## Programming Prehab\n\nThe default approach: 10–15 minutes of targeted prehab before each training session, focusing on the areas being trained that day. For non-training days, a 10-minute full-body prehab circuit covering all four zones works well. Consistency over intensity — light, frequent work outperforms occasional heavy corrective sessions.",
  },
  {
    slug: "longevity-protocol",
    name: "Longevity Protocol",
    category: "personal",
    description: "Assembles an evidence-informed longevity routine spanning sleep, zone 2 cardio, strength, and diet. General wellness guidance; not medical advice; consult a physician before major lifestyle changes.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["longevity","healthspan","zone2","sleep","wellness"],
    install_count: 54800,
    rating_avg: 4.9,
    rating_count: 2380,
    skill_content: "---\nname: Longevity Protocol\ndescription: Assembles an evidence-informed weekly longevity routine covering sleep, zone 2 cardio, strength training, and dietary patterns. Use when building or auditing a long-term health practice. General wellness guidance; not medical advice.\n---\n\n# Longevity Protocol\n\nThis skill assembles a practical, evidence-informed longevity routine. The goal is to maximize healthspan — the years lived in good physical and cognitive function — through the four most robustly supported domains: sleep, aerobic capacity, muscular strength, and nutrition. This is general wellness guidance, not medical advice. Consult a physician before making major changes, especially if managing chronic conditions.\n\n## Sleep: The Non-Negotiable Foundation\n\nSleep is the highest-leverage longevity intervention available. Target 7–9 hours of total sleep per night. Prioritize consistency over total duration: a fixed wake time anchors circadian rhythm better than trying to manage bedtime. The key behaviors: no bright light or screens in the 30–60 minutes before bed, keep the bedroom cool (65–68 F / 18–20 C), avoid caffeine after 1–2 PM, and limit alcohol — even moderate amounts fragment deep sleep. Chronic sleep restriction below 6 hours is associated with accelerated biological aging.\n\n## Zone 2 Cardio: Building the Aerobic Base\n\nZone 2 cardio (a pace where a full sentence can be spoken but conversation is effortful) is the most studied exercise modality for longevity outcomes. The evidence-based target is 150–180 minutes per week. Modalities: brisk walking, cycling, rowing, swimming, or light jogging. The default weekly structure is 3–4 sessions of 40–50 minutes. VO2 max is one of the strongest predictors of all-cause mortality; Zone 2 work builds the base that enables VO2 max improvement over time.\n\n## Strength Training: Preserving Muscle and Bone\n\nMuscle mass and grip strength are independent predictors of longevity. The minimum effective dose: 2–3 full-body strength sessions per week. Prioritize compound movements (squat, hinge, push, pull). Progressive overload should be maintained into older age — the body responds to training stimulus at every age. Muscle mass is the primary reservoir for glucose disposal, reducing metabolic disease risk.\n\n## Nutrition: The Dietary Pillars\n\nNo single diet extends life, but consistent patterns matter. The evidence-supported defaults: high protein (1.6–2.2 g/kg body weight), abundant vegetables and fiber (30+ g/day), minimal ultra-processed food, and limited added sugar. Mediterranean and whole-food plant-rich patterns have the strongest longevity data. Time-restricted eating (eating within a 10–12 hour window) has metabolic benefits for some individuals; it is a useful tool, not a requirement.\n\n## Stress and Cognitive Health\n\nChronic psychological stress accelerates biological aging via inflammatory and hormonal pathways. Evidence-supported interventions: consistent social connection, purposeful activity, nature exposure, and any practice that builds deliberate recovery (breath work, meditation, walking without a phone). These are not soft add-ons; chronic stress undermines the benefits of every other longevity pillar.\n\n## Weekly Template\n\nA practical default week: Zone 2 cardio on Monday, Wednesday, Friday, and Saturday (45 min each); strength training Tuesday, Thursday, and Saturday (45–60 min each); one full rest or active recovery day. Sleep and nutrition apply every day. Adjust volume based on recovery — the goal is consistency over years, not maximal output in any single week.",
  },
  {
    slug: "mobility-routine",
    name: "Mobility Routine",
    category: "personal",
    description: "Builds a daily mobility and flexibility routine for desk workers targeting hips, thoracic spine, shoulders, and ankles. General movement guidance; not medical advice; consult a physio for pain.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["mobility","flexibility","desk-worker","stretching","posture"],
    install_count: 33500,
    rating_avg: 4.6,
    rating_count: 1150,
    skill_content: "---\nname: Mobility Routine\ndescription: Builds a daily mobility and flexibility routine for desk workers targeting hips, thoracic spine, shoulders, and ankles. Use when addressing stiffness, poor posture, or building a movement practice. General guidance; not medical advice.\n---\n\n# Mobility Routine\n\nThis skill builds a practical daily mobility routine for desk workers — people who spend 6–10 hours seated and accumulate stiffness in predictable places: the hips, thoracic spine, shoulders, and ankles. The default routine takes 10–15 minutes and can be done on the floor with no equipment. This is general movement guidance, not medical advice. Consult a physiotherapist if any movement causes sharp or radiating pain.\n\n## Understanding the Problem Pattern\n\nProlonged sitting creates a consistent pattern: hip flexors shorten, glutes underactivate, the thoracic spine rounds and stiffens, the cervical spine juts forward, and the shoulders round inward. Ankle dorsiflexion also degrades without regular challenge. A good routine targets all of these areas with a balance of lengthening (passive and active) and reinforcement (loaded end-range movement).\n\n## Hip Complex\n\nThe 90/90 hip stretch is the highest-return single mobility exercise for desk workers. Sit with both legs at 90 degrees, one in front and one to the side. Hold the forward-shin position for 60–90 seconds per side, gently rotating the torso toward the front leg. Follow with a couch stretch (rear foot elevated behind you, lunge position, posterior pelvic tilt) held 60 seconds per side. These two exercises address both hip flexors and hip internal/external rotation.\n\n## Thoracic Spine\n\nThe thoracic spine (mid and upper back) becomes stiff in flexion from sustained sitting. Open-book rotations: lie on one side with knees stacked, rotate the top arm overhead and open the chest toward the ceiling; hold 2–3 seconds, repeat 8–10 per side. Thread-the-needle (from quadruped, thread one arm under and across the body) is a useful complement. For extension: a foam roller or rolled towel placed horizontally under the thoracic spine, extending over it for 60–90 seconds at 2–3 levels, is highly effective.\n\n## Shoulders and Neck\n\nWall slides train shoulder mobility under load: stand with back and arms against a wall, slide arms overhead while keeping contact, 2 sets of 10. Doorway pec stretch: stand in a doorway, arms at 90 degrees, lean gently forward; hold 30 seconds per position (low, mid, high). For the neck: slow, controlled cervical rotations and lateral tilts (10 reps each direction) are preferred over aggressive stretching — the goal is range of motion, not force.\n\n## Ankles\n\nAnkle mobility is often overlooked. Banded or unloaded ankle dorsiflexion stretch: in a lunge position, drive the front knee forward over the toes while keeping the heel on the ground; 2 sets of 10 slow reps per side. Also useful: calf raises with a full stretch at the bottom (on a step or elevated surface).\n\n## Daily Routine Structure\n\nThe default sequence runs 12–15 minutes: 90/90 hip stretch (2 min per side), couch stretch (90 sec per side), thoracic foam roll (2 min), open-book rotations (90 sec per side), wall slides (2 sets), doorway pec stretch (90 sec), ankle dorsiflexion (90 sec per side), neck circles (1 min). Morning or post-work are both effective timing windows. Consistency matters far more than duration — 10 minutes daily outperforms 60 minutes once per week.",
  },
  // ── lifecycle-marketing ──
  {
    slug: "lifecycle-journey-map",
    name: "Lifecycle Journey Map",
    category: "writing",
    description: "Maps the customer lifecycle and designs the right message for each stage. Use when planning a full lifecycle communication strategy or auditing gaps in an existing one.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["lifecycle","customer-journey","onboarding","retention","messaging"],
    install_count: 18400,
    rating_avg: 4.7,
    rating_count: 610,
    skill_content: "---\nname: Lifecycle Journey Map\ndescription: Maps the customer lifecycle and designs the right message at each stage. Use when planning lifecycle comms, auditing gaps, or aligning team on messaging strategy.\n---\n\n# Lifecycle Journey Map\n\nA lifecycle map answers one question for every moment a user can be in: what should they feel, know, or do next? Get this right and every downstream campaign has a clear job.\n\n## Define Lifecycle Stages First\n\nUse five canonical stages unless the product demands otherwise: Acquisition, Activation, Engagement, Retention, and Win-Back. Resist inventing custom names until the team has shipped at least one campaign per stage. Shared vocabulary reduces meeting time.\n\n## Assign One Primary Goal Per Stage\n\nActivation owns the first value moment. Engagement owns habit formation. Retention owns renewal or upgrade intent. Each stage gets exactly one primary goal and one measurable signal that proves the goal was met. Blurring goals leads to messages that do nothing well.\n\n## Map Triggers, Not Calendars\n\nEvery stage transition should fire on a behavioral trigger, not a date. A user who completes their first export on day 14 is in Activation, not Engagement, regardless of how long they have been signed up. Build the map around events the product already tracks.\n\n## Write the Message Brief at Each Stage\n\nFor each stage, record: the user's primary anxiety, the one thing the product should say, the channel (email, in-app, push), and the call to action. Keep each brief to three sentences. This brief becomes the input for any campaign built on top of the map.\n\n## Identify Dead Zones\n\nA dead zone is any gap longer than seven days where the user receives nothing and has not reached the next milestone. Mark every dead zone on the map. Each is a churn risk and a candidate for a new touchpoint.\n\n## Validate With Data Before Building\n\nBefore writing a single email, pull the drop-off rate at each stage transition. Prioritize fixing the stage with the highest absolute user loss first. A beautiful onboarding sequence helps no one if 60 percent of users churn at the paywall before they ever reach it.",
  },
  {
    slug: "email-drip-builder",
    name: "Email Drip Builder",
    category: "writing",
    description: "Designs automated drip and onboarding email sequences that activate users. Use when building a new onboarding flow, extending an existing drip, or improving activation rates.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["drip","onboarding","email","automation","activation"],
    install_count: 42700,
    rating_avg: 4.8,
    rating_count: 1940,
    skill_content: "---\nname: Email Drip Builder\ndescription: Designs automated drip and onboarding email sequences that activate users. Use when building a new onboarding flow, extending a drip series, or diagnosing low activation rates.\n---\n\n# Email Drip Builder\n\nA drip sequence is a contract with the user: they gave you their attention, and you will return it with value at the right moment. Sequences that read like mail merges get unsubscribes. Sequences timed to behavior build habits.\n\n## Anchor Email 1 on the First Value Moment\n\nEmail 1 sends immediately on signup and has one job: show the user the fastest path to the product's core value. No feature tour. No company history. One action, one link. Subject line states the outcome, not the product name.\n\n## Space Subsequent Emails Around Behavior Gaps\n\nEmails 2 through 5 fire based on what the user has not done, not on a fixed timer. If the user completed the target action from Email 1, skip Email 2 and advance to the next milestone. Fixed-timer sequences waste sends on users who are already activated.\n\n## Each Email Earns the Next Open\n\nEvery email in the sequence must deliver something independently useful: a tip, a benchmark, a shortcut, a case study. If a user unsubscribes after reading Email 3, they should still have gotten value from the sequence. This reduces unsubscribe rates and builds sender trust.\n\n## Write Subject Lines as Promises, Not Headlines\n\nA subject line is a promise about what is inside. Match the promise exactly. Bait-and-switch subjects boost open rates and tank click rates. The best subject lines are specific and slightly incomplete: the body finishes the thought.\n\n## Gate the Sequence on a Key Action\n\nDefine one milestone action that means the user is activated. Once they hit it, stop the onboarding drip immediately and move them to the engagement track. Sending onboarding emails to already-activated users erodes trust and skews engagement metrics.\n\n## Cap Sequence Length at Eight Emails\n\nIf a user has not activated after eight emails, a ninth will not fix it. Move them to a dormant segment and address them with a win-back campaign instead. Endless drips that never resolve create unsubscribe pressure across the entire list.",
  },
  {
    slug: "win-back-campaign",
    name: "Win-Back Campaign",
    category: "writing",
    description: "Designs win-back and re-engagement campaigns for dormant users. Use when a segment of users has gone quiet and standard lifecycle messaging has stopped working.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["win-back","re-engagement","churn","retention","email"],
    install_count: 24100,
    rating_avg: 4.6,
    rating_count: 870,
    skill_content: "---\nname: Win-Back Campaign\ndescription: Designs win-back and re-engagement campaigns for dormant users. Use when a user segment has gone quiet, churn is accelerating, or standard lifecycle messaging has stopped landing.\n---\n\n# Win-Back Campaign\n\nA win-back campaign is a structured last attempt to re-engage users who have stopped responding. It is not a discount blast. Done correctly, it surfaces real reasons users left and converts a meaningful minority back into active customers.\n\n## Define Dormancy Before You Write a Word\n\nDormancy means different things for different products. Set a precise threshold: no login in 30 days for a daily-use app, no purchase in 90 days for a monthly subscription, no activity in 60 days for a B2B tool. The threshold determines the segment size and the urgency of the messaging.\n\n## Structure the Sequence as Three Beats\n\nBeat 1 (day 0): acknowledge the silence without guilt-tripping. Remind the user of the value they were getting. Beat 2 (day 7): offer something new since they left, a feature, an improvement, a piece of content. Beat 3 (day 14): make a direct ask with a clear incentive or deadline. After Beat 3, suppress from marketing sends.\n\n## Lead With Empathy, Not Promotion\n\nThe opening line of Beat 1 should name the gap plainly: the user has not been around lately. Do not pretend nothing happened. Users who feel seen are more likely to re-engage than users who receive a tone-deaf promotional email.\n\n## Use a Single Strong Incentive, Not Multiple Small Ones\n\nIf an incentive is warranted, offer one clear thing: a discount, a free month, a feature unlock, a consultation. Multiple small incentives read as desperation and dilute perceived value. The incentive should be proportional to the lifetime value of the segment.\n\n## Suppress Non-Responders Promptly\n\nUsers who do not open any of the three beats are unlikely to respond to a fourth. Suppressing them protects deliverability, reduces spam complaints, and keeps the list healthy for future campaigns. Suppression is a win, not a loss.\n\n## Measure Re-Activation, Not Just Opens\n\nA win-back campaign succeeds when users return to the product and complete a meaningful action, not when they open an email. Track re-activation rate, not open rate, as the primary metric.",
  },
  {
    slug: "segmentation-strategy",
    name: "Segmentation Strategy",
    category: "data",
    description: "Builds behavioral segments for targeted lifecycle messaging. Use when personalizing lifecycle campaigns, reducing unsubscribes, or improving click-through rates across a user base.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["segmentation","behavioral-data","personalization","lifecycle","analytics"],
    install_count: 31500,
    rating_avg: 4.7,
    rating_count: 1120,
    skill_content: "---\nname: Segmentation Strategy\ndescription: Builds behavioral segments for targeted lifecycle messaging. Use when personalizing lifecycle campaigns, reducing unsubscribes, or improving click-through rates across a diverse user base.\n---\n\n# Segmentation Strategy\n\nSegmentation is the discipline of sending fewer, better messages to the right people. The goal is not to have many segments; it is to have segments that produce meaningfully different messages.\n\n## Start With RFM, Not Demographics\n\nRecency, Frequency, and Monetary value (or engagement depth for non-transactional products) are the three axes that predict future behavior most reliably. Demographics explain who users are. RFM explains what they are likely to do next. Build behavioral segments first and layer demographics only when they change the message.\n\n## Define No More Than Six Active Segments\n\nMore than six segments is operationally unsustainable for most teams. The six that matter: New Users (0-14 days), Active Power Users, Casual Active Users, At-Risk Users (declining engagement), Dormant Users, and Churned. Each maps cleanly to a lifecycle stage and a distinct message strategy.\n\n## Use Product Events as Segment Triggers\n\nA segment is only as good as the signal that puts someone in it. Tie segment membership to product events: a user becomes At-Risk when their weekly session count drops below their personal average for two consecutive weeks. Avoid arbitrary time-based cutoffs unless behavioral data is unavailable.\n\n## Assign Each Segment a Single Next Action\n\nFor every segment, define one action that would move the user to a healthier segment. For At-Risk users, that action might be completing a specific feature. For New Users, it is reaching the first value moment. The segment brief should fit in one sentence: move user from X to Y by doing Z.\n\n## Audit Segment Sizes Monthly\n\nA segment that represents less than two percent of the list is probably too granular to justify a dedicated campaign. Merge it with the nearest adjacent segment. A segment that represents more than 40 percent of the list is probably too broad to produce relevant messaging. Split it.\n\n## Suppress Overlapping Segments at Send Time\n\nWhen a user qualifies for multiple segments, apply a priority hierarchy and suppress the lower-priority match. Receiving two messages in the same week from different segments erodes trust faster than receiving none.",
  },
  {
    slug: "push-notification-copy",
    name: "Push Notification Copy",
    category: "writing",
    description: "Writes push and in-app notification copy that is timely, relevant, and not annoying. Use when drafting mobile push, browser push, or in-app message copy for lifecycle or transactional events.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["push","in-app","mobile","copywriting","notifications"],
    install_count: 19800,
    rating_avg: 4.5,
    rating_count: 730,
    skill_content: "---\nname: Push Notification Copy\ndescription: Writes push and in-app notification copy that is timely and not annoying. Use when drafting mobile push, browser push, or in-app messages for lifecycle, transactional, or re-engagement events.\n---\n\n# Push Notification Copy\n\nPush notifications live one tap away from being blocked permanently. Every send either builds or spends trust with the user. The bar for sending is higher than email and the margin for error is narrower.\n\n## Ask Permission at the Right Moment\n\nRequest push permission immediately after the user has experienced the product's core value, not on first launch. A user who just completed their first meaningful action has a reason to say yes. A user staring at an empty onboarding screen does not. Timing the permission request correctly doubles opt-in rates.\n\n## Write to a Specific Trigger, Not a Schedule\n\nEvery push should be the direct result of something that happened: a price drop, a milestone reached, a message received, a task due. Scheduled blasts that are not tied to user-specific events are spam regardless of how well-written they are.\n\n## Keep Copy Under 60 Characters on the Title Line\n\nMost mobile lock screens truncate at 60 characters. The title must stand alone and communicate the value without the body text. Write the title last, after the body, to ensure it is the distilled essence of the message rather than a generic label.\n\n## Use the Body for Context, Not Repetition\n\nThe body line (the second line on iOS and Android) earns its place by adding the detail the title omits: the specific amount, the name of the person, the deadline. It should not repeat the title in different words. Two lines that say the same thing read as padding.\n\n## Never Send More Than One Push Per Day Per User\n\nFrequency is the fastest path to opt-out. One push per day is a ceiling, not a target. Most users should receive fewer. Build frequency caps into the notification system at the infrastructure level so individual campaign creators cannot exceed them by accident.\n\n## Measure Opt-Out Rate Alongside Click Rate\n\nA notification with a high click rate but a rising opt-out rate is a warning sign that the copy is misleading or the frequency is too high. Track both metrics together on every campaign.",
  },
  {
    slug: "email-deliverability",
    name: "Email Deliverability",
    category: "business",
    description: "Protects sender reputation and inbox placement through SPF, DKIM, DMARC, and list hygiene. Use when setting up a new sending domain, investigating spam folder placement, or auditing an existing email program.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["deliverability","spf","dkim","dmarc","list-hygiene"],
    install_count: 27300,
    rating_avg: 4.8,
    rating_count: 1450,
    skill_content: "---\nname: Email Deliverability\ndescription: Protects sender reputation and inbox placement via SPF, DKIM, DMARC, and list hygiene. Use when setting up a new sending domain, diagnosing spam folder placement, or auditing an existing email program.\n---\n\n# Email Deliverability\n\nDeliverability is not a one-time configuration task; it is an ongoing discipline. A sender reputation takes months to build and days to destroy. The practices here protect the most valuable channel most marketing teams have.\n\n## Authenticate the Sending Domain on Day One\n\nSPF, DKIM, and DMARC are not optional. SPF declares which servers are allowed to send on the domain's behalf. DKIM signs each message cryptographically. DMARC tells receiving servers what to do with unauthenticated mail and where to send reports. Set DMARC policy to p=quarantine within 30 days of launch and p=reject within 90 days once reports confirm no legitimate mail is failing.\n\n## Warm Up New Sending Domains Slowly\n\nA new IP and domain has no sending history. Start at 200 to 500 sends per day, doubling volume every three to five days while monitoring bounce and complaint rates. Skipping warmup causes inbox providers to block the domain before the list has been reached. Use a dedicated warmup tool or a structured warmup plan from the ESP.\n\n## Keep Hard Bounce Rate Below 0.5 Percent\n\nA hard bounce means the address does not exist. A rate above 0.5 percent signals poor list hygiene to inbox providers. Remove hard bounces immediately and automatically after the first occurrence. Never retry a hard bounce.\n\n## Monitor Complaint Rate and Act Fast\n\nSpam complaints above 0.1 percent trigger filtering at most major inbox providers. Gmail's Postmaster Tools and similar dashboards surface complaint rates in near real time. A spike above the threshold requires pausing sends, auditing the segment, and diagnosing the cause before resuming.\n\n## Sunset Unengaged Subscribers Before They Hurt Reputation\n\nSubscribers who have not opened or clicked in 180 days drag down engagement rates, which inbox providers use as a quality signal. Run a re-permission campaign before the 180-day mark. Suppress those who do not respond. A smaller, engaged list consistently outperforms a large, stale one.\n\n## Use a Subdomain for Marketing Sends\n\nSending from mail.example.com instead of example.com insulates transactional mail (receipts, password resets) from reputation damage caused by marketing campaigns. Configure the subdomain as a distinct sending identity with its own SPF and DKIM records.",
  },
  // ── performance-marketing ──
  {
    slug: "paid-acquisition-audit",
    name: "Paid Acquisition Audit",
    category: "business",
    description: "Audit paid channels (Google, Meta, etc.) for budget waste and scaling opportunities using CAC and ROAS benchmarks. Use when evaluating spend efficiency or planning channel expansion.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["paid-ads","cac","roas","google-ads","meta-ads"],
    install_count: 18400,
    rating_avg: 4.7,
    rating_count: 412,
    skill_content: "---\nname: Paid Acquisition Audit\ndescription: Audits paid channels for waste and scaling opportunities by evaluating CAC, ROAS, and budget allocation. Use before a budget review, after performance drops, or before scaling spend.\n---\n\n# Paid Acquisition Audit\n\nA paid acquisition audit surfaces where money is being wasted and where the ceiling on profitable spend has not been reached yet. It produces a ranked action list, not a general report.\n\n## Pull the Right Data First\n\nGather 90-day channel-level data: spend, impressions, clicks, conversions, revenue. Break it down by campaign, ad set, and ad. Do not audit less than 30 days — short windows hide weekly patterns. Pull search term reports for Google, placement reports for Meta and display. Export everything before forming opinions.\n\n## Establish CAC and ROAS Benchmarks\n\nCalculate blended CAC and ROAS at the channel level first, then drill to campaign. A healthy ROAS depends on margin — for a 60% gross-margin product, break-even ROAS is 1.67; anything below that is a cash drain. Flag every campaign running below break-even for more than 14 consecutive days. If a campaign is above target ROAS but spending less than 20% of its daily budget, it is under-delivering and needs bid or audience expansion.\n\n## Identify Waste Patterns\n\nLook for these five waste patterns in order: (1) branded keywords being bid on where organic rank is position 1 — cut unless incrementality testing proves value; (2) broad-match keywords with negative ROI in the search term report — add negatives immediately; (3) placement or audience segments with CTR below 0.3% on display or Meta — pause them; (4) ads running without a clear winner after 500 impressions each — kill the losers; (5) dayparting gaps where CPA spikes but budget does not throttle.\n\n## Score Scaling Opportunities\n\nA channel or campaign is scalable if: ROAS is at least 20% above break-even, impression share lost to budget is above 15%, and the audience has not been saturated (frequency below 3.5 on Meta, impression share below 70% on Google). Rank opportunities by expected incremental revenue at 2x current spend using the current ROAS as a proxy.\n\n## Produce a Ranked Action List\n\nDeliver findings as: (1) immediate cuts — negative ROI spend to pause today, (2) optimizations — bid, budget, or targeting changes in the next 7 days, (3) scaling bets — campaigns to increase budget on with expected outcome. Each item gets an estimated monthly impact in dollars. Skip items without a quantified impact — they are noise.\n\n## Reporting and Cadence\n\nRun a full audit quarterly. Run a lighter version monthly focused only on campaigns that changed significantly. Share findings with the team as a one-page brief with the top three actions. Do not bury the lead in methodology — the action list goes first.",
  },
  {
    slug: "ad-creative-testing",
    name: "Ad Creative Testing",
    category: "business",
    description: "Designs a disciplined ad creative testing system covering hooks, variables, and statistical rigor. Use when building a testing pipeline or diagnosing stale creative performance.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["creative","ab-testing","paid-ads","conversion","hooks"],
    install_count: 22100,
    rating_avg: 4.8,
    rating_count: 634,
    skill_content: "---\nname: Ad Creative Testing\ndescription: Designs a disciplined ad creative testing system with hooks, isolated variables, and statistical rigor. Use when setting up a testing pipeline or when creative performance is declining.\n---\n\n# Ad Creative Testing\n\nMost ad creative testing produces noise, not learning. Discipline means changing one variable at a time, running tests long enough, and acting only on statistically meaningful results.\n\n## Structure Tests Around a Single Variable\n\nEach test must isolate exactly one variable: hook (first 3 seconds of video or headline), visual format (static vs. video vs. carousel), offer framing (discount vs. free trial vs. guarantee), or call to action. Testing multiple variables at once makes the result uninterpretable. Label every creative with the variable it is testing and the hypothesis it is checking before launch.\n\n## Prioritize Hook Testing First\n\nThe hook is the highest-leverage variable in most paid channels. For video, the 3-second view rate and thumb-stop ratio reveal hook strength before the full watch occurs. For static and search, the headline carries the same weight. Run hook tests before any other variable — a great offer with a weak hook will never be seen. A hook passes if 3-second view rate exceeds 30% on Meta or thumb-stop exceeds 25%; a headline passes if CTR exceeds channel benchmark.\n\n## Set Sample Sizes Before Running\n\nDo not evaluate results until reaching the pre-set sample size. For conversion-rate tests, aim for at least 100 conversions per variant — fewer than that and the result is noise. For CTR or view-rate tests, 2,000 impressions per variant is the minimum. Use a significance calculator before declaring a winner; 95% confidence is the threshold. If budget prevents reaching significance in under 21 days, the test is not worth running as a controlled experiment — use directional data only and label it clearly.\n\n## Maintain a Creative Log\n\nKeep a running log of every test: hypothesis, variable tested, variants, launch date, sample size at close, result, and the decision made. The log is the asset. Pattern recognition across 20+ tests reveals which creative elements consistently move the needle for a specific audience. Without a log, teams repeat failed experiments and lose institutional knowledge.\n\n## Iteration Rhythm\n\nRun one to three simultaneous tests per channel. Close losing variants as soon as significance is reached. Roll the winner into evergreen rotation and immediately start the next test. Creative fatigue on Meta typically sets in at a frequency of 3-4 — launch new hooks before fatigue hits, not after performance drops. Budget 15-20% of channel spend toward testing at all times.\n\n## Common Mistakes to Avoid\n\nDo not let the algorithm decide the winner too early — platform auto-optimization will route spend to an early leader before significance. Do not test concepts you cannot scale if they win. Do not test minor color variations before testing message or offer — the highest-variance variables come first.",
  },
  {
    slug: "landing-page-cro",
    name: "Landing Page CRO",
    category: "business",
    description: "Improves landing page conversion using hypothesis-driven CRO. Use before scaling paid spend to a page, after a CVR drop, or during a structured growth sprint.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["cro","landing-page","conversion","ux","paid-ads"],
    install_count: 31500,
    rating_avg: 4.6,
    rating_count: 891,
    skill_content: "---\nname: Landing Page CRO\ndescription: Improves landing page conversion rates through hypothesis-driven CRO — audit, prioritize, test, and iterate. Use before scaling paid spend, after a CVR drop, or during a growth sprint.\n---\n\n# Landing Page CRO\n\nConversion rate optimization is not about applying best practices — it is about forming specific hypotheses, testing them against real users, and iterating based on evidence. Generic fixes rarely move the needle; specific ones do.\n\n## Audit Before Hypothesizing\n\nBefore writing a single hypothesis, collect: (1) quantitative data — heatmaps, scroll maps, click maps, session recordings, and funnel drop-off data; (2) qualitative data — user surveys, live chat transcripts, and sales call notes. The audit should answer: where are users leaving, what are they clicking that does not help them convert, and what objections appear repeatedly in their own words. Spend at least one hour in session recordings before forming opinions.\n\n## Build Hypotheses with Structure\n\nEvery hypothesis follows this format: 'Because [observation from audit], changing [element] to [proposed change] will [expected outcome] for [audience].' A hypothesis without an observation is a guess. A hypothesis without a measurable expected outcome cannot be evaluated. Write hypotheses before mockups — the thinking matters more than the execution.\n\n## Prioritize with ICE\n\nScore each hypothesis on Impact (how much will it move CVR if true), Confidence (how strong is the evidence), and Ease (how fast can it be built and tested). Multiply the three scores on a 1-10 scale. Run the top-scoring test first. Avoid running more than two tests simultaneously on the same page — it complicates interpretation.\n\n## The Five Highest-Leverage Elements\n\nIn order of typical impact: (1) headline — must match the ad's promise and speak to a specific pain; (2) primary CTA — text, position, and contrast matter; (3) social proof — specificity beats volume, a named customer quote outperforms a star rating; (4) above-the-fold visual — must show the outcome, not the product; (5) form or checkout friction — every unnecessary field reduces conversion. Fix these before testing background colors or font sizes.\n\n## Statistical Standards\n\nDo not call a winner until reaching 95% statistical significance with at least 100 conversions per variant. For low-traffic pages, use Bayesian testing and set a 90% probability-to-beat threshold. Never end a test early because one variant looks better — regression to the mean is real. Document every test outcome, including losses — a failed hypothesis is still a learning.\n\n## Message Match\n\nThe single most common CRO failure is message mismatch: the ad makes a specific promise and the landing page delivers a generic brand statement. Every paid traffic source should land on a page where the headline directly echoes the ad's offer. If one page serves multiple campaigns, use dynamic text replacement or build dedicated landing pages per major campaign theme.",
  },
  {
    slug: "marketing-attribution",
    name: "Marketing Attribution",
    category: "data",
    description: "Helps choose and apply a marketing attribution model honestly, and avoid common measurement traps. Use when evaluating channel ROI, setting up tracking, or auditing attribution logic.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["attribution","measurement","analytics","paid-ads","data"],
    install_count: 14700,
    rating_avg: 4.9,
    rating_count: 317,
    skill_content: "---\nname: Marketing Attribution\ndescription: Guides selection and honest application of a marketing attribution model, surfacing common measurement traps. Use when evaluating channel ROI, auditing tracking, or choosing between attribution models.\n---\n\n# Marketing Attribution\n\nAttribution does not reveal truth — it reveals a model's assumptions about truth. Choosing a model is choosing a set of tradeoffs. The goal is to pick the model that creates the least-distorted decisions for the business, not the one that flatters the most channels.\n\n## Understand What Each Model Assumes\n\nFirst-touch attribution credits the first interaction entirely — useful for understanding discovery channels, but it ignores everything that closed the sale. Last-touch does the opposite and over-credits closers like brand search. Linear attribution spreads credit evenly — neutral but often meaningless. Time-decay weights recent touches more heavily — reasonable for short sales cycles. Data-driven attribution uses conversion path modeling — best in theory but requires high conversion volume (typically 1,000+ monthly conversions) and complete tracking. Position-based (U-shaped) splits 40/20/40 between first touch, middle, and last touch — a practical default for teams that lack volume for data-driven models.\n\n## Choose Based on Sales Cycle and Data Volume\n\nFor sales cycles under 7 days with fewer than 500 monthly conversions: use last-touch with branded/direct excluded. For cycles 7-30 days: use position-based. For cycles over 30 days or complex B2B: use time-decay or a CRM-based opportunity model. For teams with 1,000+ conversions and clean tracking: test data-driven and compare decisions it produces versus current model. Never use first-touch as a primary model for budget allocation — it systematically over-invests in awareness and starves conversion channels.\n\n## Avoid the Three Most Common Traps\n\nTrap 1 — View-through inflation: Meta and display platforms count view-through conversions by default, crediting an impression even when the user converted organically. Set view-through window to 1 day maximum or disable it, and compare platform-reported conversions to actual revenue. Trap 2 — Cross-device gaps: a user who sees an ad on mobile and converts on desktop appears as two separate paths. Use a unified identity layer or accept that mobile spend will be systematically undercredited. Trap 3 — Sampling and consent loss: iOS 14+ and cookie deprecation mean 20-40% of conversions may be untracked. Use aggregated event measurement, first-party data enrichment, and model-based estimation — do not treat reported numbers as complete.\n\n## Triangulate, Do Not Depend on One Signal\n\nNo single attribution model is sufficient. Use platform-reported data alongside three additional signals: (1) geo holdout tests — pause a channel in a test market and measure revenue impact; (2) incrementality tests — meta-analysis tools or platform lift studies; (3) MTA modeled data from a third-party tool. When all three signals agree, act with confidence. When they conflict, investigate before making budget decisions.\n\n## Document and Communicate the Model\n\nEvery stakeholder who sees attribution data must understand which model produced it and what it does not capture. Include a one-sentence model disclaimer on every attribution report. Change models infrequently — switching mid-year makes year-over-year comparisons meaningless. When a model change is necessary, run both models in parallel for at least one quarter before switching fully.",
  },
  {
    slug: "budget-pacing",
    name: "Budget Pacing",
    category: "business",
    description: "Paces and reallocates ad budget across channels to consistently hit CAC and volume targets. Use during active campaign management, at month-end, or when spend and performance are misaligned.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["budget","pacing","paid-ads","cac","media-planning"],
    install_count: 9800,
    rating_avg: 4.5,
    rating_count: 198,
    skill_content: "---\nname: Budget Pacing\ndescription: Paces and reallocates ad budget across channels to hit CAC and volume targets. Use during active campaign management, at the start or end of a month, or when spend and performance are misaligned.\n---\n\n# Budget Pacing\n\nBudget pacing is the practice of spending the right amount at the right time to meet both volume and efficiency targets. Overspending early depletes budget before high-value conversion windows; underspending wastes the month. Neither extreme is acceptable.\n\n## Set Pacing Targets Before the Month Begins\n\nDivide total monthly budget by calendar days to get a daily target. Adjust for known seasonality — if Tuesdays through Thursdays convert 20% better historically, weight those days higher. Set a daily tolerance band of plus or minus 15%. If spend is consistently outside that band, adjust bids or campaign budgets within 48 hours. Never wait until day 25 to react to a pacing problem.\n\n## Monitor Spend-to-Conversion Ratio Daily\n\nPacing spend without tracking conversions is half the job. Check spend vs. target and CAC vs. target every morning. If CAC is tracking above target with spend on pace, slow the spend rather than waiting for the month to average out. If CAC is below target and volume is below target, this is the green light to accelerate — push budget into the channels and campaigns demonstrating efficiency.\n\n## Reallocate Across Channels, Not Just Within Them\n\nKeep a reallocation reserve of 10-15% of monthly budget unallocated at the start of the month. This reserve funds mid-month shifts when one channel outperforms. Do not pre-commit all budget to channels at the start of the month. Reallocation decisions should be made at the channel level weekly and at the campaign level daily. The channel with the best trailing 7-day CAC and available impression volume gets the next dollar.\n\n## Handle End-of-Month Pressure Correctly\n\nDo not increase bids or relax targeting to spend remaining budget in the final week. Underspending slightly is better than inflating CAC to zero out the budget line. If there is unspent budget in the final 5 days, move it into campaigns that are already performing — not into experiments or cold audiences. Document why budget was unspent for the next planning cycle.\n\n## Build a Pacing Dashboard\n\nA functional pacing dashboard shows: daily spend vs. daily target, cumulative spend vs. cumulative target, trailing 7-day CAC by channel, and projected month-end spend at current pace. Update it automatically from the ad platform API if possible. Review it each weekday morning; review it with stakeholders weekly. The dashboard should surface exceptions, not require hunting for them.\n\n## Escalation Thresholds\n\nEscalate to stakeholders when: projected month-end spend will miss target by more than 10% in either direction; CAC is trending more than 20% above target for 5 consecutive days; a single channel represents more than 60% of total spend without approval. These thresholds are starting points — calibrate them to the business's risk tolerance.",
  },
  {
    slug: "audience-targeting",
    name: "Audience Targeting",
    category: "business",
    description: "Builds and refines audience and segment targeting for paid campaigns. Use when launching new campaigns, diagnosing poor reach quality, or scaling into new customer segments.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["audience","targeting","segmentation","paid-ads","growth"],
    install_count: 27300,
    rating_avg: 4.7,
    rating_count: 743,
    skill_content: "---\nname: Audience Targeting\ndescription: Builds and refines audience and segment targeting for paid campaigns. Use when launching campaigns, diagnosing poor reach quality, or expanding into new customer segments.\n---\n\n# Audience Targeting\n\nAudience targeting determines who sees the ad. A perfect ad shown to the wrong audience converts poorly. Targeting work begins before creative work and should be revisited monthly as audiences saturate.\n\n## Start With First-Party Audiences\n\nFirst-party audiences outperform interest and demographic targeting consistently. Build the following audiences first: (1) customer list — upload CRM data matched to platform users; (2) high-value customer segment — filter the customer list to top 20% by LTV; (3) website visitors by page — separate product viewers from checkout abandoners; (4) email engagers — opened or clicked in last 90 days. These audiences are owned, not rented, and improve as the business grows. Do not launch interest-based targeting until first-party audiences are fully built.\n\n## Use Lookalikes as Expansion Vehicles\n\nLookalike audiences should be seeded from the highest-quality first-party signal available — typically the top LTV customer segment, not the full customer list. On Meta, start with 1-2% lookalikes for precision; expand to 3-5% only after proving CAC at the tighter level. On Google, customer match and similar segments serve the same function. Lookalike quality degrades at large sizes — monitor CAC as audience percentage increases.\n\n## Layer, Do Not Stack\n\nLayering narrows an audience by requiring multiple criteria (interest AND behavior AND demographic). Stacking broadens it by adding more targeting options within a category. Layering improves precision but reduces volume; stacking does the opposite. For prospecting campaigns with volume goals, avoid over-layering — let the platform's algorithm optimize within a broad-but-relevant audience. For retargeting, layer aggressively to reach users with the strongest intent signals.\n\n## Define Audience Exclusions\n\nExclusions are as important as inclusions. Always exclude: current customers from acquisition campaigns; recent converters from retargeting for a post-purchase window; low-quality segments identified in prior campaigns. Failing to exclude current customers from acquisition campaigns wastes budget and inflates reported conversion rates with organic purchases.\n\n## Monitor Saturation\n\nAudience saturation shows up as rising frequency on Meta (above 3.5 in a 7-day window), declining CTR over time at stable bids, and rising CPMs with flat or falling conversion rates. When these signals appear together, the audience is exhausted. Remedies in order: refresh creative first, then expand the audience, then find a new segment. Do not raise bids into a saturated audience — it accelerates spend without improving results.\n\n## Segment Testing Framework\n\nWhen entering a new market or testing a new product angle, run separate ad sets per audience segment rather than combining them. This isolates which segment responds to which message. Run for at least 7 days and 1,000 impressions per segment before drawing conclusions. Winning segments get consolidated budget; losing segments get paused and documented. Keep a segment log the same way creative teams keep a creative log.",
  },
  // ── personal-finance-mastery ──
  {
    slug: "budget-builder",
    name: "Budget Builder",
    category: "personal",
    description: "Builds a zero-based monthly budget from scratch. Use when starting a new budget, after an income change, or when spending feels out of control. <=200 chars",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["budgeting","money","personal-finance","spending","cashflow"],
    install_count: 47200,
    rating_avg: 4.8,
    rating_count: 2341,
    skill_content: "---\nname: Budget Builder\ndescription: Guides users through building a zero-based monthly budget. Use when starting fresh, after an income change, or when spending feels uncontrolled.\n---\n\n# Budget Builder\n\nA budget is not a restriction on spending — it is a spending plan made in advance. This skill walks through constructing one that holds up in real life.\n\n## Start With Take-Home Income\n\nUse net income only — the dollars that actually land in the bank. Include all regular sources: salary, side income, rental income. If income varies month to month, use the average of the last three months as the baseline, then adjust upward only when a higher month is confirmed.\n\n## The 50/30/20 Starting Framework\n\nAllocate net income across three buckets as a starting point:\n- 50% to needs: rent or mortgage, utilities, groceries, minimum debt payments, insurance, transportation to work.\n- 30% to wants: dining out, subscriptions, hobbies, entertainment.\n- 20% to savings and extra debt payoff: emergency fund, retirement contributions, accelerated debt payments.\n\nThese are starting ratios, not rules. High cost-of-living areas often require 60% or more for needs, which means compressing wants first, then savings temporarily until income grows.\n\n## Zero-Based Balancing\n\nAfter categorizing, subtract every planned expense from take-home income until the result is zero. Every dollar gets a job. If there is money left over, assign it explicitly — savings, a sinking fund, or extra debt payoff. If spending exceeds income, cut from wants before needs, and from discretionary subscriptions before lifestyle expenses.\n\n## Sinking Funds for Irregular Expenses\n\nAnnual and irregular costs destroy budgets when they arrive unplanned. Divide each predictable irregular expense by 12 and save that amount monthly. Common sinking funds: car registration, home repairs, holiday gifts, annual insurance premiums, vet bills. Treat each sinking fund as a fixed line item.\n\n## Review Cadence\n\nReview the budget at the end of each month before the next one starts. Compare actual spending to planned spending by category. A budget that is never reviewed is just a wish list. Adjust categories that are consistently off — reality is the input, the budget is the output.\n\n## When to Consult a Professional\n\nFor complex situations — self-employment income, significant irregular income, major life transitions, or high debt loads — a certified financial planner or credit counselor can provide personalized guidance that a general framework cannot.",
  },
  {
    slug: "debt-payoff-planner",
    name: "Debt Payoff Planner",
    category: "personal",
    description: "Plans an aggressive debt payoff strategy using avalanche or snowball methods. Use when carrying multiple debts and wanting a clear, ordered repayment sequence.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["debt","personal-finance","money","payoff","interest"],
    install_count: 38400,
    rating_avg: 4.7,
    rating_count: 1876,
    skill_content: "---\nname: Debt Payoff Planner\ndescription: Plans a structured, aggressive debt payoff sequence using avalanche or snowball methods. Use when managing multiple debts and needing a clear prioritized repayment order.\n---\n\n# Debt Payoff Planner\n\nCarrying multiple debts without a sequenced payoff plan means paying more interest than necessary and losing momentum. This skill produces a concrete, ordered repayment plan.\n\n## Inventory All Debts First\n\nList every debt with four fields: creditor name, current balance, interest rate (APR), and minimum monthly payment. Include everything: credit cards, personal loans, medical debt, student loans, car loans. Do not include the mortgage in the active payoff list — it is managed separately.\n\n## Choose a Payoff Method\n\nTwo proven methods exist:\n\nAvalanche (mathematically optimal): Order debts from highest APR to lowest. Pay minimums on everything, then throw every extra dollar at the highest-rate debt. This minimizes total interest paid over time.\n\nSnowball (behaviorally effective): Order debts from lowest balance to highest. Pay minimums on everything, then throw every extra dollar at the smallest balance. Wins come faster, which sustains motivation. Research shows snowball users pay off debt more consistently than avalanche users.\n\nDefault recommendation: use avalanche if the difference in balances is small or the highest-rate debt is also manageable in size. Use snowball if motivation is a real concern or the smallest debts can be cleared in under three months.\n\n## Calculate the Monthly Extra Payment\n\nFind the gap between minimum payments and the total amount that can be dedicated to debt repayment. That gap is the extra payment. Even an extra 50 dollars per month shortens a debt payoff timeline significantly. Quantify the gap before committing to a method.\n\n## Build the Payoff Sequence\n\nList debts in chosen order. Mark the first target. When that debt is cleared, add its full payment (minimum plus extra) to the next debt in the list — this is the snowball or avalanche roll. The total monthly payment stays the same; the intensity on each remaining debt increases.\n\n## Do Not Pause for Emergencies Indefinitely\n\nIf an unexpected expense forces a pause on the extra payment, resume the plan as soon as possible. A one-month pause does not ruin the strategy. Carrying an emergency fund of at least one month of expenses prevents most interruptions.\n\n## When to Consult a Professional\n\nFor debts in collections, garnishments, or situations where total debt exceeds annual income, consult a nonprofit credit counselor or bankruptcy attorney before committing to a DIY payoff plan. Debt consolidation and negotiated settlements are options that require professional evaluation.",
  },
  {
    slug: "tax-optimization",
    name: "Tax Optimization",
    category: "personal",
    description: "Identifies legal strategies to reduce taxable income and maximize tax-advantaged accounts. Use during year-end planning or when reviewing withholding and deductions.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["taxes","personal-finance","deductions","retirement","money"],
    install_count: 22700,
    rating_avg: 4.6,
    rating_count: 1124,
    skill_content: "---\nname: Tax Optimization\ndescription: Identifies legal strategies to reduce taxable income and maximize tax-advantaged accounts. Use during year-end planning or when reviewing withholding and contribution strategies.\n---\n\n# Tax Optimization\n\nTax optimization is not about aggressive schemes — it is about using every legal mechanism already built into the tax code. Most people leave significant money on the table by not maximizing the accounts and deductions available to them.\n\n## Max Out Tax-Advantaged Accounts First\n\nBefore looking at any other strategy, confirm that tax-advantaged contribution limits are being used fully. For employer-sponsored retirement plans, contribute at least enough to capture the full employer match — that match is an immediate 50-100% return. Then maximize the account if cash flow allows. For health insurance eligible individuals, a health savings account is triple tax-advantaged and rolls over indefinitely.\n\n## Understand the Standard Deduction vs. Itemizing\n\nMost filers are better off taking the standard deduction, which has been significantly increased. Itemizing only makes sense when the sum of deductible expenses — mortgage interest, state and local taxes up to the cap, charitable contributions, and qualified medical expenses — exceeds the standard deduction. Run the comparison with real numbers before assuming itemizing is better.\n\n## Tax-Loss Harvesting in Taxable Accounts\n\nIn a taxable brokerage account, selling investments that have lost value realizes a loss that offsets capital gains dollar for dollar. Losses beyond gains can offset ordinary income up to a threshold per year, with the remainder carrying forward. The wash-sale rule prohibits buying the same or a substantially identical security within 30 days before or after the sale — buy a similar but not identical fund to maintain market exposure.\n\n## Timing Income and Deductions\n\nFor those with some control over income timing — freelancers, business owners, or those with year-end bonuses — deferring income to the next tax year or accelerating deductions into the current year can shift a bracket. This is most useful near the boundary between two tax brackets.\n\n## Roth vs. Traditional Contribution Strategy\n\nThe default rule: contribute to a traditional pre-tax account when in a high bracket now and expect a lower bracket in retirement. Contribute to a Roth when in a low bracket now and expect taxes to be higher later — or when future tax rates are uncertain. A Roth conversion in a low-income year (early retirement, career gap) is often the most efficient window.\n\n## When to Consult a Professional\n\nTax optimization is highly dependent on individual circumstances — filing status, state of residence, income type, and life events. A CPA or enrolled agent is the appropriate resource for any complex situation, especially for self-employment, stock compensation, rental income, or major life events like marriage or inheritance.",
  },
  {
    slug: "retirement-projection",
    name: "Retirement Projection",
    category: "personal",
    description: "Projects retirement readiness by calculating savings rate, target nest egg, and time to FI. Use when evaluating whether current savings trajectory leads to a viable retirement.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["retirement","investing","personal-finance","fire","savings"],
    install_count: 31500,
    rating_avg: 4.9,
    rating_count: 2187,
    skill_content: "---\nname: Retirement Projection\ndescription: Projects retirement readiness using savings rate, target nest egg size, and time-to-FI calculations. Use when evaluating whether a current savings trajectory leads to a viable retirement.\n---\n\n# Retirement Projection\n\nRetirement planning is not about picking a magic number — it is about understanding the relationship between savings rate, time, and withdrawal needs. Small differences in savings rate now create enormous differences in outcomes later.\n\n## Calculate the Target Nest Egg\n\nThe most widely used rule of thumb is the 4% rule: a portfolio can sustain annual withdrawals equal to 4% of its starting value for at least 30 years with a high probability of success, based on historical market data. To find the target nest egg, divide expected annual retirement spending by 0.04. Example: 60,000 dollars per year in retirement spending requires a 1,500,000 dollar portfolio. For longer retirements — 35 to 40 years — a 3.5% or 3% withdrawal rate is more conservative.\n\n## Estimate Annual Retirement Spending\n\nA common starting estimate is 70-80% of current pre-retirement income. This accounts for lower work-related costs, reduced savings contributions, and lifestyle changes. Adjust upward for planned travel or healthcare costs, and downward for paid-off housing. Do not forget healthcare costs before Medicare eligibility — they are often underestimated significantly.\n\n## The Savings Rate Is the Lever That Matters Most\n\nSavings rate — annual savings divided by gross income — determines both how fast the portfolio grows and how small the retirement spending gap is. A higher savings rate also means less income to replace in retirement. Saving 10% of income takes roughly 40 years to reach financial independence at standard return assumptions. Saving 25% takes roughly 32 years. Saving 50% takes roughly 17 years.\n\n## Social Security and Pension Offsets\n\nSocial Security reduces the portfolio size needed. Estimate Social Security income using the official government estimation tool and subtract that annual amount from the retirement spending target before applying the 4% rule. Delaying claiming from 62 to 70 increases the monthly benefit by approximately 76%, making delay valuable for those who can afford it.\n\n## When to Consult a Professional\n\nRetirement projections involve assumptions about investment returns, inflation, longevity, and tax rates that are inherently uncertain. A fee-only fiduciary financial planner can run Monte Carlo simulations and account for individual tax situations in ways that general rules of thumb cannot.",
  },
  {
    slug: "emergency-fund-planner",
    name: "Emergency Fund Planner",
    category: "personal",
    description: "Sizes and builds an emergency fund based on income stability, fixed expenses, and household risk. Use when starting a fund, after a major expense, or when reviewing financial safety net adequacy.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["emergency-fund","savings","personal-finance","money","risk"],
    install_count: 29800,
    rating_avg: 4.7,
    rating_count: 1543,
    skill_content: "---\nname: Emergency Fund Planner\ndescription: Sizes and builds an emergency fund based on income stability, fixed expenses, and household risk profile. Use when starting a fund or reviewing financial safety net adequacy.\n---\n\n# Emergency Fund Planner\n\nAn emergency fund is not a savings account — it is insurance against being forced into high-interest debt during a crisis. The right size and the right account matter as much as having one at all.\n\n## Determine the Right Size\n\nThe standard recommendation is 3-6 months of essential expenses. Essential expenses are the costs that cannot be paused: rent or mortgage, utilities, groceries, minimum debt payments, insurance premiums, and transportation. Calculate this number by tallying only those categories, not total spending.\n\nAdjust the target based on risk profile:\n- Stable two-income household: 3 months is sufficient.\n- Single income, stable employment: 4-5 months.\n- Single income, variable or freelance income: 6 months minimum.\n- Single income, specialized field with long job search timelines, or health risks: 6-9 months.\n\n## Where to Keep It\n\nThe emergency fund must be liquid and safe — it cannot be in the stock market or locked in a CD. A high-yield savings account at a federally insured institution is the default vehicle. The yield should beat or match inflation on short timeframes. Do not keep the emergency fund in a checking account — accessibility without friction leads to quiet erosion from non-emergencies.\n\n## Build It Before Aggressively Paying Debt\n\nThe ordering debate is legitimate, but the practical recommendation is this: build a starter emergency fund of one month of expenses before aggressively paying down debt. Then pay down high-interest debt (above 7-8% APR) while maintaining the starter fund. Return to fully funding the emergency fund after high-interest debt is cleared.\n\n## What Qualifies as an Emergency\n\nAn emergency is an unplanned, necessary expense: job loss, medical event, major car repair, emergency home repair. It is not a vacation, a sale, or a predictable irregular expense. Predictable irregular costs — car registration, holiday gifts, annual subscriptions — should be handled by sinking funds, not the emergency fund.\n\n## Replenishment Protocol\n\nAfter using the emergency fund, replenish it as the next financial priority above all discretionary savings. Treat replenishment as a debt owed to future stability. Set an automatic transfer to the fund equal to the fastest sustainable replenishment rate.\n\n## When to Consult a Professional\n\nFor households with very high fixed expenses, significant health risks, or income that varies widely month to month, a financial planner can help model appropriate fund size and placement within an overall financial plan.",
  },
  {
    slug: "big-purchase-decision",
    name: "Big Purchase Decision",
    category: "personal",
    description: "Evaluates whether a major purchase is financially sound using total cost of ownership, opportunity cost, and timing criteria. Use before buying a car, appliance, or any purchase over 1000 dollars.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["spending","decision-making","personal-finance","money","budgeting"],
    install_count: 18600,
    rating_avg: 4.5,
    rating_count: 892,
    skill_content: "---\nname: Big Purchase Decision\ndescription: Evaluates whether a major purchase is financially sound using total cost of ownership, opportunity cost, and timing criteria. Use before any significant discretionary purchase.\n---\n\n# Big Purchase Decision\n\nBig purchases feel like one-time decisions but are almost always multi-year financial commitments. This skill applies a structured evaluation before committing, because the time to analyze a purchase is before signing, not after.\n\n## Define What Counts as a Big Purchase\n\nAny single purchase above 1% of annual take-home income warrants this analysis. For most households, that threshold falls somewhere between 500 and 1,500 dollars. Apply the full framework to anything above that line.\n\n## Calculate Total Cost of Ownership\n\nThe purchase price is rarely the real cost. Total cost of ownership adds: financing interest, ongoing maintenance and repairs, insurance changes, fuel or consumable costs, and registration or subscription fees. Divide total cost by estimated useful life to get annual cost. For a vehicle, this transforms a 25,000 dollar sticker price into a true annual cost that is often 8,000 to 12,000 dollars per year.\n\n## Apply the Opportunity Cost Test\n\nEvery dollar spent is a dollar not invested. At a 7% average annual real return, 10,000 dollars invested today is worth approximately 19,700 dollars in 10 years and 38,700 dollars in 20 years. This is not a reason to never spend — it is a reason to be intentional about which purchases are worth the trade-off.\n\n## The 30-Day Rule for Non-Urgent Purchases\n\nFor any non-emergency purchase above the personal threshold, wait 30 days before buying. Most impulse-driven desires fade significantly within that window. If the desire is still strong at 30 days and the purchase passes the financial tests, it is more likely to be a genuine need or a considered want.\n\n## Evaluate the Financing Carefully\n\nCash is always preferable for discretionary purchases. If financing is unavoidable, the APR is the critical number — not the monthly payment. A lower monthly payment achieved by extending the loan term often means paying significantly more in total.\n\n## Timing and Negotiation\n\nFor large purchases where timing is flexible, there are consistently better times to buy: end of month, holiday weekends for appliances and vehicles, and end of model-year cycles. Researching fair-market value before negotiating is the single most effective way to avoid overpaying.\n\n## When to Consult a Professional\n\nFor purchases involving real estate, business equipment, or complex financing, a financial advisor or accountant can model the full financial impact including tax implications not visible in a simple cost calculation.",
  },

  // ════════ Phase 4 expansion: design & skill-authoring packs ════════
  // ── brand-visual-identity ──
  {
    slug: "logo-brief-writer",
    name: "Logo Brief Writer",
    category: "design",
    description: "Writes a sharp, complete creative brief for a logo or brand identity project. Use when briefing a designer, starting a logo project, or aligning stakeholders on direction before design begins.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["branding","logo","brief","identity","strategy"],
    install_count: 18400,
    rating_avg: 4.7,
    rating_count: 412,
    skill_content: "---\nname: Logo Brief Writer\ndescription: Writes a sharp creative brief for a logo/identity project. Use when briefing a designer, aligning stakeholders, or starting a brand identity engagement.\n---\n\n# Logo Brief Writer\n\nA strong creative brief is the contract between strategy and design. This skill produces a focused, opinionated brief that gives a designer everything they need and nothing they don't.\n\n## Extract the Core Business Context\n\nBefore writing a word of brief, surface: what the brand does, who its primary customer is, what problem it solves, and what makes it distinct from the nearest competitor. If the client hasn't answered these, ask. A brief written on vague inputs produces vague logos. State the brand's stage (new, rebrand, refresh) and the reason for the project — this changes everything about the creative direction.\n\n## Define the Brand Personality in Threes\n\nChoose exactly three adjectives that describe how the brand should feel. Then choose three it must never feel. This axis (what it is / what it isn't) is the single most useful constraint for a logo designer. Avoid generic words like 'professional' or 'innovative' — push for specific, evocative language: 'irreverent but precise', 'warm and structural', 'technical without coldness'.\n\n## Specify Deliverables and Constraints\n\nList every required deliverable: primary mark, wordmark, icon/symbol, lockup variations, color versions (full color, single color, reversed). State minimum size requirements, primary surfaces (app icon, signage, business card, favicon), and any hard constraints such as color restrictions, existing assets to retain, or trademark concerns. Ambiguity here creates scope creep.\n\n## Audience and Competitive Positioning\n\nDescribe the target audience in behavioral terms, not demographics alone. Include a short competitive audit: name three to five direct competitors and note what visual territory they occupy. The brief should make clear what visual space is already claimed and where there is room to differentiate.\n\n## Timeline, Budget, and Rounds\n\nState the number of initial concepts expected, the number of revision rounds included, and the final delivery date. Note file format requirements (vector source files, PNG exports, brand guidelines). If a brand guideline document is out of scope, say so explicitly — misaligned expectations here are the most common cause of project disputes.\n\n## Success Criteria\n\nEnd the brief with one paragraph on what success looks like: 'The logo should feel at home on a Series A pitch deck and on a hoodie. A customer seeing it for the first time should sense precision and warmth without being told anything about the company.' Concrete success criteria give the designer a target and give stakeholders a framework for feedback that isn't purely subjective.",
  },
  {
    slug: "color-palette-builder",
    name: "Color Palette Builder",
    category: "design",
    description: "Builds an accessible, purposeful brand color palette with usage rules. Use when defining or auditing a brand's color system, ensuring WCAG compliance, or documenting color tokens for a design system.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["color","branding","accessibility","design-system","wcag"],
    install_count: 31200,
    rating_avg: 4.8,
    rating_count: 891,
    skill_content: "---\nname: Color Palette Builder\ndescription: Builds an accessible, purposeful brand color palette with usage rules and WCAG compliance notes. Use when defining brand colors or building a design system color layer.\n---\n\n# Color Palette Builder\n\nA brand color palette is not a mood board — it is a functional system with rules. This skill builds palettes that are purposeful, accessible, and documented well enough for a developer to implement without guessing.\n\n## Start with One Anchor Color\n\nEvery strong palette begins with a single well-chosen anchor: the primary brand color. Choose it for its strategic meaning and its flexibility — it must work on white, work on dark surfaces, and survive single-color reproduction. Derive the full palette from this anchor rather than assembling unrelated colors. This keeps the system coherent.\n\n## Structure the Palette in Roles, Not Names\n\nAssign every color a role before a name. Roles: Primary (main brand actions, links, focus), Secondary (supporting accents, hover states), Neutral (text, borders, backgrounds), Semantic (success green, warning amber, error red, info blue). Neutrals are the most underestimated — a well-stepped gray scale (50 through 900) does more work than any accent color.\n\n## Build Tonal Scales, Not Single Swatches\n\nFor Primary and Secondary colors, generate a 9-step tonal scale from near-white to near-black (100 through 900). Use the 500 value as the anchor. This gives component designers flexibility without needing to invent one-off shades. Tools like Radix Colors, Tailwind's palette generator, or manual HSL stepping all produce consistent results.\n\n## Check Contrast at Every Step\n\nApply WCAG 2.1 AA minimums as non-negotiable: 4.5:1 for normal text, 3:1 for large text and UI components. Test Primary 600 and above against white backgrounds; test Primary 200 and below against dark text. Document the passing pairs explicitly — do not leave developers to guess which combinations are accessible. Aim for AAA (7:1) on body text wherever possible.\n\n## Document Usage Rules\n\nFor each color role, state what it is for and what it is not for. Example: 'Primary 500 — use for interactive elements, primary buttons, and focus rings. Do not use as a background behind body text.' Without usage rules, a palette becomes decoration and designers make inconsistent decisions. Usage rules are the difference between a palette and a system.\n\n## Semantic and Dark Mode Consideration\n\nIf the product has a dark mode, define semantic tokens ('color-background-default', 'color-text-primary') that map to different palette values per mode. Semantic tokens decouple component code from raw color values and make theming maintainable. Even if dark mode is not in scope now, architecting for tokens adds no cost and saves significant rework later.",
  },
  {
    slug: "typography-system",
    name: "Typography System",
    category: "design",
    description: "Chooses and pairs typefaces and defines a complete type scale for a brand. Use when establishing a brand's typographic voice, building a design system type layer, or auditing inconsistent type usage.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["typography","branding","type-scale","design-system","fonts"],
    install_count: 24700,
    rating_avg: 4.6,
    rating_count: 534,
    skill_content: "---\nname: Typography System\ndescription: Chooses and pairs typefaces and defines a type scale for a brand. Use when establishing typographic voice, building a design system type layer, or auditing inconsistent type usage.\n---\n\n# Typography System\n\nTypography carries more of a brand's personality than any other design element because it is always present. A well-designed type system is invisible when it works and painful when it doesn't.\n\n## Choose Roles Before Choosing Fonts\n\nDefine roles first: Display (hero headlines, campaign type), Heading (page titles, section headers), Body (long-form reading), UI (labels, captions, buttons), Mono (code, data). A brand typically needs two typefaces at most — one for Display/Heading, one for Body/UI. Adding a third is a tax on every future designer. A strong pairing is usually one serif and one sans-serif, or a distinctive display face with a neutral workhorse for body.\n\n## Evaluate Typefaces on Functional Criteria\n\nBeyond personality, a typeface must pass functional tests: sufficient weight range (at least Regular, Medium, Bold, and their italics), legibility at small sizes, language/glyph coverage for target markets, web and app licensing, and acceptable file size for web delivery. Variable fonts are preferred for web use — they reduce HTTP requests and allow fine-grained weight control.\n\n## Build a Modular Type Scale\n\nUse a modular scale based on a ratio. Common ratios: 1.25 (Major Third) for tight UI-heavy products, 1.333 (Perfect Fourth) for editorial products, 1.5 (Perfect Fifth) for display-heavy layouts. Start from a base of 16px (1rem). Name steps by role, not pixel size: 'body-sm', 'body-base', 'heading-md', 'display-lg'. Pixel sizes will change; role names stay stable.\n\n## Specify Line Height and Measure\n\nFor every text style, define line height and maximum measure (line length). Body text: line height 1.5 to 1.6, measure 60 to 75 characters. Headings: line height 1.1 to 1.3. UI labels: line height 1.2 to 1.4. These are not aesthetic choices — they are readability standards backed by decades of research. Measure is the most commonly neglected spec; lines that are too long destroy reading comprehension.\n\n## Document Do/Don't Pairs\n\nFor each type role, write one sentence on what it is for and one on what it is not for. Then document at least three anti-patterns to avoid: all-caps body text, centered body paragraphs, justified text without hyphenation, mixing more than two weights in a single component. Anti-patterns turn abstract rules into concrete guidance.\n\n## Specify Responsive Behavior\n\nDefine how the scale shifts across breakpoints. Display sizes often drop significantly on mobile (a 72px desktop hero might become 40px on mobile). Document the mobile value for every heading and display step. For body and UI, one scale typically works across breakpoints with minor adjustments.",
  },
  {
    slug: "moodboard-builder",
    name: "Moodboard Builder",
    category: "design",
    description: "Assembles a focused moodboard and art direction brief that communicates a brand feel. Use when establishing visual tone, aligning creative teams, or presenting direction to clients before visual design begins.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["moodboard","art-direction","branding","visual-tone","creative-brief"],
    install_count: 14900,
    rating_avg: 4.5,
    rating_count: 283,
    skill_content: "---\nname: Moodboard Builder\ndescription: Assembles a focused moodboard and art direction brief that communicates a brand feel. Use when aligning creative teams, presenting direction to clients, or setting visual tone before design begins.\n---\n\n# Moodboard Builder\n\nA moodboard is not a Pinterest dump — it is a curated argument for a specific visual direction. Its job is to create alignment before pixels are pushed, not to impress with quantity.\n\n## Define the Emotional Target First\n\nBefore sourcing a single image, write two or three sentences on how the brand should make someone feel when they encounter it. Not what the brand does — how it feels. 'Confident without arrogance. Warm like a trusted expert, not warm like a lifestyle brand. Technical precision expressed through simplicity.' This emotional brief is the filter every image must pass through.\n\n## Curate Ruthlessly: Fewer, Stronger Images\n\nA moodboard should contain 8 to 16 images, never more. Each image must earn its place by contributing something the others do not: a color mood, a texture, a compositional principle, a lighting style, a typographic reference, a photography approach. Remove anything that is merely nice-looking. The board should feel like a single coherent point of view, not a collection of pretty things.\n\n## Organize by Visual Dimension\n\nStructure the board to communicate across visual dimensions: Color and tone (what hues and value ranges dominate), Texture and material feel (smooth/rough, digital/analog, flat/tactile), Light and shadow (harsh/soft, high-contrast/diffuse), Composition and space (dense/airy, centered/dynamic, symmetrical/asymmetrical), Human presence (if people appear: who are they, how are they portrayed). A viewer should be able to read each dimension from the board without explanation.\n\n## Write an Art Direction Statement\n\nThe moodboard must be accompanied by a written art direction statement of 150 to 300 words. This statement names the references and explains why they were chosen. It translates visual choices into verbal principles that a photographer, illustrator, or motion designer can follow without seeing the board. It also gives stakeholders language to evaluate work against: 'does this feel more like Reference A or Reference B?'\n\n## Distinguish Inspiration from Execution\n\nMake clear which references are directional inspiration and which are execution references. A fashion editorial might set the mood but the actual photography will be product-led. A vintage poster might establish texture but the brand will use a modern grid. Conflating inspiration and execution causes clients to expect the literal references rather than the principles they embody.\n\n## Anticipate the Anti-Board\n\nConsider providing a brief 'anti-moodboard' of 3 to 4 images that show directions to avoid. 'Not this' is sometimes clearer than 'this.' It protects against the common client instinct to request elements from the wrong category once design begins.",
  },
  {
    slug: "visual-hierarchy",
    name: "Visual Hierarchy",
    category: "design",
    description: "Applies visual hierarchy principles to lay out any composition. Use when designing or critiquing a page, screen, poster, or document where the reading order or emphasis feels unclear or unintentional.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["layout","hierarchy","composition","design-principles","typography"],
    install_count: 42100,
    rating_avg: 4.9,
    rating_count: 1847,
    skill_content: "---\nname: Visual Hierarchy\ndescription: Applies visual hierarchy principles to any composition. Use when designing or critiquing a page, screen, or layout where reading order or emphasis feels unclear or unintentional.\n---\n\n# Visual Hierarchy\n\nVisual hierarchy is the art of making the viewer's eye move in the right order. Without it, every element competes and nothing lands. With it, a composition communicates its intended message before a single word is read consciously.\n\n## Establish One Dominant Element\n\nEvery composition needs a single point of maximum visual weight — the first thing the eye goes to. This is achieved through size, contrast, color, or isolation (whitespace). If two elements have equal weight, neither wins; the viewer's eye oscillates and comprehension drops. Identify the single most important thing in the composition and make it clearly, unambiguously dominant.\n\n## Use Three Levels, Not More\n\nMost compositions are well-served by three levels of hierarchy: Primary (the dominant message, seen first), Secondary (the supporting detail, seen second), Tertiary (context, labels, metadata, seen on demand). Adding a fourth or fifth level makes the system hard to maintain and signals that the content strategy needs editing, not more design. When everything is a priority, nothing is.\n\n## Size and Weight Are the Primary Levers\n\nScale is the most powerful hierarchy tool. A headline at 48px over body at 16px communicates a 3:1 size relationship that readers process instantly. Weight (bold vs. regular) within the same type size creates secondary hierarchy within a text block. Color contrast is additive, not a replacement — using color alone to create hierarchy fails users with color vision deficiencies and degrades in single-color contexts.\n\n## Whitespace Is Not Empty Space\n\nProximity and grouping are hierarchy tools. Elements close together are read as related; elements separated by space are read as distinct. Increasing whitespace around an element elevates its importance even without changing its size. When a composition feels crowded and hard to read, the solution is almost always removing elements or adding space, not rearranging what exists.\n\n## Apply the Squint Test\n\nStep back (or squint) at any composition until the text is illegible. What remains visible? The areas of highest contrast and largest weight are the dominant elements. If the wrong element dominates the blurred view, the hierarchy is wrong and the solution is to adjust contrast or size relationships, not to add more visual noise. This test reveals hierarchy problems that close inspection misses.\n\n## Audit the Reading Path\n\nFor any layout, trace the intended reading path (what the viewer should see in order) and then test whether a first-time viewer actually follows it. Common hierarchy failures: subheadlines that outweigh headlines because of color, calls to action buried in low-contrast text, images that dominate purely by size without serving the message. Name the intended order, then verify the composition produces it.",
  },
  {
    slug: "brand-naming",
    name: "Brand Naming",
    category: "design",
    description: "Generates and evaluates brand or product names against clear criteria. Use when naming a new brand, product, or feature, or when auditing an existing name for strategic fit, linguistic safety, and distinctiveness.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["naming","branding","strategy","copywriting","identity"],
    install_count: 27600,
    rating_avg: 4.7,
    rating_count: 673,
    skill_content: "---\nname: Brand Naming\ndescription: Generates and evaluates brand or product names with clear criteria. Use when naming a brand, product, or feature, or auditing an existing name for strategic fit, distinctiveness, and linguistic safety.\n---\n\n# Brand Naming\n\nNaming is a strategic decision with long-term consequences. A name shapes perception, affects trademark viability, influences SEO, and is one of the hardest things to change once established. This skill approaches it with the rigor it deserves.\n\n## Establish Naming Criteria First\n\nBefore generating names, define the criteria against which every candidate will be scored. Standard criteria: Distinctive (stands out in the category), Memorable (easy to recall after one exposure), Pronounceable (works in the primary target language without coaching), Meaningful (suggests something relevant without over-explaining), Available (trademark and domain likely obtainable), Scalable (works as the company/product evolves). Weight the criteria by project priority — a startup needs availability weighted highest; an established brand extension might weight distinctiveness first.\n\n## Generate Across Naming Archetypes\n\nExplore at least five archetypes to avoid fixating on one direction: Descriptive (names that describe the function: 'Zoom', 'Slack'), Invented (coined words with no prior meaning: 'Kodak', 'Xero'), Evocative (words that suggest a feeling or idea: 'Amazon', 'Stripe'), People names (founder or character: 'Dyson', 'Patagonia'), Alphanumeric (a combination of letters/numbers: 'G2', 'M1'). Generate at least 20 candidates before evaluating any. Premature evaluation kills creative range.\n\n## Score Candidates Against Criteria\n\nAfter generating candidates, score each one against the established criteria on a simple 1-3 scale per criterion. Do not average into a single score — the breakdown matters. A name that scores 3/3/3/3/1/3 (low on availability) is a different decision than 2/2/2/2/3/2 (mediocre across the board). Surface the top 5 candidates with their score breakdowns and short rationale for each criterion.\n\n## Linguistic and Cultural Safety Check\n\nFor any name entering serious consideration, run it through: unintended meanings in the top 3 secondary language markets, phonetic associations (what does it sound like?), visual ambiguity (how does it look in all-caps, all-lowercase?), and a basic Google search for existing uses. Do not substitute this for professional trademark search — clearly state that trademark clearance by a legal professional is required before finalizing any name.\n\n## Test for Memorability and Pronunciation\n\nSpeak each candidate aloud three times. Say it in a sentence as if introducing the brand: 'Have you heard of [Name]?' and 'I work at [Name].' Names that feel awkward in natural speech rarely recover. Test recall: tell someone the shortlist verbally, wait 10 minutes, and ask them to repeat the names they remember. The ones that survive recall testing are the ones worth investing in.\n\n## Present Names in Context\n\nPresent final candidates in context, not in isolation. Show the name in a sentence, in a URL format, as a social handle, and in a simple logotype lockup (even set in a neutral typeface). Context reveals problems that a name in a list hides. A name that looks strong on a spreadsheet may look odd as a URL or feel weak at display size.",
  },
  // ── skill-builder-studio ──
  {
    slug: "skill-description-writer",
    name: "Skill Description Writer",
    category: "coding",
    description: "Writes discoverable skill descriptions (what + when, third person) that trigger reliably. Use when drafting or improving only the description field of a SKILL.md or catalog entry. Do NOT use to author a whole skill (use Skill Creator) or grade/audit one (use Skill Auditor).",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["skill-authoring","discoverability","meta","agent-skills","descriptions"],
    install_count: 12700,
    rating_avg: 4.7,
    rating_count: 610,
    skill_content: "---\nname: Skill Description Writer\ndescription: Writes discoverable skill descriptions combining what the skill does with when to invoke it, in third person. Use when drafting or improving only the description field of a SKILL.md or catalog entry. Do NOT use to author a whole skill (use Skill Creator) or to grade/audit one (use Skill Auditor).\n---\n\n# Skill Description Writer\n\nCrafts the description field that determines whether Claude selects a skill. A weak description means the skill never fires; an overloaded description means it fires on the wrong tasks.\n\n## The Two-Part Formula\n\nEvery description must contain both parts in this order:\n1. WHAT: one tight sentence naming the capability in active third-person voice\n2. WHEN: one sentence listing the concrete trigger conditions (the contexts, phrases, or task types that should invoke it)\n\nExample: 'Generates a zero-downtime database migration plan. Use when adding columns, altering types, dropping tables, or backfilling data on a live schema.'\n\n## Trigger Term Density\n\nPack the WHEN clause with the exact nouns, verbs, and phrases users will type. Think: what would someone say when they need this skill? Include synonyms for the same action. Avoid abstract nouns ('enhancement', 'improvement') in favor of concrete verbs ('adding', 'altering', 'debugging').\n\n## Length and Formatting\n\n- Frontmatter description: 1024 chars max; aim for 80 to 200 chars for fast scanning\n- Catalog/JSON description field: 200 chars max\n- Third person throughout ('Generates', 'Reviews', 'Writes' — not 'I will generate')\n- No trailing periods inside frontmatter YAML strings\n- No backtick characters, no markdown formatting inside the value\n\n## Do / Don't\n\nDo: 'Reviews a diff for correctness, security, and regression risk. Use before opening a PR or after Claude writes a non-trivial change.'\nDont: 'A helpful skill for reviewing things when you want feedback.'\n\nDo lead with the output or action, not the method. 'Produces a cited research report' beats 'Uses web searches to gather information'.\n\n## Revision Checklist\n\n- Both WHAT and WHEN present\n- Trigger terms match real user phrasing\n- Third person, active voice\n- Under 200 chars for catalog field\n- No vague qualifiers ('helpful', 'useful', 'better')\n",
  },
  {
    slug: "skill-tester",
    name: "Skill Tester",
    category: "coding",
    description: "Empirically tests a skill with subagent scenarios to verify it triggers correctly and performs its job. Use when validating a new or modified SKILL.md before publishing or adding it to a pack. Do NOT use to statically grade or rewrite skill quality (use Skill Auditor) — this runs live trigger tests.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["skill-authoring","testing","meta","agent-skills","validation"],
    install_count: 9300,
    rating_avg: 4.6,
    rating_count: 380,
    skill_content: "---\nname: Skill Tester\ndescription: Empirically tests a skill with subagent scenarios to verify it triggers correctly and performs its job. Use when validating a new or modified SKILL.md before publishing or adding it to a pack. Do NOT use to statically grade or rewrite skill quality (use Skill Auditor) — this runs live trigger tests.\n---\n\n# Skill Tester\n\nVerifies that a skill fires on the right prompts, stays silent on unrelated ones, and actually produces the behavior its description promises.\n\n## Two Test Dimensions\n\nTest both triggering and performance separately:\n- Trigger tests: does the skill activate on the intended prompts? Does it stay silent on out-of-scope prompts?\n- Performance tests: when activated, does it follow the skill instructions and produce correct output?\n\n## Writing Trigger Scenarios\n\nFor each skill under test, write at least three positive scenarios (prompts that should trigger it) and two negative scenarios (prompts that should not). Positive scenarios should paraphrase the WHEN clause of the description using different words. Negative scenarios should be adjacent tasks that the skill should not hijack.\n\nExample for a 'Skill Author' skill:\n- Positive: 'Write a new skill for generating database migrations'\n- Positive: 'Help me create a SKILL.md for a code-review capability'\n- Negative: 'Review my pull request' (that is a different skill)\n- Negative: 'What is the weather today'\n\n## Running Subagent Tests\n\nLaunch each scenario as a subagent with the target skill loaded. Capture: did the skill load, did the agent follow the skill sections, was the output format correct. Run positive and negative scenarios in the same batch where the subagent framework supports it.\n\n## Pass Criteria\n\n- All positive scenarios trigger the skill\n- All negative scenarios do not trigger the skill\n- Output for at least two positive scenarios satisfies the skill checklist\n- No frontmatter parsing errors\n\n## Iteration Loop\n\nIf trigger tests fail: revise the description WHEN clause and add missing trigger terms. If performance tests fail: revise the skill body sections for the failing behavior. Re-run after each revision. Do not publish until all scenarios pass.\n",
  },
  {
    slug: "skill-pack-curator",
    name: "Skill Pack Curator",
    category: "coding",
    description: "Composes a coherent pack of skills by resolving persona vs workflow conflicts and enforcing overlap limits. Use when assembling a new pack, choosing its members, or deciding whether a skill belongs in a bundle. Do NOT use to grade or rewrite a pack to a quality bar (use Skill Auditor) — this designs membership.",
    author: "Skill Me",
    featured: false,
    verified: true,
    tags: ["skill-authoring","meta","pack-design","curation","agent-skills"],
    install_count: 7800,
    rating_avg: 4.5,
    rating_count: 290,
    skill_content: "---\nname: Skill Pack Curator\ndescription: Composes a coherent pack of skills by resolving persona vs workflow conflicts and enforcing overlap limits. Use when assembling, choosing members for, or pruning a skill bundle or catalog pack. Do NOT use to grade or rewrite a pack to a quality bar (use Skill Auditor) — this designs membership.\n---\n\n# Skill Pack Curator\n\nA pack is not a dump of related skills. It is a curated set where every skill earns its place, the skills do not conflict, and the pack has a single clear audience.\n\n## Define the Pack Persona\n\nBefore adding any skill, write one sentence: 'This pack is for [persona] who need to [job].'\n\nEvery candidate skill must serve that persona and job. Reject skills that are useful but off-persona. They belong in a different pack.\n\n## Persona Packs vs Workflow Packs\n\nA persona pack serves one role across many task types (e.g., 'Staff Engineer Toolkit'). A workflow pack covers one end-to-end workflow across roles (e.g., 'Database Migration Workflow'). Mixing both in one pack creates ambiguity. Choose one mode and apply it consistently.\n\n## Overlap Budget\n\nNo two skills in a pack should trigger on the same prompt more than 20 percent of the time. Test this: for each skill's positive trigger scenarios, check whether another skill in the pack would also activate. If two skills overlap on more than one in five triggers, merge them or remove the weaker one.\n\n## Pack Size\n\n- Minimum: 3 skills (below this it is not a pack, it is just a skill with sub-sections)\n- Maximum: 12 skills per pack before splitting into sub-packs\n- Sweet spot: 5 to 8 skills\n\n## Coherence Check\n\nFor each skill in the pack, verify:\n- A user of this pack's persona would plausibly need this skill\n- The skill does not duplicate another skill already in the pack\n- The skill's description trigger terms are consistent with the pack's domain vocabulary\n\nIf a skill fails any of the three checks, remove it or move it to a more appropriate pack.\n\n## Tagline and Description\n\nThe pack tagline (90 chars max) must name the audience and the outcome. 'Tools for engineers who write and ship Claude Agent Skills' is good. 'A collection of useful skills' is not.\n",
  },

  {
    slug: "story-structure-architect",
    name: "Story Structure Architect",
    category: "writing",
    description: "Use when plotting or outlining a novel or screenplay, structuring its acts/chapters/sequences, fixing a sagging middle or broken pacing, mapping a character arc onto plot beats, planting setups and their payoffs, or deciding scene order. Produces the macro architecture — arc, beat sheet, tension curve — not prose. Do NOT use to write the actual prose of a scene (use Fiction Scene Writer, which sits downstream of this), to establish or mimic a narrative VOICE (use Ghostwriter), or to write a non-fiction book proposal or pitch (use Book Proposal).",
    author: "Skill Me",
    source_url: "https://github.com/aouellets/skillme/tree/main/skills/story-structure-architect",
    featured: false,
    verified: true,
    tags: ["writing","fiction","plotting","story-structure","screenwriting"],
    install_count: 0,
    rating_avg: 0,
    rating_count: 0,
    skill_content: "---\nname: Story Structure Architect\ndescription: Use when plotting or outlining a novel or screenplay, structuring its acts/chapters/sequences, fixing a sagging middle or broken pacing, mapping a character arc onto plot beats, planting setups and their payoffs, or deciding scene order. Produces the macro architecture — arc, beat sheet, tension curve — not prose. Do NOT use to write the actual prose of a scene (use Fiction Scene Writer, which sits downstream of this), to establish or mimic a narrative VOICE (use Ghostwriter), or to write a non-fiction book proposal or pitch (use Book Proposal).\n---\n\n# Story Structure Architect\n\nYou design the skeleton of a long-form story — the macro arc, act and chapter beats, the tension curve, and the network of setups and payoffs. You decide what happens and in what order, and why each turn lands. You do not write the scenes themselves; once the architecture holds, hand individual scenes to Fiction Scene Writer.\n\n## Process\n\n1. Gather the premise, genre and length (novel vs. screenplay; rough word/page or chapter count), the protagonist and what they want vs. what they need, the central dramatic question, the ending if known, and any beats or constraints the writer is committed to.\n2. Pin the spine: the central dramatic question, the protagonist's want (external goal) and need (internal lack), and the thematic argument the plot proves.\n3. Lay out the macro arc in acts. Then break acts into beats, then beats into a chapter or scene sequence.\n4. Run the diagnostics below — tension curve, causality, setups/payoffs, arc alignment — and revise the structure until they pass.\n5. Deliver the beat sheet and the ordered scene/chapter list, flagging which beats are load-bearing and which are flexible.\n\n## Build the macro arc\n\n- **Choose a structural frame and name it** — three-act, four-act, five-act, Hero's Journey, Save the Cat, the seven-point structure, kishōtenketsu. Pick the one that fits the genre and the writer's commitments; don't force a thriller into a frame built for a character study. State which you're using and why.\n- **Fix the load-bearing turns first**: the inciting incident, the first-act break (point of no return), the midpoint (a reversal or revelation that raises stakes and recontextualizes the goal), the all-is-lost / second-act break, the climax, and the resolution. Everything else hangs off these.\n- **Make the midpoint do real work.** A sagging middle is almost always a midpoint that only marks time. The midpoint should flip something — false victory to real danger, or vice versa — and convert the protagonist from reactive to active.\n- **End the act, not just the page.** Each act break should change the protagonist's situation or understanding so the next act can't be the same as the last.\n\n## Beat the chapters and order the scenes\n\n- Decompose each act into beats (units of dramatic change), then assign beats to chapters or screenplay sequences. One clear dramatic function per chapter; if a chapter has none, it's a candidate to cut or merge.\n- Order scenes by **causality, not chronology**: each beat should be caused by the last and cause the next (\"therefore / but,\" not \"and then\"). A chain of \"and then\" is the structural signature of a sagging story.\n- Decide where to open: as late into the story as the inciting tension allows. Decide where to cut each chapter: on a hook, reversal, or unanswered question that pulls the reader forward.\n- Use B-plots and subplots to **counterpoint pacing** — let a quieter relational thread breathe under an action stretch, or raise subplot pressure when the A-plot must pause.\n\n## Diagnostics (run before delivering)\n\n- **Tension curve**: sketch the rising line beat by beat. It should escalate overall with deliberate valleys for breath — not flatline (the sag) and not max out early (no room left to climb). Each major turn should raise stakes above the last. If two adjacent beats sit at the same intensity, vary or reorder them.\n- **Causality audit**: walk the beats and confirm each is driven by a prior choice or consequence. Coincidence may *cause* trouble for the protagonist but must never *solve* it — no rescue that the protagonist didn't earn.\n- **Setups and payoffs**: list every payoff (twist, reveal, capability, object, relationship) and confirm each is planted earlier — fairly, not telegraphed. List every prominent setup and confirm it pays off or gets cut. No loaded gun left unfired; no payoff that arrives from nowhere.\n- **Arc–plot alignment**: confirm external plot beats force internal change. The midpoint and climax should test the protagonist's *need*, not just their *want*. The character should be unable to win the external climax without confronting the internal flaw. If the arc and plot run on separate tracks, fuse them.\n- **Promise and genre**: confirm the opening promises the kind of story the ending delivers, and that genre obligations (the mystery's solution, the romance's union or rupture) are met or subverted on purpose.\n\n## Quality bar\n\nThe architecture is done well when: a reader can name the central dramatic question and see exactly which beats raise and answer it; every chapter has one clear dramatic function; the tension curve climbs with intentional valleys and no dead middle; every payoff is fairly planted and every prominent setup resolves; and the protagonist cannot win the climax without changing internally. The output is a navigable map — beat sheet plus ordered scene/chapter list — that a writer (or Fiction Scene Writer) could draft from directly.\n\n## What NOT to do\n\n- **Don't write scene prose, dialogue, or description.** Your unit is the beat, not the paragraph. The moment you start drafting the moment, stop and hand it to Fiction Scene Writer.\n- **Don't establish or mimic voice, style, or tone.** That's Ghostwriter's job. Describe what happens, not how the sentences should sound.\n- **Don't structure a non-fiction argument or write a proposal.** A non-fiction chapter outline that sells an idea or argues a thesis is Book Proposal's territory; you plot fiction narrative.\n- **Don't impose a rigid template that fights the story.** The frame serves the premise; if the writer's committed beats break the chosen structure, adapt the structure or pick another, and say so.\n- **Don't fix a sag by adding events.** Diagnose whether the midpoint turns, whether beats are causally linked, and whether the arc is engaged — more incident on a flat curve only lengthens the sag.\n- **Don't leave setups and payoffs to chance.** If you can't point to where a reveal was planted, it isn't planted yet.\n- **Don't invent the writer's premise, ending, or fixed beats.** Ask for the spine; flag any structural assumption you had to make.\n\n## Output\n\nDeliver: (1) the named structural frame and a one-line statement of the central dramatic question, want, need, and theme; (2) the macro arc by act with its load-bearing turns; (3) the beat sheet decomposed to an ordered chapter/scene list, each tagged with its dramatic function; (4) the tension-curve note and the setups/payoffs table; and (5) a short list of which beats are load-bearing vs. flexible. Hand scene drafting downstream to Fiction Scene Writer.\n",
  },
  {
    slug: "manuscript-reviser",
    name: "Manuscript Reviser",
    category: "writing",
    description: "Use when revising fiction prose that ALREADY EXISTS — a second/third-draft pass on a chapter or scene, a continuity or POV-consistency check, fixing a scene that drags, cutting dead weight, or tightening overwritten prose at the line level. Do NOT use to draft a brand-new scene from nothing (use Fiction Scene Writer), to build or mimic an author's voice (use Ghostwriter), or for neutral encyclopedic prose (use Wikipedia Style Writer); to outline or re-architect the plot at the beat level, use Story Structure Architect.",
    author: "Skill Me",
    source_url: "https://github.com/aouellets/skillme/tree/main/skills/manuscript-reviser",
    featured: false,
    verified: true,
    tags: ["writing","fiction","editing","revision","continuity"],
    install_count: 0,
    rating_avg: 0,
    rating_count: 0,
    skill_content: "---\nname: Manuscript Reviser\ndescription: Use when revising fiction prose that ALREADY EXISTS — a second/third-draft pass on a chapter or scene, a continuity or POV-consistency check, fixing a scene that drags, cutting dead weight, or tightening overwritten prose at the line level. Do NOT use to draft a brand-new scene from nothing (use Fiction Scene Writer), to build or mimic an author's voice (use Ghostwriter), or for neutral encyclopedic prose (use Wikipedia Style Writer); to outline or re-architect the plot at the beat level, use Story Structure Architect.\n---\n\n# Manuscript Reviser\n\nYou revise existing fiction. The draft is already written; your job is to make it sharper, tighter, and internally consistent without rewriting it into your own voice. Revise, don't replace.\n\n## Before you touch a line\n\n1. Read the whole passage once, all the way through, before changing anything. You cannot judge pacing or continuity from a fragment.\n2. Establish the ground truth you must protect: the POV character and the narrative distance (close third, omniscient, first), the verb tense, and the author's existing voice. These are constraints, not targets — preserve them unless the user asked you to change them.\n3. Ask for the surrounding context if a continuity or POV call depends on material you can't see (an earlier chapter, a character sheet, established timeline). Don't guess at canon.\n\n## The revision passes — run in this order\n\nWork coarse-to-fine. Fixing structure after polishing sentences wastes the polish.\n\n1. **Continuity.** Track concrete facts across the passage: names, eye/hair color, ages, who knows what and when, object positions, time of day, weather, geography, wounds and their healing. Flag every contradiction. Don't silently \"fix\" a fact you can't verify — surface it and ask.\n2. **POV consistency.** Catch head-hops (entering a non-POV character's thoughts), and information the POV character couldn't perceive or know. Catch filter words that break close POV (\"she saw,\" \"he noticed,\" \"she felt\") and collapse them to the thing itself. Hold the established narrative distance steady.\n3. **Pacing.** Find the drag. Mark scenes that summarize what should be dramatized and scenes that dramatize what should be summarized. Cut throat-clearing openings — start as late into the scene as the meaning allows. Note where tension slackens because nothing is at stake on the page.\n4. **Cut dead weight.** Remove redundant beats, repeated information, filler dialogue, and scenes that don't change anything. If a paragraph can go without loss, it goes. Deleting is the highest-leverage edit.\n5. **Line-level tightening.** Now the prose: trim adverbs propping up weak verbs, deflate purple description, vary sentence length for rhythm, break up \"talking heads\" dialogue with grounding beats, and convert named emotions (\"she was angry\") into rendered ones. Keep one sharp sensory detail over a catalog of three.\n\n## The quality bar — a revision is done well when\n\n- Every change preserves the author's voice and intent; a reader can't tell where the author stops and you start.\n- Every continuity and POV problem in the passage is caught and either fixed (when verifiable) or flagged (when it depends on unseen canon).\n- The passage is measurably tighter — you can name what you cut and why it didn't earn its place.\n- Edits are shown, not just asserted: the user can see what changed and accept or reject each one.\n- You changed nothing that was already working. Restraint is part of the craft.\n\n## How to deliver\n\n- Present the revised prose, then a short change log grouped by pass (continuity / POV / pacing / cuts / line edits), each entry naming the problem and the fix.\n- For continuity questions you couldn't resolve, list them as open queries for the author — never invent the answer.\n- For substantial cuts or rewrites, show before/after so the author keeps authority over their book.\n\n## What NOT to do\n\n- **Don't rewrite it in your own voice.** The most common failure. Match their rhythm, vocabulary, and register; smoothing out an author's quirks erases the voice you were asked to keep.\n- **Don't draft new material to \"fix\" a gap.** If a scene is missing, say so — writing it from nothing is Fiction Scene Writer's job, not a revision.\n- **Don't restructure the plot.** Reordering beats, cutting subplots, or re-architecting the arc is structural work (use Story Structure Architect), not revision. Stay at the prose-and-scene level; if the passage needs a different plot, flag it for the author or hand it to Story Structure Architect rather than rebuilding it yourself.\n- **Don't \"fix\" a fact you can't verify.** A confident wrong continuity edit is worse than a flagged question. When canon is unseen, ask.\n- **Don't over-edit.** Resist changing prose that already works just to leave a fingerprint. If an edit doesn't make the passage clearer, tighter, or more consistent, don't make it.\n- **Don't change POV, tense, or voice on your own initiative.** Those are the author's structural choices; touch them only on explicit request.\n",
  },
  {
    slug: "zone-2-cardio-plan",
    name: "Zone 2 Cardio Plan",
    category: "personal",
    description: "Use when someone asks to build a steady-state cardio plan, train an aerobic base or Zone 2, structure easy or endurance weekly cardio, train by heart-rate zones, or improve resting heart rate, VO2, or endurance. Builds a heart-rate-zone aerobic training block with session structure, modality choice, and progression. General fitness guidance, not medical advice. Do NOT use to design a strength or lifting program (use Strength Training Plan), high-intensity interval conditioning, HIIT, or circuits (use Conditioning & HIIT Program), or a mobility/flexibility routine (use Mobility Routine).",
    author: "Skill Me",
    source_url: "https://github.com/aouellets/skillme/tree/main/skills/zone-2-cardio-plan",
    featured: false,
    verified: true,
    tags: ["cardio","zone-2","endurance","heart-rate-training","fitness"],
    install_count: 0,
    rating_avg: 0,
    rating_count: 0,
    skill_content: "---\nname: Zone 2 Cardio Plan\ndescription: Use when someone asks to build a steady-state cardio plan, train an aerobic base or Zone 2, structure easy or endurance weekly cardio, train by heart-rate zones, or improve resting heart rate, VO2, or endurance. Builds a heart-rate-zone aerobic training block with session structure, modality choice, and progression. General fitness guidance, not medical advice. Do NOT use to design a strength or lifting program (use Strength Training Plan), high-intensity interval conditioning, HIIT, or circuits (use Conditioning & HIIT Program), or a mobility/flexibility routine (use Mobility Routine).\n---\n\n# Zone 2 Cardio Plan\n\nThis skill builds an aerobic-base training block organized around heart-rate zones, with Zone 2 as the foundation. It picks a modality, lays out a weekly structure, and progresses load toward an endurance goal. The default is a 4-week block, repeatable. This is general fitness guidance, not medical advice — anyone with cardiac risk factors, on heart-rate-affecting medication, or returning from illness or injury should clear endurance training with a physician first.\n\n## Establish Zones First\n\nAnchor every prescription to heart rate, not pace or feel alone. Estimate maximum heart rate as 220 minus age as a starting point, and flag it as a rough estimate — a lab or field test is more accurate. Define the zones as percentages of max HR: Zone 1 (50–60%) recovery; Zone 2 (60–70%) aerobic base; Zone 3 (70–80%) tempo; Zone 4 (80–90%) threshold; Zone 5 (90–100%) VO2 max. Give the user their actual beats-per-minute ranges, not just percentages. The Zone 2 test in practice: a pace where the user can hold a conversation in full sentences but would prefer not to. If they can't talk, they're too high; most people drift into Zone 3 and stall their base.\n\n## Choose the Modality\n\nMatch the modality to the goal and to joints. Running builds the most specific endurance and the highest impact; cycling and rowing are lower-impact and let beginners hold Zone 2 longer without form breakdown; rucking (loaded walking) suits those building work capacity with minimal equipment. Default to the user's stated goal sport. If they have no specific goal, default to whatever they will do consistently and can sustain for 45+ minutes without joint pain. It is fine to mix modalities across a week to manage impact, but keep the bulk of Zone 2 volume in one primary modality for adaptation.\n\n## Build the Weekly Structure\n\nMost aerobic adaptation comes from time in Zone 2, so the week is mostly easy volume. For a typical 4-day week: three Zone 2 sessions plus one higher-intensity session. Polarize the distribution — roughly 80% of weekly time in Zone 1–2, 20% in Zone 3–5. Do not let the easy days creep into Zone 3; that \"moderate-intensity rut\" is the most common failure. Place the hard session with at least one easy or rest day on either side. A sample week: Zone 2 (45 min), rest, Zone 2 (45 min), Zone 4/5 intervals (e.g. 5×3 min hard / 3 min easy), rest, Zone 2 long (60–75 min), rest.\n\n## Set Session Duration and the VO2 Stimulus\n\nZone 2 sessions should be long enough to matter: start at 30–45 minutes and build toward 60–90 for the long session. Below ~30 minutes the aerobic stimulus is thin. For VO2 max and top-end fitness, prescribe one weekly interval session in Zone 4–5: classic formats are 4×4 min hard / 3 min easy, or 30/30s (30 sec hard, 30 sec easy ×10–20). Keep intervals to one session per week during a base block — more high intensity erodes the aerobic emphasis and recovery.\n\n## Progress Toward the Goal\n\nDefault progression is volume before intensity. Increase total weekly Zone 2 time by no more than ~10% per week to protect tendons and avoid overuse. Build for 3 weeks, then take a recovery week at ~60% volume before the next block. Tie progress to a measurable goal: a target resting heart rate, a longer continuous Zone 2 session, a faster pace at the same heart rate (aerobic decoupling shrinking), or a benchmark like a 5K time or a set distance. Re-test the benchmark at the end of each block and adjust zones if resting or max HR has shifted.\n\n## Quality Bar\n\nA plan is done well when: every session names a target HR zone in actual bpm, not just a vibe; the week is genuinely polarized (mostly easy, a little hard) rather than uniformly moderate; the modality fits the user's goal and joints and is one they'll repeat; progression is explicit and capped (~10%/week, with a recovery week); and success is tied to a concrete, re-testable aerobic-endurance metric. The medical-clearance caveat is present.\n\n## What NOT to Do\n\n- Don't prescribe by pace or RPE alone — without HR zones the user defaults to too-hard, the central mistake this skill exists to prevent.\n- Don't let \"easy\" days drift into Zone 3; protect the aerobic base.\n- Don't stack multiple high-intensity sessions into a base block, or skip the recovery week.\n- Don't ramp weekly volume aggressively; injury ends a block faster than any plateau.\n- Don't program strength or lifting work, high-intensity interval conditioning or HIIT, or mobility/flexibility drills here — hand those to Strength Training Plan, Conditioning & HIIT Program, and Mobility Routine respectively.\n- Don't pose as a medical provider; flag the clearance need and stop short of diagnosing or treating.\n",
  },
]

/**
 * The full seed catalog: the hand-curated core plus the generated expansion
 * packs (`scripts/expansion-data/*.json` → `seed-data-expansion.ts`). Keeping
 * the expansion in its own module keeps this file reviewable and lets the
 * generator own escaping.
 */
export const SEED_SKILLS: SeedSkill[] = [...CORE_SEED_SKILLS, ...EXPANSION_SKILLS]
