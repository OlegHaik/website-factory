import type { HomeArticleElement } from "@/lib/fetch-content"
import { processContent } from "@/lib/spintax"

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
        // Split by newlines or bullet points
        const items = content.split(/\n|•|·/).map(s => s.trim()).filter(Boolean)
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
