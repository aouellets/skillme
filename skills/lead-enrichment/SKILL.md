---
name: lead-enrichment
description: Use this skill to turn a raw or partial prospect list into a usable, send-safe dataset by filling missing fields (work email, direct/mobile phone, title, firmographics, technographics, LinkedIn URL) and verifying emails before any send. Trigger when you hear "enrich this list", "find the email for these people", "verify these emails before we send", "this list is half blank", "what do I do with catch-all domains", "is this email risky or valid", "find mobile numbers for these contacts", "backfill company size and industry", "this list is a year old, is it still good", "dedupe and clean this CSV", "set up a waterfall so we don't pay twice", or "why is my bounce rate spiking". Workflow: define required fields and a per-field provider waterfall, run enrichment taking first verified hit, classify every email (valid / catch-all / risky / invalid), apply a send threshold, backfill firmographics/technographics, run hygiene (normalize titles, standardize company names, dedupe/merge), and re-verify anything older than ~90 days before re-sequencing. Do NOT use for selecting WHO to target (segment/filter into a list) — use [[prospect-list-builder]]. Do NOT use for tool-specific credit mechanics and Apollo filter syntax — use [[apollo-prospecting]]. Pair with [[cold-email-deliverability]] for the inbox-protection side of verification.
---

# Enrich & Verify Lead Data

Enrichment is two jobs that people collapse into one and regret it: **filling** missing fields and **verifying** the ones that touch deliverability. The filling is a logistics problem (which provider has this contact, at what cost). The verifying is a risk problem (which of these addresses will bounce or hit a spam trap and torch your sending domain). The core insight: a list is not "enriched" because the email column is full — it is enriched when every address you intend to send to has been *independently verified* and stamped with a state, and every record carries a freshness date you can act on.

The most expensive trap is treating provider-supplied emails as send-ready. Data vendors return "best guess" emails that are pattern-generated (`first.last@domain`) and never SMTP-checked. Send to those blind and you'll see a 12-20% bounce rate, which is how you get throttled or blocklisted. The second trap is paying twice — running the same record through three providers in parallel and burning credits on all three when the first one already had it. Sequence your providers; stop at the first verified hit.

## When to use this skill

- You have a list of names + companies (or LinkedIn URLs) and need work emails, phones, and firmographics filled in.
- You bought or exported a list and need every email verified before it goes into a sequence.
- Bounce rate is climbing and you suspect stale or unverified data.
- You're re-sequencing a list that's been sitting for months and need to know what still resolves.
- You're standing up a repeatable waterfall and want to stop double-paying across providers.

## The workflow

1. **Define the required field set and a fallback for each.** List the fields the downstream play actually needs — don't enrich what you won't use. Typical: `work_email` (required, verified), `title`, `seniority`, `company_name` (standardized), `company_domain`, `employee_count`, `industry`, `linkedin_url`; optional multi-channel: `direct_phone`, `mobile_phone`; optional technographics: `tech_stack`. For each field decide: required-to-send, nice-to-have, or skip.

2. **Build the waterfall: order providers by hit-rate-per-dollar for THIS field.** Different providers win different fields — one is strong on mobile, another on EU work emails, another cheap on firmographics. Order them per field, not globally. Rule: query provider 1, if it returns a *verified* value, stop and bank it; only fall through to provider 2 on a miss or unverified result. Never fan out in parallel — that pays N times for one answer. (Tool-specific credit/refund mechanics live in [[apollo-prospecting]].)

3. **Verify every email and record its state.** Run each address through a verification step (provider-native or a dedicated verifier) and store one of four states: **valid** (SMTP-confirmed mailbox), **catch-all** / accept-all (domain accepts everything — unverifiable at the mailbox level), **risky** (role address like info@/sales@, full inbox, or low-confidence), **invalid** (NXDOMAIN, no MX, rejected mailbox). Never overwrite the raw provider guess silently — keep both the value and its state.

4. **Apply an explicit send threshold and route by state.** Decide before you send: **valid → send**; **invalid → drop, never send**; **risky → drop or send only on a separate warmed IP at low volume**; **catch-all → the judgment call.** For catch-all, don't blanket-send (you can't tell valid from invalid) — either (a) skip on a high-deliverability-priority domain, (b) send only to high-value catch-all records you've corroborated via a second source/signal, or (c) route them through a low-risk channel (LinkedIn, phone). Set the threshold by how much your domain reputation matters right now (warming up = strict; established + warmed = looser). See [[cold-email-deliverability]].

