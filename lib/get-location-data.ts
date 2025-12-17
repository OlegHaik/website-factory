import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

async function getCurrentDomain() {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const domain = host.split(':')[0]
  
  if (domain.includes('vercel.app') || domain.includes('localhost')) {
    return process.env.NEXT_PUBLIC_DOMAIN || 'generalroofing.com'
  }
  
  return domain.replace(/^www\./, '')
}

export interface LocationData {
  slug: string
  domain: string
  city: string
  state: string
  phone: string
  phoneDisplay: string
  email?: string | null
  address: string
  postal_code: string
  business_name: string
  is_active: boolean
  meta_title?: string
  meta_description?: string
}

export async function getLocationData(slug: string): Promise<LocationData | null> {
  const currentDomain = await getCurrentDomain()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  )

  // Try to find location by domain first
  let { data, error } = await supabase
    .from('locations_template')
    .select('*')
    .eq('slug', slug)
    .eq('domain', currentDomain)
    .eq('is_active', true)
    .single()

  // If no match and domain is not a custom domain, get any active location
  if ((error || !data) && (currentDomain.includes('vercel.app') || currentDomain.includes('localhost') || currentDomain === 'generalroofing.com')) {
    const result = await supabase
      .from('locations_template')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    data = result.data
    error = result.error
  }

  if (error || !data) {
    return null
  }

  const phone = data.phone || '8884430263'
  const phoneDisplay = phone.length === 10
    ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
    : phone

  return {
    ...data,
    phoneDisplay,
    domain: currentDomain,
  }
}
