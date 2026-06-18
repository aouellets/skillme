# Skill Me — Claude Connector Directory submission

Draft package for listing **Skill Me** in Anthropic's Claude connector directory
so it appears with a branded icon (like GitHub / Gmail / Linear) instead of the
generic custom-connector placeholder.

> **Verify the submission channel before relying on it.** As of mid-2026 the
> directory is submitted via the Claude admin settings (Team/Enterprise org) or
> an individual submission form, with escalations to `mcp-review@anthropic.com`.
> Confirm the current entry point in the official docs
> (claude.com → Connectors → "Submit to the directory") before pasting anything.

---

## 1. Listing fields (ready to paste)

| Field | Value |
|---|---|
| **Name** (≤100) | `Skill Me` |
| **Tagline** (≤55) | `Install curated Claude skills and packs in seconds.` |
| **Primary category** | Productivity |
| **Secondary category** | Developer Tools |
| **MCP server URL** | `https://skillme.dev/api/mcp` |
| **Transport** | Streamable HTTP (JSON-RPC 2.0) |
| **Authentication** | `none` — identity is derived from the connection's session headers; no login or API key required |
| **Icon** | `https://skillme.dev/skill-me-icon.svg` (scalable) and `…/skill-me-icon-512.png` (512×512 PNG) |
| **Website / docs** | `https://skillme.dev` · setup guide: `https://skillme.dev/connect` |
| **Source** | `https://github.com/aouellets/skillshelf` (MIT) |
| **Privacy policy** | `https://skillme.dev/privacy` *(must be published — draft in §4)* |
| **Support contact** | `support@skillme.dev` *(set up an inbox)* · GitHub Issues for bug reports |
| **Test account** | None needed — add the connector and call `browse_skills`; all read tools work with no credentials. |

### Description (≤2000 chars)

> **Skill Me is the App Store for Claude skills — install intelligence.**
>
> A *skill* is a small instruction file that teaches Claude to do one job well —
> write a cold email, review SQL for security, plan a sprint, debug a flaky test.
> Skill Me is a curated, safety-reviewed catalog of **363 skills across 47 packs**
> in 8 categories (coding, writing, research, productivity, data, design,
> business, personal), installable directly from inside any conversation — no ZIP
> files, no copy-pasting, no setup.
>
> Connect once and Claude can:
> - **Discover** the right skill or pack for what you're doing (`browse_skills`,
>   `browse_packs`).
> - **Install** a single skill or a whole themed pack (`install_skill`,
>   `install_pack`) — e.g. "Engineering Workflow", "SEO & Organic Growth", or
>   "Personal Operating System".
> - **Auto-load** everything you've installed at the start of every conversation
>   (`get_active_skills`), so your tools are always on hand.
> - **Manage and share** your library — list, uninstall, rate, and build
>   shareable collections (`list_installed`, `uninstall_skill`, `rate_skill`,
>   `manage_collection`).
>
> Every catalog skill is transparent and inspectable (each links to its source),
> and submissions pass a Claude-powered safety classifier before listing. No
> login is required — your installed library follows your connection. Skill Me
> never reads your chats, memory, or uploaded files; it only stores which skills
> and packs you choose to install.
>
> Browse the full catalog at skillme.dev.

*(~1,240 characters — within the 2,000 limit.)*

---

## 2. Tools (with required annotations)

The directory requires every tool to carry `title` plus a `readOnlyHint` /
`destructiveHint` annotation. Proposed classification:

| Tool | Title | Hint | One-line description |
|---|---|---|---|
| `get_active_skills` | Load installed skills | read-only | Returns the full content of every skill the user has installed; called at the start of a conversation. |
| `browse_skills` | Browse skills | read-only | Full-text search across the skill catalog. |
| `browse_packs` | Browse packs | read-only | Search curated multi-skill packs by query or category. |
| `list_installed` | List installed | read-only | Lists the skills currently in the user's library. |
| `install_skill` | Install skill | write (non-destructive) | Adds a skill to the user's library. |
| `install_pack` | Install pack | write (non-destructive) | Installs every skill in a pack. |
| `rate_skill` | Rate skill | write (non-destructive) | Records a 1–5 rating for a skill. |
| `manage_collection` | Manage collection | write (non-destructive) | Creates, edits, and shares personal skill collections. |
| `uninstall_skill` | Uninstall skill | **destructive** | Removes a skill from the user's library. |

