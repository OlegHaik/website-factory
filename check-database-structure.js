const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxtdgkdwydmvzgbibrrv.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStructure() {
  console.log('\n=== Checking Database Structure ===\n')
  
  // Check content tables
  const contentTables = [
    'content_hero',
    'content_header',
    'content_cta',
    'content_faq',
    'content_testimonials',
    'content_services',
    'content_meta'
  ]
  
  for (const table of contentTables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.log(`❌ ${table}: ERROR - ${error.message}`)
    } else {
      console.log(`✓ ${table}: ${count} rows`)
    }
  }
  
  // Check if styles table exists
  const { data: stylesData, error: stylesError } = await supabase
    .from('sites')
    .select('category, heading_font, body_font')
    .limit(3)
  
  console.log('\n=== Site Styles ===')
  if (stylesError) {
    console.log('❌ Error:', stylesError.message)
  } else {
    console.log(JSON.stringify(stylesData, null, 2))
  }
  
  // Check sample category data
  console.log('\n=== Sample Data from content_hero ===')
  const { data: heroData, error: heroError } = await supabase
    .from('content_hero')
    .select('*')
    .limit(5)
  
  if (heroError) {
    console.log('❌ Error:', heroError.message)
  } else {
    heroData.forEach(row => {
      console.log(`\nCategory: ${row.category}`)
      console.log(`Headline: ${row.headline_spintax?.substring(0, 50)}...`)
    })
  }
  
  // Check service area content
  console.log('\n=== Checking Service Area Content ===')
  const { data: saData, error: saError } = await supabase
    .from('content_service_area')
    .select('*')
    .limit(3)
  
  if (saError) {
    console.log('❌ content_service_area: ERROR - Table might not exist')
  } else {
    console.log(`✓ content_service_area: ${saData?.length || 0} rows found`)
    if (saData && saData.length > 0) {
      console.log('Sample:', JSON.stringify(saData[0], null, 2))
    }
  }
}

checkStructure().catch(console.error)
