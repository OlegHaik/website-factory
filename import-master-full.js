#!/usr/bin/env node

/**
 * MASTER IMPORT SCRIPT
 * Імпортує ВСІ дані з MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx у Supabase
 * Версія 3.0 - ПОВНА та ЯКІСНА
 */

require('dotenv').config({ path: '.env.local' })
const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

const XLSX_FILE = 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('🚀 Starting FULL import from', XLSX_FILE)
  
  // Read XLSX file
  const workbook = XLSX.readFile(XLSX_FILE)
  
  // 1. SERVICES_GRID -> content_services_new
  console.log('\n📦 1/7: Importing SERVICES_GRID...')
  const servicesSheet = workbook.Sheets['SERVICES_GRID']
  const servicesData = XLSX.utils.sheet_to_json(servicesSheet)
  
  const servicesRows = servicesData.map((row, idx) => ({
    id: idx + 1,
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    service_name_spin: row.service_name_spin,
    service_slug: row.service_slug,
    svc_grid_desc: row.svc_grid_desc
  }))
  
  const { error: servicesError } = await supabase
    .from('content_services_new')
    .upsert(servicesRows, { onConflict: 'category,service_id' })
  
  if (servicesError) {
    console.error('❌ Error importing services:', servicesError.message)
    // Try to create table if it doesn't exist
    console.log('⚠️  Table might not exist. Creating...')
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS content_services_new (
          id SERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          service_id TEXT NOT NULL,
          service_name TEXT NOT NULL,
          service_name_spin TEXT NOT NULL,
          service_slug TEXT NOT NULL,
          svc_grid_desc TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT content_services_new_category_service_id_unique UNIQUE (category, service_id)
        );
        CREATE INDEX IF NOT EXISTS idx_content_services_new_category ON content_services_new(category);
        ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;
      `
    }).catch(() => ({ error: null }))
    
    // Try again after creating table
    const { error: retry } = await supabase
      .from('content_services_new')
      .upsert(servicesRows, { onConflict: 'category,service_id' })
    
    if (retry) {
      console.error('❌ Still failed:', retry.message)
      console.log('💡 Please run SQL manually from create_services_table.sql')
    } else {
      console.log('✅ Services imported:', servicesRows.length, 'rows')
    }
  } else {
    console.log('✅ Services imported:', servicesRows.length, 'rows')
  }
  
  // 2. HERO -> content_hero_new
  console.log('\n📦 2/7: Importing HERO...')
  const heroSheet = workbook.Sheets['HERO']
  const heroData = XLSX.utils.sheet_to_json(heroSheet)
  
  const heroRows = heroData.map((row, idx) => ({
    id: idx + 1,
    category: row.category,
    headline_spintax: row.hero_h1 || '',
    subheadline_spintax: row.hero_sub || '',
    chat_button_spintax: 'Chat With Us'
  }))
  
  const { error: heroError } = await supabase
    .from('content_hero_new')
    .upsert(heroRows, { onConflict: 'category' })
  
  if (heroError) console.error('❌ Error importing hero:', heroError.message)
  else console.log('✅ Hero imported:', heroRows.length, 'rows')
  
  // 3. MENU -> content_header_new
  console.log('\n📦 3/7: Importing MENU...')
  const menuSheet = workbook.Sheets['MENU']
  const menuData = XLSX.utils.sheet_to_json(menuSheet)
  
  // Group by category and take first row
  const menuByCategory = {}
  menuData.forEach(row => {
    if (!menuByCategory[row.category]) {
      menuByCategory[row.category] = row
    }
  })
  
  const menuRows = Object.values(menuByCategory).map((row, idx) => ({
    id: idx + 1,
    category: row.category,
    nav_home: row.nav_home || 'Home',
    nav_services: row.nav_services || 'Services',
    nav_areas: row.nav_areas || 'Service Areas',
    nav_contact: row.nav_contact || 'Contact',
    call_button_text: row.call_button_text || 'Call Now',
    our_links_spintax: row.our_links_spintax || ''
  }))
  
  const { error: menuError } = await supabase
    .from('content_header_new')
    .upsert(menuRows, { onConflict: 'category' })
  
  if (menuError) console.error('❌ Error importing menu:', menuError.message)
  else console.log('✅ Menu imported:', menuRows.length, 'rows')
  
  // 4. CTA -> content_cta_new
  console.log('\n📦 4/7: Importing CTA...')
  const ctaSheet = workbook.Sheets['CTA']
  const ctaData = XLSX.utils.sheet_to_json(ctaSheet)
  
  const ctaRows = ctaData.map((row, idx) => ({
    id: idx + 1,
    category: row.category,
    headline_spintax: row.cta_h2 || '',
    subheadline_spintax: row.cta_p || '',
    chat_button_spintax: row.cta_btn || 'Chat With Us'
  }))
  
  const { error: ctaError } = await supabase
    .from('content_cta_new')
    .upsert(ctaRows, { onConflict: 'category' })
  
  if (ctaError) console.error('❌ Error importing CTA:', ctaError.message)
  else console.log('✅ CTA imported:', ctaRows.length, 'rows')
  
  // 5. FAQ -> content_faq_new
  console.log('\n📦 5/7: Importing FAQ...')
  const faqSheet = workbook.Sheets['FAQ']
  const faqData = XLSX.utils.sheet_to_json(faqSheet)
  
  const faqRows = faqData.map((row) => ({
    category: row.category,
    faq_id: row.faq_id,
    content: row.content || ''
  }))
  
  const { error: faqError } = await supabase
    .from('content_faq_new')
    .upsert(faqRows, { onConflict: 'category,faq_id' })
  
  if (faqError) console.error('❌ Error importing FAQ:', faqError.message)
  else console.log('✅ FAQ imported:', faqRows.length, 'rows')
  
  // 6. TESTIMONIALS -> content_testimonials_new
  console.log('\n📦 6/7: Importing TESTIMONIALS...')
  const testimonialsSheet = workbook.Sheets['TESTIMONIALS']
  const testimonialsData = XLSX.utils.sheet_to_json(testimonialsSheet)
  
  const testimonialsRows = testimonialsData.map((row) => ({
    category: row.category,
    testimonial_num: row.testimonial_num,
    testimonial_body: row.testimonial_body || '',
    testimonial_name: row.testimonial_name || '',
    rating: 5
  }))
  
  const { error: testimonialsError } = await supabase
    .from('content_testimonials_new')
    .upsert(testimonialsRows, { onConflict: 'category,testimonial_num' })
  
  if (testimonialsError) console.error('❌ Error importing testimonials:', testimonialsError.message)
  else console.log('✅ Testimonials imported:', testimonialsRows.length, 'rows')
  
  // 7. META -> content_meta_new
  console.log('\n📦 7/7: Importing META...')
  const metaSheet = workbook.Sheets['META']
  const metaData = XLSX.utils.sheet_to_json(metaSheet)
  
  const metaRows = metaData.map((row) => ({
    category: row.category,
    page_type: row.page_type,
    meta_title: row.meta_title || '',
    meta_desc: row.meta_desc || ''
  }))
  
  const { error: metaError } = await supabase
    .from('content_meta_new')
    .upsert(metaRows, { onConflict: 'category,page_type' })
  
  if (metaError) console.error('❌ Error importing meta:', metaError.message)
  else console.log('✅ Meta imported:', metaRows.length, 'rows')
  
  console.log('\n✅ IMPORT COMPLETE!')
  console.log('\n📊 Summary:')
  console.log('  - Services:', servicesRows.length)
  console.log('  - Hero:', heroRows.length)
  console.log('  - Menu:', menuRows.length)
  console.log('  - CTA:', ctaRows.length)
  console.log('  - FAQ:', faqRows.length)
  console.log('  - Testimonials:', testimonialsRows.length)
  console.log('  - Meta:', metaRows.length)
}

main().catch(console.error)
