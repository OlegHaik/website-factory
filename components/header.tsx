"use client"

import { useState } from "react"
import { Phone, Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"

interface ServiceArea {
  name: string
  slug: string
}

interface HeaderProps {
  businessName: string
  phone: string
  phoneDisplay?: string
  serviceAreas?: ServiceArea[]
  domain?: string
  navLabels?: {
    home: string
    services: string
    areas: string
    contact: string
    callButton: string
  }
}

const servicesLinks = [
  { label: "Water Damage Restoration", href: "/water-damage-restoration" },
  { label: "Fire & Smoke Damage", href: "/fire-smoke-damage" },
  { label: "Mold Remediation", href: "/mold-remediation" },
  { label: "Biohazard Cleanup", href: "/biohazard-cleanup" },
  { label: "Burst Pipe Repair", href: "/burst-pipe-repair" },
  { label: "Sewage Cleanup", href: "/sewage-cleanup" },
]

export function Header({ businessName, phone, phoneDisplay, serviceAreas = [], navLabels }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)

  const phoneHref = `tel:${phone.replace(/\D/g, '')}`
  const displayPhone = phoneDisplay || phone

  const labels = {
    home: navLabels?.home || "Home",
    services: navLabels?.services || "Services",
    areas: navLabels?.areas || "Service Areas",
    contact: navLabels?.contact || "Contact",
    callButton: navLabels?.callButton || "Call Now",
  }

  return (
    <>
      <header className="sticky top-0 z-50 relative overflow-visible">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950 to-slate-950" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--warm-dark)]/60 via-[var(--warm-med)]/30 to-transparent" />
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[var(--warm-bright)]/20 rounded-full blur-[80px]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--cool-dark)]/60 via-[var(--cool-accent)]/30 to-transparent" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--cool-med)]/25 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 lg:h-24">
            <Link href="/" className="flex items-baseline flex-shrink-0 min-w-fit pr-6">
              <span
                className="v0-logo-mark text-[22px] lg:text-[28px] tracking-tight font-black uppercase whitespace-nowrap"
              >
                <span className="text-[var(--accent-primary)]">{businessName.split(' ')[0]}</span>
                <span className="text-white">&nbsp;{businessName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1 ml-auto mr-6">
              <Link href="/" className="px-4 py-2 text-white/90 hover:text-white font-medium transition-colors">
                {labels.home}
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("services")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white font-medium transition-colors">
                  {labels.services}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === "services" ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === "services" && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent" />
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[240px]">
                      {servicesLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("areas")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white font-medium transition-colors">
                  {labels.areas}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === "areas" ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === "areas" && serviceAreas.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent" />
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[200px]">
                      {serviceAreas.map((area) => (
                        <Link
                          key={area.slug}
                          href={`/service-area/${area.slug}`}
                          className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {area.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/#cta" className="px-4 py-2 text-white/90 hover:text-white font-medium transition-colors">
                {labels.contact}
              </Link>
            </nav>

            <Link
              href={phoneHref}
              className="hidden lg:inline-flex items-center justify-center bg-[var(--accent-primary)] hover:bg-[var(--warm-med)] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              {labels.callButton}
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden ml-auto p-2 text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-slate-950">
          <div className="pt-24 px-4 pb-6 space-y-4">
            <Link href="/" className="block py-3 text-white text-lg font-medium border-b border-slate-800">
              {labels.home}
            </Link>

            <div className="border-b border-slate-800">
              <button
                onClick={() => setMobileDropdown(mobileDropdown === "services" ? null : "services")}
                className="flex items-center justify-between w-full py-3 text-white text-lg font-medium"
              >
                {labels.services}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${mobileDropdown === "services" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileDropdown === "services" && (
                <div className="pb-3 space-y-2">
                  {servicesLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 pl-4 text-slate-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {serviceAreas.length > 0 && (
              <div className="border-b border-slate-800">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === "areas" ? null : "areas")}
                  className="flex items-center justify-between w-full py-3 text-white text-lg font-medium"
                >
                  {labels.areas}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${mobileDropdown === "areas" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileDropdown === "areas" && (
                  <div className="pb-3 space-y-2">
                    {serviceAreas.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/service-area/${area.slug}`}
                        className="block py-2 pl-4 text-slate-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {area.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href="/#cta" className="block py-3 text-white text-lg font-medium border-b border-slate-800">
              {labels.contact}
            </Link>

            <Link
              href={phoneHref}
              className="flex items-center justify-center bg-[var(--accent-primary)] text-white font-semibold py-3 rounded-lg mt-6"
            >
              <Phone className="w-5 h-5 mr-2" />
              {labels.callButton}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
