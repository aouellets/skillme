-- Run this in the Supabase SQL editor.
-- Safe to run multiple times (uses IF NOT EXISTS and CREATE OR REPLACE).
-- After running, execute: npm run db:seed

-- SkillShelf database schema
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

-- Row Level Security
alter table public.skills enable row level security;
alter table public.user_installs enable row level security;

drop policy if exists "skills are public" on public.skills;
create policy "skills are public" on public.skills for select using (true);

drop policy if exists "anon installs" on public.user_installs;
create policy "anon installs" on public.user_installs for all using (true) with check (true);
