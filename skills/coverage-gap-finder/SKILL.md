---
name: Coverage Gap Finder
description: Produces a risk-ranked list of untested critical paths and branches, with the specific missing cases and the smallest test that buys the most safety. Use when a coverage report shows high line coverage you do not trust, when deciding what to test next, or when auditing a suite before a release cut — anytime the question is "which gap actually matters," not "what is the percentage."
---
Find the untested paths that would actually hurt, ranked by risk — never chase a line-coverage percentage.

Do NOT use when the covered lines run but assert nothing and you need to prove assertion strength — use mutation-test-runner instead. Do NOT use when the goal is to pin the current behavior of untested legacy code before refactoring — use characterization-test-writer instead. This skill decides *what* to test and in what order; those decide *how well* a test asserts and *how* to lock down legacy.

## Workflow
1. Generate a real branch-coverage report — do not prescribe from line coverage. Turn on branch/condition coverage (Istanbul/nyc branches, coverage.py `--branch`, JaCoCo, SimpleCov branch mode) and read the uncovered-branch report. A line with an `if/else` can be 100% line-covered while one branch never runs; compound conditions (`a && b`) need condition coverage to confirm each operand was exercised both ways. If you have no report, get one before continuing.
2. Risk-weight every gap as blast radius × change frequency × ambiguity. Top tier: money movement, auth/authorization, data deletion, migrations. Cross uncovered files against git churn (`git log --format= --name-only | sort | uniq -c | sort -rn`) — recently and frequently changed files with low coverage are the highest-leverage targets. A static config at 0% is fine; a payment splitter at 0% is an incident waiting.
3. For each high-risk path, enumerate the missing cases by reasoning, not by reading the gutter: empty input, null, boundary values (0, -1, max), error/exception paths, timeouts, and concurrent access. Catch blocks and early returns are the most commonly uncovered branches and the ones that fail in production. Coverage tools rarely flag a missing state combination — you must name it.
4. Pick the smallest test that removes the most risk per path, and choose the type deliberately (unit for branch logic, integration for cross-boundary behavior). Order the list so the highest-risk, lowest-cost test comes first.
5. Deliver a ranked plan: path, why it is risky, the specific untested cases, the test type, and the one test to write first. Recommend a coverage floor on the critical modules in CI, not a global percentage target.

## Quality bar
- Every recommendation cites an actual uncovered branch from the report or a named missing case — no "add more tests here."
- The ranking is justified by risk and churn, not by which file has the lowest percentage.
- The top recommendation is the cheapest test with the biggest risk reduction, and you can say why.

## Do NOT
- Do not rank by line-coverage percentage or demand 100% — the last 10% usually tests the least risky code.
- Do not treat high coverage as safety; covered-but-unasserted lines are coverage theater (hand off to mutation-test-runner to confirm assertions).
- Do not flag generated code, trivial getters, framework glue, or one-line pass-throughs as gaps.
- Do not stop short of the risk weighting — an unranked gap list is just the coverage report restated.
- Stop when remaining gaps are low-risk and the cost of the test exceeds the cost of the bug.
