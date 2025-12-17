import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { headers } from 'next/headers'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeByStyleId } from '@/lib/fetch-theme'
import { DEFAULT_THEME } from '@/lib/theme'
import { resolveSiteContext } from '@/lib/sites'
import './globals.css'

async function getCurrentDomain() {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const domain = host.split(':')[0].replace(/^www\./, '')
  
  if (domain.includes('vercel.app') || domain.includes('localhost')) {
    return process.env.NEXT_PUBLIC_DOMAIN || domain
  }
  
  return domain
}

function getBusinessNameFromDomain(domain: string): string {
  const base = domain.replace(/^www\./, '').replace(/\.(com|net|org|io|app)$/i, '')
  return base
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  const businessName = getBusinessNameFromDomain(domain)
  
  return {
    title: businessName,
    description: '24/7 emergency restoration services. Fast response, expert technicians, and complete property restoration.',
    generator: 'v0.app',
    icons: {
      icon: '/apple-touch-icon.png',
      apple: '/apple-touch-icon.png',
      shortcut: '/apple-touch-icon.png',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { site } = await resolveSiteContext()

  const theme = site?.style_id ? await getThemeByStyleId(site.style_id) : DEFAULT_THEME

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <ThemeProvider theme={theme}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
