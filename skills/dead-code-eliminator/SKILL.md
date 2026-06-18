---
name: Dead Code Eliminator
description: Finds unreachable, unused, and orphaned code with hard evidence and removes it safely without breaking dynamic callers. Use when reducing a bloated codebase, cleaning up after a migration, or before estimating work on an unfamiliar module.
---
# Dead Code Eliminator
Deleting code is the highest-return refactor there is, but 'I can't find a caller' is not proof of death. Gather converging evidence, then remove in reversible steps.

## Demand Converging Evidence, Not One Signal
No single tool is trustworthy alone. Combine static analysis (ts-prune, knip, vulture, deadcode, IDE 'find usages', dependency graphers like madge), production coverage or profiling data over a representative window, and runtime telemetry (was this endpoint hit this quarter?). A symbol is a deletion candidate only when static analysis AND runtime evidence agree. One signal alone produces false positives that take down prod.

## Hunt the Dynamic Callers That Static Tools Miss
The code that bites you is invoked by reflection, string-keyed dispatch, dependency injection, serialization, ORM hooks, cron/queue workers, feature flags, or external API clients. Before deleting, grep for the symbol name as a string, check DI/registry config, search infra repos and other services, and confirm no flag still gates a path to it. Public API surface and library exports are reachable by definition unless you control all consumers.

## Distinguish the Four Kinds of Dead
Unreachable (no path can call it), unused (callable but never called), redundant (duplicates a live path), and dormant-behind-a-flag (a flag that's been off for a year). Each is removed differently: dormant flag code needs the flag retired first; redundant code needs callers repointed. Name which kind you're removing so the removal is correct.

## Remove in Small Reversible Slices
Delete in focused PRs, one cluster at a time, so a regression points to a single change. Delete the code AND its tests, fixtures, config, and flags — leaving orphaned tests is just relocating the dead code. Let CI and type-checking catch broken references the search missed.

## Prove It Stayed Dead
For risky removals, ship behind a soft-delete first: log-and-throw or a flag that disables the path while keeping the code for one cycle. If nothing fires the log in a full business cycle, delete for real. For low-risk leaf code, delete directly and rely on the suite.

## What Not to Touch
Don't delete code you only suspect is dead, public API without consumer proof, or recently added code (it may be ahead of its caller). Don't fold formatting or refactors into a deletion PR. If evidence is ambiguous, mark it deprecated and instrument it rather than guessing.
