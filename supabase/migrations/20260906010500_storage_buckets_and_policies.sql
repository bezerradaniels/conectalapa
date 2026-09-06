-- ============================================================================
-- 20260906010500_storage_buckets_and_policies.sql
-- Configure storage buckets (`logos`, `galleries`, `events`) and RLS policies.
--
-- PATH CONVENTION:
-- `{bucket}/{domain}/{entity_id}/{uuid}.{ext}`
-- Example: `logos/business/1b586b8a-88ec-4fcc-865d-3cea60067d91/3fa85f64-5717-4562-b3fc-2c963f66afa6.webp`
-- Ad-hoc paths are strictly prohibited to allow automated orphan cleanup routines.
--
-- RESIZING STRATEGY:
-- Supabase Image Transformations (dynamic on-demand URL transformations).
-- Images are uploaded in original high resolution (up to 5MB max, webp/jpeg/png).
-- The frontend requests resized assets using Supabase CDN query parameters:
-- `?width=400&height=300&resize=cover&quality=80`
-- Rationale: Eliminates client-side/edge preprocessing complexity and storage
-- duplication while providing responsive sizes for cards, thumbnails, and heroes.
--
-- MIME RESTRICTION:
-- Strictly `image/jpeg`, `image/png`, `image/webp`. SVG is rejected to eliminate
-- script-injection / stored XSS attack vectors.
-- ============================================================================

-- 1. Create or configure storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('galleries', 'galleries', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('events', 'events', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage RLS Policies
-- Public read on logos, galleries, and events buckets
drop policy if exists "Public read for app buckets" on storage.objects;
create policy "Public read for app buckets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('logos', 'galleries', 'events'));

-- Admin upload: Note that upsert in Supabase Storage requires INSERT + SELECT + UPDATE
drop policy if exists "Admin insert for app buckets" on storage.objects;
create policy "Admin insert for app buckets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('logos', 'galleries', 'events')
    and public.is_admin()
  );

drop policy if exists "Admin update for app buckets" on storage.objects;
create policy "Admin update for app buckets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('logos', 'galleries', 'events')
    and public.is_admin()
  )
  with check (
    bucket_id in ('logos', 'galleries', 'events')
    and public.is_admin()
  );

drop policy if exists "Admin delete for app buckets" on storage.objects;
create policy "Admin delete for app buckets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('logos', 'galleries', 'events')
    and public.is_admin()
  );
