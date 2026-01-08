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
  const { services: serviceDefinitions, legacyFields, order } = resolveCategoryConfig(category)
  const supabase = await createClient()
  const selectFields =
    "service_slug, service_title, hero_headline_spintax, hero_subheadline_spintax, section_body_spintax, process_body_spintax, category"

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
      const fallback = await supabase
        .from("content_service_pages")
        .select(selectFields.replace(", category", ""))
        .order("service_slug", { ascending: true })

      if (fallback.error) {
        console.error("Failed to fetch category services without category filter", { category, error: fallback.error })
      }
      rows = (fallback.data as ContentServicePageRow[]) ?? []
    }
  }

  if (!rows.length) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("content_service_pages")
      .select(selectFields.replace(", category", ""))
      .order("service_slug", { ascending: true })

    if (fallbackError) {
      console.error("Failed to fetch services without category filter", { category, error: fallbackError })
    }
    rows = (fallbackData as ContentServicePageRow[]) ?? []
  }

  const servicesContent = await getContentServices(category)
  const seedPrefix = domain || "default"

  const baseRows: ContentServicePageRow[] = rows.length
    ? rows
    : serviceDefinitions.map((svc) => ({ service_slug: svc.slug }))

  const mapped = baseRows
    .map((row) => {
      const slug = String(row.service_slug || "").trim()
      if (!slug) return null

      const seed = `${seedPrefix}:${slug}`
      const legacy = getLegacyContent(slug, servicesContent, seed, variables, legacyFields, serviceDefinitions)

      const title =
        legacy.title ||
        processContent(row.service_title || row.hero_headline_spintax || formatTitleFromSlug(slug), seed, variables)

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
