'use client'
import { Shield, Award, Users, Clock } from 'lucide-react'
import type { ColorTheme } from '@/lib/color-themes'

interface AboutProps {
  locationData: {
    city: string
    state: string
    colorTheme: ColorTheme
  }
}

export function About({ locationData }: AboutProps) {
  const { city, state, colorTheme } = locationData

  const features = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      description: 'Fully certified and insured for your peace of mind',
    },
    {
      icon: Award,
      title: 'Top-Rated Service',
      description: 'Highest quality workmanship guaranteed',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Certified professionals you can trust',
    },
    {
      icon: Clock,
      title: '24/7 Emergency',
      description: 'Available when you need us most',
    },
  ]

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wide text-orange-600">
              About Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Trusted Roofing Services in {city}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            We are dedicated to providing exceptional roofing installation, repair, and replacement services to {city}, {state}. Our team of certified professionals brings decades of combined experience to ensure your roof is durable, weather-resistant, and compliant with all building codes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${colorTheme.buttonBg} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
