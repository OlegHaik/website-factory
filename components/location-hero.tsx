import { Button } from "@/components/ui/button";
import { Phone, Calendar, MapPin } from "lucide-react";
import type { LocationData } from "@/lib/get-location-data";
import { formatPhone } from "@/lib/format-phone";
import type { ColorTheme } from "@/lib/color-themes";

interface LocationHeroProps {
  locationData: LocationData & {
    colorTheme: ColorTheme;
    headline?: string;
    subheadline?: string;
    description?: string;
  };
}

export function LocationHero({ locationData }: LocationHeroProps) {
  const { city, state, phone, address, postal_code, colorTheme, headline, subheadline, description } = locationData;
  const formattedPhone = formatPhone(phone);
  const loc = `${city}, ${state}`;

  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient background with texture overlay */}
      <div className={`relative ${colorTheme.heroBg} py-24 md:py-32 lg:py-40`}>
        {/* Subtle roof texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            {/* Location badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <MapPin className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold uppercase tracking-wide text-white/90">
                Serving {loc}
              </span>
            </div>

            {/* Main headline - Large & Bold */}
            <h1 className="mb-6 text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              {headline}
            </h1>

            {/* Subheadline */}
            {subheadline && (
              <p className="mb-4 text-xl md:text-2xl lg:text-3xl font-bold text-red-400">
                {subheadline}
              </p>
            )}

            {/* Description */}
            <p className="mb-10 text-pretty text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* Two-button CTA layout */}
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary solid brand button */}
              <Button
                size="lg"
                className={`gap-2 ${colorTheme.buttonBg} ${colorTheme.buttonHover} text-white font-bold text-lg px-8 py-6 rounded-lg shadow-xl transition-all duration-200`}
                asChild
              >
                <a href={`tel:${phone.replace(/\D/g, "")}`}>
                  <Phone className="h-5 w-5" />
                  Call {formattedPhone}
                </a>
              </Button>

              {/* Secondary outline button */}
              <Button
                size="lg"
                className="gap-2 bg-white !text-slate-900 hover:!bg-gray-100 hover:!text-slate-900 border-2 border-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-200"
                asChild
              >
                <a href="#contact" className="text-slate-900">
                  <Calendar className="h-5 w-5" />
                  Request Free Quote
                </a>
              </Button>
            </div>

            {/* Address and service info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-400" />
                <span>
                  {address}, {city}, {state} {postal_code}
                </span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600" />
              <span className="font-semibold">24/7 Emergency Service Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Angled bottom edge using clip-path */}
      <div className="h-12 md:h-16 bg-white" style={{ clipPath: 'polygon(0 0, 100% 30%, 100% 100%, 0 100%)' }} />
    </section>
  );
}
