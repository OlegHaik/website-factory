import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { DEFAULT_SERVICES, getServiceBySlug } from "@/lib/water-damage"
import { processContent } from "@/lib/spintax"
import { getContentHeader, getContentServicePage, parseContentMap } from "@/lib/fetch-content"
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_SERVICE_NAV, DEFAULT_SERVICE_PAGE } from "@/lib/default-content"
import { generatePageMetadata } from "@/lib/generate-metadata"
import { parseSocialLinks } from "@/lib/types"

import { Header } from "@/components/header"
import { ServiceHero } from "@/components/service-hero"
import { ServiceContent } from "@/components/service-content"
import { ServiceTrust } from "@/components/service-trust"
import { ServiceCTA } from "@/components/service-cta"
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
  const { site, domain: requestDomain } = await resolveSiteContext()

  const service = getServiceBySlug(serviceSlug)
  if (!site || !service) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const domain = site.resolvedDomain || requestDomain || "default"

  const serviceMetaMap: Record<string, "service_water" | "service_fire" | "service_mold" | "service_biohazard" | "service_burst" | "service_sewage"> = {
    "water-damage-restoration": "service_water",
    "fire-smoke-damage": "service_fire",
    "mold-remediation": "service_mold",
    "biohazard-cleanup": "service_biohazard",
    "burst-pipe-repair": "service_burst",
    "sewage-cleanup": "service_sewage",
  }

  const metaType = serviceMetaMap[serviceSlug] || "service_water"
  return generatePageMetadata(
    metaType,
    domain,
    {
      city: site.city || "",
      state: site.state || "",
      business_name: site.business_name || "Restoration Services",
      phone: site.phone || "",
    },
    serviceSlug,
  )
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

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)

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

  const seed = `${domain}:${serviceSlug}`

  // Process all fields with spintax
  const content = {
    heroHeadline: processContent(pageContent?.hero_headline_spintax || defaults.hero_headline, seed, variables),
    heroSubheadline: processContent(pageContent?.hero_subheadline_spintax || defaults.hero_subheadline, seed, variables),
    heroCtaSecondary: processContent(
      pageContent?.hero_cta_secondary_spintax || defaults.hero_cta_secondary,
      seed,
      variables,
    ),
    sectionHeadline: processContent(pageContent?.section_headline_spintax || defaults.section_headline, seed, variables),
    sectionBody: processContent(pageContent?.section_body_spintax || defaults.section_body, seed, variables),
    processHeadline: processContent(pageContent?.process_headline_spintax || defaults.process_headline, seed, variables),
    processBody: processContent(pageContent?.process_body_spintax || defaults.process_body, seed, variables),
    midpageCtaHeadline: processContent(
      pageContent?.midpage_cta_headline_spintax || defaults.midpage_cta_headline,
      seed,
      variables,
    ),
    midpageCtaSubtext: processContent(
      pageContent?.midpage_cta_subtext_spintax || defaults.midpage_cta_subtext,
      seed,
      variables,
    ),
    whyChooseHeadline: processContent(
      pageContent?.why_choose_headline_spintax || defaults.why_choose_headline,
      seed,
      variables,
    ),
    trustPoints: processContent(pageContent?.trust_points_spintax || defaults.trust_points, seed, variables),
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
      <ServiceHero
        headline={content.heroHeadline}
        subheadline={content.heroSubheadline}
        ctaSecondaryText={content.heroCtaSecondary}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
      />
      <ServiceContent
        serviceTitle={service.title}
        serviceDescription={service.shortDescription}
        sectionHeadline={content.sectionHeadline}
        sectionBody={content.sectionBody}
        processHeadline={content.processHeadline}
        processBody={content.processBody}
        city={site.city}
        state={site.state}
        serviceAreas={serviceAreas}
        otherServices={otherServices}
      />
      <ServiceTrust headline={content.whyChooseHeadline} trustPoints={content.trustPoints} />

      <ServiceCTA
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
        headline={content.midpageCtaHeadline}
        subheadline={content.midpageCtaSubtext}
      />
      <Footer
        businessName={site.business_name}
        siteId={site.id}
        domain={site.resolvedDomain}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        address={site.address}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
        ourLinksLabel={ourLinksLabel}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
