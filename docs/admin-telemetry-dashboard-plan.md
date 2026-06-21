# Scope: Admin Telemetry Dashboard (single-admin, `aouellets`)

**Status:** PLAN — no feature code written yet. Review before build.
**Goal:** A telemetry dashboard reachable from a top-nav tab that *only appears for me* and renders all seven rollups, gated server-side at every layer (nav, route, data).

This plan is grounded in the existing telemetry system (`docs/telemetry.md`, migrations `0007`/`0008`) and the existing admin pattern (`lib/admin.ts`, `app/admin/*`). Most of the hard infrastructure already exists.

---

## 0. Key findings (what already exists)

- **Admin gating already exists and is in production.** `lib/admin.ts` exposes `getAdminEmail()` / `isAdmin()`, gated on the `ADMIN_EMAILS` env var (comma-separated, lowercased) matched against the signed-in Supabase user's `email`. It already protects `app/admin/packs` and `app/admin/submissions`, and `ADMIN_EMAILS` is already set in `.env.local` and prod.
- **Login is GitHub OAuth *and* email magic-link** (`app/login/LoginForm.tsx`: `signInWithOAuth({provider:'github'})` + `signInWithOtp`). Email is the common denominator across both — GitHub OAuth returns the account's primary verified email (default `user:email` scope).
- **Rollups are locked down by design.** All 7 MVs are `revoke all ... from anon, authenticated` (`0008` lines 388–394). The only function is `refresh_telemetry_rollups()` (service_role only). **There is no read RPC.** The intended read path is the service-role client (which bypasses grants), exactly as the existing admin pages do (`getServiceSupabase()`).
- **MVs already carry display names.** `mv_skill_performance.skill_name` and `mv_pack_performance.pack_name` are materialized in — *no id→name join needed*.
- **Nav is inline in `app/layout.tsx`.** `Header()` (sync) renders the desktop nav (lines 77–95); `MobileTabBar` is a separate component (untracked, on the current branch).
- **No charting dependency** is installed.
- **Theme** is `shelf-*` semantic tokens in `tailwind.config.ts` + `styles/tokens.css`; project rule = no arbitrary Tailwind values, extend the theme.

### Exact rollup shapes (live, confirmed)

| MV | Columns |
|---|---|
| `mv_active_users_daily` | `day, source, dau, wau, mau` |
| `mv_activation` | `signup_week, cohort_size, activated_users, activation_rate, avg_hours_to_activate` |
| `mv_retention_weekly` | `signup_week, week_offset, cohort_size, retained_users, retention_rate` |
| `mv_install_funnel` | `step_order, step, actors, pct_of_top, step_conversion` |
| `mv_skill_performance` | `skill_id, skill_name, installs, uninstalls, activating_users, avg_rating, ratings, install_to_activation_rate` |
| `mv_pack_performance` | `pack_id, pack_name, installs, distinct_installers, derived_skill_activations, distinct_activating_users` |
| `mv_growth_accounting` | `period, new_users, retained_users, resurrected_users, churned_users` |

> Current data note: `mv_activation` and `mv_retention_weekly` are empty (0 rows) because no `user_signed_up` events have landed yet — not a defect. The UI must render empty states for these.

---

## 1. Admin gating — how to identify "me"

### Recommendation: reuse `ADMIN_EMAILS` + `isAdmin()` (don't invent a new mechanism)

It is already the single source of truth for admin in this app, already provisioned in prod, provider-agnostic (works whether I log in via GitHub or magic-link), and server-side. The dashboard should call the *same* `getAdminEmail()`/`isAdmin()` the other admin pages use.

**Tradeoffs vs. the alternatives:**

| Source of truth | Verdict | Why |
|---|---|---|
| **`ADMIN_EMAILS` (email)** ✅ recommended | Use it | Already the app's admin mechanism; provider-agnostic; one place to manage; no schema change. *Caveat:* depends on the Supabase user having a populated `email` (GitHub OAuth provides it with default scope — confirm in Phase 0). |
| GitHub username `user_name` via `user_metadata` | ❌ reject | `user_metadata` is provider-supplied and in some configs user-influenced — **not authoritative for authorization**. Username can also be renamed on GitHub. |
| Supabase auth **uuid** allowlist (`ADMIN_USER_IDS`) | ◐ optional hardening | Most spoof-proof (uuid is immutable, server-issued, never user-editable, survives email changes). Downside: opaque to manage. Good as *defense-in-depth* layered on top of email, not as the primary UX. |

**Decision:** ship on `ADMIN_EMAILS` now. Optionally add a uuid allowlist later (`isAdmin()` would pass if email **or** uuid matches) if we want belt-and-suspenders — small, additive change to `lib/admin.ts`.

### Three independent gates (server-side, not UI-hidden)

