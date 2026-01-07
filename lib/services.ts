import { processContent } from "@/lib/spintax"
import { createClient } from "@/lib/supabase/server"
import type { ContentService } from "@/lib/fetch-content"
import { getContentServices } from "@/lib/fetch-content"

export type CategoryService = {
  slug: string
  title: string
  description?: string
  href: string
  icon?: "water" | "fire" | "mold" | "biohazard" | "burst-pipe" | "sewage"
}

const LEGACY_SERVICE_FIELDS: Record<string, { titleKey: keyof ContentService; descriptionKey: keyof ContentService }> = {
  "water-damage-restoration": { titleKey: "water_title", descriptionKey: "water_description" },
  "fire-smoke-damage": { titleKey: "fire_title", descriptionKey: "fire_description" },
  "mold-remediation": { titleKey: "mold_title", descriptionKey: "mold_description" },
  "biohazard-cleanup": { titleKey: "biohazard_title", descriptionKey: "biohazard_description" },
  "burst-pipe-repair": { titleKey: "burst_title", descriptionKey: "burst_description" },
  "sewage-cleanup": { titleKey: "sewage_title", descriptionKey: "sewage_description" },
}

const ICON_BY_SLUG: Record<string, CategoryService["icon"]> = {
  "water-damage-restoration": "water",
  "fire-smoke-damage": "fire",
  "mold-remediation": "mold",
  "biohazard-cleanup": "biohazard",
  "burst-pipe-repair": "burst-pipe",
  "sewage-cleanup": "sewage",
}

const getLegacyContent = (
  slug: string,
  servicesContent: ContentService | null,
  seed: string,
  variables: Record<string, string>,
): { title?: string; description?: string } => {
  const legacy = LEGACY_SERVICE_FIELDS[slug]
  if (!legacy || !servicesContent) return {}

  const rawTitle = (servicesContent?.[legacy.titleKey] as string | null | undefined)?.trim()
  const rawDescription = (servicesContent?.[legacy.descriptionKey] as string | null | undefined)?.trim()

  const title = rawTitle ? processContent(rawTitle, seed, variables) : undefined
  const description = rawDescription ? processContent(rawDescription, seed, variables) : undefined

  if (!title && !description) return {}

  return { title, description }
}

const pickDescriptionFromRow = (
  row: Partial<ContentServicePageRow>,
  seed: string,
  variables: Record<string, string>,
): string | undefined => {
  const candidate =
    row.hero_subheadline_spintax ||
    row.section_body_spintax ||
    row.process_body_spintax ||
    row.hero_headline_spintax ||
    row.service_title

  if (!candidate) return undefined

  const cleaned = String(candidate).trim()
  if (!cleaned) return undefined

  return processContent(cleaned, seed, variables)
}

type ContentServicePageRow = {
  service_slug?: string | null
  service_title?: string | null
  hero_headline_spintax?: string | null
  hero_subheadline_spintax?: string | null
  section_body_spintax?: string | null
  process_body_spintax?: string | null
  category?: string | null
}

export async function fetchCategoryServices(params: {
  category: string
  domain: string
  variables: Record<string, string>
}): Promise<CategoryService[]> {
  const { category, domain, variables } = params
  const supabase = await createClient()
  const selectFields =
    "service_slug, service_title, hero_headline_spintax, hero_subheadline_spintax, section_body_spintax, process_body_spintax, category"

  const { data, error } = await supabase
    .from("content_service_pages")
    .select(selectFields)
    .eq("category", category)
    .order("service_slug", { ascending: true })
  if (error) {
    console.error("Failed to fetch category services", { category, error })
    return []
  }

  const rows: ContentServicePageRow[] = data ?? []

  if (!rows.length) return []

  const servicesContent = await getContentServices(category)
  const seedPrefix = domain || "default"

  const mapped = rows
    .map((row) => {
      const slug = String(row.service_slug || "").trim()
      if (!slug) return null

      const seed = `${seedPrefix}:${slug}`
      const legacy = getLegacyContent(slug, servicesContent, seed, variables)

      const rawTitle = legacy.title ?? row.service_title ?? row.hero_headline_spintax
      const title = legacy.title || (rawTitle ? processContent(rawTitle, seed, variables) : undefined)

      const description = legacy.description ?? pickDescriptionFromRow(row, seed, variables)

      if (!title) return null

      const icon = ICON_BY_SLUG[slug]

      return { slug, title, description: description || undefined, href: `/${slug}`, icon }
    })
    .filter(Boolean) as CategoryService[]

  return mapped
}
