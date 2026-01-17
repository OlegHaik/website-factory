import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { processContent } from '@/lib/spintax'
import { getContentHeader, getContentLegal } from '@/lib/fetch-content'
import { DEFAULT_HEADER, DEFAULT_LEGAL, DEFAULT_NAV } from '@/lib/default-content'
import { generatePageMetadata } from '@/lib/generate-metadata'
import { parseSocialLinks } from '@/lib/types'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'
import { SchemaMarkup } from '@/components/schema-markup'
import { fetchCategoryServices } from '@/lib/services'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { site, domain: requestDomain } = await resolveSiteContext()
  const domain = site?.resolvedDomain || site?.domain_url || requestDomain || 'default'
  const category = site?.category || 'water_damage'
  return generatePageMetadata(
    'privacy_policy',
    domain,
    {
      city: site?.city || '',
      state: site?.state || '',
      business_name: site?.business_name || 'Company',
      phone: site?.phone || '',
    },
    'privacy-policy',
    category,
  )
}

export default async function PrivacyPolicyPage() {
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) notFound()
  if (!site.business_name || !site.phone) {
    console.error('Site missing required fields:', { business_name: !!site.business_name, phone: !!site.phone })
    notFound()
  }

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const domain = site.resolvedDomain || site.domain_url || requestDomain || 'default'
  const category = site.category || 'water_damage'
  const variables = {
    city: site.city || '',
    state: site.state || '',
    business_name: site.business_name,
    phone: site.phone,
    address: site.address || '',
    zip_code: site.zip_code || '',
    email:
      site.email ||
      `info@${String(site.domain_url || domain)
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .replace(/^www\./, '')}`,
  }

  const legalContent = await getContentLegal('privacy_policy', category)
  const defaults = DEFAULT_LEGAL.privacy_policy
  const title = legalContent?.title || defaults.title
  const content = processContent(legalContent?.content_spintax || defaults.content, domain, variables)
  const lastUpdated = processContent(
    legalContent?.last_updated_spintax || defaults.last_updated_spintax,
    domain,
    variables,
  )

  const socialLinks = parseSocialLinks(site)

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

  return (
    <div className="min-h-screen bg-white">
      <SchemaMarkup
        site={site}
        domain={domain}
        faq={[]}
        reviews={[]}
        services={[]}
        headline={title}
        description={content}
        pageType="legal"
        breadcrumbs={[
          { name: 'Home', url: `https://${domain}` },
          { name: title, url: `https://${domain}/privacy-policy` },
        ]}
      />
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
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">Last updated: {lastUpdated}</p>

            <div className="mt-8 text-sm leading-relaxed text-slate-700">
              <div
                className="legal-content space-y-6"
                dangerouslySetInnerHTML={{ __html: formatLegalContent(content) }}
              />
            </div>
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

function formatLegalContent(content: string): string {
  const lines = String(content || '').split('\n')
  const result: string[] = []

  // Pattern to detect "Last Updated:" lines that should be skipped (already shown separately)
  const lastUpdatedPattern = /^last\s*updated\s*:/i

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const nextLine = lines[i + 1]?.trim() || ''

    // Handle format: "H2" on one line, content on next
    if (line === 'H2' && nextLine) {
      result.push(`<h2 class="text-xl font-semibold text-slate-900 mt-8 mb-4">${nextLine}</h2>`)
      i++ // Skip next line as we've used it
    } else if (line === 'H3' && nextLine) {
      result.push(`<h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">${nextLine}</h3>`)
      i++
    } else if (line === 'P' && nextLine) {
      // Skip "P" blocks that contain "Last Updated:" - it's already shown separately
      if (lastUpdatedPattern.test(nextLine)) {
        i++ // Skip the nextLine too
        continue
      }
      result.push(`<p class="text-slate-700 mb-4">${nextLine}</p>`)
      i++
    } else if (line === 'BULLETS' && nextLine) {
      // Handle bullet points
      const items = nextLine.split(/[•·]/).map(s => s.trim()).filter(Boolean)
      result.push(`<ul class="list-disc pl-6 space-y-2 mb-4">${items.map(item => `<li class="text-slate-700">${item}</li>`).join('')}</ul>`)
      i++
    } else if (line && line !== 'H2' && line !== 'H3' && line !== 'P' && line !== 'BULLETS') {
      // Skip standalone "Last Updated:" lines too
      if (lastUpdatedPattern.test(line)) {
        continue
      }
      // Regular paragraph if not a marker
      result.push(`<p class="text-slate-700 mb-4">${line}</p>`)
    }
  }

  return result.join('\n')
}
