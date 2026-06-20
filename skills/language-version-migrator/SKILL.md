---
name: Language Version Migrator
description: Ports a codebase across a breaking language or runtime version using compatibility shims, automated transforms, and old-vs-new verification. Use when migrating Python 2 to 3, jumping Node major versions, moving across Java LTS releases, or any runtime upgrade where source must change to keep compiling or behaving correctly. Do NOT use when upgrading an application framework's major version (React, Rails, Spring) — use framework-upgrader instead; and skip this when the runtime change is purely operational (base image, CI matrix, deploy target) with no syntax or semantic breaks.
---
# Language Version Migrator

Port code across a breaking language or runtime version by making it run on both versions first, then flipping the interpreter.

## Workflow

1. **Inventory the breaking surface.** Run the official analyzers — 2to3, python-modernize, pyupgrade for Python; jdeps and the JDK migration guide for Java; Node's deprecation list plus your linter's target-version rule for Node. Produce a categorized list: mechanical (renames, removed syntax), semantic (Python 3 str/bytes split and integer division; Java module system and removed javax APIs; Node ESM/CommonJS and removed globals), and dependency-blocked.
2. **Sequence dependencies before the interpreter.** Resolve the dependency graph for the target runtime first: find compatible versions, upgrade them on the OLD runtime where possible, and flag any library with no compatible release as a separate blocker. Flip the interpreter only once the tree supports it.
3. **Pin behavior where tests are thin.** Add characterization tests on the old runtime first so you can prove behavior is preserved after the move. For data-affecting changes (encoding, numeric, locale), capture real-sample outputs now to diff against later.
4. **Make the code dual-compatible.** Land changes that pass on BOTH runtimes while still on the old interpreter: `__future__` imports or six for Python, conditional polyfills, multi-release JARs for Java. Ship these incrementally. This turns cutover into a flag flip, not a rewrite.
5. **Automate the mechanical, hand-carve the semantic.** Run transforms (2to3, pyupgrade, jscodeshift, OpenRewrite recipes) per module in isolated commits for print, imports, and renames. Read and fix semantic changes by hand — encoding boundaries, division, hash/ordering stability, default charset, timezone handling — because codemods cannot see intent. Treat every I/O and serialization boundary as suspect.
6. **Run both runtimes in CI throughout.** Keep the suite green on old and new until cutover. For data-affecting changes, gate on actual output comparison old-vs-new on real samples, not just pass/fail.
7. **Cut over and remove the shims.** Flip the runtime in CI, confirm green, then delete the compatibility shims in a final pass so they don't ossify.

## Quality bar

- A single codebase passes its full suite on both the old and new runtime before the interpreter is flipped.
- Every automated transform lands in its own reviewable commit, separate from hand-written semantic fixes.
- Encoding, numeric, locale, and serialization changes are validated by diffing real outputs, not by green tests alone.
- Each dependency is either confirmed compatible with the target runtime or recorded as a tracked blocker.

## Do NOT

- Do NOT blind-merge codemod output — review every hunk; transforms miss dynamic usage and rewrite intent wrong.
- Do NOT flip the interpreter before the dependency tree and shims are in place; a big-bang cutover is the failure mode this skill exists to avoid.
- Do NOT trust pass/fail tests for str/bytes, division, charset, ordering, or timezone changes — diff actual outputs.
- Do NOT apply the full codemod ceremony when no source changes are required; an operational-only runtime bump is a config/infra task.
- Do NOT use this for framework major-version upgrades — that is framework-upgrader's job.
