'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AuroraNavItem {
  label: string
  href: string
}

export interface AuroraHeaderProps {
  businessName: string
  nav: AuroraNavItem[]
  phone: string
  services?: AuroraNavItem[]
  serviceAreas?: AuroraNavItem[]
  className?: string
}

export function AuroraHeader({ businessName, nav, phone, services, serviceAreas, className }: AuroraHeaderProps) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false)
  const phoneDisplay = useMemo(() => {
    const cleaned = phone.replace(/\D/g, '')
    const digits = cleaned.length === 11 && cleaned.startsWith('1') ? cleaned.slice(1) : cleaned
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    }
    return phone
  }, [phone])
  const [brandLead, brandRest] = useMemo(() => {
    const trimmed = businessName.trim()
    if (!trimmed) return ['Business', '']
    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) return [parts[0], '']
    return [parts[0], parts.slice(1).join(' ')]
  }, [businessName])

  const normalizedPhone = useMemo(() => phone.replace(/\D/g, ''), [phone])

  const hasServicesDropdown = Boolean(services && services.length > 0)
  const hasServiceAreasDropdown = Boolean(serviceAreas && serviceAreas.length > 0)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-red-900',
        className,
      )}
    >
      <div className="container mx-auto flex h-20 items-center gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 text-base font-bold italic tracking-tight md:text-lg"
        >
          <span className="text-red-500">{brandLead.toUpperCase()}</span>
          {brandRest ? <span className="text-white"> {brandRest.toUpperCase()}</span> : <span className="text-white" />}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {nav.map((item) => {
            const isServices = item.label.toLowerCase() === 'services'
            const isAreas = item.label.toLowerCase() === 'service areas'

            if (isServices && hasServicesDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
                    onClick={() => {
                      setServicesOpen((v) => !v)
                      setAreasOpen(false)
                    }}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div
                    className={cn(
                      'absolute left-0 top-full z-50 w-64 pt-2',
                      servicesOpen ? 'block' : 'hidden',
                    )}
                    role="menu"
                  >
                    {/* Hover bridge: prevents gap between trigger and menu */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      <div className="p-2">
                      {services?.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          onClick={() => setServicesOpen(false)}
                        >
                          {s.label}
                        </Link>
                      ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            if (isAreas && hasServiceAreasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setAreasOpen(true)}
                  onMouseLeave={() => setAreasOpen(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
                    onClick={() => {
                      setAreasOpen((v) => !v)
                      setServicesOpen(false)
                    }}
                    aria-haspopup="menu"
                    aria-expanded={areasOpen}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div
                    className={cn(
                      'absolute left-0 top-full z-50 w-64 pt-2',
                      areasOpen ? 'block' : 'hidden',
                    )}
                    role="menu"
                  >
                    {/* Hover bridge: prevents gap between trigger and menu */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      <div className="max-h-80 overflow-auto p-2">
                      {serviceAreas?.map((a) => (
                        <Link
                          key={a.href}
                          href={a.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          onClick={() => setAreasOpen(false)}
                        >
                          {a.label}
                        </Link>
                      ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden shrink-0 md:flex">
          <Button
            asChild
            size="lg"
            className="rounded-lg bg-red-600 text-white shadow-none hover:bg-red-700"
          >
            <a href={`tel:${normalizedPhone}`} className="flex items-center gap-2">
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
        <div className="border-t border-white/10 bg-red-900 md:hidden">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {nav.map((item) => {
              const isServices = item.label.toLowerCase() === 'services'
              const isAreas = item.label.toLowerCase() === 'service areas'

              if (isServices && hasServicesDropdown) {
                return (
                  <div key={item.label} className="rounded-md border border-white/10">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-white/80"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                    >
                      {item.label}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', mobileServicesOpen ? 'rotate-180' : '')} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="flex flex-col gap-1 border-t border-white/10 p-2">
                        {services?.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                            onClick={() => setOpen(false)}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              if (isAreas && hasServiceAreasDropdown) {
                return (
                  <div key={item.label} className="rounded-md border border-white/10">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-white/80"
                      onClick={() => setMobileAreasOpen((v) => !v)}
                      aria-expanded={mobileAreasOpen}
                    >
                      {item.label}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', mobileAreasOpen ? 'rotate-180' : '')} />
                    </button>
                    {mobileAreasOpen && (
                      <div className="flex max-h-60 flex-col gap-1 overflow-auto border-t border-white/10 p-2">
                        {serviceAreas?.map((a) => (
                          <Link
                            key={a.href}
                            href={a.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                            onClick={() => setOpen(false)}
                          >
                            {a.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}

            <Button
              asChild
              size="lg"
              className="mt-2 rounded-lg bg-red-600 text-white shadow-none hover:bg-red-700"
            >
              <a
                href={`tel:${normalizedPhone}`}
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