1. **Nav tab** — a new async server component `<AdminNav/>` calls `await isAdmin()` and renders the tab or `null`. Dropped into `Header()` in `app/layout.tsx` (`Header` becomes `async`, which is fine for a Server Component child of the Server Component `RootLayout`). Same for the mobile surface if we want it there. *This is cosmetic only* — it hides the link but is not the security boundary.
2. **Route** — `app/admin/telemetry/page.tsx` calls `getAdminEmail()`; if `null`, render the existing "Admin only" fallback (copied from `app/admin/submissions/page.tsx`) and **return before any data fetch**.
3. **Data path** — rollups are read with the **service-role client only inside the gated server component**. The service-role client is `server-only`; it is never handed to a client component and no public API route exposes it.

---

## 2. Data access — how the dashboard reads the rollups

### Recommendation (Option A): service-role reads behind `isAdmin()` — zero new SQL

The MVs are revoked from `anon`/`authenticated`; the service-role key bypasses grants. This is the established pattern (`app/admin/submissions/page.tsx` already does `getServiceSupabase().from(...).select(...)`). Add a typed query module:

```
lib/telemetry/admin-queries.ts   (server-only)
  getActiveUsersDaily()      -> mv_active_users_daily
  getActivation()            -> mv_activation
  getRetentionWeekly()       -> mv_retention_weekly
  getInstallFunnel()         -> mv_install_funnel  (order by step_order)
  getSkillPerformance()      -> mv_skill_performance
  getPackPerformance()       -> mv_pack_performance
  getGrowthAccounting()      -> mv_growth_accounting
  getRollupFreshness()       -> max(received_at) from telemetry_events (proxy for staleness)
```

Each is a `getServiceSupabase().from('mv_*').select('*')` with sane ordering/limits, returning typed rows. The page fetches them in parallel via `Promise.all`.

**What's already there vs. what to add:**
- ✅ Already there: all 7 MVs, the service-role client (`getServiceSupabase`), the admin gate, the cron refresh.
- ➕ To add: the `admin-queries.ts` module + row types (TypeScript only, no SQL).
- ➕ Optional: a "last refreshed" signal. The MVs have no `refreshed_at`. Cheapest is to show `max(received_at)` from `telemetry_events` as "data through". A cleaner option is a tiny `telemetry_rollup_meta(refreshed_at)` table written at the end of `refresh_telemetry_rollups()` — defer unless we care about exact refresh time.
- ➕ Optional: a **"Refresh now"** server action calling `refresh_telemetry_rollups()` via the service-role client (already granted to `service_role`), gated by `isAdmin()`.

### Option B (rejected for now): `SECURITY DEFINER` read RPCs granted to `authenticated`

Define 7 definer functions that internally check the caller is an admin, granted to `authenticated`, called via the anon/SSR client. More DB-native least-privilege and avoids using the service-role key for reads — but it requires 7 RPCs **plus an in-DB notion of "who is admin"** (an admin table or hardcoded uuid), which duplicates the env-based gate. Overkill for a single-user dashboard. Revisit only if we ever want multiple admins reading rollups through RLS rather than env.

---

## 3. Routes & UI

### Location & fetching
- **Route:** `app/admin/telemetry/page.tsx` — async Server Component, `export const dynamic = 'force-dynamic'`, `metadata.robots = { index:false, follow:false }` (matches existing admin pages).
- **Flow:** `getAdminEmail()` gate → if admin, `Promise.all([...admin-queries])` → pass plain serialized rows to presentational components. All fetching is server-side; client components (if any) receive only aggregate, non-PII data as props.
- **Layout:** single scrollable page with sectioned cards (or light in-page anchors). Header strip shows `Admin · <email>` and "data through <timestamp>" + optional Refresh button (mirrors the submissions page header).

### Per-metric rendering

| Section | Source | Render |
|---|---|---|
| **DAU / WAU / MAU** | `mv_active_users_daily` | Three headline stat cards (latest day) + a per-day bar trend, split/toggled by `source` (mcp vs web). |
| **Activation** | `mv_activation` | Stat: overall activation rate + `avg_hours_to_activate` (as "time to activate"); small per-cohort table. Empty state until signups exist. |
| **Retention cohorts** | `mv_retention_weekly` | Cohort **heat grid**: rows = `signup_week`, cols = `week_offset`, cell = `retention_rate` shaded via theme tokens. Empty state for now. |
| **Browse → install → activate funnel** | `mv_install_funnel` | Horizontal funnel ordered by `step_order`; bar width = `pct_of_top`, label each step's `actors` and `step_conversion` drop-off. |
| **Per-skill performance** | `mv_skill_performance` | Sortable table: `skill_name`, installs, uninstalls, activating_users, avg_rating (+ratings count), install→activation rate. |
| **Per-pack performance** | `mv_pack_performance` | Table: `pack_name`, installs, distinct_installers, derived_skill_activations, distinct_activating_users. |
| **Growth accounting** | `mv_growth_accounting` | Stacked bars per `period`: new / retained / resurrected / churned. |

