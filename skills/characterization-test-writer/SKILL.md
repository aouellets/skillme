---
name: Characterization Test Writer
description: Writes pinning and characterization tests that lock in the current behavior of untested legacy code before a refactor, so any later behavior change trips an alarm. Use when you are about to refactor, rewrite, or modify an untested legacy function/module and need a safety net first, when code has no tests and its "correct" behavior is simply whatever it does today, or when you must capture existing output (bugs included) before touching it. Do NOT use when writing tests for new behavior you are building red-green — use tdd-expert instead; do NOT use to decide which code is worth testing or to rank coverage gaps — use coverage-gap-finder instead.
---
# Characterization Test Writer

Pin what legacy code currently does — bugs included — so a refactor that changes behavior fails loudly instead of silently.

## Workflow

1. Pick the unit and find a seam. Untested legacy code reaches for databases, clocks, network, and globals, so it can't be called in isolation. Introduce the smallest seam that lets you invoke it: extract a method, parameterize a constructor, inject the dependency, or subclass-and-override (the "subclass to sense" technique from Working Effectively with Legacy Code). Do not refactor the body before the net exists.
2. Capture actual output, not expected. Write a deliberately failing assertion (e.g. `assert result == "PLACEHOLDER"`), run it, read the real value from the failure message, and paste it in. You are recording reality, not judging it.
3. Pin output that looks wrong as-is. If the captured value looks buggy, tag it (a comment or test name like `pins_known_bug_*`) so the team decides its fate later, but assert it unchanged. Fixing it now defeats the purpose.
4. Control nondeterminism so output is stable. Freeze time (libfaketime, freezegun, injected Clock), seed RNGs, stub network and I/O, and snapshot DB state. When a value genuinely can't be made deterministic, use golden-master / approval testing (ApprovalTests, snapshot files) to record a full output blob and diff it on every run.
5. Maximize branch coverage fast. Run coverage tooling, see which branches your tests hit, and add cases until every line the upcoming refactor will touch is covered. Use parameterized tests and replay of recorded production inputs to reach edge cases you'd never invent.
6. Make failures legible. Name each test for the behavior it pins (`characterizes_returns_zero_for_empty_cart`, not `test_method_3`) and keep each assertion narrow so a break localizes the regression.

## Quality bar

- Every test asserts a value that was observed from a real run, not one you reasoned to.
- Each code path the refactor will touch is covered before you change a line.
- Nondeterministic inputs are pinned; the suite passes twice in a row with no flakiness.
- A failure message names the changed behavior; one regression breaks one narrowly-scoped test.
- Every pinned-but-suspect output is tagged so a bug is never silently promoted to a requirement.

## Do NOT

- Do NOT assert what the code *should* do — that is a normal unit test, not a characterization test.
- Do NOT fix bugs you discover while pinning; record and tag them, fix them after the net is in place.
- Do NOT perform a large refactor to make code testable before the safety net exists; introduce only the minimum seam.
- Do NOT characterize code you are about to delete, or code already covered by intention-revealing unit tests.
- Do NOT leave these tests forever; they are scaffolding for the refactor and should be replaced with intention-revealing tests once behavior is understood.
