-- ------------------------------------------------------------
-- Semantic recommender: pgvector embeddings for skills and packs.
--
-- Stores one embedding per catalog row (computed offline by
-- scripts/embed-catalog.ts via the Vercel AI Gateway) plus a content
-- hash so the backfill can skip rows whose embedding input is unchanged.
-- The match_* RPCs do cosine top-k and run SECURITY INVOKER, so the
-- existing "public read" policies on skills/packs already scope them to
-- catalog rows — no SECURITY DEFINER, no new exposure.
--
-- Dimension (1536) is coupled to the embedding model
-- (openai/text-embedding-3-small). Changing the model to a different
-- dimensionality requires altering these columns and re-embedding.
-- ------------------------------------------------------------

create extension if not exists vector;

-- Embedding storage (nullable — a row is simply unrecommendable until embedded).
alter table public.skills add column if not exists embedding      vector(1536);
alter table public.skills add column if not exists embedding_hash text;
alter table public.packs  add column if not exists embedding      vector(1536);
alter table public.packs  add column if not exists embedding_hash text;

-- Cosine-distance ANN indexes. HNSW is fine to build with zero rows; it fills
-- in as the backfill writes embeddings.
create index if not exists skills_embedding_idx
  on public.skills using hnsw (embedding vector_cosine_ops);
create index if not exists packs_embedding_idx
  on public.packs using hnsw (embedding vector_cosine_ops);

-- Cosine top-k over skills. Returns similarity in [0,1] (1 = identical).
-- `<=>` is pgvector's cosine-distance operator; similarity = 1 - distance.
create or replace function public.match_skills(
  query_embedding vector(1536),
  match_count int default 20,
  exclude_ids uuid[] default '{}'
)
returns table (
  id          uuid,
  slug        text,
  name        text,
  description text,
  category    text,
  tags        text[],
  similarity  float
)
language sql stable
as $$
  select s.id, s.slug, s.name, s.description, s.category, s.tags,
         1 - (s.embedding <=> query_embedding) as similarity
  from public.skills s
  where s.embedding is not null
    and not (s.id = any(exclude_ids))
  order by s.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

-- Cosine top-k over packs.
create or replace function public.match_packs(
  query_embedding vector(1536),
  match_count int default 5,
  exclude_ids uuid[] default '{}'
)
returns table (
  id          uuid,
  slug        text,
  name        text,
  tagline     text,
  description text,
  category    text,
  tags        text[],
  similarity  float
)
language sql stable
as $$
  select p.id, p.slug, p.name, p.tagline, p.description, p.category, p.tags,
         1 - (p.embedding <=> query_embedding) as similarity
  from public.packs p
  where p.embedding is not null
    and not (p.id = any(exclude_ids))
  order by p.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

grant execute on function public.match_skills(vector, int, uuid[]) to anon, authenticated;
grant execute on function public.match_packs(vector, int, uuid[])  to anon, authenticated;
