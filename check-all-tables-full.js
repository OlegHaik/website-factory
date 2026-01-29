const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

async function getAllTables() {
  // Отримуємо список всіх таблиць через SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
  });

  if (error) {
    // Якщо RPC не працює, спробуємо інший метод - перебираємо відомі таблиці
    console.log('Checking tables manually...\n');

    const possibleTables = [
      'sites', 'services', 'styles', 'config_styles', 'content_blocks',
      'content_hero_new', 'content_header_new', 'content_cta_new',
      'content_faq_new', 'content_testimonials_new', 'content_meta_new',
      'content_services_new', 'content_home_article', 'content_feedback',
      'content_legal', 'content_service_pages_elements', 'content_area_pages',
      'service_areas', 'site_service_areas', 'site_services',
      'content_types', 'pages', 'blocks', 'categories',
      'locations', 'settings', 'config', 'options', 'users',
      'domains', 'templates', 'layouts', 'widgets', 'menus',
      'navigation', 'seo', 'analytics', 'logs', 'cache',
      'content_hero', 'content_header', 'content_cta', 'content_faq',
      'content_testimonials', 'content_meta', 'content_services',
      'site_content', 'page_content', 'block_content',
      'theme_colors', 'theme_fonts', 'theme_settings',
      'business_info', 'contact_info', 'social_links',
      'images', 'media', 'files', 'uploads', 'assets',
      'forms', 'submissions', 'leads', 'contacts',
      'blog_posts', 'articles', 'news', 'announcements',
      'reviews', 'ratings', 'feedback', 'comments',
      'products', 'services_list', 'pricing', 'packages',
      'faqs', 'questions', 'answers', 'help',
      'tags', 'categories_list', 'taxonomies',
      'redirects', 'urls', 'slugs', 'permalinks',
      'translations', 'languages', 'locales',
      'permissions', 'roles', 'access', 'auth',
      'sessions', 'tokens', 'api_keys',
      'migrations', 'schema_versions', 'backups'
    ];

    const foundTables = [];

    for (const table of possibleTables) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (!error) {
        foundTables.push({ table, count: count || 0 });
      }
    }

    console.log('=== ALL TABLES IN ORIGINAL DATABASE ===\n');
    foundTables.sort((a, b) => b.count - a.count);
    foundTables.forEach(t => {
      console.log(`${t.table}: ${t.count} records`);
    });
    console.log('\nTotal tables found:', foundTables.length);

    // Список таблиць що в експорті
    const exportedTables = [
      'sites', 'services', 'styles', 'config_styles', 'content_blocks',
      'content_hero_new', 'content_header_new', 'content_cta_new',
      'content_faq_new', 'content_testimonials_new', 'content_meta_new',
      'content_services_new', 'content_home_article', 'content_feedback',
      'content_legal', 'content_service_pages_elements', 'content_area_pages'
    ];

    console.log('\n=== MISSING FROM EXPORT ===\n');
    foundTables.forEach(t => {
      if (!exportedTables.includes(t.table) && t.count > 0) {
        console.log(`⚠️  ${t.table}: ${t.count} records - NOT EXPORTED!`);
      }
    });
  }
}

getAllTables();
