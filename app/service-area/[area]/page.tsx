import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, getSiteByDomainAndSlug, resolveSiteContext } from "@/lib/sites"
import { processContent } from "@/lib/spintax"
import { generatePageMetadata } from "@/lib/generate-metadata"
import { getContentHeader, getContentServiceArea, getContentBlock, getContentFAQ, getContentTestimonials, getContentMeta, ContentBlock } from "@/lib/fetch-content"
import { DEFAULT_HEADER, DEFAULT_NAV, getDefaultServiceArea, getDefaultFaq, getDefaultTestimonials } from "@/lib/default-content"
import { parseSocialLinks } from "@/lib/types"
import { fetchCategoryServices } from "@/lib/services"

import { Header } from "@/components/header"
import { ServiceAreaHero } from "@/components/service-area-hero"
import { ServiceAreaContent } from "@/components/service-area-content"
import { CTASection } from "@/components/cta-section"
import { ServiceTrust } from "@/components/service-trust"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"
import { SchemaMarkup } from "@/components/schema-markup"

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>
}): Promise<Metadata> {
  const { area: areaSlug } = await params
  const { site: mainSite, domain } = await resolveSiteContext()

  // TEMP DEBUG: Log domain resolution
  console.log('[MetaDebug] service-area generateMetadata start:', { areaSlug, resolvedDomain: domain })

  if (!domain) {
    console.log('[MetaDebug] No domain resolved, returning 404')
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const areaSite = await getSiteByDomainAndSlug(domain, areaSlug)

  // TEMP DEBUG: Log fetched areaSite details
  console.log('[MetaDebug] areaSite lookup:', {
    domainUsed: domain,
    areaSlug,
    areaSite: areaSite ? {
      id: areaSite.id,
      domain_url: areaSite.domain_url,
      slug: areaSite.slug,
      category: areaSite.category,
      meta_title: areaSite.meta_title,
      meta_description: areaSite.meta_description,
    } : null,
  })

  if (!mainSite || !areaSite) {
    console.log('[MetaDebug] mainSite or areaSite missing, returning 404')
    return { title: 'Not Found', description: 'The requested page could not be found.' }
  }

  const businessName = areaSite.business_name || mainSite.business_name || 'Restoration Services'
  const resolvedDomain = areaSite.resolvedDomain || domain || "default"
  const category = areaSite.category || mainSite.category || 'water_damage'

  const variables = {
    city: areaSite.city || mainSite.city || "",
    state: areaSite.state || mainSite.state || "",
    business_name: businessName,
    phone: areaSite.phone || mainSite.phone || "",
  }

  // Try to get meta from content_meta table (category-based spintax)
  const contentMeta = await getContentMeta(category, 'service_area')

  // Process spintax if we have content meta
  const contentMetaTitle = contentMeta?.title
    ? processContent(contentMeta.title, `${resolvedDomain}:${areaSlug}:meta`, variables)
    : null
  const contentMetaDesc = contentMeta?.description
    ? processContent(contentMeta.description, `${resolvedDomain}:${areaSlug}:meta`, variables)
    : null

  // Generate fallback metadata
  const generatedMeta = await generatePageMetadata(
    "service_area",
    resolvedDomain,
    variables,
    areaSlug,
    category,
  )

  // Priority: 1) areaSite.meta_* (site-specific) 2) contentMeta (category spintax) 3) generatedMeta (fallback)
  const finalTitle = areaSite.meta_title ?? contentMetaTitle ?? generatedMeta.title
  const finalDescription = areaSite.meta_description ?? contentMetaDesc ?? generatedMeta.description

  // TEMP DEBUG: Log final metadata
  console.log('[MetaDebug] Final metadata:', {
    category,
    areaSiteMetaTitle: areaSite.meta_title,
    areaSiteMetaDesc: areaSite.meta_description,
    contentMetaTitle,
    contentMetaDesc,
    generatedTitle: generatedMeta.title,
    generatedDesc: generatedMeta.description,
    finalTitle,
    finalDescription,
  })

  return {
    ...generatedMeta,
    title: finalTitle,
    description: finalDescription,
  }
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ area: string }>
}) {

  // Helper to normalize path for filtering
  const normalizePath = (href: string) => {
    if (!href) return ""
    try {
      const base = "http://placeholder.com"
      const url = new URL(href, base)
      return url.pathname.replace(/\/+$/, "")
    } catch {
      return ""
    }
  }

  const { area: areaSlug } = await params
  const { site: mainSite, domain } = await resolveSiteContext()

  if (process.env.SITE_DEBUG === '1') {
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

  // Gracefully handle missing required fields
  if (!areaSite.business_name || !areaSite.phone || !areaSite.city || !areaSite.state) {
    console.error('Area site missing required fields:', {
      business_name: !!areaSite.business_name,
      phone: !!areaSite.phone,
      city: !!areaSite.city,
      state: !!areaSite.state
    })
    notFound()
  }
  const category = areaSite.category || mainSite.category || 'water_damage'

  // TEMP DEBUG: Category resolution
  console.log('[CategoryDebug] SERVICE-AREA PAGE:', {
    areaSlug,
    domain,
    mainSite: { id: mainSite.id, slug: mainSite.slug, category: mainSite.category },
    areaSite: { id: areaSite.id, slug: areaSite.slug, category: areaSite.category },
    finalCategory: category,
  })

  const areaName = areaSite.city
  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
  const otherAreas = areaIndex
    .filter((a) => a.slug !== areaSlug)
    .map((a) => ({ name: a.city, slug: a.slug }))

  const resolvedDomain = areaSite.resolvedDomain || domain || "default"
  const variables = {
    city: areaSite.city,
    state: areaSite.state,
    business_name: areaSite.business_name,
    phone: areaSite.phone,
    address: areaSite.address || "",
    email:
      areaSite.email ||
      `info@${String(areaSite.domain_url || resolvedDomain)
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .replace(/^www\./, "")}`,
  }

  const services = await fetchCategoryServices({ category, domain: resolvedDomain, variables })
  // Only filter leak-repair for water_damage (duplicate of burst-pipe-repair)
  const servicesForLists = category === "water_damage"
    ? services.filter(s => {
        const normPath = normalizePath(s.href)
        return normPath !== "/leak-repair" && s.slug !== "leak-repair"
      })
    : services

  const headerContent = await getContentHeader(category)
  const areaContent = await getContentServiceArea(category)

  const areaSeed = `${resolvedDomain}:${areaSlug}`

  const categoryDefaults = getDefaultServiceArea(category)

  const headline = processContent(areaContent?.headline_spintax || categoryDefaults.headline, areaSeed, variables)
  const paragraph1 = processContent(
    areaContent?.paragraph1_spintax || categoryDefaults.paragraph1,
    areaSeed,
    variables,
  )
  const paragraph2 = processContent(
    areaContent?.paragraph2_spintax || categoryDefaults.paragraph2,
    areaSeed,
    variables,
  )
  const paragraph3 = processContent(
    areaContent?.paragraph3_spintax || categoryDefaults.paragraph3,
    areaSeed,
    variables,
  )
  const paragraph4 = processContent(
    areaContent?.paragraph4_spintax || categoryDefaults.paragraph4,
    areaSeed,
    variables,
  )
  const whyCityHeadline = processContent(
    areaContent?.why_city_headline_spintax || categoryDefaults.why_city_headline,
    areaSeed,
    variables,
  )
  const whyCityParagraph = processContent(
    areaContent?.why_city_paragraph_spintax || categoryDefaults.why_city_paragraph,
    areaSeed,
    variables,
  )
  // Fetch services list heading from content_blocks
  const servicesListBlock = await getContentBlock(category, 'services')

  const servicesListHeadline = servicesListBlock?.heading_spintax
    ? processContent(servicesListBlock.heading_spintax, areaSeed, variables)
    : processContent(
      areaContent?.services_list_headline_spintax || categoryDefaults.services_list_headline,
      areaSeed,
      variables,
    )
  const whyChooseHeadline = processContent(
    areaContent?.why_choose_headline_spintax || categoryDefaults.why_choose_headline,
    areaSeed,
    variables,
  )
  const trustPoints = processContent(
    areaContent?.trust_points_spintax || categoryDefaults.trust_points,
    areaSeed,
    variables,
  )
  const ctaHeadline = processContent(
    areaContent?.midpage_cta_headline_spintax || categoryDefaults.midpage_cta_headline,
    areaSeed,
    variables,
  )
  const ctaDescription = processContent(
    areaContent?.midpage_cta_subtext_spintax || categoryDefaults.midpage_cta_subtext,
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

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, resolvedDomain, variables)

  // Footer address logic:
  // Case 1: Service area has NO unique address (empty OR same as main) → use ALL main site info
  // Case 2: Service area HAS its own UNIQUE street address → use ALL service area info
  const areaAddr = (areaSite.address || '').trim()
  const mainAddr = (mainSite.address || '').trim()
  const hasUniqueAddress = areaAddr.length > 0 && areaAddr !== mainAddr
  const footerAddress = hasUniqueAddress
    ? {
        // Case 2: Service area has unique address - use service area's full business info
        address: areaSite.address,
        city: areaSite.city,
        state: areaSite.state,
        zipCode: areaSite.zip_code,
        email: areaSite.email || mainSite.email,
        phone: areaSite.phone || mainSite.phone,
        phoneDisplay: areaSite.phoneDisplay || mainSite.phoneDisplay,
      }
    : {
        // Case 1: No unique address - use main site's full business info
        address: mainSite.address,
        city: mainSite.city,
        state: mainSite.state,
        zipCode: mainSite.zip_code,
        email: mainSite.email,
        phone: mainSite.phone,
        phoneDisplay: mainSite.phoneDisplay,
      }

  // Fetch FAQ content
  const faqContent = await getContentFAQ(category)
  const faqDefaults = getDefaultFaq(category)
  const baseFaqItems = faqContent && faqContent.length > 0 ? faqContent : []
  const mergedFaqItems = [...baseFaqItems]
  if (mergedFaqItems.length < 5) {
    const defaultsToAdd = faqDefaults.items.slice(mergedFaqItems.length, 5).map(item => ({
      question: item.question_spintax,
      answer: item.answer_spintax
    }))
    mergedFaqItems.push(...defaultsToAdd)
  }
  const faqItems = mergedFaqItems.map((item) => ({
    question: processContent(item.question, areaSeed, variables),
    answer: processContent(item.answer, areaSeed, variables),
  }))

  // Fetch testimonials content
  const testimonialsContent = await getContentTestimonials(category)
  const testimonialsDefaults = getDefaultTestimonials(category)
  const dbTestimonials = (testimonialsContent && testimonialsContent.length > 0 ? testimonialsContent : [])
    .map(item => ({
      name: item.name || '',
      text: item.text || '',
      location: item.location_spintax || '{{city}}, {{state}}',
      rating: item.rating || 5
    }))
  const defaultTestimonials = (testimonialsDefaults.items || [])
    .map(item => ({
      name: item.name || '',
      text: item.text_spintax || '',
      location: item.location_spintax || '{{city}}, {{state}}',
      rating: 5
    }))
  const combinedTestimonials = dbTestimonials.length >= 3 ? dbTestimonials : [...dbTestimonials, ...defaultTestimonials]
  const testimonialItems = combinedTestimonials.slice(0, 3).map((item) => ({
    name: processContent(item.name, areaSeed, variables),
    text: processContent(item.text, areaSeed, variables),
    location: processContent(item.location, areaSeed, variables),
    rating: item.rating,
  }))

  // Prepare FAQ data for component
  const faqData = {
    heading: processContent(faqDefaults.heading_spintax, areaSeed, variables),
    items: faqItems,
  }

  // Prepare Testimonials data for component
  const testimonialsData = {
    heading: processContent(testimonialsDefaults.heading_spintax, areaSeed, variables),
    subheading: processContent(testimonialsDefaults.subheading_spintax, areaSeed, variables),
    items: testimonialItems,
  }

  const breadcrumbs = [
    { name: "Home", url: `https://${resolvedDomain}` },
    { name: areaName || "Service Area", url: `https://${resolvedDomain}/service-area/${areaSlug}` },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SchemaMarkup
        site={areaSite}
        domain={resolvedDomain}
        faq={faqItems}
        reviews={testimonialItems}
        services={servicesForLists.map((s) => s.title)}
        headline={headline}
        description={paragraph1}
        pageType="service-area"
        areaServedOverride={`${areaName}, ${areaSite.state}`.trim()}
        breadcrumbs={breadcrumbs}
        parentOrgName={mainSite.business_name || undefined}
        parentOrgUrl={`https://${resolvedDomain}`}
      />
      <Header
        businessName={areaSite.business_name}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={resolvedDomain}
        navLabels={navLabels}
        servicesLinks={servicesForLists.map((svc) => ({ href: svc.href, label: svc.title }))}
      />
      <ServiceAreaHero
        title={headline}
        description={paragraph1}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
      />
      <ServiceAreaContent
        areaName={areaName}
        state={areaSite.state}
        services={servicesForLists.map((svc) => ({ label: svc.title, href: svc.href }))}
        otherAreas={otherAreas}
        category={category}
        content={{
          introTitle: headline,
          paragraphs: [paragraph2, paragraph3, paragraph4].filter(Boolean),
          whyCity: { headline: whyCityHeadline, paragraph: whyCityParagraph },
          servicesListHeadline,
        }}
      />

      <ServiceTrust headline={whyChooseHeadline} trustPoints={trustPoints} />

      <FAQ content={faqData} />
      <Testimonials content={testimonialsData} />

      <CTASection
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
        headline={ctaHeadline}
        subheadline={ctaDescription}
        email={areaSite.email || mainSite.email || undefined}
      />
      <Footer
        businessName={areaSite.business_name}
        siteId={areaSite.id}
        domain={areaSite.resolvedDomain}
        phone={footerAddress.phone || areaSite.phone}
        phoneDisplay={footerAddress.phoneDisplay || undefined}
        address={footerAddress.address}
        city={footerAddress.city}
        state={footerAddress.state}
        zipCode={footerAddress.zipCode}
        email={footerAddress.email}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
        ourLinksLabel={ourLinksLabel}
        servicesLinks={servicesForLists.map((svc) => ({ href: svc.href, label: svc.title }))}
        category={category}
      />
      <FloatingCall phone={footerAddress.phone || areaSite.phone} />
    </div>
  )
}
