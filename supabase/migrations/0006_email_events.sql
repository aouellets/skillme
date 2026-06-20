-- Resend webhook event log + suppression support.
-- Idempotent. Safe to run multiple times on an existing Skill Me database.
--
-- /api/webhooks/resend writes every delivery event here (sent, delivered,
-- bounced, complained, opened, clicked, ...) for analytics, and suppresses
-- newsletter recipients on hard bounce / spam complaint via
-- newsletter_signups.unsubscribed_at (added in 0005).

create table if not exists public.email_events (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                 -- e.g. email.delivered, email.bounced
  email_id    text,                          -- Resend email id (data.email_id)
  recipient   text,                          -- first to-address, lowercased
  subject     text,
  occurred_at timestamptz,                   -- event time reported by Resend
  payload     jsonb not null,                -- full webhook body
  created_at  timestamptz not null default now()
);

create index if not exists email_events_email_id_idx on public.email_events (email_id);
create index if not exists email_events_type_idx on public.email_events (type);
create index if not exists email_events_recipient_idx on public.email_events (recipient);
create index if not exists email_events_created_at_idx on public.email_events (created_at desc);

-- Lock down: only the service role (which bypasses RLS) writes/reads this.
-- No policies → anon/authenticated are denied, matching 0002 hardening.
alter table public.email_events enable row level security;