### Charting decision
- **Recommended: dependency-free, server-rendered.** Tables + CSS/SVG bars and a heat grid built from `<div>`/`<svg>` using `shelf-*` tokens. Data volume is tiny, everything stays a Server Component, and it fully honors "no arbitrary Tailwind values." New colors (funnel scale, heatmap ramp, the four growth categories) are added as **semantic tokens** in `tokens.css` + `tailwind.config.ts` — not arbitrary hex.
- **Alternative:** add `recharts` for richer/interactive charts. Tradeoff: client bundle + `'use client'` wrappers (data still fetched server-side and passed as props, so the gate is unaffected). Defer unless interactivity is wanted.

---

## 4. Security review

| Vector | Outcome | Mechanism |
|---|---|---|
| Anon hits `/admin/telemetry` | "Admin only" page, **no data fetched** | `getAdminEmail()` returns `null`; fetch happens only after the gate |
| Logged-in non-admin hits the route | Same "Admin only" page | email not in `ADMIN_EMAILS` |
| Anon/authenticated query the MVs directly (PostgREST/SQL) | Permission denied | `revoke all ... from anon, authenticated` on every MV (`0008`) |
| Anyone calls a rollup RPC | N/A | no read RPC exists; `refresh_telemetry_rollups()` is `revoke from public`, `service_role` only |
| Client-side bypass | Not possible | service-role client is `server-only`; only aggregate rows cross to the client as props; no public API surface added |
| Search indexing | Blocked | `robots: noindex` on the route |
| PII leakage to client | None | rollups are aggregates; skill/pack rows keyed by id+name only — no user identifiers |

**Residual notes:**
- The nav tab hiding is cosmetic; the real boundary is the route gate + DB grants (both server-side). ✅
- If a "Refresh now" action is added, it must also be `isAdmin()`-gated (it triggers a `SECURITY DEFINER` refresh).
- Edge case by design: an admin who signs in via a provider with no email would be locked out (acceptable; or add the optional uuid allowlist).
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is present in prod (memory says yes) — without it, `getServiceSupabase()` returns null and the dashboard shows empty, never errors.

---

## 5. Effort estimate & phasing

| Phase / PR | Scope | Size |
|---|---|---|
| **Phase 0 — prereq check** | Confirm GitHub OAuth populates `email` on the Supabase user and that email is in prod `ADMIN_EMAILS`; confirm service-role key in prod. | ~0 (verification) |
| **PR1 — gate + nav + route skeleton** | Async `<AdminNav/>` in `Header()` (and mobile surface if desired); `app/admin/telemetry/page.tsx` with `getAdminEmail()` gate, "Admin only" fallback, `noindex`, empty shell. | **S** (~0.5 day) |
| **PR2 — data layer** | `lib/telemetry/admin-queries.ts` (7 typed service-role reads + freshness) + row types. Bounded `tsc --noEmit`. | **S–M** (~0.5 day) |
| **PR3 — dashboard UI** | Stat cards, funnel, retention heat grid, growth bars, skill/pack tables; theme-token additions; empty states for activation/retention. | **M–L** (~1–2 days) |
| **PR4 (optional) — refresh + polish** | `isAdmin()`-gated "Refresh now" server action → `refresh_telemetry_rollups()`; "data through" indicator; sorting on tables. | **S** (~0.5 day) |

**Rough total: ~2.5–3.5 focused days across 3 (+1 optional) PRs.**

### Dependencies / gaps in the current telemetry layer
- **No read RPC** — intentional; service-role read covers it. No action.
- **No `refreshed_at`** surfaced — use `max(received_at)` proxy, or add a 1-row meta table (optional).
- **`mv_activation` / `mv_retention_weekly` empty** until real signups exist — needs empty-state UI; not a blocker. (`user_signed_up` is already wired in `app/auth/callback`.)
- **id→name** — already solved (names materialized into the MVs).
- **Charting** — decide dependency-free (recommended) vs `recharts` before PR3.
- **Theme** — budget time in PR3 to add semantic tokens for funnel/heatmap/growth colors (no arbitrary values).

---

## Open questions for review
1. **Mobile:** show the admin tab in the desktop header only, or also in `MobileTabBar`? (Recommend desktop-only — it's a personal admin surface.)
2. **uuid allowlist hardening** — add `ADMIN_USER_IDS` now or defer? (Recommend defer; email is sufficient.)
3. **Charting** — dependency-free or pull in `recharts`? (Recommend dependency-free.)
4. **"Refresh now"** button — include in v1 (PR4) or rely on the 15-min cron? (Recommend cron-only for v1, button if it annoys.)