> **Code gap:** these annotations are not yet in the tool definitions
> (`lib/mcp/tools/*.ts`). Add `annotations: { title, readOnlyHint }` /
> `{ title, destructiveHint: true }` to each before submitting. (~1 small PR.)

---

## 3. Pre-submission checklist

**Done**
- [x] Streamable HTTP MCP server, live and verified (`/api/mcp`)
- [x] `serverInfo` advertises `title`, `websiteUrl`, and `icons` (SVG + 512 PNG)
- [x] Branded icon assets served over HTTPS
- [x] Public catalog + setup/docs pages live
- [x] Open-source (MIT) for inspectability

**To do before submitting**
- [ ] **Publish a privacy policy** at a public HTTPS URL (draft in §4) — hard requirement
- [ ] **Add tool annotations** (`title` + read-only/destructive hints) to all 9 tools
- [ ] **Stand up a support inbox** (e.g. `support@skillme.dev`)
- [ ] Confirm the **`auth.type: "none"`** flow works end-to-end as a fresh custom connector (tokenless/header-identity is a known reviewer edge case — be ready to add lightweight OAuth/PKCE if asked)
- [ ] Confirm compliance with Anthropic's Usage Policy and Software Directory Policy
- [ ] Verify the **current submission entry point** in official docs

**Nice to have**
- [ ] Also publish to the open MCP registry (`registry.modelcontextprotocol.io`) via the `mcp-publisher` CLI — separate from the Claude directory, broader ecosystem reach.

---

## 4. Privacy policy (draft — publish at `/privacy`)

> **Skill Me — Privacy Policy**
>
> _Last updated: 2026-06-18_
>
> **What Skill Me is.** Skill Me is a catalog of Claude skills you can browse and
> install through an MCP connector. This policy explains what it stores.
>
> **Identity.** Skill Me does not require an account or login. When you connect,
> a stable per-connection token is derived from the session headers your MCP
> client sends. Your installed library is tied to that token. We do not collect
> your name, email, or any profile information through the connector.
>
> **What we store.** Only what is needed to provide the service: which skills and
> packs you install, ratings you submit, and collections you create. This is
> stored in our database (Supabase) keyed to your connection token.
>
> **What we never access.** Skill Me does not read your conversations, Claude
> memory, uploaded files, or any data outside the tool calls you make to it.
> Tools act only on the catalog and your own library.
>
> **Sharing.** We do not sell or share your data. Aggregate, non-identifying
> install and rating counts may be shown publicly in the catalog (e.g. a skill's
> total installs). Collections are private unless you explicitly create a share
> link.
>
> **Retention.** Library, rating, and collection records persist so your skills
> stay installed across sessions. You can remove items at any time
> (`uninstall_skill`, `manage_collection`); removed items are deleted from your
> library. To request full deletion of your connection's data, contact us.
>
> **Third parties.** Hosting and database are provided by Vercel and Supabase.
> The safety classifier used when reviewing submitted skills runs on the
> Anthropic API.
>
> **Contact.** support@skillme.dev

---

## 5. Suggested submission narrative (cover note)

> Skill Me is an open-source (MIT), safety-reviewed catalog of 363 Claude skills
> across 47 packs, delivered as a Streamable HTTP MCP server. It lets Claude
> users discover and install skills and packs from inside any conversation and
> auto-loads their library each session. No login is required; the server never
> accesses chats, memory, or files and stores only the user's chosen library.
> We'd like it listed so users get a trustworthy, branded entry point instead of
> a generic custom connector. Catalog: skillme.dev · Source:
> github.com/aouellets/skillshelf.
