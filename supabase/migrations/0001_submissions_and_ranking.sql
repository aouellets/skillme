-- ============================================================
-- Migration 0001 — Skill submissions queue + Hot/Featured ranking
--
-- Idempotent. Safe to run multiple times on an existing Skill Me database.
-- Apply via the Supabase SQL editor or `supabase db push`. The same objects
-- are also folded into supabase/schema.sql so a fresh full-schema run includes
-- them.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- SKILL SUBMISSIONS — public submission queue with review workflow
-- ------------------------------------------------------------
create table if not exists public.skill_submissions (
  id                 uuid primary key default gen_random_uuid(),
  status             text not null default 'pending' check (status in (
    'pending', 'in_review', 'approved', 'rejected', 'needs_changes'
  )),
  -- Skill fields (mirror public.skills, minus computed columns)
  name               text not null,
  description        text not null,
  category           text not null check (category in (
    'coding', 'writing', 'research', 'productivity',
    'data', 'design', 'business', 'personal'
  )),
  subcategory        text,
  source_url         text,
  author             text,
  skill_content      text not null,
  tags               text[],
  thumbnail_url      text,
  media_alt          text,
  -- Submitter (optional — for follow-up / notifications)
  submitter_email    text,
  submitter_token    text,
  -- Automated safety classification (best-effort, see lib/safety.ts)
  safety_verdict     text default 'unknown' check (safety_verdict in ('safe', 'unsafe', 'unknown')),
  safety_reason      text,
  classifier_model   text,
  -- Human review
  reviewer_note      text,
  reviewed_at        timestamptz,
  published_skill_id uuid references public.skills(id) on delete set null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index if not exists skill_submissions_status_idx
  on public.skill_submissions (status, created_at desc);
create index if not exists skill_submissions_verdict_idx
  on public.skill_submissions (safety_verdict);

-- Lock the table down: all reads/writes go through the service-role key in the
-- API routes (the public form posts to /api/submit, admins read via the gated
-- admin API). RLS on with no policies => anon blocked, service role bypasses.
alter table public.skill_submissions enable row level security;

-- ------------------------------------------------------------
-- RANKING — hot_score (time-decayed install velocity) + featured ordering
-- ------------------------------------------------------------
alter table public.skills add column if not exists hot_score     numeric default 0;
alter table public.skills add column if not exists featured_rank integer;

create index if not exists skills_hot_score_idx
  on public.skills (hot_score desc);
create index if not exists skills_featured_rank_idx
  on public.skills (featured_rank asc nulls last) where featured = true;

-- Recompute hot_score for every skill.
--   Hot = installs over the last 14 days, each weighted by recency with a
--   7-day half-life, plus ln(1 + install_count) as a small baseline so the
--   Hot section is never empty before real install telemetry accumulates.
-- Run on a schedule (Vercel Cron -> /api/cron/recompute, or pg_cron below).
create or replace function public.recompute_hot_scores()
returns void language sql as $$
  update public.skills s
  set hot_score = coalesce(v.velocity, 0) * 1000 + ln(1 + s.install_count),
      updated_at = now()
  from (
    select sk.id,
           sum(power(0.5, extract(epoch from (now() - ui.installed_at)) / (7 * 86400.0))) as velocity
    from public.skills sk
    left join public.user_installs ui
      on ui.skill_id = sk.id
     and ui.installed_at > now() - interval '14 days'
    group by sk.id
  ) v
  where v.id = s.id;
$$;

-- Seed hot_score from install_count on first run so ordering works immediately,
-- before the first scheduled recompute. Only touches un-scored rows.
update public.skills
set hot_score = ln(1 + install_count)
where hot_score is null or hot_score = 0;

-- Optional: schedule the recompute hourly with pg_cron (uncomment if enabled).
-- create extension if not exists pg_cron;
-- select cron.schedule('recompute-hot-scores', '0 * * * *', 'select public.recompute_hot_scores()');
