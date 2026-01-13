import type { ComponentType } from "react"
import { Droplets, Flame, Biohazard, Trash2, Wrench, ArrowRight } from "lucide-react"
import Link from "next/link"

type ServiceIconKey = "water" | "fire" | "mold" | "biohazard" | "burst-pipe" | "sewage"

interface ServiceItem {
  title: string
  description?: string
  href: string
  icon?: ServiceIconKey
}

interface ServicesProps {
  services: ServiceItem[]
  heading?: string
}

const VirusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="23" />
    <line x1="1" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    <circle cx="12" cy="2.5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
    <circle cx="2.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="21.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="5.28" cy="5.28" r="1.2" fill="currentColor" />
    <circle cx="18.72" cy="18.72" r="1.2" fill="currentColor" />
    <circle cx="5.28" cy="18.72" r="1.2" fill="currentColor" />
    <circle cx="18.72" cy="5.28" r="1.2" fill="currentColor" />
  </svg>
)

const ICON_MAP: Record<ServiceIconKey, ComponentType<{ className?: string }>> = {
  water: Droplets,
  fire: Flame,
  mold: VirusIcon,
  biohazard: Biohazard,
  "burst-pipe": Wrench,
  sewage: Trash2,
}
const getIconComponent = (key?: ServiceIconKey) => (key ? ICON_MAP[key] : undefined) || Droplets

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
            const IconComponent = getIconComponent(service.icon)
            const title = String(service.title ?? "").trim()
            const description = service.description || ""
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7 text-[var(--accent-hover)]" />
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
