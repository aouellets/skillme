-- ============================================================
-- Migration 0003 — Signed-in engagement: favorites, written reviews,
-- pack submissions, and waitlist → newsletter rename.
--
-- Idempotent. Safe to run multiple times on an existing Skill Me database.
-- Apply via the Supabase SQL editor or `supabase db push`. The same objects
-- are also folded into supabase/schema.sql so a fresh full-schema run includes
-- them.
--
-- Consistent with the existing security model (see 0002_rls_hardening.sql):
-- all user-scoped tables have RLS enabled with NO anon/authenticated policy,
-- so the public anon key is denied; every read/write goes through the
-- service-role key in the API routes.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- USER FAVORITES — one-click "save" of a skill, keyed by auth user.
-- ------------------------------------------------------------
create table if not exists public.user_favorites (
  id         uuid primary key default gen_random_uuid(),
  user_token text not null,
  skill_id   uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_token, skill_id)
);

create index if not exists user_favorites_token_idx on public.user_favorites (user_token);
create index if not exists user_favorites_skill_idx on public.user_favorites (skill_id);

alter table public.user_favorites enable row level security;
-- No policies: service-role only.

-- ------------------------------------------------------------
-- SKILL REVIEWS — written reviews (rating + text) per user per skill.
--
-- The numeric rating remains aggregated from public.user_installs via
-- recompute_skill_rating(); the review API also upserts the rating there so
-- rating_avg / rating_count keep a single source of truth. This table adds the
-- review TEXT plus an author display-name snapshot for public display.
-- ------------------------------------------------------------
create table if not exists public.skill_reviews (
  id          uuid primary key default gen_random_uuid(),
  user_token  text not null,
  skill_id    uuid not null references public.skills(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  body        text not null,
  author_name text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_token, skill_id)
);

create index if not exists skill_reviews_skill_idx
  on public.skill_reviews (skill_id, created_at desc);

alter table public.skill_reviews enable row level security;
-- No policies: service-role only (public read of reviews goes through the
-- service role in server components, scoped to a single skill_id).

-- ------------------------------------------------------------
-- PACK SUBMISSIONS — public submission queue for curated packs, mirroring
-- skill_submissions. A pack references existing skills by slug; the admin
-- approve step resolves slugs → ids and writes packs + pack_skills.
-- ------------------------------------------------------------
create table if not exists public.pack_submissions (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'pending' check (status in (
    'pending', 'in_review', 'approved', 'rejected', 'needs_changes'
  )),
  -- Pack fields (mirror public.packs, minus computed columns)
  name              text not null,
  tagline           text not null,
  description       text not null,
  author            text,
  author_url        text,
  category          text not null check (category in (
    'coding', 'writing', 'research', 'productivity',
    'data', 'design', 'business', 'personal', 'mixed'
  )),
  tags              text[],
  skill_slugs       text[] not null default '{}',  -- skills to include, by slug
  thumbnail_url     text,
  media_alt         text,
  -- Submitter (optional — for follow-up / notifications)
  submitter_email   text,
  submitter_token   text,
  -- Human review
  reviewer_note     text,
  reviewed_at       timestamptz,
  published_pack_id uuid references public.packs(id) on delete set null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists pack_submissions_status_idx
  on public.pack_submissions (status, created_at desc);

alter table public.pack_submissions enable row level security;
-- No policies: all access via the service-role key in API routes.

-- ------------------------------------------------------------
-- NEWSLETTER — rename waitlist → newsletter_signups (the product is live, so
-- the "waitlist" framing is retired). Guarded so the rename runs at most once;
-- safe on databases that already have either name (or neither).
-- ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'waitlist')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'newsletter_signups') THEN
    ALTER TABLE public.waitlist RENAME TO newsletter_signups;
  END IF;
END $$;

-- Ensure the table exists on fresh databases that never had a waitlist table.
create table if not exists public.newsletter_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

alter table public.newsletter_signups enable row level security;
-- No public read — admin only.
