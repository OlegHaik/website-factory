import { Hero } from "@/components/hero"

interface ServiceHeroProps {
  serviceTitle: string
  city: string
  state: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function ServiceHero({ serviceTitle, city, state, phone, phoneDisplay, businessName, domain }: ServiceHeroProps) {
  return (
    <Hero
      title={`${serviceTitle} in ${city}, ${state}`}
      description={`24/7 emergency ${serviceTitle.toLowerCase()} for ${city} homes and businesses. Fast response, expert technicians, and complete property restoration.`}
      phone={phone}
      phoneDisplay={phoneDisplay}
      businessName={businessName}
      domain={domain}
    />
  )
}
