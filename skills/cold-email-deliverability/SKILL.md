---
name: cold-email-deliverability
description: Use this skill BEFORE launching any cold outbound — it is the infrastructure layer beneath every sequence. Triggers — "my emails are going to spam", "set up a sending domain", "configure SPF DKIM DMARC", "how many emails can I send per day", "warm up a new domain", "why is my bounce rate high", "set up cold email infrastructure", "domain reputation burned", "inbox placement test", "deliverability checklist", "should I send from my main domain", "Google Postmaster Tools". Workflow — buy separate sending domains, authenticate DNS (SPF + DKIM + DMARC), age + warm mailboxes 2-4 weeks, cap per-mailbox volume and scale via mailbox pool, verify every address, keep content plain and clean, then monitor bounce/complaint/placement continuously. Do NOT use for writing the email copy itself — use [[cold-email-craft]]; do NOT use for designing the multi-step cadence — use [[outreach-sequence-designer]]; do NOT use for sizing the list — use [[prospect-list-builder]].
---

# Protect Cold-Email Deliverability

Deliverability is not a copywriting problem; it is an infrastructure and reputation problem. The single most expensive mistake in cold outbound is sending it from your primary corporate domain — one spam-trap hit or complaint spike and your invoices, your hiring emails, and your founder's replies all start landing in spam, and that reputation damage is slow and painful to reverse. Treat cold sending as a blast radius you isolate on purpose: separate domains, separate mailboxes, conservative volume, and relentless monitoring.

The core insight: mailbox providers (Gmail, Outlook) score the *sending identity* — domain + IP + behavioral signals like complaints, bounces, and engagement — not the cleverness of your subject line. You earn primary-inbox placement by behaving like a real human correspondent at low volume, and you keep it by watching the signals that providers actually measure. Good copy on a burned domain still lands in spam.

## When to use this skill

- You are about to launch cold outbound and have not set up dedicated sending infrastructure.
- Reply rates cratered or messages are landing in spam/Promotions and you need to diagnose.
- You are scaling volume and need to size mailboxes, domains, and list to capacity.
- You are configuring DNS authentication and want SPF/DKIM/DMARC done correctly the first time.
- A domain got flagged or blacklisted and you need a recovery plan.

## The workflow

1. **Isolate the blast radius — separate sending domains.** Never send cold from your primary domain (`acme.com`). Register lookalike domains (`trygetacme.com`, `acme-team.com`, `getacme.io`) dedicated to outbound. Redirect them to your main site (301) so they resolve. If one gets burned, you pause and rotate it without touching corporate mail.

2. **Authenticate DNS — all three, or you are getting filtered.**
   - **SPF** (TXT record): authorizes which servers may send for the domain. Publish exactly **one** SPF record; multiple SPF TXT records = a permerror = fail. Stay under the **10 DNS-lookup limit** (each `include:` counts; nested includes count too). Example: `v=spf1 include:_spf.google.com ~all`.
   - **DKIM** (TXT record at a selector subdomain, e.g. `selector._domainkey.domain`): cryptographically signs each message so the receiver verifies it wasn't altered and the domain authorized it. Use a per-domain **2048-bit** key (1024 is legacy/weak).
   - **DMARC** (TXT at `_dmarc.domain`): tells receivers what to do when SPF/DKIM fail, and requires **alignment** (the visible From domain must match the authenticated domain). Start at `p=none` to monitor via aggregate reports, then tighten to `p=quarantine` and eventually `p=reject` once you confirm legitimate mail passes. Example: `v=DMARC1; p=none; rua=mailto:dmarc@domain; adkim=s; aspf=s`.
   - All three together: SPF says "this server is allowed," DKIM says "this message is intact and authorized," DMARC ties them to the visible From and sets enforcement. Gmail/Yahoo bulk-sender rules effectively require all three.

