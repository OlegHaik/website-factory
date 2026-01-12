"use client"

import { ShieldCheck } from "lucide-react"

interface LicensedInsuredProps {
    title: string
    body: string
    variant?: "card" | "simple"  // card = with icon, simple = just text
}

/**
 * Reusable "Licensed & Insured" block
 * Content comes from Supabase via getStaticSection()
 */
export function LicensedInsured({ title, body, variant = "card" }: LicensedInsuredProps) {
    if (variant === "simple") {
        return (
            <div className="rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
            </div>
        )
    }

    // Card variant with icon (used on homepage)
    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-[var(--accent-hover)]" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">{title}</h3>
            <p className="text-slate-600 text-center leading-relaxed">{body}</p>
        </div>
    )
}

// Default fallback values (used when DB has no record - intentionally generic)
export const DEFAULT_LICENSED_INSURED = {
    title: "Licensed & Insured",
    body: "Certified professionals, quality equipment, and trusted service.",
}
