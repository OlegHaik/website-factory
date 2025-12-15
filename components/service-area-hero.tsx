import { Hero } from "@/components/hero"

interface ServiceAreaHeroProps {
  areaName: string
  state: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function ServiceAreaHero({ areaName, state, phone, phoneDisplay, businessName, domain }: ServiceAreaHeroProps) {
  return (
    <Hero
      title={`Restoration Services in ${areaName}, ${state}`}
      description={`24/7 emergency restoration services for ${areaName} homes and businesses. Fast response times and expert technicians ready to restore your property.`}
      phone={phone}
      phoneDisplay={phoneDisplay}
      businessName={businessName}
      domain={domain}
    />
  )
}
