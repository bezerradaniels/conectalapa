-- ============================================================================
-- 20260906010200_core_content_tables.sql
-- Core content tables: businesses, events, packages, lodging, dining, submissions,
-- plus join tables and galleries.
--
-- RATIONALE:
-- 1. Status: Enforced via CHECK constraint (`status in ('draft', 'published', 'archived')`)
--    rather than a Postgres enum to eliminate migration table locks when altering types.
-- 2. Opening Hours: Modeled as `jsonb` with documented schema:
--    `[{"day": 0, "open": "08:00", "close": "18:00", "closed": false}, ...]`
--    Rationale: Significantly simpler to edit in admin forms, loads in a single query
--    without 7-row joins, and is queryable in Postgres jsonb operators.
-- 3. Galleries: Modeled with explicit foreign keys per entity (`business_id`, `event_id`, etc.)
--    with `on delete cascade`. Rationale: Polymorphic tables lose Postgres foreign key
--    integrity; explicit columns guarantee clean cascade deletes when an entity is removed.
-- 4. Packages Agency: `agency_id` is a foreign key to `businesses(id) on delete set null`,
--    with denormalized fallback columns `agency_name` and `agency_whatsapp`. Rationale:
--    Phase 7 admin flow can handle tour packages where the operating agency is not yet
--    registered as a full business profile.
-- 5. Timestamps: America/Bahia timezone stored as `timestamptz`.
-- ============================================================================

-- 1. businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  logo_url text,
  category_id uuid references public.categories(id) on delete set null,
  address text,
  whatsapp text,
  instagram text,
  services text[] default '{}'::text[],
  opening_hours jsonb default '[]'::jsonb,
  additional_links jsonb default '[]'::jsonb, -- array of { label: text, url: text }
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_businesses_updated_at
  before update on public.businesses
  for each row
  execute function public.set_updated_at();

-- 2. events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  whatsapp text,
  instagram text,
  promotional_image_url text,
  image_aspect_ratio text default '1:1' check (image_aspect_ratio in ('1:1', '4:5', '16:9')),
  ticket_price numeric(10,2), -- null means free; null is NOT 0
  ticket_price_description text, -- e.g. "Preço a confirmar", "1º Lote", etc.
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  address text,
  venue_name text,
  description text,
  restrictions text[] default '{}'::text[],
  links jsonb default '[]'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_events_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

-- 3. packages
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  departure_location text not null default 'Bom Jesus da Lapa',
  departure_date date not null,
  return_date date not null,
  agency_id uuid references public.businesses(id) on delete set null,
  agency_name text,
  agency_whatsapp text,
  information text,
  price numeric(10,2),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_packages_updated_at
  before update on public.packages
  for each row
  execute function public.set_updated_at();

-- 4. lodging
create table if not exists public.lodging (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  lodging_type text not null check (lodging_type in ('hotel', 'pousada', 'guesthouse', 'resort', 'other')),
  address text,
  description text,
  whatsapp text,
  instagram text,
  price_range text check (price_range in ('$', '$$', '$$$', '$$$$')),
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lodging_updated_at
  before update on public.lodging
  for each row
  execute function public.set_updated_at();

-- 5. dining
create table if not exists public.dining (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  restaurant_type text not null, -- churrascaria, pizzeria, lanchonete, cafeteria, etc.
  address text,
  whatsapp text,
  instagram text,
  opening_hours jsonb default '[]'::jsonb,
  price_range text check (price_range in ('$', '$$', '$$$', '$$$$')),
  description text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_dining_updated_at
  before update on public.dining
  for each row
  execute function public.set_updated_at();

-- 6. submissions (public requests)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  target_domain text not null check (target_domain in ('business', 'event', 'package', 'lodging', 'dining')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  review_notes text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_submissions_updated_at
  before update on public.submissions
  for each row
  execute function public.set_updated_at();

-- 7. Amenity Join Tables
create table if not exists public.business_amenities (
  business_id uuid references public.businesses(id) on delete cascade,
  amenity_id uuid references public.amenities(id) on delete cascade,
  primary key (business_id, amenity_id)
);

create table if not exists public.event_amenities (
  event_id uuid references public.events(id) on delete cascade,
  amenity_id uuid references public.amenities(id) on delete cascade,
  primary key (event_id, amenity_id)
);

create table if not exists public.package_amenities (
  package_id uuid references public.packages(id) on delete cascade,
  amenity_id uuid references public.amenities(id) on delete cascade,
  primary key (package_id, amenity_id)
);

create table if not exists public.lodging_amenities (
  lodging_id uuid references public.lodging(id) on delete cascade,
  amenity_id uuid references public.amenities(id) on delete cascade,
  primary key (lodging_id, amenity_id)
);

create table if not exists public.dining_amenities (
  dining_id uuid references public.dining(id) on delete cascade,
  amenity_id uuid references public.amenities(id) on delete cascade,
  primary key (dining_id, amenity_id)
);

-- 8. Galleries table
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  lodging_id uuid references public.lodging(id) on delete cascade,
  dining_id uuid references public.dining(id) on delete cascade,
  image_url text not null,
  caption text,
  aspect_ratio text default '1:1',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint chk_gallery_owner check (
    (business_id is not null)::int +
    (event_id is not null)::int +
    (lodging_id is not null)::int +
    (dining_id is not null)::int = 1
  )
);

create index if not exists idx_galleries_business on public.galleries(business_id);
create index if not exists idx_galleries_event on public.galleries(event_id);
create index if not exists idx_galleries_lodging on public.galleries(lodging_id);
create index if not exists idx_galleries_dining on public.galleries(dining_id);
