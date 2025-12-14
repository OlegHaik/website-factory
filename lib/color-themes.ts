export interface ColorTheme {
  primary: string
  secondary: string
  accent: string
  heroBg: string
  sectionBg: string
  buttonBg: string
  buttonHover: string
  headerBg: string
  headerBorder: string
  mobileBg: string
  mobileHover: string
  heroText: string
  headerText: string
}

// Construction-focused color theme - Modern & Bold with Industrial Feel
const constructionTheme: ColorTheme = {
  primary: 'slate-900',
  secondary: 'slate-800',
  accent: 'orange-600',
  heroBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  sectionBg: 'bg-gray-50',
  buttonBg: 'bg-orange-600',
  buttonHover: 'hover:bg-orange-700 hover:scale-105',
  headerBg: 'bg-slate-900',
  headerBorder: 'border-slate-800',
  mobileBg: 'bg-slate-900',
  mobileHover: 'hover:bg-slate-800',
  heroText: 'text-white',
  headerText: 'text-white',
}

// All domains use the construction theme for consistent branding
const colorThemeMap: Record<string, ColorTheme> = {
  blue: constructionTheme,
  red: constructionTheme,
  green: constructionTheme,
  amber: constructionTheme,
  purple: constructionTheme,
  pink: constructionTheme,
  indigo: constructionTheme,
  teal: constructionTheme,
  cyan: constructionTheme,
  orange: constructionTheme,
  lime: constructionTheme,
  emerald: constructionTheme,
  rose: constructionTheme,
  fuchsia: constructionTheme,
  violet: constructionTheme,
  sky: constructionTheme,
  yellow: constructionTheme,
}

// List of color keys for rotation
const colorKeys = Object.keys(colorThemeMap)

// Hash function to get consistent color for a domain
function getColorKeyForDomain(domain: string): string {
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorKeys[Math.abs(hash) % colorKeys.length]
}

export function getColorThemeForDomain(domain: string): ColorTheme {
  const colorKey = getColorKeyForDomain(domain)
  return colorThemeMap[colorKey]
}

// Simple hash for location-based variations
function getLocationVariantIndex(slug: string, domain: string, arrayLength: number): number {
  // Use slug as primary differentiator
  let hash = 5381
  const str = slug + domain // Slug first for more variation
  
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i) // hash * 33 + char
  }
  
  return Math.abs(hash) % arrayLength
}

