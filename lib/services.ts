import { processContent } from "@/lib/spintax"
import { createClient } from "@/lib/supabase/server"
import type { ContentServiceNew } from "@/lib/fetch-content"
import { getContentServices } from "@/lib/fetch-content"
import type { ServiceDefinition } from "@/lib/water-damage"
import { resolveCategoryConfig } from "@/lib/category-mapping"

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
  const { services: serviceDefinitions, order } = resolveCategoryConfig(category)
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

  // servicesContent is ContentServiceNew[] from content_services_new table
  // Create a map for quick lookup: slug -> service data
  const servicesMap = new Map(
    servicesContent.map(svc => [svc.slug, svc])
  )

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
      
      // Try to get data from content_services_new table first
      const newService = servicesMap.get(slug)
      const fallbackDef = serviceDefinitions.find((svc) => svc.slug === slug)
      
      const title = newService?.name
        ? processContent(newService.nameSpin || newService.name, seed, variables)
        : processContent(row.service_title_spintax || row.hero_headline_spintax || fallbackDef?.title || formatTitleFromSlug(slug), seed, variables)

      const description = newService?.description
        ? processContent(newService.description, seed, variables)
        : pickDescriptionFromRow(row, seed, variables) || (fallbackDef?.shortDescription ? processContent(fallbackDef.shortDescription, seed, variables) : "")

      const icon = fallbackDef?.icon

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
