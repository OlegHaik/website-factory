import type { Metadata } from "next"

import { getContentMeta } from "@/lib/fetch-content"
import { DEFAULT_META } from "@/lib/default-content"
import { processContent } from "@/lib/spintax"

type MetaVariables = Record<string, string>

type MetaDefaults = { title: string; description: string }

export async function generatePageMetadata(
  pageType: keyof typeof DEFAULT_META | (string & {}),
  domain: string,
  variables: MetaVariables,
  seedSuffix: string = "",
  category: string = "water_damage",
): Promise<Metadata> {
  const metaContent = await getContentMeta(category, pageType)
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
