-- ============================================================================
-- 20260906010600_search_cross_domain.sql
-- Cross-domain accent-insensitive full-text search RPC function for Phase 5.
-- ============================================================================

create or replace function public.search_cross_domain(
  p_query text,
  p_domain text default null,
  p_limit int default 10
)
returns table (
  domain text,
  id uuid,
  name text,
  slug text,
  description text,
  image_url text,
  category_name text,
  subtitle text,
  detail_path text,
  rank real
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_clean_query text;
  v_tsquery tsquery;
  v_unaccent_query text;
begin
  if p_query is null or trim(p_query) = '' then
    return;
  end if;

  v_unaccent_query := public.immutable_unaccent(trim(p_query));
  v_clean_query := '%' || v_unaccent_query || '%';
  v_tsquery := plainto_tsquery('portuguese', v_unaccent_query);

  return query
  with results as (
    -- 1. Businesses
    select
      'business'::text as domain,
      b.id,
      b.name,
      b.slug,
      b.description,
      b.logo_url as image_url,
      c.name as category_name,
      b.address as subtitle,
      ('/empresas/' || b.slug) as detail_path,
      (
        case
          when public.immutable_unaccent(b.name) ilike v_clean_query then 10.0
          when to_tsvector('portuguese', public.immutable_unaccent(coalesce(b.name, '') || ' ' || coalesce(b.description, ''))) @@ v_tsquery
            then ts_rank(to_tsvector('portuguese', public.immutable_unaccent(coalesce(b.name, '') || ' ' || coalesce(b.description, ''))), v_tsquery)
          else 1.0
        end
      )::real as rank
    from public.businesses b
    left join public.categories c on c.id = b.category_id
    where b.status = 'published'
      and (p_domain is null or p_domain = 'business')
      and (
        public.immutable_unaccent(b.name) ilike v_clean_query
        or public.immutable_unaccent(coalesce(b.description, '')) ilike v_clean_query
        or to_tsvector('portuguese', public.immutable_unaccent(coalesce(b.name, '') || ' ' || coalesce(b.description, ''))) @@ v_tsquery
      )

    union all

    -- 2. Events
    select
      'event'::text as domain,
      e.id,
      e.name,
      e.slug,
      e.description,
      e.promotional_image_url as image_url,
      c.name as category_name,
      coalesce(e.venue_name, e.address) as subtitle,
      ('/eventos/' || e.slug) as detail_path,
      (
        case
          when public.immutable_unaccent(e.name) ilike v_clean_query then 10.0
          when to_tsvector('portuguese', public.immutable_unaccent(coalesce(e.name, '') || ' ' || coalesce(e.description, '') || ' ' || coalesce(e.venue_name, ''))) @@ v_tsquery
            then ts_rank(to_tsvector('portuguese', public.immutable_unaccent(coalesce(e.name, '') || ' ' || coalesce(e.description, '') || ' ' || coalesce(e.venue_name, ''))), v_tsquery)
          else 1.0
        end
      )::real as rank
    from public.events e
    left join public.categories c on c.id = e.category_id
    where e.status = 'published'
      and (p_domain is null or p_domain = 'event')
      and (
        public.immutable_unaccent(e.name) ilike v_clean_query
        or public.immutable_unaccent(coalesce(e.description, '')) ilike v_clean_query
        or public.immutable_unaccent(coalesce(e.venue_name, '')) ilike v_clean_query
        or to_tsvector('portuguese', public.immutable_unaccent(coalesce(e.name, '') || ' ' || coalesce(e.description, '') || ' ' || coalesce(e.venue_name, ''))) @@ v_tsquery
      )

    union all

    -- 3. Packages
    select
      'package'::text as domain,
      p.id,
      p.destination as name,
      p.slug,
      p.information as description,
      p.image_url as image_url,
      c.name as category_name,
      coalesce(p.agency_name, 'Agência local') as subtitle,
      ('/pacotes/' || p.slug) as detail_path,
      (
        case
          when public.immutable_unaccent(p.destination) ilike v_clean_query then 10.0
          when to_tsvector('portuguese', public.immutable_unaccent(coalesce(p.destination, '') || ' ' || coalesce(p.information, ''))) @@ v_tsquery
            then ts_rank(to_tsvector('portuguese', public.immutable_unaccent(coalesce(p.destination, '') || ' ' || coalesce(p.information, ''))), v_tsquery)
          else 1.0
        end
      )::real as rank
    from public.packages p
    left join public.categories c on c.id = p.category_id
    where p.status = 'published'
      and (p_domain is null or p_domain = 'package')
      and (
        public.immutable_unaccent(p.destination) ilike v_clean_query
        or public.immutable_unaccent(coalesce(p.information, '')) ilike v_clean_query
        or to_tsvector('portuguese', public.immutable_unaccent(coalesce(p.destination, '') || ' ' || coalesce(p.information, ''))) @@ v_tsquery
      )

    union all

    -- 4. Lodging
    select
      'lodging'::text as domain,
      l.id,
      l.name,
      l.slug,
      l.description,
      (select g.image_url from public.galleries g where g.lodging_id = l.id order by g.display_order limit 1) as image_url,
      c.name as category_name,
      l.address as subtitle,
      ('/hospedagem/' || l.slug) as detail_path,
      (
        case
          when public.immutable_unaccent(l.name) ilike v_clean_query then 10.0
          when to_tsvector('portuguese', public.immutable_unaccent(coalesce(l.name, '') || ' ' || coalesce(l.description, ''))) @@ v_tsquery
            then ts_rank(to_tsvector('portuguese', public.immutable_unaccent(coalesce(l.name, '') || ' ' || coalesce(l.description, ''))), v_tsquery)
          else 1.0
        end
      )::real as rank
    from public.lodging l
    left join public.categories c on c.id = l.category_id
    where l.status = 'published'
      and (p_domain is null or p_domain = 'lodging')
      and (
        public.immutable_unaccent(l.name) ilike v_clean_query
        or public.immutable_unaccent(coalesce(l.description, '')) ilike v_clean_query
        or to_tsvector('portuguese', public.immutable_unaccent(coalesce(l.name, '') || ' ' || coalesce(l.description, ''))) @@ v_tsquery
      )

    union all

    -- 5. Dining
    select
      'dining'::text as domain,
      d.id,
      d.name,
      d.slug,
      d.description,
      (select g.image_url from public.galleries g where g.dining_id = d.id order by g.display_order limit 1) as image_url,
      c.name as category_name,
      d.address as subtitle,
      ('/gastronomia/' || d.slug) as detail_path,
      (
        case
          when public.immutable_unaccent(d.name) ilike v_clean_query then 10.0
          when to_tsvector('portuguese', public.immutable_unaccent(coalesce(d.name, '') || ' ' || coalesce(d.description, ''))) @@ v_tsquery
            then ts_rank(to_tsvector('portuguese', public.immutable_unaccent(coalesce(d.name, '') || ' ' || coalesce(d.description, ''))), v_tsquery)
          else 1.0
        end
      )::real as rank
    from public.dining d
    left join public.categories c on c.id = d.category_id
    where d.status = 'published'
      and (p_domain is null or p_domain = 'dining')
      and (
        public.immutable_unaccent(d.name) ilike v_clean_query
        or public.immutable_unaccent(coalesce(d.description, '')) ilike v_clean_query
        or to_tsvector('portuguese', public.immutable_unaccent(coalesce(d.name, '') || ' ' || coalesce(d.description, ''))) @@ v_tsquery
      )
  )
  select * from results
  order by rank desc, name asc
  limit p_limit;
end;
$$;

-- Grant execute permissions to anon and authenticated
grant execute on function public.search_cross_domain(text, text, int) to anon, authenticated;
