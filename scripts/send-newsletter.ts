/**
 * Assemble and send the Skill Me newsletter digest from recent catalog activity.
 *
 *   npm run send:newsletter                       # DRY RUN — writes a preview, sends nothing
 *   npm run send:newsletter -- --days 14          # look back 14 days (default 7)
 *   npm run send:newsletter -- --to you@x.com     # send one real test to yourself
 *   npm run send:newsletter -- --send             # BLAST the active subscriber list
 *   npm run send:newsletter -- --title "This week on Skill Me" --intro "..."
 *
 * Safety: it never sends to the list unless you pass --send. Dry run always
 * writes emails-preview/newsletter-latest.html so you can eyeball it first.
 *
 * Imports builders/unsubscribe directly (not lib/email, which is 'server-only').
 */
import { config } from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { newsletterDigestEmail } from '../lib/email/builders'
import { unsubscribeUrl } from '../lib/email/unsubscribe'
import type { SkillCardData, PackCardData } from '../lib/email/templates'

config({ path: '.env.local' })
config()

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const RESEND_KEY = process.env.RESEND_API_KEY?.trim()
const FROM = process.env.EMAIL_FROM?.trim() || 'Skill Me <noreply@skillme.dev>'
const REPLY_TO = process.env.EMAIL_REPLY_TO?.trim() || 'support@skillme.dev'

async function send(to: string, subject: string, html: string, text: string, unsubUrl: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject,
      html,
      text,
      // RFC 8058 one-click unsubscribe — improves deliverability and is required
      // by Gmail/Yahoo for bulk senders.
      headers: {
        'List-Unsubscribe': `<${unsubUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`)
  return JSON.parse(body) as { id: string }
}

async function main() {
  if (!url || !key) {
    console.error('Missing Supabase creds (NEXT_PUBLIC_SUPABASE_URL + a key) in .env.local.')
    process.exit(1)
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const days = Number(arg('days') ?? 7)
  const since = arg('since') ?? new Date(Date.now() - days * 86400_000).toISOString()
  const limit = Number(arg('limit') ?? 12)
  const title = arg('title')
  const intro = arg('intro')
  const testTo = arg('to')
  const doSend = hasFlag('send')

  // 1) Recent, verified skills.
  const { data: skillRows, error: skillErr } = await supabase
    .from('skills')
    .select('slug,name,category,author,description,created_at')
    .gte('created_at', since)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (skillErr) {
    console.error('skills query failed:', skillErr.message)
    process.exit(1)
  }
  const skills: SkillCardData[] = (skillRows ?? []).map((s) => ({
    slug: s.slug,
    name: s.name,
    category: s.category ?? undefined,
    author: s.author ?? undefined,
    description: s.description ?? undefined,
  }))

  // 2) Recent, verified packs (with skill counts).
  const { data: packRows, error: packErr } = await supabase
    .from('packs')
    .select('slug,name,tagline,created_at,pack_skills(count)')
    .gte('created_at', since)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (packErr) {
    console.error('packs query failed:', packErr.message)
    process.exit(1)
  }
  const packs: PackCardData[] = (packRows ?? []).map((p) => {
    const ps = p.pack_skills as unknown as Array<{ count: number }> | null
    return { slug: p.slug, name: p.name, tagline: p.tagline ?? undefined, skillCount: ps?.[0]?.count }
  })

  console.log(`Window: since ${since.slice(0, 10)} (${days}d) → ${skills.length} skills, ${packs.length} packs`)
  if (skills.length + packs.length === 0) {
    console.log('Nothing new to send. Widen the window with --days, or add catalog entries.')
    process.exit(0)
  }

  // Render a preview (no per-recipient unsubscribe link).
  const preview = newsletterDigestEmail({ title, intro, skills, packs })
  const outDir = join(process.cwd(), 'emails-preview')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'newsletter-latest.html'), preview.html)
  console.log(`Subject: "${preview.subject}"`)
  console.log(`Preview: emails-preview/newsletter-latest.html`)

  // Single test send.
  if (testTo) {
    if (!RESEND_KEY) {
      console.error('RESEND_API_KEY not set — cannot send.')
      process.exit(1)
    }
    const unsub = unsubscribeUrl(testTo)
    const parts = newsletterDigestEmail({ title, intro, skills, packs, unsubscribeUrl: unsub })
    const r = await send(testTo, parts.subject, parts.html, parts.text, unsub)
    console.log(`✓ test sent to ${testTo} (${r.id})`)
    return
  }

  // Active recipients.
  const { data: subs, error: subErr } = await supabase
    .from('newsletter_signups')
    .select('email')
    .is('unsubscribed_at', null)
  if (subErr) {
    console.error('signups query failed:', subErr.message)
    process.exit(1)
  }
  const recipients = Array.from(new Set((subs ?? []).map((s) => String(s.email).toLowerCase()).filter(Boolean)))
  console.log(`Active subscribers: ${recipients.length}`)

  if (!doSend) {
    console.log('\nDRY RUN — nothing sent. Re-run with --send to blast the list, or --to <email> to test.')
    return
  }
  if (!RESEND_KEY) {
    console.error('RESEND_API_KEY not set — cannot send.')
    process.exit(1)
  }
  if (recipients.length === 0) {
    console.log('No active subscribers — nothing to send.')
    return
  }

  console.log(`\nSending to ${recipients.length} subscribers…`)
  let ok = 0
  let failed = 0
  for (const email of recipients) {
    const unsub = unsubscribeUrl(email)
    const parts = newsletterDigestEmail({ title, intro, skills, packs, unsubscribeUrl: unsub })
    try {
      await send(email, parts.subject, parts.html, parts.text, unsub)
      ok++
    } catch (e) {
      failed++
      console.error(`  ✗ ${email}: ${e instanceof Error ? e.message : e}`)
    }
    await sleep(350) // stay under Resend's 5 req/s limit
  }
  console.log(`\nDone. Sent ${ok}, failed ${failed}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
