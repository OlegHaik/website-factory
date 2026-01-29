const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase
    .from('content_meta_new')
    .select('page_type, service_id, meta_title, meta_desc')
    .eq('category', 'water_damage');

  console.log('=== content_meta_new (water_damage) ===');
  console.log('Total rows:', data?.length || 0);

  const byType = {};
  for (const row of data || []) {
    const pt = row.page_type;
    if (!byType[pt]) byType[pt] = [];
    byType[pt].push(row);
  }

  for (const pt of Object.keys(byType).sort()) {
    const rows = byType[pt];
    console.log('\n' + pt + ': ' + rows.length + ' rows');
    const sample = rows[0];
    console.log('  service_id:', sample.service_id || 'null');
    console.log('  meta_title:', (sample.meta_title || '').substring(0, 70));
    console.log('  meta_desc:', (sample.meta_desc || '').substring(0, 70));
  }
}

check();
