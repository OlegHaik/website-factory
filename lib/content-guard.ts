/**
 * Content Guard - Runtime protection against missing/wrong category content
 * Logs warnings when fallback content is used and ensures category-safe defaults
 */

export type ContentGuardContext = {
    siteId?: number | string
    category: string
    field: string
    page?: string
}

/**
 * Guard a content field with fallback and logging
 * Returns the DB value if present, otherwise logs and returns fallback
 */
export function guardContent<T>(
    dbValue: T | null | undefined,
    fallbackValue: T,
    context: ContentGuardContext
): T {
    // Check if value is empty/null/undefined
    const isEmpty =
        dbValue === null ||
        dbValue === undefined ||
        (typeof dbValue === 'string' && dbValue.trim() === '')

    if (!isEmpty) {
        return dbValue
    }

    // Log warning for missing content
    console.warn(
        `[ContentGuard] Missing content:`,
        `site_id=${context.siteId || 'unknown'}`,
        `category=${context.category}`,
        `field=${context.field}`,
        context.page ? `page=${context.page}` : ''
    )

    return fallbackValue
}

/**
 * Normalize category to lowercase
 * Prevents case sensitivity issues (e.g., "Roofing" vs "roofing")
 */
export function normalizeCategory(category: string | null | undefined): string {
    if (!category) return 'water_damage'
    return category.toLowerCase().trim()
}

/**
 * Validate that category is a known value
 * Returns normalized category or 'water_damage' if unknown
 */
const KNOWN_CATEGORIES = new Set([
    'water_damage',
    'roofing',
    'mold_remediation',
    'plumbing',
    'bathroom_remodel',
    'kitchen_remodel',
    'air_duct',
    'chimney',
    'locksmith',
    'garage_door',
    'adu_builder',
    'pool_contractor',
])

export function validateCategory(category: string | null | undefined): string {
    const normalized = normalizeCategory(category)

    if (!KNOWN_CATEGORIES.has(normalized)) {
        console.warn(`[ContentGuard] Unknown category: "${category}", falling back to water_damage`)
        return 'water_damage'
    }

    return normalized
}

/**
 * Safe placeholder content for when no category-appropriate content exists
 * These are intentionally generic and NOT water-damage specific
 */
export const SAFE_PLACEHOLDERS = {
    headline: '{Professional|Expert|Trusted|Local} Services in {{city}}, {{state}}',
    subheadline: 'Quality work by experienced professionals. Contact us today.',
    paragraph: '{{business_name}} provides professional services to homes and businesses in {{city}}, {{state}}.',
    cta_headline: '{Get Started|Contact Us|Request a Quote}',
    cta_subheadline: 'Call {{phone}} for fast, reliable service.',
}
