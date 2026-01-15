require('dotenv').config({ path: '.env.local' });
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const tables = [
    'content_hero', 
    'content_header',
    'content_faq',
    'content_testimonials',
    'content_service_pages',
    'content_service_area'
  ];
  
  for (const table of tables) {
    const {data, error} = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      console.log(`\n❌ ${table}: ${error.message}`);
      continue;
    }
    
    if (data && data[0]) {
      console.log(`\n✅ ${table} колонки:`);
      console.log(`   ${Object.keys(data[0]).join(', ')}`);
    } else {
      console.log(`\n⚠️  ${table}: порожня`);
    }
  }
})();
