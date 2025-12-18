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
  is_main?: boolean | null
  address: string | null
  city: string | null
  zip_code: string | null
  state: string | null
  phone: string | null
  category: string | null
  owner: string | null
  email: string | null

  facebook_url?: string | null
  youtube_url?: string | null
  pinterest_url?: string | null
  google_business_url?: string | null

  service_areas?: string | null
  links?: string | null
  social_links?: string | null
  style_id?: number | null
  content_map?: Record<string, number> | null
  meta_title: string | null
  meta_description: string | null
  created_at: string | null
}

export interface ServiceAreaIndexItem {
  slug: string
  city: string
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

function buildDomainCandidates(domain: string): string[] {
  const normalized = normalizeDomainUrl(domain)
  const base = [
    normalized,
    `https://${normalized}`,
    `http://${normalized}`,
    `www.${normalized}`,
    `https://www.${normalized}`,
    `http://www.${normalized}`,
  ].filter(Boolean)

  // Some users store domain_url with a trailing slash in Supabase.
  // Include both forms so lookups don't fail.
  const withSlash = base.map((v) => (v.endsWith('/') ? v : `${v}/`))

  return Array.from(new Set([...base, ...withSlash]))
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

function toServiceAreas(value: string | null | undefined): ServiceArea[] {
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

function toSiteLinks(value: string | null | undefined): SiteLink[] {
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

function mergeUniqueLinks(...groups: Array<SiteLink[] | undefined | null>): SiteLink[] {
  const seen = new Set<string>()
  const out: SiteLink[] = []

  for (const group of groups) {
    for (const item of group ?? []) {
      const key = (item.href || '').trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      out.push(item)
    }
  }

  return out
}

function socialLinksFromColumns(row: SiteRow): SiteLink[] {
  const links: SiteLink[] = []
  if (row.google_business_url) links.push({ label: 'Google Business', href: row.google_business_url })
  if (row.facebook_url) links.push({ label: 'Facebook', href: row.facebook_url })
  if (row.youtube_url) links.push({ label: 'YouTube', href: row.youtube_url })
  if (row.pinterest_url) links.push({ label: 'Pinterest', href: row.pinterest_url })
  return links
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
    socialLinks: mergeUniqueLinks(socialLinksFromColumns(row), toSiteLinks(row.social_links)),
  }
}

export async function getCitationsForSite(siteId: number): Promise<SiteLink[]> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('citations')
    .select('name,url')
    .eq('site_id', siteId)
    .order('id', { ascending: true })

  if (error) {
    // If the table doesn't exist yet (pre-MVP), keep the app functional.
    // Other Supabase errors should still fail loudly.
    const msg = error.message || ''
    if (msg.toLowerCase().includes('does not exist')) return []
    throw new Error(`Supabase error fetching citations: ${error.message}`)
  }

  return (data ?? [])
    .map((row) => {
      const r = row as { name?: unknown; url?: unknown }
      const label = String(r.name ?? '').trim()
      const href = String(r.url ?? '').trim()
      if (!label || !href) return null
      return { label, href }
    })
    .filter((x): x is SiteLink => Boolean(x))
}

export async function getSiteBySlug(slug: string): Promise<SiteData | null> {
  const resolvedDomain = await getCurrentDomain()
  const supabase = createSupabaseClient()

  // With UNIQUE(domain_url, slug) a slug can repeat across sites.
  // If we can resolve the current domain, scope the lookup to it.
  const candidates = resolvedDomain ? buildDomainCandidates(resolvedDomain) : []

  const query = supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .order('is_main', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })

  const { data, error } = candidates.length > 0 ? await query.in('domain_url', candidates).limit(1) : await query.limit(1)

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

  const candidates = buildDomainCandidates(domain)

  if (candidates.length === 0) return null

  // If the tenant has an explicit main row, always prefer it.
  const main = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .eq('is_main', true)
    .order('id', { ascending: true })
    .limit(1)

  if (main.error) {
    throw new Error(`Supabase error fetching main site by domain (is_main=true): ${main.error.message}`)
  }

  const mainRow = (main.data?.[0] as SiteRow | undefined) ?? null
  if (mainRow) return withComputedFields(mainRow, resolvedDomain)

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .order('is_main', { ascending: false })
    .order('id', { ascending: true })
    .limit(1)

  if (error) {
    throw new Error(`Supabase error fetching site by domain: ${error.message}`)
  }

  const row = (data?.[0] as SiteRow | undefined) ?? null
  if (!row) return null

  return withComputedFields(row, resolvedDomain)
}

async function getMainSiteByDomain(domain: string): Promise<SiteData | null> {
  const resolvedDomain = await getCurrentDomain()
  const supabase = createSupabaseClient()

  const candidates = buildDomainCandidates(domain)
  if (candidates.length === 0) return null

  // If there is an explicit is_main row, that is the main site.
  const main = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .eq('is_main', true)
    .order('id', { ascending: true })
    .limit(1)

  if (main.error) {
    throw new Error(`Supabase error fetching main site by domain (is_main=true): ${main.error.message}`)
  }

  const mainRow = (main.data?.[0] as SiteRow | undefined) ?? null
  if (mainRow) return withComputedFields(mainRow, resolvedDomain)

  // Deterministic selection:
  // 1) Prefer explicit "home" / "" slugs.
  // 2) Only then fall back to NULL slug (legacy/migrated rows).
  const q1 = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .or('slug.eq.,slug.eq.home')
    .order('is_main', { ascending: false })
    .order('id', { ascending: true })
    .limit(1)

  if (q1.error) {
    throw new Error(`Supabase error fetching main site by domain: ${q1.error.message}`)
  }

  const row1 = (q1.data?.[0] as SiteRow | undefined) ?? null
  if (row1) return withComputedFields(row1, resolvedDomain)

  const q2 = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .is('slug', null)
    .order('is_main', { ascending: false })
    .order('id', { ascending: true })
    .limit(1)

  if (q2.error) {
    throw new Error(`Supabase error fetching main site by domain (NULL slug fallback): ${q2.error.message}`)
  }

  const row2 = (q2.data?.[0] as SiteRow | undefined) ?? null
  if (!row2) return null

  return withComputedFields(row2, resolvedDomain)
}

export async function getSiteByDomainAndSlug(domain: string, slug: string): Promise<SiteData | null> {
  const resolvedDomain = await getCurrentDomain()
  const supabase = createSupabaseClient()

  const domainForCandidates = (domain || '').trim() || resolvedDomain
  const candidates = buildDomainCandidates(domainForCandidates)
  if (candidates.length === 0) return null

  const normalizedSlug = String(slug ?? '').trim().toLowerCase()
  if (!normalizedSlug) return null

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .in('domain_url', candidates)
    .ilike('slug', normalizedSlug)
    .order('is_main', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })
    .limit(1)

