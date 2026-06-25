# Telemetry & adoption analytics

First-party, privacy-respecting telemetry on Supabase Postgres. It answers: **who
adopts Skill Me, what they install, and whether they keep using it** — DAU/WAU/MAU,
activation, retention cohorts, the browse→install→active-use funnel, per-skill and
per-pack performance, and growth accounting.

No third-party analytics vendor sits in the hot path. The event stream
(`telemetry_events`) is the source of truth; rollups are materialized views we
control. (Escape hatch: the same stream can be mirrored into PostHog as an
optional downstream sink if analytics velocity ever outweighs ownership — never
as the primary path.)

## Principles

1. **Telemetry never breaks the product path.** Every server emit is
   `void track(...)` — fire-and-forget, time-bounded (`INSERT_TIMEOUT_MS`), and
   swallows all errors. A telemetry outage produces zero user-visible failures.
2. **Server-side first.** The highest-signal events (MCP tool calls, installs,
   ratings, activations) are emitted server-side inside the existing handlers, so
   they need no client trust. Web client tracking is additive, for browsing only.
3. **First-party, Supabase-native.** Events live in our Postgres under RLS.
4. **Privacy by default.** No raw IP, no PII in `properties`/`context`. Coarse geo
   (country/region/**city**, plus an approximate **lat/lng** rounded to 2 decimals
   /~1.1 km for the admin world-map) only, derived server-side from edge headers
   via `lib/telemetry/geo.ts` and attached on every path — web ingest, the signup
   event, and the MCP route (threaded through `ToolContext.context`). The
   coordinates are a network-edge / city-centroid approximation (not device GPS),
   coarsened at capture so a precise point never persists. Emails and usernames
   are **never** written to telemetry; they live only in `auth.users` and are
   joined in at read time for the admin directory (see below).
5. **Idempotent, at-least-once.** Every event carries an `idempotency_key`;
   duplicates are dropped by a unique constraint.

## Architecture

```
MCP tools (server) ─┐
                    ├─ lib/telemetry/track.ts ─→ telemetry_events ─→ rollup MVs ─→ admin (service role)
web client ─ buffer ┘   (service role insert)        (RLS)         (refresh: Vercel Cron)
   lib/telemetry/client.ts ─→ POST /api/telemetry (zod, server-derived identity)
```

- **Taxonomy:** `lib/telemetry/events.ts` — zod schemas are the single source of
  truth; they generate the compile-time `TelemetryEvent` union *and* validate the
  web ingest boundary.
- **Server emitter:** `lib/telemetry/track.ts` — `track(event, opts)` /
  `insertEvents(rows)`. Never throws.
- **Web client:** `lib/telemetry/client.ts` — buffers, flushes on interval and on
  `visibilitychange`/`pagehide` via `sendBeacon`. Persists a first-party
  `anonymous_id` cookie.
- **Ingest:** `app/api/telemetry/route.ts` — zod-validated batch, identity
  resolved server-side, idempotent insert.
- **Schema:** `supabase/migrations/0007_telemetry.sql`.
- **Rollups:** `supabase/migrations/0008_telemetry_rollups.sql`.
- **Refresh:** `app/api/cron/telemetry/route.ts` (Vercel Cron, every 15 min).

## Identity model (important)

MCP — our highest-signal surface — identifies callers by a **text subject**, not
an `auth.users` uuid (see `lib/mcp/oauth.ts`):

| Subject form   | Meaning                  | `user_token`        | `user_id` (derived) |
|----------------|--------------------------|---------------------|---------------------|
| `auth:<uuid>`  | signed-in account        | stored verbatim     | `<uuid>`            |
| `mcp_<uuid>`   | anonymous connector      | stored verbatim     | `null`              |
| legacy token   | older header identity    | stored verbatim     | `null`              |
| web (auth.uid) | signed-in web user       | `null`              | from session        |
| web (anon)     | pre-auth visitor         | `null`              | `null` + `anonymous_id` |

`telemetry_events` therefore stores **both** `user_token` (verbatim subject, the
join key to `public.user_installs`) and `user_id` (the account uuid). `user_token`
is the **primary** identity for MCP; `user_id` is **derived at the schema level**
by a `BEFORE INSERT` trigger (`telemetry_events_set_user_id`) that parses the
`auth:<uuid>` form via `telemetry_user_id_from_token()` — so MCP events land with
their account uuid in the FK column no matter which insert path created them, and
the `auth.users` `ON DELETE CASCADE` reaches them. An explicit web `user_id`
(from `auth.uid()`) always wins; anonymous (`mcp_<uuid>`) and legacy tokens leave
`user_id` NULL and remain attributable via `user_token`. The app emitter also
derives `user_id` (defense in depth); the rollups collapse identity to a single
`account_id` via `telemetry_account_id()` (which reuses the same parsing
function) — so a `user_id`-only schema would strand all MCP usage as anonymous,
and this design does not.

`telemetry_identity` stitches a pre-auth web `anonymous_id` to an account at login.

## Event catalog

| Event | Source | Properties | Emitted from |
|---|---|---|---|
| `mcp_session_started` | mcp | `transport`, `client_name?` | `lib/mcp/server.ts` (`initialize`) |
| `mcp_tool_invoked` | mcp | `tool`, `duration_ms`, `ok`, `error_code?` | `lib/mcp/server.ts` (`tools/call`) |
| `skill_browsed` | mcp, web | `query?`, `category?`, `result_count` | `tools/browse.ts` |
| `pack_browsed` | mcp, web | `query?`, `category?`, `result_count` | `tools/browsePacks.ts` |
| `skill_viewed` | web | `skill_id` | web client |
| `skill_installed` | mcp, web | `skill_id`, `via`, `pack_id?` | `tools/install.ts`, `tools/installPack.ts` |
| `skill_uninstalled` | mcp, web | `skill_id` | `tools/uninstall.ts` |
| `pack_installed` | mcp, web | `pack_id`, `skill_count` | `tools/installPack.ts` |
| `skill_rated` | mcp, web | `skill_id`, `rating` | `tools/rate.ts` |
| `collection_managed` | mcp, web | `action`, `collection_id?` | `tools/manageCollections.ts` |
| `skill_activated` | mcp | `skill_id` | `tools/getActive.ts` (per loaded skill) |
| `user_signed_up` | web | `method` | web client (post-signup) |

`skill_activated` is the **true active-use** signal — emitted when an installed
skill is actually loaded into a session, distinct from install. It is
**server-only**; the web ingest rejects it (and all `mcp_*`) so a browser can't
forge active-use. See `WEB_EMITTABLE_EVENTS`.

## How to add a new event

1. Add one entry to `EVENT_SCHEMAS` in `lib/telemetry/events.ts` (name + zod
   property schema). This auto-extends the `TelemetryEvent` union.
2. If the **web client** may emit it, add the name to `WEB_EMITTABLE_EVENTS`.
   Otherwise it stays server-only.
3. Emit it from a real code path: server via `void track({ name, properties }, {
   source, userToken })`; web via `track(name, properties)` from
   `lib/telemetry/client.ts`.
4. If a rollup should use it, reference it in `0008_telemetry_rollups.sql` and add
   a new migration (never edit applied migrations).

## How to read each metric (rollups)

All are materialized views; admin reads go through the service-role client in an
admin-guarded route (`lib/admin.ts`) — they are revoked from anon/authenticated.

- **`mv_active_users_daily`** — `(day, source, dau, wau, mau)`. WAU/MAU are
  trailing 7-/28-day distinct actors. "Actor" = account if known, else
  anonymous_id/token/session.
- **`mv_activation`** — by signup week: `cohort_size`, `activated_users`,
  `activation_rate`, `avg_hours_to_activate`. Activation = first `skill_installed`
  after `user_signed_up`.
- **`mv_retention_weekly`** — `(signup_week, week_offset, cohort_size,
  retained_users, retention_rate)`. `week_offset` 0 = signup week.
- **`mv_install_funnel`** — steps browsed→viewed→installed→activated with
  `actors`, `pct_of_top`, `step_conversion` (vs prior step).
- **`mv_skill_performance`** — per skill: `installs`, `uninstalls`,
  `activating_users`, `avg_rating`, `install_to_activation_rate`.
- **`mv_pack_performance`** — per pack: `installs`, `derived_skill_activations`
  (activations of skills in the pack), `distinct_activating_users`.
- **`mv_growth_accounting`** — monthly `new_users` / `retained_users` /
  `resurrected_users` / `churned_users`.

### v2 rollups (migration `0013`)

Added to surface tool calls, trends and search in the admin dashboard. Same
access model (revoked from anon/authenticated; admin reads via service role) and
refreshed by the same `refresh_telemetry_rollups()`.

- **`mv_tool_performance`** — per MCP tool (`mcp_tool_invoked`): `invocations`,
  `distinct_actors`, `errors`, `error_rate`, `p50_ms`/`p95_ms` latency,
  `invocations_24h`/`invocations_7d`/`invocations_prev_7d` (WoW trend),
  `last_used_at`.
- **`mv_event_volume_daily`** — `(day, event_name, source, events, actors)`. The
  filterable activity timeline; the dashboard re-slices it client-side for the
  range/event/source controls and KPI trend deltas (no per-request DB work).
- **`mv_trending_skills`** — per skill: `installs_7d` vs `installs_prev_7d`
  (`installs_delta`, `installs_growth`), plus `views_7d`, `activations_7d`,
  `actors_7d`. Only rows with recent activity.
- **`mv_trending_packs`** — per pack: `installs_7d` vs `installs_prev_7d` and
  `actors_7d` (packs trend on installs only — `pack_browsed` carries no pack_id).
- **`mv_search_terms`** — normalized browse queries: `searches`,
  `distinct_searchers`, `avg_results`, `zero_result_rate` (a high zero-result
  rate is a direct catalog-gap signal).

### User directory rollup (migration `0015`)

- **`mv_user_directory`** — one row per resolved **actor**, powering the admin
  `/admin/users` tab. An actor is `account` (resolved `auth.users` id — pre-auth
  web events are folded in via `telemetry_identity`), `mcp_anon` (anonymous
  connector token), or `web_anon` (first-party cookie only). Columns: identity
  keys (`user_id`, `user_token`, `anonymous_id`), `first_seen_at`/`last_seen_at`,
  event counts (`total_events`, `mcp_events`/`web_events`, `tool_invocations`,
  `installs`, `activations`, `sessions`), **last-known geo**
  (`last_country`/`last_region`/`last_city` + approximate `last_lat`/`last_lng`
  from the most recent located event = "active from"), and **signup origin**
  (`signup_at`, `signup_method`, `signup_country`/`signup_region`/`signup_city` +
  `signup_lat`/`signup_lng` = "signed up from"). The coordinate columns (added in
  migration `0019`) back the admin world-map and are null for actors whose located
  events predate coordinate capture. Same access model and refreshed by the same
  `refresh_telemetry_rollups()`.

  This is a deliberate, **admin-only** step from aggregate-only telemetry to
  per-user visibility. It still stores **no PII**: emails / display names are
  read live from `auth.users` via the service-role Admin API in
  `getUserDirectory()` (`lib/telemetry/admin-queries.ts`) and joined onto the
  rollup at request time — only behind the `getAdminEmail()` gate, never
  persisted into telemetry tables.

### Geographic adoption rollup (migration `0021`)

- **`mv_geo_adoption`** — one row per location bucket (country + region + city +
  coordinate rounded to 1 decimal) with `events` / `actors` / `installs` /
  `activations` counts, powering the admin `/admin/geography` world-map.
  Aggregate-only (no actor identity). Country totals shade the choropleth (they
  need only the ISO code); the rounded coordinates place the bubbles and are null
  for events that predate coordinate capture. Read by `getGeoAdoption()` (not
  part of `loadTelemetryDashboard`), same admin-only access model, refreshed by
  the same `refresh_telemetry_rollups()`.

### Category usage rollup (migration `0020`)

- **`mv_category_usage_daily`** — day × `category` × event × source counts for
  skill-bearing events (`skill_viewed`/`installed`/`activated`), category resolved
  via `public.skills`. Powers the "Skill categories" panel; the dashboard
  re-slices it client-side by category / event / range / source.

### Why not Vercel Web Analytics as the metrics source

`<Analytics/>` stays mounted for marketing pageviews, but the product metrics
above are deliberately **first-party**: MCP tool calls, installs and activations
happen server-side and never reach a browser, so Vercel Web Analytics literally
cannot see them, and its API is plan-gated and pageview-only. Keep one source of
truth (`telemetry_events` + these rollups) and deep-link to the Vercel dashboard
for raw traffic rather than pulling it in.

### Refresh

`public.refresh_telemetry_rollups()` refreshes all MVs `CONCURRENTLY`. Driven by
Vercel Cron (`/api/cron/telemetry`, every 15 min, `CRON_SECRET`-guarded). To
refresh on demand: `select public.refresh_telemetry_rollups();` (service role).
Alternative: schedule the same RPC with `pg_cron`.

## Retention & deletion policy

- **No PII / no raw IP** is ever stored. `context` holds app version, coarse geo
  (country/region/city + approximate, 2-decimal-rounded lat/lng), and UA family
  only. Emails/usernames are read live from `auth.users` for the admin directory,
  never written to telemetry.
- **Account deletion / erasure:** `public.purge_telemetry_for_user(user_id)` hard-
  deletes every event attributed to the account — both `user_id` rows and MCP rows
  attributed by the `auth:<uuid>` token — plus the identity mapping. The
  `auth.users` FK cascade also removes `user_id` rows automatically on account
  deletion; the function additionally catches the token-only rows.
- **Raw-event retention:** `telemetry_events` is append-only. Define a retention
  window with a scheduled `delete from telemetry_events where occurred_at < now()
  - interval '<N> months'` once volume warrants it; rollups retain the long-range
  aggregates. (Partitioning is documented in `0007` for when volume grows.)

## RLS / access summary

- `telemetry_events`: RLS on. Authenticated users `select` only their own rows
  (`user_id = auth.uid()`). No client insert path — only the service-role ingest
  writes. No anon read.
- `telemetry_identity`: service-role only.
- Rollup MVs + helper views (incl. `mv_user_directory`): revoked from
  anon/authenticated; admin reads via the service-role client behind an
  `isAdmin()` check. The auth.users email/name enrichment for `/admin/users`
  uses the service-role Admin API and is likewise gated by `getAdminEmail()`.
