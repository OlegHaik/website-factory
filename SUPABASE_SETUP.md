# Supabase Setup (Website Factory)

This app reads site configuration from a Supabase table named `sites`.

## 1) Required environment variables

In Vercel (Project → Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL` = Project Settings → API → Project URL (e.g. `https://<ref>.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project Settings → API Keys → **Publishable** key (recommended)

Do **not** use `service_role` in a public website.

## 2) Table: `sites`

Minimum fields the app expects for a site to render:

- `slug` (text)
- `domain_url` (text) — the domain to match (e.g. `denverwaterpros.com`)
- `business_name` (text)
- `phone` (text)
- `city` (text)
- `state` (text)

Optional fields supported:

- `address`, `zip_code`, `email`
- `meta_title`, `meta_description`
- `service_areas` (text)
- `links` (text) — legacy fallback if `citations` table is empty/not present
- `social_links` (text) — legacy fallback (newline/JSON)
- `facebook_url` (text)
- `youtube_url` (text)
- `pinterest_url` (text)
- `google_business_url` (text)

The `/links` page prefers the `citations` table (below) and falls back to `sites.links`.

### Recommended formats

**`service_areas`** supports any of:

- Newline-separated names:
  - `Aurora`
  - `Lakewood`
- Newline-separated `Name|slug` pairs:
  - `Aurora|aurora-co`
  - `Lakewood|lakewood-co`
- JSON array:
  - `["Aurora", "Lakewood"]`
  - `[{"name":"Aurora","slug":"aurora-co"}]`

**`links` / `social_links`** supports any of:

- Newline-separated `Label|URL` pairs:
  - `Google Business Profile|https://...`
  - `Facebook|https://...`
- JSON array:
  - `[{"label":"Facebook","href":"https://..."}]`

## 3) SQL: add missing columns + recommended RLS

Run this in Supabase SQL Editor (safe for existing tables):

```sql
-- Recommended uniqueness for multi-tenant slugs
-- (A slug can repeat across different domains)
create unique index if not exists sites_domain_url_slug_unique
  on public.sites (domain_url, slug);

-- Optional columns used by the Website Factory
alter table public.sites add column if not exists service_areas text;
alter table public.sites add column if not exists links text;
alter table public.sites add column if not exists social_links text;

-- Social profile columns
alter table public.sites
  add column if not exists facebook_url text,
  add column if not exists youtube_url text,
  add column if not exists pinterest_url text,
  add column if not exists google_business_url text;

-- Optional SEO fields
alter table public.sites add column if not exists meta_title text;
alter table public.sites add column if not exists meta_description text;

-- Recommended: enable RLS + allow public read
-- (If you already manage access another way, you can skip this.)
alter table public.sites enable row level security;

drop policy if exists "public read sites" on public.sites;
create policy "public read sites"
  on public.sites
  for select
  using (true);

-- Citations table for /links
create table if not exists public.citations (
  id bigserial primary key,
  site_id bigint not null references public.sites(id) on delete cascade,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists citations_site_id_idx
  on public.citations (site_id);

alter table public.citations enable row level security;

drop policy if exists "public read citations" on public.citations;
create policy "public read citations"
  on public.citations
  for select
  using (true);
```

## 4) Domain matching rule

The app matches the incoming request `Host` against `sites.domain_url`.

Recommended: store domains without protocol and without `www`:
- ✅ `denverwaterpros.com`
- ✅ `miamiwaterdamage.com`
- ❌ `https://denverwaterpros.com`

(Our code tries multiple variants, but standardizing avoids mistakes.)
