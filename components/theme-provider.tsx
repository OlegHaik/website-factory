"use client"

import type { ReactNode } from "react"

import { generateCSSVariables, type ThemeColors } from "@/lib/theme"

interface ThemeProviderProps {
  theme: ThemeColors
  children: ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=${theme.font_family.replace(
          / /g,
          '+',
        )}:wght@400;500;600;700;800&display=swap');

        :root {
          ${generateCSSVariables(theme)}
        }
      `}</style>
      {children}
    </>
  )
}
