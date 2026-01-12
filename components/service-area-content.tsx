import Link from "next/link"
import { LicensedInsured, DEFAULT_LICENSED_INSURED } from "@/components/licensed-insured"

interface LinkItem {
  label: string
  href: string
}

// Category-specific default text
const CATEGORY_DEFAULTS: Record<string, { title: string; description: string; helpItems: string[] }> = {
  water_damage: {
    title: "Water Damage Restoration",
    description: "Trusted local help for cleanup, drying, and repairs",
    helpItems: [
      "Emergency response",
      "Water extraction and structural drying",
      "Mold prevention and odor control",
      "Documentation support for insurance claims"
    ]
  },
  roofing: {
    title: "Professional Roofing Services",
    description: "Expert roofing installation, repair, and maintenance",
    helpItems: [
      "Roof inspections and assessments",
      "Shingle and tile replacement",
      "Storm damage repair",
      "Complete roof installations"
    ]
  },
  mold_remediation: {
    title: "Mold Remediation Services",
    description: "Safe and thorough mold removal and prevention",
    helpItems: [
      "Mold inspection and testing",
      "Safe mold removal",
      "Air quality improvement",
      "Prevention and sealing"
    ]
  },
  plumbing: {
    title: "Professional Plumbing Services",
    description: "Expert plumbing repair and installation",
    helpItems: [
      "Leak detection and repair",
      "Pipe installation and replacement",
      "Drain cleaning",
      "Water heater services"
    ]
  }
}

const DEFAULT_CATEGORY = {
  title: "Professional Services",
  description: "Expert local services you can trust",
  helpItems: [
    "Fast response times",
    "Licensed and insured professionals",
    "Quality workmanship",
    "Customer satisfaction guaranteed"
  ]
}

interface ServiceAreaContentProps {
  areaName: string
  state: string
  services: LinkItem[]
  otherAreas: Array<{ name: string; slug: string }>
  category?: string
  content?: {
    introTitle: string
    paragraphs: string[]
    whyCity: { headline: string; paragraph: string }
    servicesListHeadline: string
  }
  licensedInsured?: {
    title: string
    body: string
  }
}

export function ServiceAreaContent({ areaName, state, services, otherAreas, category = "water_damage", content, licensedInsured }: ServiceAreaContentProps) {
  const categoryDefaults = CATEGORY_DEFAULTS[category] || DEFAULT_CATEGORY

  // Use props or fall back to defaults
  const liTitle = licensedInsured?.title || DEFAULT_LICENSED_INSURED.title
  const liBody = licensedInsured?.body || DEFAULT_LICENSED_INSURED.body

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {content?.introTitle || `${categoryDefaults.title} in ${areaName}`}
              </h2>
              {content?.paragraphs?.length ? (
                <div className="mt-4 space-y-4 text-lg text-slate-600 leading-relaxed">
                  {content.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  {`${categoryDefaults.description} in ${areaName}, ${state}.`}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              {content ? (
                <>
                  <h3 className="text-xl font-bold text-slate-900">{content.whyCity.headline}</h3>
                  <p className="mt-4 text-slate-700 leading-relaxed">{content.whyCity.paragraph}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900">How We Help</h3>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {categoryDefaults.helpItems.map((item, idx) => (
                      <li key={idx}>{item}{idx === 0 ? ` in ${areaName} and surrounding areas` : ''}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{content?.servicesListHeadline || "Popular Services"}</h3>
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
              <div className="aurora-card rounded-2xl text-white p-8">
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

            <LicensedInsured title={liTitle} body={liBody} variant="simple" />
          </aside>
        </div>
      </div>
    </section>
  )
}

