import { CTASection } from "@/components/cta-section"

interface ServiceCTAProps {
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
  headline: string
  subheadline: string
}

export function ServiceCTA({ phone, phoneDisplay, businessName, domain, headline, subheadline }: ServiceCTAProps) {
  return (
    <CTASection
      phone={phone}
      phoneDisplay={phoneDisplay}
      businessName={businessName}
      domain={domain}
      headline={headline}
      subheadline={subheadline}
    />
  )
}
