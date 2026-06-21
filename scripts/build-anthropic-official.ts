/**
 * One-off generator: builds scripts/expansion-data/anthropic-official.json from
 * the official anthropics/skills repo (https://github.com/anthropics/skills).
 *
 * Licensing policy (verified against each skill's LICENSE.txt):
 *  - Apache-2.0 skills  → mirror the real SKILL.md (attribution via source_url
 *    + the upstream `license:` line is preserved in the frontmatter).
 *  - Proprietary skills (docx/pdf/pptx/xlsx, "© Anthropic, all rights
 *    reserved") and unlicensed ones → we DO NOT redistribute the body. We ship
 *    an honest pointer stub (real description + a link to install from source).
 *
 * Run:  npx tsx scripts/build-anthropic-official.ts
 * Then: npm run build:catalog
 */
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, 'expansion-data', 'anthropic-official.json')
const REPO = 'anthropics/skills'
const TREE = `https://github.com/${REPO}/tree/main/skills`

type License = 'apache' | 'proprietary' | 'none'

interface Meta {
  upstream: string // dir name in anthropics/skills/skills
  slug: string // catalog slug (prefixed where it collides with existing entries)
  name: string // display name
  category: 'coding' | 'writing' | 'research' | 'productivity' | 'data' | 'design' | 'business' | 'personal'
  description: string // clean one-line catalog description
  tags: string[]
  license: License
}

// frontend-design is already in the catalog (anthropic-frontend-design) — omitted.
const SKILLS: Meta[] = [
  { upstream: 'algorithmic-art', slug: 'algorithmic-art', name: 'Algorithmic Art', category: 'design',
    description: 'Create generative, algorithmic art with p5.js — flow fields, particle systems, and seeded randomness with interactive parameter exploration.',
    tags: ['generative-art', 'p5js', 'creative-coding', 'design'], license: 'apache' },
  { upstream: 'brand-guidelines', slug: 'anthropic-brand-guidelines', name: 'Anthropic Brand Guidelines', category: 'design',
    description: "Apply Anthropic's official brand colors and typography to any artifact that benefits from the company look-and-feel.",
    tags: ['brand', 'design-system', 'typography', 'anthropic'], license: 'apache' },
  { upstream: 'canvas-design', slug: 'canvas-design', name: 'Canvas Design', category: 'design',
    description: 'Create beautiful visual art in .png and .pdf documents using design philosophy — posters, art, and static pieces.',
    tags: ['poster', 'visual-design', 'pdf', 'art'], license: 'apache' },
  { upstream: 'claude-api', slug: 'claude-api', name: 'Claude API Reference', category: 'coding',
    description: 'Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token counting, and model migration.',
    tags: ['claude', 'api', 'llm', 'reference'], license: 'apache' },
  { upstream: 'doc-coauthoring', slug: 'doc-coauthoring', name: 'Doc Co-Authoring', category: 'writing',
    description: 'Structured workflow for co-authoring documentation, proposals, specs, and decision docs — context gathering, refinement, and reader testing.',
    tags: ['documentation', 'writing', 'collaboration', 'specs'], license: 'none' },
  { upstream: 'docx', slug: 'docx', name: 'Word Documents (docx)', category: 'productivity',
    description: 'Create, read, edit, and manipulate Word (.docx) documents — formatting, tables of contents, tracked changes, comments, and find-and-replace.',
    tags: ['word', 'docx', 'documents', 'office'], license: 'proprietary' },
  { upstream: 'internal-comms', slug: 'internal-comms', name: 'Internal Comms', category: 'writing',
    description: 'Write internal communications — status reports, leadership updates, newsletters, FAQs, incident reports — in the formats teams expect.',
    tags: ['internal-comms', 'status-updates', 'writing', 'business'], license: 'apache' },
  { upstream: 'mcp-builder', slug: 'anthropic-mcp-builder', name: 'MCP Builder (Anthropic)', category: 'coding',
    description: 'Build high-quality MCP servers that let LLMs interact with external services through well-designed tools (Python FastMCP or Node/TypeScript SDK).',
    tags: ['mcp', 'tools', 'integration', 'servers'], license: 'apache' },
  { upstream: 'pdf', slug: 'pdf', name: 'PDF Processing', category: 'productivity',
    description: 'Do anything with PDFs — extract text/tables, merge/split, rotate, watermark, fill forms, encrypt/decrypt, extract images, and OCR scanned files.',
    tags: ['pdf', 'documents', 'forms', 'ocr'], license: 'proprietary' },
  { upstream: 'pptx', slug: 'pptx', name: 'PowerPoint (pptx)', category: 'productivity',
    description: 'Create, read, edit, and combine PowerPoint (.pptx) decks — slides, layouts, templates, speaker notes, and comments.',
    tags: ['powerpoint', 'pptx', 'slides', 'presentations'], license: 'proprietary' },
  { upstream: 'skill-creator', slug: 'anthropic-skill-creator', name: 'Skill Creator (Anthropic)', category: 'productivity',
    description: 'Create, modify, and measure Agent Skills — scaffold a skill from scratch, optimize its triggering description, and benchmark performance.',
    tags: ['skills', 'meta', 'authoring', 'evals'], license: 'apache' },
  { upstream: 'slack-gif-creator', slug: 'slack-gif-creator', name: 'Slack GIF Creator', category: 'design',
    description: 'Create animated GIFs optimized for Slack — constraints, validation tools, and animation concepts for "make me a GIF of X" requests.',
    tags: ['slack', 'gif', 'animation', 'design'], license: 'apache' },
  { upstream: 'theme-factory', slug: 'theme-factory', name: 'Theme Factory', category: 'design',
    description: 'Style artifacts (slides, docs, HTML pages) with a theme — 10 preset color/font themes or generate a new one on the fly.',
    tags: ['theming', 'design-system', 'artifacts', 'branding'], license: 'apache' },
  { upstream: 'web-artifacts-builder', slug: 'web-artifacts-builder', name: 'Web Artifacts Builder', category: 'coding',
    description: 'Build elaborate, multi-component claude.ai HTML artifacts with React, Tailwind, and shadcn/ui — state, routing, and rich UI.',
    tags: ['react', 'artifacts', 'frontend', 'shadcn'], license: 'apache' },
  { upstream: 'webapp-testing', slug: 'webapp-testing', name: 'Web App Testing', category: 'coding',
    description: 'Test local web apps with Playwright — verify frontend behavior, debug UI, capture screenshots, and read browser logs.',
    tags: ['testing', 'playwright', 'qa', 'frontend'], license: 'apache' },
  { upstream: 'xlsx', slug: 'xlsx', name: 'Spreadsheets (xlsx)', category: 'data',
    description: 'Open, read, edit, and create spreadsheets (.xlsx/.csv/.tsv) — formulas, formatting, charts, and cleaning messy tabular data.',
    tags: ['excel', 'xlsx', 'spreadsheets', 'data'], license: 'proprietary' },
]

