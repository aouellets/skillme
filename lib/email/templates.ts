/**
 * Skill Me email design system + templates.
 *
 * On-brand "premium dark-tech": near-black surfaces, one locked vermilion
 * accent (#ee4628), light text — mirrors styles/tokens.css. A dark email is also
 * more robust than a light one against email-client dark-mode auto-inversion.
 *
 * Everything is built from email-client-safe primitives: table-based layout,
 * inline styles on every node, bgcolor attributes for Outlook, a hidden
 * preheader, an MSO/VML bulletproof button, and color-scheme meta so clients
 * keep the intended dark palette. Web fonts don't load reliably in email, so we
 * declare Inter first and fall back to a strong system stack.
 *
 * Each builder returns { subject, html, text } — the plaintext part matters for
 * deliverability and is always provided.
 */
import { SITE_URL } from '../site'

// ── Brand tokens (literal hex — email can't use CSS vars) ────────────────────

const C = {
  page: '#080a0a',
  surface: '#101413',
  elevated: '#181d1b',
  border: '#222826',
  borderStrong: '#323a37',
  textPrimary: '#f5f7f5',
  textBody: '#c9cfca',
  textSecondary: '#9ba29d',
  textTertiary: '#7a827c',
  accent: '#ee4628',
  accentHover: '#c23a20',
  accentDim: '#2a1109',
  accentBorder: '#5c2417',
  onAccent: '#faf6f0',
  success: '#4ade80',
  danger: '#f05252',
  warning: '#f5c451',
} as const

const FONT_BODY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const FONT_DISPLAY =
  "'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif"

const LOGO_URL = `${SITE_URL}/skill-me-icon-512.png`

/** Category → accent dot color, mirroring the --cat-* tokens. */
const CATEGORY_COLOR: Record<string, string> = {
  writing: '#a797ff',
  coding: '#4fd1d9',
  research: '#6ee787',
  productivity: '#f5c451',
  data: '#5b9df9',
  design: '#ff8a5c',
  business: '#df8ad9',
  personal: '#aab4a4',
}
function categoryColor(category?: string): string {
  return (category && CATEGORY_COLOR[category.toLowerCase()]) || C.accent
}

// ── Primitives ───────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Absolute-URL guard so cards always link somewhere valid. */
function abs(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 14px;font-family:${FONT_DISPLAY};font-size:24px;line-height:1.25;font-weight:700;color:${C.textPrimary};letter-spacing:-0.02em;">${esc(text)}</h1>`
}

/** Small lime eyebrow/kicker above a heading. */
export function kicker(text: string): string {
  return `<p style="margin:0 0 10px;font-family:${FONT_DISPLAY};font-size:12px;line-height:1;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.accent};">${esc(text)}</p>`
}

export function paragraph(html: string, opts: { muted?: boolean } = {}): string {
  const color = opts.muted ? C.textSecondary : C.textBody
  return `<p style="margin:0 0 16px;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${color};">${html}</p>`
}

/** Bulletproof CTA button (lime by default), with an MSO/VML fallback for Outlook. */
export function button(label: string, href: string, opts: { secondary?: boolean } = {}): string {
  const url = esc(abs(href))
  const bg = opts.secondary ? C.elevated : C.accent
  const fg = opts.secondary ? C.textPrimary : C.onAccent
  const border = opts.secondary ? C.borderStrong : C.accent
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;"><tr><td align="center" bgcolor="${bg}" style="border-radius:8px;">` +
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:44px;v-text-anchor:middle;width:240px;" arcsize="18%" strokecolor="${border}" fillcolor="${bg}"><w:anchorlock/><center style="color:${fg};font-family:${FONT_BODY};font-size:15px;font-weight:bold;">${esc(label)}</center></v:roundrect><![endif]-->` +
    `<!--[if !mso]><!-- -->` +
    `<a href="${url}" style="display:inline-block;padding:12px 24px;border-radius:8px;background-color:${bg};border:1px solid ${border};font-family:${FONT_BODY};font-size:15px;font-weight:700;line-height:1;color:${fg};text-decoration:none;">${esc(label)}</a>` +
    `<!--<![endif]-->` +
    `</td></tr></table>`
  )
}

export function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;line-height:1px;font-size:1px;background-color:${C.border};">&nbsp;</td></tr></table>`
}

export function spacer(px: number): string {
  return `<div style="line-height:${px}px;height:${px}px;font-size:1px;">&nbsp;</div>`
}

/** Reviewer note / quoted message block. */
export function quote(note: string): string {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;" bgcolor="${C.elevated}">` +
    `<tr><td style="border-left:3px solid ${C.accentBorder};border-radius:0 8px 8px 0;padding:12px 16px;background-color:${C.elevated};font-family:${FONT_BODY};font-size:14px;line-height:1.6;color:${C.textBody};white-space:pre-wrap;">${esc(note)}</td></tr></table>`
  )
}

/** A small pill/badge (e.g. category, "5 skills"). */
export function badge(text: string, color: string = C.accent): string {
  return `<span style="display:inline-block;padding:3px 9px;border-radius:9999px;background-color:${C.accentDim};border:1px solid ${C.accentBorder};font-family:${FONT_BODY};font-size:11px;font-weight:600;line-height:1.4;color:${color};">${esc(text)}</span>`
}

export interface SkillCardData {
  name: string
  slug: string
  category?: string
  author?: string
  description?: string
}

