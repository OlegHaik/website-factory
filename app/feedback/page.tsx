import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { FloatingCall } from "@/components/floating-call"
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_SERVICE_NAV } from "@/lib/default-content"
import { fetchQuestionnaire, getContentHeader } from "@/lib/fetch-content"
import { processContent } from "@/lib/spintax"
import { parseSocialLinks } from "@/lib/types"
import { normalizeUrl } from "@/lib/normalize-url"
import { getServiceAreaIndexForCurrentDomain, resolveSiteContext } from "@/lib/sites"
import type { QuestionnaireContent } from "./FeedbackWizard"
import { FeedbackWizard } from "./FeedbackWizard"

export const dynamic = "force-dynamic"

const DEFAULT_QUESTIONNAIRE = {
  h1: "How was your experience with {{business_name}}?",
  subheadline: "A quick 3-step check-in before you leave your public review.",
  step1Progress: "Overall experience",
  step1Question: "How would you rate your overall experience?",
  step2Progress: "Our team",
  step2Question: "How satisfied were you with our team?",
  step3Progress: "Recommend us",
  step3Question: "How likely are you to recommend us to a friend?",
  step3Helper: "0 = Not likely at all, 10 = Extremely likely",
  step4Progress: "Share your review",
  thankYouHeadline: "Thank you for your feedback!",
  thankYouText: "Your answers help us deliver even better service.",
  reviewPrompt: "Please share your experience on Google so neighbors can choose with confidence.",
  buttonText: "Leave a Google Review",
  ctaSubtext: "Opens Google Reviews in a new tab.",
  backLinkText: "Back to Home",
}

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await resolveSiteContext()
  const businessName = site?.business_name || "Company"

  return {
    title: `${businessName} | Feedback`,
    description: `Tell us how ${businessName} did and leave a review.`,
  }
}

export default async function FeedbackPage() {
  const { site, domain: requestDomain } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name) throw new Error("Site is missing required field: business_name")
  if (!site.phone) throw new Error("Site is missing required field: phone")

  const domain = site.resolvedDomain || site.domain_url || requestDomain || "default"
  const category = site.category || "water_damage"

  const headerContent = await getContentHeader(category)
  const questionnaireContent = await fetchQuestionnaire(category)

  const areaIndex = await getServiceAreaIndexForCurrentDomain()
  const serviceAreas = areaIndex.map((a) => ({ name: a.city, slug: a.slug }))

  const variables = {
    city: site.city || "",
    state: site.state || "",
    business_name: site.business_name,
    phone: site.phone,
  }

  const navLabels = {
    home: processContent(headerContent?.nav_home || DEFAULT_NAV.home, domain, variables),
    services: processContent(headerContent?.nav_services || DEFAULT_NAV.services, domain, variables),
    areas: processContent(headerContent?.nav_areas || DEFAULT_NAV.areas, domain, variables),
    contact: processContent(headerContent?.nav_contact || DEFAULT_NAV.contact, domain, variables),
    callButton: processContent(headerContent?.call_button_text || DEFAULT_NAV.callButton, domain, variables),
  }

  const ourLinksLabel = processContent(headerContent?.our_links_spintax || DEFAULT_HEADER.ourLinks, domain, variables)

  const serviceNavLabels = {
    water: processContent(DEFAULT_SERVICE_NAV.water, domain, variables),
    fire: processContent(DEFAULT_SERVICE_NAV.fire, domain, variables),
    mold: processContent(DEFAULT_SERVICE_NAV.mold, domain, variables),
    biohazard: processContent(DEFAULT_SERVICE_NAV.biohazard, domain, variables),
    burst: processContent(DEFAULT_SERVICE_NAV.burst, domain, variables),
    sewage: processContent(DEFAULT_SERVICE_NAV.sewage, domain, variables),
  }

  const q = questionnaireContent

  const content: QuestionnaireContent = {
    title: processContent(q?.h1_spintax || DEFAULT_QUESTIONNAIRE.h1, domain, variables),
    subtitle: processContent(q?.subheadline_spintax || DEFAULT_QUESTIONNAIRE.subheadline, domain, variables),
    steps: [
      {
        progress: processContent(q?.step1_progress_spintax || DEFAULT_QUESTIONNAIRE.step1Progress, domain, variables),
        question: processContent(q?.step1_question_spintax || DEFAULT_QUESTIONNAIRE.step1Question, domain, variables),
        scaleMax: 5,
      },
      {
        progress: processContent(q?.step2_progress_spintax || DEFAULT_QUESTIONNAIRE.step2Progress, domain, variables),
        question: processContent(q?.step2_question_spintax || DEFAULT_QUESTIONNAIRE.step2Question, domain, variables),
        scaleMax: 5,
      },
      {
        progress: processContent(q?.step3_progress_spintax || DEFAULT_QUESTIONNAIRE.step3Progress, domain, variables),
        question: processContent(q?.step3_question_spintax || DEFAULT_QUESTIONNAIRE.step3Question, domain, variables),
        helper: processContent(q?.step3_helper_spintax || DEFAULT_QUESTIONNAIRE.step3Helper, domain, variables),
        scaleMax: 10,
      },
    ],
    step4Progress: processContent(q?.step4_progress_spintax || DEFAULT_QUESTIONNAIRE.step4Progress, domain, variables),
    thankYouHeadline: processContent(q?.thank_you_headline_spintax || DEFAULT_QUESTIONNAIRE.thankYouHeadline, domain, variables),
    thankYouText: processContent(q?.thank_you_text_spintax || DEFAULT_QUESTIONNAIRE.thankYouText, domain, variables),
    reviewPrompt: processContent(q?.review_prompt_spintax || DEFAULT_QUESTIONNAIRE.reviewPrompt, domain, variables),
    buttonText: processContent(q?.button_text_spintax || DEFAULT_QUESTIONNAIRE.buttonText, domain, variables),
    ctaSubtext: processContent(q?.cta_subtext_spintax || DEFAULT_QUESTIONNAIRE.ctaSubtext, domain, variables),
    backLinkText: processContent(q?.back_link_spintax || DEFAULT_QUESTIONNAIRE.backLinkText, domain, variables),
  }

  const rawReviewLink = site.google_review_link || site.google_business_url || site.social_google || null
  const googleReviewLink =
    normalizeUrl(rawReviewLink, {
      allowedProtocols: ["http", "https"],
      defaultProtocol: "https",
      context: { domain, siteId: site.id, sourceKey: "feedback.google_review_link" },
    }) || null

  const socialLinks = parseSocialLinks(site)

  return (
    <div className="min-h-screen bg-white">
      <Header
        businessName={site.business_name}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        serviceAreas={serviceAreas}
        domain={domain}
        navLabels={navLabels}
        serviceNavLabels={serviceNavLabels}
      />

      <main className="pt-16 sm:pt-24">
        <FeedbackWizard content={content} googleReviewLink={googleReviewLink} backHref="/" />
      </main>

      <Footer
        businessName={site.business_name}
        siteId={site.id}
        domain={domain}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay || undefined}
        address={site.address}
        city={site.city}
        state={site.state}
        zipCode={site.zip_code}
        email={site.email}
        serviceAreas={serviceAreas}
        socialLinks={socialLinks}
        ourLinksLabel={ourLinksLabel}
      />
      <FloatingCall phone={site.phone} />
    </div>
  )
}
