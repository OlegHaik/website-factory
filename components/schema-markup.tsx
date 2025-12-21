import Script from "next/script"
import type { SiteData } from "@/lib/sites"

interface FAQItem {
  question: string
  answer: string
}

interface ReviewItem {
  name: string
  text: string
  location?: string
  rating?: number
}

interface BreadcrumbItem {
  name: string
  url: string
}

type SchemaPageType = "homepage" | "service" | "service-area" | "legal"

interface SchemaMarkupProps {
  site: SiteData
  domain: string
  faq: FAQItem[]
  reviews: ReviewItem[]
  services: string[]
  headline?: string
  description?: string
  pageType?: SchemaPageType
  serviceName?: string
  areaServedOverride?: string
  breadcrumbs?: BreadcrumbItem[]
  parentOrgName?: string
  parentOrgUrl?: string
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: string) {
  let value = hashString(seed) || 1
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function randomFrom<T>(arr: T[], rand: () => number): T {
  if (!arr.length) throw new Error("Cannot pick from empty array")
  const idx = Math.floor(rand() * arr.length)
  return arr[Math.min(arr.length - 1, idx)]
}

function randomInt(min: number, max: number, rand: () => number) {
  return Math.floor(rand() * (max - min + 1)) + min
}

function parseAddress(address?: string | null) {
  if (!address) return { streetAddress: null, postalCode: null }
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean)
  return {
    streetAddress: parts[0] || address.trim(),
    postalCode: parts.find((p) => /\d{5}/.test(p)) || null,
  }
}

function buildServices(category?: string): string[] {
  const common = [
    "Water Damage Restoration",
    "Fire & Smoke Damage",
    "Flood Cleanup",
    "Burst Pipe Repair",
    "Sewage Cleanup",
    "Mold Remediation",
  ]

  if (!category) return common
  const cat = category.toLowerCase()
  if (cat.includes("water")) return common
  if (cat.includes("mold")) {
    return [
      "Mold Inspection",
      "Mold Testing",
      "Mold Removal",
      "Black Mold Remediation",
      "Air Quality Testing",
      "Mold Prevention",
    ]
  }
  if (cat.includes("roof")) {
    return [
      "Roof Repair",
      "Roof Replacement",
      "Roof Inspection",
      "Emergency Roofing",
      "Shingle Repair",
      "Flat Roof Services",
    ]
  }
  if (cat.includes("fire")) return ["Fire & Smoke Damage", "Odor Removal", "Soot Cleanup"]
  return common
}

export function SchemaMarkup({
  site,
  domain,
  faq,
  reviews,
  services,
  headline,
  description,
  pageType = "homepage",
  serviceName,
  areaServedOverride,
  breadcrumbs = [],
  parentOrgName,
  parentOrgUrl,
}: SchemaMarkupProps) {
  const url = domain ? `https://${domain}` : `https://${site.domain_url || site.resolvedDomain || ""}`
  const rand = seededRandom(`${site.domain_url || domain}-${site.slug || "home"}-${site.id || 0}`)
  const ratingValue = randomFrom([4.9, 5], rand).toFixed(1)
  const reviewCount = randomInt(500, 2000, rand)

  const { streetAddress, postalCode } = parseAddress(site.address)

  const offers = (services.length ? services : buildServices(site.category || undefined)).map((svc) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: svc,
    },
  }))

  const faqEntities = faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }))

  const reviewEntities = reviews.map((r) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: r.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating ?? 5,
      bestRating: 5,
    },
    reviewBody: r.text,
  }))

  const breadcrumbList = breadcrumbs.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      }
    : null

  const serviceSchema = pageType === "service"
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceName || services[0] || "Service",
        provider: {
          "@type": "LocalBusiness",
          name: site.business_name,
          url,
        },
        areaServed: `${site.city || ""}, ${site.state || ""}`.trim(),
        description: description || headline || "Professional services",
      }
    : null

  const areaServed = areaServedOverride || `${site.city || ""}, ${site.state || ""} and surrounding areas`

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: site.business_name,
      url,
      telephone: site.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: streetAddress || site.address || "",
        addressLocality: site.city || "",
        addressRegion: site.state || "",
        postalCode: postalCode || site.zip_code || "",
        addressCountry: "US",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount,
      },
      areaServed,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: offers,
      },
      review: reviewEntities,
      parentOrganization:
        pageType === "service-area" && (parentOrgName || parentOrgUrl)
          ? {
              "@type": "Organization",
              name: parentOrgName || site.business_name,
              url: parentOrgUrl || url,
            }
          : undefined,
    },
    serviceSchema,
    site.owner || site.email
      ? {
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.owner || site.business_name,
          email: site.email || undefined,
        }
      : null,
    faqEntities.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntities,
        }
      : null,
    breadcrumbList,
  ].filter(Boolean)

  const ldJson = JSON.stringify({ "@graph": graph })

  return <Script id="schema-markup" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: ldJson }} />
}
