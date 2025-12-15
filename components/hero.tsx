import Header from '@/components/header'
import { getColorThemeForDomain } from '@/lib/color-themes'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export default function Hero() {
  const colorTheme = getColorThemeForDomain('generalroofing.com')
  return (
    <section className="relative min-h-screen">
      {/* Top Brand Bar */}
      <div className="bg-brand py-3 text-center">
        <p className="text-white font-bold text-sm md:text-base">
          ⭐ PROFESSIONAL CHIMNEY SERVICES ⭐
        </p>
      </div>

      {/* Header */}
      <Header colorTheme={colorTheme} />

      {/* Hero Background */}
      <div className="relative min-h-screen pt-32 pb-16 px-4">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chimney8.jpg-jkYJW26znTuPoAvivOBnSzfCMHi01G.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white my-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
              Professional Chimney Sweep & Cleaning Services
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-pretty">
              Expert chimney sweep, cleaning, repair, air duct cleaning, and dryer vent services for your home or business. Trusted by homeowners for safe and efficient chimney maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand hover:bg-brand-dark text-white font-bold text-lg px-8"
              >
                <a href="tel:18884330263" className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call (888) 433-0263
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
