import { notFound } from 'next/navigation'
import { getCitationsForSite, getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraFooter } from '@/components/aurora-footer'
import { DEFAULT_SERVICES } from '@/lib/water-damage'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function LinksPage() {
  const { site } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  const citations = await getCitationsForSite(site.id)

  const placeholderLinks = [
    { label: 'Hotfrog', href: 'https://www.hotfrog.com/' },
    { label: 'Brownbook', href: 'https://www.brownbook.net/' },
    { label: 'EZ Local', href: 'https://ezlocal.com/' },
    { label: 'City Squares', href: 'https://citysquares.com/' },
    { label: 'Yelp', href: 'https://www.yelp.com/' },
    { label: 'Google Business', href: site.google_business_url || 'https://www.google.com/business/' },
    { label: 'Find Us Here', href: 'https://www.find-us-here.com/' },
    { label: 'N49', href: 'https://www.n49.com/' },
    { label: 'Bizidex', href: 'https://www.bizidex.com/' },
  ]

  const links = citations.length > 0 ? citations : placeholderLinks

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const areaLinks = areaIndex.map((a) => ({
    label: a.city,
    href: `/service-area/${a.slug}`,
  }))

  const serviceAreasDropdown = areaLinks
  const preferredFooterCities = ['Jersey City', 'Hoboken', 'North Bergen', 'West New York', 'Edgewater']
  const preferredFooterAreas = preferredFooterCities
    .map((name) => areaLinks.find((a) => a.label.toLowerCase() === name.toLowerCase()))
    .filter((x): x is { label: string; href: string } => Boolean(x))
  const remainingFooterAreas = areaLinks.filter((a) => !preferredFooterAreas.some((p) => p.href === a.href))
  const footerServiceAreas = [...preferredFooterAreas, ...remainingFooterAreas].slice(0, 5)
  const footerFallbackAreas = [
    { label: 'Jersey City', href: '/service-area/jersey-city' },
    { label: 'Hoboken', href: '/service-area/hoboken' },
    { label: 'North Bergen', href: '/service-area/north-bergen' },
    { label: 'West New York', href: '/service-area/west-new-york' },
    { label: 'Edgewater', href: '/service-area/edgewater' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader
        businessName={site.business_name}
        nav={nav}
        phone={site.phone || ''}
        services={servicesDropdown}
        serviceAreas={serviceAreasDropdown}
      />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-slate-900">Find Us Around the Web</h1>
            <p className="mt-2 text-sm text-slate-600">Business directory links and citations for {site.business_name}.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((l) => (
                <Card key={l.href} className="border-slate-200 py-0">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-xl p-0 transition-colors hover:bg-slate-50"
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-base text-slate-900">
                        <span>{l.label}</span>
                        <ExternalLink className="h-4 w-4 text-slate-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="break-all text-sm text-slate-600">{l.href}</div>
                    </CardContent>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AuroraFooter
        businessName={site.business_name}
        city={site.city}
        state={site.state}
        serviceAreas={footerServiceAreas.length > 0 ? footerServiceAreas : footerFallbackAreas}
        socialLinks={site.socialLinks}
      />
    </div>
  )
}
