const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

const tables = [
  'sites', 'services', 'styles', 'config_styles',
  'content_hero_new', 'content_header_new', 'content_cta_new',
  'content_faq_new', 'content_testimonials_new', 'content_meta_new',
  'content_services_new', 'content_home_article', 'content_feedback',
  'content_legal', 'content_service_pages_elements', 'content_area_pages',
  'service_areas', 'site_service_areas', 'site_services',
  'content_blocks', 'content_types', 'pages', 'blocks',
  'colors', 'themes', 'fonts', 'images', 'media', 'categories',
  'locations', 'settings', 'config', 'options'
];

async function check() {
  console.log('Checking all tables in original Supabase...\n');

  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (!error && count > 0) {
      console.log(`${t}: ${count} records`);
    }
  }
}

check();
