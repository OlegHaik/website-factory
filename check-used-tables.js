const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

// Таблиці що використовуються в коді
const usedTables = [
  'content_meta',          // без _new, використовується в fetch-content.ts
  'content_service_pages', // без _new
  'content_service_area',  // без _new
  'content_questionnaire', // без _new
  'content_seo_body',      // без _new
  'content_hero',          // без _new (legacy?)
  'content_header',        // без _new (legacy?)
  'content_cta',           // без _new (legacy?)
  'content_faq',           // без _new (legacy?)
  'content_testimonials',  // без _new (legacy?)
  'content_services',      // без _new (legacy?)
];

async function check() {
  console.log('=== TABLES USED IN CODE (without _new) ===\n');

  for (const table of usedTables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (!error) {
      console.log(`${table}: ${count || 0} records`);
    } else {
      console.log(`${table}: NOT FOUND`);
    }
  }
}

check();
