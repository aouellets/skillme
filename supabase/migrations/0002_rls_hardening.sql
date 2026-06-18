-- ============================================================
-- 0002 — Security hardening
--
-- Context: every read/write of the user-scoped tables happens
-- server-side through the service-role key (see lib/collections.ts,
-- app/api/rate, app/library). No browser code touches these tables
-- with the anon key. The old `FOR ALL USING (true) WITH CHECK (true)`
-- policies therefore added no app functionality but let anyone with the
-- public anon key read/write/delete ANY user's installs and private
-- collections via the REST API. Drop them so RLS denies anon/authenticated
-- by default; the service role still bypasses RLS for the app's own access.
-- ============================================================

drop policy if exists "anon installs"            on public.user_installs;
drop policy if exists "anon pack installs"       on public.user_pack_installs;
drop policy if exists "anon user collections"    on public.user_collections;
drop policy if exists "anon collection skills"   on public.collection_skills;

-- RLS stays enabled (no policies => deny to anon/authenticated; service role bypasses).
alter table public.user_installs        enable row level security;
alter table public.user_pack_installs   enable row level security;
alter table public.user_collections     enable row level security;
alter table public.collection_skills    enable row level security;

-- Public catalog read access is intentional and unchanged:
--   skills / packs / pack_skills keep their "... are public" SELECT policies.

-- ------------------------------------------------------------
-- Lock down the anon-executable SECURITY DEFINER event-trigger helper.
-- It only does anything inside a DDL event-trigger context, but it should
-- never be callable from the public REST API.
-- ------------------------------------------------------------
-- Default function EXECUTE is granted to PUBLIC, so revoke from PUBLIC
-- (covers anon + authenticated + every other role).
revoke execute on function public.rls_auto_enable() from public;

-- ------------------------------------------------------------
-- Pin search_path on our functions (defense-in-depth; clears the linter
-- "function_search_path_mutable" warning). All references are schema-qualified.
-- ------------------------------------------------------------
alter function public.increment_install_count(uuid)      set search_path = public, pg_catalog;
alter function public.recompute_skill_rating(uuid)       set search_path = public, pg_catalog;
alter function public.increment_pack_install_count(uuid) set search_path = public, pg_catalog;
alter function public.recompute_hot_scores()             set search_path = public, pg_catalog;
alter function public.skills_fts_update()                set search_path = public, pg_catalog;
