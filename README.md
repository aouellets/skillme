# Skill Me

**The App Store for Claude Skills.**

Install intelligence. Browse curated Claude skills and install them directly from
inside Claude — no technical setup, no ZIP files, no copy-pasting. Connect the
MCP once and your installed skills load automatically in every future session.

[![License: MIT](https://img.shields.io/badge/license-MIT-b4f33e.svg)](./LICENSE)

---

## Connect in 30 seconds

1. Go to **claude.ai → Settings → Integrations**
2. Add the MCP URL: `https://skillshelf-ten.vercel.app/api/mcp`
3. Say **"show me skills"** in any conversation

Skills you install activate automatically in your next session, across every
conversation. See [the connect guide](https://skillshelf-ten.vercel.app/connect)
for the step-by-step.

## Browse the catalog

→ [skillshelf-ten.vercel.app](https://skillshelf-ten.vercel.app)

## How it works

Skill Me is a hosted **MCP server** plus a **web catalog**, backed by Supabase.

- The MCP server (`app/api/mcp/route.ts`) speaks JSON-RPC 2.0 over Streamable
  HTTP and exposes five tools:
  - `get_active_skills` — called at the start of every conversation; returns the
    full content of every skill the user has installed.
  - `browse_skills` — full-text search across the catalog.
  - `install_skill` — adds a skill to the user's library.
  - `uninstall_skill` — deactivates a skill.
  - `list_installed` — lists the user's active skills.
- The web catalog (`/`, `/browse`, `/skill/[slug]`, `/connect`) is a browse-only
  companion built with Next.js 15 and the App Router.

User identity is a token derived from the MCP connection headers
(`X-User-Token` / `x-session-id`), so no login is required for the POC.

> The catalog runs without a database too: if Supabase is not configured, the
> site falls back to the bundled seed catalog so you can develop offline.

## Run locally

```bash
git clone https://github.com/aouellets/skillshelf
cd skillshelf
cp .env.example .env.local
# Fill in your Supabase + Anthropic keys (optional — the catalog works without them)
npm install
npm run dev
```

### Set up the database (optional)

1. Create a [Supabase](https://supabase.com) project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add your keys to `.env.local`.
4. Seed the launch skills:

```bash
npm run db:seed
```

### Ingest skills from GitHub (optional)

Pull `SKILL.md` files from public repos, run them through the Claude-powered
safety + metadata classifier, and upsert the safe ones into the catalog:

```bash
npm run ingest anthropics/skills multica-ai/andrej-karpathy-skills
# owner/repo, or owner/repo:path/to/SKILL.md
```

Requires `ANTHROPIC_API_KEY` and Supabase credentials in `.env.local`
(`GITHUB_TOKEN` is optional but raises GitHub rate limits). Skills the
classifier flags as unsafe are skipped, not stored.

### Enable GitHub sign-in (optional)

Web sign-in and the star-rating UI use Supabase Auth with GitHub. It degrades
gracefully when not configured (the Sign in button and ratings simply hide).

1. Create a **GitHub OAuth App** (Settings → Developer settings → OAuth Apps).
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
2. In **Supabase → Authentication → Providers → GitHub**, paste the client ID
   and secret and enable it.
3. Add your site URL and `…/auth/callback` to **Authentication → URL
   Configuration → Redirect URLs**.

The app exchanges the OAuth code at `/auth/callback` and refreshes the session
via `middleware.ts`.

### Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (read-only catalog) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key for installs (MCP writes) |
| `ANTHROPIC_API_KEY` | Used by the ingestion safety classifier (optional) |
| `GITHUB_TOKEN` | Used by the ingestion script (optional) |
| `NEXT_PUBLIC_MCP_URL` | Public MCP endpoint shown in the UI |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata |

## Vercel deployment checklist

After deploying to Vercel, set these environment variables in your Vercel project
dashboard (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (for ingest script) |
| `NEXT_PUBLIC_MCP_URL` | `https://YOUR-DEPLOYMENT.vercel.app/api/mcp` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-DEPLOYMENT.vercel.app` |

> Once you have a custom domain, update `NEXT_PUBLIC_MCP_URL` and `NEXT_PUBLIC_SITE_URL`
> to the custom domain and redeploy.

## Database setup (run once per new Supabase project)

1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase/schema.sql`
3. Run `npm run db:seed` to populate the skill catalog, then
   `npm run db:seed-packs` to populate the curated packs
4. Verify in Supabase Table Editor that the `skills` and `packs` tables have rows

## Tech stack

- **Next.js 15** (App Router, TypeScript strict mode)
- **Supabase** (Postgres, RLS, REST)
- **Tailwind CSS** + CSS custom-property design tokens
- **MCP** over Streamable HTTP
- **Vercel** deployment target

## Deploy

```bash
vercel deploy
```

The app is live at [`skillshelf-ten.vercel.app`](https://skillshelf-ten.vercel.app)
(the MCP route lives at `/api/mcp`). Set the environment variables in your Vercel
project. To serve it from a custom domain, attach the domain in Vercel and update
`NEXT_PUBLIC_MCP_URL` / `NEXT_PUBLIC_SITE_URL` to match, then redeploy.

## Contributing

Skills are accepted via PR. See [CONTRIBUTING.md](./CONTRIBUTING.md). Every
submitted skill is intended to pass a Claude-powered safety classifier before
merging.

## License

MIT — see [LICENSE](./LICENSE).
