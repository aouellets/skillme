---
name: skill-scout
description: Discover trending and emerging Claude Agent Skills, MCP servers, and skill packs across GitHub, Product Hunt, Hacker News, Reddit, and social media; dedupe them against an existing catalog; identify category gaps; and produce a prioritized report of candidates to add. Use this skill whenever the user wants to find new skills or packs to add to a catalog, scout what is hot or trending in the Claude / agent-skills / MCP ecosystem, run a competitive or landscape scan, or figure out which categories their catalog is missing, even if they do not say the word "scout."
---

# Skill Scout

Find what is being built and talked about in the Claude skills ecosystem, decide what is worth adding to a catalog, and hand back a ranked, deduped, gap-aware report. This skill exists because the ecosystem moves faster than any single person can track by hand: new skills, MCP servers, and "awesome" lists appear daily across GitHub and social, and the valuable signal is buried in noise. The job is to surface the signal, strip the duplicates, and tell the user which gaps are worth filling first.

## When this runs

Trigger on requests like "find trending skills to add," "what's hot in agent skills right now," "scan GitHub for new MCP servers," "what categories are we missing," or "do a landscape scan of skill packs." Also trigger proactively when the user is curating or growing a catalog and would benefit from knowing what exists that they do not yet carry.

## Workflow

Run these phases in order. Do not skip the dedupe and gap phases — a list of trending repos with no dedupe is just noise the user has to re-process by hand, which defeats the purpose.

### 1. Scope the scan

Settle these before searching. Infer from context where possible; ask only what you cannot infer.

- **Catalog**: Which catalog are we feeding? If the user runs SkillMe, the existing catalog is queryable via the `browse_skills` and `browse_packs` tools — use them to dedupe in phase 3. Otherwise ask for a list of what they already carry, or proceed without dedupe and flag that.
- **Focus areas**: Topics or audiences to prioritize (e.g. solo founders, paid ads, productivity, specific named tools). Default to a broad sweep if unspecified.
- **Time window**: "Trending now" defaults to the last 90 days of activity. "Emerging" leans newer (last 30 days). "Established but missing" ignores recency and looks at all-time popular items absent from the catalog.
- **Volume**: How many candidates to return. Default 10–15, ranked.

### 2. Gather candidates

Pull from multiple source types so the result is not just a GitHub mirror. Read `references/sources.md` for the concrete query cookbook (GitHub API endpoints, search strings, awesome-list URLs, social queries). Use the GitHub REST API directly when available (the `api.github.com` host returns stars, push dates, topics, and license without scraping), and `web_search` plus `web_fetch` for Product Hunt, Hacker News, Reddit, X, and blog roundups.

For each candidate capture: name, source URL, one-line description, popularity signal (stars / upvotes / mentions), last-activity date, license, and whether a real `SKILL.md` or server manifest is present. Discard repos with no skill content (forks with no changes, empty scaffolds, abandoned experiments older than a year with no traction).

### 3. Dedupe against the catalog

For every surviving candidate, check whether the catalog already carries it or a near-equivalent. With SkillMe, run a `browse_skills` / `browse_packs` query on the candidate's topic and compare. Mark each candidate as `NEW`, `DUPLICATE`, or `OVERLAP` (similar exists but the candidate is meaningfully better or different — note why). Drop pure duplicates from the final report but keep a short count of how many you dropped, so the user knows the scan was thorough.

### 4. Score and gap-analyze

Score each `NEW` and `OVERLAP` candidate 1–5 on each axis, then sum:

- **Momentum** — recent stars, upvotes, or mentions; rising beats merely large.
- **Fit** — match to the catalog's audience and focus areas from phase 1.
- **Gap** — how underserved this topic is in the catalog right now. A strong skill in an empty category outranks a marginal one in a crowded category.
- **Quality** — presence of a real SKILL.md, clear docs, permissive license, maintained.

Separately, name the **category gaps**: topics that are clearly active in the wild but thin or absent in the catalog. These are often more valuable than any single skill, because they tell the user where to commission or author new work.

### 5. Report

Always use this exact structure:

```
# Skill Scout Report — [date] — [focus areas]

## Top candidates to add
[Ranked table or list. For each: name, source link, what it does,
 momentum/popularity signal, status (NEW/OVERLAP), suggested catalog
 category, total score, one-line "why add it."]

## Category gaps
[Topics active in the wild but missing/thin in the catalog. For each:
 the gap, the evidence it's active, and a suggested action — author,
 commission, or acquire.]

## Notable but skipped
[Brief: high-interest items NOT recommended, with reason — duplicate of
 existing X, abandoned, no license, low quality. Include the dedupe count.]

## Sources scanned
[Which source types were covered this run, so coverage is auditable.]
```

Keep entries terse and scannable. Link every candidate so the user can act immediately. Lead with the highest-scoring, highest-gap items.

## Quality bar for what counts as a real candidate

A candidate worth listing has installable substance: a `SKILL.md` with a usable description and body, or an MCP server with a manifest and working tools, or a pack that bundles real skills. Star count alone is not enough — a 2k-star "awesome" list is a source to mine, not a skill to add. When in doubt, fetch the repo's SKILL.md and read it; if it is a stub, mark it low quality.

## Notes

- Respect licenses. Flag anything without a clear license as a legal question before the user lists it, since redistributing unlicensed work is a real risk for a catalog.
- Do not invent stars, dates, or descriptions. If a signal cannot be fetched, say "unknown" rather than guessing — a catalog decision made on fabricated popularity data is worse than no data.
- Re-running this skill periodically is the intended use. Each report's "Sources scanned" section makes successive runs comparable.
