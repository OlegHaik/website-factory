const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

async function check() {
  console.log('=== content_services_new ===');
  const { data: services } = await supabase.from('content_services_new').select('category, service_slug, service_name').order('category').order('service_slug');
  const byCategory = {};
  (services || []).forEach(s => {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s.service_slug);
  });
  Object.keys(byCategory).forEach(cat => {
    console.log(`${cat}: (${byCategory[cat].length})`);
    byCategory[cat].slice(0, 3).forEach(slug => console.log(`  - ${slug}`));
    if (byCategory[cat].length > 3) console.log(`  ... and ${byCategory[cat].length - 3} more`);
  });
  
  console.log('\n=== content_service_pages ===');
  const { data: pages } = await supabase.from('content_service_pages').select('category, service_slug').order('category').order('service_slug');
  const byCategory2 = {};
  (pages || []).forEach(s => {
    if (!byCategory2[s.category]) byCategory2[s.category] = [];
    byCategory2[s.category].push(s.service_slug);
  });
  Object.keys(byCategory2).forEach(cat => {
    console.log(`${cat}: (${byCategory2[cat].length})`);
    byCategory2[cat].slice(0, 3).forEach(slug => console.log(`  - ${slug}`));
    if (byCategory2[cat].length > 3) console.log(`  ... and ${byCategory2[cat].length - 3} more`);
  });
}
check();
