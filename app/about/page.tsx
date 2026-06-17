import type { Metadata } from 'next'
import Link from 'next/link'

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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        About
      </p>
      <h1 className="mt-3 font-display text-5xl text-shelf-text-primary">
        The App Store for Claude.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-shelf-text-secondary">
        Claude skills are powerful. Getting them is not. You need to find a GitHub repo,
        read the README, download a file, upload a ZIP, and repeat for every skill
        you want. That is the developer path, it works, but it excludes everyone else.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-shelf-text-secondary">
        Skill Me is the consumer path. Connect once, browse by category, say
        &quot;install it&quot; in plain English. Skills activate in every future conversation.
        No ZIP files. No terminal. No setup.
      </p>

      {/* Key facts */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { stat: '300+', label: 'Curated skills' },
          { stat: 'MIT', label: 'Open source' },
          { stat: 'Free', label: 'Always' },
          { stat: '1 MCP', label: 'Connect once' },
        ].map(({ stat, label }) => (
          <div key={label} className="card p-5 text-center">
            <div className="font-display text-3xl text-accent">{stat}</div>
            <div className="mt-1 text-xs text-shelf-text-tertiary">{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-display text-3xl text-shelf-text-primary">How it works</h2>
        <p className="mt-4 text-shelf-text-secondary">
          Skill Me is a hosted MCP server plus a web catalog. Connect the MCP to
          claude.ai once, it takes about 30 seconds. After that, your installed
          skills automatically load at the start of every Claude conversation via
          the <code className="rounded border border-shelf-border bg-shelf-void px-1.5 py-0.5 font-mono text-sm text-shelf-text-primary">get_active_skills</code> tool.
          You never have to think about it again.
        </p>
        <p className="mt-3 text-shelf-text-secondary">
          The source code is{' '}
          <a
            href="https://github.com/aouellets/skillshelf"
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

      {/* Not affiliated with Anthropic */}
      <section className="mt-10 card border-shelf-border p-5">
        <p className="text-sm text-shelf-text-secondary">
          <strong className="text-shelf-text-primary">Independent project.</strong>{' '}
          Skill Me is not affiliated with, endorsed by, or connected to Anthropic.
          It uses the public MCP standard and the open SKILL.md format.
          Claude® is a trademark of Anthropic.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="font-display text-3xl text-shelf-text-primary">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-8">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-base font-medium text-shelf-text-primary">{q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-shelf-text-secondary">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 card border-accent-border bg-accent-dim p-6">
        <h2 className="text-lg font-medium text-shelf-text-primary">
          Ready to get started?
        </h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Connect the MCP in 30 seconds and start browsing the catalog.
        </p>
        <div className="mt-4 flex gap-3">
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
