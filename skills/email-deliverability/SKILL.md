---
name: Email Deliverability
description: Protects sender reputation and inbox placement via SPF, DKIM, DMARC, and list hygiene. Use when setting up a new sending domain, diagnosing spam folder placement, or auditing an existing email program.
---

# Email Deliverability

Deliverability is not a one-time configuration task; it is an ongoing discipline. A sender reputation takes months to build and days to destroy. The practices here protect the most valuable channel most marketing teams have.

## Authenticate the Sending Domain on Day One

SPF, DKIM, and DMARC are not optional. SPF declares which servers are allowed to send on the domain's behalf. DKIM signs each message cryptographically. DMARC tells receiving servers what to do with unauthenticated mail and where to send reports. Set DMARC policy to p=quarantine within 30 days of launch and p=reject within 90 days once reports confirm no legitimate mail is failing.

## Warm Up New Sending Domains Slowly

A new IP and domain has no sending history. Start at 200 to 500 sends per day, doubling volume every three to five days while monitoring bounce and complaint rates. Skipping warmup causes inbox providers to block the domain before the list has been reached. Use a dedicated warmup tool or a structured warmup plan from the ESP.

## Keep Hard Bounce Rate Below 0.5 Percent

A hard bounce means the address does not exist. A rate above 0.5 percent signals poor list hygiene to inbox providers. Remove hard bounces immediately and automatically after the first occurrence. Never retry a hard bounce.

## Monitor Complaint Rate and Act Fast

Spam complaints above 0.1 percent trigger filtering at most major inbox providers. Gmail's Postmaster Tools and similar dashboards surface complaint rates in near real time. A spike above the threshold requires pausing sends, auditing the segment, and diagnosing the cause before resuming.

## Sunset Unengaged Subscribers Before They Hurt Reputation

Subscribers who have not opened or clicked in 180 days drag down engagement rates, which inbox providers use as a quality signal. Run a re-permission campaign before the 180-day mark. Suppress those who do not respond. A smaller, engaged list consistently outperforms a large, stale one.

## Use a Subdomain for Marketing Sends

Sending from mail.example.com instead of example.com insulates transactional mail (receipts, password resets) from reputation damage caused by marketing campaigns. Configure the subdomain as a distinct sending identity with its own SPF and DKIM records.
