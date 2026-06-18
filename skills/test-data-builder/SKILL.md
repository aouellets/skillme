---
name: Test Data Builder
description: Generates realistic fixtures, factories, and edge-case datasets using the builder pattern while avoiding shared mutable fixtures. Use when tests need domain objects, seed data, or boundary inputs.
---
# Test Data Builder
Good test data makes the intent of a test obvious and isolates each test from every other. Bad test data — a giant shared fixture file — couples every test to one mutable blob.

## Build, Do Not Share
Prefer per-test construction via factories (factory_bot, FactoryBot traits, Fishery, test-data-bot, Mother objects) over static fixture files loaded once. Shared fixtures become an append-only god object: one test tweaks user 7, another test silently depends on the tweak, and order-dependent flakiness follows. Each test should build exactly the objects it needs and own their lifecycle.

## The Builder Pattern
Expose a builder with sensible valid defaults and override only the fields the test cares about. aUser().withRole('admin').build() reads as the test's intent; the reader ignores the twenty irrelevant fields. Defaults must always produce a valid object so unrelated tests do not break when a new required field is added — set it once in the factory.

## Realistic but Deterministic
Use Faker (Faker, faker.js, Bogus) for names, emails, and addresses so tests resemble production data and catch encoding/length bugs. Seed the faker with a fixed seed in CI so a failing run is reproducible. Never let random data make a test pass or fail nondeterministically — randomness is for variety of shape, not for the assertion's truth.

## Edge-Case Datasets
Deliberately build the inputs that break code: empty strings, unicode and emoji, very long strings, leading/trailing whitespace, nulls, zero and negative numbers, max integers, timezone-boundary dates, and duplicate keys. For ranges, generate boundary and just-over-boundary values. Consider property-based generators (Hypothesis, fast-check) for input spaces too large to enumerate.

## Keep Persistence Cheap and Isolated
Build in memory by default; only persist (create vs build) when the test truly needs a row. Wrap DB-touching tests in a transaction rolled back per test so factories never leak state between tests. Avoid sequences that depend on global counters surviving across tests.

## What to Skip
Do not over-engineer builders for a one-field value object — a literal is clearer. Do not build elaborate graphs a test does not assert on; minimal data sharpens intent. Stop when the data needed is obvious from the test body.
