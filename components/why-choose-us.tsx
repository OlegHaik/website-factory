'use client'
import { CheckCircle } from 'lucide-react'
import type { ColorTheme } from '@/lib/color-themes'

interface WhyChooseUsProps {
  locationData: {
    city: string
    state: string
    colorTheme: ColorTheme
  }
}

export function WhyChooseUs({ locationData }: WhyChooseUsProps) {
  const { city, state, colorTheme } = locationData

  const reasons = [
    'Over 20 Years of Experience',
    'Certified & Professional Technicians',
    'Competitive & Transparent Pricing',
    'Same-Day Service Available',
    'Residential & Commercial Services',
    'Insurance Claims Assistance',
    'Customer Satisfaction Guaranteed',
    'Free Estimates & Consultations',
  ]

  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why {city} Homeowners Choose Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            We're committed to delivering the highest quality roofing services to {city}, {state} with unmatched customer care and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg"
            >
              <div className={`flex-shrink-0 w-8 h-8 ${colorTheme.buttonBg} rounded-full flex items-center justify-center`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
