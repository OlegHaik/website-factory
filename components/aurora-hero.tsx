import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AuroraHeroProps {
  badge?: string
  title: string
  description?: string
  primaryCta: { href: string; label: string }
  secondaryCta?: { href: string; label: string }
  className?: string
}

export function AuroraHero({ badge, title, description, primaryCta, secondaryCta, className }: AuroraHeroProps) {
  return (
    <section className={cn('relative overflow-hidden pt-16', className)}>
      <div
        className={cn(
          'relative py-20 md:py-24',
          // Aurora gradient: warm -> cool
          'bg-[linear-gradient(90deg,var(--aurora-warm-dark,var(--black)),var(--aurora-cool-dark,var(--neutral-dark)))]',
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--aurora-warm-med,var(--neutral-dark))_0%,transparent_55%),radial-gradient(circle_at_80%_30%,var(--aurora-cool-med,var(--neutral-dark))_0%,transparent_55%)] opacity-70" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {badge && (
              <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {badge}
              </div>
            )}

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {title}
            </h1>

            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 md:text-base">
                {description}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-[color:var(--aurora-accent,var(--brand))] text-white hover:bg-[color:var(--aurora-accent-hover,var(--brand-dark))]"
              >
                <a href={primaryCta.href} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {primaryCta.label}
                </a>
              </Button>

              {secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
