import { Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

interface HeroProps {
  title: string
  description: string
  phone: string
  phoneDisplay?: string
  businessName: string
  domain?: string
}

export function Hero({ title, description, phone, phoneDisplay, businessName, domain }: HeroProps) {
  const safeName = (businessName || '').replace(/&/g, 'and')
  const smsMessage = encodeURIComponent(
    `Hello, I am visiting ${safeName} at ${domain || 'our website'}. I am looking for a free estimate.`,
  )
  const smsLink = `sms:+19492675767?body=${smsMessage}`
  const phoneHref = `tel:${phone.replace(/\D/g, '')}`
  const displayPhone = phoneDisplay || phone

  return (
    <section className="relative bg-slate-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-950/60 via-red-900/30 to-transparent" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#BA1C1C]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-red-800/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-[5%] w-[300px] h-[300px] bg-red-900/20 rounded-full blur-[80px]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-950/60 via-blue-900/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-[5%] w-[350px] h-[350px] bg-indigo-900/15 rounded-full blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/50 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance">
            {title}
          </h1>
          <p className="mt-8 text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-pretty">
            {description}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={phoneHref}
              className="inline-flex items-center justify-center bg-[#BA1C1C] hover:bg-[#2CD4BD] hover:text-slate-900 text-white font-semibold px-6 py-3 text-base rounded-lg w-full sm:w-auto transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              {displayPhone}
            </Link>
            <Link
              href={smsLink}
              className="inline-flex items-center justify-center border-2 border-white text-slate-900 bg-white hover:bg-[#2CD4BD] hover:border-[#2CD4BD] font-semibold px-6 py-3 text-base rounded-lg w-full sm:w-auto transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
