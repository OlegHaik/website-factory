import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { processContent } from '@/lib/spintax'
import { getContentHeader, parseContentMap } from '@/lib/fetch-content'
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_SERVICE_NAV } from '@/lib/default-content'
import { parseSocialLinks } from '@/lib/types'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { normalizeUrl } from '@/lib/normalize-url'
import { createClient } from '@/lib/supabase/server'

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

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')

  const domain = site.resolvedDomain || requestDomain || 'default'

  type DbLinkRow = {
    id: number
    site_id: number
    title: string | null
    url: string | null
    description: string | null
    category: string | null
    created_at: string | null
  }

  let links: DbLinkRow[] = []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('links')
      .select('id,site_id,title,url,description,category,created_at')
      .eq('site_id', site.id)
      .order('category', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: true, nullsFirst: true })

    if (error) {
      const msg = error.message || ''
      // If the table isn't present yet in some environments, keep the route stable.
      if (!msg.toLowerCase().includes('does not exist')) {
        console.error('Supabase error fetching links for /links page', { siteId: site.id, domain, error })
      }
      links = []
    } else {
      links = (data ?? []) as DbLinkRow[]
    }
  } catch (err) {
    console.error('Failed to fetch links for /links page', { siteId: site.id, domain, err })
    links = []
  }

  const normalizedLinks = (links ?? [])
    .map((l) => {
      const title = String(l.title ?? '').trim()
      const href =
        normalizeUrl(l.url, {
          allowedProtocols: ['http', 'https'],
          defaultProtocol: 'https',
          context: {
            domain,
            siteId: site.id,
            sourceKey: 'links.table',
          },
        }) ?? ''
      const description = String(l.description ?? '').trim()
      const category = String(l.category ?? '').trim() || 'Other'

      if (!title || !href) return null
      return { id: l.id, title, href, description, category }
    })
    .filter((x): x is { id: number; title: string; href: string; description: string; category: string } => Boolean(x))

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

                  return (
                    <section key={category}>
                      <h2 className="text-xl font-semibold text-slate-900">{category}</h2>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((l) => (
                          <Card key={l.id} className="border-slate-200 py-0">
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block h-full rounded-xl p-0 transition-colors hover:bg-slate-50"
                            >
                              <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-between text-base text-slate-900">
                                  <span>{l.title}</span>
                                  <ExternalLink className="h-4 w-4 text-slate-500" />
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-6">
                                {l.description ? (
                                  <p className="text-sm text-slate-600">{l.description}</p>
                                ) : null}
                                <div className="mt-2 break-all text-xs text-slate-500">{l.href}</div>
                              </CardContent>
                            </a>
                          </Card>
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
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
