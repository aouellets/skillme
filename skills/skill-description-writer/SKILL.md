---
name: Skill Description Writer
description: Writes discoverable skill descriptions combining what the skill does with when to invoke it, in third person. Use when drafting or improving only the description field of a SKILL.md or catalog entry. Do NOT use to author a whole skill (use Skill Creator) or to grade/audit one (use Skill Auditor).
---

# Skill Description Writer

Crafts the description field that determines whether Claude selects a skill. A weak description means the skill never fires; an overloaded description means it fires on the wrong tasks.

## The Two-Part Formula

Every description must contain both parts in this order:
1. WHAT: one tight sentence naming the capability in active third-person voice
2. WHEN: one sentence listing the concrete trigger conditions (the contexts, phrases, or task types that should invoke it)

Example: 'Generates a zero-downtime database migration plan. Use when adding columns, altering types, dropping tables, or backfilling data on a live schema.'

## Trigger Term Density

Pack the WHEN clause with the exact nouns, verbs, and phrases users will type. Think: what would someone say when they need this skill? Include synonyms for the same action. Avoid abstract nouns ('enhancement', 'improvement') in favor of concrete verbs ('adding', 'altering', 'debugging').

## Length and Formatting

- Frontmatter description: 1024 chars max; aim for 80 to 200 chars for fast scanning
- Catalog/JSON description field: 200 chars max
- Third person throughout ('Generates', 'Reviews', 'Writes' — not 'I will generate')
- No trailing periods inside frontmatter YAML strings
- No backtick characters, no markdown formatting inside the value

## Do / Don't

Do: 'Reviews a diff for correctness, security, and regression risk. Use before opening a PR or after Claude writes a non-trivial change.'
Dont: 'A helpful skill for reviewing things when you want feedback.'

Do lead with the output or action, not the method. 'Produces a cited research report' beats 'Uses web searches to gather information'.

## Revision Checklist

- Both WHAT and WHEN present
- Trigger terms match real user phrasing
- Third person, active voice
- Under 200 chars for catalog field
- No vague qualifiers ('helpful', 'useful', 'better')
