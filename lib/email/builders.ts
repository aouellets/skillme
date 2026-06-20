/**
 * Skill Me email builders — each returns { subject, html, text }.
 *
 * Presentation lives in ./templates (the dark brand design system). These
 * functions compose those primitives into the actual messages the app sends.
 */
import { SITE_URL } from '../site'
import {
  layout,
  heading,
  kicker,
  paragraph,
  button,
  divider,
  quote,
  skillCard,
  packCard,
  type SkillCardData,
  type PackCardData,
} from './templates'

export type SubmissionKind = 'skill' | 'pack'
export type Decision = 'approved' | 'rejected' | 'needs_changes'

export interface EmailParts {
  subject: string
  html: string
  text: string
}

// ── Welcome (newsletter signup) ──────────────────────────────────────────────

export function newsletterWelcomeEmail(): EmailParts {
  const subject = 'Welcome to Skill Me'
  const html = layout({
    title: subject,
    preheader: "You're on the list — new skills and packs, straight to your inbox.",
    inner:
      kicker('Welcome') +
      heading("You're on the list") +
      paragraph(
        'Skill Me is the app store for Claude skills — curated, reviewed, and one click to install. ' +
          "We'll send you the best new skills and packs as they land. No noise.",
      ) +
      button('Explore the catalog', '/browse') +
      paragraph(
        'Want Claude to install skills for you mid-conversation? Connect the Skill Me MCP from the ' +
          '<a href="' +
          SITE_URL +
          '/connect" style="color:#b4f33e;text-decoration:none;">Connect page</a>.',
        { muted: true },
      ),
    footerNote: "You're receiving this because you subscribed at skillme.dev.",
  })
  const text =
    `Welcome to Skill Me\n\n` +
    `You're on the list. Skill Me is the app store for Claude skills — curated, reviewed, ` +
    `and one click to install. We'll send you the best new skills and packs as they land.\n\n` +
    `Explore the catalog: ${SITE_URL}/browse\n` +
    `Connect the MCP: ${SITE_URL}/connect\n`
  return { subject, html, text }
}

// ── Newsletter digest (new skills / packs) ───────────────────────────────────

export interface DigestInput {
  /** Optional headline override, e.g. "This week on Skill Me". */
  title?: string
  /** Optional intro paragraph (plain text; rendered as a sentence). */
  intro?: string
  skills?: SkillCardData[]
  packs?: PackCardData[]
  /** Per-recipient one-click unsubscribe link (renders in the footer). */
  unsubscribeUrl?: string
}

export function newsletterDigestEmail(input: DigestInput): EmailParts {
  const title = input.title?.trim() || 'New on Skill Me'
  const skills = input.skills ?? []
  const packs = input.packs ?? []
  const count = skills.length + packs.length
  const subject = `${title} — ${count} new ${count === 1 ? 'drop' : 'drops'}`

  const sections: string[] = []
  if (skills.length) {
    sections.push(
      `<p style="margin:6px 0 12px;font-family:'Space Grotesk','Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7a827c;">New skills</p>`,
    )
    sections.push(skills.map(skillCard).join(''))
  }
  if (packs.length) {
    if (skills.length) sections.push('<div style="height:8px;line-height:8px;font-size:1px;">&nbsp;</div>')
    sections.push(
      `<p style="margin:6px 0 12px;font-family:'Space Grotesk','Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7a827c;">New packs</p>`,
    )
    sections.push(packs.map(packCard).join(''))
  }

  const html = layout({
    title: subject,
    preheader: input.intro?.trim() || `${count} new ${count === 1 ? 'thing' : 'things'} to install on Skill Me.`,
    inner:
      kicker('The drop') +
      heading(title) +
      (input.intro ? paragraph(esc(input.intro)) : '') +
      sections.join('') +
      divider() +
      `<div style="height:18px;line-height:18px;font-size:1px;">&nbsp;</div>` +
      button('Browse everything', '/browse'),
    footerNote: "You're receiving this because you subscribed to Skill Me updates.",
    unsubscribeUrl: input.unsubscribeUrl,
  })

  const lines: string[] = [title, '']
  if (input.intro) lines.push(input.intro, '')
  if (skills.length) {
    lines.push('NEW SKILLS')
    for (const s of skills) {
      lines.push(`• ${s.name}${s.category ? ` (${s.category})` : ''} — ${SITE_URL}/skill/${s.slug}`)
      if (s.description) lines.push(`  ${s.description}`)
    }
    lines.push('')
  }
  if (packs.length) {
    lines.push('NEW PACKS')
    for (const p of packs) {
      lines.push(`• ${p.name}${p.skillCount ? ` (${p.skillCount} skills)` : ''} — ${SITE_URL}/pack/${p.slug}`)
      if (p.tagline) lines.push(`  ${p.tagline}`)
    }
    lines.push('')
  }
  lines.push(`Browse everything: ${SITE_URL}/browse`)
  if (input.unsubscribeUrl) lines.push('', `Unsubscribe: ${input.unsubscribeUrl}`)

  return { subject, html, text: lines.join('\n') }
}

// ── Submission received ──────────────────────────────────────────────────────

