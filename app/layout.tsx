import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { headers } from 'next/headers'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-heading' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-body' })

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${openSans.variable} font-body antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
