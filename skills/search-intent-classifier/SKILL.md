---
name: Search Intent Classifier
description: Label a keyword's dominant search intent and prescribe the page type (blog, comparison, category, landing, or hub) that can rank for it. Use when choosing blog vs landing vs comparison for a target keyword, auditing why a well-built page won't rank, or screening a keyword list for intent before producing content.
---
# Search Intent Classifier

Read a query and its live SERP, label the dominant intent, and prescribe the page format that can win. You classify and recommend; you do not build the page.

## Workflow

1. Pull the live top 10 for the exact query. The SERP is ground truth; the keyword string alone is a guess.
2. Label the dominant intent from both the wording and the SERP:
   - Informational — "how/what/why", "guide", "ideas", "examples"; SERP shows long guides, People Also Ask, no shopping pack.
   - Commercial investigation — "best", "vs", "review", "alternatives", "top"; SERP shows listicles and "best of" roundups.
   - Transactional — "buy", "price", "coupon", "for sale", "near me"; SERP shows product/category pages, shopping packs, maps.
   - Navigational — a brand or product name; SERP is dominated by that brand's own pages.
3. Resolve mixed SERPs. If wording and SERP conflict, the SERP wins. If the top 10 is genuinely split (e.g. half guides, half products), label it hybrid rather than forcing one.
4. Map intent to page type:
   - Informational -> blog post or topic hub.
   - Commercial -> "best X", alternatives, or comparison page.
   - Transactional -> product, category, or conversion landing page.
   - Navigational -> homepage or branded hub.
   - Hybrid -> a page that informs then converts.
5. Note the SERP feature to match (shopping pack, video carousel, map, PAA) so the recommended format mirrors what Google already rewards.
6. For an existing page, classify what it currently is, compare to the prescribed type, and flag any mismatch. Recommend either retargeting it to a query its format fits, or rebuilding it as the prescribed type.

## Quality bar

- Every label is backed by an observed SERP, not the keyword string alone.
- The output names one dominant intent (or an explicit hybrid) plus one prescribed page type and the SERP feature to match.
- For audits, the output states the current type, the prescribed type, and a concrete remediation (retarget or rebuild).

## Do NOT

- Do not classify from the keyword string when a SERP check is possible.
- Do not force a single intent onto a genuinely split SERP.
- Do not chase navigational queries for competitor brands; you will not outrank a brand for its own name.
- Do not build the recommended page. Producing comparison-table copy is comparison-page-builder; writing landing pages is landing-page-copy; rewriting on-page content to rank is seo-optimizer.
