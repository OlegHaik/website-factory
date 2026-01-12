import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { processContent } from "@/lib/spintax"
import { getContentHeader, getContentServicePage, getContentMeta } from "@/lib/fetch-content"
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_SERVICE_PAGE, getDefaultServicePageForCategory } from "@/lib/default-content"
import { generatePageMetadata } from "@/lib/generate-metadata"
import { parseSocialLinks } from "@/lib/types"
import { fetchCategoryServices } from "@/lib/services"

import { Header } from "@/components/header"
import { ServiceHero } from "@/components/service-hero"
import { ServiceContent } from "@/components/service-content"
import { ServiceTrust } from "@/components/service-trust"
import { ServiceCTA } from "@/components/service-cta"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"
import { SchemaMarkup } from "@/components/schema-markup"

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service: serviceSlug } = await params
  const { site, domain: requestDomain } = await resolveSiteContext()

  if (!site) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const domain = site.resolvedDomain || requestDomain || "default"
  const category = site.category || 'water_damage'

  const variables = {
    city: site.city || "",
    state: site.state || "",
    business_name: site.business_name || "Restoration Services",
    phone: site.phone || "",
  }

  const services = await fetchCategoryServices({ category, domain, variables })
  const service = services.find((svc) => svc.slug === serviceSlug)

  if (!service) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const preferredMetaType = `service_${serviceSlug.replace(/-/g, "_")}`
  const preferredMeta = await getContentMeta(preferredMetaType, category)

  const legacyMetaMap: Record<string, string> = {
    "water-damage-restoration": "service_water_damage",
    "fire-smoke-damage": "service_fire_damage",
    "mold-remediation": "service_mold",
    "biohazard-cleanup": "service_biohazard",
    "burst-pipe-repair": "service_burst_pipe",
    "sewage-cleanup": "service_sewage",
  }

  const fallbackMetaType = legacyMetaMap[serviceSlug] || preferredMetaType
  const metaType = preferredMeta ? preferredMetaType : fallbackMetaType
  const fallbackMeta = await generatePageMetadata(
    metaType,
    domain,
    variables,
    serviceSlug,
    category,
  )

  if (category !== "roofing") return fallbackMeta

  const pageContent = await getContentServicePage(serviceSlug, category)
  const seed = `${domain}:${serviceSlug}:meta`

  const metaTitle = pageContent?.meta_title_spintax
    ? processContent(pageContent.meta_title_spintax, seed, variables)
    : null
  const metaDescription = pageContent?.meta_description_spintax
    ? processContent(pageContent.meta_description_spintax, seed, variables)
    : null

  const title = metaTitle ?? (fallbackMeta.title ?? undefined)
  const description = metaDescription ?? (fallbackMeta.description ?? undefined)

  return {
    ...fallbackMeta,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    openGraph: {
      ...(fallbackMeta.openGraph || {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
    twitter: {
      ...(fallbackMeta.twitter || {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
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

  // Gracefully handle missing required fields
  if (!site.business_name || !site.phone || !site.city || !site.state) {
    console.error('Site missing required fields:', {
      business_name: !!site.business_name,
      phone: !!site.phone,
      city: !!site.city,
      state: !!site.state
    })
    notFound()
  }
  const category = site.category || 'water_damage'

  const variables = {
    city: site.city,
    state: site.state,
    business_name: site.business_name,
    phone: site.phone,
  }

  const services = await fetchCategoryServices({ category, domain: site.resolvedDomain || requestDomain || "default", variables })
  const service = services.find((svc) => svc.slug === serviceSlug)
  if (!service) notFound()

  const serviceKey = serviceKeyMap[serviceSlug] || "water"

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
  const otherServices = services
    .filter((s) => s.slug !== service.slug)
    .map((s) => ({ label: s.title, href: s.href }))

  const domain = site.resolvedDomain || site.domain_url || requestDomain || "default"

  const headerContent = await getContentHeader(category)

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, domain, variables),
  }

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)

  const pageContent = await getContentServicePage(serviceSlug, category)
  const defaults = getDefaultServicePageForCategory(serviceKey, category)

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

  const faqItems: { question: string; answer: string }[] = []
  const testimonialItems: { name: string; text: string; location?: string; rating?: number }[] = []
  const breadcrumbs = [
    { name: "Home", url: `https://${domain}` },
    { name: service.title, url: `https://${domain}/${service.slug}` },
  ]

  const servicesForSchema = services.map((s) => s.title).filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <SchemaMarkup
        site={site}
        domain={domain}
        faq={faqItems}
        reviews={testimonialItems}
        services={servicesForSchema}
        headline={content.heroHeadline}
        description={content.heroSubheadline}
        pageType="service"
        serviceName={service.title}
        breadcrumbs={breadcrumbs}
      />
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={domain}
        navLabels={navLabels}
        servicesLinks={services.map((svc) => ({ href: svc.href, label: svc.title }))}
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
        serviceDescription={service.description}
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
        city={site.city}
        state={site.state}
        zipCode={site.zip_code}
        email={site.email}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
        ourLinksLabel={ourLinksLabel}
        servicesLinks={services.map((svc) => ({ href: svc.href, label: svc.title }))}
        category={category}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
