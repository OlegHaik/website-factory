export interface TestimonialsSectionProps {
  businessName: string
  city: string
}

export function TestimonialsSection({ businessName, city }: TestimonialsSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="font-bold">4.9</span>
            <span className="text-gray-500">Rating out of 1926 reviews</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Customers Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-600 italic mb-4">
              "I woke up to a flooded kitchen at 2 AM and didn't know what to do. {businessName} arrived within 45
              minutes and immediately started extracting water. They saved my cabinets and handled the entire
              insurance process. Highly recommended!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="font-semibold">Jennifer Wu</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-600 italic mb-4">
              "Professional, polite, and incredibly thorough. We had a hidden mold issue in the bathroom, and their
              team found it, contained it, and removed it safely. The air quality test came back perfect afterwards.
              Thank you!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                D
              </div>
              <span className="font-semibold">Daniel Mackey</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-600 italic mb-4">
              "Best restoration company in {city}. They explained every step of the drying process and were very
              respectful of my home. The pricing was transparent and they stuck to their estimate."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                L
              </div>
              <span className="font-semibold">Lisa Frank</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
