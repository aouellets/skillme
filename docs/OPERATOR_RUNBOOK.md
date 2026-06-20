# Operator Runbook

Everything in the codebase for the connector-directory launch is **shipped and
deployed**. What remains needs a human with access to external accounts
(Cloudflare, Vercel, Supabase, the Anthropic submission portal) — those steps
can't be automated from this repo. This is that list.

Legend: 🟢 automated for you (just run it) · 🟠 operator action required · 🔴 only the account/inbox owner can do it.

---

## 1. Support email forwarding — `support@` / `security@skillme.dev` → iCloud

**Why:** the directory submission needs a support inbox; `SECURITY.md` points at
`security@skillme.dev`. **Domain facts:** `skillme.dev` DNS is on
**Cloudflare** (native Email Routing, free); `skillme.dev` is on Vercel DNS with
no MX, so the email stays on `skillme.dev`. Destination:
`alexander.ouellet@icloud.com`.

### Path A — run the script (recommended)
1. 🟠 Create a Cloudflare API token (My Profile → API Tokens → Create → Custom),
   scoped to the **skillme.dev** zone with:
   - Account → **Email Routing Addresses → Edit**
   - Zone → **Email Routing Rules → Edit**
   - Zone → **DNS → Edit**
2. 🟠 Add it to `.env.local`: `CLOUDFLARE_API_TOKEN=...` (don't commit it).
3. 🟢 `npm run setup:email` — adds the destination, enables Email Routing
   (provisions MX + SPF/DMARC), and creates the `support@` and `security@`
   forward rules. Idempotent; safe to re-run.
4. 🔴 **Click the verification link** Cloudflare emails to
   `alexander.ouellet@icloud.com`. This cannot be automated — Cloudflare requires
   the destination owner to confirm. Forwarding is live within minutes after.

### Path B — Cloudflare dashboard (no token)
🟠 Dashboard → **skillme.dev → Email → Email Routing → Get started** (adds the
DNS records) → **Add destination** `alexander.ouellet@icloud.com` (🔴 verify via
the emailed link) → **Create address** `support@` → forward to iCloud → repeat
for `security@`. Optionally enable a catch-all → iCloud.

### Verify
```
dig +short MX skillme.dev      # expect route1/2/3.mx.cloudflare.net
```
Then send a test email to `support@skillme.dev` and confirm it lands in iCloud.

> **Optional decision:** if you'd rather use `support@skillme.dev` to match the
> app domain, that requires adding MX records on Vercel DNS plus a forwarding
> service (ImprovMX, Forward Email, or moving the zone to Cloudflare). Not set up
> here — the draft and `SECURITY.md` currently use `@skillme.dev`.

---

## 2. Submission-queue admin access — `ADMIN_EMAILS`

🟠 To use the in-app skill-submission review queue, add
`alexander.ouellet@icloud.com` to **`ADMIN_EMAILS`** (comma-separated) in the
Vercel project's environment variables (Production). It's read server-side at
runtime, so it takes effect on the next request — no rebuild required.

---

## 3. Domain / env for `skillme.dev` (mostly done — verify)

Per the project notes, `skillme.dev` is now canonical (Vercel project renamed,
`lib/site.ts` default updated). Because the connector branding is **derived from
`SITE_URL`**, no code change is needed — but confirm the env so the icons,
`websiteUrl`, and `/privacy` URL all resolve to `skillme.dev`:

- 🟠 In Vercel env, `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_MCP_URL` = the
  `skillme.dev` URLs. These are `NEXT_PUBLIC_*` → **inlined at build time**, so a
  fresh production build/redeploy is required for changes to take effect.
- 🟠 Supabase Auth (dashboard): set **Site URL** = `https://skillme.dev` and add
  both `https://skillme.dev/auth/callback` and `http://localhost:3000/auth/callback`
  to the redirect allowlist, or magic-link / GitHub sign-in breaks. Not exposed via
  the Supabase MCP tools.
- 🟠 **Enable the GitHub provider** in Supabase → Authentication → Providers →
  GitHub. If it's left disabled, `/authorize?provider=github` returns
  `400: provider is not enabled` and the user lands on Supabase's raw error page —
  it reads as a broken/404 sign-in. Steps:
  1. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth Apps)
     with **Authorization callback URL** =
     `https://zfbmtnglxksutwjkuoqd.supabase.co/auth/v1/callback`.
  2. Paste its **Client ID** + **Client Secret** into the Supabase GitHub provider
     and toggle it **enabled**. The Client ID is a token like `Ov23li…` / `Iv1…`
     with **no spaces** — a human-readable placeholder (e.g. `skill me db`)
     makes Supabase redirect to GitHub with `client_id=skill+shelf+db`, and GitHub
     returns a **404** (no OAuth app matches). This reads as a broken GitHub
     sign-in even though the provider is "enabled".
  - Verify two hops, not one:
    1. Supabase auth logs: `GET /authorize?provider=github` → `302 "Redirecting
       to external provider github"` (not `400`).
    2. Follow the redirect target — the `client_id=` query param must be the real
       GitHub OAuth App ID, not a placeholder:
       `curl -sI "https://<project-ref>.supabase.co/auth/v1/authorize?provider=github&redirect_to=https://skillme.dev/auth/callback" | grep -i location`

### Verify
```
curl -s -X POST https://skillme.dev/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25"}}' \
  | grep -o 'skillme.dev[^"]*'
```
Expect the `websiteUrl` and icon `src` URLs to read `skillme.dev`.

---

## 4. Claude connector directory submission

All **code and content** is done and verified live: branded `serverInfo.icons`,
all 9 tools annotated, `/privacy` published, `SECURITY.md`, support templates.
Remaining operator actions:

- 🟠 Stand up the `support@` / `security@` inboxes (§1) and paste in the
  auto-responder from `docs/SUPPORT_INBOX.md`.
- 🟠 Test the **`auth: none`** flow end-to-end as a fresh custom connector
  (tokenless/header identity is a known reviewer edge case — be ready to add
  lightweight OAuth/PKCE if asked).
- 🟠 **Verify the current submission entry point** in Anthropic's official docs
  (claude.com → Connectors → submission) — the URLs in the draft are
  lower-confidence.
- 🟠 Submit using the paste-ready fields in
  `docs/CONNECTOR_DIRECTORY_SUBMISSION.md` §1.

---

## Quick reference

| Thing | Value |
|---|---|
| Live app | `https://skillme.dev` (old `skillshelf-ten.vercel.app` still resolves) |
| MCP endpoint | `https://skillme.dev/api/mcp` |
| Email domain | `skillme.dev` (Cloudflare Email Routing) |
| Support / security | `support@skillme.dev` · `security@skillme.dev` → `alexander.ouellet@icloud.com` |
| Repo | `github.com/aouellets/skillme` (MIT) |
| Setup scripts | `npm run setup:email` · `npm run build:catalog` · `npm run build:art` |
