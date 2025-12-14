import Link from 'next/link'
import { ArrowRight, Droplets, Flame, Skull, Wrench, Biohazard, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AuroraServiceItem {
  key: string
  title: string
  description: string
  href: string
  icon?: 'water' | 'fire' | 'mold' | 'biohazard' | 'burst-pipe' | 'sewage'
}

const iconMap = {
  water: Droplets,
  fire: Flame,
  mold: Skull,
  biohazard: Biohazard,
  'burst-pipe': Wrench,
  sewage: Trash2,
} as const

export interface AuroraServicesGridProps {
  title?: string
  items: AuroraServiceItem[]
  className?: string
}

export function AuroraServicesGrid({ title = 'Our Services', items, className }: AuroraServicesGridProps) {
  return (
    <section className={cn('bg-white py-16', className)}>
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h2>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : Droplets

            return (
              <div
                key={item.key}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
