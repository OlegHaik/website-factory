const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://yxtdgkdwydmvzgbibrrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    const sql = fs.readFileSync('MIGRATION_service_pages.sql', 'utf8');
    
    console.log('Running service pages migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
      console.error('Migration error:', error);
      return;
    }
    
    console.log('Migration completed successfully');
    
    // Check results
    const { data: rows } = await supabase
      .from('content_service_pages')
      .select('category, service_slug')
      .order('category')
      .order('service_slug');
    
    console.log('\nService pages created:');
    rows.forEach(r => console.log(`  ${r.category}: ${r.service_slug}`));
    
  } catch (err) {
    console.error('Error:', err);
  }
}

runMigration();
