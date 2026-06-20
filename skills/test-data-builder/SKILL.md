---
name: Test Data Builder
description: Builds realistic domain fixtures, factories, and edge-case datasets with the builder pattern and valid defaults. Use when a test needs domain objects, seed data, factories, or boundary/edge-case inputs; do NOT use when a test needs to fake a network call, database, clock, or third-party SDK — use mock-stub-designer instead.
---
# Test Data Builder

Produce per-test domain data that is realistic, deterministic, and isolated, so each test owns exactly the objects it asserts on.

## Workflow

1. **Build per test, never share a global fixture.** Construct the objects each test needs inside that test via a factory or builder (FactoryBot, Fishery, test-data-bot, Mother objects). Do not load one static fixture file for the suite — shared mutable fixtures become an append-only god object where one test's tweak to a record silently couples and flakes another.
2. **Expose a builder with valid defaults; override only what the test cares about.** Write `aUser().withRole('admin').build()` so the intent is the override and the reader ignores the irrelevant fields. Defaults must always produce a valid object: when a new required field is added, set it once in the factory so unrelated tests do not break.
3. **Make data realistic but deterministic.** Use Faker (Faker, faker.js, Bogus) for names, emails, and addresses so fixtures resemble production and surface encoding/length bugs. Seed the faker with a fixed seed in CI so a failing run reproduces. Randomness varies the shape of inputs — it must never decide whether an assertion passes.
4. **Build the inputs that break code.** Deliberately construct empty strings, unicode and emoji, very long strings, leading/trailing whitespace, nulls, zero, negative numbers, max integers, timezone-boundary dates, and duplicate keys. For ranges, build the boundary and the just-over-boundary value. For input spaces too large to enumerate, reach for property-based generators (Hypothesis, fast-check).
5. **Keep persistence cheap and isolated.** Build in memory by default; only persist (`create` vs `build`) when the test needs a real row. Wrap DB-touching tests in a transaction rolled back per test so factories never leak state. Do not rely on sequences or global counters surviving across tests.

## Quality bar

- Every factory's defaults alone produce a valid, persistable object.
- A reader can tell what a test asserts from its overrides without reading the factory.
- The suite passes identically on repeated runs and in any order; no test depends on another's data.
- Edge-case tests name the specific boundary they exercise.

## Do NOT

- Do not build elaborate object graphs a test never asserts on — minimal data sharpens intent.
- Do not wrap a one-field value object in a builder; a literal is clearer.
- Do not let a builder reach across the boundary to fake network, DB clients, clocks, or third-party SDKs — that is mock-stub-designer's job.
- Do not seed randomness from the wall clock or leave it unseeded in CI.
