---
name: SERP Gap Analyzer
description: Outputs the subtopics, entities, and questions a draft is missing versus the pages already ranking for its target query, classified by whether each gap is worth closing. Use when you have a draft (or outline) plus a target query and want to know what to add before publishing, or when you can name the 3-5 URLs currently ranking and want to close coverage gaps against them.
---
# SERP Gap Analyzer

Compare a draft against the pages that already rank for its target query and report which subtopics, entities, and questions it omits — ranked by whether closing the gap is worth it.

## Workflow

1. **Gather inputs.** Confirm the target query, the draft (or its outline), and 3-5 URLs currently ranking for that query. If the ranking URLs are not supplied, ask for them — do not invent rankings.
2. **Build the coverage map.** Pull the H2/H3 outline from each ranking URL. Aggregate into one master list of subtopics. Tag each: covered by most competitors (table stakes) vs covered by one (optional differentiator).
3. **Extract entities and salient terms.** List the named entities competitors reference — tools, standards, people, brands, specs, related concepts. Flag entities present across competitors but absent from the draft. Topical depth comes from the right co-occurring entities, not keyword density.
4. **Mine the questions.** Collect People Also Ask entries, FAQ blocks, and question-form subheads across the ranking pages. Each is a query the draft could also satisfy. Flag questions no competitor answers well — those are the strongest additions.
5. **Assess depth, not just presence.** For subtopics the draft already touches, compare treatment depth against competitors; a one-line mention against 400 words of competitor coverage is still a gap. Note format gaps too — tables, step lists, or original data competitors use and the draft lacks.
6. **Classify every gap and prioritize.** Label each gap must-have (consensus + on-intent), differentiator (adds unique value), or skip (off-intent, tangent, affiliate filler). Recommend closing must-haves first, then high-value differentiators.

## Quality bar

- Every gap is tied to a specific competitor source, not asserted from memory.
- Gaps are weighted by competitor consensus and by the draft's target intent, not listed flat.
- The report distinguishes presence gaps from depth gaps from format gaps.
- Output is an ordered action list ("add X, deepen Y, answer Z"), not a description of competitor pages.

## Do NOT

- Do not duplicate competitor structure verbatim; matching every heading produces a derivative page that adds nothing.
- Do not pad to hit a word count — length is a symptom of coverage, not a goal.
- Do not recommend gaps that serve a different intent than the target query.
- Do not invent rankings or competitor content; analyze only the URLs provided.
- Do NOT use when the page already ranks and is decaying over time and you need refresh actions — use content-refresh-auditor instead.
- Do NOT use when the goal is rewriting a section into citable answer blocks for AI engines or featured snippets — use aeo-answer-blockifier instead.
