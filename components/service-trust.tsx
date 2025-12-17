import { CheckCircle } from "lucide-react"

interface ServiceTrustProps {
  headline: string
  trustPoints: string
}

function splitTrustPoints(text: string): string[] {
  const normalized = String(text || '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length > 1) return lines

  return normalized
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
}

export function ServiceTrust({ headline, trustPoints }: ServiceTrustProps) {
  const points = splitTrustPoints(trustPoints)

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">{headline}</h2>

          {points.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <CheckCircle className="w-5 h-5 text-[var(--accent-primary)] mt-0.5" />
                  <p className="text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
