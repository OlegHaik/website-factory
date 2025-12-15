import { Droplets, Flame, Biohazard, Trash2, Wrench, ArrowRight } from "lucide-react"
import Link from "next/link"

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

const services = [
  {
    icon: Droplets,
    title: "Water Damage Restoration",
    href: "/water-damage-restoration",
    description:
      "Emergency water extraction and rapid drying services. We use hospital-grade dehumidifiers and thermal imaging to ensure zero hidden moisture remains in your property.",
  },
  {
    icon: Flame,
    title: "Fire & Smoke Damage",
    href: "/fire-smoke-damage",
    description:
      "Comprehensive fire and smoke damage recovery. Our team handles soot removal, structural cleaning, and complete deodorization to return your property to pre-loss condition.",
  },
  {
    icon: VirusIcon,
    title: "Mold Remediation",
    href: "/mold-remediation",
    description:
      "Certified mold inspection, containment, and removal. We follow strict IICRC protocols to safely eliminate black mold and restore healthy indoor air quality.",
  },
  {
    icon: Biohazard,
    title: "Biohazard Cleanup",
    href: "/biohazard-cleanup",
    description:
      "Professional biohazard remediation for crime scenes, trauma, and hazardous materials. Our certified team follows OSHA protocols to safely decontaminate affected areas.",
  },
  {
    icon: Wrench,
    title: "Burst Pipe Repair",
    href: "/burst-pipe-repair",
    description:
      "24/7 Response for frozen or burst plumbing pipes. We stop the water source immediately, repair the plumbing, and handle the full water damage cleanup process.",
  },
  {
    icon: Trash2,
    title: "Sewage Cleanup",
    href: "/sewage-cleanup",
    description:
      "Emergency sewage and black water cleanup services. We safely remove contaminated water, sanitize affected areas, and restore your property to safe living conditions.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-16">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
              <Link
                href={service.href}
                className="inline-flex items-center text-teal-500 font-semibold hover:text-teal-600 transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
