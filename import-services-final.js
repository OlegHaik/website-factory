const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const CATEGORY_MAP = {
  'WATER DAMAGE': 'water_damage',
  'ROOFING': 'roofing',
  'MOLD REMEDIATION': 'mold_remediation',
  'ADU BUILDER': 'adu_builder',
  'AIR CONDITIONING': 'air_conditioning',
  'AIR DUCT': 'air_duct',
  'BATHROOM REMODEL': 'bathroom_remodel',
  'CHIMNEY': 'chimney',
  'GARAGE DOOR': 'garage_door',
  'HEATING': 'heating',
  'KITCHEN REMODEL': 'kitchen_remodel',
  'LOCKSMITH': 'locksmith',
  'PEST CONTROL': 'pest_control',
  'PLUMBING': 'plumbing',
  'POOL CONTRACTOR': 'pool_contractor'
}

function slugify(text) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

async function importServices() {
  console.log('📖 Reading XLSX file...')
  const workbook = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx')
  
  const sheet = workbook.Sheets['SERVICES_GRID']
  if (!sheet) {
    console.error('❌ Sheet "SERVICES_GRID" not found')
    return
  }
  
  const rows = XLSX.utils.sheet_to_json(sheet)
  console.log(`Found ${rows.length} service rows`)
  
  const services = rows.map(row => ({
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    service_name_spin: row.service_name_spin,
    service_slug: row.service_slug,
    svc_grid_desc: row.svc_grid_desc
  }))
  
  console.log(`\n✅ Parsed ${services.length} services`)
  
  // Show sample
  console.log('\n📋 Sample services:')
  services.slice(0, 3).forEach(s => {
    console.log(`  ${s.category} / ${s.service_id}: ${s.service_name} (${s.service_slug})`)
  })
  
  // Insert into database
  console.log('\n💾 Inserting into content_services_new...')
  
  // First check if table exists
  const { data: existing, error: checkError } = await supabase
    .from('content_services_new')
    .select('id')
    .limit(1)
  
  if (checkError && checkError.code === 'PGRST205') {
    console.error('\n❌ Table content_services_new does not exist!')
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:')
    console.log('--' + '-'.repeat(60))
    console.log(`
DROP TABLE IF EXISTS content_services_new CASCADE;

CREATE TABLE content_services_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_name_spin TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  svc_grid_desc TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_content_services_new_category ON content_services_new(category);
CREATE INDEX idx_content_services_new_service_id ON content_services_new(category, service_id);
CREATE INDEX idx_content_services_new_slug ON content_services_new(category, service_slug);

ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on content_services_new"
  ON content_services_new FOR SELECT USING (true);
`)
    console.log('--' + '-'.repeat(60))
    console.log('\n⏳ After creating the table, run this script again.')
    return
  }
  
  // Delete existing
  const { error: deleteError } = await supabase
    .from('content_services_new')
    .delete()
    .neq('id', 0)
  
  if (deleteError) {
    console.error('❌ Error deleting existing data:', deleteError)
  }
  
  // Insert in batches of 100
  const batchSize = 100
  for (let i = 0; i < services.length; i += batchSize) {
    const batch = services.slice(i, i + batchSize)
    const { error } = await supabase
      .from('content_services_new')
      .insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
      return
    }
    
    console.log(`  ✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(services.length / batchSize)}`)
  }
  
  console.log(`\n🎉 Successfully imported ${services.length} services!`)
  
  // Verify
  const { data: count } = await supabase
    .from('content_services_new')
    .select('category', { count: 'exact', head: true })
  
  console.log(`\n✅ Total rows in database: ${count}`)
}

importServices().catch(console.error)
