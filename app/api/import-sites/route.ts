import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { normalizeDomainUrl } from '@/lib/domain'
import { CATEGORY_SERVICE_CONFIG, resolveCategoryConfig } from '@/lib/category-mapping'

export const runtime = 'nodejs'

const REQUIRED_FIELDS = ['domain_url', 'slug', 'business_name', 'city', 'state', 'phone'] as const
const DEFAULT_CATEGORY = 'water_damage'
const CATEGORY_CONTENT_TABLES = [
  'content_hero',
  'content_services',
  'content_faq',
  'content_testimonials',
  'content_cta',
  'content_seo_body',
  'content_service_pages',
  'content_service_area',
  'content_meta',
  'content_legal',
]

const CONTENT_CONFLICT_KEYS: Record<string, string | undefined> = {
  content_cta: 'category',
  content_faq: 'category',
  content_hero: 'category',
  content_seo_body: 'category',
  content_service_area: 'category',
  content_services: 'category',
  content_testimonials: 'category',
  content_service_pages: 'category,service_slug',
  content_legal: 'category,page_type',
  content_meta: 'category,page_type',
}

type RequiredField = (typeof REQUIRED_FIELDS)[number]

type CsvRow = Record<string, string>

type SiteInput = {
  domain_url: string
  slug: string
  business_name: string
  city: string
  state: string
  zip_code?: string | null
  address?: string | null
  phone: string
  email?: string | null
  category: string
  is_main?: boolean
  style_id?: number | null
  owner?: string | null
  service_areas?: string | null
  meta_title?: string | null
  meta_description?: string | null
  [key: string]: unknown
}

function splitCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      const next = line[i + 1]
      if (inQuotes && next === '"') {
        current += '"'
        i++
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

function parseCsv(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const header = splitCsvLine(lines[0]).map((h) => h.trim())
  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    if (cols.every((c) => !c.trim())) continue

    const row: CsvRow = {}
    header.forEach((key, idx) => {
      row[key] = (cols[idx] ?? '').trim()
    })
    rows.push(row)
  }

  return rows
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

function toBool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return undefined
  const v = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(v)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(v)) return false
  return undefined
}

function coerceNumber(value: unknown): number | undefined {
  const n = Number(value)
  if (Number.isFinite(n)) return n
  return undefined
}

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return digits
  return value.trim()
}

function buildSiteInput(raw: CsvRow): SiteInput {
  const domain = normalizeDomainUrl(raw.domain_url || raw.domain || '')
  const businessName = (raw.business_name || '').trim()
  const slug = (raw.slug || '').trim() || slugify(businessName)
  const category = (raw.category || '').trim() || DEFAULT_CATEGORY

  const is_main = toBool(raw.is_main)

  return {
    domain_url: domain,
    slug,
    business_name: businessName,
    city: (raw.city || '').trim(),
    state: (raw.state || '').trim(),
    zip_code: (raw.zip_code || raw.postal_code || '').trim() || null,
    address: (raw.address || '').trim() || null,
    phone: normalizePhone(raw.phone || ''),
    email: (raw.email || '').trim() || null,
    category,
    is_main,
    style_id: coerceNumber(raw.style_id),
    owner: (raw.owner || '').trim() || null,
    service_areas: raw.service_areas || null,
    meta_title:
      (raw.meta_title || '').trim() ||
      `${businessName} | ${raw.city ? `${raw.city}, ` : ''}${raw.state || ''}`.trim(),
    meta_description:
      (raw.meta_description || '').trim() ||
      `Serving ${businessName} in ${raw.city || ''} ${raw.state || ''}. Call ${raw.phone || ''} for help.`.trim(),
    ...raw,
  }
}

function validateRows(rows: SiteInput[]): { errors: string[] } {
  const errors: string[] = []

  rows.forEach((row, idx) => {
    REQUIRED_FIELDS.forEach((field) => {
      if (!String(row[field] ?? '').trim()) {
        errors.push(`Row ${idx + 1}: missing required field ${field}`)
      }
    })

    if (!row.domain_url) {
      errors.push(`Row ${idx + 1}: domain_url is empty after normalization`)
    }
  })

  return { errors }
}

function enforceMainPerDomain(rows: SiteInput[]): SiteInput[] {
  const grouped = new Map<string, SiteInput[]>()

  for (const row of rows) {
    const list = grouped.get(row.domain_url) ?? []
    list.push(row)
    grouped.set(row.domain_url, list)
  }

  for (const [, list] of grouped) {
    let firstMainSet = false
    list.forEach((row) => {
      if (row.is_main) {
        if (!firstMainSet) {
          firstMainSet = true
        } else {
          row.is_main = false
        }
      }
    })

    list.forEach((row, index) => {
      if (row.is_main === undefined) {
        row.is_main = !firstMainSet && index === 0
        if (row.is_main) firstMainSet = true
      }
    })

    if (!firstMainSet && list.length > 0) {
      list[0].is_main = true
    }
  }

  return Array.from(grouped.values()).flat()
}

