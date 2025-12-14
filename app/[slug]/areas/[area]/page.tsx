import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteBySlug } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import type { SpintextVariables } from '@/lib/spintext'
import {
  AREA_HERO_DESCRIPTION,
  AREA_HERO_TITLE,
  DEFAULT_SERVICES,
  buildSpinVars,
  titleFromAreaSlug,
  DEFAULT_WHY_CHOOSE,
} from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraHero } from '@/components/aurora-hero'
import { AuroraContentLayout } from '@/components/aurora-content-layout'
import { AuroraEmergencyCard, AuroraLinksCard, AuroraWhyChooseCard } from '@/components/aurora-sidebar'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; area: string }>
}): Promise<Metadata> {
  const { slug, area: areaSlug } = await params
  const site = await getSiteBySlug(slug)

  if (!site) {
    return {
      title: 'Site Not Found',
      description: 'The requested site could not be found.',
    }
  }

  const areaTitle = site.serviceAreas.find((a) => a.slug === areaSlug)?.name || titleFromAreaSlug(areaSlug)
  const businessName = site.business_name || 'Restoration Services'

  return {
    title: `${areaTitle} Service Area | ${businessName}`,
    description:
      site.meta_description ||
      `Water damage restoration and cleanup services in ${areaTitle}. Fast response and professional technicians.`,
  }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string; area: string }>
}) {
  const { slug, area: areaSlug } = await params

  const site = await getSiteBySlug(slug)
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const areaTitle = site.serviceAreas.find((a) => a.slug === areaSlug)?.name || titleFromAreaSlug(areaSlug)
  const vars: SpintextVariables = { ...buildSpinVars(site), area_title: areaTitle }

  const heroTitle = renderSpintextStable(AREA_HERO_TITLE, vars, `${slug}:area:${areaSlug}:title`)
  const heroDesc = renderSpintextStable(AREA_HERO_DESCRIPTION, vars, `${slug}:area:${areaSlug}:desc`)

  const nav = [
    { label: 'Home', href: `/${slug}` },
    { label: 'Services', href: `/${slug}#services` },
    { label: 'Service Areas', href: `/${slug}#areas` },
    { label: 'Contact', href: `/${slug}#contact` },
  ]

  const phone = site.phone
  const phoneLabel = site.phoneDisplay || String(vars.phone || '')

  const sidebarServices = DEFAULT_SERVICES.slice(0, 8).map((s) => ({
    label: s.title,
    href: `/${slug}/services/${s.slug}`,
  }))

  const otherAreas = site.serviceAreas.filter((a) => a.slug !== areaSlug).slice(0, 8)
  const sidebarAreas = otherAreas.map((a) => ({
    label: a.name,
    href: `/${slug}/areas/${a.slug}`,
  }))

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader businessName={site.business_name} nav={nav} phone={phone} />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{
          href: `tel:${phone.replace(/\D/g, '')}`,
          label: phoneLabel ? `Call ${phoneLabel}` : 'Call Now',
        }}
        secondaryCta={{ href: `/${slug}#contact`, label: 'Get a Quote' }}
      />

      <AuroraContentLayout
        sidebar={
          <>
            <AuroraEmergencyCard
              title="Emergency Help"
              blurb={`Call now for immediate response in ${areaTitle}.`}
              phone={phone}
            />
            <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
            <AuroraLinksCard title="Popular Services" links={sidebarServices} />
            <AuroraLinksCard title="Other Service Areas" links={sidebarAreas} />
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Water Damage Restoration in {areaTitle}</h2>
            <p className="mt-2 text-slate-600">
              Trusted local help for cleanup, drying, and repairs in {areaTitle}.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-extrabold text-slate-900">How We Help</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Emergency response in {areaTitle} and surrounding areas</li>
              <li>Water extraction and structural drying</li>
              <li>Mold prevention and odor control</li>
              <li>Documentation support for insurance claims</li>
            </ul>
          </div>
        </div>
      </AuroraContentLayout>

      <AuroraFloatingCall phone={phone} />
    </div>
  )
}
