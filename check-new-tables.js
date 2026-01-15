const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

async function checkTables() {
  const tables = [
    'content_hero_new',
    'content_header_new',
    'content_cta_new',
    'content_faq_new',
    'content_testimonials_new',
    'content_services_new',
    'content_meta_new'
  ];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`NOT FOUND: ${table}`);
    } else {
      console.log(`EXISTS: ${table}`);
    }
  }
}
checkTables();
