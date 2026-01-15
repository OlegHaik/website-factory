require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkDatabase() {
  console.log('\n=== CHECKING DATABASE STRUCTURE ===\n')
  
  // Check each content table
  const tables = [
    'content_hero_new',
    'content_header_new',
    'content_cta_new',
    'content_faq_new',
    'content_testimonials_new',
    'content_services_new',
    'content_meta_new',
    'content_service_pages',
    'content_blocks'
  ]
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.log(`❌ ${table}: ${error.message}`)
    } else {
      console.log(`✅ ${table}: ${count} rows`)
      
      // Sample a row to see structure
      const { data: sample } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (sample && sample[0]) {
        console.log(`   Columns: ${Object.keys(sample[0]).join(', ')}`)
      }
    }
  }
  
  console.log('\n=== CHECKING SERVICES DATA ===\n')
  
  // Check services by category
  const categories = ['water_damage', 'roofing', 'mold_remediation', 'plumbing']
  
  for (const category of categories) {
    const { data, error } = await supabase
      .from('content_services_new')
      .select('service_id, service_name, service_slug')
      .eq('category', category)
    
    if (error) {
      console.log(`❌ ${category}: ${error.message}`)
    } else if (data) {
      console.log(`✅ ${category}: ${data.length} services`)
      data.forEach(s => {
        console.log(`   - ${s.service_slug}: ${s.service_name}`)
      })
    }
  }
  
  console.log('\n=== CHECKING SERVICE PAGES ===\n')
  
  for (const category of categories) {
    const { data, error } = await supabase
      .from('content_service_pages')
      .select('service_slug')
      .eq('category', category)
    
    if (error) {
      console.log(`❌ ${category}: ${error.message}`)
    } else if (data) {
      console.log(`✅ ${category}: ${data.length} service pages`)
      if (data.length > 0) {
        console.log(`   Pages: ${data.map(s => s.service_slug).join(', ')}`)
      }
    }
  }
}

checkDatabase().catch(console.error)
