'use client'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import type { ColorTheme } from '@/lib/color-themes'

interface CTAProps {
  locationData: {
    city: string
    state: string
    phone: string
    phoneDisplay?: string
    headline?: string
    description?: string
    colorTheme: ColorTheme
  }
}

export function CTA({ locationData }: CTAProps) {
  const { city, phone, phoneDisplay, headline, description, colorTheme } = locationData

  const formattedPhone = phoneDisplay || phone

  return (
    <section id="contact" className={`py-20 md:py-28 ${colorTheme.heroBg} relative overflow-hidden`}>
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wide text-orange-400">
              Get Started Today
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            {headline || `Ready to Schedule Your Roofing Service in ${city}?`}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            {description || `Contact us today for professional roofing installation, repair, and maintenance services.`}
          </p>
          <Button
            asChild
            size="lg"
            className={`${colorTheme.buttonBg} ${colorTheme.buttonHover} text-white font-bold text-xl px-12 py-7 rounded-xl shadow-2xl transition-all duration-200`}
          >
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Call Now {formattedPhone}
            </a>
          </Button>
          <p className="mt-6 text-sm text-gray-400">
            Free estimates • Licensed & Insured • 24/7 Emergency Service
          </p>
        </div>
      </div>
    </section>
  )
}
