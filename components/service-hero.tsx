import { Hero } from "@/components/hero"

interface ServiceHeroProps {
  title: string
  description: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function ServiceHero({ title, description, phone, phoneDisplay, businessName, domain }: ServiceHeroProps) {
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
