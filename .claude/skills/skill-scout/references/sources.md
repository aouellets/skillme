# Source Cookbook

Concrete places to look and exact queries to run. Use these in phase 2 of the scan. The goal is breadth: GitHub alone gives you code but misses the social signal that tells you what people actually want.

## GitHub (primary, structured)

Prefer the REST API — it returns stars, push dates, topics, and license as structured fields, which feeds the scoring rubric directly. The `api.github.com` host is reachable without scraping.

### Search repositories by topic
```
GET https://api.github.com/search/repositories?q=topic:TOPIC&sort=stars&order=desc&per_page=30
```
High-value topics to sweep:
- `claude-skill`, `claude-skills`, `agent-skills`, `anthropic-skills`
- `mcp-server`, `model-context-protocol`, `mcp`
- `claude-code`, `claude-agent`

### Search for recently created, fast-rising repos
```
GET https://api.github.com/search/repositories?q=claude+skill+created:>YYYY-MM-DD&sort=stars&order=desc
GET https://api.github.com/search/repositories?q=mcp+server+pushed:>YYYY-MM-DD&sort=stars&order=desc
```
Set the date to the start of the chosen time window. Sorting by stars on a recent-created filter surfaces momentum, not just legacy size.

### Mine awesome-lists for breadth
Fetch and parse these for candidates the topic search misses:
- `awesome-claude`, `awesome-claude-skills`, `awesome-mcp-servers`, `awesome-claude-code`
Use the GitHub search:
```
GET https://api.github.com/search/repositories?q=awesome+claude+OR+awesome+mcp&sort=stars
```
Treat the list itself as a source to mine, never as a skill to add.

### Per-repo detail (for the quality bar)
```
GET https://api.github.com/repos/OWNER/REPO              -> stars, license, pushed_at
GET https://api.github.com/repos/OWNER/REPO/contents/SKILL.md   -> confirm real skill content
```
If SKILL.md is absent or a stub, mark quality low.

## Product Hunt (launch signal)

Good for packaged, polished tools and for what is getting attention this week. Use web_search then web_fetch:
- `site:producthunt.com claude skill`
- `site:producthunt.com MCP server`
- `producthunt AI agent skills [current month year]`

## Hacker News (technical signal, early)

Often the earliest signal for genuinely novel work. Use web_search:
- `site:news.ycombinator.com claude skills`
- `site:news.ycombinator.com MCP server`
- HN Algolia is fetchable: `https://hn.algolia.com/api/v1/search?query=claude%20skill&tags=story`

## Reddit (demand signal — what people wish existed)

Reddit is where you find gaps: people asking "is there a skill for X." That is a category-gap signal even when no skill exists yet.
- `site:reddit.com/r/ClaudeAI skill`
- `site:reddit.com/r/Anthropic MCP`
- Search r/ClaudeAI, r/Anthropic, r/LocalLLaMA for "skill" and "MCP" threads.

## X / social and blog roundups (zeitgeist)

For named tools and creator buzz that never hits GitHub topics. Use web_search:
- `claude skills trending [current month year]`
- `best claude agent skills [current year]`
- `claude skill marketplace` and creator newsletters / Substack roundups

## Coverage checklist

A complete scan touches: GitHub topic search, GitHub recent-created search, at least one awesome-list, Product Hunt, Hacker News, Reddit, and one social/blog sweep. Record which were covered in the report's "Sources scanned" section so successive runs are comparable and gaps in coverage are visible.
