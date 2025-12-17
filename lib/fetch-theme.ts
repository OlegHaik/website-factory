import { createClient } from "@/lib/supabase/server"
import { DEFAULT_THEME, type ThemeColors } from "@/lib/theme"

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
