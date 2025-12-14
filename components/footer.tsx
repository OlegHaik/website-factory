import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">General Chimney Sweep</h3>
            <p className="text-neutral-light mb-4 leading-relaxed">
              Your trusted partner for professional chimney cleaning, inspection, and repair
              services.
            </p>
          </div>

          {/* Contact Info */}
          

          {/* Hours */}
          <div>
            <h4 className="text-lg font-bold mb-4">Business Hours</h4>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-neutral-light">Mon - Sat: 7:00 AM - 6:00 PM</p>
                <p className="text-neutral-light">Sunday: Closed</p>
                <p className="text-brand font-semibold mt-2">Emergency Services Available</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-neutral-light hover:text-brand transition-colors">
                Home
              </Link>
              <Link href="#services" className="text-neutral-light hover:text-brand transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-neutral-light hover:text-brand transition-colors">
                About Us
              </Link>
              <Link href="#service-areas" className="text-neutral-light hover:text-brand transition-colors">
                Service Areas
              </Link>
              <Link href="#contact" className="text-neutral-light hover:text-brand transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-dark pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-light text-sm text-center md:text-left">
              © {new Date().getFullYear()} General Chimney Sweep. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-neutral-light hover:text-brand transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-light hover:text-brand transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
