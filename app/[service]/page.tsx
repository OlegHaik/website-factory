import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import type { SpintextVariables } from '@/lib/spintext'
import {
  DEFAULT_SERVICES,
  DEFAULT_WHY_CHOOSE,
  SERVICE_HERO_DESCRIPTION,
  SERVICE_HERO_TITLE,
  buildSpinVars,
  getServiceBySlug,
} from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraHero } from '@/components/aurora-hero'
import { AuroraContentLayout } from '@/components/aurora-content-layout'
import { AuroraEmergencyCard, AuroraLicensedCard, AuroraLinksCard, AuroraWhyChooseCard } from '@/components/aurora-sidebar'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'
import { AuroraFooter } from '@/components/aurora-footer'
import { formatPhoneDashed } from '@/lib/format-phone'

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

  const seedPrefix = site.slug || 'home'
  const vars: SpintextVariables = { ...buildSpinVars(site), service_title: service.title }
  const heroTitle = renderSpintextStable(SERVICE_HERO_TITLE, vars, `${seedPrefix}:service:${serviceSlug}:title`)
  const heroDesc = renderSpintextStable(SERVICE_HERO_DESCRIPTION, vars, `${seedPrefix}:service:${serviceSlug}:desc`)

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const phone = site.phone
  const phoneLabel = site.phoneDisplay || String(vars.phone || '')
  const phoneDisplay = site.phoneDisplay || site.phone

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

    const safeName = (site.business_name || '').replace(/&/g, 'and')
    const smsMessage = `Hello, I am visiting ${safeName} at ${site.resolvedDomain || 'our website'}. I am looking for a free estimate.`
  const smsHref = `sms:+19492675767?body=${encodeURIComponent(smsMessage)}`

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const sidebarAreas = areaIndex.map((a) => ({
    label: a.city,
    href: `/service-area/${a.slug}`,
  }))

  const serviceAreasDropdown = sidebarAreas

  const footerQuickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const footerServices = servicesDropdown

  const footerContact = {
    address: site.address,
    phone: site.phoneDisplay || formatPhoneDashed(site.phone),
    email: site.email,
  }

  const sidebarServices = DEFAULT_SERVICES.filter((s) => s.slug !== service.slug).map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader
        businessName={site.business_name}
        nav={nav}
        phone={phoneDisplay}
        services={servicesDropdown}
        serviceAreas={serviceAreasDropdown}
      />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{ href: `tel:${phone.replace(/\D/g, '')}`, label: phoneLabel || 'Call Now' }}
        secondaryCta={{ href: smsHref, label: 'Chat With Us' }}
      />

      <AuroraContentLayout
        sidebar={
          <>
            <AuroraEmergencyCard
              title="24/7 Emergency Response"
              blurb="Water damage spreads fast. Call now for rapid dispatch and professional restoration."
              phone={phone}
            />
            <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
            {sidebarAreas.length > 0 && <AuroraLinksCard title="Service Areas" links={sidebarAreas} />}
            <AuroraLicensedCard />
            <AuroraLinksCard title="Other Services" links={sidebarServices} />
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{service.title}</h2>
            <p className="mt-2 text-base text-slate-600 md:text-lg">{service.shortDescription}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-900">What’s Included</h3>
            <ul className="mt-3 space-y-2 text-base text-slate-700">
              <li>Rapid on-site assessment and damage documentation</li>
              <li>Professional-grade equipment and proven processes</li>
              <li>Clear communication and project updates</li>
              <li>Support for insurance workflows when applicable</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">Serving {site.city}</h3>
            <p className="mt-2 text-base text-slate-600 md:text-lg">
              We provide {service.title.toLowerCase()} for homes and businesses in {site.city}, {site.state}.
            </p>
          </div>
        </div>
      </AuroraContentLayout>

      <AuroraFloatingCall phone={phone} />
      <AuroraFooter
        businessName={site.business_name}
        city={site.city}
        state={site.state}
        quickLinks={footerQuickLinks}
        services={footerServices}
        contact={footerContact}
        socialLinks={site.socialLinks}
      />
    </div>
  )
}
