# SkillShelf

**The App Store for Claude Skills.**

Install intelligence. Browse curated Claude skills and install them directly from
inside Claude — no technical setup, no ZIP files, no copy-pasting. Connect the
MCP once and your installed skills load automatically in every future session.

[![License: MIT](https://img.shields.io/badge/license-MIT-E8A832.svg)](./LICENSE)

---

## Connect in 30 seconds

1. Go to **claude.ai → Settings → Integrations**
2. Add the MCP URL: `https://api.skillshelf.io/mcp`
3. Say **"show me skills"** in any conversation

Skills you install activate automatically in your next session, across every
conversation. See [the connect guide](https://skillshelf.io/connect) for the
step-by-step.

## Browse the catalog

→ [skillshelf.io](https://skillshelf.io)

## How it works

SkillShelf is a hosted **MCP server** plus a **web catalog**, backed by Supabase.

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

Point `api.skillshelf.io` at the deployment (the MCP route lives at
`/api/mcp`) and set the environment variables in your Vercel project.

## Contributing

Skills are accepted via PR. See [CONTRIBUTING.md](./CONTRIBUTING.md). Every
submitted skill is intended to pass a Claude-powered safety classifier before
merging.

## License

MIT — see [LICENSE](./LICENSE).
