import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, getSiteByDomainAndSlug, resolveSiteContext } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import type { SpintextVariables } from '@/lib/spintext'
import {
  AREA_HERO_DESCRIPTION,
  AREA_HERO_TITLE,
  DEFAULT_SERVICES,
  DEFAULT_WHY_CHOOSE,
  buildSpinVars,
} from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraHero } from '@/components/aurora-hero'
import { AuroraContentLayout } from '@/components/aurora-content-layout'
import { AuroraEmergencyCard, AuroraLicensedCard, AuroraLinksCard, AuroraWhyChooseCard } from '@/components/aurora-sidebar'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'
import { AuroraFooter } from '@/components/aurora-footer'
import { formatPhoneDashed } from '@/lib/format-phone'

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
  if (!mainSite || !domain) notFound()

  const areaSite = await getSiteByDomainAndSlug(domain, areaSlug)
  if (!areaSite) notFound()

  if (!areaSite.business_name) throw new Error('Site is missing required field: business_name')
  if (!areaSite.phone) throw new Error('Site is missing required field: phone')
  if (!areaSite.city) throw new Error('Site is missing required field: city')
  if (!areaSite.state) throw new Error('Site is missing required field: state')

  const areaName = areaSite.city

  const seedPrefix = (mainSite.slug || 'home').trim() || 'home'
  const vars: SpintextVariables = {
    ...buildSpinVars(areaSite),
    area_title: areaName,
    city1: areaName,
    city2: mainSite.city || '',
  }

  const heroTitle = renderSpintextStable(AREA_HERO_TITLE, vars, `${seedPrefix}:service-area:${areaSlug}:title`)
  const heroDesc = renderSpintextStable(AREA_HERO_DESCRIPTION, vars, `${seedPrefix}:service-area:${areaSlug}:desc`)

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const phone = areaSite.phone
  const phoneLabel = areaSite.phoneDisplay || String(vars.phone || '')
  const phoneDisplay = areaSite.phoneDisplay || areaSite.phone

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

    const safeName = (areaSite.business_name || '').replace(/&/g, 'and')
    const smsMessage = `Hello, I am visiting ${safeName} at ${areaSite.resolvedDomain || 'our website'}. I am looking for a free estimate.`
  const smsHref = `sms:+19492675767?body=${encodeURIComponent(smsMessage)}`

  const sidebarServices = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const sidebarAreas = areaIndex
    .filter((a) => a.slug !== areaSlug)
    .map((a) => ({ label: a.city, href: `/service-area/${a.slug}` }))

  const serviceAreasDropdown = [{ label: areaSite.city, href: `/service-area/${areaSlug}` }, ...sidebarAreas]

  const footerQuickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const footerServices = servicesDropdown

  const footerContact = {
    address: areaSite.address,
    phone: areaSite.phoneDisplay || formatPhoneDashed(areaSite.phone),
    email: areaSite.email,
  }

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader
        businessName={areaSite.business_name}
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
            <AuroraEmergencyCard title="Emergency Help" blurb={`Call now for immediate response in ${areaName}.`} phone={phone} />
            <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
            <AuroraLinksCard title="Popular Services" links={sidebarServices} />
            {sidebarAreas.length > 0 && <AuroraLinksCard title="Other Service Areas" links={sidebarAreas} />}
            <AuroraLicensedCard />
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Water Damage Restoration in {areaName}</h2>
            <p className="mt-2 text-slate-600">Trusted local help for cleanup, drying, and repairs in {areaName}.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-extrabold text-slate-900">How We Help</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Emergency response in {areaName} and surrounding areas</li>
              <li>Water extraction and structural drying</li>
              <li>Mold prevention and odor control</li>
              <li>Documentation support for insurance claims</li>
            </ul>
          </div>

          {mainSite.city && mainSite.state && (
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Serving Greater {mainSite.city}</h3>
              <p className="mt-2 text-sm text-slate-600">
                We serve {areaName} and nearby communities across {mainSite.city}, {mainSite.state}.
              </p>
            </div>
          )}
        </div>
      </AuroraContentLayout>

      <AuroraFloatingCall phone={phone} />
      <AuroraFooter
        businessName={areaSite.business_name}
        city={areaSite.city}
        state={areaSite.state}
        quickLinks={footerQuickLinks}
        services={footerServices}
        contact={footerContact}
        socialLinks={areaSite.socialLinks}
      />
    </div>
  )
}
