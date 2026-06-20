-- Newsletter unsubscribe support.
-- Idempotent. Safe to run multiple times on an existing Skill Me database.
--
-- Adds a soft-unsubscribe timestamp so the digest sender can exclude opted-out
-- addresses without deleting the row (preserves re-subscribe history).

alter table if exists public.newsletter_signups
  add column if not exists unsubscribed_at timestamptz;

-- Partial index: the sender only ever scans active (not-unsubscribed) signups.
create index if not exists newsletter_signups_active_idx
  on public.newsletter_signups (created_at)
  where unsubscribed_at is null;
