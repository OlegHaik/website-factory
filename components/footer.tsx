import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

interface FooterProps {
  businessName: string
  phone: string
  phoneDisplay?: string
  address?: string | null
  serviceAreas?: Array<{ name: string; slug: string }>
}

const servicesLinks = [
  { label: "Water Damage Restoration", href: "/water-damage-restoration" },
  { label: "Fire & Smoke Damage", href: "/fire-smoke-damage" },
  { label: "Mold Remediation", href: "/mold-remediation" },
  { label: "Biohazard Cleanup", href: "/biohazard-cleanup" },
  { label: "Burst Pipe Repair", href: "/burst-pipe-repair" },
  { label: "Sewage Cleanup", href: "/sewage-cleanup" },
]

export default function Footer({ businessName, phone, phoneDisplay, address, serviceAreas = [] }: FooterProps) {
  const cleanPhone = phone.replace(/\D/g, "")
  const displayPhone = phoneDisplay || phone
  const firstWord = businessName.split(" ")[0] || businessName
  const restWords = businessName.split(" ").slice(1).join(" ")

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-baseline mb-4">
              <span
                className="v0-logo-mark text-[18px] lg:text-[20px] tracking-tight font-black uppercase max-w-full inline-flex flex-wrap"
              >
                <span className="text-[#BA1C1C]">{firstWord}</span>
                {restWords ? <span className="text-white"> {restWords}</span> : null}
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed">
              24/7 emergency restoration services. Fast response, expert technicians, and complete property restoration.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <nav className="space-y-3">
              {servicesLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Service Areas</h4>
            <nav className="space-y-3">
              {serviceAreas.length === 0 ? (
                <span className="text-slate-300">Serving the local area</span>
              ) : (
                serviceAreas.map((area) => (
                  <Link key={area.slug} href={`/service-area/${area.slug}`} className="block text-slate-300 hover:text-white">
                    {area.name}
                  </Link>
                ))
              )}
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <div className="space-y-4">
              <Link href={`tel:${cleanPhone}`} className="flex items-center gap-3 text-slate-300 hover:text-white">
                <Phone className="w-5 h-5" />
                {displayPhone}
              </Link>
              {address && (
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              <p className="text-slate-300">Emergency Services Available</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-slate-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="text-slate-400 hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
