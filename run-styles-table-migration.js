const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yxtdgkdwydmvzgbibrrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const sql = fs.readFileSync('MIGRATION_styles_table.sql', 'utf8');
  
  // Split by statements and execute one by one
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  console.log(`Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    console.log(`\nStatement ${i + 1}/${statements.length}:`);
    console.log(stmt.substring(0, 100) + '...');
    
    try {
      const { data, error } = await supabase.rpc('exec', { sql: stmt });
      if (error) {
        console.error(`Error on statement ${i + 1}:`, error.message);
        // Continue to next statement
      } else {
        console.log(`✓ Success`);
      }
    } catch (err) {
      console.error(`Exception on statement ${i + 1}:`, err.message);
    }
  }
  
  // Verify table was created
  const { data, error } = await supabase.from('styles').select('category').limit(1);
  if (error) {
    console.log('\n❌ Table verification failed:', error.message);
  } else {
    console.log('\n✓ Table verified successfully!');
    console.log('Sample data:', data);
  }
}

runMigration().catch(console.error);
