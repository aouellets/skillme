---
name: API Client Generator
description: Generates a typed, resilient client from an OpenAPI spec with retries, timeouts, and typed errors baked into the transport layer. Use when integrating a REST API that ships an OpenAPI or Swagger spec.
---
# API Client Generator

A hand-written API client rots the moment the upstream changes and quietly lies about its types. Generate the surface from the spec so it stays honest, then wrap that generated code in a transport layer you control for resilience.

## Generate From the Spec, Don't Hand-Write
If the API ships an OpenAPI/Swagger document, run a codegen tool (openapi-typescript-codegen, openapi-generator, oapi-codegen, etc.) to produce request methods and request/response types. Treat the generated code as a build artifact: regenerate from a pinned spec version, commit the result, and never hand-edit it — edits get clobbered. Pin the spec by version or hash so an upstream change shows up as a reviewable diff, not a silent runtime surprise.

## Wrap, Don't Modify
Generators rarely produce good resilience. Inject a custom HTTP transport (the client's configurable fetch/http layer) rather than editing generated files. Put retries, timeouts, auth, and logging in that one wrapper so every generated call inherits them. This keeps the generated layer pristine and regenerable while you own the cross-cutting behavior.

## Bake In Timeouts and Retries
Set an explicit per-request timeout in the transport — generated clients usually default to none. Add exponential backoff with full jitter on retriable failures (429, 502, 503, 504, connection errors), honor Retry-After, cap attempts, and only auto-retry idempotent methods or calls carrying an idempotency key. Never blindly retry POSTs that cause side effects.

## Make Errors Typed, Not Stringly
Map HTTP failures to a discriminated error type — distinguish auth (401/403), not-found (404), validation (422), rate-limit (429), and server (5xx) so callers branch on a tag instead of parsing strings. Parse the API's structured error body into a typed shape. Never let a non-2xx silently return a half-empty success object.

## Validate Boundaries and Centralize Config
Generated types describe the contract, not reality — optionally validate critical responses against the schema at runtime so spec drift fails loudly. Centralize base URL, auth token refresh, and default headers in one configured instance; don't scatter raw fetch calls across the codebase.

## When to Skip
For a one-endpoint integration or an API with no spec, a small hand-written typed wrapper with the same transport concerns is fine. Reach for full codegen when the surface is broad, evolving, or shared across teams.
