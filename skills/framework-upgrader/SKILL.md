---
name: Framework Upgrader
description: Drives a major-version framework upgrade using codemods, changelog diffing, and incremental PRs while keeping the app green throughout. Use when bumping React, Rails, Spring Boot, Angular, or any framework across a major version with breaking changes.
---
# Framework Upgrader
A major-version upgrade fails when it becomes one giant branch that drifts for months. Treat it as a sequence of small, mergeable, reversible PRs against a green main, driven by the official migration path.

## Read the Migration Guide and Diff the Changelog
Start from the framework's own upgrade guide (React's, Rails' upgrade guide + rails app:update, Spring Boot migration notes, Angular update.angular.io). Extract the breaking changes that actually touch your code — grep for removed/renamed APIs, deprecated config, changed defaults. Build a checklist of concrete edits, not a vague 'upgrade React'. Distinguish required-now changes from deprecations you can defer.

## Get to Green on the Current Version First
Upgrades amplify existing flakiness. Before touching versions, ensure the suite is green and deprecation warnings on the current major are cleared — most frameworks emit warnings that become errors in the next major. Clearing deprecations on the old version in separate PRs is the single highest-leverage prep step; it shrinks the actual jump to almost nothing.

## Run the Official Codemods, Review Every Hunk
Use the provided codemods (React's via npx codemod / react-codemod, Angular ng update schematics, jscodeshift for custom transforms). Run them per-area in isolated commits so the diff is reviewable. Never blind-merge a codemod's output — it will miss dynamic usages and occasionally rewrite wrong. Hand-write transforms with jscodeshift/AST tooling for repeated project-specific patterns the official codemods don't cover.

## Ship Incrementally Behind the Toolchain
Where the framework supports it, run new and old side by side: React's gradual adoption, Rails dual-boot with a second Gemfile, Angular's compatibility modes. Land prep and codemod PRs to main continuously rather than hoarding a long-lived branch. Keep each PR independently revertible and CI-gated.

## Verify Beyond Compilation
Compiling is not working. Run the full test suite, then smoke-test critical flows, check bundle size/startup time for regressions, and watch error rates in a canary. New major versions change defaults (rendering, serialization, timezone, strictness) that pass type checks but change behavior — diff observable output where you can.

## When to Stop and Reassess
If a dependency has no compatible version for the target and no maintained fork, pause: you're now also migrating off that library, a separate project. Don't smuggle a library replacement into the framework bump. Flag it, scope it, sequence it on its own.
