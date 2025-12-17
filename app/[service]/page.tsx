import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { DEFAULT_SERVICES, getServiceBySlug } from "@/lib/water-damage"
import { processContent } from "@/lib/spintax"
import { getContentHeader, getContentServicePage, parseContentMap } from "@/lib/fetch-content"
import { DEFAULT_NAV, DEFAULT_SERVICE_NAV, DEFAULT_SERVICE_PAGE } from "@/lib/default-content"

import { Header } from "@/components/header"
import { ServiceHero } from "@/components/service-hero"
import { ServiceContent } from "@/components/service-content"
import { CTASection } from "@/components/cta-section"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return DEFAULT_SERVICES.map((s) => ({ service: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service: serviceSlug } = await params
  const { site } = await resolveSiteContext()

  const service = getServiceBySlug(serviceSlug)
  if (!site || !service) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const businessName = site.business_name || 'Restoration Services'
  return {
    title: `${service.title} | ${businessName}`,
    description: site.meta_description || service.shortDescription,
  }
}

const serviceKeyMap: Record<string, keyof typeof DEFAULT_SERVICE_PAGE> = {
  "water-damage-restoration": "water",
  "fire-smoke-damage": "fire",
  "mold-remediation": "mold",
  "biohazard-cleanup": "biohazard",
  "burst-pipe-repair": "burst",
  "sewage-cleanup": "sewage",
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service: serviceSlug } = await params
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const service = getServiceBySlug(serviceSlug)
  if (!service) notFound()

  const serviceKey = serviceKeyMap[serviceSlug]
  if (!serviceKey) notFound()

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
  const otherServices = DEFAULT_SERVICES.filter((s) => s.slug !== service.slug).map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  const domain = site.resolvedDomain || site.domain_url || requestDomain || "default"
  const variables = {
    city: site.city,
    state: site.state,
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

  const serviceNavLabels = {
    water: processContent(DEFAULT_SERVICE_NAV.water, domain, variables),
    fire: processContent(DEFAULT_SERVICE_NAV.fire, domain, variables),
    mold: processContent(DEFAULT_SERVICE_NAV.mold, domain, variables),
    biohazard: processContent(DEFAULT_SERVICE_NAV.biohazard, domain, variables),
    burst: processContent(DEFAULT_SERVICE_NAV.burst, domain, variables),
    sewage: processContent(DEFAULT_SERVICE_NAV.sewage, domain, variables),
  }

  const pageContent = await getContentServicePage(serviceSlug)
  const defaults = DEFAULT_SERVICE_PAGE[serviceKey]

  const heroTitle = processContent(pageContent?.hero_headline_spintax || defaults.hero_headline, domain, variables)
  const heroDescription = processContent(
    pageContent?.hero_description_spintax || defaults.hero_description,
    domain,
    variables,
  )
  const introText = processContent(pageContent?.intro_spintax || defaults.intro, domain, variables)

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
      <ServiceHero
        title={heroTitle}
        description={heroDescription}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
      />
      <ServiceContent
        serviceTitle={service.title}
        serviceDescription={service.shortDescription}
        intro={introText}
        city={site.city}
        state={site.state}
        serviceAreas={serviceAreas}
        otherServices={otherServices}
      />
      <CTASection
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
      />
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
