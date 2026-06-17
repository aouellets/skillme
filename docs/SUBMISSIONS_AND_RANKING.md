# Submissions, Review & Ranking

How skills get into the catalog, how they get promoted, and how to keep it live.

## The flow

```
Submit (in-app form OR GitHub issue/PR)
      │
      ▼
skill_submissions  ──►  automated safety classifier (lib/safety.ts)
   (status: pending)        sets safety_verdict: safe | unsafe | unknown
      │
      ▼
/admin/submissions  ──►  human reviews, then Approve / Request changes / Reject
      │ (approve)
      ▼
public.skills (verified = true)  ──►  ranked on the site
```

- **In-app submit**: `/submit` → `POST /api/submit` → row in `skill_submissions`.
  Honeypot + per-IP rate limit guard against spam. Nothing publishes automatically.
- **Review**: `/admin/submissions` (gated by `ADMIN_EMAILS`). Approving inserts a
  verified row into `skills` and links it back via `published_skill_id`.
- **Bulk import** from GitHub repos still works: `npm run ingest owner/repo …`.

## Ranking

| Shelf / sort | Definition | Source |
|---|---|---|
| **Hot** | Installs in the last 14 days, each weighted by recency (7-day half-life), plus `ln(1+install_count)` baseline | `skills.hot_score` |
| **Trending** | Total install count | `skills.install_count` |
| **Newest** | Recently added | `skills.created_at` |
| **Top Rated** | Average rating | `skills.rating_avg` |
| **Featured** | Hand-picked; ordered by `featured_rank` (nulls last), then installs | `skills.featured` / `featured_rank` |

`hot_score` is recomputed by `public.recompute_hot_scores()`, run hourly by
Vercel Cron via `/api/cron/recompute` (guarded by `CRON_SECRET`). It seeds from
`install_count` on first run so the Hot shelf is never empty.

To feature a skill: approve a submission with "Feature" checked, or set
`featured = true` (and optionally `featured_rank`) directly on the row.

## Setup / keeping it live

1. **Apply the schema/migration** to the SkillShelf Supabase project:
   - Fresh DB: run `supabase/schema.sql` (idempotent).
   - Existing DB: run `supabase/migrations/0001_submissions_and_ranking.sql`.
2. **Seed** the catalog: `npm run db:seed` (and `npm run db:seed-packs`).
3. **Env vars** (see `.env.example`): `SUPABASE_SERVICE_ROLE_KEY`,
   `ANTHROPIC_API_KEY` (enables the auto safety check), `ADMIN_EMAILS`,
   `CRON_SECRET`.
4. Once the `skills` table exists and is non-empty, the site reads from the DB
   instead of the bundled `lib/seed-data.ts` fallback — so new skills go live
   the moment they're approved, no redeploy needed.