5. **Backfill firmographics + technographics, then normalize.** Fill `employee_count`, `industry`, `revenue_band`, HQ region, and tech stack where the play uses them (e.g., "uses Salesforce" for an integration pitch). Then run **hygiene**: normalize titles to a controlled vocabulary (`VP Eng`, `V.P. of Engineering`, `Head of Engineering` → one seniority+function), standardize company names (strip `Inc`/`LLC`/`, the`), canonicalize domains (apex, not `www`).

6. **Dedupe and merge on a stable key.** Dedupe on `company_domain + normalized_email` (or LinkedIn URL when present), not on display name — "Bob Smith" and "Robert Smith" at the same domain are one person. On merge, keep the most-recently-verified value per field and preserve provenance (which provider, what date) so you can audit and re-verify.

7. **Stamp freshness and set a re-verify TTL.** B2B contact data decays roughly **30% per year** — people change jobs, emails die. Write a `last_verified_at` on every record. Before re-sequencing anything older than ~90 days, re-run verification (and re-check title — a stale title means they may have moved companies entirely). Treat freshness as a first-class field, not metadata you forget.

## Enrichment plan template

```
ENRICHMENT PLAN: <list name> (<row count> rows, source: <export/purchase/scrape>)

FIELDS NEEDED
  required-to-send:  work_email(verified), company_domain
  nice-to-have:      title, seniority, employee_count, industry, linkedin_url, mobile_phone
  skip:              <fields the play won't use>

WATERFALL (per field, stop at first VERIFIED hit)
  work_email:    1) <provider A>  2) <provider B>  3) pattern+verify fallback
  mobile_phone:  1) <provider C>  2) <provider A>
  firmographics: 1) <provider D (cheap)>  2) <provider A>

VERIFICATION
  verifier:           <provider-native | dedicated>
  send threshold:     valid=SEND, catch-all=<skip|corroborate|other-channel>,
                      risky=DROP, invalid=DROP
  reputation posture: <warming = strict | established = looser>

HYGIENE
  title vocab:    <controlled list / mapping>
  company name:   strip suffixes, standardize
  dedupe key:     company_domain + normalized_email (fallback: linkedin_url)
  merge rule:     keep most-recently-verified per field; preserve provenance

FRESHNESS
  stamp:          last_verified_at on every row
  re-verify TTL:  90 days before any re-sequence

COST CEILING
  max credits:    <N>    est. cost/verified-record: <$>    stop-if-over: <$>
```

## Worked example

Inbound: a 4,200-row CSV from a conference attendee export — name, company, sometimes a personal Gmail, no work emails, no firmographics. Goal: a send-safe list for a Q3 sequence.

1. **Fields:** required `work_email(verified)` + `company_domain`; nice-to-have `title`, `seniority`, `employee_count`, `linkedin_url`. Skip phone (this is an email play).
2. **Waterfall:** resolve `company_domain` from company name first (cheap), then `work_email` via provider A → provider B → pattern-generate-and-verify. Firmographics from a cheap firmographic provider, falling through to A.
3. **Run + verify:** 4,200 rows → providers return 3,050 work emails. Verification buckets them: **1,990 valid**, **520 catch-all**, **310 risky** (role/low-confidence), **230 invalid**. The 1,150 with no email found get parked for a LinkedIn-only sub-play.
4. **Route by threshold (warming a newish domain → strict):** send the 1,990 valid. Drop the 230 invalid and 310 risky. For the 520 catch-all: 90 are target-account contacts → corroborate via LinkedIn + a second provider, recover 60 into "send"; the rest go to the LinkedIn sub-play. **Send list = 2,050.**
5. **Hygiene:** normalize titles into seniority/function, standardize company names, dedupe on domain+email — finds 140 dupes (same person from two badge scans), merge. Net **1,930 unique send-ready**.
6. **Stamp** `last_verified_at = today` on all. Note: this list will need re-verification before any Q4 reuse.

Outcome: instead of blasting 3,050 unverified addresses (and eating a ~16% bounce), you send 1,930 verified — projected bounce under 2%, domain reputation intact.

