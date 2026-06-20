---
name: API Client Generator
description: Generates a typed API client from an OpenAPI/Swagger spec, with a hand-controlled transport wrapper for timeouts, auth, and typed errors. Use when integrating a REST API that ships an openapi.yaml/swagger.json, when generating or regenerating a client from a spec, or when a hand-written client keeps drifting from the upstream contract. Do NOT use when the task is the backoff/retry policy itself — use rate-limit-handler instead; do NOT use for cursor pagination or keeping a local copy in sync — use pagination-and-sync-engineer instead.
---
# API Client Generator

Generate the API surface from the spec so types stay honest, then wrap the generated code in a transport layer you own for resilience.

## Workflow
1. Confirm a spec exists. If the API ships an OpenAPI/Swagger document, generate from it. If there is no spec, or the integration is a single endpoint, hand-write a small typed wrapper with the same transport in step 4 — skip codegen.
2. Generate the client. Run a codegen tool (openapi-typescript-codegen, openapi-generator, oapi-codegen, or equivalent) to produce request methods plus request/response types. Pin the spec by version or hash so an upstream change surfaces as a reviewable diff, not a silent runtime surprise.
3. Treat generated code as a build artifact. Commit it, regenerate it from the pinned spec, and never hand-edit it — edits get clobbered on the next regen.
4. Wrap, don't modify. Inject a custom HTTP transport (the client's configurable fetch/http layer) instead of editing generated files. Put timeouts, auth, default headers, and logging in that one wrapper so every generated call inherits them and the generated layer stays regenerable.
5. Set an explicit per-request timeout in the transport — generated clients usually default to none.
6. Make errors typed. Map non-2xx responses to a discriminated error type — auth (401/403), not-found (404), validation (422), rate-limit (429), server (5xx) — and parse the API's structured error body into a typed shape so callers branch on a tag, not on parsed strings. Never let a non-2xx return a half-empty success object.
7. Centralize config. Hold base URL, auth token refresh, and default headers in one configured instance; don't scatter raw fetch calls across the codebase.
8. Optionally validate critical responses against the schema at runtime so spec drift fails loudly. Generated types describe the contract, not reality.
9. Defer cross-cutting policy. Add the retry/backoff hook point in the transport, but get the backoff policy (exponential backoff, full jitter, Retry-After, retriable status codes, idempotency) from rate-limit-handler. Get cursor pagination and incremental sync from pagination-and-sync-engineer. This skill owns the generated surface and the transport seam, not those policies.

## Quality bar
- Generated files are committed, untouched by hand, and reproducible from a pinned spec.
- Every call goes through one transport with an explicit timeout and typed errors; no raw fetch escapes it.
- Errors are a discriminated union keyed on the failure class, not strings.
- Regenerating from an updated spec produces a clean reviewable diff with zero manual reconciliation.

## Do NOT
- Do NOT hand-edit generated code, or add resilience by patching generated files.
- Do NOT swallow non-2xx into a success-shaped object.
- Do NOT scatter base URL, auth, or headers across call sites.
- Do NOT reach for full codegen on a one-endpoint, spec-less API — hand-write a typed wrapper instead.
- Do NOT re-specify backoff/jitter/Retry-After or pagination/sync logic here — defer to rate-limit-handler and pagination-and-sync-engineer.
