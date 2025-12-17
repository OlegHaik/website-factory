import { CheckCircle } from 'lucide-react'

export interface ContentSectionServiceArea {
  slug: string
  city: string
}

export interface ContentSectionProps {
  city: string
  state: string
  businessName: string
  serviceAreas: ContentSectionServiceArea[]
}

export function ContentSection({ city, state, businessName, serviceAreas }: ContentSectionProps) {
  return (
    <section id="areas" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Professional Water Damage Services in {city}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                When disaster strikes, every second counts. At {businessName}, we understand the urgency of water damage,
                fire incidents, and mold growth. Our team of certified professionals is dedicated to restoring your
                property to its pre-loss condition as quickly and efficiently as possible. Serving {city} and the
                surrounding areas, we are your local experts in emergency mitigation.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Restoration Team?</h3>
              <p className="text-gray-600 leading-relaxed">
                Choosing the right restoration company can make the difference between a quick recovery and a long,
                drawn-out nightmare. We pride ourselves on transparency, speed, and quality craftsmanship. Unlike
                general contractors, we specialize specifically in disaster recovery. We utilize thermal imaging
                technology to detect hidden moisture that the naked eye cannot see, ensuring that no wet pockets are
                left behind to cause mold growth later. Our technicians are IICRC certified and undergo rigorous
                training to handle everything from burst frozen pipes to sewage backups.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Restoration Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Our process begins with a thorough inspection. We document everything for your insurance claim to
                ensure you get the coverage you deserve. Next, we begin water extraction using truck-mounted pumps.
                Once standing water is gone, we install industrial air movers and dehumidifiers. Finally, we perform
                any necessary repairs to bring your home back to normal.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Service Areas</h3>
              <div className="grid grid-cols-2 gap-3">
                {serviceAreas.map((area) => (
                  <a
                    key={area.slug}
                    href={`/service-area/${area.slug}`}
                    className="flex items-center gap-2 text-white hover:text-gray-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)]"></span>
                    {area.city}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-[var(--accent-hover)]" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Licensed & Insured</h3>
              <p className="text-gray-600 text-sm">
                We are fully certified to handle hazardous water and mold situations in {state}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
