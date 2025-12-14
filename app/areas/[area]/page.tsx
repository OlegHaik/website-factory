import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { resolveSiteContext } from '@/lib/sites'
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
import { AuroraEmergencyCard, AuroraLinksCard, AuroraWhyChooseCard } from '@/components/aurora-sidebar'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'
import { AuroraFooter } from '@/components/aurora-footer'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>
}): Promise<Metadata> {
  const { area: areaSlug } = await params
  const { site } = await resolveSiteContext()

  if (!site) {
    return { title: 'Site Not Found', description: 'The requested site could not be found.' }
  }

  const area = site.serviceAreas.find((a) => a.slug === areaSlug)
  const businessName = site.business_name || 'Restoration Services'

  return {
    title: `${area?.name || 'Service Area'} | ${businessName}`,
    description:
      site.meta_description ||
      (area?.name
        ? `Water damage restoration and cleanup services in ${area.name}. Fast response and professional technicians.`
        : 'Water damage restoration and cleanup services. Fast response and professional technicians.'),
  }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>
}) {
  const { area: areaSlug } = await params
  const { site } = await resolveSiteContext()
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const area = site.serviceAreas.find((a) => a.slug === areaSlug)
  if (!area) notFound()

  const vars: SpintextVariables = { ...buildSpinVars(site), area_title: area.name }
  const heroTitle = renderSpintextStable(AREA_HERO_TITLE, vars, `${site.slug}:area:${areaSlug}:title`)
  const heroDesc = renderSpintextStable(AREA_HERO_DESCRIPTION, vars, `${site.slug}:area:${areaSlug}:desc`)

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const phone = site.phone
  const phoneLabel = site.phoneDisplay || String(vars.phone || '')

  const sidebarServices = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }))

  const sidebarAreas = site.serviceAreas
    .filter((a) => a.slug !== area.slug)
    .map((a) => ({ label: a.name, href: `/areas/${a.slug}` }))

  const socialLinks = site.socialLinks

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader businessName={site.business_name} nav={nav} phone={phone} />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{ href: `tel:${phone.replace(/\D/g, '')}`, label: phoneLabel ? `Call ${phoneLabel}` : 'Call Now' }}
        secondaryCta={{ href: '/#contact', label: 'Get a Quote' }}
      />

      <AuroraContentLayout
        sidebar={
          <>
            <AuroraEmergencyCard
              title="Emergency Help"
              blurb={`Call now for immediate response in ${area.name}.`}
              phone={phone}
            />
            <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
            <AuroraLinksCard title="Popular Services" links={sidebarServices} />
            {sidebarAreas.length > 0 && <AuroraLinksCard title="Other Service Areas" links={sidebarAreas} />}
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Water Damage Restoration in {area.name}</h2>
            <p className="mt-2 text-slate-600">
              Trusted local help for cleanup, drying, and repairs in {area.name}.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-extrabold text-slate-900">How We Help</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Emergency response in {area.name} and surrounding areas</li>
              <li>Water extraction and structural drying</li>
              <li>Mold prevention and odor control</li>
              <li>Documentation support for insurance claims</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Serving {site.city}</h3>
            <p className="mt-2 text-sm text-slate-600">
              We serve {area.name} and nearby communities across {site.city}, {site.state}.
            </p>
          </div>
        </div>
      </AuroraContentLayout>

      <AuroraFloatingCall phone={phone} />
      <AuroraFooter businessName={site.business_name} city={site.city} state={site.state} socialLinks={socialLinks} />
    </div>
  )
}
