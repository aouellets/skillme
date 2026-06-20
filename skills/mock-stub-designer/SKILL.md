---
name: Mock Stub Designer
description: Designs the minimal set of test doubles for a unit or integration test and decides, per dependency, what to fake versus exercise for real. Use when a test touches an external boundary — an HTTP/third-party API, payment or email/SMS SDK, the database, the filesystem, the system clock, or randomness — or when existing tests over-mock and pass while the system is broken.
---
# Mock Stub Designer
A test double exists to make a test fast, deterministic, and focused — never to mock everything in sight. Over-mocking yields tautological tests that pass against a broken system because they only verify the mocks.

## Workflow
1. **List the dependencies the code under test touches.** For each, classify it: external boundary you do not own (third-party HTTP, payment/email/SMS SDK, clock, randomness, filesystem) versus your own code (domain objects, pure functions, cheap deterministic collaborators).
2. **Decide fake vs real per dependency.** Double only the boundaries you do not own or cannot control. Use the real thing for your own domain objects and deterministic collaborators — mocking them turns the test into a tautology.
3. **Pick the weakest double that works.** Stub for canned query answers; fake (in-memory repository, SQLite) for a working lightweight implementation; spy to record calls on a real object; mock (interaction assertion) only when the interaction *is* the behavior. Prefer stub or fake over mock — mocks couple the test to the call sequence.
4. **Intercept HTTP at the wire, not your client.** Use nock, msw, WireMock, or VCR-style cassettes so serialization and URL building are still exercised. Record real responses once, replay them, and refresh cassettes so they do not drift from the real API.
5. **Inject or freeze time and randomness.** Never call the wall clock or RNG directly in code you want deterministic; inject a clock and a random source, or freeze them (fake timers, freezegun). Real-clock tests are flaky near boundaries and untestable for time logic.
6. **Keep one real integration test as a backstop.** For a critical integration, retain at least one test against a real sandbox dependency so the doubles cannot lie forever.

## Quality bar
- Every double covers a boundary you do not own; nothing internal and deterministic is mocked.
- HTTP is stubbed at the wire layer, not at a hand-mocked client wrapper.
- Time and randomness are injected or frozen, never read live in tested logic.
- A single fake implementation is reused across tests, not re-stubbed per test.
- Interaction assertions (call counts, argument order) appear only where the interaction is the contract.

## Do NOT
- Do NOT mock the unit under test's own domain objects, pure functions, or cheap deterministic collaborators — use them for real.
- Do NOT assert call counts or argument order for harmless internal calls; that breaks on every refactor.
- Do NOT mock three layers deep. If you must, the design is too coupled — report that as the finding instead of papering over it with doubles.
- Do NOT skip the wire layer by mocking your HTTP client; you lose coverage of serialization and URL building.
- Do NOT use when the task is fabricating valid domain/fixture data or object graphs (a `User` with defaults, an `Order` with line items) — use test-data-builder instead. This skill decides *whether and how* to fake a dependency, not how to construct domain values.
