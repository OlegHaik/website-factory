import { processContent } from "@/lib/spintax"
import { createClient } from "@/lib/supabase/server"
import type { ContentService } from "@/lib/fetch-content"
import { getContentServices } from "@/lib/fetch-content"
import type { ServiceDefinition } from "@/lib/water-damage"
import { resolveCategoryConfig } from "@/lib/category-mapping"
import type { LegacyFieldMap } from "@/lib/category-mapping"

export type CategoryService = {
  slug: string
  title: string
  description: string
  href: string
  icon?: ServiceDefinition["icon"]
}

const formatTitleFromSlug = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const getLegacyContent = (
  slug: string,
  servicesContent: ContentService | null,
  seed: string,
  variables: Record<string, string>,
  legacyFields: LegacyFieldMap,
  fallbackServices: ServiceDefinition[],
): { title?: string; description?: string } => {
  const legacy = legacyFields[slug]
  if (!legacy) return {}

  const defaultFallback = fallbackServices.find((s) => s.slug === slug)
  const title = processContent(
    (servicesContent?.[legacy.titleKey] as string | undefined) || defaultFallback?.title || formatTitleFromSlug(slug),
    seed,
    variables,
  )
  const description = processContent(
    (servicesContent?.[legacy.descriptionKey] as string | undefined) || defaultFallback?.shortDescription || "",
    seed,
    variables,
  )

  return { title, description }
}

const pickDescriptionFromRow = (
  row: Partial<ContentServicePageRow>,
  seed: string,
  variables: Record<string, string>,
): string => {
  const candidate =
    row.hero_subheadline_spintax || row.section_body_spintax || row.process_body_spintax || row.hero_headline_spintax || ""
  return processContent(candidate || "", seed, variables)
}

type ContentServicePageRow = {
  service_slug?: string | null
  service_title_spintax?: string | null
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
  const { services: serviceDefinitions, legacyFields, order } = resolveCategoryConfig(category)
  const supabase = await createClient()
  const selectFields =
    "service_slug, service_title_spintax, hero_headline_spintax, hero_subheadline_spintax, section_body_spintax, process_body_spintax, category"

  const { data, error } = await supabase
    .from("content_service_pages")
    .select(selectFields)
    .eq("category", category)
    .order("service_slug", { ascending: true })

  let rows: ContentServicePageRow[] = data ?? []

  if (error) {
    const isMissingCategory = error.message?.toLowerCase()?.includes("category")
    if (!isMissingCategory) {
      console.error("Failed to fetch category services", { category, error })
    }

    if (isMissingCategory) {
      // Don't fall back to unfiltered query - use built-in service definitions instead
      // This prevents category mixing (e.g., roofing site showing water_damage services)
      console.warn(`[fetchCategoryServices] DB lacks category column, using built-in definitions for "${category}"`)
      rows = []
    }
  }

  // If no category-specific rows found, we rely on the serviceDefinitions 
  // from category-mapping.ts as the base (they are already category-aware).
  // This ensures we never mix categories - a roofing site will only show roofing services.
  if (!rows.length && process.env.NODE_ENV === 'development') {
    console.log(`[fetchCategoryServices] No DB rows for category "${category}", using built-in service definitions`)
  }

  const servicesContent = await getContentServices(category)
  const seedPrefix = domain || "default"

  // Merge DB rows with service definitions: use DB rows + any definitions missing from DB
  const dbSlugs = new Set(rows.map((r) => String(r.service_slug || "").trim()).filter(Boolean))
  const missingDefinitions = serviceDefinitions
    .filter((svc) => !dbSlugs.has(svc.slug))
    .map((svc) => ({ service_slug: svc.slug }))
  const baseRows: ContentServicePageRow[] = [...rows, ...missingDefinitions]

  const mapped = baseRows
    .map((row) => {
      const slug = String(row.service_slug || "").trim()
      if (!slug) return null

      const seed = `${seedPrefix}:${slug}`
      const legacy = getLegacyContent(slug, servicesContent, seed, variables, legacyFields, serviceDefinitions)

      const title =
        legacy.title ||
        processContent(row.service_title_spintax || row.hero_headline_spintax || formatTitleFromSlug(slug), seed, variables)

      const description = legacy.description || pickDescriptionFromRow(row, seed, variables) || ""

      const icon = serviceDefinitions.find((svc) => svc.slug === slug)?.icon

      return { slug, title, description, href: `/${slug}`, icon }
    })
    .filter(Boolean) as CategoryService[]

  const sorted = mapped.sort((a, b) => {
    const aOrder = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const bOrder = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.slug.localeCompare(b.slug)
  })

  return sorted
}
