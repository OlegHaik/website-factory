export interface ThemeColors {
  warm_dark: string
  warm_med: string
  warm_bright: string
  cool_dark: string
  cool_med: string
  cool_accent: string
  accent_primary: string
  accent_hover: string
  font_family: string
}

export const DEFAULT_THEME: ThemeColors = {
  warm_dark: "#450A0A",
  warm_med: "#7F1D1D",
  warm_bright: "#BA1C1C",
  cool_dark: "#1E3A5F",
  cool_med: "#1E3A8A",
  cool_accent: "#312E81",
  accent_primary: "#BA1C1C",
  accent_hover: "#2CD4BD",
  font_family: "Plus Jakarta Sans",
}

export function generateCSSVariables(theme: ThemeColors): string {
  return `
    --warm-dark: ${theme.warm_dark};
    --warm-med: ${theme.warm_med};
    --warm-bright: ${theme.warm_bright};
    --cool-dark: ${theme.cool_dark};
    --cool-med: ${theme.cool_med};
    --cool-accent: ${theme.cool_accent};
    --accent-primary: ${theme.accent_primary};
    --accent-hover: ${theme.accent_hover};
    --font-family: '${theme.font_family}', system-ui, sans-serif;

    /* Aurora aliases for backwards compatibility */
    --aurora-warm-dark: ${theme.warm_dark};
    --aurora-warm: ${theme.warm_med};
    --aurora-cool-dark: ${theme.cool_dark};
    --aurora-cool: ${theme.cool_med};
    --aurora-accent: ${theme.accent_primary};
    --aurora-accent-hover: ${theme.accent_hover};
  `
}
