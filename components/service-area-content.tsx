import Link from "next/link"

interface LinkItem {
  label: string
  href: string
}

interface ServiceAreaContentProps {
  areaName: string
  state: string
  services: LinkItem[]
  otherAreas: Array<{ name: string; slug: string }>
  content?: {
    intro: { title: string; text: string }
    services: { title: string; intro: string }
    whyChoose: { title: string; text: string }
  }
}

export function ServiceAreaContent({ areaName, state, services, otherAreas, content }: ServiceAreaContentProps) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {content?.intro.title || `Water Damage Restoration in ${areaName}`}
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                {content?.intro.text || `Trusted local help for cleanup, drying, and repairs in ${areaName}, ${state}.`}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              {content ? (
                <>
                  <h3 className="text-xl font-bold text-slate-900">{content.whyChoose.title}</h3>
                  <p className="mt-4 text-slate-700 leading-relaxed">{content.whyChoose.text}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900">How We Help</h3>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    <li>Emergency response in {areaName} and surrounding areas</li>
                    <li>Water extraction and structural drying</li>
                    <li>Mold prevention and odor control</li>
                    <li>Documentation support for insurance claims</li>
                  </ul>
                </>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{content?.services.title || "Popular Services"}</h3>
              {content?.services.intro ? (
                <p className="mt-3 text-slate-600 leading-relaxed">{content.services.intro}</p>
              ) : null}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <Link key={s.href} href={s.href} className="rounded-xl border border-slate-200 px-4 py-3 text-slate-700 hover:border-slate-300 hover:text-red-600">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            {otherAreas.length > 0 && (
              <div className="rounded-2xl bg-slate-950 text-white p-8">
                <h3 className="text-xl font-bold mb-6">Other Service Areas</h3>
                <div className="space-y-3">
                  {otherAreas.map((area) => (
                    <Link key={area.slug} href={`/service-area/${area.slug}`} className="block text-slate-200 hover:text-white">
                      {area.name}
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
