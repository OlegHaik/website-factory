import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"

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
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const heroTitle = `24/7 Emergency Restoration in ${site.city}, ${site.state}`
  const heroDesc =
    "Fast response, expert technicians, and complete property restoration. Direct insurance billing available."

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
      />
      <Hero
        title={heroTitle}
        description={heroDesc}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        businessName={site.business_name}
        domain={site.resolvedDomain}
      />

      <Services />
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
