import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteBySlug } from '@/lib/sites'
import { renderSpintextStable } from '@/lib/spintext'
import { DEFAULT_SERVICES, HOME_HERO_DESCRIPTION, HOME_HERO_TITLE, buildSpinVars } from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraHero } from '@/components/aurora-hero'
import { AuroraServicesGrid } from '@/components/aurora-services-grid'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const site = await getSiteBySlug(slug)

  if (!site) {
    return {
      title: 'Site Not Found',
      description: 'The requested site could not be found.',
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

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const site = await getSiteBySlug(slug)
  if (!site) notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')
  if (!site.city) throw new Error('Site is missing required field: city')
  if (!site.state) throw new Error('Site is missing required field: state')

  const vars = buildSpinVars(site)
  const heroTitle = renderSpintextStable(HOME_HERO_TITLE, vars, `${slug}:home:title`)
  const heroDesc = renderSpintextStable(HOME_HERO_DESCRIPTION, vars, `${slug}:home:desc`)

  const nav = [
    { label: 'Home', href: `/${slug}` },
    { label: 'Services', href: `/${slug}#services` },
    { label: 'Contact', href: `/${slug}#contact` },
  ]

  const phone = site.phone

  const servicesForHome = DEFAULT_SERVICES.map((s) => ({
    key: s.key,
    title: s.title,
    description: s.shortDescription,
    href: `/${slug}/services/${s.slug}`,
    icon: s.icon,
  }))

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader businessName={site.business_name} nav={nav} phone={phone} />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{ href: `tel:${phone.replace(/\D/g, '')}`, label: vars.phone ? `Call ${vars.phone}` : 'Call Now' }}
        secondaryCta={{ href: '#contact', label: 'Chat With Us' }}
      />

      <div id="services">
        <AuroraServicesGrid items={servicesForHome} />
      </div>

      <div id="contact" className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">Get Help Now</h2>
            <p className="mt-2 text-sm text-slate-600">
              24/7 emergency response. Fast arrival. Certified technicians.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                className="inline-flex items-center justify-center rounded-md bg-[color:var(--aurora-accent,var(--brand))] px-6 py-3 text-sm font-bold text-white hover:bg-[color:var(--aurora-accent-hover,var(--brand-dark))]"
                href={`tel:${phone.replace(/\D/g, '')}`}
              >
                Call {vars.phone || 'Now'}
              </a>
            </div>
          </div>
        </div>
      </div>

      <AuroraFloatingCall phone={phone} />
    </div>
  )
}
