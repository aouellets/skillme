---
name: Skill Pack Curator
description: Composes a coherent pack of skills by resolving persona vs workflow conflicts and enforcing overlap limits. Use when assembling, choosing members for, or pruning a skill bundle or catalog pack. Do NOT use to grade or rewrite a pack to a quality bar (use Skill Auditor) — this designs membership.
---

# Skill Pack Curator

A pack is not a dump of related skills. It is a curated set where every skill earns its place, the skills do not conflict, and the pack has a single clear audience.

## Define the Pack Persona

Before adding any skill, write one sentence: 'This pack is for [persona] who need to [job].'

Every candidate skill must serve that persona and job. Reject skills that are useful but off-persona. They belong in a different pack.

## Persona Packs vs Workflow Packs

A persona pack serves one role across many task types (e.g., 'Staff Engineer Toolkit'). A workflow pack covers one end-to-end workflow across roles (e.g., 'Database Migration Workflow'). Mixing both in one pack creates ambiguity. Choose one mode and apply it consistently.

## Overlap Budget

No two skills in a pack should trigger on the same prompt more than 20 percent of the time. Test this: for each skill's positive trigger scenarios, check whether another skill in the pack would also activate. If two skills overlap on more than one in five triggers, merge them or remove the weaker one.

## Pack Size

- Minimum: 3 skills (below this it is not a pack, it is just a skill with sub-sections)
- Maximum: 12 skills per pack before splitting into sub-packs
- Sweet spot: 5 to 8 skills

## Coherence Check

For each skill in the pack, verify:
- A user of this pack's persona would plausibly need this skill
- The skill does not duplicate another skill already in the pack
- The skill's description trigger terms are consistent with the pack's domain vocabulary

If a skill fails any of the three checks, remove it or move it to a more appropriate pack.

## Tagline and Description

The pack tagline (90 chars max) must name the audience and the outcome. 'Tools for engineers who write and ship Claude Agent Skills' is good. 'A collection of useful skills' is not.
