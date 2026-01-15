const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
)

async function checkData() {
  console.log('=== Checking Data in Content Tables ===\n')
  
  // Check content_hero_new
  const { data: heroes, error: heroError, count: heroCount } = await supabase
    .from('content_hero_new')
    .select('category_key', { count: 'exact' })
  
  if (heroError) {
    console.error('content_hero_new error:', heroError.message)
  } else {
    console.log(`content_hero_new: ${heroCount} rows`)
    console.log('Categories:', heroes?.map(h => h.category_key).join(', '))
  }
  
  // Check content_services_new
  const { data: services, error: servError, count: servCount } = await supabase
    .from('content_services_new')
    .select('category_key, service_key', { count: 'exact' })
  
  if (servError) {
    console.error('content_services_new error:', servError.message)
  } else {
    console.log(`\ncontent_services_new: ${servCount} rows`)
    if (services && services.length > 0) {
      console.log('Sample:', services.slice(0, 3))
    }
  }
  
  // Check service_pages
  const { data: servicePages, error: spError, count: spCount } = await supabase
    .from('service_pages')
    .select('slug, category', { count: 'exact' })
  
  if (spError) {
    console.error('\nservice_pages error:', spError.message)
  } else {
    console.log(`\nservice_pages: ${spCount} rows`)
    if (servicePages && servicePages.length > 0) {
      console.log('Sample slugs:', servicePages.slice(0, 5).map(p => p.slug).join(', '))
    }
  }
  
  // Check services table
  const { data: servicesTable, error: stError, count: stCount } = await supabase
    .from('services')
    .select('name_spintax, category', { count: 'exact' })
  
  if (stError) {
    console.error('\nservices table error:', stError.message)
  } else {
    console.log(`\nservices table: ${stCount} rows`)
    if (servicesTable && servicesTable.length > 0) {
      console.log('Sample:', servicesTable.slice(0, 3))
    }
  }
}

checkData().catch(console.error)
