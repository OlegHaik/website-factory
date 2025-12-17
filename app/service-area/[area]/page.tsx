import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, getSiteByDomainAndSlug, resolveSiteContext } from "@/lib/sites"
import { DEFAULT_SERVICES } from "@/lib/water-damage"
import { processContent } from "@/lib/spintax"
import { generatePageMetadata } from "@/lib/generate-metadata"
import { getContentHeader, getContentServiceArea, parseContentMap } from "@/lib/fetch-content"
import { DEFAULT_NAV, DEFAULT_SERVICE_AREA, DEFAULT_SERVICE_NAV } from "@/lib/default-content"
import { parseSocialLinks } from "@/lib/types"

import { Header } from "@/components/header"
import { ServiceAreaHero } from "@/components/service-area-hero"
import { ServiceAreaContent } from "@/components/service-area-content"
import { CTASection } from "@/components/cta-section"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>
}): Promise<Metadata> {
  const { area: areaSlug } = await params
  const { site: mainSite, domain } = await resolveSiteContext()

  if (!domain) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const areaSite = await getSiteByDomainAndSlug(domain, areaSlug)
  if (!mainSite || !areaSite) {
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const businessName = areaSite.business_name || mainSite.business_name || 'Restoration Services'
  const resolvedDomain = areaSite.resolvedDomain || areaSite.domain_url || domain || "default"

  return generatePageMetadata(
    "service_area",
    resolvedDomain,
    {
      city: areaSite.city || mainSite.city || "",
      state: areaSite.state || mainSite.state || "",
      business_name: businessName,
      phone: areaSite.phone || mainSite.phone || "",
    },
    areaSlug,
  )
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ area: string }>
}) {
  const { area: areaSlug } = await params
  const { site: mainSite, domain } = await resolveSiteContext()

  if (process.env.SITE_DEBUG === '1') {
    console.log('=== SERVICE AREA DEBUG ===')
    console.log('Area slug:', areaSlug)
    console.log('Main site:', mainSite?.business_name)
    console.log('Domain:', domain)
  }

  if (!mainSite || !domain) notFound()

  const areaSite = await getSiteByDomainAndSlug(domain, areaSlug)
  if (process.env.SITE_DEBUG === '1') {
    console.log('Area site found:', areaSite ? 'YES' : 'NO')
  }
  if (!areaSite) notFound()

  if (!areaSite.business_name) throw new Error('Site is missing required field: business_name')
  if (!areaSite.phone) throw new Error('Site is missing required field: phone')
  if (!areaSite.city) throw new Error('Site is missing required field: city')
  if (!areaSite.state) throw new Error('Site is missing required field: state')

  const areaName = areaSite.city
  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
  const otherAreas = areaIndex
    .filter((a) => a.slug !== areaSlug)
    .map((a) => ({ name: a.city, slug: a.slug }))

  const services = DEFAULT_SERVICES.map((s) => ({ label: s.title, href: `/${s.slug}` }))

  const resolvedDomain = areaSite.resolvedDomain || areaSite.domain_url || domain || "default"
  const variables = {
    city: areaSite.city,
    state: areaSite.state,
    business_name: areaSite.business_name,
    phone: areaSite.phone,
  }

  const mainContentMap = parseContentMap(mainSite.content_map)
  const areaContentMap = parseContentMap(areaSite.content_map)
  const contentMap = { ...mainContentMap, ...areaContentMap }

  const headerContent = contentMap.header ? await getContentHeader(contentMap.header) : null
  const areaContent = await getContentServiceArea(contentMap.service_area || 1)

  const areaSeed = resolvedDomain + areaSlug

  const heroTitle = processContent(
    areaContent?.hero_headline_spintax || DEFAULT_SERVICE_AREA.hero_headline,
    areaSeed,
    variables,
  )

  const heroDescription = processContent(
    areaContent?.hero_description_spintax || DEFAULT_SERVICE_AREA.hero_description,
    areaSeed,
    variables,
  )

  const introTitle = processContent(
    areaContent?.intro_title_spintax || DEFAULT_SERVICE_AREA.intro_title,
    areaSeed,
    variables,
  )

  const introText = processContent(areaContent?.intro_spintax || DEFAULT_SERVICE_AREA.intro, areaSeed, variables)

  const servicesTitle = processContent(
    areaContent?.services_title_spintax || DEFAULT_SERVICE_AREA.services_title,
    areaSeed,
    variables,
  )

  const servicesIntro = processContent(
    areaContent?.services_intro_spintax || DEFAULT_SERVICE_AREA.services_intro,
    areaSeed,
    variables,
  )

  const whyChooseTitle = processContent(
    areaContent?.why_choose_title_spintax || DEFAULT_SERVICE_AREA.why_choose_title,
    areaSeed,
    variables,
  )

  const whyChooseText = processContent(
    areaContent?.why_choose_spintax || DEFAULT_SERVICE_AREA.why_choose,
    areaSeed,
    variables,
  )

  const ctaHeadline = processContent(
    areaContent?.cta_headline_spintax || DEFAULT_SERVICE_AREA.cta_headline,
    areaSeed,
    variables,
  )

  const ctaDescription = processContent(
    areaContent?.cta_description_spintax || DEFAULT_SERVICE_AREA.cta_description,
    areaSeed,
    variables,
  )

  const socialLinks = parseSocialLinks(areaSite)

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, resolvedDomain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, resolvedDomain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, resolvedDomain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, resolvedDomain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, resolvedDomain, variables),
  }

  const serviceNavLabels = {
    water: processContent(DEFAULT_SERVICE_NAV.water, resolvedDomain, variables),
    fire: processContent(DEFAULT_SERVICE_NAV.fire, resolvedDomain, variables),
    mold: processContent(DEFAULT_SERVICE_NAV.mold, resolvedDomain, variables),
    biohazard: processContent(DEFAULT_SERVICE_NAV.biohazard, resolvedDomain, variables),
    burst: processContent(DEFAULT_SERVICE_NAV.burst, resolvedDomain, variables),
    sewage: processContent(DEFAULT_SERVICE_NAV.sewage, resolvedDomain, variables),
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={areaSite.business_name}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={resolvedDomain}
        navLabels={navLabels}
        serviceNavLabels={serviceNavLabels}
      />
      <ServiceAreaHero
        title={heroTitle}
        description={heroDescription}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
      />
      <ServiceAreaContent
        areaName={areaName}
        state={areaSite.state}
        services={services}
        otherAreas={otherAreas}
        content={{
          intro: { title: introTitle, text: introText },
          services: { title: servicesTitle, intro: servicesIntro },
          whyChoose: { title: whyChooseTitle, text: whyChooseText },
        }}
      />
      <CTASection
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
        headline={ctaHeadline}
        subheadline={ctaDescription}
      />
      <Footer
        businessName={areaSite.business_name}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        address={areaSite.address}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
      />
      <FloatingCall phone={areaSite.phone} />
    </div>
  )
}
