---
name: Flaky Test Detangler
description: Diagnoses the root cause of intermittently failing tests and fixes them at the source instead of retrying. Use when a test passes locally but fails in CI, or fails roughly one run in ten.
---
# Flaky Test Detangler
A flaky test is not random — it is a hidden dependency on something you did not control. Your job is to name that dependency, not to add a retry.

## Reproduce the Flakiness First
Do not theorize on a single failure. Run the suspect test in a loop (100x) and in isolation, then 100x as part of the full suite. If it only fails in the suite, the cause is cross-test contamination. Randomize test order (Jest --shuffle, RSpec --order random, pytest-randomly) and capture the failing seed so the order is reproducible.

## Timing and Async Waits
The top cause is waiting on a fixed sleep instead of a condition. Replace setTimeout/sleep with explicit waits on observable state: Playwright auto-waiting locators and expect.poll, Cypress retry-ability, awaitility in JVM. Never assert immediately after firing an async action. Ban arbitrary sleeps in review.

## Shared Mutable State
Tests that pass alone but fail together share state: a singleton, a module-level cache, a seeded row, an unrolled-back DB transaction, env vars, or the system clock. Each test must set up and tear down its own world. Wrap DB tests in a transaction rolled back per test, or truncate between tests.

## Real Clocks, Network, and Order
Freeze time with fake timers (jest.useFakeTimers, sinon, freezegun) so tests near midnight or DST do not break. Stub outbound HTTP — a test hitting a live endpoint is flaky by definition. Never assume insertion order from a hash, set, or unordered query; sort before asserting.

## Quarantine Policy
Quarantine, do not ignore. Tag a confirmed-flaky test as skipped with a linked ticket and an owner, and a deadline (e.g. 1 week). A quarantined test still runs non-blocking so you collect failure data. Auto-retry in CI is a last-resort bandage that hides cost — track retry rate as a quality metric, never as the fix.

## When to Stop
Fix the root cause when you can name it. If you have looped 500x without a repro and the test guards critical behavior, add structured logging and the failing seed to CI artifacts rather than deleting it. Delete a test only if it asserts nothing meaningful or duplicates coverage.
