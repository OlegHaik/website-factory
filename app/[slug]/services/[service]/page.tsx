import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteBySlug } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import type { SpintextVariables } from '@/lib/spintext'
import {
  DEFAULT_SERVICES,
  SERVICE_HERO_DESCRIPTION,
  SERVICE_HERO_TITLE,
  buildSpinVars,
  getServiceBySlug,
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
  params: Promise<{ slug: string; service: string }>
}): Promise<Metadata> {
  const { slug, service: serviceSlug } = await params
  const site = await getSiteBySlug(slug)
  if (!site) {
    return {
      title: 'Site Not Found',
      description: 'The requested site could not be found.',
    }
  }

  const service = getServiceBySlug(serviceSlug)
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    }
  }

  const businessName = site.business_name || 'Restoration Services'
  const title = site.meta_title
    ? `${service.title} | ${businessName}`
    : `${service.title} | ${businessName}`

  return {
    title,
    description: site.meta_description || service.shortDescription,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; service: string }>
}) {
  const { slug, service: serviceSlug } = await params

  const site = await getSiteBySlug(slug)
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const service = getServiceBySlug(serviceSlug)
  if (!service) notFound()

  const vars: SpintextVariables = { ...buildSpinVars(site), service_title: service.title }
  const heroTitle = renderSpintextStable(SERVICE_HERO_TITLE, vars, `${slug}:service:${serviceSlug}:title`)
  const heroDesc = renderSpintextStable(SERVICE_HERO_DESCRIPTION, vars, `${slug}:service:${serviceSlug}:desc`)

  const nav = [
    { label: 'Home', href: `/${slug}` },
    { label: 'Services', href: `/${slug}#services` },
    { label: 'Service Areas', href: `/${slug}#areas` },
    { label: 'Contact', href: `/${slug}#contact` },
  ]

  const phone = site.phone
  const phoneLabel = site.phoneDisplay || String(vars.phone || '')

  const areas = site.serviceAreas
  const sidebarAreas = areas.slice(0, 8).map((a) => ({
    label: a.name,
    href: `/${slug}/areas/${a.slug}`,
  }))

  const relatedServices = DEFAULT_SERVICES.filter((s) => s.slug !== service.slug).slice(0, 6)
  const sidebarServices = relatedServices.map((s) => ({
    label: s.title,
    href: `/${slug}/services/${s.slug}`,
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
              title="24/7 Emergency Response"
              blurb="Water damage spreads fast. Call now for rapid dispatch and professional restoration."
              phone={phone}
            />
            <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
            <AuroraLinksCard title="Top Service Areas" links={sidebarAreas} />
            <AuroraLinksCard title="Other Services" links={sidebarServices} />
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{service.title}</h2>
            <p className="mt-2 text-slate-600">{service.shortDescription}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-extrabold text-slate-900">What’s Included</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Rapid on-site assessment and damage documentation</li>
              <li>Professional-grade equipment and proven processes</li>
              <li>Clear communication and project updates</li>
              <li>Support for insurance workflows when applicable</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Serving {site.city || 'your area'}</h3>
            <p className="mt-2 text-sm text-slate-600">
              We provide {service.title.toLowerCase()} for homes and businesses in {site.city || 'the local area'}
              {site.state ? `, ${site.state}` : ''}.
            </p>
          </div>
        </div>
      </AuroraContentLayout>

      <AuroraFloatingCall phone={phone} />
    </div>
  )
}
