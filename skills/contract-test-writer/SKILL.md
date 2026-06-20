---
name: Contract Test Writer
description: Write consumer-driven contract tests at service and API boundaries so an incompatible change fails a build instead of breaking integrations silently in production. Use when a client and a service (or two services) must stay in sync across separate deploys — adding a Pact consumer test, replaying a pact file in provider verification, publishing pacts to a Pact Broker / PactFlow, gating with can-i-deploy, or after a renamed field or changed status code broke a consumer that unit tests passed.
---
# Contract Test Writer

Pin the shape of a network boundary from the consumer's side so a provider change that breaks any deployed consumer fails the build, not production. Do NOT use when defining the API contract from scratch or reviewing its design — use design-api instead; this skill verifies an existing boundary stays compatible, it does not decide what the boundary should be.

## Workflow

1. Confirm it is a real network boundary you do not control end-to-end (cross-service call, client-to-API). For an internal function call inside one deployable, stop — write a unit test instead.
2. Write the consumer test against a mock provider. Declare only the request shape and the exact response fields the consumer reads — never the provider's full schema. Over-specifying makes the provider brittle to harmless additions.
3. Assert type and shape with matchers, not literal values: `like()` for scalars, `eachLike()` for arrays, `term()`/regex for patterns. Pin a literal value only when it is semantically part of the contract (an enum member, a specific status code).
4. For responses that depend on data, declare a coarse, reusable provider state ("user exists") in the consumer test rather than encoding exact rows.
5. Run the consumer test to emit the pact file. Publish it to a Pact Broker or PactFlow tagged with the consumer version and git sha.
6. In the provider's own test suite, replay the pact against the real provider: stand up the endpoint, implement a setup hook for each declared provider state, and verify recorded requests against expectations. A renamed field or changed status code must fail this build.
7. Gate deploys with can-i-deploy, verified against the consumer versions actually running in each environment, so a provider cannot ship a change that breaks a currently-deployed consumer.

## Quality bar

- The contract contains only fields the consumer consumes — nothing the provider happens to return.
- Matchers everywhere except deliberately pinned enums and status codes; zero coupling to fixture values.
- Provider verification runs in the provider's pipeline and fails the build on a breaking change.
- Provider states are coarse and shared; can-i-deploy checks every deployed consumer version, not just main.

## Do NOT

- Do not assert exact field values that are not part of the contract — it produces false breaks on harmless data changes.
- Do not include unread response fields just because the provider returns them.
- Do not verify business correctness, performance, or auth flows here — keep logic in unit tests and critical journeys in a thin E2E layer.
- Do not write contract tests for calls inside a single deployable.
- Do not gate deploys against only the latest pact when older consumer versions are still running in an environment.