function fetchSkillMd(upstream: string): string {
  const cmd = `gh api repos/${REPO}/contents/skills/${upstream}/SKILL.md --jq '.content' | base64 -d`
  return execSync(cmd, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
}

/** Honest pointer stub for content we won't redistribute (proprietary / unlicensed). */
function stub(m: Meta): string {
  return `---
name: ${m.upstream}
description: ${m.description}
---

# ${m.name}

This is an official Anthropic skill, distributed by Anthropic in the
[anthropics/skills](${TREE}/${m.upstream}) repository.

Skill Me lists it for discovery and provenance, but does not redistribute its
body${m.license === 'proprietary' ? ' (it is proprietary — © Anthropic, PBC, all rights reserved)' : ' (it ships without an open license upstream)'}.

## Get the full skill

- Install from source: \`npx skills add anthropics/skills\`
- Or browse it directly: ${TREE}/${m.upstream}
- Several Anthropic skills also ship built-in with Claude Code and claude.ai.
`
}

function main() {
  const out = SKILLS.map((m) => {
    let skill_content: string
    if (m.license === 'apache') {
      skill_content = fetchSkillMd(m.upstream)
      if (!skill_content.startsWith('---\n')) throw new Error(`${m.upstream}: unexpected SKILL.md (no frontmatter)`)
    } else {
      skill_content = stub(m)
    }
    return {
      slug: m.slug,
      name: m.name,
      category: m.category,
      description: m.description,
      author: 'Anthropic',
      source_url: `${TREE}/${m.upstream}`,
      tags: m.tags,
      skill_content,
    }
  })
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  const mirrored = SKILLS.filter((m) => m.license === 'apache').length
  console.log(`Wrote ${out.length} Anthropic skills -> ${OUT}`)
  console.log(`  ${mirrored} mirrored (Apache-2.0), ${out.length - mirrored} pointer stubs (proprietary/unlicensed).`)
}

main()
