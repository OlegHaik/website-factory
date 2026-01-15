const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
)

async function executeSQL() {
  const sql = fs.readFileSync('RESTORE_DATABASE_COMPLETE.sql', 'utf8')
  
  // Split by semicolon but keep multi-line statements together
  const queries = sql
    .split(';')
    .map(q => q.trim())
    .filter(q => q && !q.startsWith('--') && q.length > 10)
  
  console.log(`Found ${queries.length} queries to execute\n`)
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    console.log(`[${i + 1}/${queries.length}] Executing...`)
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: query })
    
    if (error) {
      console.error(`ERROR: ${error.message}\n`)
    } else {
      console.log('✓ Success\n')
      if (data && Array.isArray(data) && data.length > 0) {
        console.table(data.slice(0, 10))
      }
    }
  }
  
  console.log('\n=== Database Restoration Complete ===')
}

executeSQL().catch(console.error)
