-- ============================================================================
-- 20260906010300_core_indexes_and_fts.sql
-- B-Tree indexes and GIN Full-Text Search indexes across content tables.
-- ============================================================================

-- Immutable wrapper for unaccent to allow expression indexing in Postgres
create or replace function public.immutable_unaccent(text)
returns text
language sql
immutable
parallel safe
as $$
  select extensions.unaccent($1);
$$;

-- 1. B-Tree indexes for status, category, date, and slug
create index if not exists idx_businesses_status on public.businesses (status);
create index if not exists idx_businesses_category on public.businesses (category_id);

create index if not exists idx_events_status on public.events (status);
create index if not exists idx_events_category on public.events (category_id);
create index if not exists idx_events_start_datetime on public.events (start_datetime);

create index if not exists idx_packages_status on public.packages (status);
create index if not exists idx_packages_category on public.packages (category_id);
create index if not exists idx_packages_departure_date on public.packages (departure_date);

create index if not exists idx_lodging_status on public.lodging (status);
create index if not exists idx_lodging_category on public.lodging (category_id);

create index if not exists idx_dining_status on public.dining (status);
create index if not exists idx_dining_category on public.dining (category_id);

create index if not exists idx_submissions_status on public.submissions (status);
create index if not exists idx_submissions_created_at on public.submissions (created_at desc);

-- 2. GIN Full-Text Search indexes for Phase 5 search feature
create index if not exists idx_businesses_fts on public.businesses using gin (
  to_tsvector('portuguese', public.immutable_unaccent(coalesce(name, '') || ' ' || coalesce(description, '')))
);

create index if not exists idx_events_fts on public.events using gin (
  to_tsvector('portuguese', public.immutable_unaccent(coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(venue_name, '')))
);

create index if not exists idx_packages_fts on public.packages using gin (
  to_tsvector('portuguese', public.immutable_unaccent(coalesce(destination, '') || ' ' || coalesce(information, '')))
);

create index if not exists idx_lodging_fts on public.lodging using gin (
  to_tsvector('portuguese', public.immutable_unaccent(coalesce(name, '') || ' ' || coalesce(description, '')))
);

create index if not exists idx_dining_fts on public.dining using gin (
  to_tsvector('portuguese', public.immutable_unaccent(coalesce(name, '') || ' ' || coalesce(description, '')))
);
