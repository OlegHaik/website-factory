import { CheckCircle } from "lucide-react"

interface ServiceTrustProps {
  headline: string
  trustPoints: string
}

function splitTrustPoints(text: string): string[] {
  const normalized = String(text || '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  // Try newlines first
  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length > 1) return lines

  // Try semicolons
  const semiSplit = normalized
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)

  if (semiSplit.length > 1) return semiSplit

  // Try pipe separators (but only outside of braces)
  // This handles format: "{option1|option2} text | {option3|option4} text | ..."
  const points: string[] = []
  let current = ''
  let braceDepth = 0

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]

    if (char === '{') {
      braceDepth++
      current += char
    } else if (char === '}') {
      braceDepth--
      current += char
    } else if (char === '|' && braceDepth === 0) {
      // Top-level pipe - this is a separator
      const trimmed = current.trim()
      if (trimmed) points.push(trimmed)
      current = ''
    } else {
      current += char
    }
  }

  // Don't forget the last segment
  const lastTrimmed = current.trim()
  if (lastTrimmed) points.push(lastTrimmed)

  if (points.length > 1) return points

  // Fallback: return as single item
  return normalized ? [normalized] : []
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
