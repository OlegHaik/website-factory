import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { DEFAULT_SERVICES } from '@/lib/water-damage'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraFooter } from '@/components/aurora-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for our restoration services website.',
}

export default async function TermsOfUsePage() {
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
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Use</h1>
            <p className="mt-2 text-sm text-slate-600">
              These Terms of Use govern your access to and use of this website operated by {site.business_name}.
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Acceptance of terms</h2>
                <p className="mt-2">
                  By accessing or using this website, you agree to these Terms. If you do not agree, do not use the
                  website.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Service description</h2>
                <p className="mt-2">
                  This website provides information about restoration services and ways to contact us. Any estimates or
                  service details are provided for informational purposes and may change based on an on-site assessment.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">User responsibilities</h2>
                <p className="mt-2">
                  You agree not to misuse the website, attempt unauthorized access, or interfere with its operation. You
                  are responsible for ensuring the information you provide to us is accurate.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Limitation of liability</h2>
                <p className="mt-2">
                  To the maximum extent permitted by law, {site.business_name} is not liable for indirect, incidental,
                  special, or consequential damages arising out of your use of the website.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Contact information</h2>
                <p className="mt-2">
                  Questions about these Terms can be directed to {site.business_name}
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
