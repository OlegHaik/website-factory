#!/usr/bin/env node
/**
 * Check current state of Supabase database
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable(tableName) {
  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: false })
    .limit(3);

  if (error) {
    return { exists: false, error: error.message };
  }

  return {
    exists: true,
    count: count || data?.length || 0,
    sample: data?.slice(0, 2),
    columns: data?.length > 0 ? Object.keys(data[0]) : []
  };
}

async function main() {
  console.log('🔍 Checking Supabase Database State');
  console.log('═'.repeat(80));
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('');

  const tables = [
    // Content tables (_new suffix)
    'content_hero_new',
    'content_header_new',
    'content_services_new',
    'content_cta_new',
    'content_faq_new',
    'content_testimonials_new',
    'content_meta_new',
    'content_service_area',
    // Service tables
    'service_pages',
    'services',
    'content_service_pages',
    // Core tables
    'sites',
    'styles',
    'content_blocks',
    // Other
    'content_questionnaire',
    'links'
  ];

  for (const table of tables) {
    const result = await checkTable(table);

    if (result.exists) {
      console.log(`✅ ${table}`);
      console.log(`   Rows: ${result.count}`);
      console.log(`   Columns: ${result.columns.join(', ')}`);
      if (result.sample && result.sample.length > 0) {
        // Show key field samples
        const first = result.sample[0];
        const keyFields = ['category_key', 'category', 'slug', 'service_key', 'page_type', 'domain_url'];
        const shownFields = keyFields.filter(f => first[f]);
        if (shownFields.length > 0) {
          console.log(`   Sample: ${shownFields.map(f => `${f}="${first[f]}"`).join(', ')}`);
        }
      }
    } else {
      console.log(`❌ ${table}`);
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }

  // Check sites in more detail
  console.log('─'.repeat(80));
  console.log('📍 SITES DETAIL:');
  const { data: sites, error: sitesErr } = await supabase
    .from('sites')
    .select('domain_url, business_name, city, state, category')
    .limit(10);

  if (sitesErr) {
    console.log('Error fetching sites:', sitesErr.message);
  } else {
    sites?.forEach(site => {
      console.log(`   ${site.domain_url} | ${site.business_name} | ${site.city}, ${site.state} | ${site.category}`);
    });
  }

  console.log('\n' + '═'.repeat(80));
  console.log('✅ Database check complete');
}

main().catch(console.error);
