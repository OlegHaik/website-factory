import Link from 'next/link'
import { Facebook, Globe, Mail, MapPin, Phone, Pin, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AuroraFooterLink {
  label: string
  href: string
}

export interface AuroraFooterContact {
  address?: string | null
  phone?: string | null
  email?: string | null
}

export interface AuroraFooterProps {
  businessName: string
  city?: string | null
  state?: string | null
  quickLinks?: AuroraFooterLink[]
  services?: AuroraFooterLink[]
  contact?: AuroraFooterContact
  socialLinks?: AuroraFooterLink[]
  className?: string
}

function iconForSocialLabel(label: string) {
  const v = label.toLowerCase()
  if (v.includes('facebook')) return Facebook
  if (v.includes('youtube')) return Youtube
  if (v.includes('pinterest')) return Pin
  if (v.includes('google')) return Globe
  return Globe
}

export function AuroraFooter({
  businessName,
  city,
  state,
  quickLinks = [],
  services = [],
  contact,
  socialLinks = [],
  className,
}: AuroraFooterProps) {
  const normalizedPhone = (contact?.phone ?? '').replace(/\D/g, '')

  const effectiveSocialLinks =
    socialLinks.length > 0
      ? socialLinks
      : [
          { label: 'Facebook', href: '#' },
          { label: 'YouTube', href: '#' },
          { label: 'Pinterest', href: '#' },
          { label: 'Google', href: '#' },
        ]

  return (
    <footer className={cn('border-t border-slate-200 bg-white', className)}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">{businessName}</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {city && state
                ? `Serving ${city}, ${state} and nearby communities with 24/7 emergency response.`
                : '24/7 emergency restoration services. Fast response. Certified technicians.'}
            </p>

            {effectiveSocialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {effectiveSocialLinks.map((l) => {
                  const Icon = iconForSocialLabel(l.label)
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                      aria-label={l.label}
                      title={l.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-900">Quick Links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-slate-700 hover:text-[color:var(--aurora-accent,var(--brand))]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-900">Services</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {services.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-slate-700 hover:text-[color:var(--aurora-accent,var(--brand))]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-900">Contact</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
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
                      className="hover:text-[color:var(--aurora-accent,var(--brand))]"
                      href={`tel:${normalizedPhone}`}
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span>{contact.phone}</span>
                  )}
                </div>
              )}

              {contact?.email && (
                <div className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                  <a
                    className="break-all hover:text-[color:var(--aurora-accent,var(--brand))]"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
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
