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
- `links` (text)
- `social_links` (text)

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
-- Optional columns used by the Website Factory
alter table public.sites add column if not exists service_areas text;
alter table public.sites add column if not exists links text;
alter table public.sites add column if not exists social_links text;

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
```

## 4) Domain matching rule

The app matches the incoming request `Host` against `sites.domain_url`.

Recommended: store domains without protocol and without `www`:
- ✅ `denverwaterpros.com`
- ✅ `miamiwaterdamage.com`
- ❌ `https://denverwaterpros.com`

(Our code tries multiple variants, but standardizing avoids mistakes.)