export function getLocationBasedHeroText(domain: string, slug: string, city: string, state: string, businessName: string) {
  const titleVariants = [
    `Professional Roofing Services in ${city}, ${state}`,
    `Expert Roof Repair & Installation in ${city}, ${state}`,
    `Trusted Roofing Experts Serving ${city}, ${state}`,
    `Top-Rated Roofing Contractors in ${city}, ${state}`,
    `${city} Roof Repair & Replacement Specialists`,
    `Certified Roofing Professionals in ${city}, ${state}`,
    `Your Local Roofing Experts in ${city}, ${state}`,
    `Professional Roof Installation & Repair in ${city}`,
    `${city}'s Premier Roofing Company`,
    `Reliable Roof Repair & Maintenance in ${city}`,
    `Complete Roofing Solutions for ${city} Homes`,
    `Safe & Professional Roofing Services in ${city}, ${state}`,
    `#1 Roofing Company in ${city}, ${state}`,
    `Licensed Roofing Contractors Serving ${city}`,
    `Affordable Roof Repair & Replacement in ${city}`,
    `${city} Residential & Commercial Roofing Experts`,
    `Fast, Reliable Roofing Services in ${city}, ${state}`,
    `Full-Service Roofing Care for ${city} Residents`,
    `Quality Roof Installation & Inspection in ${city}`,
    `${state} Roofing Experts Serving ${city} & Surrounding Areas`,
  ]

  const descriptionVariants = [
    `We provide expert roofing installation, inspection, and repair services throughout ${city}, ${state}. Our certified team ensures your roof is safe, durable, and built to protect your home for decades.`,
    `Homeowners in ${city}, ${state} trust us for professional roofing services designed to prevent leaks, extend roof life, and maintain the structural integrity of your property.`,
    `With over 20 years of experience, we deliver high-quality roofing solutions for residents of ${city}, ${state}. From routine inspections to complete replacements, we keep your roof in top condition.`,
    `Serving ${city} and surrounding areas, our certified roofing experts use industry-leading materials and techniques to ensure your roof is weatherproof, efficient, and long-lasting.`,
    `Our licensed roofing contractors provide thorough roof inspections and professional installations in ${city}, ${state}, helping prevent water damage and costly structural issues in your home.`,
    `We specialize in comprehensive roof repair, replacement, and safety inspections for residential and commercial properties across ${city}, ${state}. Protect your home with professional service you can rely on.`,
    `From minor leak repairs to complete roof replacements, homeowners in ${city}, ${state} count on us for dependable, affordable roofing services backed by our satisfaction guarantee.`,
    `Whether you need emergency roof repair or a full roof replacement, our skilled team proudly serves the ${city}, ${state} region with honest workmanship and transparent pricing you can trust.`,
    `Complete roofing services in ${city}, ${state}, ensuring your home stays dry, secure, and energy-efficient. We handle everything from inspections to installations with professional care.`,
    `Our licensed roofing professionals help ${city} homeowners improve property value, eliminate leak problems, and prevent costly damage before it becomes a major issue.`,
    `Trusted by ${city} families for over two decades, we provide full-service roofing care including inspection, repair, replacement, and emergency storm damage services available 24/7.`,
    `Keep your ${city} home protected with professional roofing services. Our experienced contractors deliver thorough inspections, quality materials, and expert installations at competitive rates.`,
    `As ${city}'s leading roofing company, we offer comprehensive solutions including shingle replacement, flat roof systems, gutter installation, and annual maintenance programs.`,
    `Protect your ${city} property with professional roofing from our certified team. We combine modern materials with old-fashioned customer service to exceed your expectations.`,
    `Serving residential and commercial clients throughout ${city}, ${state}, we provide same-day emergency repairs, scheduled maintenance, and complete roof replacements to keep your property safe.`,
    `Your ${city} roof deserves expert care. Our licensed contractors provide detailed inspections, quality materials, expert installation, and helpful maintenance advice for lasting performance.`,
    `Family-owned and operated, we've been serving ${city} homeowners since 2003. Our commitment to quality workmanship and customer satisfaction makes us the area's most trusted roofing company.`,
    `Professional roofing services designed for ${city} homes. From minor repairs to complete replacements, our certified team has the expertise to handle all your roofing needs.`,
    `Experience matters when it comes to roofing. Our ${city} team brings decades of combined experience to every job, ensuring safe, efficient, and long-lasting results for your home.`,
    `Comprehensive roofing solutions for ${city}, ${state} residents. We handle inspections, repairs, replacements, storm damage, and emergency services with professionalism and care.`,
  ]

  const titleIndex = getLocationVariantIndex(slug, domain, titleVariants.length)
  const descIndex = getLocationVariantIndex(slug + '-desc', domain, descriptionVariants.length)

  return {
    headline: titleVariants[titleIndex],
    subheadline: 'Your Local Roofing Experts',
    description: descriptionVariants[descIndex]
  }
}

export function getServicesIntroText(domain: string, city: string) {
  return {
    intro: `Full-service roofing solutions for the ${city} community`
  }
}

export function getCTAText(domain: string, city: string) {
  return {
    title: `Ready to Schedule Your Roofing Service in ${city}?`,
    description: `Contact us today for professional roofing installation, repair, and maintenance services.`
  }
}

export function getMetaTitle(domain: string, city: string, state: string, businessName: string) {
  return `${businessName} | Professional Roofing Services in ${city}, ${state}`
}

export function getMetaDescription(domain: string, city: string, state: string, phone: string) {
  return `Professional roofing installation, repair & replacement in ${city}, ${state}. Licensed, insured & trusted. Call ${phone} for service.`
}

export function getMetaKeywords(city: string, state: string) {
  return `roofing ${city}, roof repair ${city}, roof replacement ${city} ${state}, roofing contractors ${city}`
}
