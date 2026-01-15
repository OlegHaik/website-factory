const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkServices() {
  console.log('\n=== Checking content_services_new ===')
  
  const { data, error } = await supabase
    .from('content_services_new')
    .select('*')
    .eq('category', 'water_damage')
    .order('service_id')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Found ${data.length} services for water_damage:`)
  data.forEach(s => {
    console.log(`  - ID: ${s.service_id}, Name: ${s.service_name}, Slug: ${s.service_slug}`)
  })
  
  console.log('\n=== Sample service data ===')
  console.log(JSON.stringify(data[0], null, 2))
}

checkServices()
