---
name: REST API Design
description: Design REST APIs that are consistent, discoverable, and easy to consume.
---
# REST API Design
APIs are products. Design for the consumer, not the implementation.
## Resource naming
- Plural nouns: /users, /orders, /products
- Nested for ownership: /users/{id}/orders
- Avoid verbs in paths — use HTTP methods instead
- Consistent case: kebab-case for multi-word paths
## HTTP methods
- GET: read, idempotent, no body
- POST: create, returns 201 + Location header
- PUT: full replace, idempotent
- PATCH: partial update (JSON Merge Patch or JSON Patch)
- DELETE: remove, idempotent, returns 204
## Status codes (use correctly)
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict
- 422 Unprocessable Entity (semantic errors)
- 500 Internal Server Error (never expose stack traces)
## Error response shape
```json
{
  "error": "validation_error",
  "message": "Email is required",
  "field": "email",
  "request_id": "req_abc123"
}
```
## Versioning: URL path (/v1/) for breaking changes
## Pagination: cursor-based preferred over offset for large datasets
## Filtering: query params (?status=active&sort=created_at:desc)