async function ensureCategoryContent(category: string, supabase: ReturnType<typeof createAdminClient>) {
  // GUARD: Validate category is a known category key
  const knownCategories = Object.keys(CATEGORY_SERVICE_CONFIG)
  if (!knownCategories.includes(category)) {
    console.error(`[ImportGuard] Invalid category "${category}" - must be one of: ${knownCategories.join(', ')}`)
    throw new Error(`Invalid category: ${category}. Known categories: ${knownCategories.join(', ')}`)
  }

  // Get valid service slugs for the target category
  const targetCategoryConfig = resolveCategoryConfig(category)
  const validServiceSlugs = new Set(targetCategoryConfig.services.map((s) => s.slug))

  for (const table of CATEGORY_CONTENT_TABLES) {
    const existing = await supabase.from(table).select('id').eq('category', category).limit(1)
    if (!existing.error && existing.data && existing.data.length > 0) continue

    const source = await supabase.from(table).select('*').eq('category', DEFAULT_CATEGORY)
    if (source.error) {
      throw new Error(`Failed to load default content from ${table}: ${source.error.message}`)
    }
    if (!source.data || source.data.length === 0) {
      throw new Error(`Default content missing in ${table} for category ${DEFAULT_CATEGORY}`)
    }

    let sanitized = source.data.map((row: Record<string, unknown>) => {
      const clone: Record<string, unknown> = { ...row }
      delete clone.id
      delete clone.created_at
      delete clone.updated_at
      clone.category = category
      return clone
    })

    // GUARD: For content_service_pages, filter out rows with service_slug not valid for target category
    if (table === 'content_service_pages') {
      const beforeCount = sanitized.length
      sanitized = sanitized.filter((row) => {
        const serviceSlug = String(row.service_slug || '').trim()
        if (!serviceSlug) return false

        if (!validServiceSlugs.has(serviceSlug)) {
          console.warn(
            `[ImportGuard] Skipping service_slug="${serviceSlug}" for category="${category}" - not in valid slugs: ${[...validServiceSlugs].join(', ')}`
          )
          return false
        }
        return true
      })
      const skippedCount = beforeCount - sanitized.length
      if (skippedCount > 0) {
        console.log(`[ImportGuard] Filtered ${skippedCount} incompatible service rows for category="${category}"`)
      }

      // Skip insert if no valid rows remain
      if (sanitized.length === 0) {
        console.log(`[ImportGuard] No valid content_service_pages rows to insert for category="${category}"`)
        continue
      }
    }

    const onConflict = CONTENT_CONFLICT_KEYS[table]
    const insertion = onConflict
      ? await supabase.from(table).upsert(sanitized, { onConflict })
      : await supabase.from(table).insert(sanitized)

    if (insertion.error) {
      throw new Error(`Failed to seed ${table} for category ${category}: ${insertion.error.message}`)
    }
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const supabase = createAdminClient()

  let csvText: string
  try {
    if (contentType.includes('text/csv') || contentType.includes('application/csv') || contentType.includes('text/plain')) {
      csvText = await request.text()
    } else {
      return NextResponse.json({ error: 'Unsupported content type. Use text/csv.' }, { status: 400 })
    }
  } catch (err) {
    return NextResponse.json({ error: `Failed to read body: ${String(err)}` }, { status: 400 })
  }

  const parsed = parseCsv(csvText)
  if (parsed.length === 0) {
    return NextResponse.json({ error: 'No rows found in CSV' }, { status: 400 })
  }

  const sites = parsed.map(buildSiteInput)
  const normalized = enforceMainPerDomain(sites)
  // Ensure no user-provided id leaks into upsert payloads
  const sanitizedSites = normalized.map(({ id, ...rest }) => ({ ...rest }))
  const { errors } = validateRows(normalized)
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
  }

  const categories = Array.from(new Set(sanitizedSites.map((r) => r.category || DEFAULT_CATEGORY)))
  try {
    for (const category of categories) {
      await ensureCategoryContent(category, supabase)
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('sites')
    .upsert(sanitizedSites, { onConflict: 'domain_url,slug' })
    .select('id, domain_url, slug, is_main')

  if (error) {
    return NextResponse.json({ error: `Supabase insert failed: ${error.message}` }, { status: 400 })
  }

  return NextResponse.json({
    inserted: data?.length ?? 0,
    rows: data,
    categories_seeded: categories,
    message: 'Sites imported successfully',
  })
}
