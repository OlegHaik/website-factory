import { headers } from 'next/headers'

function normalizeHostToDomain(host: string): string {
  return (host || '')
    .split(':')[0]
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .toLowerCase()
}

/**
 * Resolve the current request domain from the Host header.
 * Falls back to NEXT_PUBLIC_DOMAIN for localhost/vercel preview.
 */
export async function getCurrentDomain(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const domain = normalizeHostToDomain(host)

  if (!domain || domain.includes('localhost') || domain.includes('vercel.app')) {
    return normalizeHostToDomain(process.env.NEXT_PUBLIC_DOMAIN ?? '')
  }

  return domain
}

export function normalizeDomainUrl(value: string | null | undefined): string {
  return normalizeHostToDomain(value ?? '')
}
