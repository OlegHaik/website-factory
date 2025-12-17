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
    google: s.social_google || s.google_business_url || null,
    facebook: s.social_facebook || s.facebook_url || null,
    pinterest: s.social_pinterest || s.pinterest_url || null,
    youtube: s.social_youtube || s.youtube_url || null,
    instagram: s.social_instagram || null,
    twitter: s.social_twitter || null,
    linkedin: s.social_linkedin || null,
    yelp: s.social_yelp || null,
  }
}
