import { ShieldCheck, MapPin } from "lucide-react"
import Link from "next/link"

interface ServiceArea {
  name: string
  slug: string
}

interface AboutProps {
  businessName: string
  city: string
  state: string
  serviceAreas: ServiceArea[]
}

export function About({ businessName, city, state, serviceAreas }: AboutProps) {
  return (
    <section id="about" className="py-24 lg:py-36 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
                Professional Water Damage Services in {city}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                When disaster strikes, every second counts. At {businessName}, we understand the urgency of water
                damage, fire incidents, and mold growth. Our team of certified professionals is dedicated to restoring
                your property to its pre-loss condition as quickly and efficiently as possible. Serving {city} and
                the surrounding areas, we are your local experts in emergency mitigation.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-5">Why Choose Our Restoration Team?</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Choosing the right restoration company can make the difference between a quick recovery and a long,
                drawn-out nightmare. We pride ourselves on transparency, speed, and quality craftsmanship. Unlike
                general contractors, we specialize specifically in disaster recovery. We utilize thermal imaging
                technology to detect hidden moisture that the naked eye cannot see, ensuring that no wet pockets are
                left behind to cause mold growth later. Our technicians are IICRC certified and undergo rigorous
                training to handle everything from burst frozen pipes to sewage backups.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-5">The Restoration Process</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our process begins with a thorough inspection. We document everything for your insurance claim to ensure
                you get the coverage you deserve. Next, we begin water extraction using truck-mounted pumps. Once
                standing water is gone, we install industrial air movers and dehumidifiers. Finally, we perform any
                necessary repairs to bring your home back to normal.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--accent-hover)]" />
                Service Areas
              </h3>
              {serviceAreas.length === 0 ? (
                <p className="text-slate-300 text-sm leading-relaxed">
                  Serving {city} and surrounding areas.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {serviceAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/service-area/${area.slug}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-[var(--accent-hover)] transition-colors text-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)]"></span>
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-[var(--accent-hover)]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">Licensed & Insured</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                We are fully certified to handle hazardous water and mold situations in {state}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
