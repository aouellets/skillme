# Skill Me — hosted skills

This directory holds every skill the catalog **hosts itself** as a standalone,
portable `SKILL.md` file, one folder per skill (`skills/<slug>/SKILL.md`).

## Why this exists

The catalog is served to Claude through the MCP (`get_active_skills` returns
`skill_content` directly), so installing a skill needs **no repo and no ZIP**.
But publishing the hosted skills as files buys two things the MCP path alone
does not:

1. **Provenance.** Every hosted skill carries a real `source_url`
   (`…/skills/<slug>`) instead of an unverifiable `author: "community"` with no
   link. The safety story depends on skills being inspectable; now they are.
2. **Ecosystem distribution.** These `SKILL.md` files are valid for the standard
   Claude skills tooling (`npx skills add`, Claude Code plugins, manual copy into
   `.claude/skills/`), so the catalog reaches users who never connect the MCP.

Skills with a real external source (e.g. `anthropics/skills`) are **not** mirrored
here — their `source_url` points at the original.

## Source of truth — do not hand-edit

These files are **generated** from the catalog (`lib/seed-data.ts` +
`lib/seed-data-expansion.ts`, whose own source is `scripts/expansion-data/*.json`).
Regenerate everything with:

```bash
npm run build:catalog   # build-expansion.ts (TS) then export-skill-files.ts (MD)
```

> One multi-skill repo, not one repo per skill — the Claude skills ecosystem
> supports multi-skill repos (e.g. `anthropics/skills`), so a repo-per-skill
> would add overhead with no distribution benefit.
