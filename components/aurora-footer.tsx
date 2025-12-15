import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AuroraFooterLink {
  label: string
  href: string
}

export interface AuroraFooterContact {
  address?: string | null
  phone?: string | null
}

export interface AuroraFooterProps {
  businessName: string
  services?: AuroraFooterLink[]
  serviceAreas?: AuroraFooterLink[]
  contact?: AuroraFooterContact
  className?: string
}

export function AuroraFooter({
  businessName,
  services = [],
  serviceAreas = [],
  contact,
  className,
}: AuroraFooterProps) {
  const normalizedPhone = (contact?.phone ?? '').replace(/\D/g, '')

  const [brandLead, brandRest] = (() => {
    const trimmed = businessName.trim()
    if (!trimmed) return ['Business', '']
    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) return [parts[0], '']
    return [parts[0], parts.slice(1).join(' ')]
  })()

  const areasForFooter = serviceAreas.slice(0, 8)

  return (
    <footer className={cn('border-t border-slate-200 bg-white', className)}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-base font-bold italic tracking-tight md:text-lg">
              <span className="text-red-600">{brandLead.toUpperCase()}</span>
              {brandRest ? <span className="text-slate-900"> {brandRest.toUpperCase()}</span> : null}
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Your trusted 24/7 emergency response team. Fast arrival, certified technicians, and direct insurance
              billing support.
            </p>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">Our Services</div>
            <div className="mt-3 flex flex-col gap-2 text-base">
              {services.map((l) => (
                <Link key={l.href} href={l.href} className="text-slate-700 hover:text-teal-600">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">Service Areas</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-base">
              {areasForFooter.map((l) => (
                <Link key={l.href} href={l.href} className="text-slate-700 hover:text-teal-600">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">Contact Info</div>
            <div className="mt-3 space-y-2 text-base text-slate-700">
              <div className="font-semibold text-slate-900">{businessName}</div>
              {contact?.address && (
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                  <span>{contact.address}</span>
                </div>
              )}

              {contact?.phone && (
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-500" />
                  {normalizedPhone ? (
                    <a
                      className="hover:text-teal-600"
                      href={`tel:${normalizedPhone}`}
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span>{contact.phone}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {businessName}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/terms-of-use" className="hover:text-slate-700">
              Terms
            </Link>
            <Link href="/links" className="hover:text-slate-700">
              Links
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