## A runnable triage artifact

Drop this in `enrich-triage.mjs` (`node enrich-triage.mjs leads.csv`). It does **heuristic** bucketing and stale-flagging for fast triage — it does NOT replace real SMTP verification (no network mailbox check), so treat its `valid` as "passes basic hygiene, still must be verified by a real verifier."

```js
import { readFileSync } from "node:fs";

const ROLE = /^(info|sales|support|admin|contact|hello|team|office|billing|hr|jobs|noreply|no-reply)@/i;
const FREE = /@(gmail|yahoo|hotmail|outlook|icloud|aol|proton(mail)?|gmx)\./i;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const STALE_DAYS = 90;

const rows = readFileSync(process.argv[2], "utf8").trim().split(/\r?\n/);
const head = rows.shift().split(",").map(s => s.trim().toLowerCase());
const col = n => head.indexOf(n);
const ei = col("email"), vi = col("last_verified_at"), di = col("company_domain");

const now = Date.now(), DAY = 864e5;
const bucket = { valid: [], risky: [], invalid: [], free: [], stale: [], missing: [] };
const seen = new Map(); let dupes = 0;

for (const line of rows) {
  const c = line.split(",").map(s => s.trim());
  const email = (c[ei] || "").toLowerCase();
  if (!email) { bucket.missing.push(line); continue; }
  if (!EMAIL.test(email)) { bucket.invalid.push(email); continue; }

  // dedupe on domain+email
  const domain = di >= 0 ? (c[di] || "").toLowerCase() : email.split("@")[1];
  const key = `${domain}|${email}`;
  if (seen.has(key)) { dupes++; continue; }
  seen.set(key, true);

  if (FREE.test(email)) bucket.free.push(email);          // personal inbox, not work email
  else if (ROLE.test(email)) bucket.risky.push(email);    // role address
  else bucket.valid.push(email);                          // passes hygiene — STILL must SMTP-verify

  // freshness flag (independent of bucket)
  if (vi >= 0 && c[vi]) {
    const age = (now - Date.parse(c[vi])) / DAY;
    if (Number.isFinite(age) && age > STALE_DAYS) bucket.stale.push(`${email} (${Math.round(age)}d)`);
  }
}

const n = rows.length;
const pct = x => `${((x / n) * 100).toFixed(1)}%`;
console.log(`\n${n} rows | ${dupes} dupes removed\n`);
for (const k of ["valid", "risky", "invalid", "free", "missing"])
  console.log(`  ${k.padEnd(8)} ${String(bucket[k].length).padStart(5)}  ${pct(bucket[k].length)}`);
console.log(`\n  STALE (>${STALE_DAYS}d, re-verify before send): ${bucket.stale.length}`);
if (bucket.stale.length) console.log("   " + bucket.stale.slice(0, 10).join("\n   "));
console.log(`\nNOTE: "valid" = passed hygiene only. Run a real verifier before sending.\n`);
```

## Common failure modes

- **Trusting provider emails as send-ready.** Pattern-generated guesses aren't SMTP-checked. Always verify before sending — see [[cold-email-deliverability]].
- **Blanket-sending to catch-all domains.** You literally cannot tell valid from invalid on a catch-all; mass-sending guarantees hidden bounces. Corroborate or route to another channel.
- **Parallel waterfall (paying N times).** Fanning out to all providers at once for one field burns credits on answers you didn't need. Sequence, stop at first verified hit.
- **Deduping on display name.** "Bob"/"Robert" at the same domain are one person; name-only dedupe both over-merges distinct people and under-merges the same one. Key on domain+email or LinkedIn URL.
- **No freshness field.** Without `last_verified_at` you can't tell a fresh record from a two-year-old one, so you re-sequence rot. Stamp every record; re-verify past ~90 days.
- **Enriching fields you'll never use.** Every field has a credit cost. Backfill mobile only if you'll dial; pull technographics only if the play references them.
- **Overwriting the raw value with the verified one.** Keep both value and state (and provenance) so you can audit, re-verify, and debug a provider that's feeding you junk.
- **Confusing this with list selection.** Enrichment fills/verifies a chosen list; deciding WHO belongs on it is [[prospect-list-builder]], scoped against your [[icp-persona-builder]].
