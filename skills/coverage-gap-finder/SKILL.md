---
name: Coverage Gap Finder
description: Identifies untested critical paths and branches and prioritizes them by risk rather than chasing a line-coverage percentage. Use when deciding what to test next or auditing a suite before a release.
---
# Coverage Gap Finder
Line coverage tells you what code ran, not what behavior is verified. A 90%-covered codebase can have every dangerous branch untested. Hunt for the gaps that would actually hurt.

## Read Branch and Condition Coverage, Not Lines
A line with an if/else can be 100% line-covered while one branch never executes. Turn on branch coverage (Istanbul/nyc branches, coverage.py --branch, JaCoCo) and read the uncovered-branch report, not the line gutter. Compound conditions (a && b) need condition coverage to confirm each operand was exercised both ways.

## Risk-Weight the Gaps
Not all uncovered code is equal. Score each gap by blast radius x change frequency x ambiguity. Money movement, auth/authorization, data deletion, and migrations are top tier. Cross uncovered lines against git churn — recently and frequently changed files with low coverage are your highest-leverage targets. A static config file at 0% is fine; a payment splitter at 0% is an incident waiting.

## Find the Missing Cases, Not Missing Lines
For each critical function, enumerate behaviors: empty input, null, boundary values (0, -1, max), error/exception paths, timeouts, and concurrent access. Catch blocks and early returns are the most commonly uncovered branches and the ones that fail in production. Coverage tools rarely flag a missing test for a state combination — you must reason about it.

## Beware Coverage Theater
High coverage with weak assertions is worse than honest gaps because it signals false safety. A test that calls a function and asserts nothing covers every line and verifies nothing. Cross-check with mutation testing on hot paths to confirm the covered lines are actually asserted.

## Output a Prioritized Plan
Deliver a ranked list: the path, why it is risky, the specific untested cases, and the test type (unit vs integration). Recommend the smallest test that buys the most risk reduction first. Set a coverage floor on critical modules in CI, not a global percentage target.

## What to Skip
Skip generated code, trivial getters, framework glue, and one-line pass-throughs. Do not demand 100% — chasing the last 10% usually tests the least risky code. Stop when remaining gaps are low-risk and the cost of testing exceeds the cost of the bug.
