const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
)

async function checkTables() {
  console.log('=== Checking Content Tables ===\n')
  
  // Check each table individually
  const tablesToCheck = [
    'content_cta_new',
    'content_faq_new', 
    'content_header_new',
    'content_hero_new',
    'content_meta_new',
    'content_services_new',
    'content_testimonials_new'
  ]
  
  const results = []
  for (const table of tablesToCheck) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    results.push({
      table_name: table,
      exists: !error,
      count: error ? 'N/A' : count,
      error: error ? error.message : null
    })
  }
  
  console.log('Content tables status:')
  console.table(results)
  
  // Check service_pages table
  console.log('\n=== Checking service_pages ===')
  const { data: servicePages, error: spError } = await supabase
    .from('service_pages')
    .select('*', { count: 'exact', head: true })
  
  if (spError) {
    console.error('service_pages error:', spError.message)
  } else {
    console.log('service_pages count:', servicePages)
  }
  
  // Check services table
  console.log('\n=== Checking services ===')
  const { data: services, count: sCount, error: sError } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
  
  if (sError) {
    console.error('services error:', sError.message)
  } else {
    console.log('services count:', sCount)
  }
  
  // Check styles table
  console.log('\n=== Checking styles ===')
  const { data: styles, count: styCount, error: styError } = await supabase
    .from('styles')
    .select('category, primary_color, secondary_color', { count: 'exact' })
  
  if (styError) {
    console.error('styles error:', styError.message)
  } else {
    console.log('styles count:', styCount)
    console.table(styles)
  }
}

checkTables().catch(console.error)
