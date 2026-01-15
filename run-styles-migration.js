const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxtdgkdwydmvzgbibrrv.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('\n🔄 Running migration: Add styles and service area content\n')
  
  const sql = fs.readFileSync('MIGRATION_add_styles_and_service_area.sql', 'utf8')
  
  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';'
    console.log(`\nExecuting statement ${i + 1}/${statements.length}...`)
    console.log(stmt.substring(0, 100) + '...')
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: stmt })
    
    if (error) {
      console.error(`❌ Error: ${error.message}`)
      // Try direct approach
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: stmt })
      })
      
      if (!response.ok) {
        const text = await response.text()
        console.error(`Failed: ${text}`)
      } else {
        console.log('✓ Success (direct)')
      }
    } else {
      console.log('✓ Success')
    }
  }
  
  // Verify the changes
  console.log('\n📊 Verifying changes...\n')
  
  // Check if columns were added to sites
  const { data: sitesData, error: sitesError } = await supabase
    .from('sites')
    .select('id, category, heading_font, body_font')
    .limit(3)
  
  if (!sitesError && sitesData) {
    console.log('✓ Sites table has font columns:')
    sitesData.forEach(s => {
      console.log(`  - ${s.category}: ${s.heading_font} / ${s.body_font}`)
    })
  } else {
    console.log('❌ Could not verify sites table:', sitesError?.message)
  }
  
  // Check service area rows
  const { data: saData, error: saError, count } = await supabase
    .from('content_service_area')
    .select('*', { count: 'exact', head: true })
  
  if (!saError) {
    console.log(`\n✓ content_service_area now has ${count} rows`)
  } else {
    console.log('❌ Could not count service area rows:', saError.message)
  }
  
  // Check category_styles table
  const { data: stylesData, error: stylesError, count: stylesCount } = await supabase
    .from('category_styles')
    .select('*', { count: 'exact' })
  
  if (!stylesError) {
    console.log(`\n✓ category_styles table created with ${stylesCount} rows`)
    if (stylesData && stylesData.length > 0) {
      console.log('\nSample styles:')
      stylesData.slice(0, 3).forEach(s => {
        console.log(`  - ${s.category}: ${s.heading_font} / ${s.body_font} (${s.primary_color})`)
      })
    }
  } else {
    console.log('❌ Could not verify category_styles:', stylesError.message)
  }
  
  console.log('\n✅ Migration completed!\n')
}

runMigration().catch(console.error)
