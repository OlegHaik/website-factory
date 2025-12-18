import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCitationsForSite, getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { processContent } from '@/lib/spintax'
import { getContentHeader, parseContentMap } from '@/lib/fetch-content'
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_SERVICE_NAV } from '@/lib/default-content'
import { parseSocialLinks } from '@/lib/types'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'
import { DEFAULT_SERVICES } from '@/lib/water-damage'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { normalizeUrl } from '@/lib/normalize-url'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await resolveSiteContext()
  const businessName = site?.business_name || 'Company'
  return {
    title: `Our Links | ${businessName}`,
    description: `Business directory links and citations for ${businessName}.`,
  }
}

export default async function LinksPage() {
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')

  // Keep /links page resilient: if citations table isn't available (or RLS blocks it),
  // fall back to per-site links and then to a safe default list.
  let citationsFromDb: Array<{ label: string; href: string }> = []
  try {
    citationsFromDb = await getCitationsForSite(site.id)
  } catch (err) {
    console.error('Failed to fetch citations for /links page. Falling back to defaults.', err)
    citationsFromDb = []
  }

  const defaultCitations = [
    { label: 'Google Business', href: site.google_business_url || '' },
    { label: 'Facebook', href: site.facebook_url || '' },
    { label: 'Yelp', href: 'https://www.yelp.com/' },
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

  const domain = site.resolvedDomain || requestDomain || 'default'

  const normalize = (items: Array<{ label?: string; href?: string }>, sourceKey: string) =>
    items
      .map((l) => {
        const label = String(l.label || '').trim()
        const rawHref = typeof l.href === 'string' ? l.href : String(l.href ?? '')
        const href =
          normalizeUrl(rawHref, {
            allowedProtocols: ['http', 'https'],
            defaultProtocol: 'https',
            context: {
              domain,
              siteId: site.id,
              sourceKey,
            },
          }) ?? ''

        return { label, href }
      })
      .filter((l) => Boolean(l.label) && Boolean(l.href))

  const merged = [
    ...normalize(citationsFromDb, 'links.citations_db'),
    ...normalize(((site as any).links ?? []) as Array<{ label?: string; href?: string }>, 'links.site_links'),
  ]
  const deduped: Array<{ label: string; href: string }> = []
  const seen = new Set<string>()
  for (const item of merged) {
    const key = item.href.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(item)
  }

  const citations = deduped.length > 0 ? deduped : normalize(defaultCitations, 'links.defaults')

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const variables = {
    city: site.city || '',
    state: site.state || '',
    business_name: site.business_name,
    phone: site.phone,
  }

  const contentMap = parseContentMap(site.content_map)
  const headerContent = contentMap.header ? await getContentHeader(contentMap.header) : null

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, domain, variables),
  }

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)

  const serviceNavLabels = {
    water: processContent(DEFAULT_SERVICE_NAV.water, domain, variables),
    fire: processContent(DEFAULT_SERVICE_NAV.fire, domain, variables),
    mold: processContent(DEFAULT_SERVICE_NAV.mold, domain, variables),
    biohazard: processContent(DEFAULT_SERVICE_NAV.biohazard, domain, variables),
    burst: processContent(DEFAULT_SERVICE_NAV.burst, domain, variables),
    sewage: processContent(DEFAULT_SERVICE_NAV.sewage, domain, variables),
  }

  const socialLinks = parseSocialLinks(site)

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={domain}
        navLabels={navLabels}
        serviceNavLabels={serviceNavLabels}
      />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-slate-900">Our Links</h1>
            <p className="mt-2 text-sm text-slate-600">Business directory links and citations for {site.business_name}.</p>

            {citations.length === 0 ? (
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
                <h2 className="text-base font-semibold text-slate-900">No links available yet</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This site doesn&apos;t have citations/links configured yet.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {citations.map((l) => (
                  <Card key={`${l.href}-${l.label}`} className="border-slate-200 py-0">
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
            )}
          </div>
        </div>
      </main>

      <Footer
        businessName={site.business_name}
        siteId={site.id}
        domain={domain}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        address={site.address}
        city={site.city}
        state={site.state}
        zipCode={site.zip_code}
        email={site.email}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
        ourLinksLabel={ourLinksLabel}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
