import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { processContent } from "@/lib/spintax"
import { getContentCTA, getContentHeader, getContentHero, getContentServices, parseContentMap } from "@/lib/fetch-content"
import { DEFAULT_CTA, DEFAULT_HEADER, DEFAULT_HERO, DEFAULT_SERVICES } from "@/lib/default-content"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await resolveSiteContext()
  if (!site) {
    return {
      title: 'Restoration Services',
      description: 'Professional water damage restoration services.',
    }
  }

  const businessName = site.business_name || 'Restoration Services'
  const description = site.meta_description || 'Professional water damage restoration services. Fast response, expert technicians, and complete property restoration.'

  return {
    title: site.meta_title || businessName,
    description,
    openGraph: {
      title: site.meta_title || businessName,
      description,
      type: 'website',
    },
  }
}

export default async function Home() {
  const { site } = await resolveSiteContext()

  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas =
    areaIndex.length > 0
      ? areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
      : (site.serviceAreas ?? [])

  const domain = site.resolvedDomain || site.domain_url || "default"
  const contentMap = parseContentMap(site.content_map)

  const variables = {
    city: site.city,
    state: site.state,
    business_name: site.business_name,
    phone: site.phone,
  }

  const headerContent = contentMap.header ? await getContentHeader(contentMap.header) : null
  const heroContent = contentMap.hero ? await getContentHero(contentMap.hero) : null
  const servicesContent = contentMap.services ? await getContentServices(contentMap.services) : null
  const ctaContent = contentMap.cta ? await getContentCTA(contentMap.cta) : null

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_HEADER.nav_home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_HEADER.nav_services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_HEADER.nav_areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_HEADER.nav_contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_HEADER.call_button_text, domain, variables),
  }

  const heroTitle = processContent(heroContent?.headline_spintax || DEFAULT_HERO.headline_spintax, domain, variables)
  const heroDesc = processContent(
    heroContent?.subheadline_spintax || DEFAULT_HERO.subheadline_spintax,
    domain,
    variables,
  )
  const chatButtonText = processContent(
    heroContent?.chat_button_spintax || DEFAULT_HERO.chat_button_spintax,
    domain,
    variables,
  )

  const serviceData = {
    water: {
      title: processContent(servicesContent?.water_title || DEFAULT_SERVICES.water_title, domain, variables),
      description: processContent(
        servicesContent?.water_description || DEFAULT_SERVICES.water_description,
        domain,
        variables,
      ),
    },
    fire: {
      title: processContent(servicesContent?.fire_title || DEFAULT_SERVICES.fire_title, domain, variables),
      description: processContent(
        servicesContent?.fire_description || DEFAULT_SERVICES.fire_description,
        domain,
        variables,
      ),
    },
    mold: {
      title: processContent(servicesContent?.mold_title || DEFAULT_SERVICES.mold_title, domain, variables),
      description: processContent(
        servicesContent?.mold_description || DEFAULT_SERVICES.mold_description,
        domain,
        variables,
      ),
    },
    biohazard: {
      title: processContent(
        servicesContent?.biohazard_title || DEFAULT_SERVICES.biohazard_title,
        domain,
        variables,
      ),
      description: processContent(
        servicesContent?.biohazard_description || DEFAULT_SERVICES.biohazard_description,
        domain,
        variables,
      ),
    },
    burst: {
      title: processContent(servicesContent?.burst_title || DEFAULT_SERVICES.burst_title, domain, variables),
      description: processContent(
        servicesContent?.burst_description || DEFAULT_SERVICES.burst_description,
        domain,
        variables,
      ),
    },
    sewage: {
      title: processContent(servicesContent?.sewage_title || DEFAULT_SERVICES.sewage_title, domain, variables),
      description: processContent(
        servicesContent?.sewage_description || DEFAULT_SERVICES.sewage_description,
        domain,
        variables,
      ),
    },
  }

  const ctaHeadline = processContent(ctaContent?.headline_spintax || DEFAULT_CTA.headline_spintax, domain, variables)
  const ctaSubheadline = processContent(
    ctaContent?.subheadline_spintax || DEFAULT_CTA.subheadline_spintax,
    domain,
    variables,
  )
  const ctaChatButtonText = processContent(
    ctaContent?.chat_button_spintax || DEFAULT_CTA.chat_button_spintax,
    domain,
    variables,
  )

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={domain}
        navLabels={navLabels}
      />
      <Hero
        title={heroTitle}
        description={heroDesc}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={domain}
        chatButtonText={chatButtonText}
      />

      <Services domain={domain} serviceContent={serviceData} />
      <About
        businessName={site.business_name}
        city={site.city}
        state={site.state}
        serviceAreas={serviceAreas}
      />
      <FAQ />
      <Testimonials />
      <CTASection
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
        headline={ctaHeadline}
        subheadline={ctaSubheadline}
        chatButtonText={ctaChatButtonText}
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
