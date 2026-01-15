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
  // ContentBlock has heading_spintax and body_spintax
  // Render heading if present, then body
  const heading = block.heading_spintax ? processContent(block.heading_spintax, domain, variables) : null
  const body = block.body_spintax ? processContent(block.body_spintax || '', domain, variables) : null

  return (
    <div key={block.id} className="mb-6">
      {heading && (
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          {heading}
        </h2>
      )}
      {body && (
        <div 
          className="text-slate-600 text-lg leading-relaxed prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </div>
  )
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

