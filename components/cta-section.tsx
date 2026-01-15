"use client"

import Link from "next/link"
import { Phone, Mail } from "lucide-react"

interface CTASectionProps {
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
  headline?: string
  subheadline?: string
  chatButtonText?: string
  email?: string
}

export function CTASection({
  phone,
  phoneDisplay,
  businessName,
  domain,
  headline,
  subheadline,
  chatButtonText,
  email,
}: CTASectionProps) {
  const cleanPhone = phone.replace(/\D/g, "")
  const displayPhone = phoneDisplay || phone

  // Generate email address - use provided email or derive from domain
  const emailAddress = email || (domain ? `info@${domain.replace(/^www\./, '')}` : 'info@example.com')
  const emailSubject = encodeURIComponent(`Inquiry from ${businessName || 'Website'}`)
  const emailBody = encodeURIComponent(`Hello,\n\nI'm reaching out from your website and would like to request a free estimate.\n\nThank you.`)
  const emailHref = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`

  const headlineText = headline || "Need Help Right Now?"
  const subheadlineText =
    subheadline ||
    "Call for immediate dispatch. Our team is available 24/7 for all your service needs."
  const emailButtonText = chatButtonText || "Email Us"

  return (
    <section id="cta" className="aurora-surface py-24 lg:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-10 md:p-14">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{headlineText}</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {subheadlineText}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--warm-med)] text-white font-semibold px-6 py-3.5 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                {displayPhone}
              </Link>

              <Link
                href={emailHref}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 border border-white/15 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                {emailButtonText}
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">Direct insurance billing available on qualifying losses.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
