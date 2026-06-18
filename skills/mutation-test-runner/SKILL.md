---
name: Mutation Test Runner
description: Uses mutation testing to expose tests that execute code but assert nothing, and interprets surviving mutants into concrete missing assertions. Use when coverage looks high but you doubt the tests actually catch bugs.
---
# Mutation Test Runner
Mutation testing answers the question coverage cannot: if I deliberately break the code, does a test notice? A surviving mutant is proof that a line is covered but not actually verified.

## How It Works
The tool (Stryker for JS/TS/C#, PIT for JVM, mutmut/cosmic-ray for Python) makes tiny changes — a mutant — to your source: flips > to >=, swaps + for -, replaces a boolean with true, removes a function call, returns null. It reruns the tests against each mutant. A killed mutant means a test failed (good); a surviving mutant means every test still passed despite the broken code (a gap).

## Read Surviving Mutants as Missing Assertions
A survivor names the exact unverified behavior. If changing < to <= survives, your boundary case is untested — add an assertion at the edge. If removing a call survives, no test checks that side effect. If negating a condition survives, both branches are not distinguished. Translate each survivor into one specific assertion, not a vague "add more tests."

## Score and Target
The mutation score is killed / (total non-equivalent mutants). Treat it as a quality signal for already-covered code, far stronger than line coverage. Set a meaningful floor (e.g. 70-80%) on critical modules, not globally. Aim mutation testing at high-risk logic — pricing, permissions, state machines — where a silent bug is expensive.

## Handle Equivalent Mutants
Some mutants do not change observable behavior (e.g. a change inside dead code, or i++ vs ++i in isolation) and can never be killed. These are equivalent mutants and are noise — mark them ignored rather than chasing 100%. Distinguishing them is undecidable in general; use judgment and the tool's ignore config.

## Make It Affordable
Mutation runs are slow because they rerun the suite per mutant. Scope to changed files (Stryker incremental / diff mode) in CI, run the full sweep nightly, and use coverage data so only tests touching a mutated line rerun. Parallelize across cores. Never block every PR on a full-repo mutation run.

## What It Will Not Tell You
Mutation testing measures assertion strength, not whether you tested the right behaviors or the right inputs — a missing feature has no code to mutate. Pair it with risk-based coverage analysis. Skip it on generated code, trivial DTOs, and glue; spend the compute where a silent failure actually hurts.
