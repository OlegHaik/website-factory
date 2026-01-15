/**
 * Перевіряє стан таблиць у Supabase
 * Показує скільки rows та максимальний ID
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

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
]

async function checkTables() {
  console.log('📊 Checking Supabase tables...\n')
  console.log('Table'.padEnd(30) + 'Rows'.padEnd(12) + 'Max ID')
  console.log('-'.repeat(60))
  
  let totalRows = 0
  let emptyTables = []
  let nonEmptyTables = []
  
  for (const table of TABLES) {
    try {
      // Get count
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.log(`${table.padEnd(30)}❌ Error: ${countError.message}`)
        continue
      }
      
      const rowCount = count || 0
      totalRows += rowCount
      
      if (rowCount === 0) {
        emptyTables.push(table)
        console.log(`${table.padEnd(30)}✅ Empty`.padEnd(12))
      } else {
        nonEmptyTables.push(table)
        
        // Get max ID
        const { data, error: maxError } = await supabase
          .from(table)
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
        
        const maxId = data?.[0]?.id || 'N/A'
        
        console.log(
          `${table.padEnd(30)}⚠️  ${rowCount} rows`.padEnd(12) + 
          `   Max ID: ${maxId}`
        )
      }
    } catch (err) {
      console.log(`${table.padEnd(30)}❌ Exception: ${err.message}`)
    }
  }
  
  console.log('-'.repeat(60))
  console.log(`\n📈 Summary:`)
  console.log(`   Total rows across all tables: ${totalRows}`)
  console.log(`   Empty tables: ${emptyTables.length}`)
  console.log(`   Non-empty tables: ${nonEmptyTables.length}`)
  
  if (emptyTables.length > 0) {
    console.log(`\n✅ Empty tables (safe to import):`)
    emptyTables.forEach(t => console.log(`   - ${t}`))
  }
  
  if (nonEmptyTables.length > 0) {
    console.log(`\n⚠️  Non-empty tables (may have conflicts):`)
    nonEmptyTables.forEach(t => console.log(`   - ${t}`))
    console.log(`\n💡 Recommendations:`)
    console.log(`   1. Export existing data: node export-from-supabase.js`)
    console.log(`   2. Use --upsert mode to update existing records`)
    console.log(`   3. Or use --clear to replace all data (after backup!)`)
  }
}

checkTables().catch(err => {
  console.error('❌ Check failed:', err.message)
  process.exit(1)
})
