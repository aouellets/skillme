/**
 * Render every Skill Me email template with sample data so they can be reviewed.
 *
 *   npm run preview:emails              # write HTML files to emails-preview/
 *   npm run preview:emails -- --send you@example.com
 *                                        # also send each as a real email via Resend
 *
 * Imports the builders directly (not lib/email, which is 'server-only') so it can
 * run under tsx. Sending uses the Resend REST API with RESEND_API_KEY from env.
 */
import { config } from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  newsletterWelcomeEmail,
  newsletterDigestEmail,
  submissionReceivedEmail,
  submissionDecisionEmail,
  adminAlertEmail,
  type EmailParts,
} from '../lib/email/builders'

config({ path: '.env.local' })
config()

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://skillme.dev'

const samples: Record<string, EmailParts> = {
  '01-welcome': newsletterWelcomeEmail(),
  '02-newsletter-digest': newsletterDigestEmail({
    title: 'New on Skill Me',
    intro: 'Five fresh skills and two packs landed this week — here are the ones worth installing.',
    skills: [
      {
        name: 'SEO Audit Pro',
        slug: 'seo-audit-pro',
        category: 'business',
        author: 'Growth Lab',
        description:
          'Crawls a site, scores Core Web Vitals and on-page SEO, and returns a prioritized fix list.',
      },
      {
        name: 'Migration Planner',
        slug: 'migration-planner',
        category: 'coding',
        author: 'Skill Me',
        description: 'Turns a legacy codebase into a staged, reviewable migration plan with rollback gates.',
      },
      {
        name: 'Cohort Analyzer',
        slug: 'cohort-analyzer',
        category: 'data',
        author: 'Metrics Guild',
        description: 'Builds retention cohorts from raw events and explains what moved the numbers.',
      },
    ],
    packs: [
      {
        name: 'Gym Growth Engine',
        slug: 'gym-growth-engine',
        tagline: 'Everything a boutique gym needs to fill classes and keep members.',
        skillCount: 6,
      },
      {
        name: 'Incident Response Command',
        slug: 'incident-response-command',
        tagline: 'Run a sev like an SRE — triage, comms, and a blameless postmortem.',
        skillCount: 5,
      },
    ],
  }),
  '03-submission-received-skill': submissionReceivedEmail('SEO Audit Pro', 'skill'),
  '04-submission-received-pack': submissionReceivedEmail('Gym Growth Engine', 'pack'),
  '05-approved': submissionDecisionEmail({
    name: 'SEO Audit Pro',
    kind: 'skill',
    decision: 'approved',
    url: `${SITE}/skill/seo-audit-pro`,
    note: 'Great instructions and a clean example. Featured it on the Business shelf.',
  }),
  '06-needs-changes': submissionDecisionEmail({
    name: 'SEO Audit Pro',
    kind: 'skill',
    decision: 'needs_changes',
    note: 'Add a concrete example invocation, and trim the system prompt — it repeats the description twice.',
  }),
  '07-rejected': submissionDecisionEmail({
    name: 'SEO Audit Pro',
    kind: 'skill',
    decision: 'rejected',
    note: 'This overlaps almost entirely with an existing skill. Happy to reconsider a more differentiated version.',
  }),
  '08-admin-alert': adminAlertEmail('New skill submission: SEO Audit Pro', [
    'Category: business',
    'Author: Growth Lab',
    'From: jane@growthlab.example',
    'Safety: pass',
    `Review it: ${SITE}/admin/submissions`,
  ]),
}

async function send(to: string, parts: EmailParts) {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) throw new Error('RESEND_API_KEY not set')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM?.trim() || 'Skill Me <noreply@skillme.dev>',
      to: [to],
      reply_to: process.env.EMAIL_REPLY_TO?.trim() || 'support@skillme.dev',
      subject: parts.subject,
      html: parts.html,
      text: parts.text,
    }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`)
  return JSON.parse(body) as { id: string }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const sendIdx = process.argv.indexOf('--send')
  const sendTo = sendIdx !== -1 ? process.argv[sendIdx + 1] : null
  const onlyIdx = process.argv.indexOf('--only')
  const only = onlyIdx !== -1 ? process.argv[onlyIdx + 1]?.split(',') : null

  const outDir = join(process.cwd(), 'emails-preview')
  mkdirSync(outDir, { recursive: true })

  const index: string[] = [
    '<!doctype html><meta charset="utf-8"><title>Skill Me email previews</title>',
    '<body style="font-family:system-ui;background:#080a0a;color:#f5f7f5;padding:24px;">',
    '<h1>Skill Me — email previews</h1><ul>',
  ]

  for (const [name, parts] of Object.entries(samples)) {
    writeFileSync(join(outDir, `${name}.html`), parts.html)
    index.push(`<li><a style="color:#b4f33e" href="./${name}.html">${name}</a> — ${parts.subject}</li>`)
    console.log(`✓ wrote emails-preview/${name}.html — "${parts.subject}"`)
    if (sendTo && (!only || only.some((p) => name.startsWith(p)))) {
      const r = await send(sendTo, parts)
      console.log(`  ↳ sent to ${sendTo} (${r.id})`)
      await sleep(350) // stay under Resend's 5 req/s limit
    }
  }

  index.push('</ul></body>')
  writeFileSync(join(outDir, 'index.html'), index.join('\n'))
  console.log(`\nOpen emails-preview/index.html to review all ${Object.keys(samples).length} templates.`)
  if (sendTo) console.log(`Sent ${Object.keys(samples).length} sample emails to ${sendTo}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
