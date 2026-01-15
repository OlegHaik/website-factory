import type { HomeArticleElement } from "@/lib/fetch-content"
import { processContent } from "@/lib/spintax"

// Split bullet items by newlines, bullet chars, or pipes OUTSIDE of braces
function splitBulletItems(text: string): string[] {
  const normalized = String(text || '').trim()
  if (!normalized) return []

  // First try newlines
  const byNewline = normalized.split('\n').map(s => s.trim()).filter(Boolean)
  if (byNewline.length > 1) return byNewline

  // Try bullet characters
  const byBullet = normalized.split(/•|·/).map(s => s.trim()).filter(Boolean)
  if (byBullet.length > 1) return byBullet

  // Try semicolons
  const bySemi = normalized.split(';').map(s => s.trim()).filter(Boolean)
  if (bySemi.length > 1) return bySemi

  // Try pipes outside of braces
  const items: string[] = []
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
      const trimmed = current.trim()
      if (trimmed) items.push(trimmed)
      current = ''
    } else {
      current += char
    }
  }
  const last = current.trim()
  if (last) items.push(last)

  if (items.length > 1) return items

  return normalized ? [normalized] : []
}

interface SeoArticleProps {
  elements: HomeArticleElement[]
  domain: string
  variables: Record<string, string>
}

export function SeoArticle({ elements, domain, variables }: SeoArticleProps) {
  if (!elements || elements.length === 0) {
    return null
  }

  const renderElement = (element: HomeArticleElement, index: number) => {
    const content = processContent(element.content, domain, variables)

    switch (element.element_type) {
      case 'H2':
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 mt-8 mb-4">
            {content}
          </h2>
        )
      case 'H3':
        return (
          <h3 key={index} className="text-xl md:text-2xl font-semibold text-slate-800 mt-6 mb-3">
            {content}
          </h3>
        )
      case 'P':
        return (
          <p key={index} className="text-slate-600 leading-relaxed mb-4">
            {content}
          </p>
        )
      case 'BULLETS':
        // Split by newlines, bullet points, or pipes outside of braces
        const items = splitBulletItems(content)
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-slate-600">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      default:
        return (
          <p key={index} className="text-slate-600 leading-relaxed mb-4">
            {content}
          </p>
        )
    }
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose prose-slate max-w-none">
          {elements.map((element, index) => renderElement(element, index))}
        </article>
      </div>
    </section>
  )
}
