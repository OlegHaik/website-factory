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
    <section id="cta" className="relative bg-slate-950 overflow-hidden py-24 lg:py-36">
      {/* Aurora background effects - matching hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--warm-dark)]/60 via-[var(--warm-med)]/30 to-transparent" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--warm-bright)]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-[var(--warm-med)]/15 rounded-full blur-[100px]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--cool-dark)]/60 via-[var(--cool-accent)]/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cool-med)]/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[var(--cool-accent)]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">{headlineText}</h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            {subheadlineText}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold px-6 py-3 transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              {displayPhone}
            </Link>

            <Link
              href={emailHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white text-slate-900 bg-white hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] font-semibold px-6 py-3 transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              {emailButtonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
