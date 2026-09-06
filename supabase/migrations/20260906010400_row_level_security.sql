-- ============================================================================
-- 20260906010400_row_level_security.sql
-- Enable Row-Level Security on all tables and define access policies.
--
-- RATIONALE FOR ADMIN ROLE:
-- We represent the admin role via a dedicated `public.admins` table keyed by
-- `user_id uuid references auth.users(id)` and queried via `is_admin()`.
-- Rationale: Storing roles in custom claims / app_metadata requires a JWT refresh
-- for changes to take effect and can lead to authorization desync. A dedicated
-- database table provides instant permission revocation, is directly auditable,
-- and fits relational Postgres constraints.
-- ============================================================================

-- 1. Admins table
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now(),
  constraint uq_admins_user_id unique (user_id)
);

alter table public.admins enable row level security;

-- Function to check admin status
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "Admins readable only by admins"
  on public.admins
  for select
  to authenticated
  using (public.is_admin());

-- 2. Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.amenities enable row level security;
alter table public.businesses enable row level security;
alter table public.events enable row level security;
alter table public.packages enable row level security;
alter table public.lodging enable row level security;
alter table public.dining enable row level security;
alter table public.submissions enable row level security;
alter table public.business_amenities enable row level security;
alter table public.event_amenities enable row level security;
alter table public.package_amenities enable row level security;
alter table public.lodging_amenities enable row level security;
alter table public.dining_amenities enable row level security;
alter table public.galleries enable row level security;

-- 3. Categories & Amenities policies (public can view, admins can manage)
create policy "Categories public read"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Categories admin write"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Amenities public read"
  on public.amenities for select
  to anon, authenticated
  using (true);

create policy "Amenities admin write"
  on public.amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Content tables: Public read published only
create policy "Businesses public read published"
  on public.businesses for select
  to anon, authenticated
  using (status = 'published');

create policy "Businesses admin manage"
  on public.businesses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Events public read published"
  on public.events for select
  to anon, authenticated
  using (status = 'published');

create policy "Events admin manage"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Packages public read published"
  on public.packages for select
  to anon, authenticated
  using (status = 'published');

create policy "Packages admin manage"
  on public.packages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Lodging public read published"
  on public.lodging for select
  to anon, authenticated
  using (status = 'published');

create policy "Lodging admin manage"
  on public.lodging for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Dining public read published"
  on public.dining for select
  to anon, authenticated
  using (status = 'published');

create policy "Dining admin manage"
  on public.dining for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5. Join tables & Galleries: Public read, admin manage
create policy "Business amenities public read"
  on public.business_amenities for select
  to anon, authenticated
  using (true);

create policy "Business amenities admin manage"
  on public.business_amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Event amenities public read"
  on public.event_amenities for select
  to anon, authenticated
  using (true);

create policy "Event amenities admin manage"
  on public.event_amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Package amenities public read"
  on public.package_amenities for select
  to anon, authenticated
  using (true);

create policy "Package amenities admin manage"
  on public.package_amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Lodging amenities public read"
  on public.lodging_amenities for select
  to anon, authenticated
  using (true);

create policy "Lodging amenities admin manage"
  on public.lodging_amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Dining amenities public read"
  on public.dining_amenities for select
  to anon, authenticated
  using (true);

create policy "Dining amenities admin manage"
  on public.dining_amenities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Galleries public read"
  on public.galleries for select
  to anon, authenticated
  using (true);

create policy "Galleries admin manage"
  on public.galleries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 6. Submissions policies:
-- Anonymous INSERT allowed. Anonymous SELECT strictly denied (admin only).
create policy "Submissions anonymous insert"
  on public.submissions for insert
  to anon, authenticated
  with check (true);

create policy "Submissions admin select"
  on public.submissions for select
  to authenticated
  using (public.is_admin());

create policy "Submissions admin update"
  on public.submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Submissions admin delete"
  on public.submissions for delete
  to authenticated
  using (public.is_admin());

-- 7. Rate Limiting on Submissions
-- Constrain insert frequency per phone or IP: maximum 5 submissions per 10 minutes
create or replace function public.check_submission_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_count integer;
begin
  select count(*)
    into v_recent_count
    from public.submissions
   where created_at > now() - interval '10 minutes'
     and (
       (new.contact_phone is not null and contact_phone = new.contact_phone)
       or (new.ip_address is not null and ip_address = new.ip_address)
     );

  if v_recent_count >= 5 then
    raise exception 'Limite de envios atingido. Por favor, aguarde alguns minutos antes de tentar novamente.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger trg_check_submission_rate_limit
  before insert on public.submissions
  for each row
  execute function public.check_submission_rate_limit();