  if (error) {
    throw new Error(`Supabase error fetching site by domain+slug: ${error.message}`)
  }

  const row = (data?.[0] as SiteRow | undefined) ?? null
  if (!row) return null

  return withComputedFields(row, resolvedDomain)
}

export async function getServiceAreaIndexForCurrentDomain(): Promise<ServiceAreaIndexItem[]> {
  const domain = await getCurrentDomain()
  if (!domain) return []

  const supabase = createSupabaseClient()
  const candidates = buildDomainCandidates(domain)
  if (candidates.length === 0) return []

  const { data, error } = await supabase
    .from('sites')
    .select('slug,city')
    .in('domain_url', candidates)
    .neq('slug', '')
    .neq('slug', 'home')
    .order('city', { ascending: true })

  if (error) {
    throw new Error(`Supabase error fetching service area index: ${error.message}`)
  }

  return (data ?? [])
    .map((row) => {
      const r = row as { slug?: unknown; city?: unknown }
      const slug = String(r.slug ?? '').trim()
      const city = String(r.city ?? '').trim()
      if (!slug || !city) return null
      return { slug, city }
    })
    .filter((x): x is ServiceAreaIndexItem => Boolean(x))
}

/**
 * Convenience resolver for request-driven pages.
 *
 * - If slug is provided, it is treated as the primary key for MVP.
 * - If slug is not provided, attempts to resolve by current domain.
 */
export async function resolveSiteContext(input?: { slug?: string }) {
  const requestDomain = await getCurrentDomain()

  // Vercel preview/deployment URLs often use a *.vercel.app hostname (or another
  // non-custom hostname). In that case, domain-based DB lookups should fall back
  // to a configured custom domain.
  const configuredDomain = normalizeDomainUrl(process.env.NEXT_PUBLIC_DOMAIN ?? '')
  const isVercelEnv = Boolean(process.env.VERCEL)
  const looksLikePreviewDomain =
    !requestDomain || requestDomain.includes('vercel.app') || (isVercelEnv && configuredDomain && requestDomain !== configuredDomain)

  const domain = looksLikePreviewDomain && configuredDomain ? configuredDomain : requestDomain

  if (process.env.SITE_DEBUG === '1') {
    console.log('=== RESOLVE SITE CONTEXT DEBUG ===')
    console.log('requestDomain:', requestDomain)
    console.log('configuredDomain:', configuredDomain)
    console.log('usingDomain:', domain)
  }

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

  const site = domain ? (await getMainSiteByDomain(domain)) ?? (await getSiteByDomain(domain)) : null
  return { site, domain }
}
