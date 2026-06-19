-- ------------------------------------------------------------
-- Pack GitHub repos. Each in-house pack can publish to its own
-- repository under the Skill Me org so users can star it (a real,
-- honest engagement signal). repo_url links the catalog pack to
-- that repository; the pack detail page renders a "Star on GitHub"
-- call to action when it is set.
-- ------------------------------------------------------------
alter table public.packs add column if not exists repo_url text;
