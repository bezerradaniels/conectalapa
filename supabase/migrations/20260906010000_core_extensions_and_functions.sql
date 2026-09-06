-- ============================================================================
-- 20260906010000_core_extensions_and_functions.sql
-- Core extensions, slug generation with unaccent/collision handling,
-- and updated_at trigger maintenance.
-- ============================================================================

create extension if not exists "unaccent";

-- Function to automatically set updated_at on update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Function to generate an ASCII-folded, lowercase, hyphenated slug
-- Collisions receive a numeric suffix (-2, -3, etc.)
create or replace function public.generate_slug(
  p_text text,
  p_table text,
  p_id uuid default null
)
returns text
language plpgsql
as $$
declare
  v_base_slug text;
  v_slug text;
  v_counter integer := 1;
  v_exists boolean;
begin
  -- 1. Unaccent, lowercase, trim
  v_base_slug := lower(trim(extensions.unaccent(p_text)));
  -- 2. Replace non-alphanumeric with hyphens
  v_base_slug := regexp_replace(v_base_slug, '[^a-z0-9]+', '-', 'g');
  -- 3. Trim hyphens from start and end
  v_base_slug := trim(both '-' from v_base_slug);
  
  if v_base_slug = '' then
    v_base_slug := 'item';
  end if;

  v_slug := v_base_slug;

  -- 4. Check collisions in the target table
  loop
    execute format(
      'select exists(select 1 from public.%I where slug = %L and (%L::uuid is null or id != %L::uuid))',
      p_table, v_slug, p_id, p_id
    ) into v_exists;

    if not v_exists then
      exit;
    end if;

    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || v_counter;
  end loop;

  return v_slug;
end;
$$;
