import { createClient } from '@supabase/supabase-js'

// Service-role Supabase client for trusted server-side operations.
// Requires SUPABASE_SERVICE_ROLE_KEY to be set; never expose this key to the client.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
