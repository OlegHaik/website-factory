import Link from "next/link"
import { LicensedInsured, DEFAULT_LICENSED_INSURED } from "@/components/licensed-insured"

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
  processHeadline?: string
  processBody?: string
  city: string
  state: string
  serviceAreas: Array<{ name: string; slug: string }>
  otherServices: LinkItem[]
  licensedInsured?: {
    title: string
    body: string
  }
}

function splitParagraphs(text: string): string[] {
  const normalized = String(text || '').replace(/\r\n/g, '\n')
  const parts = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return parts.length > 0 ? parts : [String(text || '')]
}

export function ServiceContent({ serviceTitle, serviceDescription, intro, sectionHeadline, sectionBody, processHeadline, processBody, city, state, serviceAreas, otherServices, licensedInsured }: ServiceContentProps) {
  const introText = intro || serviceDescription
  const headlineText = sectionHeadline || serviceTitle
  const bodyText = sectionBody || introText
  const processParagraphs = processBody ? splitParagraphs(processBody) : []
  const filteredOtherServices = (otherServices || [])
    .map((service) => ({ ...service, label: String(service.label ?? '').trim() }))
    .filter((service) => service.label.length > 0)

  // Use props or fall back to defaults
  const liTitle = licensedInsured?.title || DEFAULT_LICENSED_INSURED.title
  const liBody = licensedInsured?.body || DEFAULT_LICENSED_INSURED.body

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{headlineText}</h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{bodyText}</p>
            </div>

            {processHeadline && processParagraphs.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{processHeadline}</h3>
                <div className="mt-4 space-y-4 text-lg text-slate-600 leading-relaxed">
                  {processParagraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            )}

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
              <div className="aurora-card rounded-2xl text-white p-8">
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

            {filteredOtherServices.length > 0 && (
              <div className="rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Other Services</h3>
                <div className="space-y-3">
                  {filteredOtherServices.map((s) => (
                    <Link key={s.href} href={s.href} className="block text-slate-700 hover:text-red-600">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <LicensedInsured title={liTitle} body={liBody} variant="simple" />
          </aside>
        </div>
      </div>
    </section>
  )
}
