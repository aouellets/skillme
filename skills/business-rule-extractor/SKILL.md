---
name: Business Rule Extractor
description: Reads tangled legacy logic and documents the implicit business rules and edge cases it encodes before a rewrite, so behavior is preserved. Use when you must reimplement or replace code whose real requirements live only in the source.
---
# Business Rule Extractor
In legacy systems the source code IS the specification, and most of it is accidental, not intentional. Before a rewrite you must separate the business rules worth keeping from the bugs everyone now depends on — without that, a 'clean' rewrite silently changes behavior and breaks customers.

## Mine Rules From Conditionals and Constants
The rules hide in branches, guards, magic numbers, and validation. For each conditional, ask 'what business reality does this encode?' A check like amount > 10000 is a rule (large-transaction threshold); a hardcoded date is a rule (a regulation took effect); a special-case branch for one customer ID is a rule someone negotiated. Document each as: trigger condition, action, and the why if discoverable. Magic numbers and string literals are almost always undocumented policy.

## Map the Edge Cases and Their Order
Rules interact. Capture precedence (which discount wins when two apply), short-circuits, fall-through defaults, and the exact handling of nulls, empties, negatives, and boundaries (is it >= or >?). Order of evaluation is itself a rule — reordering 'clean' code can change results. Trace how each input flows to each output and note every place the path forks.

## Separate Intended Rules From Bugs-As-Features
Some behavior is a genuine rule; some is a bug that downstream systems or customers now rely on. You cannot tell from code alone — flag each questionable behavior and confirm with domain experts, support tickets, or data on what actually happens in production. Document the bug-as-feature explicitly so the rewrite team decides consciously whether to preserve or fix it, rather than discovering it in an incident.

## Capture Behavior as Examples, Not Just Prose
For every rule, write concrete input-to-output examples drawn from real data, especially at boundaries. These double as the acceptance tests and characterization tests for the new system. A table of cases is far less ambiguous than 'applies a tiered discount' and survives the reimplementation as an executable contract.

## Trace Data and Cross-Module Coupling
Follow how state is read and mutated across the module — globals, shared tables, session state, side effects in 'getter' code. A rule split across three files is the most dangerous kind because a rewrite naturally reunites them and loses an ordering nuance. Note every external system the logic depends on.

## Where Extraction Stops
Document what the code does, not what you think it should do — design improvements belong to the rewrite phase, not the extraction. If a path is provably dead, note it as dead rather than reverse-engineering a rule for it. Hand off ambiguous behavior as open questions for domain owners rather than guessing intent.
