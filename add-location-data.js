const { createClient } = require('@supabase/supabase-js')

// Legacy helper script (not used by the Next.js app at runtime).
//
// IMPORTANT: Never hardcode Supabase credentials in this repository.
// Provide them via environment variables when running this script:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addLocationData() {
  console.log('🔍 Checking if locations_template table exists...')

  // Sample location data
  const locations = [
    {
      slug: 'new-york-ny',
      domain: 'generalroofing.com',
      city: 'New York',
      state: 'NY',
      phone: '2125551234',
      address: '123 Broadway',
      postal_code: '10001',
      business_name: 'NYC Roofing Experts',
      is_active: true
    },
    {
      slug: 'los-angeles-ca',
      domain: 'generalroofing.com',
      city: 'Los Angeles',
      state: 'CA',
      phone: '3105559876',
      address: '456 Hollywood Blvd',
      postal_code: '90028',
      business_name: 'LA Roofing Pros',
      is_active: true
    },
    {
      slug: 'chicago-il',
      domain: 'generalroofing.com',
      city: 'Chicago',
      state: 'IL',
      phone: '3125554567',
      address: '789 Michigan Ave',
      postal_code: '60611',
      business_name: 'Chicago Roof Masters',
      is_active: true
    }
  ]

  try {
    // First, try to fetch existing data
    const { data: existing, error: fetchError } = await supabase
      .from('locations_template')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.error('❌ Error checking table:', fetchError.message)
      console.log('\n📋 You need to create the table first. Copy and paste this SQL into your Supabase SQL Editor:\n')
      console.log(`
CREATE TABLE IF NOT EXISTS locations_template (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  domain TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(slug, domain)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_locations_slug_domain ON locations_template(slug, domain);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations_template(is_active);
      `)
      return
    }

    console.log('✅ Table exists!')
    console.log(`📊 Found ${existing?.length || 0} existing locations`)

    // Insert sample locations
    console.log('\n📝 Adding sample location data...')

    for (const location of locations) {
      // Check if location already exists
      const { data: existingLoc } = await supabase
        .from('locations_template')
        .select('id')
        .eq('slug', location.slug)
        .eq('domain', location.domain)
        .single()

      if (existingLoc) {
        // Update existing
        const { error } = await supabase
          .from('locations_template')
          .update(location)
          .eq('id', existingLoc.id)

        if (error) {
          console.error(`❌ Error updating ${location.city}:`, error.message)
        } else {
          console.log(`✅ Updated: ${location.city}, ${location.state} (/${location.slug})`)
        }
      } else {
        // Insert new
        const { error } = await supabase
          .from('locations_template')
          .insert(location)

        if (error) {
          console.error(`❌ Error adding ${location.city}:`, error.message)
        } else {
          console.log(`✅ Added: ${location.city}, ${location.state} (/${location.slug})`)
        }
      }
    }

    console.log('\n🎉 Done! You can now access your pages at:')
    locations.forEach(loc => {
      console.log(`   http://localhost:3000/${loc.slug}`)
    })

  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
}

addLocationData()
