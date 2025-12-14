import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { LocationData } from '@/lib/get-location-data';
import { formatPhone } from '@/lib/format-phone';

interface LocationFooterProps {
  locationData: LocationData;
}

export function LocationFooter({ locationData }: LocationFooterProps) {
  const {
    business_name,
    phone,
    email,
    address,
    city,
    state,
    postal_code,
  } = locationData;

  const currentYear = new Date().getFullYear();
  const formattedPhone = formatPhone(phone);

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{business_name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Professional roofing services serving {city}, {state} and surrounding areas. Licensed, insured, and trusted by homeowners since 2003.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact Us</h3>
            <div className="space-y-3">
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {formattedPhone}
              </a>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Location</h3>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
              <address className="not-italic">
                {address}<br />
                {city}, {state} {postal_code}
              </address>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Hours</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2 text-orange-400 font-semibold">
                <Clock className="h-4 w-4" />
                <span>24/7 Emergency Service</span>
              </div>
              <div className="mt-4 space-y-1">
                <p>Monday - Friday: 8am - 6pm</p>
                <p>Saturday: 9am - 4pm</p>
                <p>Sunday: By Appointment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} {business_name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LocationFooter;
