---
name: Framework Upgrader
description: Drives a major-version framework bump as a sequence of small, reversible, CI-gated PRs using official codemods and changelog diffing while keeping the app green. Use when bumping React, Rails, Spring Boot, Angular, or any framework across a major version with breaking API/config changes; do NOT use for language or runtime version jumps (Python 2 to 3, Node majors, Java LTS) — use language-version-migrator instead.
---
# Framework Upgrader

Treat a major-version framework upgrade as a sequence of small, mergeable, reversible PRs against a green main, driven by the framework's official migration path. A single long-lived upgrade branch is the failure mode.

## Workflow

1. **Diff the changelog into a concrete edit list.** Open the framework's own upgrade guide (React upgrade guide, Rails `rails app:update`, Spring Boot migration notes, Angular `ng update`). Grep your codebase for the removed/renamed APIs, deprecated config keys, and changed defaults the guide names. Produce a checklist of specific edits with file locations — never a vague "upgrade React." Split each item into required-now vs. deferrable-deprecation.
2. **Get green on the current major first.** Confirm the suite passes and clear every deprecation warning on the current version in their own PRs, since most frameworks promote those warnings to errors in the next major. This is the highest-leverage prep step: it shrinks the actual jump to near zero.
3. **Run the official codemods per area, in isolated commits.** Apply the provided transforms (react-codemod / `npx codemod`, Angular `ng update` schematics, OpenRewrite recipes). One area per commit so each diff is reviewable. Write custom jscodeshift/AST transforms for repeated project-specific patterns the official codemods miss.
4. **Review every hunk; codemods are not authoritative.** Read each generated change. Codemods skip dynamic/indirect usages and occasionally rewrite incorrectly. Hand-fix what they missed before the PR lands.
5. **Run old and new side by side where the toolchain allows.** Use the framework's coexistence path (React gradual adoption, Rails dual-boot with a second Gemfile, Angular compatibility modes). Land prep and codemod PRs to main continuously; keep each independently revertible and CI-gated.
6. **Verify beyond compilation.** Run the full suite, smoke-test critical flows, check bundle size and startup time for regressions, and watch error rates on a canary. New majors change defaults (rendering, serialization, timezone, strictness) that pass type checks but alter behavior — diff observable output where you can.
7. **Stop and re-scope a blocked dependency.** If a dependency has no version compatible with the target and no maintained fork, pause. You are now also migrating off that library, which is a separate project — flag it, scope it, and sequence it on its own.

## Quality bar

- Every PR is independently revertible, CI-gated, and small enough to review in one sitting.
- Main stays green at every step; no step depends on an unmerged sibling branch.
- The edit checklist is grounded in the official guide and a codebase grep, not memory.
- Behavior is verified by tests and observable-output diffs, not by "it compiles."

## Do NOT

- Do not hoard changes on one long-lived upgrade branch that drifts from main.
- Do not blind-merge codemod output without reading every hunk.
- Do not bump the version before deprecation warnings on the current major are cleared.
- Do not smuggle a library replacement into the framework bump — split it out.
- Do not treat a passing type check or build as proof of correct runtime behavior.
- Do not handle language/runtime version jumps here (Python 2→3, Node/Java majors); that is language-version-migrator's job.
