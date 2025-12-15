import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from '@/lib/sites'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { FloatingCall } from '@/components/floating-call'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for our restoration services website.',
}

export default async function TermsOfUsePage() {
  const { site } = await resolveSiteContext()
  if (!site) notFound()
  if (!site.business_name) throw new Error('Site is missing required field: business_name')
  if (!site.phone) throw new Error('Site is missing required field: phone')

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const phoneDisplay = site.phoneDisplay || site.phone || ''
  const phoneDigits = (site.phone || '').replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-white">
      <Header businessName={site.business_name} phone={site.phone} phoneDisplay={site.phoneDisplay || undefined} serviceAreas={serviceAreas} />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Use</h1>
            <p className="mt-2 text-sm text-slate-600">Last updated: December 2024</p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
              <p>By using this website, you agree to these terms.</p>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Services</h2>
                <p className="mt-2">We provide water damage, fire damage, and related restoration services.</p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Limitation of Liability</h2>
                <p className="mt-2">Our liability is limited to the services we provide.</p>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-slate-900">Contact</h2>
                <p className="mt-2">
                  For questions, call us
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

      <Footer
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        address={site.address}
        serviceAreas={serviceAreas}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
