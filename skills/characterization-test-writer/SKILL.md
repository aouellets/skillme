---
name: Characterization Test Writer
description: Writes pinning and characterization tests around untested legacy code to lock in current behavior before refactoring. Use when you need a safety net before changing code that has no tests and whose correct behavior is whatever it currently does.
---
# Characterization Test Writer
A characterization test does not assert what the code should do — it pins what the code currently does, bugs included, so any change you make afterward that alters behavior trips an alarm. It is the seatbelt you fasten before touching legacy code.

## Assert Actual Output, Not Expected Output
The defining move: run the code, observe what it returns, and assert exactly that — even if it looks wrong. The intentional technique is to write a deliberately failing assertion (assert result == 'PLACEHOLDER'), run it, read the actual value from the failure, and paste it in. You are recording reality, not judging it. If output looks buggy, note it for the rewrite phase but pin it as-is; fixing it now defeats the purpose.

## Find a Seam to Call the Code
Untested legacy code usually can't be invoked in isolation — it reaches for databases, clocks, network, globals. Introduce the minimum seam to call it: extract a method, parameterize a constructor, inject the dependency, or use a subclass-and-override (the 'subclass to test' technique from Working Effectively with Legacy Code). Prefer the smallest seam that lets you exercise the unit; avoid large refactors before the net exists.

## Control the Inputs You Can't Predict
Pin nondeterminism so output is stable: freeze time (libfaketime, freezegun, Clock injection), seed RNGs, stub network and I/O, and snapshot the database state. If you can't make it deterministic, capture the variable parts with golden-master/approval testing (ApprovalTests, snapshot files) that record a full output blob and diff against it on every run.

## Maximize Coverage of Branches, Fast
You want breadth before a refactor. Use coverage tooling to see which branches your tests hit, then add cases until the lines you intend to change are covered. Parameterized tests and recorded production inputs (replay real request payloads) cover edge cases you'd never invent. Prioritize the exact code paths the upcoming refactor touches.

## Make Failures Loud and Legible
Name tests so a failure says what behavior changed (characterizes_returns_zero_for_empty_cart), not test_method_3. Keep each assertion narrow so a break localizes the regression. These tests are temporary scaffolding for the refactor — once the code is properly understood and unit-tested, many can be replaced with intention-revealing tests.

## When Not to Characterize
Don't characterize code you're about to delete, or code that's already well unit-tested. Don't let a pinned bug ship as a permanent 'requirement' silently — tag pinned bugs so the team decides their fate. If the code is trivial and obvious, a normal unit test asserting correct behavior is better than pinning.
