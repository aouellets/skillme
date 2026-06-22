import type { Metadata } from 'next'
import Link from 'next/link'
import { getPlatformDemos } from '@/lib/media'
import { getSkills, formatSkillCount } from '@/lib/data'
import { PlatformDemoBlock } from '@/components/PlatformDemoBlock'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Skill Me is an open-source App Store for Claude skills. Built to fill the gap between the Claude skills ecosystem and non-technical users.',
  twitter: { card: 'summary_large_image' },
}

const FAQ = [
  {
    q: 'What is Skill Me?',
    a: 'Skill Me is an open-source marketplace for Claude skills, modular instruction packages that extend what Claude can do. Connect the Skill Me MCP to claude.ai once, then browse and install skills conversationally. Skills activate automatically in every future session.',
  },
  {
    q: 'Is Skill Me affiliated with Anthropic?',
    a: 'No. Skill Me is an independent, open-source project. It uses the public MCP (Model Context Protocol) standard that Anthropic published in 2025. The skills in the catalog are sourced from the community and verified by the Skill Me team, not by Anthropic.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. The catalog, the MCP server, and all skills are free to use. The source code is MIT licensed on GitHub. We may introduce optional paid or premium skill packs in the future, but the core product will remain free.',
  },
  {
    q: 'Is it safe to connect an MCP to Claude?',
    a: 'Skill Me only loads skill content (plain text instructions) into your Claude context. It does not have access to your conversations, files, or Claude account. Every skill in the catalog passes a safety review before publishing, we check for prompt injection, data exfiltration attempts, and hidden instructions. The source code is public so you can audit it yourself.',
  },
  {
    q: 'What is the MCP standard?',
    a: 'MCP (Model Context Protocol) is an open standard published by Anthropic in late 2025. It lets external services add tools and context to Claude conversations. Skill Me uses MCP to inject skill instructions at the start of each session. Many other tools use MCP too, it is the standard way to extend Claude.',
  },
  {
    q: 'Do I need a Claude subscription?',
    a: 'MCP integrations require a claude.ai Pro, Team, or Enterprise plan. Free tier users on claude.ai cannot add MCP integrations. Claude API users can connect Skill Me to their own deployments directly.',
  },
  {
    q: 'How are skills different from the built-in skills in claude.ai?',
    a: 'Claude.ai has a built-in skills UI where you can upload a ZIP file containing a SKILL.md. Skill Me hosts the skills, provides a browse-and-discover experience, and handles installation via conversation, no ZIP files, no technical setup. Think of claude.ai\'s built-in UI as the developer path and Skill Me as the consumer App Store.',
  },
  {
    q: 'Can I submit my own skill?',
    a: 'Yes. Open a GitHub issue using the skill submission template, or submit a pull request adding your skill to the catalog. Every submitted skill passes an automated safety classifier and a manual review before going live.',
  },
  {
    q: 'How do skills activate?',
    a: 'When you start a new Claude conversation, Skill Me\'s get_active_skills tool runs automatically and injects the content of your installed skills into the session context. Claude reads the skill instructions and applies them for the duration of the conversation.',
  },
  {
    q: 'Who built Skill Me?',
    a: 'Skill Me was built by Alexander Ouellet, an AI product executive and engineer. It started as a weekend project to fill the gap between the growing Claude skills ecosystem and non-technical users who had no way to discover or install skills without a technical background.',
  },
]

export default async function AboutPage() {
  const [platformDemo, { total }] = await Promise.all([getPlatformDemos(), getSkills({ limit: 1 })])
  const skillStat = total > 0 ? formatSkillCount(total) : '300+'
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      {/* Hero — single column on mobile, intro + key-facts side by side on lg */}
      <section className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
            About
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-shelf-text-primary sm:text-6xl lg:text-7xl">
            The App Store for Claude.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-shelf-text-secondary">
            Claude skills are powerful. Getting them is not. You need to find a GitHub repo,
            read the README, download a file, upload a ZIP, and repeat for every skill
            you want. That is the developer path, it works, but it excludes everyone else.
          </p>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-shelf-text-secondary">
            Skill Me is the consumer path. Connect once, browse by category, say
            &quot;install it&quot; in plain English. Skills activate in every future conversation.
            No ZIP files. No terminal. No setup.
          </p>
        </div>

        {/* Key facts — 2×2; sits beside the intro on lg, below it on mobile */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { stat: skillStat, label: 'Curated skills' },
            { stat: 'MIT', label: 'Open source' },
            { stat: 'Free', label: 'Always' },
            { stat: '1 MCP', label: 'Connect once' },
          ].map(({ stat, label }) => (
            <div key={label} className="card p-5 text-center">
              <div className="font-display text-3xl text-accent sm:text-4xl">{stat}</div>
              <div className="mt-1 text-xs text-shelf-text-tertiary">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform demo film — capped so it doesn't balloon on wide screens */}
      {(platformDemo.landscape || platformDemo.portrait) && (
        <div className="mx-auto mt-14 max-w-4xl lg:mt-20">
          <PlatformDemoBlock
            landscape={platformDemo.landscape}
            portrait={platformDemo.portrait}
          />
          <p className="mt-3 text-center text-xs text-shelf-text-tertiary">
            SkillMe in 30 seconds — click to play with sound.
          </p>
        </div>
      )}

      {/* How it works + Independent — prose held to a readable measure */}
      <div className="mt-14 grid gap-10 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <section className="max-w-prose">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary sm:text-4xl">
            How it works
          </h2>
          <p className="mt-5 leading-relaxed text-shelf-text-secondary">
            Skill Me is a hosted MCP server plus a web catalog. Connect the MCP to
            claude.ai once, it takes about 30 seconds. After that, your installed
            skills automatically load at the start of every Claude conversation via
            the <code className="rounded border border-shelf-border bg-shelf-void px-1.5 py-0.5 font-mono text-sm text-shelf-text-primary">get_active_skills</code> tool.
            You never have to think about it again.
          </p>
          <p className="mt-4 leading-relaxed text-shelf-text-secondary">
            The source code is{' '}
            <a
              href="https://github.com/aouellets/skillme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover"
            >
              MIT licensed on GitHub
            </a>
            . You can self-host the MCP server, fork the catalog, and run your own
            private instance. The skill format is the open SKILL.md standard supported
            by Claude Code, Cursor, Gemini CLI, and others.
          </p>
        </section>

        {/* Not affiliated with Anthropic — pulled aside on lg as a sidebar note */}
        <section className="card h-fit border-shelf-border p-6 lg:sticky lg:top-24">
          <p className="text-sm leading-relaxed text-shelf-text-secondary">
            <strong className="text-shelf-text-primary">Independent project.</strong>{' '}
            Skill Me is not affiliated with, endorsed by, or connected to Anthropic.
            It uses the public MCP standard and the open SKILL.md format.
            Claude® is a trademark of Anthropic.
          </p>
        </section>
      </div>

      {/* FAQ — two columns on lg so it fills the width and scans quickly */}
      <section className="mt-14 lg:mt-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-shelf-text-primary sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2 lg:gap-y-10">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-base font-medium text-shelf-text-primary">{q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 card border-accent-border bg-accent-dim p-6 sm:p-8 lg:mt-24">
        <h2 className="font-display text-xl font-semibold text-shelf-text-primary sm:text-2xl">
          Ready to get started?
        </h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Connect the MCP in 30 seconds and start browsing the catalog.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/connect" className="btn btn-primary">
            Connect to Claude
          </Link>
          <Link href="/browse" className="btn btn-secondary">
            Browse skills →
          </Link>
        </div>
      </section>
    </div>
  )
}
