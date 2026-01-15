import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { processContent } from "@/lib/spintax"
import { generatePageMetadata } from "@/lib/generate-metadata"
import { parseSocialLinks } from "@/lib/types"
import {
  getContentCTA,
  getContentFAQ,
  getContentHeader,
  getContentHero,
  getContentTestimonials,
  getContentServices,
  getContentHomeArticle,
  ContentBlock,
  getContentBlocks,
  getContentSeoBody,
  type ContentFAQItem,
} from "@/lib/fetch-content"
import {
  DEFAULT_HEADER,
  DEFAULT_NAV,
  getDefaultCta,
  getDefaultFaq,
  getDefaultHero,
  getDefaultTestimonials,
} from "@/lib/default-content"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"
import { SchemaMarkup } from "@/components/schema-markup"
import { SeoArticle } from "@/components/seo-article"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) {
    return {
      title: 'Restoration Services',
      description: 'Professional water damage restoration services.',
    }
  }

  const domain = site.resolvedDomain || requestDomain || "default"
  const category = site.category || 'water_damage'
  return generatePageMetadata(
    "homepage",
    domain,
    {
      city: site.city || "",
      state: site.state || "",
      business_name: site.business_name || "Restoration Services",
      phone: site.phone || "",
    },
    "",
    category,
  )
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

  // TEMP DEBUG: Category resolution
  console.log('[CategoryDebug] HOMEPAGE:', {
    domain: site.resolvedDomain || requestDomain,
    mainSite: { id: site.id, slug: site.slug, category: site.category },
    finalCategory: category,
  })

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas =
    areaIndex.length > 0
      ? areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
      : (site.serviceAreas ?? [])

  const domain = site.resolvedDomain || site.domain_url || requestDomain || "default"

  const variables = {
    city: site.city,
    state: site.state,
    business_name: site.business_name,
    phone: site.phone,
  }

  const headerContent = await getContentHeader(category)
  const heroContent = await getContentHero(category)
  const ctaContent = await getContentCTA(category)
  const faqContent = await getContentFAQ(category)
  const testimonialsContent = await getContentTestimonials(category)
  const servicesContent = await getContentServices(category)
  const homeArticleElements = await getContentHomeArticle(category)

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, domain, variables),
  }

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)

  const heroDefaults = getDefaultHero(category)
  const heroTitle = processContent(heroContent?.headline_spintax || heroDefaults.headline_spintax, domain, variables)
  const heroDesc = processContent(
    heroContent?.subheadline_spintax || heroDefaults.subheadline_spintax,
    domain,
    variables,
  )
  const chatButtonText = processContent(
    heroContent?.chat_button_spintax || heroDefaults.chat_button_spintax,
    domain,
    variables,
  )

  // Transform services from new structure
  // Only filter leak-repair for water_damage (duplicate of burst-pipe-repair)
  const servicesForLists = servicesContent.map(s => ({
    title: processContent(s.nameSpin || s.name, domain, variables),
    description: processContent(s.description, domain, variables),
    href: `/${s.slug}`,
    slug: s.slug,
  })).filter(s => category !== "water_damage" || s.slug !== "leak-repair")
  const servicesForSchema = servicesForLists.map((svc) => svc.title).filter(Boolean)

  const ctaDefaults = getDefaultCta(category)
  const ctaHeadline = processContent(ctaContent?.headline_spintax || ctaDefaults.headline_spintax, domain, variables)
  const ctaSubheadline = processContent(
    ctaContent?.subheadline_spintax || ctaDefaults.subheadline_spintax,
    domain,
    variables,
  )
  const ctaChatButtonText = processContent(
    ctaContent?.chat_button_spintax || ctaDefaults.chat_button_spintax,
    domain,
    variables,
  )

  const faqDefaults = getDefaultFaq(category)
  // faqContent - array of ContentFAQItem {question, answer}
  // faqDefaults.items - array of {question_spintax, answer_spintax}
  const baseFaqItems = faqContent && faqContent.length > 0 ? faqContent : []

  const mergedFaqItems = [...baseFaqItems]
  // Fill with defaults if needed
  if (mergedFaqItems.length < 5) {
    const defaultsToAdd = faqDefaults.items.slice(mergedFaqItems.length, 5).map(item => ({
      question: item.question_spintax,
      answer: item.answer_spintax
    }))
    mergedFaqItems.push(...defaultsToAdd)
  }

  const faqItems = mergedFaqItems.map((item) => ({
    question: processContent(item.question, domain, variables),
    answer: processContent(item.answer, domain, variables),
  }))

  const faqData = {
    heading: processContent(faqDefaults.heading_spintax, domain, variables),
    items: faqItems,
  }

  const testimonialsDefaults = getDefaultTestimonials(category)

  // Нормалізуємо дані з БД та дефолтів до єдиної структури
  const dbItems = (testimonialsContent && testimonialsContent.length > 0 ? testimonialsContent : [])
    .map(item => ({
      name: item.name || '',
      text: item.text || '',
      location: item.location_spintax || '{{city}}, {{state}}',
      rating: item.rating || 5
    }))

  const defaultItems = (testimonialsDefaults.items || [])
    .map(item => ({
      name: item.name || '',
      text: item.text_spintax || '',
      location: item.location_spintax || '{{city}}, {{state}}',
      rating: 5
    }))

  // Використовуємо БД дані, доповнюємо дефолтами якщо потрібно
  const combinedItems = dbItems.length >= 3 ? dbItems : [...dbItems, ...defaultItems]

  const testimonialItems = combinedItems.slice(0, 3).map((item) => ({
    name: processContent(item.name, domain, variables),
    location: processContent(item.location, domain, variables),
    text: processContent(item.text, domain, variables),
    rating: item.rating,
  }))

  const testimonialsData = {
    heading: processContent(testimonialsDefaults.heading_spintax, domain, variables),
    subheading: processContent(testimonialsDefaults.subheading_spintax, domain, variables),
    items: testimonialItems,
  }

  const socialLinks = parseSocialLinks(site)

  return (
    <div className="min-h-screen bg-white">
      <SchemaMarkup
        site={site}
        domain={domain}
        faq={faqItems}
        reviews={testimonialItems}
        services={servicesForSchema}
        headline={heroTitle}
        description={heroDesc}
      />
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={domain}
        navLabels={navLabels}
        servicesLinks={servicesForLists.map((svc) => ({ href: svc.href, label: svc.title }))}
      />

      <Hero
        title={heroTitle}
        description={heroDesc}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
        chatButtonText={chatButtonText}
        email={site.email || undefined}
      />

      <Services services={servicesForLists} />
      <SeoArticle elements={homeArticleElements} domain={domain} variables={variables} />
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
        email={site.email || undefined}
      />

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
        servicesLinks={servicesForLists.map((svc) => ({ href: svc.href, label: svc.title }))}
        category={category}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
