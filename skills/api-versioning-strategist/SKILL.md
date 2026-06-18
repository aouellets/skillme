---
name: API Versioning Strategist
description: Designs date-pinned or header-based API versioning plus a humane deprecation path, defining what counts as breaking and how long old versions live. Use when launching a public or partner API or making a change that could break existing clients.
---
# API Versioning Strategist

Versioning is a contract with people you'll never meet about changes you haven't designed yet. The strategy that wins lets you evolve the API constantly while never silently breaking an integration that's already in production.

## Know What Counts as Breaking
Breaking: removing or renaming a field or endpoint, adding a required request field, tightening validation, changing a type or enum semantics, or altering error codes clients branch on. Non-breaking: adding optional request fields, adding new response fields, adding endpoints, adding new optional enum values clients are told to tolerate. Make additive changes freely within a version; reserve a new version for genuinely breaking ones. Clients must ignore unknown fields — document this as a tolerant-reader contract.

## Prefer Date-Pinned Versions
For evolving APIs, a date-pinned version (clients send a Version: 2026-01-15 header, the account is bound to a default) scales far better than v1/v2 path bumps. Each dated release is a small, documented set of breaking changes, and the server transforms requests and responses to translate a pinned client up to current internals. This avoids the trap where v2 becomes a years-long parallel rewrite. URI versioning (/v1/) is simplest and most visible but tends toward big-bang jumps; pick it only for coarse, infrequent revisions.

## Translate Between Versions in One Place
Keep one current internal model and apply ordered version-transform shims at the edge to up-convert old requests and down-convert responses. Never fork business logic per version — that multiplies maintenance and bugs. Each shim is small, testable, and independently removable when its version sunsets.

## Deprecate on a Published Timeline
Announce deprecations with a concrete sunset date, not "soon." Emit a Deprecation header and a Sunset header (RFC dates) on responses using a deprecated version, link to migration docs, and give meaningful notice (months for public APIs). Track per-version usage so you know who's still on it and can reach out before you remove it.

## Default Pinned, Never Floating
Bind each integration to a fixed version at onboarding so it never moves under them. Upgrading should be an explicit, opt-in action the client takes after reading a changelog — never an automatic float to latest.

## When to Skip
Internal APIs with one deployable consumer can often skip formal versioning and just coordinate deploys. The full machinery is for public, partner, or independently-deployed clients you can't update in lockstep.
