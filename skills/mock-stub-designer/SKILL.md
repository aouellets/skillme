---
name: Mock Stub Designer
description: Sets up the right mocks, stubs, and fakes for external dependencies without over-mocking, and decides what to fake versus use for real. Use when a test touches a network call, database, clock, or third-party SDK.
---
# Mock Stub Designer
A test double exists to make a test fast, deterministic, and focused — not to mock everything in sight. Over-mocking produces tests that pass while the system is broken because they only verify the mocks.

## Know the Difference
A stub returns canned answers (query). A mock asserts an interaction happened (command). A fake is a working lightweight implementation (in-memory repository, sqlite). A spy wraps a real object to record calls. Reach for the weakest double that works: prefer a stub or fake over a mock, because mocks couple the test to the implementation's call sequence.

## Fake the Boundary, Not Your Own Code
Mock at the edges you do not own and cannot control: third-party HTTP APIs, payment SDKs, email/SMS, the system clock, randomness, the filesystem. Do not mock your own domain objects or the unit under test's collaborators that are cheap and deterministic — use the real thing so the test exercises real integration. Mocking everything internal turns a unit test into a tautology.

## Stub at the Network Layer
For outbound HTTP, intercept at the wire (nock, msw, WireMock, VCR cassettes) rather than mocking your client wrapper. This verifies your serialization and URL building, which a hand-mocked client skips. Record real responses once, then replay them; refresh cassettes periodically so they do not drift from the real API.

## Make Time and Randomness Injectable
Never call Date.now() or Math.random() directly in code you want to test deterministically — inject a clock and a random source, or freeze them (sinon fake timers, jest.useFakeTimers, freezegun). A test that depends on the real clock is flaky near boundaries and untestable for time-based logic.

## Avoid the Over-Mocking Traps
Do not assert call counts and argument order unless the interaction IS the behavior (e.g., "charge is called exactly once"). Verifying internal call sequences breaks on every harmless refactor. Keep one fake implementation reused across tests instead of re-stubbing the same thing everywhere. If you find yourself mocking three layers deep, the design is too coupled — that is the real finding.

## When to Use the Real Thing
Use real in-memory databases, real serialization, and real pure functions. For a critical integration, keep at least one test that hits a real (sandbox) dependency so your doubles cannot lie forever. Skip doubles entirely when the dependency is fast, deterministic, and side-effect-free.
