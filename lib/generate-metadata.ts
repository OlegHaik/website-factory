import type { Metadata } from "next"

import { getContentMeta } from "@/lib/fetch-content"
import { DEFAULT_META } from "@/lib/default-content"
import { processContent } from "@/lib/spintax"

type MetaVariables = Record<string, string>

export async function generatePageMetadata(
  pageType: keyof typeof DEFAULT_META,
  domain: string,
  variables: MetaVariables,
  seedSuffix: string = "",
  category: string = "water_damage",
): Promise<Metadata> {
  const metaContent = await getContentMeta(pageType, category)
  const defaults = DEFAULT_META[pageType]

  const seed = `${domain}${seedSuffix}`

  const title = processContent(metaContent?.title_spintax || defaults.title, seed, variables)
  const description = processContent(metaContent?.description_spintax || defaults.description, seed, variables)

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