3. **Age and warm before you send a single real prospect.** Brand-new domains have zero reputation and get filtered hard. Let the domain age (ideally register a couple weeks before you need it), then **warm each mailbox for ~2-4 weeks**: start at a handful of sends/day and ramp gradually, mixed with received + replied mail (warmup tools or a manual network) so providers see natural two-way engagement before volume climbs.

4. **Cap per-mailbox volume and scale horizontally.** A single mailbox has a conservative real-world ceiling for cold — treat **~30-50 cold sends/day/mailbox** as the cap, not a target. To send more, add mailboxes (2-3 per domain) and rotate across a **mailbox pool**. Size your list to capacity: 5 mailboxes × 40/day ≈ 200 new prospects/day. Sequencing this against list size is [[prospect-list-builder]] territory.

5. **List hygiene — verify before you send.** Every address goes through verification first (see [[lead-enrichment]]). Remove invalids, role accounts (`info@`, `sales@`), and risky **catch-all** domains, or sample them carefully. **Bounce rate is the fastest way to torch a new domain** — keep it under ~2-3%. A dirty list will burn warm infrastructure in a single batch.

6. **Content hygiene — look like a person, not a campaign.** Plain text beats heavy HTML/templated layouts. **No images and at most one link in the first touch** (links are the #1 silent spam trigger). Avoid spam-trigger phrasing ("free", "guarantee", "act now", excessive caps/exclamation). Use a **custom tracking domain** if you track opens, or turn open-tracking off entirely — shared tracking domains are widely blacklisted. Include a real, plain-text opt-out.

7. **Monitor the signals providers actually measure.** Watch **bounce rate** (<2-3%), **spam-complaint rate** (keep well under 0.1% — Gmail's red line is 0.3%), and **reply rate** as a health proxy (a sudden drop often means placement collapsed, not worse copy). Run **seed/inbox-placement tests** (send to a seed set across Gmail/Outlook/Yahoo, check primary vs spam) before and during campaigns. Enroll sending domains in **Google Postmaster Tools** for real reputation + spam-rate data from Google itself.

8. **When a domain gets burned: pause, diagnose, rotate.** Stop sending from it immediately. Diagnose: check blacklists (MXToolbox), Postmaster reputation, recent bounce/complaint spike, and whether DNS auth silently broke. Light damage → drop volume to near-zero and re-warm for weeks. Heavy damage (blacklisted, complaint spike) → retire the domain, rotate to a fresh warmed one, and fix the upstream cause (bad list, aggressive volume) before reusing the pattern.

## Pre-launch deliverability checklist

```
INFRASTRUCTURE
[ ] Sending domain(s) are SEPARATE from primary corporate domain
[ ] Each sending domain redirects (301) to the main site and resolves
[ ] Domain registered >= 2 weeks ago (aged, not same-day)

AUTHENTICATION (verify with the audit script below)
[ ] Exactly ONE SPF TXT record, ends in ~all or -all, under 10 DNS lookups
[ ] DKIM published at selector._domainkey, 2048-bit key, signs outbound
[ ] DMARC at _dmarc, p=none to start, rua= reporting address set
[ ] SPF + DKIM alignment with the visible From domain (DMARC passes)

WARMUP & VOLUME
[ ] Each mailbox warmed 2-4 weeks, volume ramped gradually
[ ] Per-mailbox daily cap set (<= ~30-50 cold sends/day)
[ ] Mailbox pool + rotation configured; list sized to total capacity

LIST & CONTENT
[ ] Every address verified; invalids/role/catch-all removed
[ ] Projected bounce rate < 2-3%
[ ] First touch: plain text, <= 1 link, no images, no spam-trigger words
[ ] Custom tracking domain configured, or open-tracking OFF
[ ] Real plain-text unsubscribe / opt-out present

MONITORING
[ ] Google Postmaster Tools enrolled for each sending domain
[ ] Seed/inbox-placement test passed (primary, not spam/Promotions)
[ ] Dashboards for bounce %, complaint %, reply % with alert thresholds
```

## Worked example: infrastructure for 200 cold sends/day

Goal: reach ~4,000 net-new prospects/month (~200/business day).

```
Capacity math:  200/day ÷ 40 cold sends/mailbox/day = 5 mailboxes needed.
Domains:        2 sending domains, 3 mailboxes each = 6 mailboxes (1 spare for rotation).
                trygetacme.com  -> ava@, ava.chen@, hello@   (301 -> acme.com)
                acme-team.com   -> ava@, ava.chen@, hello@   (301 -> acme.com)
DNS per domain: SPF   TXT @            v=spf1 include:_spf.google.com ~all
                DKIM  TXT google._domainkey   (2048-bit, from Google Admin)
                DMARC TXT _dmarc      v=DMARC1; p=none; rua=mailto:dmarc@acme.com; adkim=s; aspf=s
Timeline:       Wk 0 register + DNS + redirect.  Wk 1-3 warm all 6 mailboxes
                (start ~5/day, ramp to ~40).  Wk 4 begin real sends at full cap.
Real volume:    5 active mailboxes × 40 = 200/day.  Hold 1 mailbox in reserve.
List sizing:    queue ~200 verified prospects/day; bounce budget < 6/day (3%).
Guardrails:     complaint rate alert at 0.1%; if any domain spikes, pause it,
                shift load to the spare, re-warm, diagnose before resuming.
```

## Authentication audit script (Node, zero deps)

Run before launch and on a schedule. `node check-deliverability.mjs trygetacme.com [dkim-selector]`

```javascript
#!/usr/bin/env node
// check-deliverability.mjs — sanity-check SPF/DKIM/DMARC for a sending domain.
// Usage: node check-deliverability.mjs <domain> [dkimSelector=google]
import { resolveTxt } from 'node:dns/promises';

const domain = process.argv[2];
const selector = process.argv[3] || 'google';
if (!domain) { console.error('usage: node check-deliverability.mjs <domain> [dkimSelector]'); process.exit(2); }

const out = [];
const log = (level, label, msg) => out.push({ level, label, msg });

async function txt(name) {
  try {
    // resolveTxt returns string[][]; join each record's chunks (DNS 255-char splits).
    return (await resolveTxt(name)).map(chunks => chunks.join(''));
  } catch (e) {
    if (e.code === 'ENOTFOUND' || e.code === 'ENODATA') return [];
    throw e;
  }
}

// Count SPF DNS lookups (include/a/mx/ptr/exists/redirect) one level deep.
async function countSpfLookups(record, seen = new Set(), depth = 0) {
  if (depth > 5) return 0; // guard runaway recursion
  let count = 0;
  for (const term of record.split(/\s+/)) {
    const m = term.match(/^(include|a|mx|ptr|exists|redirect)[:=]?(.*)$/i);
    if (!m) continue;
    count++;
    const target = m[2];
    if (m[1].toLowerCase() === 'include' && target && !seen.has(target)) {
      seen.add(target);
      const [nested] = (await txt(target)).filter(r => /^v=spf1/i.test(r));
      if (nested) count += await countSpfLookups(nested, seen, depth + 1);
    }
  }
  return count;
}

async function checkSpf() {
  const spf = (await txt(domain)).filter(r => /^v=spf1/i.test(r));
  if (spf.length === 0) return log('FAIL', 'SPF', 'no v=spf1 record found');
  if (spf.length > 1) return log('FAIL', 'SPF', `${spf.length} SPF records (must be exactly 1 — multiple = permerror)`);
  const rec = spf[0];
  if (!/[~\-]all\s*$/.test(rec)) log('WARN', 'SPF', 'does not end in ~all or -all (open policy)');
  const lookups = await countSpfLookups(rec);
  if (lookups > 10) log('FAIL', 'SPF', `${lookups} DNS lookups (limit is 10 — exceeding = permerror)`);
  else log('PASS', 'SPF', `1 record, ${lookups} lookups, ${(/-all/.test(rec) ? 'hard' : 'soft')} fail policy`);
}

async function checkDkim() {
  const name = `${selector}._domainkey.${domain}`;
  const recs = (await txt(name)).filter(r => /v=DKIM1|p=/i.test(r));
  if (recs.length === 0) return log('FAIL', 'DKIM', `no record at ${name} (try the right selector)`);
  const rec = recs[0];
  const p = (rec.match(/p=([A-Za-z0-9+/=]*)/) || [])[1] || '';
  if (p === '') return log('FAIL', 'DKIM', 'key revoked/empty (p=)');
  // RSA 2048-bit public key in base64 DER is ~392 chars; 1024-bit is ~216.
  const strength = p.length > 300 ? '~2048-bit' : '~1024-bit (weak — upgrade)';
  log(p.length > 300 ? 'PASS' : 'WARN', 'DKIM', `key present at selector "${selector}", ${strength}`);
}

async function checkDmarc() {
  const recs = (await txt(`_dmarc.${domain}`)).filter(r => /^v=DMARC1/i.test(r));
  if (recs.length === 0) return log('FAIL', 'DMARC', `no record at _dmarc.${domain}`);
  const rec = recs[0];
  const policy = (rec.match(/\bp=(none|quarantine|reject)\b/) || [])[1];
  const hasRua = /rua=mailto:/i.test(rec);
  if (!policy) return log('FAIL', 'DMARC', 'no p= policy tag');
  if (!hasRua) log('WARN', 'DMARC', `p=${policy} but no rua= (you get no aggregate reports)`);
  else log(policy === 'none' ? 'WARN' : 'PASS', 'DMARC',
    `p=${policy}${policy === 'none' ? ' (monitor-only — tighten toward quarantine/reject)' : ''}, reporting on`);
}

await Promise.all([checkSpf(), checkDkim(), checkDmarc()]);
const order = { FAIL: 0, WARN: 1, PASS: 2 };
out.sort((a, b) => order[a.level] - order[b.level]);
for (const r of out) console.log(`[${r.level.padEnd(4)}] ${r.label.padEnd(5)} ${r.msg}`);
const fails = out.filter(r => r.level === 'FAIL').length;
console.log(`\n${fails ? `❌ ${fails} blocking issue(s) — fix before sending.` : '✅ no blocking auth issues.'}`);
process.exit(fails ? 1 : 0);
```

## Common failure modes

- **Sending cold from the primary domain.** The classic catastrophe. One complaint spike poisons all corporate mail. Always isolate on dedicated domains.
- **Two SPF records, or blowing the 10-lookup limit.** Both produce a permerror and silently fail SPF — common after adding a second ESP. Flatten or consolidate; the script catches both.
- **DMARC at `p=none` forever.** `p=none` only monitors; it provides no enforcement. It's a starting point, not a destination — move to quarantine/reject once mail passes cleanly.
- **Skipping warmup.** Blasting a brand-new domain at full volume is the single fastest way to land in spam permanently. Warm for weeks, ramp slowly.
- **Treating the daily cap as a target.** ~40/mailbox is a ceiling for *cold* mail; pushing past it to hit a number trades short-term reach for a burned domain. Scale with more mailboxes, not more per mailbox.
- **Unverified lists / catch-all domains.** A high bounce batch torches even well-warmed infrastructure instantly. Verify first ([[lead-enrichment]]); keep bounces under 2-3%.
- **Open-tracking on a shared/blacklisted tracking domain, or image-heavy HTML.** Both scream "bulk campaign." Use a custom tracking domain or none, and keep the first touch plain.
- **No monitoring until replies dry up.** By then the domain is already burned. Watch complaint/bounce rates and run placement tests *continuously*, and enroll in Google Postmaster Tools from day one.
