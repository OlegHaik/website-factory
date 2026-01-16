import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceItem {
  title: string
  description?: string
  href: string
}

interface ServicesProps {
  services: ServiceItem[]
  heading?: string
}

export function Services({ services, heading }: ServicesProps) {
  const seenKeys = new Set<string>()
  const items = (services || []).filter((svc) => {
    const title = String(svc?.title ?? "").trim()
    if (title.length === 0) return false

    // Prefer dedupe by URL/slug (this fixes cases like:
    // "Emergency Leak Repair" + "Roof Leak Repair" -> same "/leak-repair")
    const href = String((svc as any)?.href ?? (svc as any)?.url ?? "").trim()
    const slug = String((svc as any)?.slug ?? "").trim()

    const key = (href || slug || title).toLowerCase()
    if (seenKeys.has(key)) return false
    seenKeys.add(key)
    return true
  })

  if (items.length === 0) return null

  return (
    <section id="services" className="py-24 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-16">{heading || "Our Services"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => {
            const title = String(service.title ?? "").trim()
            const description = service.description || ""
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <Image
                    src="/icons8-checkmark-50.png"
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center text-[var(--accent-hover)] font-semibold hover:text-[var(--accent-hover)] transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
