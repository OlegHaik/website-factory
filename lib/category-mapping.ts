import { DEFAULT_SERVICES, type ServiceDefinition } from "@/lib/water-damage"

// Remove unused LegacyFieldMap type that referenced ContentServiceNew

const makeOrderMap = (services: ServiceDefinition[]) => new Map(services.map((svc, index) => [svc.slug, index]))

const ROOFING_SERVICES: ServiceDefinition[] = [
  {
    key: "roof-installation",
    slug: "roof-installation",
    title: "Roof Installation",
    shortDescription: "New roof installation with durable materials and precise workmanship for long-term protection.",
    icon: "water",
  },
  {
    key: "roof-repair",
    slug: "roof-repair",
    title: "Roof Repair",
    shortDescription: "Leak detection and targeted repairs to extend roof life and prevent interior damage.",
    icon: "burst-pipe",
  },
  {
    key: "shingle-roofing",
    slug: "shingle-roofing",
    title: "Shingle Roofing",
    shortDescription: "Asphalt shingle installation and replacement tailored to your home and climate needs.",
    icon: "water",
  },
  {
    key: "metal-roofing",
    slug: "metal-roofing",
    title: "Metal Roofing",
    shortDescription: "Energy-efficient metal roof systems designed for longevity and weather resistance.",
    icon: "fire",
  },
  {
    key: "commercial-roofing",
    slug: "commercial-roofing",
    title: "Commercial Roofing",
    shortDescription: "Flat and low-slope roofing solutions with scheduled maintenance programs for businesses.",
    icon: "sewage",
  },
  {
    key: "emergency-leak",
    slug: "emergency-leak",
    title: "Emergency Leak Service",
    shortDescription: "Rapid-response leak mitigation to stop active water intrusion and protect interiors.",
    icon: "burst-pipe",
  },

]

const MOLD_SERVICES: ServiceDefinition[] = [
  {
    key: "mold-inspection",
    slug: "mold-inspection",
    title: "Mold Inspection",
    shortDescription: "Certified inspection and moisture tracing to identify mold sources and extent.",
    icon: "mold",
  },
  {
    key: "mold-remediation",
    slug: "mold-remediation",
    title: "Mold Remediation",
    shortDescription: "Containment, removal, and HEPA filtration following IICRC mold protocols.",
    icon: "mold",
  },
  {
    key: "black-mold",
    slug: "black-mold",
    title: "Black Mold Removal",
    shortDescription: "Targeted black mold cleanup with negative air and full PPE for safety.",
    icon: "mold",
  },
  {
    key: "water-damage-restoration",
    slug: "water-damage-restoration",
    title: "Water Damage Restoration",
    shortDescription: "Drying, dehumidification, and sanitization to prevent secondary mold growth.",
    icon: "water",
  },
  {
    key: "commercial-mold",
    slug: "commercial-mold",
    title: "Commercial Mold",
    shortDescription: "Large-loss and multi-unit mold remediation with business continuity planning.",
    icon: "mold",
  },
  {
    key: "air-quality-testing",
    slug: "air-quality-testing",
    title: "Air Quality Testing",
    shortDescription: "Post-remediation clearance and air sampling to confirm a clean environment.",
    icon: "mold",
  },
]

export type CategoryServiceConfig = {
  services: ServiceDefinition[]
  order: Map<string, number>
}

export const FALLBACK_CATEGORY = "water_damage"

export const CATEGORY_SERVICE_CONFIG: Record<string, CategoryServiceConfig> = {
  water_damage: {
    services: DEFAULT_SERVICES,
    order: makeOrderMap(DEFAULT_SERVICES),
  },
  roofing: {
    services: ROOFING_SERVICES,
    order: makeOrderMap(ROOFING_SERVICES),
  },
  mold_remediation: {
    services: MOLD_SERVICES,
    order: makeOrderMap(MOLD_SERVICES),
  },
  // Generic / New Categories (rely on DB content completely)
  adu_builder: { services: [], order: new Map() },
  air_conditioning: { services: [], order: new Map() },
  air_duct: { services: [], order: new Map() },
  bathroom_remodel: { services: [], order: new Map() },
  chimney: { services: [], order: new Map() },
  garage_door: { services: [], order: new Map() },
  heating: { services: [], order: new Map() },
  kitchen_remodel: { services: [], order: new Map() },
  locksmith: { services: [], order: new Map() },
  pest_control: { services: [], order: new Map() },
  plumbing: { services: [], order: new Map() },
  pool_contractor: { services: [], order: new Map() },
}

export function resolveCategoryConfig(category: string): CategoryServiceConfig {
  return CATEGORY_SERVICE_CONFIG[category] || CATEGORY_SERVICE_CONFIG[FALLBACK_CATEGORY]
}
