import type { SpintextVariables } from './spintext'

export interface ServiceDefinition {
  key: string
  slug: string
  title: string
  shortDescription: string
  icon: 'water' | 'fire' | 'mold' | 'biohazard' | 'burst-pipe' | 'sewage'
}

export const DEFAULT_SERVICES: ServiceDefinition[] = [
  {
    key: 'water-damage-restoration',
    slug: 'water-damage-restoration',
    title: 'Water Damage Restoration',
    shortDescription:
      'Emergency water extraction and rapid drying services. We use industry-leading equipment to restore your property fast.',
    icon: 'water',
  },
  {
    key: 'fire-smoke-damage',
    slug: 'fire-smoke-damage',
    title: 'Fire & Smoke Damage',
    shortDescription:
      'Comprehensive fire and smoke damage recovery. We handle soot removal, odor control, and structural cleanup.',
    icon: 'fire',
  },
  {
    key: 'mold-remediation',
    slug: 'mold-remediation',
    title: 'Mold Remediation',
    shortDescription:
      'Certified mold inspection, containment, and removal. We follow strict protocols to improve indoor air quality.',
    icon: 'mold',
  },
  {
    key: 'biohazard-cleanup',
    slug: 'biohazard-cleanup',
    title: 'Biohazard Cleanup',
    shortDescription:
      'Professional biohazard remediation for affected spaces. Safe handling and thorough sanitization.',
    icon: 'biohazard',
  },
  {
    key: 'burst-pipe-repair',
    slug: 'burst-pipe-repair',
    title: 'Burst Pipe Repair',
    shortDescription:
      '24/7 response for burst pipes and plumbing emergencies. Stop the leak and begin restoration immediately.',
    icon: 'burst-pipe',
  },
  {
    key: 'sewage-cleanup',
    slug: 'sewage-cleanup',
    title: 'Sewage Cleanup',
    shortDescription:
      'Emergency sewage and black water cleanup. We safely remove contamination and restore affected areas.',
    icon: 'sewage',
  },
]

export function getServiceBySlug(serviceSlug: string): ServiceDefinition | null {
  const normalized = serviceSlug.trim().toLowerCase()
  return DEFAULT_SERVICES.find((s) => s.slug === normalized) ?? null
}

export function titleFromAreaSlug(areaSlug: string): string {
  return decodeURIComponent(areaSlug)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

export function buildSpinVars(site: {
  business_name: string | null
  city: string | null
  state: string | null
  phoneDisplay: string | null
  phone: string | null
  address: string | null
  zip_code: string | null
  email: string | null
}): SpintextVariables {
  return {
    business_name: site.business_name ?? '',
    city: site.city ?? '',
    state: site.state ?? '',
    phone: site.phoneDisplay ?? site.phone ?? '',
    address: site.address ?? '',
    zip_code: site.zip_code ?? '',
    email: site.email ?? '',
  }
}

export const HOME_HERO_TITLE =
  '{{business_name}} — {Trusted|Reliable|Professional} {Fire & Water|Water & Fire} Restoration in {{city}}, {{state}}'

export const HOME_HERO_DESCRIPTION =
  "Don't let water damage destroy your home. Our {{city}} team uses advanced drying technology to restore your property fast. Direct insurance billing available."

export const SERVICE_HERO_BADGE = '{Professional Services|Emergency Response|Restoration Services}'

export const SERVICE_HERO_TITLE =
  '{Fast|24/7|Reliable} {{service_title}} Services in {{city}}, {{state}}'

export const SERVICE_HERO_DESCRIPTION =
  '24/7 emergency {{service_title}} for {{city}} homes and businesses. Fast response, expert technicians, and complete property restoration.'

export const AREA_HERO_BADGE = 'Serving {{area_title}}, {{state}}'

export const AREA_HERO_TITLE =
  '{Water & Fire|Fire & Water} Damage Restoration in {{area_title}}'

export const AREA_HERO_DESCRIPTION =
  '24/7 emergency restoration services for {{area_title}} homes and businesses. Fast response times and expert technicians ready to restore your property.'

export const DEFAULT_WHY_CHOOSE = ['60-Min Response', 'Licensed & Insured', 'IICRC Certified']
