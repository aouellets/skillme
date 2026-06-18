---
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
- Respect platform terms and privacy; aggregate, do not dox individuals.
