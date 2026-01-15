require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
)

async function importData() {
  console.log('=== Loading XLSX File ===\n')
  const workbook = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx')
  console.log('Available sheets:', workbook.SheetNames.join(', '))
  console.log('')
  
  // Import HERO section
  if (workbook.SheetNames.includes('HERO')) {
    console.log('=== Importing HERO ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['HERO'])
    console.log(`Found ${sheet.length} hero entries`)
    
    const heroData = sheet.map(row => ({
      category_key: row.category || row.category_key,
      heading_spintax: row.heading_spintax || row.heading || '',
      subheading_spintax: row.subheading_spintax || row.subheading || '',
      cta_text_spintax: row.cta_text_spintax || row.cta_text || 'Contact Us',
      cta_url: row.cta_url || '/contact'
    })).filter(row => row.category_key)
    
    const { error } = await supabase.from('content_hero_new').upsert(heroData, { onConflict: 'category_key' })
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${heroData.length} hero entries\n`)
  }
  
  // Import MENU/HEADER section
  if (workbook.SheetNames.includes('MENU')) {
    console.log('=== Importing MENU/HEADER ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['MENU'])
    console.log(`Found ${sheet.length} header entries`)
    
    const headerData = sheet.map(row => ({
      category_key: row.category || row.category_key,
      logo_text_spintax: row.logo_text_spintax || row.logo_text || '{{business_name}}',
      tagline_spintax: row.tagline_spintax || row.tagline || '',
      phone_display_spintax: row.phone_display_spintax || row.phone_display || '{{phone}}',
      cta_text_spintax: row.cta_text_spintax || row.cta_text || 'Get Free Estimate',
      nav_home_spintax: row.nav_home_spintax || 'Home',
      nav_services_spintax: row.nav_services_spintax || 'Services',
      nav_about_spintax: row.nav_about_spintax || 'About',
      nav_contact_spintax: row.nav_contact_spintax || 'Contact'
    })).filter(row => row.category_key)
    
    const { error } = await supabase.from('content_header_new').upsert(headerData, { onConflict: 'category_key' })
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${headerData.length} header entries\n`)
  }
  
  // Import SERVICES_GRID
  if (workbook.SheetNames.includes('SERVICES_GRID')) {
    console.log('=== Importing SERVICES_GRID ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['SERVICES_GRID'])
    console.log(`Found ${sheet.length} service entries`)
    
    const servicesData = sheet.map((row, index) => ({
      category_key: row.category || row.category_key,
      service_key: row.service_key || row.service_slug || `service_${index}`,
      title_spintax: row.title_spintax || row.title || row.service_name || '',
      description_spintax: row.description_spintax || row.description || '',
      icon: row.icon || 'wrench',
      sort_order: row.sort_order || index
    })).filter(row => row.category_key && row.title_spintax)
    
    // Import to both tables for compatibility
    const { error: error1 } = await supabase.from('content_services_new').upsert(servicesData, { onConflict: 'category_key,service_key' })
    if (error1) console.error('Error (content_services_new):', error1.message)
    
    const servicesCompat = servicesData.map(s => ({
      category: s.category_key,
      service_key: s.service_key,
      name_spintax: s.title_spintax,
      description_spintax: s.description_spintax,
      icon: s.icon,
      sort_order: s.sort_order
    }))
    
    const { error: error2 } = await supabase.from('services').upsert(servicesCompat, { onConflict: 'category,service_key' })
    if (error2) console.error('Error (services):', error2.message)
    
    if (!error1) console.log(`✓ Imported ${servicesData.length} service entries\n`)
  }
  
  // Import FAQ
  if (workbook.SheetNames.includes('FAQ')) {
    console.log('=== Importing FAQ ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['FAQ'])
    console.log(`Found ${sheet.length} FAQ entries`)
    
    const faqData = sheet.map((row, index) => ({
      category_key: row.category || row.category_key,
      question_spintax: row.question_spintax || row.question || '',
      answer_spintax: row.answer_spintax || row.answer || '',
      sort_order: row.sort_order || index
    })).filter(row => row.category_key && row.question_spintax)
    
    const { error } = await supabase.from('content_faq_new').insert(faqData)
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${faqData.length} FAQ entries\n`)
  }
  
  // Import TESTIMONIALS
  if (workbook.SheetNames.includes('TESTIMONIALS')) {
    console.log('=== Importing TESTIMONIALS ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['TESTIMONIALS'])
    console.log(`Found ${sheet.length} testimonial entries`)
    
    const testimonialData = sheet.map((row, index) => ({
      category_key: row.category || row.category_key,
      name: row.name || 'Customer',
      location_spintax: row.location_spintax || row.location || '{{city}}, {{state}}',
      text_spintax: row.text_spintax || row.text || row.testimonial || '',
      rating: parseInt(row.rating) || 5,
      sort_order: row.sort_order || index
    })).filter(row => row.category_key && row.text_spintax)
    
    const { error } = await supabase.from('content_testimonials_new').insert(testimonialData)
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${testimonialData.length} testimonial entries\n`)
  }
  
  // Import CTA
  if (workbook.SheetNames.includes('CTA')) {
    console.log('=== Importing CTA ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['CTA'])
    console.log(`Found ${sheet.length} CTA entries`)
    
    const ctaData = sheet.map(row => ({
      category_key: row.category || row.category_key,
      heading_spintax: row.heading_spintax || row.heading || '',
      subheading_spintax: row.subheading_spintax || row.subheading || '',
      button_text_spintax: row.button_text_spintax || row.button_text || 'Contact Us'
    })).filter(row => row.category_key)
    
    const { error } = await supabase.from('content_cta_new').upsert(ctaData, { onConflict: 'category_key' })
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${ctaData.length} CTA entries\n`)
  }
  
  // Import META
  if (workbook.SheetNames.includes('META')) {
    console.log('=== Importing META ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['META'])
    console.log(`Found ${sheet.length} meta entries`)
    
    const metaData = sheet.map(row => ({
      category_key: row.category || row.category_key,
      page_type: row.page_type || 'home',
      meta_title_spintax: row.meta_title_spintax || row.title_spintax || row.title || '',
      meta_description_spintax: row.meta_description_spintax || row.description_spintax || row.description || ''
    })).filter(row => row.category_key && row.meta_title_spintax)
    
    const { error } = await supabase.from('content_meta_new').upsert(metaData, { onConflict: 'category_key,page_type' })
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${metaData.length} meta entries\n`)
  }
  
  // Import SERVICE_PAGES
  if (workbook.SheetNames.includes('SERVICE_PAGES')) {
    console.log('=== Importing SERVICE_PAGES ===')
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['SERVICE_PAGES'])
    console.log(`Found ${sheet.length} service page entries`)
    
    const servicePageData = sheet.map(row => ({
      slug: row.slug || row.service_slug,
      category: row.category || row.category_key,
      service_key: row.service_key || row.slug,
      title_spintax: row.title_spintax || row.title || '',
      description_spintax: row.description_spintax || row.description || '',
      meta_title_spintax: row.meta_title_spintax || row.title_spintax,
      meta_description_spintax: row.meta_description_spintax || row.description_spintax,
      body_spintax: row.body_spintax || row.content_spintax || '',
      icon: row.icon || 'wrench'
    })).filter(row => row.slug && row.category)
    
    const { error } = await supabase.from('service_pages').upsert(servicePageData, { onConflict: 'slug' })
    if (error) console.error('Error:', error.message)
    else console.log(`✓ Imported ${servicePageData.length} service page entries\n`)
  }
  
  console.log('=== Import Complete ===')
  console.log('\nVerifying data...\n')
  
  // Verify counts
  const tables = ['content_hero_new', 'content_header_new', 'content_services_new', 
                  'content_testimonials_new', 'content_faq_new', 'content_cta_new', 
                  'content_meta_new', 'service_pages', 'services']
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) console.log(`${table}: ERROR -`, error.message)
    else console.log(`${table}: ${count} rows`)
  }
}

importData().catch(console.error)
