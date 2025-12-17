import Link from "next/link"

interface LinkItem {
  label: string
  href: string
}

interface ServiceContentProps {
  serviceTitle: string
  serviceDescription: string
  intro?: string
  sectionHeadline?: string
  sectionBody?: string
  city: string
  state: string
  serviceAreas: Array<{ name: string; slug: string }>
  otherServices: LinkItem[]
}

export function ServiceContent({ serviceTitle, serviceDescription, intro, sectionHeadline, sectionBody, city, state, serviceAreas, otherServices }: ServiceContentProps) {
  const introText = intro || serviceDescription
  const headlineText = sectionHeadline || serviceTitle
  const bodyText = sectionBody || introText

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{headlineText}</h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{bodyText}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">What’s Included</h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>Rapid on-site assessment and damage documentation</li>
                <li>Professional-grade equipment and proven processes</li>
                <li>Clear communication and project updates</li>
                <li>Support for insurance workflows when applicable</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Serving {city}</h3>
              <p className="mt-3 text-lg text-slate-600 leading-relaxed">
                We provide {serviceTitle.toLowerCase()} for homes and businesses in {city}, {state}.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            {serviceAreas.length > 0 && (
              <div className="rounded-2xl bg-slate-950 text-white p-8">
                <h3 className="text-xl font-bold mb-6">Service Areas</h3>
                <div className="space-y-3">
                  {serviceAreas.map((area) => (
                    <Link key={area.slug} href={`/service-area/${area.slug}`} className="block text-slate-200 hover:text-white">
                      {area.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherServices.length > 0 && (
              <div className="rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Other Services</h3>
                <div className="space-y-3">
                  {otherServices.map((s) => (
                    <Link key={s.href} href={s.href} className="block text-slate-700 hover:text-red-600">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Licensed & Insured</h3>
              <p className="text-slate-600 leading-relaxed">
                Certified technicians, professional equipment, and proven restoration processes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
