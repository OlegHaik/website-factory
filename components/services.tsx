'use client'
import { Home, Hammer, Shield, Search, Droplets, ArrowRight, Wrench } from 'lucide-react'
import type { ColorTheme } from '@/lib/color-themes'

interface ServicesProps {
  locationData: {
    city: string
    state: string
    phone: string
    phoneDisplay?: string
    servicesIntro?: { intro: string }
    colorTheme: ColorTheme
  }
}

export function Services({ locationData }: ServicesProps) {
  const { city, servicesIntro, colorTheme } = locationData

  const services = [
    {
      icon: Home,
      title: 'Roof Installation',
      description: `Expert roof installation with premium materials and professional craftsmanship for lasting protection.`,
    },
    {
      icon: Hammer,
      title: 'Roof Repair',
      description: `Fast and reliable roof repair services to fix leaks, damaged shingles, and structural issues.`,
    },
    {
      icon: Shield,
      title: 'Roof Replacement',
      description: `Complete roof replacement from tear-off to final installation with quality materials and warranties.`,
    },
    {
      icon: Search,
      title: 'Roof Inspection',
      description: `Thorough roof inspections to identify potential issues before they become costly problems.`,
    },
    {
      icon: Droplets,
      title: 'Gutter Services',
      description: `Professional gutter installation, repair, and cleaning to protect your property from water damage.`,
    },
    {
      icon: Wrench,
      title: 'Storm Damage',
      description: `Emergency storm damage repair and restoration services available 24/7 when you need us most.`,
    },
  ]

  return (
    <section id="services" className="py-20 md:py-28 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className={`text-sm font-bold uppercase tracking-wide ${colorTheme.buttonBg} bg-clip-text text-transparent`} style={{backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: '#dc2626'}}>
              What We Offer
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {servicesIntro?.intro || `Comprehensive roofing solutions for ${city} homes and businesses`}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 ${colorTheme.buttonBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-gray-600 mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-red-600 font-semibold text-sm hover:gap-3 transition-all duration-200 group/link"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
