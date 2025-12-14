'use client'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPhone } from '@/lib/format-phone'
import type { ColorTheme } from '@/lib/color-themes'

interface StickyMobileCTAProps {
  phone: string
  colorTheme: ColorTheme
}

export function StickyMobileCTA({ phone, colorTheme }: StickyMobileCTAProps) {
  const formattedPhone = formatPhone(phone)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg p-4">
      <Button 
        asChild 
        size="lg"
        className={`w-full ${colorTheme.buttonBg} ${colorTheme.buttonHover} text-white font-bold text-base py-6`}
      >
        <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-3">
          <Phone className="w-5 h-5" />
          Call Now {formattedPhone}
        </a>
      </Button>
    </div>
  )
}
