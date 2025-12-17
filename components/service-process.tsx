interface ServiceProcessProps {
  headline: string
  body: string
}

function splitParagraphs(text: string): string[] {
  const normalized = String(text || '').replace(/\r\n/g, '\n')
  const parts = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return parts.length > 0 ? parts : [String(text || '')]
}

export function ServiceProcess({ headline, body }: ServiceProcessProps) {
  const paragraphs = splitParagraphs(body)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{headline}</h2>
          <div className="mt-6 space-y-4 text-lg text-slate-600 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
