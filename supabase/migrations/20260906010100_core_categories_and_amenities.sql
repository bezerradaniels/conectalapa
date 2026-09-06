-- ============================================================================
-- 20260906010100_core_categories_and_amenities.sql
-- Consolidated categories and amenities schema with domain discriminator.
--
-- RATIONALE:
-- 1. Categories: We chose a normalized `categories` table with a `domain` discriminator
--    instead of a Postgres enum. Administrators need to add, rename, and manage
--    categories dynamically from the admin panel without requiring code deploys or
--    schema migrations.
-- 2. Amenities: We chose a shared `amenities` table with domain-specific join tables
--    instead of five parallel `text[]` columns. This guarantees consistent naming,
--    enables relational filtering ("find all hotels with pool and wifi"), and allows
--    future icon/attribute enhancements.
-- ============================================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  domain text not null check (domain in ('business', 'event', 'package', 'lodging', 'dining')),
  description text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

create index if not exists idx_categories_domain on public.categories (domain);
create index if not exists idx_categories_slug on public.categories (slug);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  domain text check (domain is null or domain in ('business', 'event', 'package', 'lodging', 'dining')),
  icon text,
  created_at timestamptz not null default now(),
  constraint uq_amenity_slug_domain unique (slug, domain)
);

create index if not exists idx_amenities_domain on public.amenities (domain);
