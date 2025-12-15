import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import { DEFAULT_SERVICES, getServiceBySlug } from "@/lib/water-damage"

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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service: serviceSlug } = await params
  const { site } = await resolveSiteContext()
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const service = getServiceBySlug(serviceSlug)
  if (!service) notFound()

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))
  const otherServices = DEFAULT_SERVICES.filter((s) => s.slug !== service.slug).map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
      />
      <ServiceHero
        serviceTitle={service.title}
        city={site.city}
        state={site.state}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
      />
      <ServiceContent
        serviceTitle={service.title}
        serviceDescription={service.shortDescription}
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
