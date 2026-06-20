---
name: Skill Creator
description: Use when authoring a brand-new skill from scratch — turning a repeated workflow, an existing prompt, or a "make me a skill that…" request into a well-formed SKILL.md with a trigger-precise description and an imperative, ordered body that meets the A+ bar. Do NOT use to review, grade, or improve an existing skill or pack (use Skill Auditor instead), or for writing unrelated to skills.
---

# Skill Creator

Turn a workflow, prompt, or repeated instruction into a committable SKILL.md that meets the absolute A+ bar.

## The bar — what A+ means

The skill you write is A+ only if all of these hold:

- It **fires on exactly the right requests and never on the wrong ones.** The description front-loads a concrete trigger a router can act on with no ambiguity.
- It **does not collide** with any existing skill. Before writing, check the catalog for trigger overlap and carve clean boundaries.
- Its body is **imperative, ordered, and complete** — a concrete workflow, an explicit quality bar, and an explicit "what NOT to do," with zero filler and no restating of what Claude already knows.
- It is **token-disciplined.** The description loads every session via `get_active_skills`; the body loads on trigger. Make the description as short as unambiguous allows.
- It is **correct and self-contained** — references only real tools, paths, and bundled files; assumes no context it hasn't established.

## Procedure

1. **Find the trigger first.** Before writing a line of body, answer: what exact request should make this fire? Name the concrete signals — file extensions, task verbs, specific artifacts or nouns. If you can't name them precisely, the skill isn't ready to write; press for the real use case.

2. **Check for collisions.** Search the catalog (`browse_skills`) for skills whose triggers could fire on the same request. Carve a boundary and write it into both descriptions as negative scope. A new skill that steals an existing skill's territory is a defect, not a feature.

3. **Write the description — trigger first.** Open with *when to activate*: "Use when…" front-loading concrete user-side triggers (file types, task verbs, named artifacts), phrased about the *user's request or situation*, not what the skill does internally. Then, in as few words as unambiguous allows, say what the skill produces. Append negative scope ("Do NOT use when… — use X instead") wherever a misfire into a named neighbor is plausible.

4. **Write the body — imperative throughout.** A numbered, ordered workflow, not a list of principles. State the quality bar explicitly (what "done well" looks like). Close with a "What NOT to do" section naming the real failure modes. Add examples only where they disambiguate a genuine ambiguity — never as decoration. Cut anything Claude already knows.

5. **Set name and slug.** `name` in Title Case; slug in kebab-case matching the directory and the dominant noun in the name. Keep canonical casing for tool and framework names. Match the frontmatter and body structure of the existing in-house set so the catalog reads as one voice.

6. **Self-check before handing off.** Re-read the description cold: would it fire on the right request and stay silent on a near-miss? Re-read the body: is every line load-bearing? Then state that the new skill is ready for a Skill Auditor pass before publishing.

## Output

Deliver a single committable `SKILL.md` — valid frontmatter (`name`, `description`) plus an imperative body — at the correct `slug/SKILL.md` path. No commentary baked into the file.

## What NOT to do

- **Don't write the body before the trigger is nailed.** A vague trigger produces a skill that never fires or fires constantly, however good the body.
- **Don't pad.** No preamble, no hedging, no restating general knowledge. If a line doesn't change Claude's behavior, cut it.
- **Don't ship territory collisions.** If a new skill overlaps an existing one, fix the boundary in both descriptions before delivering.
- **Don't put dates, versions, or "latest" in the description or body.** Name frameworks generically and let the body handle version specifics.
- **Don't grade existing skills here.** Reviewing or improving a skill that already exists is Skill Auditor's job — hand off rather than absorbing its scope.
