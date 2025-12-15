import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { DEFAULT_SERVICES } from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraFooter } from '@/components/aurora-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for our restoration services website.',
}

export default async function PrivacyPolicyPage() {
  const { site } = await resolveSiteContext()
  if (!site) notFound()
  if (!site.business_name) throw new Error('Site is missing required field: business_name')

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const servicesDropdown = DEFAULT_SERVICES.map((s) => ({
    label: s.title,
    href: `/${s.slug}`,
  }))

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const areaLinks = areaIndex.map((a) => ({
    label: a.city,
    href: `/service-area/${a.slug}`,
  }))

  const preferredFooterCities = ['Jersey City', 'Hoboken', 'North Bergen', 'West New York', 'Edgewater']
  const preferredFooterAreas = preferredFooterCities
    .map((name) => areaLinks.find((a) => a.label.toLowerCase() === name.toLowerCase()))
    .filter((x): x is { label: string; href: string } => Boolean(x))
  const remainingFooterAreas = areaLinks.filter((a) => !preferredFooterAreas.some((p) => p.href === a.href))
  const footerServiceAreas = [...preferredFooterAreas, ...remainingFooterAreas].slice(0, 5)
  const footerFallbackAreas = [
    { label: 'Jersey City', href: '/service-area/jersey-city' },
    { label: 'Hoboken', href: '/service-area/hoboken' },
    { label: 'North Bergen', href: '/service-area/north-bergen' },
    { label: 'West New York', href: '/service-area/west-new-york' },
    { label: 'Edgewater', href: '/service-area/edgewater' },
  ]

  const phoneDisplay = site.phoneDisplay || site.phone || ''
  const phoneDigits = (site.phone || '').replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader
        businessName={site.business_name}
        nav={nav}
        phone={site.phone || ''}
        services={servicesDropdown}
        serviceAreas={areaLinks}
      />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-slate-600">
              This Privacy Policy describes how {site.business_name} collects and uses information when you visit this
              website or contact us.
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Information collection</h2>
                <p className="mt-2">
                  We may collect information you provide when you call, text, email, or otherwise contact us (for
                  example: your name, phone number, address, and details about your restoration needs). We may also
                  collect basic usage information when you browse the site.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Use of information</h2>
                <p className="mt-2">
                  We use information to respond to requests, schedule service, provide estimates, improve our customer
                  support, and operate and maintain this website.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Data protection</h2>
                <p className="mt-2">
                  We use reasonable administrative, technical, and physical safeguards to help protect information.
                  However, no method of transmission or storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Cookies</h2>
                <p className="mt-2">
                  This site may use cookies or similar technologies to improve functionality and understand how the
                  site is used. You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Third-party services</h2>
                <p className="mt-2">
                  We may use third-party providers for hosting, analytics, and performance monitoring. These providers
                  may process limited information as needed to deliver their services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Contact information</h2>
                <p className="mt-2">
                  If you have questions about this Privacy Policy, contact {site.business_name}
                  {phoneDigits ? (
                    <>
                      {' '}at{' '}
                      <a className="font-semibold text-red-700 hover:text-red-800" href={`tel:${phoneDigits}`}>
                        {phoneDisplay}
                      </a>
                      .
                    </>
                  ) : (
                    '.'
                  )}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <AuroraFooter
        businessName={site.business_name}
        city={site.city}
        state={site.state}
        serviceAreas={footerServiceAreas.length > 0 ? footerServiceAreas : footerFallbackAreas}
        socialLinks={site.socialLinks}
      />
    </div>
  )
}
