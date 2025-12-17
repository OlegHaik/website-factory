import { Hero } from "@/components/hero"

interface ServiceAreaHeroProps {
  title: string
  description: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function ServiceAreaHero({ title, description, phone, phoneDisplay, businessName, domain }: ServiceAreaHeroProps) {
  return (
    <Hero
      title={title}
      description={description}
      phone={phone}
      phoneDisplay={phoneDisplay}
      businessName={businessName}
      domain={domain}
    />
  )
}
