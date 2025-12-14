'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/lib/format-phone'

export interface AuroraNavItem {
  label: string
  href: string
}

export interface AuroraHeaderProps {
  businessName: string
  nav: AuroraNavItem[]
  phone: string
  className?: string
}

export function AuroraHeader({ businessName, nav, phone, className }: AuroraHeaderProps) {
  const [open, setOpen] = useState(false)
  const phoneDisplay = useMemo(() => formatPhone(phone), [phone])
  const [brandLead, brandRest] = useMemo(() => {
    const trimmed = businessName.trim()
    if (!trimmed) return ['Business', '']
    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) return [parts[0], '']
    return [parts[0], parts.slice(1).join(' ')]
  }, [businessName])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10',
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm font-extrabold tracking-wide text-white">
            <span className="text-[color:var(--aurora-accent,var(--brand))]">{brandLead}</span>
            {brandRest ? <> <span className="italic">{brandRest}</span></> : null}
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Button
            asChild
            className="bg-[color:var(--aurora-accent,var(--brand))] text-white hover:bg-[color:var(--aurora-accent-hover,var(--brand-dark))]"
          >
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {phoneDisplay}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black/40 md:hidden">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Button
              asChild
              className="mt-2 bg-[color:var(--aurora-accent,var(--brand))] text-white hover:bg-[color:var(--aurora-accent-hover,var(--brand-dark))]"
            >
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                {phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
