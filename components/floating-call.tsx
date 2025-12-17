"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

export function FloatingCall({ phone }: { phone: string }) {
  const cleanPhone = phone.replace(/\D/g, "")

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
      <Link
        href={`tel:${cleanPhone}`}
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] text-white font-semibold py-3 shadow-lg"
      >
        <Phone className="w-5 h-5" />
        Call Now
      </Link>
    </div>
  )
}
