'use client'
// Updated: 2024-12-05 - All roofing menu items
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import { formatPhone } from '@/lib/format-phone'
import type { ColorTheme } from '@/lib/color-themes'

interface HeaderProps {
  phone?: string;
  businessName?: string;
  domain?: string;
  colorTheme: ColorTheme;
}

function getMenuItemsForDomain(domain: string) {
  // Different roofing service focus per domain for variety
  const menuVariations = [
    [
      { href: '#', label: 'Home', nonClickable: true },
      { href: '#about', label: 'About', nonClickable: false },
      { href: '#services', label: 'Roof Installation', nonClickable: false },
      { href: '#reviews', label: 'Reviews', nonClickable: false },
      { href: '#contact', label: 'Free Quote', nonClickable: false },
    ],
    [
      { href: '#', label: 'Home', nonClickable: true },
      { href: '#about', label: 'About', nonClickable: false },
      { href: '#services', label: 'Roof Repair', nonClickable: false },
      { href: '#reviews', label: 'Reviews', nonClickable: false },
      { href: '#contact', label: 'Free Estimate', nonClickable: false },
    ],
    [
      { href: '#', label: 'Home', nonClickable: true },
      { href: '#about', label: 'About', nonClickable: false },
      { href: '#services', label: 'Roof Replacement', nonClickable: false },
      { href: '#reviews', label: 'Testimonials', nonClickable: false },
      { href: '#contact', label: 'Get Quote', nonClickable: false },
    ],
    [
      { href: '#', label: 'Home', nonClickable: true },
      { href: '#about', label: 'About Us', nonClickable: false },
      { href: '#services', label: 'Roofing Services', nonClickable: false },
      { href: '#reviews', label: 'Reviews', nonClickable: false },
      { href: '#contact', label: 'Contact', nonClickable: false },
    ],
    [
      { href: '#', label: 'Home', nonClickable: true },
      { href: '#about', label: 'Our Company', nonClickable: false },
      { href: '#services', label: 'Storm Damage', nonClickable: false },
      { href: '#reviews', label: 'Customer Reviews', nonClickable: false },
      { href: '#contact', label: 'Free Inspection', nonClickable: false },
    ],
  ];

  // Hash domain to get consistent menu variation
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % menuVariations.length;
  return menuVariations[index];
}

export default function Header({ 
  phone = '18884330263',
  businessName = 'CHIMNEY SWEEP SERVICES',
  domain = 'default',
  colorTheme
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const formattedPhone = formatPhone(phone);
  const menuItems = getMenuItemsForDomain(domain);



  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${colorTheme.headerBg} border-b ${colorTheme.headerBorder} shadow-md`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Non-clickable */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-default">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
              <img
                src="/apple-touch-icon.png"
                alt="Location Pin"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain brightness-0 invert"
              />
            </div>
            <span className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${colorTheme.headerText} uppercase tracking-tight leading-tight`}>
              {businessName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item) => (
              item.nonClickable ? (
                <span
                  key={item.label}
                  className={`text-sm font-semibold ${colorTheme.headerText} cursor-default`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold ${colorTheme.headerText} hover:text-red-400 transition-colors`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Phone Button Desktop */}
          <div className="hidden lg:block">
            <Button
              asChild
              size="lg"
              className={`${colorTheme.buttonBg} ${colorTheme.buttonHover} text-white font-bold shadow-lg transition-all duration-200 rounded-lg`}
            >
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{formattedPhone}</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${colorTheme.headerText} hover:bg-white/10 rounded-md transition-colors`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`lg:hidden ${colorTheme.mobileBg} border-t ${colorTheme.headerBorder} shadow-lg`}>
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {menuItems.map((item) => (
              item.nonClickable ? (
                <span
                  key={item.label}
                  className={`text-base font-semibold ${colorTheme.headerText} py-3 px-4 cursor-default`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-semibold ${colorTheme.headerText} py-3 px-4 rounded-md ${colorTheme.mobileHover} hover:text-red-400 transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Button
              asChild
              size="lg"
              className={`mt-4 ${colorTheme.buttonBg} ${colorTheme.buttonHover} text-white font-bold shadow-lg rounded-lg`}
            >
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                {formattedPhone}
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export { Header }
