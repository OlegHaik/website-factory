import { Hero } from "@/components/hero"

interface ServiceHeroProps {
  headline: string
  subheadline: string
  ctaSecondaryText?: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function ServiceHero({ headline, subheadline, ctaSecondaryText, phone, phoneDisplay, businessName, domain }: ServiceHeroProps) {
  return (
    <Hero
      title={headline}
      description={subheadline}
      phone={phone}
      phoneDisplay={phoneDisplay}
      businessName={businessName}
      domain={domain}
      chatButtonText={ctaSecondaryText}
    />
  )
}
