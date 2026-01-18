import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { SocialIcons } from "@/components/social-icons"
import { processContent } from "@/lib/spintax"
import { getFooterDescriptionSpintext } from "@/lib/default-content"

import type { SocialLinks } from "@/lib/types"

interface FooterProps {
  businessName: string
  siteId?: number | string
  domain?: string
  phone: string
  phoneDisplay?: string
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  email?: string | null
  serviceAreas?: Array<{ name: string; slug: string }>
  socialLinks?: SocialLinks
  ourLinksLabel?: string
  servicesLinks?: Array<{ label: string; href: string }>
  category?: string
}

// Legacy services removed - now services come from parent component based on category

export default function Footer({
  businessName,
  siteId,
  domain,
  phone,
  phoneDisplay,
  address,
  city,
  state,
  zipCode,
  email,
  serviceAreas = [],
  socialLinks,
  ourLinksLabel,
  servicesLinks,
  category = "water_damage",
}: FooterProps) {
  // Generate footer description from spintext template
  const footerSpintext = getFooterDescriptionSpintext(category)
  const seed = `${domain || 'default'}:footer`
  const variables = {
    business_name: businessName,
    city: city || '',
    state: state || '',
  }
  const footerDescription = processContent(footerSpintext, seed, variables)
  const cleanPhone = phone.replace(/\D/g, "")
  const displayPhone = phoneDisplay || phone
  const ourLinksText = ourLinksLabel || "Our Links"
  const normalizeServiceLinks = (links: Array<{ label: string | null | undefined; href: string }>) =>
    links
      .map((item) => ({ ...item, label: String(item.label ?? "").trim() }))
      .filter((item) => item.label.length > 0)

  // Only show services if provided - no fallback to hardcoded list
  const filteredServicesLinks = servicesLinks && servicesLinks.length > 0 ? normalizeServiceLinks(servicesLinks) : []

  const formatFullAddress = (
    street: string | null | undefined,
    city: string | null | undefined,
    state: string | null | undefined,
    zipCode: string | null | undefined,
  ) => {
    const streetClean = String(street ?? '').trim()
    if (!streetClean) return null

    // If the address already looks like a full address, keep it.
    if (streetClean.includes(',')) return streetClean

    const cityClean = String(city ?? '').trim()
    const stateClean = String(state ?? '').trim()
    const zipClean = String(zipCode ?? '').trim()

    const parts: string[] = [streetClean]
    const cityStateZip = [cityClean, stateClean].filter(Boolean).join(', ') + (zipClean ? ` ${zipClean}` : '')
    if (cityStateZip.trim()) parts.push(cityStateZip.trim())

    return parts.join(', ')
  }

  const fullAddress = formatFullAddress(address, city, state, zipCode)
  const emailClean = String(email ?? '').trim() || null

  return (
    <footer className="aurora-surface text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-x-16 mb-16">
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-baseline mb-4 max-w-full">
              <span
                className="v0-logo-mark text-[16px] lg:text-[18px] tracking-tight font-black uppercase whitespace-normal break-words leading-tight"
              >
                <span className="text-[var(--accent-primary)]">{businessName.split(' ')[0]}</span>
                <span className="text-white">&nbsp;{businessName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed">
              {footerDescription}
            </p>

            <div className="mt-5">
              <SocialIcons
                links={socialLinks ?? {}}
                domain={domain}
                siteId={siteId}
                className="mt-4"
                iconClassName="w-5 h-5"
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <nav className="space-y-3">
              {filteredServicesLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/links" className="block text-slate-300 hover:text-white font-semibold">
                {ourLinksText}
              </Link>
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
              {fullAddress && (
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <span>{fullAddress}</span>
                </div>
              )}
              {emailClean ? (
                <a href={`mailto:${emailClean}`} className="text-slate-300 hover:text-white break-all">
                  {emailClean}
                </a>
              ) : null}
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
            <Link href="/feedback" className="text-slate-400 hover:text-white">
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
