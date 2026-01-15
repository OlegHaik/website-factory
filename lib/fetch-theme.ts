import { createClient } from "@/lib/supabase/server"
import { DEFAULT_THEME, type ThemeColors } from "@/lib/theme"
import { normalizeCategory } from "@/lib/content-guard"

export async function getThemeByStyleId(styleId: number): Promise<ThemeColors> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("config_styles")
    .select("*")
    .eq("id", styleId)
    .single()

  if (error || !data) {
    console.error("Failed to fetch theme:", error)
    return DEFAULT_THEME
  }

  return {
    warm_dark: data.warm_dark || DEFAULT_THEME.warm_dark,
    warm_med: data.warm_med || DEFAULT_THEME.warm_med,
    warm_bright: data.warm_bright || DEFAULT_THEME.warm_bright,
    cool_dark: data.cool_dark || DEFAULT_THEME.cool_dark,
    cool_med: data.cool_med || DEFAULT_THEME.cool_med,
    cool_accent: data.cool_accent || DEFAULT_THEME.cool_accent,
    accent_primary: data.accent_primary || DEFAULT_THEME.accent_primary,
    accent_hover: data.accent_hover || DEFAULT_THEME.accent_hover,
    font_family: data.font_family || DEFAULT_THEME.font_family,
  }
}

export interface FontConfig {
  headingFont: string
  bodyFont: string
}

export async function getThemeFonts(category: string): Promise<FontConfig> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()

  // Try category_styles table first
  const { data: styleData, error: styleError } = await supabase
    .from("category_styles")
    .select("heading_font, body_font")
    .eq("category", normalizedCategory)
    .maybeSingle()

  if (!styleError && styleData) {
    return {
      headingFont: styleData.heading_font || "Outfit",
      bodyFont: styleData.body_font || "Poppins"
    }
  }

  // Fallback to sites table
  const { data: siteData, error: siteError } = await supabase
    .from("sites")
    .select("heading_font, body_font")
    .eq("category", normalizedCategory)
    .maybeSingle()

  if (!siteError && siteData && siteData.heading_font) {
    return {
      headingFont: siteData.heading_font || "Outfit",
      bodyFont: siteData.body_font || "Poppins"
    }
  }

  // Default fonts based on category
  const categoryFonts: Record<string, FontConfig> = {
    water_damage: { headingFont: "Outfit", bodyFont: "Poppins" },
    roofing: { headingFont: "Montserrat", bodyFont: "Open Sans" },
    mold_remediation: { headingFont: "Raleway", bodyFont: "Merriweather" },
    chimney: { headingFont: "Roboto Slab", bodyFont: "Lora" },
    kitchen_remodel: { headingFont: "Playfair Display", bodyFont: "Source Sans Pro" },
    bathroom_remodel: { headingFont: "Lora", bodyFont: "Merriweather" },
    adu_builder: { headingFont: "Montserrat", bodyFont: "Open Sans" },
    air_conditioning: { headingFont: "Open Sans", bodyFont: "Lato" },
    air_duct: { headingFont: "Rubik", bodyFont: "Inter" },
    garage_door: { headingFont: "Nunito", bodyFont: "Open Sans" },
    heating: { headingFont: "Source Sans Pro", bodyFont: "Roboto" },
    locksmith: { headingFont: "Inter", bodyFont: "Roboto" },
    pest_control: { headingFont: "Karla", bodyFont: "Open Sans" },
    plumbing: { headingFont: "Barlow", bodyFont: "Lato" },
    pool_contractor: { headingFont: "Quicksand", bodyFont: "Nunito" }
  }

  return categoryFonts[normalizedCategory] || {
    headingFont: "Outfit",
    bodyFont: "Poppins"
  }
}
