import { normalizeUrl } from '@/lib/normalize-url'

export interface SocialLinks {
  google?: string | null
  facebook?: string | null
  pinterest?: string | null
  youtube?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  yelp?: string | null
}

export function parseSocialLinks(site: unknown): SocialLinks {
  const s = (site ?? {}) as any

  return {
    // New requested columns
    google: normalizeUrl(s.social_google || s.google_business_url || null) ?? null,
    facebook: normalizeUrl(s.social_facebook || s.facebook_url || null) ?? null,
    pinterest: normalizeUrl(s.social_pinterest || s.pinterest_url || null) ?? null,
    youtube: normalizeUrl(s.social_youtube || s.youtube_url || null) ?? null,
    instagram: normalizeUrl(s.social_instagram || null) ?? null,
    twitter: normalizeUrl(s.social_twitter || null) ?? null,
    linkedin: normalizeUrl(s.social_linkedin || null) ?? null,
    yelp: normalizeUrl(s.social_yelp || null) ?? null,
  }
}
