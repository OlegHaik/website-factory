import { createClient } from '@supabase/supabase-js'
import { formatPhone } from './format-phone'
import { getCurrentDomain, normalizeDomainUrl } from './domain'

export interface ServiceArea {
  name: string
  slug: string
}

export interface SiteLink {
  label: string
  href: string
}

export interface SiteRow {
  id: number
  slug: string
  business_name: string | null
  domain_url: string | null
  address: string | null
  city: string | null
  zip_code: string | null
  state: string | null
  phone: string | null
  category: string | null
  owner: string | null
  email: string | null
  service_areas: string | null
  links: string | null
  social_links: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string | null
}

export type SiteData = Omit<SiteRow, 'links' | 'social_links' | 'service_areas'> & {
  phoneDisplay: string | null
  serviceAreas: ServiceArea[]
  resolvedDomain: string

  links: SiteLink[]
  socialLinks: SiteLink[]
}

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createClient(url, anonKey)
}

function toServiceAreasList(value: string | null): string[] {
  if (!value) return []
  return value
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function toServiceAreas(value: string | null): ServiceArea[] {
  if (!value) return []

  const raw = value.trim()
  if (!raw) return []

  if (raw.startsWith('[') || raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === 'string') {
              const name = item.trim()
              if (!name) return null
              return { name, slug: slugify(name) }
            }

            if (item && typeof item === 'object') {
              const obj = item as { name?: unknown; slug?: unknown; title?: unknown }
              const name = String(obj.name ?? obj.title ?? '').trim()
              if (!name) return null
              const slug = String(obj.slug ?? '').trim() || slugify(name)
              return { name, slug }
            }

            return null
          })
          .filter((x): x is ServiceArea => Boolean(x))
      }
    } catch {
      // fall through to line parsing
    }
  }

  const lines = raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)

  return lines
    .map((line) => {
      const [namePart, slugPart] = line.split('|').map((s) => s.trim())
      const name = namePart
      if (!name) return null
      return { name, slug: slugPart || slugify(name) }
    })
    .filter((x): x is ServiceArea => Boolean(x))
}

function toSiteLinks(value: string | null): SiteLink[] {
  if (!value) return []

  const raw = value.trim()
  if (!raw) return []

  if (raw.startsWith('[') || raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const obj = item as { label?: unknown; href?: unknown; url?: unknown; name?: unknown }
            const label = String(obj.label ?? obj.name ?? '').trim()
            const href = String(obj.href ?? obj.url ?? '').trim()
            if (!label || !href) return null
            return { label, href }
          })
          .filter((x): x is SiteLink => Boolean(x))
      }
    } catch {
      // fall through to line parsing
    }
  }

  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  return lines
    .map((line) => {
      const [labelPart, hrefPart] = line.split('|').map((s) => s.trim())
      if (!labelPart || !hrefPart) return null
      return { label: labelPart, href: hrefPart }
    })
    .filter((x): x is SiteLink => Boolean(x))
}

function withComputedFields(row: SiteRow, resolvedDomain: string): SiteData {
  const phone = row.phone?.trim() || null
  const phoneDisplay = phone ? formatPhone(phone) : null

  return {
    ...row,
    phone,
    phoneDisplay,
    serviceAreas: toServiceAreas(row.service_areas),
    resolvedDomain,

    links: toSiteLinks(row.links),
    socialLinks: toSiteLinks(row.social_links),
  }
}

export async function getSiteBySlug(slug: string): Promise<SiteData | null> {
  const resolvedDomain = await getCurrentDomain()
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .limit(1)

  if (error) {
    throw new Error(`Supabase error fetching site by slug: ${error.message}`)
  }

  const row = (data?.[0] as SiteRow | undefined) ?? null
  if (!row) return null

  return withComputedFields(row, resolvedDomain)
}

export async function getSiteByDomain(domain: string): Promise<SiteData | null> {
  const resolvedDomain = await getCurrentDomain()
  const supabase = createSupabaseClient()

  const normalized = normalizeDomainUrl(domain)
  const candidates = Array.from(
    new Set(
      [
        normalized,
        `https://${normalized}`,
        `http://${normalized}`,
        `www.${normalized}`,
        `https://www.${normalized}`,
        `http://www.${normalized}`,
      ].filter(Boolean),
    ),
  )

  if (candidates.length === 0) return null

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .limit(1)

  if (error) {
    throw new Error(`Supabase error fetching site by domain: ${error.message}`)
  }

  const row = (data?.[0] as SiteRow | undefined) ?? null
  if (!row) return null

  return withComputedFields(row, resolvedDomain)
}

/**
 * Convenience resolver for request-driven pages.
 *
 * - If slug is provided, it is treated as the primary key for MVP.
 * - If slug is not provided, attempts to resolve by current domain.
 */
export async function resolveSiteContext(input?: { slug?: string }) {
  const domain = await getCurrentDomain()

  if (input?.slug) {
    const site = await getSiteBySlug(input.slug)
    return { site, domain }
  }

  // Local development convenience: when running on localhost, getCurrentDomain()
  // resolves to NEXT_PUBLIC_DOMAIN. If that env var isn't set, domain will be empty
  // and domain-based routing can't resolve a site.
  //
  // Setting NEXT_PUBLIC_SITE_SLUG allows previewing the domain-based routes locally
  // without changing production behavior.
  const devSlug = (process.env.NEXT_PUBLIC_SITE_SLUG ?? '').trim()
  if (!domain && devSlug) {
    const site = await getSiteBySlug(devSlug)
    return { site, domain }
  }

  const site = domain ? await getSiteByDomain(domain) : null
  return { site, domain }
}
