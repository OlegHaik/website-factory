import { notFound } from 'next/navigation'
import { getCitationsForSite, getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'
import { DEFAULT_SERVICES } from '@/lib/water-damage'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function LinksPage() {
  const { site } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({ label: s.title, href: `/${s.slug}` }))

  const citationsFromDb = await getCitationsForSite(site.id)

  const citations = citationsFromDb.length > 0 ? citationsFromDb : [
    { label: 'Google Business', href: site.google_business_url || '#' },
    { label: 'Yelp', href: 'https://www.yelp.com/' },
    { label: 'Facebook', href: site.facebook_url || '#' },
    { label: 'Hotfrog', href: 'https://www.hotfrog.com/' },
    { label: 'Brownbook', href: 'https://www.brownbook.net/' },
    { label: 'EZ Local', href: 'https://ezlocal.com/' },
    { label: 'City Squares', href: 'https://citysquares.com/' },
    { label: 'Find Us Here', href: 'https://www.find-us-here.com/' },
    { label: 'N49', href: 'https://www.n49.com/' },
    { label: 'Bizidex', href: 'https://www.bizidex.com/' },
    { label: 'Local Business Nation', href: 'https://www.localbusinessnation.com/' },
    { label: 'Cataloxy', href: 'https://www.cataloxy.us/' },
  ]

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  return (
    <div className="min-h-screen bg-white">
      <Header businessName={site.business_name} phone={site.phone} phoneDisplay={site.phoneDisplay || undefined} serviceAreas={serviceAreas} />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-slate-900">Find Us Around the Web</h1>
            <p className="mt-2 text-sm text-slate-600">Business directory links and citations for {site.business_name}.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {citations.map((l) => (
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

      <Footer
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        address={site.address}
        serviceAreas={serviceAreas}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
