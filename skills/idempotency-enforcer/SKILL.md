---
name: Idempotency Enforcer
description: Adds client-supplied idempotency keys and request deduplication so at-least-once delivery and client retries return the first result instead of double-charging or double-shipping. Use when building a write endpoint that triggers payments, orders, emails, or other non-reversible side effects, or before exposing any unsafe POST behind a retrying client or queue. Do NOT use for inbound third-party webhook handlers whose dedup is keyed on a provider event ID — handle those in your webhook receiver and reference this skill for the storage pattern instead.
---
# Idempotency Enforcer

Make the second arrival of any non-reversible write a no-op that replays the first result.

## Workflow

1. **Require a client-supplied key.** Accept an `Idempotency-Key` header (a client-generated UUID or token) on every unsafe POST. Reject requests missing it with 400 on endpoints where a duplicate causes irreversible harm. Do not derive the key from the payload — two legitimate identical orders must both succeed, so the client owns intent.
2. **Scope the key.** Treat a key as unique per (account/tenant + endpoint + key value). Never share a namespace across tenants or routes, or one user's retry collides with another's.
3. **Bind the key to the request body.** Store a hash of the body with the key. If the same key returns with a different body, respond 422 — that is a client bug, not a retry.
4. **Persist intent atomically, then do the work.** In one transaction, upsert a row keyed on the idempotency key behind a unique constraint (the constraint wins the race), set `status=in_progress`, perform the side effect, then persist the full response (status code + body). The side-effect write and the key write must commit together.
5. **Replay duplicates.** When a key already has a stored response, return it verbatim. While the original is still `in_progress`, return 409 or tell the client to poll — never run the work twice concurrently.
6. **Handle non-transactional side effects.** When the effect is an external call (a charge) that cannot share your transaction, write your key row before calling out, pass the provider's own idempotency key, and on crash reconcile via the provider's status lookup rather than re-issuing the call.
7. **Expire.** TTL keys (24 hours to 7 days is typical), sweep expired rows, and document the window so clients know how long a retry stays safe. Keys are dedup tokens, not an audit log.

## Quality bar

- Every unsafe POST with a non-reversible effect rejects a missing key and replays a duplicate key's stored response byte-for-byte.
- A concurrent duplicate cannot execute the work twice — the unique constraint or `in_progress` state blocks it.
- The side effect and the key record are durable together: no committed charge without a stored key, and no stored key claiming success without the effect.

## Do NOT

- Do not derive the key server-side from the payload alone.
- Do not let `status=in_progress` allow a second concurrent execution.
- Do not split the side effect and the key write into separate transactions when one transaction is possible.
- Do not treat a same-key-different-body request as a retry — return 422.
- Do not keep keys forever; they are short-lived tokens.
- Do not add the machinery to pure reads, full-resource PUTs replacing a resource by ID, or operations already guarded by a unique business constraint (one row per user per day). Add it only where a duplicate costs money, inventory, or notifications.
