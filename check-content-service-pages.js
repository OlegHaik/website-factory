#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('Checking content_service_pages structure...\n');

  const { data, error } = await supabase
    .from('content_service_pages')
    .select('*')
    .limit(3);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('Sample rows:');
  data.forEach((row, i) => {
    console.log(`\n--- Row ${i + 1} ---`);
    console.log(`service_slug: ${row.service_slug}`);
    console.log(`category: ${row.category}`);
    console.log(`service_title_spintax: ${(row.service_title_spintax || '').substring(0, 80)}...`);
    console.log(`hero_headline_spintax: ${(row.hero_headline_spintax || '').substring(0, 80)}...`);
    console.log(`service_description_spintax: ${(row.service_description_spintax || '').substring(0, 80)}...`);
  });

  // Check unique categories and service slugs
  const { data: all } = await supabase
    .from('content_service_pages')
    .select('service_slug, category');

  const categories = [...new Set(all.map(r => r.category))];
  const slugs = [...new Set(all.map(r => r.service_slug))];

  console.log('\n\n=== SUMMARY ===');
  console.log('Categories:', categories.join(', '));
  console.log('Service slugs:', slugs.join(', '));
}

main();
