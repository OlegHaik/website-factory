'use client'

import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/lib/format-phone'

export function AuroraFloatingCall({ phone, className }: { phone: string; className?: string }) {
  const tel = `tel:${phone.replace(/\D/g, '')}`
  const phoneDisplay = formatPhone(phone)

  return (
    <a
      href={tel}
      className={cn(
        'fixed bottom-6 right-6 z-40 inline-flex h-10 items-center gap-2 rounded-full bg-red-600 px-4 text-xs font-bold text-white shadow-lg hover:bg-red-700',
        className,
      )}
      aria-label="Call now"
    >
      <Phone className="h-4 w-4" />
      {phoneDisplay}
    </a>
  )
}
