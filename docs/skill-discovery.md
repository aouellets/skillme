# Skill discovery & ingest

How new skills get found, vetted, and added to the Skill Me catalog. Two layers,
one shared engine.

## The engine — `lib/ingest.ts`

Every path into the catalog goes through `ingestRepo()`. For a GitHub repo it:

1. **License gate** — reads the repo's SPDX license and rejects anything outside
   `ALLOWED_LICENSES` (MIT, Apache-2.0, BSD-*, ISC, MPL-2.0, Unlicense, CC0).
   Redistributing unlicensed work is a legal risk, so this is a hard stop.
2. **Discovery** — finds every `SKILL.md` in the repo, dedupes agent-runtime
   mirrors (`.claude/`, `.agents/`, `.opencode/`, `plugins/`…), drops a lone root
   `SKILL.md` index when nested skills exist, and filters tooling-about-skills
   noise (`meta/`, `template/`, `create-skill`, `skill-finder`, …).
3. **Safety classify** — runs each `SKILL.md` through the Claude classifier
   (`lib/safety-core.ts`); unsafe skills are skipped.
4. **Upsert** — writes verified skills to Supabase (`onConflict: slug`,
   idempotent). Multi-skill repos can be grouped into a **pack**.

The classifier core lives in `lib/safety-core.ts` (runtime-agnostic) so both tsx
scripts and Next routes share it; `lib/safety.ts` is the `server-only` wrapper
used by the public submit API.

### Classifier credential & model

The classifier uses the official Anthropic SDK and resolves its credential in
this order:

1. `ANTHROPIC_API_KEY` — direct Anthropic, model `claude-opus-4-8`.
2. `AI_GATEWAY_API_KEY` — routed through the Vercel AI Gateway
   (`https://ai-gateway.vercel.sh`), model auto-prefixed to `anthropic/…`.

The model is overridable with `CLASSIFIER_MODEL`. **Note:** the AI Gateway free
tier blocks Opus and Sonnet — only Haiku is available without paid credits. So
when running through the gateway on the free tier, set
`CLASSIFIER_MODEL=claude-haiku-4-5` (Haiku is plenty for this JSON safety +
metadata task). For Opus-grade classification, either top up AI Gateway credits
or set a direct `ANTHROPIC_API_KEY`.

## Layer 1 — manual / seed (CLI)

Run from an environment with `.env.local` (Supabase service key + `ANTHROPIC_API_KEY`):

```bash
npm run ingest -- owner/repo                  # ingest every skill in a repo
npm run ingest -- owner/repo:path/SKILL.md    # ingest one specific skill
npm run ingest -- --dry-run owner/repo        # preview discovery, no writes

npm run scout:seed -- --dry-run               # preview the curated candidate set
npm run scout:seed                            # publish the curated candidate set
```

`scripts/scout-seed.ts` holds the curated candidate list (the Skill Scout Report
picks). Singles become skills; suites become packs. To add a vetted candidate,
append it to the `CANDIDATES` array and re-run, or just `npm run ingest`.

## Layer 2 — weekly automation (hybrid)

The catalog keeps growing on its own through two complementary weekly jobs.

### a) Headless auto-ingest — Vercel cron `/api/cron/scout`

Runs **Mondays 14:00 UTC** (`vercel.json`). Sweeps the GitHub skill topics for
recently-active, permissively-licensed repos the catalog doesn't carry, runs each
through the same engine (license + safety gate), and **auto-publishes** the
survivors. Bounded per run (`MAX_REPOS` × `MAX_SKILLS_PER_REPO`) so one tick can't
flood the catalog or blow the function timeout. Emails an admin digest of what it
published. Protected by `CRON_SECRET`. This is the deterministic, no-judgment half
— it ingests individual skills, not packs.

### b) Judgment report — Claude routine `skill-scout-weekly`

Runs **Mondays 16:00 UTC (9am PT)** as a scheduled cloud agent. Runs the
`skill-scout` skill (`.claude/skills/skill-scout/`): multi-source scan (GitHub,
Product Hunt, HN, Reddit), dedup against the live catalog via the SkillMe MCP,
license check, scoring, and **category-gap analysis** — the nuance a cron can't
do — then emails the ranked report. It does **not** ingest (the cloud session has
no Supabase/Anthropic secrets); it recommends adds and can open a PR appending
candidates to `scripts/scout-seed.ts`.

Manage the routine at <https://claude.ai/code/routines>.

## Required configuration

| Where | Vars |
| --- | --- |
| CLI (`.env.local`) | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` *or* `AI_GATEWAY_API_KEY` (+ `CLASSIFIER_MODEL=claude-haiku-4-5` on the gateway free tier), `GITHUB_TOKEN` (optional, raises rate limits) |
| Vercel cron | `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` *or* `AI_GATEWAY_API_KEY` (+ `CLASSIFIER_MODEL` if on the gateway free tier), `ALERT_EMAIL`/`ADMIN_EMAILS` (digest), `GITHUB_TOKEN` (recommended) |
| Routine | SkillMe + Gmail MCP connectors (attached to the routine) |

> Both weekly jobs check out `main`, so `app/api/cron/scout`, `scripts/scout-seed.ts`,
> and `.claude/skills/skill-scout/` must be merged and deployed before they run.
