import { MapPin } from "lucide-react"
import Link from "next/link"
import { LicensedInsured, DEFAULT_LICENSED_INSURED } from "@/components/licensed-insured"
import { ContentBlock } from "@/lib/fetch-content"
import { processContent } from "@/lib/spintax"

interface ServiceArea {
  name: string
  slug: string
}

interface AboutProps {
  businessName: string
  city: string
  state: string
  serviceAreas: ServiceArea[]
  seoContent: {
    intro: string
    whyChooseTitle: string
    whyChoose: string
    processTitle: string
    process: string
  }
  licensedInsured?: {
    title: string
    body: string
  }
  seoBodyArticleBlocks?: ContentBlock[]
  domain?: string
  variables?: {
    city: string
    state: string
    business_name: string
    phone: string
  }
}

function renderContentBlock(
  block: ContentBlock,
  domain: string,
  variables: { city: string; state: string; business_name: string; phone: string }
) {
  const content = processContent(block.value_spintax_html, domain, variables)

  switch (block.element_type) {
    case 'h1':
      // Render as H2 to avoid duplicate H1 (Hero has H1)
      return (
        <h2 key={block.id} className="text-4xl sm:text-5xl font-bold text-slate-900 mb-8">
          {content}
        </h2>
      )
    case 'h2':
      return (
        <h2 key={block.id} className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
          {content}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={block.id} className="text-2xl font-semibold text-slate-900 mb-5">
          {content}
        </h3>
      )
    case 'p':
      return (
        <p key={block.id} className="text-slate-600 text-lg leading-relaxed mb-4">
          {content}
        </p>
      )
    case 'bullets':
      // Split on Windows/Unix newlines, trim, remove leading bullet symbol, filter empty
      const items = content
        .split(/\r?\n/)
        .map((line: string) => line.trim().replace(/^•\s*/, ''))
        .filter((line: string) => line.length > 0)
      return (
        <ul key={block.id} className="list-disc list-inside text-slate-600 text-lg leading-relaxed mb-4 space-y-2">
          {items.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
    case 'cta':
      return (
        <div key={block.id} className="cta bg-slate-100 p-6 rounded-lg text-slate-700 text-lg mb-4">
          {content}
        </div>
      )
    default:
      return (
        <p key={block.id} className="text-slate-600 text-lg leading-relaxed mb-4">
          {content}
        </p>
      )
  }
}

export function About({ businessName, city, state, serviceAreas, seoContent, licensedInsured, seoBodyArticleBlocks, domain, variables }: AboutProps) {
  const introText = seoContent.intro
  const whyChooseTitleText = seoContent.whyChooseTitle
  const whyChooseText = seoContent.whyChoose
  const processTitleText = seoContent.processTitle
  const processText = seoContent.process

  // Use props or fall back to defaults
  const liTitle = licensedInsured?.title || DEFAULT_LICENSED_INSURED.title
  const liBody = licensedInsured?.body || DEFAULT_LICENSED_INSURED.body

  // Safe guard: only render content blocks if all required props are defined
  const hasContentBlocks = !!(
    seoBodyArticleBlocks &&
    seoBodyArticleBlocks.length > 0 &&
    domain &&
    variables
  )

  return (
    <section id="about" className="py-24 lg:py-36 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            {/* Render content_blocks if available */}
            {hasContentBlocks ? (
              <div className="space-y-6">
                {seoBodyArticleBlocks.map((block) =>
                  renderContentBlock(block, domain!, variables!)
                )}
              </div>
            ) : (
              /* Fallback to legacy seoContent */
              <>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
                    {processTitleText}
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed">{introText}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-5">{whyChooseTitleText}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{whyChooseText}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-5">{processTitleText}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{processText}</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--accent-hover)]" />
                Service Areas
              </h3>
              {serviceAreas.length === 0 ? (
                <p className="text-slate-300 text-sm leading-relaxed">
                  Serving {city} and surrounding areas.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {serviceAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/service-area/${area.slug}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-[var(--accent-hover)] transition-colors text-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)]"></span>
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <LicensedInsured title={liTitle} body={liBody} variant="card" />
          </div>
        </div>
      </div>
    </section>
  )
}

