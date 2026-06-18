# support@skillshelf.ai — inbox setup

Paste-ready content for the support inbox the connector directory submission
requires. Set up `support@skillshelf.ai` (and alias `security@skillshelf.ai` to
the same inbox, or a separate one) before submitting.

---

## 1. Auto-responder

**Subject:** Thanks — we got your message

**Body:**

> Hi there,
>
> Thanks for reaching out to Skill Me. We've received your message and a human
> will get back to you within **1–2 business days**.
>
> A few things that might help right now:
>
> - **Connect / setup:** https://skillme.dev/connect
> - **Browse the catalog:** https://skillme.dev
> - **Report a bug:** https://github.com/aouellets/skillme/issues
> - **Security issue?** Email security@skillshelf.ai (please don't post security
>   reports publicly).
> - **Privacy / delete my data:** reply to this email with "data deletion" and
>   the request will be handled — see https://skillme.dev/privacy.
>
> — The Skill Me team

> Keep the auto-reply to one message per sender per day (most providers do this
> by default) so threads don't loop.

---

## 2. Canned replies

Short, on-brand templates for the common cases.

### "How do I connect Skill Me to Claude?"

> 1. In Claude, go to **Settings → Connectors → Add custom connector**.
> 2. Paste the MCP URL: `https://skillme.dev/api/mcp`
> 3. Say **"show me skills"** in any conversation.
>
> Skills you install activate automatically in your next session. Full guide:
> https://skillme.dev/connect

### "How do I submit a skill?"

> Skills are accepted via pull request — see our contributing guide:
> https://github.com/aouellets/skillme/blob/main/CONTRIBUTING.md. Every
> submission runs through a safety classifier before it's listed. If you'd rather
> describe the skill and let us draft it, just reply with what it should do and
> who it's for.

### "Is my data private? / What do you store?"

> Skill Me has no login. We store only the skills and packs you install, your
> ratings, and any collections you create — tied to your connection, not to your
> identity. We never read your conversations, Claude memory, or uploaded files.
> Full details: https://skillme.dev/privacy

### "Delete my data" (GDPR/CCPA-style request)

> Happy to help. So we delete the right records, please confirm the connection
> this applies to (and, if you have it, the user token shown by `list_installed`).
> We'll remove all library, rating, and collection records tied to it and confirm
> when it's done — typically within a few business days.

### "A skill looks unsafe / wrong"

> Thanks for flagging it — that's exactly the kind of report we want. Send the
> skill name or URL and what looks off (misleading instructions, anything that
> tries prompt-injection or data exfiltration) to security@skillshelf.ai and
> we'll review and remove it if warranted.

### "Billing / pricing"

> Skill Me is free to connect and install from — there's nothing to pay and no
> account to manage. If you saw a charge attributed to "Skill Me," it isn't from
> us; reply with details and we'll help you track it down.

---

## 3. Routing notes

- **support@** → general questions, setup, data requests.
- **security@** → vulnerability reports (see `SECURITY.md`); can alias to the
  same inbox but should be triaged faster (3-business-day ack).
- Use GitHub Issues for reproducible bugs and catalog data fixes; link people
  there rather than tracking bugs in email.
- Keep a short internal SLA: acknowledge within 1–2 business days, security
  within 3.
