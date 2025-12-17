import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getServiceAreaIndexForCurrentDomain, getSiteByDomainAndSlug, resolveSiteContext } from "@/lib/sites"
import { DEFAULT_SERVICES } from "@/lib/water-damage"

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
  const title = areaSite.meta_title || `Service Area | ${businessName}`
  const description =
    areaSite.meta_description ||
    mainSite.meta_description ||
    '24/7 emergency water damage restoration. Fast response and professional technicians.'

  return { title, description }
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

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={areaSite.business_name}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
      />
      <ServiceAreaHero
        areaName={areaName}
        state={areaSite.state}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
      />
      <ServiceAreaContent areaName={areaName} state={areaSite.state} services={services} otherAreas={otherAreas} />
      <CTASection
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        businessName={areaSite.business_name}
        domain={areaSite.resolvedDomain}
      />
      <Footer
        businessName={areaSite.business_name}
        phone={areaSite.phone}
        phoneDisplay={areaSite.phoneDisplay || undefined}
        address={areaSite.address}
        serviceAreas={serviceAreas}
      />
      <FloatingCall phone={areaSite.phone} />
    </div>
  )
}
