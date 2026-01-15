const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabaseUrl = 'https://yxtdgkdwydmvzgbibrrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importServices() {
  const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
  const sheet = wb.Sheets['SERVICES_GRID'];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`Found ${data.length} services to import`);
  
  const services = data.map(row => ({
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    service_name_spin: row.service_name_spin,
    service_slug: row.service_slug,
    svc_grid_desc: row.svc_grid_desc
  }));
  
  // Delete existing data
  console.log('Deleting existing services...');
  await supabase.from('content_services_new').delete().neq('id', 0);
  
  // Insert in batches
  console.log('Inserting services...');
  const batchSize = 10;
  for (let i = 0; i < services.length; i += batchSize) {
    const batch = services.slice(i, i + batchSize);
    const { error } = await supabase.from('content_services_new').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i}-${i+batchSize}:`, error);
    } else {
      console.log(`✓ Inserted ${batch[0].category}/${batch[0].service_slug} ... ${batch[batch.length-1].category}/${batch[batch.length-1].service_slug}`);
    }
  }
  
  // Check results
  const { data: result, error } = await supabase
    .from('content_services_new')
    .select('category, count')
    .order('category');
  
  console.log('');
  console.log('Import complete!');
  
  const { count } = await supabase
    .from('content_services_new')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total services in database: ${count}`);
}

importServices();
