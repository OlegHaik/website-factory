import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { processContent } from "@/lib/spintax"
import {
  getContentCTA,
  getContentFAQ,
  getContentHeader,
  getContentHero,
  getContentSeoBody,
  getContentServices,
  getContentTestimonials,
  parseContentMap,
  parseFAQItems,
  parseTestimonialItems,
} from "@/lib/fetch-content"
import {
  DEFAULT_CTA,
  DEFAULT_FAQ,
  DEFAULT_HERO,
  DEFAULT_NAV,
  DEFAULT_SEO_BODY,
  DEFAULT_SERVICE_NAV,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
} from "@/lib/default-content"

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
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (process.env.SITE_DEBUG === '1') {
    console.log('=== HOMEPAGE DEBUG ===')
    console.log('Domain:', requestDomain)
    console.log('Site:', site)
    if (!site) console.log('NO SITE FOUND - this causes 404')
  }

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

  const domain = site.resolvedDomain || site.domain_url || requestDomain || "default"
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
  const seoBodyContent = contentMap.seo_body ? await getContentSeoBody(contentMap.seo_body) : null
  const faqContent = contentMap.faq ? await getContentFAQ(contentMap.faq) : null
  const testimonialsContent = contentMap.testimonials ? await getContentTestimonials(contentMap.testimonials) : null

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

  const seoData = {
    intro: processContent(seoBodyContent?.intro_spintax || DEFAULT_SEO_BODY.intro_spintax, domain, variables),
    whyChooseTitle: processContent(
      seoBodyContent?.why_choose_title_spintax || DEFAULT_SEO_BODY.why_choose_title_spintax,
      domain,
      variables,
    ),
    whyChoose: processContent(
      seoBodyContent?.why_choose_spintax || DEFAULT_SEO_BODY.why_choose_spintax,
      domain,
      variables,
    ),
    processTitle: processContent(
      seoBodyContent?.process_title_spintax || DEFAULT_SEO_BODY.process_title_spintax,
      domain,
      variables,
    ),
    process: processContent(seoBodyContent?.process_spintax || DEFAULT_SEO_BODY.process_spintax, domain, variables),
  }

  const normalizeForCompare = (value: string) =>
    String(value ?? '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

  if (normalizeForCompare(seoData.whyChoose) === normalizeForCompare(seoData.process)) {
    seoData.processTitle = processContent(DEFAULT_SEO_BODY.process_title_spintax, domain, variables)
    seoData.process = processContent(DEFAULT_SEO_BODY.process_spintax, domain, variables)
  }

  const baseFaqItems = parseFAQItems(faqContent?.items ?? DEFAULT_FAQ.items)

  const mergedFaqItems = [...baseFaqItems]
  if (mergedFaqItems.length < 5) {
    mergedFaqItems.push(...DEFAULT_FAQ.items.slice(mergedFaqItems.length, 5))
  }

  const faqItems = mergedFaqItems.map((item) => ({
    question: processContent(item.question_spintax, domain, variables),
    answer: processContent(item.answer_spintax, domain, variables),
  }))

  const faqData = {
    heading: processContent(faqContent?.heading_spintax || DEFAULT_FAQ.heading_spintax, domain, variables),
    items: faqItems,
  }

  const testimonialItems = parseTestimonialItems(testimonialsContent?.items ?? DEFAULT_TESTIMONIALS.items).map((item) => ({
    name: item.name,
    location: processContent(item.location_spintax, domain, variables),
    text: processContent(item.text_spintax, domain, variables),
    rating: item.rating,
  }))

  const testimonialsData = {
    heading: processContent(
      testimonialsContent?.heading_spintax || DEFAULT_TESTIMONIALS.heading_spintax,
      domain,
      variables,
    ),
    subheading: processContent(
      testimonialsContent?.subheading_spintax || DEFAULT_TESTIMONIALS.subheading_spintax,
      domain,
      variables,
    ),
    items: testimonialItems,
  }

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
        seoContent={seoData}
      />
      <FAQ content={faqData} />
      <Testimonials content={testimonialsData} />
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
