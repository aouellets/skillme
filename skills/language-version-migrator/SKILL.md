---
name: Language Version Migrator
description: Ports a codebase across breaking language or runtime versions using shims, automated transforms, and layered verification. Use when migrating Python 2 to 3, jumping Node majors, moving across Java LTS versions, or any runtime upgrade with breaking syntax or semantics.
---
# Language Version Migrator
A language migration is a contract change against every line you wrote and every dependency you didn't. The winning move is to run on both versions at once for as long as possible, shrinking the leap to a flag flip.

## Inventory the Breaking Surface
Enumerate what actually breaks: removed syntax, changed semantics (Python 3 str/bytes split, integer division; Java module system and removed javax APIs; Node ESM/CommonJS, removed globals). Run the official analyzers — 2to3/python-modernize/pyupgrade, jdeps and the JDK migration guide, Node's deprecation list and your linter's target-version rules. Produce a categorized list: mechanical, semantic, and dependency-blocked.

## Make the Code Dual-Compatible First
The lowest-risk path is code that runs on BOTH old and new before you switch the interpreter. Use compatibility shims (six or __future__ imports for Python; conditional polyfills; multi-release JARs) so a single codebase passes tests on both runtimes. Land these dual-compat changes incrementally on the current version. Cutover then becomes flipping the runtime in CI, not a rewrite.

## Automate the Mechanical, Hand-Carve the Semantic
Run automated transforms (2to3, pyupgrade, jscodeshift, OpenRewrite recipes for Java) per module in isolated commits. These handle print, imports, and renames cleanly. Semantic changes — encoding boundaries, division, hash/ordering stability, default charset, timezone handling — must be read and fixed by hand; codemods cannot see intent. Treat any I/O or serialization boundary as suspect.

## Pin Behavior Before You Move
Where tests are thin, add characterization tests on the old runtime first so you can prove behavior is preserved after. Run the suite on both runtimes in CI throughout the migration. For data-affecting changes (encoding, numeric, locale), compare actual outputs old-vs-new on real samples, not just pass/fail.

## Sequence Dependencies and the Interpreter
A runtime jump usually also forces dependency upgrades. Resolve the dependency graph first: find versions compatible with the target runtime, upgrade them on the old runtime where possible, and identify any library with no compatible release as a blocker to solve separately. Flip the interpreter only when the tree supports it.

## When This Isn't a Code Migration
If the runtime change is mostly operational (base image, CI matrix, deploy target) with no syntax/semantic breaks, this is a config and infra task — skip the codemod ceremony. Reach for this skill when source must change to keep compiling or behaving correctly.
