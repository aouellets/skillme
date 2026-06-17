-- Run this in the Supabase SQL editor.
-- Safe to run multiple times (uses IF NOT EXISTS and CREATE OR REPLACE).
-- After running, execute: npm run db:seed

-- Skill Me database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text not null,
  category      text not null check (category in (
    'coding', 'writing', 'research', 'productivity',
    'data', 'design', 'business', 'personal'
  )),
  subcategory   text,
  source_url    text,
  author        text,
  skill_content text not null,
  install_count integer default 0,
  rating_avg    numeric(3,2) default 0,
  rating_count  integer default 0,
  verified      boolean default false,
  featured      boolean default false,
  free          boolean default true,
  tags          text[],
  -- Media fields for animated thumbnails
  thumbnail_url    text,           -- Static image (PNG/JPG/WebP) 1200×630
  thumbnail_gif    text,           -- Animated GIF URL (plays on hover)
  thumbnail_video  text,           -- Short MP4/WebM loop URL (< 10s)
  thumbnail_lottie text,           -- Lottie JSON URL for vector animation
  media_alt        text,           -- Alt text for accessibility
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  -- Full-text search vector (populated by trigger below)
  fts tsvector
);

create table if not exists public.user_installs (
  id           uuid primary key default gen_random_uuid(),
  user_token   text not null,
  skill_id     uuid references public.skills(id) on delete cascade,
  active       boolean default true,
  rating       integer check (rating between 1 and 5),
  installed_at timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (user_token, skill_id)
);

