---
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
- Localize-friendly: avoid idioms and concatenated sentence fragments that break translation.
