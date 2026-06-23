-- ------------------------------------------------------------
-- Full-text search wiring for keyword search (browse + MCP browse_*).
--
-- Before this, keyword search used a single `ILIKE '%term%'` over
-- name/description only, so multi-word queries had to match as one
-- adjacent substring, tags were never searched, and there was no
-- stemming — relevant rows were routinely missed on the first pass.
--
-- The `skills.fts` tsvector + GIN index already existed but was never
-- queried, and it only covered name+description. This migration:
--   1. Extends skills.fts to a *weighted* vector over
--      name (A) + tags + category (B) + description (C), and backfills.
--   2. Adds the same fts column + trigger + GIN index to `packs`
--      (name+tagline+tags+description), which had none.
--
-- The app queries these via PostgREST `.textSearch('fts', q, {config:'english'})`
-- with a prefix + AND tsquery (see lib/search.ts toTsQuery), so the
-- index config ('english') must match the query config.
--
-- Idempotent: CREATE OR REPLACE / IF NOT EXISTS throughout.
-- After running, no re-seed is required (the backfill updates rows in place;
-- future writes fire the triggers).
-- ------------------------------------------------------------

-- ---- skills.fts: weighted, now includes tags + category --------------------
create or replace function public.skills_fts_update()
returns trigger language plpgsql as $$
begin
  new.fts :=
       setweight(to_tsvector('english', coalesce(new.name, '')), 'A')
    || setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.category, '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$;

drop trigger if exists skills_fts_trigger on public.skills;
create trigger skills_fts_trigger
  before insert or update on public.skills
  for each row execute function public.skills_fts_update();

-- Backfill every existing row through the new definition.
update public.skills
set fts =
       setweight(to_tsvector('english', coalesce(name, '')), 'A')
    || setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B')
    || setweight(to_tsvector('english', coalesce(category, '')), 'B')
    || setweight(to_tsvector('english', coalesce(description, '')), 'C');

create index if not exists skills_fts_idx on public.skills using gin (fts);

-- ---- packs.fts: new column + trigger + index -------------------------------
alter table public.packs add column if not exists fts tsvector;

create or replace function public.packs_fts_update()
returns trigger language plpgsql as $$
begin
  new.fts :=
       setweight(to_tsvector('english', coalesce(new.name, '')), 'A')
    || setweight(to_tsvector('english', coalesce(new.tagline, '')), 'B')
    || setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$;

drop trigger if exists packs_fts_trigger on public.packs;
create trigger packs_fts_trigger
  before insert or update on public.packs
  for each row execute function public.packs_fts_update();

update public.packs
set fts =
       setweight(to_tsvector('english', coalesce(name, '')), 'A')
    || setweight(to_tsvector('english', coalesce(tagline, '')), 'B')
    || setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B')
    || setweight(to_tsvector('english', coalesce(description, '')), 'C');

create index if not exists packs_fts_idx on public.packs using gin (fts);
