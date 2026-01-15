import type { Metadata } from "next"

import { getContentMeta } from "@/lib/fetch-content"
import { DEFAULT_META } from "@/lib/default-content"
import { processContent } from "@/lib/spintax"

type MetaVariables = Record<string, string>

type MetaDefaults = { title: string; description: string }

// Map code pageTypes to database page_type values
const pageTypeMap: Record<string, string> = {
  homepage: "home",
  service_area: "area",
  privacy_policy: "privacy",
  terms_of_use: "terms",
  // These map to themselves
  home: "home",
  service: "service",
  area: "area",
  terms: "terms",
  privacy: "privacy",
  feedback: "feedback",
}

export async function generatePageMetadata(
  pageType: keyof typeof DEFAULT_META | (string & {}),
  domain: string,
  variables: MetaVariables,
  seedSuffix: string = "",
  category: string = "water_damage",
): Promise<Metadata> {
  // Map pageType to database page_type
  const dbPageType = pageTypeMap[pageType] || pageType
  const metaContent = await getContentMeta(category, dbPageType)
  const defaults = (DEFAULT_META as Record<string, MetaDefaults>)[pageType] || DEFAULT_META.homepage

  const seed = `${domain}${seedSuffix}`

  const title = processContent(metaContent?.title || defaults.title, seed, variables)
  const description = processContent(metaContent?.description || defaults.description, seed, variables)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
