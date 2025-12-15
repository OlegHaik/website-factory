import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import {
  DEFAULT_SERVICES,
  DEFAULT_WHY_CHOOSE,
  HOME_HERO_DESCRIPTION,
  HOME_HERO_TITLE,
  buildSpinVars,
} from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraHero } from '@/components/aurora-hero'
import { AuroraServicesGrid } from '@/components/aurora-services-grid'
import { ContentSection } from '@/components/content-section'
import { FaqSection } from '@/components/faq-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'
import { AuroraFooter } from '@/components/aurora-footer'
import { formatPhoneDashed } from '@/lib/format-phone'
import { MessageSquare, Phone } from 'lucide-react'

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

  const slugKey = site.slug || 'home'
  const vars = buildSpinVars(site)
  const heroTitle = renderSpintextStable(HOME_HERO_TITLE, vars, `${slugKey}:home:title`)
  const heroDesc = renderSpintextStable(HOME_HERO_DESCRIPTION, vars, `${slugKey}:home:desc`)

  const nav = [
    { label: 'Home', href: `/` },
    { label: 'Services', href: `/#services` },
    { label: 'Service Areas', href: `/#areas` },
    { label: 'Contact', href: `/#contact` },
  ]

  const phone = site.phone
  const phoneDisplay = site.phoneDisplay || formatPhoneDashed(site.phone)

  const safeName = (site.business_name || '').replace(/&/g, 'and')
  const smsMessage = `Hello, I am visiting ${safeName} at ${site.resolvedDomain || 'our website'}. I am looking for a free estimate.`
  const smsHref = `sms:+19492675767?body=${encodeURIComponent(smsMessage)}`

  const servicesForHome = DEFAULT_SERVICES.map((s) => ({
    key: s.key,
    title: s.title,
    description: s.shortDescription,
    href: `/${s.slug}`,
    icon: s.icon,
  }))

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const areaLinks = areaIndex.map((a) => ({
    label: a.city,
    href: `/service-area/${a.slug}`,
  }))

  const serviceAreasDropdown = areaLinks

  const footerServices = servicesDropdown
  const footerServiceAreas = areaLinks

  const footerContact = {
    address: site.address,
    phone: site.phoneDisplay || formatPhoneDashed(site.phone),
  }

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader
        businessName={site.business_name || 'Restoration'}
        nav={nav}
        phone={phoneDisplay}
        services={servicesDropdown}
        serviceAreas={serviceAreasDropdown}
      />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{ href: `tel:${phone.replace(/\D/g, '')}`, label: phoneDisplay || 'Call Now' }}
        secondaryCta={{ href: smsHref, label: 'Chat With Us' }}
      />

      <div id="services">
        <AuroraServicesGrid items={servicesForHome} />
      </div>

      <ContentSection
        city={site.city}
        state={site.state}
        businessName={site.business_name}
        serviceAreas={areaIndex.map((a) => ({ slug: a.slug, city: a.city }))}
      />

      <FaqSection />

      <TestimonialsSection businessName={site.business_name} city={site.city} />

      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Restore Your Property?</h2>
            <p className="text-gray-600 mb-8">Our {site.city} team is on standby 24/7. Don't let the damage get worse.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Phone className="w-5 h-5" />
                {phoneDisplay}
              </a>
              <a
                href={smsHref}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                <MessageSquare className="w-5 h-5" />
                Chat With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <AuroraFloatingCall phone={phone} />
      <AuroraFooter
        businessName={site.business_name}
        services={footerServices}
        serviceAreas={footerServiceAreas}
        contact={footerContact}
      />
    </div>
  )
}