export function submissionReceivedEmail(name: string, kind: SubmissionKind): EmailParts {
  const noun = kind === 'pack' ? 'pack' : 'skill'
  const subject = `We got your ${noun}: ${name}`
  const html = layout({
    title: subject,
    preheader: `Your ${noun} is in the review queue — we'll email you when it's live.`,
    inner:
      kicker('Submission received') +
      heading(`Thanks — your ${noun} is in review`) +
      paragraph(
        `We received <strong style="color:#f5f7f5;">${esc(name)}</strong>. Every ${noun} gets a safety and ` +
          `quality check before it goes live — usually within <strong style="color:#f5f7f5;">1–3 days</strong>. ` +
          `We'll email you the moment it's published, or if we need a few changes.`,
      ) +
      button('Browse the catalog', '/browse'),
    footerNote: `You're receiving this because you submitted a ${noun} on skillme.dev.`,
  })
  const text =
    `We got your ${noun}: ${name}\n\n` +
    `Thanks — it's in the review queue. Every ${noun} gets a safety and quality check before it goes ` +
    `live, usually within 1–3 days. We'll email you when it's published or if we need changes.\n\n` +
    `Browse the catalog: ${SITE_URL}/browse\n`
  return { subject, html, text }
}

// ── Submission decision ──────────────────────────────────────────────────────

export function submissionDecisionEmail(opts: {
  name: string
  kind: SubmissionKind
  decision: Decision
  note?: string | null
  url?: string | null
}): EmailParts {
  const { name, kind, decision, note, url } = opts
  const noun = kind === 'pack' ? 'pack' : 'skill'
  const liveUrl = url ?? SITE_URL

  if (decision === 'approved') {
    const subject = `Your ${noun} is live: ${name}`
    const html = layout({
      title: subject,
      preheader: `${name} passed review and is now live on Skill Me.`,
      inner:
        kicker('Published') +
        heading("It's live") +
        paragraph(
          `<strong style="color:#f5f7f5;">${esc(name)}</strong> passed review and is now published on ` +
            `Skill Me. Thanks for contributing to the catalog.`,
        ) +
        (note ? quote(note) : '') +
        button(`View your ${noun}`, liveUrl) +
        paragraph('Share the link — installs and ratings help your work surface to more people.', {
          muted: true,
        }),
      footerNote: `You're receiving this because you submitted a ${noun} on skillme.dev.`,
    })
    const text =
      `Your ${noun} is live: ${name}\n\n` +
      `${name} passed review and is now published on Skill Me. Thanks for contributing.\n\n` +
      (note ? `Note from the reviewer: ${note}\n\n` : '') +
      `View it: ${liveUrl}\n`
    return { subject, html, text }
  }

  if (decision === 'needs_changes') {
    const subject = `A few changes needed: ${name}`
    const html = layout({
      title: subject,
      preheader: `Almost there — a couple of tweaks and we'll publish ${name}.`,
      inner:
        kicker('Needs changes') +
        heading('Almost there') +
        paragraph(
          `Thanks for submitting <strong style="color:#f5f7f5;">${esc(name)}</strong>. Before we can publish ` +
            `it, we'd like a few changes:`,
        ) +
        (note ? quote(note) : paragraph('Please review and resubmit.', { muted: true })) +
        paragraph(
          "Reply to this email or resubmit an updated version and we'll take another look — fast.",
          { muted: true },
        ) +
        button('Resubmit', `/submit${kind === 'pack' ? '/pack' : ''}`),
      footerNote: `You're receiving this because you submitted a ${noun} on skillme.dev.`,
    })
    const text =
      `A few changes needed: ${name}\n\n` +
      `Before we publish, we'd like a few changes:\n\n` +
      `${note ?? 'Please review and resubmit.'}\n\n` +
      `Reply to this email or resubmit an updated version: ${SITE_URL}/submit${kind === 'pack' ? '/pack' : ''}\n`
    return { subject, html, text }
  }

  // rejected
  const subject = `Update on your ${noun}: ${name}`
  const html = layout({
    title: subject,
    preheader: `An update on your ${noun} submission.`,
    inner:
      kicker('Submission update') +
      heading('Submission update') +
      paragraph(
        `Thanks for submitting <strong style="color:#f5f7f5;">${esc(name)}</strong>. After review, we're not ` +
          `able to publish it at this time.`,
      ) +
      (note ? quote(note) : '') +
      paragraph("You're welcome to revise and submit again — we review every resubmission.", {
        muted: true,
      }) +
      button('Submit another', `/submit${kind === 'pack' ? '/pack' : ''}`, { secondary: true }),
    footerNote: `You're receiving this because you submitted a ${noun} on skillme.dev.`,
  })
  const text =
    `Update on your ${noun}: ${name}\n\n` +
    `After review, we're not able to publish it at this time.\n\n` +
    (note ? `${note}\n\n` : '') +
    `You're welcome to revise and submit again: ${SITE_URL}/submit${kind === 'pack' ? '/pack' : ''}\n`
  return { subject, html, text }
}

// ── Admin / ops alert ────────────────────────────────────────────────────────

export function adminAlertEmail(alertSubject: string, bodyLines: string[]): EmailParts {
  const subject = `[Skill Me] ${alertSubject}`
  const rows = bodyLines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;font-family:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;color:#c9cfca;border-bottom:1px solid #222826;">${escLine(l)}</td></tr>`,
    )
    .join('')
  const html = layout({
    title: subject,
    preheader: alertSubject,
    inner:
      kicker('Ops alert') +
      heading(alertSubject) +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`,
    footerNote: 'Internal alert sent to the Skill Me operators.',
  })
  return { subject, html, text: `${alertSubject}\n\n${bodyLines.join('\n')}` }
}

// local escape (builders pass already-trusted strings, but URLs/notes may not be)
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function escLine(s: string): string {
  return esc(s).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#b4f33e;text-decoration:none;">$1</a>')
}