-- ============================================================
-- PACKS — curated bundles created by skill publishers or admins
-- ============================================================
create table if not exists public.packs (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  tagline       text not null,            -- one sentence, shown in cards
  description   text not null,            -- full description, shown on detail page
  author        text not null,            -- display name of the curator
  author_url    text,                     -- link to author's site/profile
  category      text not null check (category in (
    'coding', 'writing', 'research', 'productivity',
    'data', 'design', 'business', 'personal', 'mixed'
  )),
  tags          text[],
  thumbnail_url text,
  thumbnail_gif text,
  media_alt     text,
  install_count integer default 0,
  featured      boolean default false,
  verified      boolean default false,    -- reviewed by Skill Me
  free          boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Which skills are in each pack (ordered)
create table if not exists public.pack_skills (
  id         uuid primary key default gen_random_uuid(),
  pack_id    uuid not null references public.packs(id) on delete cascade,
  skill_id   uuid not null references public.skills(id) on delete cascade,
  position   integer not null default 0,  -- display order within the pack
  added_at   timestamptz default now(),
  unique (pack_id, skill_id)
);

-- ============================================================
-- USER COLLECTIONS — personal, user-created shelves
-- ============================================================
create table if not exists public.user_collections (
  id            uuid primary key default gen_random_uuid(),
  user_token    text not null,
  slug          text not null,             -- user-defined, unique per user
  name          text not null,
  description   text,
  public        boolean default false,     -- false = private, true = shareable link
  share_token   text unique default gen_random_uuid()::text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (user_token, slug)
);

-- Which skills are in each user collection
create table if not exists public.collection_skills (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.user_collections(id) on delete cascade,
  skill_id      uuid not null references public.skills(id) on delete cascade,
  position      integer not null default 0,
  added_at      timestamptz default now(),
  unique (collection_id, skill_id)
);

-- Track which packs a user has installed
create table if not exists public.user_pack_installs (
  id           uuid primary key default gen_random_uuid(),
  user_token   text not null,
  pack_id      uuid not null references public.packs(id) on delete cascade,
  installed_at timestamptz default now(),
  unique (user_token, pack_id)
);

-- Populate the fts column via trigger (avoids generated column syntax issues)
create or replace function public.skills_fts_update()
returns trigger language plpgsql as $$
begin
  new.fts := to_tsvector('english',
    coalesce(new.name, '') || ' ' || coalesce(new.description, '')
  );
  return new;
end;
$$;

drop trigger if exists skills_fts_trigger on public.skills;
create trigger skills_fts_trigger
  before insert or update on public.skills
  for each row execute function public.skills_fts_update();

-- Backfill fts for any existing rows
update public.skills set fts = to_tsvector('english',
  coalesce(name, '') || ' ' || coalesce(description, '')
) where fts is null;

-- Indexes
create index if not exists skills_category_idx on public.skills (category);
create index if not exists skills_install_count_idx on public.skills (install_count desc);
create index if not exists skills_featured_idx on public.skills (featured) where featured = true;
create index if not exists skills_verified_idx on public.skills (verified) where verified = true;
create index if not exists skills_fts_idx on public.skills using gin (fts);
create index if not exists user_installs_token_idx on public.user_installs (user_token);
create index if not exists packs_category_idx    on public.packs (category);
create index if not exists packs_featured_idx    on public.packs (featured) where featured = true;
create index if not exists pack_skills_pack_idx  on public.pack_skills (pack_id);
create index if not exists ucollections_user_idx on public.user_collections (user_token);
create index if not exists ucollections_share_idx on public.user_collections (share_token);
create index if not exists coll_skills_coll_idx  on public.collection_skills (collection_id);
create index if not exists upacks_user_idx       on public.user_pack_installs (user_token);

-- Atomically increment a skill's install counter.
create or replace function public.increment_install_count(p_skill_id uuid)
returns void
language sql
as $$
  update public.skills
  set install_count = install_count + 1,
      updated_at = now()
  where id = p_skill_id;
$$;

-- Recompute a skill's rating aggregates from all user ratings.
create or replace function public.recompute_skill_rating(p_skill_id uuid)
returns void
language sql
as $$
  update public.skills s
  set rating_count = sub.cnt,
      rating_avg = coalesce(sub.avg, 0),
      updated_at = now()
  from (
    select count(rating) as cnt,
           avg(rating)::numeric(3,2) as avg
    from public.user_installs
    where skill_id = p_skill_id and rating is not null
  ) sub
  where s.id = p_skill_id;
$$;

-- Atomically increment a pack's install counter.
create or replace function public.increment_pack_install_count(p_pack_id uuid)
returns void language sql as $$
  update public.packs
  set install_count = install_count + 1,
      updated_at    = now()
  where id = p_pack_id;
$$;

-- Row Level Security
alter table public.skills enable row level security;
alter table public.user_installs enable row level security;

drop policy if exists "skills are public" on public.skills;
create policy "skills are public" on public.skills for select using (true);

drop policy if exists "anon installs" on public.user_installs;
create policy "anon installs" on public.user_installs for all using (true) with check (true);

-- Media column migration (safe to run on existing tables)
alter table public.skills add column if not exists thumbnail_url    text;
alter table public.skills add column if not exists thumbnail_gif    text;
alter table public.skills add column if not exists thumbnail_video  text;
alter table public.skills add column if not exists thumbnail_lottie text;
alter table public.skills add column if not exists media_alt        text;

-- Pack / collection RLS
alter table public.packs enable row level security;
alter table public.pack_skills enable row level security;
alter table public.user_pack_installs enable row level security;
alter table public.user_collections enable row level security;
alter table public.collection_skills enable row level security;

drop policy if exists "packs are public" on public.packs;
create policy "packs are public"       on public.packs for select using (true);

drop policy if exists "pack_skills are public" on public.pack_skills;
create policy "pack_skills are public" on public.pack_skills for select using (true);

drop policy if exists "anon pack installs" on public.user_pack_installs;
create policy "anon pack installs"     on public.user_pack_installs for all using (true) with check (true);

drop policy if exists "anon user collections" on public.user_collections;
create policy "anon user collections"  on public.user_collections for all using (true) with check (true);

drop policy if exists "anon collection skills" on public.collection_skills;
create policy "anon collection skills" on public.collection_skills for all using (true) with check (true);

-- ============================================================
-- WAITLIST — email capture for new-skill notifications
-- ============================================================
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;
-- No public read — admin only

-- ============================================================
-- SKILL SUBMISSIONS — public submission queue with review workflow
-- (see supabase/migrations/0001_submissions_and_ranking.sql)
-- ============================================================
create table if not exists public.skill_submissions (
  id                 uuid primary key default gen_random_uuid(),
  status             text not null default 'pending' check (status in (
    'pending', 'in_review', 'approved', 'rejected', 'needs_changes'
  )),
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
  submitter_email    text,
  submitter_token    text,
  safety_verdict     text default 'unknown' check (safety_verdict in ('safe', 'unsafe', 'unknown')),
  safety_reason      text,
  classifier_model   text,
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

alter table public.skill_submissions enable row level security;
-- No policies: all access via the service-role key in API routes.

-- ============================================================
-- RANKING — hot_score (time-decayed install velocity) + featured ordering
-- ============================================================
alter table public.skills add column if not exists hot_score     numeric default 0;
alter table public.skills add column if not exists featured_rank integer;

create index if not exists skills_hot_score_idx
  on public.skills (hot_score desc);
create index if not exists skills_featured_rank_idx
  on public.skills (featured_rank asc nulls last) where featured = true;

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

update public.skills
set hot_score = ln(1 + install_count)
where hot_score is null or hot_score = 0;

-- ============================================================
-- Safe migration: confirms the packs tables exist on an existing deployment.
-- The tables themselves are created by the `create table if not exists` blocks
-- above; running this whole file on an existing DB is safe and idempotent.
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'packs') THEN
    RAISE NOTICE 'packs table does not exist — run the full schema.sql';
  ELSE
    RAISE NOTICE 'packs tables already exist — migration skipped';
  END IF;
END $$;
