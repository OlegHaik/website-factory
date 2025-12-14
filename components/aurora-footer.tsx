import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface AuroraFooterLink {
  label: string
  href: string
}

export interface AuroraFooterProps {
  businessName: string
  city?: string | null
  state?: string | null
  socialLinks?: AuroraFooterLink[]
  className?: string
}

export function AuroraFooter({ businessName, city, state, socialLinks = [], className }: AuroraFooterProps) {
  return (
    <footer className={cn('border-t border-slate-200 bg-white', className)}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-sm font-extrabold text-slate-900">{businessName}</div>
            <div className="mt-2 text-sm text-slate-600">
              {city && state ? (
                <span>
                  Serving {city}, {state} and nearby communities.
                </span>
              ) : (
                <span>24/7 emergency restoration services.</span>
              )}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <div className="text-sm font-extrabold text-slate-900">Around the Web</div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {socialLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-slate-700 hover:text-[color:var(--aurora-accent,var(--brand))]"
                    rel="nofollow"
                    target="_blank"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
