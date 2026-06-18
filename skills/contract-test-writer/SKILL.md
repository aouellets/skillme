---
name: Contract Test Writer
description: Writes consumer-driven contract tests for service and API boundaries so integrations break loudly at build time instead of silently in production. Use when two services or a client and an API must stay in sync.
---
# Contract Test Writer
A contract test catches the integration break that unit tests miss and end-to-end tests catch too late and too flakily. The consumer declares exactly what it needs; the provider proves it still delivers it.

## Consumer-Driven, Not Schema-Dumped
The consumer writes the contract from how it actually uses the response, not from the provider's full schema. With Pact, the consumer test runs against a mock provider, records the interactions (request shape plus the response fields it reads), and emits a pact file. Only fields the consumer consumes belong in the contract — over-specifying makes the provider brittle to harmless additions.

## Verify on the Provider Side
The pact file is replayed against the real provider in the provider's own test suite. The provider stands up the endpoint, Pact sends each recorded request, and the response is checked against the consumer's expectations. This is where a renamed field or changed status code fails the provider's build — before deploy, not after.

## Match on Type and Shape, Not Exact Values
Use matchers (Pact like(), term()/regex, eachLike() for arrays) so the contract asserts "a string here, an array of these shaped objects there" rather than literal values. Asserting exact values couples the contract to fixture data and produces false breaks. Pin only the values that are semantically part of the contract, such as an enum or a status code.

## Broker and Versioning
Publish pacts to a Pact Broker (or PactFlow) tagged by consumer version and git sha. Gate deploys with can-i-deploy so a provider cannot ship a change that breaks any currently-deployed consumer version. Verify against the consumer versions actually running in each environment, not just main.

## Provider States
When a response depends on data ("user 7 exists"), declare a provider state in the consumer test and implement a matching setup hook on the provider that seeds that precondition. Keep states coarse and reusable; do not encode brittle exact rows.

## What Contract Tests Do Not Cover
They verify the boundary shape, not business correctness, performance, or auth flows — keep unit tests for logic and a thin layer of true E2E for critical journeys. Skip contract tests for internal function calls within one deployable; reserve them for network boundaries you do not control end-to-end.
