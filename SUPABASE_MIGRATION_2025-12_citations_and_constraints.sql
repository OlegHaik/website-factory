-- Supabase migration: citations + scoped slug uniqueness + social URL columns
--
-- This file is intended to be run in the Supabase SQL editor.
-- Review in a non-production environment first.

begin;

-- 1) Change slug uniqueness:
-- Drop any existing unique constraint/index on slug alone, then add scoped uniqueness.
-- Constraint names vary depending on how the table was created.

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.sites'::regclass
      and contype = 'u'
      and conname = 'sites_slug_key'
  ) then
    execute 'alter table public.sites drop constraint sites_slug_key';
  end if;
end $$;

-- Add UNIQUE(domain_url, slug) if not already present.
-- If you want case-insensitive behavior, consider storing a normalized domain in domain_url.
create unique index if not exists sites_domain_url_slug_unique
  on public.sites (domain_url, slug);

-- 2) Social link columns
alter table public.sites
  add column if not exists facebook_url text,
  add column if not exists youtube_url text,
  add column if not exists pinterest_url text,
  add column if not exists google_business_url text;

-- 3) Citations table
create table if not exists public.citations (
  id bigserial primary key,
  site_id bigint not null references public.sites(id) on delete cascade,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists citations_site_id_idx
  on public.citations (site_id);

commit;
