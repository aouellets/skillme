/**
 * Exports every catalog skill that this repo hosts as a standalone, portable
 * `skills/<slug>/SKILL.md` file, so the hosted catalog has verifiable
 * provenance (each skill's `source_url`) and is installable through the normal
 * Claude skills ecosystem (`npx skills add`, plugins, manual copy).
 *
 * "Hosted here" = community/Skill Me–authored skills (see lib/skill-source.ts).
 * Skills with a real external source_url, or attributed to a named external
 * author without a URL, are NOT written here — we don't mirror others' work.
 *
 * This is the single owner of the skills/ directory. Run after
 * build-expansion.ts:  npx tsx scripts/export-skill-files.ts
 */
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_SKILLS } from '../lib/seed-data'
import { isHostedHere } from '../lib/skill-source'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SKILLS_DIR = join(ROOT, 'skills')

const README = `# Skill Me — hosted skills

This directory holds every skill the catalog **hosts itself** as a standalone,
portable \`SKILL.md\` file, one folder per skill (\`skills/<slug>/SKILL.md\`).

## Why this exists

The catalog is served to Claude through the MCP (\`get_active_skills\` returns
\`skill_content\` directly), so installing a skill needs **no repo and no ZIP**.
But publishing the hosted skills as files buys two things the MCP path alone
does not:

1. **Provenance.** Every hosted skill carries a real \`source_url\`
   (\`…/skills/<slug>\`) instead of an unverifiable \`author: "community"\` with no
   link. The safety story depends on skills being inspectable; now they are.
2. **Ecosystem distribution.** These \`SKILL.md\` files are valid for the standard
   Claude skills tooling (\`npx skills add\`, Claude Code plugins, manual copy into
   \`.claude/skills/\`), so the catalog reaches users who never connect the MCP.

Skills with a real external source (e.g. \`anthropics/skills\`) are **not** mirrored
here — their \`source_url\` points at the original.

## Source of truth — do not hand-edit

These files are **generated** from the catalog (\`lib/seed-data.ts\` +
\`lib/seed-data-expansion.ts\`, whose own source is \`scripts/expansion-data/*.json\`).
Regenerate everything with:

\`\`\`bash
npm run build:catalog   # build-expansion.ts (TS) then export-skill-files.ts (MD)
\`\`\`

> One multi-skill repo, not one repo per skill — the Claude skills ecosystem
> supports multi-skill repos (e.g. \`anthropics/skills\`), so a repo-per-skill
> would add overhead with no distribution benefit.
`

function main() {
  const hosted = SEED_SKILLS.filter(isHostedHere)

  if (existsSync(SKILLS_DIR)) rmSync(SKILLS_DIR, { recursive: true, force: true })
  mkdirSync(SKILLS_DIR, { recursive: true })
  writeFileSync(join(SKILLS_DIR, 'README.md'), README)

  for (const s of hosted) {
    const dir = join(SKILLS_DIR, s.slug)
    mkdirSync(dir, { recursive: true })
    // skill_content is already a complete SKILL.md (frontmatter + body).
    const body = s.skill_content.endsWith('\n') ? s.skill_content : s.skill_content + '\n'
    writeFileSync(join(dir, 'SKILL.md'), body)
  }

  const skipped = SEED_SKILLS.length - hosted.length
  console.log(`Exported ${hosted.length} hosted SKILL.md files to skills/.`)
  console.log(`Skipped ${skipped} skills (external source_url or named external author).`)
}

main()
