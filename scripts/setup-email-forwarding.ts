/**
 * Sets up Cloudflare Email Routing for skillshelf.ai so support@ and security@
 * forward to the operator inbox. DNS for skillshelf.ai is on Cloudflare, so this
 * is the native, free path.
 *
 * Operator steps:
 *   1. Create a Cloudflare API token scoped to the skillshelf.ai zone with:
 *        - Account → Email Routing Addresses → Edit
 *        - Zone    → Email Routing Rules     → Edit
 *        - Zone    → DNS                      → Edit
 *   2. Put it in .env.local as CLOUDFLARE_API_TOKEN=...
 *   3. Run:  npm run setup:email
 *   4. Click the verification link Cloudflare emails to the destination inbox.
 *      (Only the destination owner can do this — it cannot be automated.)
 *
 * The script is idempotent: re-running it skips anything already configured.
 */
import { config } from 'dotenv'

config({ path: '.env.local' })
config()

const API = 'https://api.cloudflare.com/client/v4'
const TOKEN = process.env.CLOUDFLARE_API_TOKEN

const DOMAIN = 'skillshelf.ai'
const DESTINATION = 'alexander.ouellet@icloud.com'
const ADDRESSES = ['support', 'security'] // → support@skillshelf.ai, security@skillshelf.ai

interface CfResponse<T = unknown> {
  success: boolean
  errors: Array<{ code: number; message: string }>
  result: T
}

async function cf<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<CfResponse<T>> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  return (await res.json()) as CfResponse<T>
}

/** Treat a "already exists / already enabled" error as a non-fatal skip. */
function isAlreadyDone(r: CfResponse): boolean {
  return r.errors?.some((e) =>
    /already|exists|enabled|duplicate/i.test(e.message)
  )
}

async function main() {
  if (!TOKEN) {
    console.error(
      'Missing CLOUDFLARE_API_TOKEN. Add a scoped token to .env.local (see the\n' +
        'header of this file for the required permissions), then re-run.'
    )
    process.exit(1)
  }

  // 1. Resolve zone + account.
  const zones = await cf<Array<{ id: string; account: { id: string } }>>(
    `/zones?name=${DOMAIN}`
  )
  if (!zones.success || zones.result.length === 0) {
    console.error(`Could not find the ${DOMAIN} zone (check the token's zone scope).`)
    console.error(JSON.stringify(zones.errors, null, 2))
    process.exit(1)
  }
  const zoneId = zones.result[0].id
  const accountId = zones.result[0].account.id
  console.log(`✓ Zone ${DOMAIN} (${zoneId}), account ${accountId}`)

  // 2. Add the destination address (triggers a verification email).
  const dest = await cf(`/accounts/${accountId}/email/routing/addresses`, {
    method: 'POST',
    body: JSON.stringify({ email: DESTINATION }),
  })
  if (dest.success) console.log(`✓ Destination added: ${DESTINATION} — check that inbox to verify`)
  else if (isAlreadyDone(dest)) console.log(`• Destination ${DESTINATION} already added`)
  else console.warn(`! Destination add failed: ${JSON.stringify(dest.errors)}`)

  // 3. Enable Email Routing (provisions MX + SPF/DMARC records).
  const enable = await cf(`/zones/${zoneId}/email/routing/enable`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
  if (enable.success) console.log('✓ Email Routing enabled (DNS records provisioned)')
  else if (isAlreadyDone(enable)) console.log('• Email Routing already enabled')
  else console.warn(`! Enable failed (may need DNS records added manually): ${JSON.stringify(enable.errors)}`)

  // 4. Create the forwarding rules.
  for (const local of ADDRESSES) {
    const addr = `${local}@${DOMAIN}`
    const rule = await cf(`/zones/${zoneId}/email/routing/rules`, {
      method: 'POST',
      body: JSON.stringify({
        name: `forward-${local}`,
        enabled: true,
        matchers: [{ type: 'literal', field: 'to', value: addr }],
        actions: [{ type: 'forward', value: [DESTINATION] }],
      }),
    })
    if (rule.success) console.log(`✓ Rule: ${addr} → ${DESTINATION}`)
    else if (isAlreadyDone(rule)) console.log(`• Rule for ${addr} already exists`)
    else console.warn(`! Rule for ${addr} failed: ${JSON.stringify(rule.errors)}`)
  }

  // 5. Show the required DNS records so the operator can confirm them.
  const dns = await cf<Array<{ type: string; name: string; content: string; priority?: number }>>(
    `/zones/${zoneId}/email/routing/dns`
  )
  if (dns.success && Array.isArray(dns.result)) {
    console.log('\nRequired DNS records (should now exist in Cloudflare):')
    for (const r of dns.result) {
      console.log(`  ${r.type.padEnd(4)} ${r.name}  ${r.priority ?? ''} ${r.content}`)
    }
  }

  console.log(
    '\nNext (operator-only): open the verification email Cloudflare sent to\n' +
      `${DESTINATION} and click the link. Forwarding goes live within minutes.\n` +
      `Verify with:  dig +short MX ${DOMAIN}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
