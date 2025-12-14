import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface AuroraContentLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  className?: string
}

export function AuroraContentLayout({ children, sidebar, className }: AuroraContentLayoutProps) {
  return (
    <section className={cn('bg-white py-12', className)}>
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">{sidebar}</div>
        </aside>
      </div>
    </section>
  )
}
