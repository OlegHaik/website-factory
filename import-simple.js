/**
 * Simplified XLSX to Supabase Importer
 * 
 * Простіша версія для швидкого імпорту без складних налаштувань.
 * Підходить коли структура XLSX точно відповідає структурі таблиць.
 */

const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

// Setup Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Читаємо файл
const workbook = XLSX.readFile(process.argv[2] || 'content.xlsx')

// Функція для імпорту одного sheet
async function importSheet(sheetName, tableName) {
  console.log(`\n📊 Importing ${sheetName} → ${tableName}...`)
  
  const worksheet = workbook.Sheets[sheetName]
  if (!worksheet) {
    console.log(`⏭️  Sheet "${sheetName}" not found, skipping`)
    return
  }
  
  const rows = XLSX.utils.sheet_to_json(worksheet)
  console.log(`   Found ${rows.length} rows`)
  
  if (rows.length === 0) {
    console.log(`   ⏭️  Empty sheet, skipping`)
    return
  }
  
  // Вставляємо по одному ряду (для debugging)
  let success = 0
  let failed = 0
  
  for (const row of rows) {
    const { error } = await supabase.from(tableName).insert(row)
    
    if (error) {
      console.log(`   ❌ Row failed:`, row.id || 'unknown', error.message)
      failed++
    } else {
      success++
    }
  }
  
  console.log(`   ✅ Success: ${success}, ❌ Failed: ${failed}`)
}

// Запускаємо імпорт
async function main() {
  console.log('🚀 Simple XLSX Importer\n')
  
  // Список sheets для імпорту (назва sheet = назва таблиці)
  const tables = [
    'content_header',
    'content_hero',
    'content_services',
    'content_cta',
    'content_seo_body',
    'content_faq',
    'content_testimonials',
    'content_service_pages',
    'content_service_area',
    'content_meta',
    'content_legal',
    'content_blocks',
  ]
  
  for (const table of tables) {
    await importSheet(table, table)
  }
  
  console.log('\n✅ Import complete!')
}

main().catch(console.error)
