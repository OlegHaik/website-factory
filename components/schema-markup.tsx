import type { LocationData } from '@/lib/get-location-data';

interface SchemaMarkupProps {
  locationData: LocationData;
  headline?: string;
  description?: string;
}

export function SchemaMarkup({ locationData, headline, description }: SchemaMarkupProps) {
  const { business_name, phone, address, city, state, postal_code, domain } = locationData;

  // LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: business_name,
    image: `https://${domain}/apple-touch-icon.png`,
    '@id': `https://${domain}`,
    url: `https://${domain}`,
    telephone: phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: postal_code,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0, // You would populate these from your database
      longitude: 0,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '16:00',
      },
    ],
    sameAs: [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '127',
    },
  };

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Roofing Services',
    provider: {
      '@type': 'RoofingContractor',
      name: business_name,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: state,
      },
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedIn: {
        '@type': 'State',
        name: state,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Roof Installation',
            description: 'Professional roof installation with premium materials',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Roof Repair',
            description: 'Expert roof repair services for leaks and damage',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Roof Replacement',
            description: 'Complete roof replacement services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Roof Inspection',
            description: 'Comprehensive roof inspection services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Storm Damage Repair',
            description: 'Emergency storm damage repair and restoration',
          },
        },
      ],
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${city}, ${state}`,
        item: `https://${domain}`,
      },
    ],
  };

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: headline || `Professional Roofing Services in ${city}, ${state}`,
    description:
      description ||
      `Expert roofing installation, repair, and replacement in ${city}, ${state}. Licensed, insured & trusted.`,
    url: `https://${domain}`,
    provider: {
      '@type': 'RoofingContractor',
      name: business_name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
