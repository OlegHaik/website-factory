import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { processContent } from '@/lib/spintax'
import { fetchLinks, getContentHeader } from '@/lib/fetch-content'
import { DEFAULT_HEADER, DEFAULT_NAV } from '@/lib/default-content'
import { parseSocialLinks } from '@/lib/types'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { normalizeUrl } from '@/lib/normalize-url'
import { createClient } from '@/lib/supabase/server'
import { normalizeDomainUrl } from '@/lib/domain'
import { fetchCategoryServices } from '@/lib/services'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await resolveSiteContext()
  const businessName = site?.business_name || 'Company'
  return {
    title: `${businessName} Around the Web | Business Listings & Citations`,
    description: `Business listings and citations for ${businessName}.`,
  }
}

export default async function LinksPage() {
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name || !site.phone) {
    console.error('Site missing required fields:', { business_name: !!site.business_name, phone: !!site.phone })
    notFound()
  }

  const domain = site.resolvedDomain || requestDomain || 'default'
  const category = site.category || 'water_damage'

  const supabase = await createClient()

  async function getMainSiteIdForDomain(currentSite: NonNullable<typeof site>): Promise<number> {
    if (currentSite.is_main) return currentSite.id

    const normalizedDomain = normalizeDomainUrl(currentSite.domain_url || requestDomain || '')
    if (!normalizedDomain) return currentSite.id

    const candidates = [
      normalizedDomain,
      `https://${normalizedDomain}`,
      `http://${normalizedDomain}`,
      `www.${normalizedDomain}`,
      `https://www.${normalizedDomain}`,
      `http://www.${normalizedDomain}`,
    ].filter(Boolean)

    const { data, error } = await supabase
      .from('sites')
      .select('id')
      .in('domain_url', candidates)
      .eq('is_main', true)
      .order('id', { ascending: true })
      .limit(1)

    if (error) {
      console.error('Supabase error resolving main site for links', { domain, error })
      return currentSite.id
    }

    const mainRow = data?.[0] as { id?: number } | undefined
    return mainRow?.id ?? currentSite.id
  }

  const mainSiteId = await getMainSiteIdForDomain(site)
  const siteCategory = site.category || 'water_damage'

  // Links not available in new structure
  const links: any[] = []

  const normalizedLinks: Array<{ id: number; title: string; href: string; description: string; category: string }> = []

  const grouped = new Map<string, Array<{ id: number; title: string; href: string; description: string }>>()
  for (const item of normalizedLinks) {
    const list = grouped.get(item.category) ?? []
    list.push({ id: item.id, title: item.title, href: item.href, description: item.description })
    grouped.set(item.category, list)
  }

  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b))

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const variables = {
    city: site.city || '',
    state: site.state || '',
    business_name: site.business_name,
    phone: site.phone,
  }

  const categoryServices = await fetchCategoryServices({ category, domain, variables })

  const headerContent = await getContentHeader(category)

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, domain, variables),
  }

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)
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
        servicesLinks={categoryServices.map((svc) => ({ href: svc.href, label: svc.title }))}
      />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {site.business_name} Around the Web | Business Listings &amp; Citations
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Find {site.business_name} on business directories and across the web.
            </p>

            {normalizedLinks.length === 0 ? (
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
                <h2 className="text-base font-semibold text-slate-900">No links available yet</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This site doesn&apos;t have citations/links configured yet.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-10">
                {sortedCategories.map((category) => {
                  const items = grouped.get(category) ?? []
                  if (items.length === 0) return null

                  const showCategoryHeading = sortedCategories.length > 1

                  return (
                    <section key={category} className="space-y-4">
                      {showCategoryHeading ? (
                        <h2 className="text-xl font-semibold text-slate-900">{category}</h2>
                      ) : null}

                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {items.map((l) => (
                          <a
                            key={l.id}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900 truncate">{l.title}</div>
                              {l.description ? (
                                <p className="text-[11px] text-slate-600 truncate">{l.description}</p>
                              ) : null}
                              <div className="text-[10px] text-slate-500 truncate">{l.href}</div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
                          </a>
                        ))}
                      </div>
                    </section>
                  )
                })}
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
        servicesLinks={categoryServices.map((svc) => ({ href: svc.href, label: svc.title }))}
        category={category}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
