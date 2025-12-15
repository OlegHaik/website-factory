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
import { AuroraContentLayout } from '@/components/aurora-content-layout'
import { AuroraEmergencyCard, AuroraLinksCard, AuroraWhyChooseCard } from '@/components/aurora-sidebar'
import { AuroraFloatingCall } from '@/components/aurora-floating-call'
import { AuroraFooter } from '@/components/aurora-footer'

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

  const smsNumber = '+19492675767'
  const smsMessage = `Hello, I am visiting ${site.business_name} at ${site.resolvedDomain || 'connorwaterfirerestoration.homes'}. I am looking for a free estimate.`
  const smsHref = `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`

  const servicesForHome = DEFAULT_SERVICES.map((s) => ({
    key: s.key,
    title: s.title,
    description: s.shortDescription,
    href: `/${s.slug}`,
    icon: s.icon,
  }))

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const areaLinks = areaIndex.map((a) => ({
    label: a.city,
    href: `/service-area/${a.slug}`,
  }))

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader businessName={site.business_name || 'Restoration'} nav={nav} phone={phone} />
      <AuroraHero
        title={heroTitle}
        description={heroDesc}
        primaryCta={{ href: `tel:${phone.replace(/\D/g, '')}`, label: vars.phone ? `Call ${vars.phone}` : 'Call Now' }}
        secondaryCta={{ href: smsHref, label: 'Chat With Us' }}
      />

      <div id="services">
        <AuroraServicesGrid items={servicesForHome} />
      </div>

      <div id="areas">
        {areaLinks.length > 0 && (
          <AuroraContentLayout
            sidebar={
              <>
                <AuroraEmergencyCard
                  title="Need Emergency Service?"
                  blurb="Our team responds within 60 minutes, 24/7."
                  phone={phone}
                />
                <AuroraWhyChooseCard items={DEFAULT_WHY_CHOOSE} />
                <AuroraLinksCard title="Service Areas" links={areaLinks} />
              </>
            }
          >
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">Areas We Serve</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                We provide 24/7 emergency restoration across {site.city}, {site.state} and nearby communities.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {areaLinks.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
                  >
                    {a.label}
                  </a>
                ))}
              </div>
            </div>
          </AuroraContentLayout>
        )}
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
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
                href={`tel:${phone.replace(/\D/g, '')}`}
              >
                Call {vars.phone || 'Now'}
              </a>
            </div>
          </div>
        </div>
      </div>

      <AuroraFloatingCall phone={phone} />
      <AuroraFooter businessName={site.business_name} city={site.city} state={site.state} socialLinks={site.socialLinks} />
    </div>
  )
}
