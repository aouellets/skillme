import type { Metadata } from 'next'
import Link from 'next/link'
import { CopyButton } from '@/components/CopyButton'
import { SubmitForm } from '@/components/SubmitForm'

export const metadata: Metadata = {
  title: 'Submit a Skill',
  description: 'Add your Claude skill to the Skill Me catalog. Open-source, reviewed, and available to every Skill Me user.',
  twitter: { card: 'summary_large_image' },
}

const TEMPLATE = `---
name: Your Skill Name
description: One sentence, plain English, no buzzwords. (max 25 words)
license: MIT
author: your-github-handle
source_url: https://github.com/you/your-skill
media:
  thumbnail: https://raw.githubusercontent.com/you/your-skill/main/assets/preview.png
  alt: "Short description of what the preview shows"
---

# Your Skill Name

[Instructions here: what Claude should do when this skill is active]
`

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Contribute
      </p>
      <h1 className="mt-3 font-display text-5xl text-shelf-text-primary">
        Submit a skill
      </h1>
      <p className="mt-4 text-lg text-shelf-text-secondary">
        Every skill in the Skill Me catalog started as a community contribution.
        Submit yours and it becomes available to every user, installed in seconds
        from inside Claude.
      </p>

      {/* Primary path — submit directly from the browser */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-shelf-text-primary">
          Submit directly
        </h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Fill this out and your skill enters the review queue immediately. It is
          auto-checked for safety, then a human reviews and publishes it.
        </p>
        <div className="mt-5">
          <SubmitForm />
        </div>
      </section>

      {/* Alternate paths — GitHub */}
      <section className="mt-12">
        <h2 className="text-xl font-medium text-shelf-text-primary">Prefer GitHub?</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-base font-medium text-shelf-text-primary">GitHub issue</h3>
            <p className="mt-2 text-sm text-shelf-text-secondary">
              Open an issue with the submission template and paste your SKILL.md.
              We review and add it within a few days.
            </p>
            <a
              href="https://github.com/aouellets/skillme/issues/new?template=skill_submission.md&title=[SKILL]+Your+Skill+Name"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-4"
            >
              Open GitHub issue →
            </a>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-medium text-shelf-text-primary">Pull request</h3>
            <p className="mt-2 text-sm text-shelf-text-secondary">
              Fork the repo, add your skill to{' '}
              <code className="font-mono text-sm text-accent">lib/seed-data.ts</code>,
              and open a PR. Full control for developers.
            </p>
            <a
              href="https://github.com/aouellets/skillme/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-4"
            >
              Read CONTRIBUTING.md →
            </a>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="mt-12">
        <h2 className="text-xl font-medium text-shelf-text-primary">
          What makes a good skill
        </h2>
        <div className="mt-4 space-y-3">
          {[
            ['Clear job to be done', 'The skill should solve one specific problem, not five vague ones.'],
            ['Transparent instructions', 'Every instruction should be readable and understandable by the user.'],
            ['Genuine utility', 'The skill should save time, improve quality, or enable something new.'],
            ['No hidden behavior', 'No instructions that try to override Claude\'s safety rules, exfiltrate data, or deceive the user.'],
            ['Real content', 'Stub or placeholder skill_content is rejected. Write real, useful instructions.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3">
              <span className="mt-0.5 text-accent">✓</span>
              <div>
                <span className="text-sm font-medium text-shelf-text-primary">{title}: </span>
                <span className="text-sm text-shelf-text-secondary">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILL.md template */}
      <section className="mt-12">
        <h2 className="text-xl font-medium text-shelf-text-primary">
          SKILL.md template
        </h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Every skill starts with a SKILL.md file. Copy this template:
        </p>
        <div className="relative mt-4">
          <pre className="skill-preview overflow-auto rounded-lg border border-shelf-border bg-shelf-void p-4 font-mono text-sm text-shelf-text-secondary">
            {TEMPLATE}
          </pre>
          <div className="absolute right-3 top-3">
            <CopyButton value={TEMPLATE} label="Copy template" className="btn btn-secondary" />
          </div>
        </div>
      </section>

      {/* Safety review */}
      <section className="mt-10 card p-5">
        <h2 className="text-base font-medium text-shelf-text-primary">Safety review</h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Every submitted skill is reviewed for prompt injection, data exfiltration
          attempts, and hidden instructions before going live. This usually takes
          1-3 business days. Skills that pass go live immediately.
        </p>
      </section>

      {/* Media guide link */}
      <section className="mt-6 card p-5">
        <h2 className="text-base font-medium text-shelf-text-primary">
          Add a preview thumbnail
        </h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          Skills with animated GIF previews get significantly more installs.
          See the{' '}
          <Link href="/skill-media-guide" className="text-accent hover:text-accent-hover">
            Skill Media Guide
          </Link>{' '}
          for how to add thumbnails, GIFs, and video loops to your skill.
        </p>
      </section>
    </div>
  )
}
