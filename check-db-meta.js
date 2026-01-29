const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('content_meta_new')
    .select('category, page_type, service_id, meta_title, meta_desc')
    .order('category')
    .order('page_type');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== content_meta_new in DB ===');
  console.log('Total rows:', data.length);

  // Group by category and page_type
  const byCat = {};
  for (const row of data) {
    const cat = row.category || 'unknown';
    const pt = row.page_type || 'unknown';
    const key = cat + '|' + pt;
    if (!byCat[key]) byCat[key] = 0;
    byCat[key]++;
  }

  console.log('\nBy category|page_type:');
  for (const key of Object.keys(byCat).sort()) {
    console.log('  ' + key + ': ' + byCat[key]);
  }

  // Show sample for each page_type per category
  console.log('\n=== Sample Meta by page_type ===');
  const seen = new Set();
  for (const row of data) {
    const key = row.category + '|' + row.page_type;
    if (!seen.has(key)) {
      seen.add(key);
      console.log(key + ':');
      console.log('  service_id:', row.service_id || 'null');
      console.log('  meta_title:', (row.meta_title || '').substring(0, 70));
      console.log('  meta_desc:', (row.meta_desc || '').substring(0, 70));
    }
  }
}

check();
