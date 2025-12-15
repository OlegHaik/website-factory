'use client'

import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPhoneDashed } from '@/lib/format-phone'

export function AuroraFloatingCall({ phone, className }: { phone: string; className?: string }) {
  const tel = `tel:${phone.replace(/\D/g, '')}`
  const phoneDisplay = formatPhoneDashed(phone)

  return (
    <a
      href={tel}
      className={cn(
        'fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-red-800 px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-red-900',
        className,
      )}
      aria-label="Call now"
    >
      <Phone className="h-4 w-4" />
      {phoneDisplay}
    </a>
  )
}
