"use client"

import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "Westfield, NJ",
    text: "When our basement flooded at 2 AM, they arrived within 45 minutes. Their team was professional, explained everything clearly, and worked with our insurance company directly. Our basement looks better than before the flood.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    location: "Summit, NJ",
    text: "We discovered black mold behind our bathroom wall. They contained the area properly, removed everything safely, and even helped us understand what caused it. Highly recommend their mold remediation services.",
    rating: 5,
  },
  {
    name: "Jennifer Thompson",
    location: "Cranford, NJ",
    text: "Our kitchen fire left smoke damage throughout the house. They handled the cleanup, odor removal, and repairs seamlessly. The team was respectful, thorough, and finished ahead of schedule.",
    rating: 5,
  },
]

interface TestimonialItem {
  name: string
  location: string
  text: string
  rating: number
}

interface TestimonialsProps {
  content?: {
    heading: string
    subheading: string
    items: TestimonialItem[]
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-emerald-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  )
}

export function Testimonials({ content }: TestimonialsProps) {
  const heading = content?.heading || "Trusted by Homeowners"
  const subheading = content?.subheading || "Real reviews from customers we’ve helped across the region."
  const items = content?.items?.length ? content.items : testimonials

  return (
    <section id="testimonials" className="py-24 lg:py-36 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">{heading}</h2>
          <p className="text-lg text-slate-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t) => (
            <Card key={t.name} className="border-slate-200">
              <CardContent className="p-8">
                <Stars rating={t.rating} />
                <p className="mt-4 text-slate-700 leading-relaxed">{t.text}</p>
                <div className="mt-6">
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
