---
name: Business Rule Extractor
description: Produces a documented inventory of the implicit business rules, edge cases, and bug-as-feature behaviors that tangled code encodes, with real input-to-output examples, so a rewrite preserves behavior. Use when you are about to rewrite, port, or replace legacy code whose only specification is the source, and you see policy buried in conditionals, magic numbers, hardcoded dates, or per-customer special cases. Do NOT use when you need an executable safety net before refactoring — use characterization-test-writer instead; do NOT use when you need to find service boundaries in a monolith — use monolith-decomposer instead.
---
# Business Rule Extractor

Turn undocumented legacy logic into a written rule inventory so a rewrite preserves behavior instead of silently changing it. The source code is the spec, and most of it is accidental — your job is to surface what it actually does, not what it should do.

## Workflow

1. **Scope the extraction target.** Identify the exact module, files, and entry points to be rewritten. List every external system, shared table, global, and session state the logic touches — a rule split across files is the one most likely to break on rewrite.
2. **Mine rules from conditionals and constants.** For each branch, guard, magic number, string literal, and validation, ask "what business reality does this encode?" `amount > 10000` is a large-transaction threshold; a hardcoded date is a regulation start; a branch on one customer ID is a negotiated exception. Magic numbers are almost always undocumented policy.
3. **Record order and interaction.** Capture precedence (which discount wins when two apply), short-circuits, fall-through defaults, and exact boundary handling of null, empty, negative, and `>` vs `>=`. Evaluation order is itself a rule; note every place an input path forks.
4. **Separate intended rules from bug-as-features.** Code alone cannot tell you which behaviors are deliberate. Flag each questionable behavior and confirm against domain experts, support tickets, or production data. Document bug-as-features explicitly so the rewrite team decides consciously, not in an incident.
5. **Capture each rule as input-to-output examples.** For every rule, record concrete cases from real data, especially at boundaries. A table of cases removes the ambiguity that "applies a tiered discount" leaves behind.
6. **Hand off open questions.** Mark provably dead paths as dead rather than reverse-engineering intent. List behaviors you could not classify as explicit questions for domain owners.

## Quality bar

- Every rule has: trigger condition, action, the "why" if discoverable, and at least one concrete example.
- Every bug-as-feature is labeled as such, with evidence for whether it is relied upon.
- Evaluation order and precedence between interacting rules is written down, not implied.
- A reader who has never seen the code can predict the output for any input in the documented ranges.

## Do NOT

- Do NOT document what the code should do — only what it does. Design improvements belong to the rewrite, not the extraction.
- Do NOT guess intent for ambiguous behavior; hand it off as an open question.
- Do NOT write the pinning or characterization tests here — produce the example tables and defer test authoring to characterization-test-writer.
- Do NOT propose service boundaries or extraction sequencing — defer that to monolith-decomposer.
- Do NOT silently "fix" a behavior you believe is a bug; flag it for a conscious decision.
