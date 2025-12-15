import { MessageSquare, Phone } from 'lucide-react'
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
    <section className={cn('relative overflow-hidden pt-20', className)}>
      <div
        className={cn(
          'relative',
          'bg-gradient-to-r from-red-950 via-slate-950 to-blue-950',
        )}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-20 md:py-24">
            <div className="mx-auto w-full max-w-4xl text-center">
            {badge && (
              <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {badge}
              </div>
            )}

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl">
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
                size="lg"
                className="rounded-md bg-red-600 text-white shadow-none hover:bg-red-700"
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
                  size="lg"
                  className="rounded-md border-slate-200 bg-white text-slate-900 shadow-none hover:bg-slate-50 hover:text-slate-900"
                >
                  <a href={secondaryCta.href} className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {secondaryCta.label}
                  </a>
                </Button>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
