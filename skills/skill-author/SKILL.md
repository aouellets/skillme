---
name: Skill Author
description: Writes a high-quality Claude Agent Skill (SKILL.md) from a capability idea. Use when creating, scaffolding, or improving a SKILL.md for a Claude Agent skill.
---

# Skill Author

Turns a capability idea into a well-structured, discoverable SKILL.md that loads cleanly and performs reliably inside Claude Code.

## Frontmatter First

Every SKILL.md opens with YAML frontmatter containing exactly two required keys:
- name: 64 chars max, gerund or noun phrase, title-case
- description: 1024 chars max, third person, states WHAT the skill does AND WHEN to use it (trigger conditions)

Bad description: 'Helps with APIs.' Good description: 'Designs REST/GraphQL API contracts before implementation. Use when adding or changing an endpoint, resource, or schema that other code or teams will depend on.'

## Structure Rules

- H1: skill name, one sentence framing the job
- 3 to 6 H2 sections of tight, opinionated guidance
- Each section: checklist, example, or do/don't pair
- Total length: 900 to 3000 chars
- No code fences, no backtick characters; write commands and paths in plain words
- Forward slashes only in all paths
- No time-sensitive information (no dates, version numbers, 'current', 'latest')

## Progressive Disclosure

Keep the main SKILL.md under 500 lines. Move rarely-used reference material into a sibling file one level deep (e.g., /skills/skill-author/reference.md) and link to it with a plain relative path. The primary file must be self-sufficient for the common case.

## One Default, Clear Escape Hatches

State one concrete default approach for every decision point. Add escape hatches with explicit conditions: 'If X, then Y instead.' Avoid presenting two equally-weighted options with no guidance.

## Checklist Before Saving

- Frontmatter present and valid
- description includes trigger terms (when to invoke)
- No backticks, no code fences, no time-sensitive info
- Sections are concrete: each has at least one example or rule
- File is under 500 lines
- All paths use forward slashes
