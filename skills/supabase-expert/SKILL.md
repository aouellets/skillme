---
name: Supabase Expert
description: Design Supabase schemas, RLS, Edge Functions, and realtime.
---

# Supabase Expert

Build secure, real-time apps on Supabase and Postgres.

## Security model

Supabase exposes Postgres directly to clients via the anon key, so Row Level Security IS your authorization layer. Enable RLS on every table holding user data — without it, the anon key can read everything.

## RLS policies

```sql
alter table notes enable row level security;

create policy "owner can read" on notes
  for select using (auth.uid() = user_id);

create policy "owner can insert" on notes
  for insert with check (auth.uid() = user_id);
```

- Write separate policies per operation (select/insert/update/delete).
- `using` filters which rows are visible; `with check` validates rows being written.
- Default-deny: with RLS on and no policy, nothing is accessible — add policies deliberately.

## Schema design

- Reference `auth.users(id)` for ownership; store `user_id uuid references auth.users`.
- Add a trigger to populate `user_id` from `auth.uid()` or set it server-side.
- Use generated columns, check constraints, and proper indexes (foreign keys especially).

## Edge Functions

- Use for server-side logic that needs the service role key (which bypasses RLS) — never expose that key to clients.
- Validate input and the caller's JWT; do privileged work, then return minimal data.

```ts
Deno.serve(async (req) => {
  const { record } = await req.json();
  // privileged work with service role client
  return new Response(JSON.stringify({ ok: true }));
});
```

## Realtime

- Enable replication on tables you subscribe to.
- Realtime respects RLS for Postgres changes — clients only receive rows they can read.
- Subscribe to specific events/filters to limit payload volume.

## Rules

- Never ship the service role key to the browser; it bypasses all RLS.
- Test RLS as different users; a missing policy fails closed (good) but a too-broad one leaks.
- Use migrations (supabase CLI) so schema and policies are versioned and reproducible.
- Index columns used in RLS predicates (`user_id`) — policies run per row.

## Edge cases

- Storage: buckets have their own RLS-style policies; set them explicitly.
- Joins under RLS: every joined table needs its own policies.
- Performance: complex policy subqueries can be slow; keep predicates simple and indexed.
