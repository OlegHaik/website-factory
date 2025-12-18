export interface NormalizeUrlContext {
  domain?: string
  siteId?: number | string
  sourceKey?: string
}

export interface NormalizeUrlOptions {
  /**
   * Allow relative URLs like `/contact`.
   * Default: false
   */
  allowRelative?: boolean

  /**
   * Schemes allowed when the input already has an explicit scheme.
   * Default: ['http', 'https']
   */
  allowedProtocols?: string[]

  /**
   * When input has no scheme and isn't relative, prepend this protocol.
   * Default: 'https'
   */
  defaultProtocol?: 'https' | 'http'

  /**
   * Optional server-side diagnostics context.
   */
  context?: NormalizeUrlContext
}

function isServer(): boolean {
  return typeof window === 'undefined'
}

function shouldTreatAsMissingToken(value: string): boolean {
  const upper = value.trim().toUpperCase()
  return upper === 'EMPTY' || upper === 'NULL'
}

function logNormalization(
  level: 'warn' | 'info',
  message: string,
  details: Record<string, unknown>,
): void {
  if (!isServer()) return

  // Keep logs useful in prod; keep them quiet in tests.
  if (process.env.NODE_ENV === 'test') return

  const payload = {
    tag: 'normalizeUrl',
    ...details,
  }

  if (level === 'warn') console.warn(message, payload)
  else console.info(message, payload)
}

/**
 * Normalizes and validates a URL string.
 *
 * Rules:
 * - null/undefined/non-string => null
 * - empty/whitespace => null
 * - literal "EMPTY" / "NULL" (case-insensitive) => null
 * - if allowRelative and starts with `/` => return as-is
 * - if has scheme (e.g. https://, tel:, sms:) => validate via `new URL()` and enforce allowedProtocols
 * - otherwise prefix with defaultProtocol (https) and validate
 */
export function normalizeUrl(raw: unknown, options: NormalizeUrlOptions = {}): string | null {
  const {
    allowRelative = false,
    allowedProtocols = ['http', 'https'],
    defaultProtocol = 'https',
    context,
  } = options

  if (typeof raw !== 'string') return null

  const trimmed = raw.trim()
  if (!trimmed) return null

  if (shouldTreatAsMissingToken(trimmed)) {
    logNormalization('info', 'URL treated as missing token', {
      domain: context?.domain,
      siteId: context?.siteId,
      sourceKey: context?.sourceKey,
      raw,
      normalized: null,
    })
    return null
  }

  if (allowRelative && trimmed.startsWith('/')) return trimmed

  // Already has an explicit scheme?
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)

  const candidate = hasScheme ? trimmed : `${defaultProtocol}://${trimmed}`

  try {
    const url = new URL(candidate)
    const protocol = url.protocol.replace(':', '').toLowerCase()

    if (!allowedProtocols.map((p) => p.toLowerCase()).includes(protocol)) {
      logNormalization('warn', 'URL rejected due to disallowed protocol', {
        domain: context?.domain,
        siteId: context?.siteId,
        sourceKey: context?.sourceKey,
        raw,
        candidate,
        protocol,
        allowedProtocols,
        normalized: null,
      })
      return null
    }

    return url.toString()
  } catch {
    logNormalization('warn', 'URL rejected as invalid', {
      domain: context?.domain,
      siteId: context?.siteId,
      sourceKey: context?.sourceKey,
      raw,
      candidate,
      normalized: null,
    })
    return null
  }
}
