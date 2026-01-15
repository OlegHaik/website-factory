/**
 * Експортує всі дані з Supabase в XLSX файл
 * Використовуйте це для backup перед імпортом
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TABLES = [
  'content_hero',
  'content_header',
  'content_services',
  'content_cta',
  'content_seo_body',
  'content_faq',
  'content_testimonials',
  'content_service_pages',
  'content_service_area',
  'content_blocks',
  'content_meta',
  'content_legal',
  'content_questionnaire',
]

async function exportToXlsx() {
  console.log('📥 Exporting from Supabase...\n')
  
  const workbook = XLSX.utils.book_new()
  let totalRows = 0
  
  for (const table of TABLES) {
    console.log(`📊 Exporting ${table}...`)
    
    const { data, error } = await supabase.from(table).select('*')
    
    if (error) {
      console.warn(`   ⚠️  Could not export: ${error.message}`)
      continue
    }
    
    if (!data || data.length === 0) {
      console.log(`   ⏭️  Empty table, skipping`)
      continue
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, table)
    
    totalRows += data.length
    console.log(`   ✅ Exported ${data.length} rows`)
  }
  
  const filename = `supabase-export-${Date.now()}.xlsx`
  XLSX.writeFile(workbook, filename)
  
  console.log(`\n✅ Export complete!`)
  console.log(`   File: ${filename}`)
  console.log(`   Total rows: ${totalRows}`)
  console.log(`\n💡 Use this file for backup or to merge with new data`)
}

exportToXlsx().catch(err => {
  console.error('❌ Export failed:', err.message)
  process.exit(1)
})
