import type { ContentService } from "@/lib/fetch-content"
import { DEFAULT_SERVICES, type ServiceDefinition } from "@/lib/water-damage"

export type LegacyFieldMap = Record<string, { titleKey: keyof ContentService; descriptionKey: keyof ContentService }>

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

const LEGACY_SERVICE_FIELDS: LegacyFieldMap = {
  "water-damage-restoration": { titleKey: "water_title", descriptionKey: "water_description" },
  "fire-smoke-damage": { titleKey: "fire_title", descriptionKey: "fire_description" },
  "mold-remediation": { titleKey: "mold_title", descriptionKey: "mold_description" },
  "biohazard-cleanup": { titleKey: "biohazard_title", descriptionKey: "biohazard_description" },
  "burst-pipe-repair": { titleKey: "burst_title", descriptionKey: "burst_description" },
  "sewage-cleanup": { titleKey: "sewage_title", descriptionKey: "sewage_description" },
}

const ROOFING_SERVICE_FIELDS: LegacyFieldMap = {
  "roof-installation": { titleKey: "roof_installation_title", descriptionKey: "roof_installation_description" },
  "roof-repair": { titleKey: "roof_repair_title", descriptionKey: "roof_repair_description" },
  "shingle-roofing": { titleKey: "shingle_roofing_title", descriptionKey: "shingle_roofing_description" },
  "metal-roofing": { titleKey: "metal_roofing_title", descriptionKey: "metal_roofing_description" },
  "commercial-roofing": { titleKey: "commercial_roofing_title", descriptionKey: "commercial_roofing_description" },
  "emergency-leak": { titleKey: "emergency_leak_title", descriptionKey: "emergency_leak_description" },
}

export type CategoryServiceConfig = {
  services: ServiceDefinition[]
  legacyFields: LegacyFieldMap
  order: Map<string, number>
}

export const FALLBACK_CATEGORY = "water_damage"

export const SERVICE_FIELD_MAPPING: Record<string, LegacyFieldMap> = {
  water_damage: LEGACY_SERVICE_FIELDS,
  roofing: ROOFING_SERVICE_FIELDS,
}

export const CATEGORY_SERVICE_CONFIG: Record<string, CategoryServiceConfig> = {
  water_damage: {
    services: DEFAULT_SERVICES,
    legacyFields: LEGACY_SERVICE_FIELDS,
    order: makeOrderMap(DEFAULT_SERVICES),
  },
  roofing: {
    services: ROOFING_SERVICES,
    legacyFields: ROOFING_SERVICE_FIELDS,
    order: makeOrderMap(ROOFING_SERVICES),
  },
}

export function resolveCategoryConfig(category: string): CategoryServiceConfig {
  return CATEGORY_SERVICE_CONFIG[category] || CATEGORY_SERVICE_CONFIG[FALLBACK_CATEGORY]
}
