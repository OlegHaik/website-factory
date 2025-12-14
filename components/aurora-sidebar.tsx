import Link from 'next/link'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/lib/format-phone'
import type { ReactNode } from 'react'

export function AuroraSidebarCard({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export function AuroraEmergencyCard({ title, blurb, phone }: { title: string; blurb: string; phone: string }) {
  const phoneDisplay = formatPhone(phone)
  return (
    <AuroraSidebarCard
      title={title}
      className="bg-[linear-gradient(90deg,var(--aurora-warm-dark,var(--black)),var(--aurora-cool-dark,var(--neutral-dark)))] text-white"
    >
      <p className="text-xs leading-relaxed text-white/75">{blurb}</p>
      <Button
        asChild
        className="mt-4 w-full bg-[color:var(--aurora-accent,var(--brand))] text-white hover:bg-[color:var(--aurora-accent-hover,var(--brand-dark))]"
      >
        <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" />
          {phoneDisplay}
        </a>
      </Button>
    </AuroraSidebarCard>
  )
}

export function AuroraWhyChooseCard({ items }: { items: string[] }) {
  return (
    <AuroraSidebarCard title="Why Choose Us">
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[color:var(--aurora-bullet,var(--brand))]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </AuroraSidebarCard>
  )
}

export function AuroraLinksCard({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <AuroraSidebarCard title={title}>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-slate-700 hover:text-[color:var(--aurora-accent,var(--brand))]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </AuroraSidebarCard>
  )
}
