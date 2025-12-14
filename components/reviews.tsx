'use client'
import { Star } from 'lucide-react'
import type { ColorTheme } from '@/lib/color-themes'

interface ReviewsProps {
  locationData: {
    city: string
    state: string
    colorTheme: ColorTheme
  }
}

export function Reviews({ locationData }: ReviewsProps) {
  const { city, state } = locationData

  const reviews = [
    {
      name: 'Sarah Johnson',
      date: 'March 2025',
      rating: 5,
      text: 'Outstanding roofing work! The crew was professional, efficient, and cleaned up perfectly. Our new roof looks amazing and we feel confident in the quality.',
    },
    {
      name: 'Michael Chen',
      date: 'February 2025',
      rating: 5,
      text: 'They repaired our roof leak quickly and thoroughly. The team explained everything clearly and the price was very reasonable. Highly recommend!',
    },
    {
      name: 'Emily Rodriguez',
      date: 'January 2025',
      rating: 5,
      text: 'Best roofing company in the area! They arrived on time, completed the work ahead of schedule, and the results exceeded our expectations. Will definitely use again.',
    },
  ]

  return (
    <section id="reviews" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wide text-orange-600">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Don't just take our word for it - hear from satisfied customers throughout {city}, {state} and surrounding areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed text-base">
                "{review.text}"
              </p>

              <div className="border-t border-gray-200 pt-5">
                <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                <p className="text-sm text-gray-500 mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
