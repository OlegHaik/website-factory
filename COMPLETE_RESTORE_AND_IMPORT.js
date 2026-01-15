require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
)

// Step 1: Create all tables
async function createTables() {
  console.log('=== Creating Tables ===\n')
  
  const tables = [
    {
      name: 'styles',
      sql: `CREATE TABLE IF NOT EXISTS styles (
        id SERIAL PRIMARY KEY,
        category TEXT UNIQUE NOT NULL,
        primary_color TEXT NOT NULL DEFAULT '#0066cc',
        secondary_color TEXT NOT NULL DEFAULT '#004080',
        accent_color TEXT NOT NULL DEFAULT '#ff6600',
        font_heading TEXT NOT NULL DEFAULT 'Inter',
        font_body TEXT NOT NULL DEFAULT 'Inter',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`
    },
    {
      name: 'content_hero_new',
      sql: `CREATE TABLE IF NOT EXISTS content_hero_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        heading_spintax TEXT NOT NULL,
        subheading_spintax TEXT,
        cta_text_spintax TEXT,
        cta_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category_key)
      )`
    },
    {
      name: 'content_header_new',
      sql: `CREATE TABLE IF NOT EXISTS content_header_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        logo_text_spintax TEXT,
        tagline_spintax TEXT,
        phone_display_spintax TEXT,
        cta_text_spintax TEXT,
        nav_home_spintax TEXT,
        nav_services_spintax TEXT,
        nav_about_spintax TEXT,
        nav_contact_spintax TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category_key)
      )`
    },
    {
      name: 'content_services_new',
      sql: `CREATE TABLE IF NOT EXISTS content_services_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        service_key TEXT NOT NULL,
        title_spintax TEXT NOT NULL,
        description_spintax TEXT NOT NULL,
        icon TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category_key, service_key)
      )`
    },
    {
      name: 'content_testimonials_new',
      sql: `CREATE TABLE IF NOT EXISTS content_testimonials_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        name TEXT NOT NULL,
        location_spintax TEXT NOT NULL,
        text_spintax TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`
    },
    {
      name: 'content_faq_new',
      sql: `CREATE TABLE IF NOT EXISTS content_faq_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        question_spintax TEXT NOT NULL,
        answer_spintax TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`
    },
    {
      name: 'content_cta_new',
      sql: `CREATE TABLE IF NOT EXISTS content_cta_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        heading_spintax TEXT NOT NULL,
        subheading_spintax TEXT,
        button_text_spintax TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category_key)
      )`
    },
    {
      name: 'content_meta_new',
      sql: `CREATE TABLE IF NOT EXISTS content_meta_new (
        id SERIAL PRIMARY KEY,
        category_key TEXT NOT NULL,
        page_type TEXT NOT NULL,
        meta_title_spintax TEXT NOT NULL,
        meta_description_spintax TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category_key, page_type)
      )`
    },
    {
      name: 'service_pages',
      sql: `CREATE TABLE IF NOT EXISTS service_pages (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        service_key TEXT NOT NULL,
        title_spintax TEXT NOT NULL,
        description_spintax TEXT NOT NULL,
        meta_title_spintax TEXT,
        meta_description_spintax TEXT,
        body_spintax TEXT,
        icon TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`
    },
    {
      name: 'services',
      sql: `CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name_spintax TEXT NOT NULL,
        description_spintax TEXT NOT NULL,
        category TEXT NOT NULL,
        service_key TEXT NOT NULL,
        icon TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(category, service_key)
      )`
    }
  ]
  
  for (const table of tables) {
    const { error } = await supabase.from(table.name).select('id', { count: 'exact', head: true })
    if (error && error.message.includes('does not exist')) {
      console.log(`Creating table: ${table.name}...`)
      // This would need admin SQL access to create tables
      // For now, run the SQL manually in Supabase dashboard
      console.log('⚠️ Please run this SQL in Supabase SQL Editor:')
      console.log(table.sql)
      console.log('---')
    } else {
      console.log(`✓ Table exists: ${table.name}`)
    }
  }
}

// Step 2: Import data from XLSX
async function importFromXLSX() {
  console.log('\n=== Importing Data from XLSX ===\n')
  
  const workbook = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx')
  console.log('Sheets found:', workbook.SheetNames)
  
  // Map sheets to tables
  const sheetMapping = {
    'Hero': 'content_hero_new',
    'Header': 'content_header_new',
    'Services': 'content_services_new',
    'Testimonials': 'content_testimonials_new',
    'FAQ': 'content_faq_new',
    'CTA': 'content_cta_new',
    'Meta': 'content_meta_new'
  }
  
  for (const [sheetName, tableName] of Object.entries(sheetMapping)) {
    if (!workbook.SheetNames.includes(sheetName)) {
      console.log(`⚠️ Sheet "${sheetName}" not found`)
      continue
    }
    
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet)
    
    console.log(`\nImporting ${data.length} rows from "${sheetName}" to ${tableName}...`)
    
    if (data.length === 0) {
      console.log('⚠️ No data to import')
      continue
    }
    
    // Show sample data structure
    console.log('Sample row:', JSON.stringify(data[0], null, 2).substring(0, 200))
    
    // Insert data in batches
    const batchSize = 50
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const { error } = await supabase.from(tableName).upsert(batch, { onConflict: 'category_key' })
      
      if (error) {
        console.error(`Error importing batch ${i}-${i + batch.length}:`, error.message)
      } else {
        console.log(`✓ Imported rows ${i + 1}-${Math.min(i + batchSize, data.length)}`)
      }
    }
  }
  
  // Insert category styles
  console.log('\n=== Inserting Category Styles ===\n')
  const styles = [
    { category: 'water_damage', primary_color: '#0066cc', secondary_color: '#004080', accent_color: '#00a8ff', font_heading: 'Inter', font_body: 'Inter' },
    { category: 'fire_damage', primary_color: '#dc2626', secondary_color: '#991b1b', accent_color: '#ff6b6b', font_heading: 'Inter', font_body: 'Inter' },
    { category: 'mold_remediation', primary_color: '#16a34a', secondary_color: '#15803d', accent_color: '#4ade80', font_heading: 'Inter', font_body: 'Inter' },
    { category: 'biohazard', primary_color: '#9333ea', secondary_color: '#7e22ce', accent_color: '#c084fc', font_heading: 'Inter', font_body: 'Inter' },
    { category: 'storm_damage', primary_color: '#ea580c', secondary_color: '#c2410c', accent_color: '#fb923c', font_heading: 'Inter', font_body: 'Inter' },
    { category: 'reconstruction', primary_color: '#0891b2', secondary_color: '#0e7490', accent_color: '#22d3ee', font_heading: 'Inter', font_body: 'Inter' }
  ]
  
  const { error: stylesError } = await supabase.from('styles').upsert(styles, { onConflict: 'category' })
  if (stylesError) {
    console.error('Error inserting styles:', stylesError.message)
  } else {
    console.log('✓ Styles inserted')
  }
  
  console.log('\n=== Import Complete ===')
}

async function main() {
  await createTables()
  await importFromXLSX()
}

main().catch(console.error)