/** One skill row for the newsletter digest. */
export function skillCard(s: SkillCardData): string {
  const dot = categoryColor(s.category)
  const url = esc(abs(`/skill/${s.slug}`))
  const meta = [s.category, s.author && `by ${s.author}`].filter(Boolean).join(' · ')
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;" bgcolor="${C.elevated}">` +
    `<tr><td style="padding:16px 18px;background-color:${C.elevated};border:1px solid ${C.border};border-radius:12px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td valign="top" width="10" style="padding:6px 10px 0 0;"><span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background-color:${dot};">&nbsp;</span></td>` +
    `<td valign="top">` +
    `<a href="${url}" style="font-family:${FONT_DISPLAY};font-size:16px;font-weight:700;line-height:1.3;color:${C.textPrimary};text-decoration:none;">${esc(s.name)}</a>` +
    (meta ? `<div style="margin-top:2px;font-family:${FONT_BODY};font-size:12px;line-height:1.4;color:${C.textTertiary};">${esc(meta)}</div>` : '') +
    (s.description ? `<div style="margin-top:6px;font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${C.textSecondary};">${esc(s.description)}</div>` : '') +
    `<div style="margin-top:10px;"><a href="${url}" style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${C.accent};text-decoration:none;">Install &rarr;</a></div>` +
    `</td></tr></table>` +
    `</td></tr></table>`
  )
}

export interface PackCardData {
  name: string
  slug: string
  tagline?: string
  skillCount?: number
}

/** One pack row for the newsletter digest. */
export function packCard(p: PackCardData): string {
  const url = esc(abs(`/pack/${p.slug}`))
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;" bgcolor="${C.elevated}">` +
    `<tr><td style="padding:16px 18px;background-color:${C.elevated};border:1px solid ${C.border};border-radius:12px;">` +
    `<div>${badge('Pack')}${p.skillCount ? `&nbsp;&nbsp;<span style="font-family:${FONT_BODY};font-size:12px;color:${C.textTertiary};">${p.skillCount} skills</span>` : ''}</div>` +
    `<a href="${url}" style="display:inline-block;margin-top:8px;font-family:${FONT_DISPLAY};font-size:16px;font-weight:700;line-height:1.3;color:${C.textPrimary};text-decoration:none;">${esc(p.name)}</a>` +
    (p.tagline ? `<div style="margin-top:4px;font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${C.textSecondary};">${esc(p.tagline)}</div>` : '') +
    `<div style="margin-top:10px;"><a href="${url}" style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${C.accent};text-decoration:none;">Install the pack &rarr;</a></div>` +
    `</td></tr></table>`
  )
}

// ── Shell ────────────────────────────────────────────────────────────────────

interface LayoutOpts {
  title: string
  preheader: string
  inner: string
  /** Footer note above the standard footer (e.g. why you're receiving this). */
  footerNote?: string
  /** When set, renders an Unsubscribe link in the footer (marketing emails). */
  unsubscribeUrl?: string
}

/** Hidden preview text shown in the inbox list before the email is opened. */
function preheaderBlock(text: string): string {
  return (
    `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">` +
    `${esc(text)}` +
    '&#8204;&nbsp;'.repeat(60) +
    `</div>`
  )
}

function header(): string {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td align="left" style="padding:4px 4px 20px;">` +
    `<a href="${esc(SITE_URL)}" style="text-decoration:none;">` +
    `<img src="${esc(LOGO_URL)}" width="36" height="36" alt="Skill Me" style="vertical-align:middle;border-radius:9px;display:inline-block;border:0;" />` +
    `<span style="vertical-align:middle;margin-left:10px;font-family:${FONT_DISPLAY};font-size:18px;font-weight:700;letter-spacing:-0.01em;color:${C.textPrimary};">Skill<span style="color:${C.accent};"> Me</span></span>` +
    `</a></td></tr></table>`
  )
}

function footer(footerNote?: string, unsubUrl?: string): string {
  const host = SITE_URL.replace(/^https?:\/\//, '')
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:24px 4px 0;">` +
    (footerNote
      ? `<p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${C.textTertiary};">${footerNote}</p>`
      : '') +
    `<p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${C.textSecondary};">` +
    `<a href="${esc(SITE_URL)}/browse" style="color:${C.textSecondary};text-decoration:none;">Browse</a>` +
    `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${esc(SITE_URL)}/packs" style="color:${C.textSecondary};text-decoration:none;">Packs</a>` +
    `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${esc(SITE_URL)}/submit" style="color:${C.textSecondary};text-decoration:none;">Submit a skill</a>` +
    `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://github.com/aouellets/skillme" style="color:${C.textSecondary};text-decoration:none;">GitHub</a>` +
    `</p>` +
    `<p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${C.textTertiary};">` +
    `Skill Me — the app store for Claude skills. <a href="${esc(SITE_URL)}" style="color:${C.textTertiary};text-decoration:underline;">${esc(host)}</a>` +
    (unsubUrl
      ? `<br><a href="${esc(unsubUrl)}" style="color:${C.textTertiary};text-decoration:underline;">Unsubscribe</a> from these updates.`
      : '') +
    `</p>` +
    `</td></tr></table>`
  )
}

export function layout({ title, preheader, inner, footerNote, unsubscribeUrl }: LayoutOpts): string {
  return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(title)}</title>
<!--[if mso]><style>* {font-family: ${FONT_BODY} !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.page};-webkit-font-smoothing:antialiased;">
${preheaderBlock(preheader)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td>
${header()}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};border-radius:16px;">
<tr><td style="height:3px;line-height:3px;font-size:1px;background-color:${C.accent};border-radius:16px 16px 0 0;">&nbsp;</td></tr>
<tr><td style="padding:32px;">
${inner}
</td></tr>
</table>
${footer(footerNote, unsubscribeUrl)}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}
