/**
 * Check database structure
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStructure() {
  // Check content_service_pages structure
  console.log('='.repeat(60));
  console.log('content_service_pages sample:');
  console.log('='.repeat(60));

  const { data: servicePages, error: sp_err } = await supabase
    .from('content_service_pages')
    .select('*')
    .eq('category', 'water_damage')
    .limit(3);

  if (sp_err) {
    console.log('ERROR:', sp_err.message);
  } else {
    console.log('Columns:', Object.keys(servicePages[0] || {}).join(', '));
    for (const row of servicePages) {
      console.log(`\n  service_slug: ${row.service_slug}`);
      console.log(`  service_title_spintax: ${(row.service_title_spintax || '').substring(0, 60)}...`);
    }
  }

  // Check content_services_new
  console.log('\n' + '='.repeat(60));
  console.log('content_services_new:');
  console.log('='.repeat(60));

  const { data: servicesNew, error: sn_err } = await supabase
    .from('content_services_new')
    .select('*')
    .eq('category', 'water_damage')
    .limit(3);

  if (sn_err) {
    console.log('ERROR:', sn_err.message);
  } else if (servicesNew.length === 0) {
    console.log('Table is EMPTY');
  } else {
    console.log('Columns:', Object.keys(servicesNew[0] || {}).join(', '));
    for (const row of servicesNew) {
      console.log(`\n  Row:`, JSON.stringify(row).substring(0, 200));
    }
  }

  // Check content_service_area
  console.log('\n' + '='.repeat(60));
  console.log('content_service_area sample:');
  console.log('='.repeat(60));

  const { data: serviceArea, error: sa_err } = await supabase
    .from('content_service_area')
    .select('*')
    .eq('category', 'water_damage')
    .maybeSingle();

  if (sa_err) {
    console.log('ERROR:', sa_err.message);
  } else if (!serviceArea) {
    console.log('Table is EMPTY or no water_damage category');
  } else {
    console.log('Columns:', Object.keys(serviceArea).join(', '));
    console.log('Has paragraph1_spintax:', !!serviceArea.paragraph1_spintax);
    console.log('Has headline_spintax:', !!serviceArea.headline_spintax);
  }

  // Check content_header_new
  console.log('\n' + '='.repeat(60));
  console.log('content_header_new sample:');
  console.log('='.repeat(60));

  const { data: header, error: h_err } = await supabase
    .from('content_header_new')
    .select('*')
    .eq('category', 'water_damage')
    .maybeSingle();

  if (h_err) {
    console.log('ERROR:', h_err.message);
  } else if (!header) {
    console.log('No data');
  } else {
    console.log('Columns:', Object.keys(header).join(', '));
    console.log('Sample:', JSON.stringify(header).substring(0, 300));
  }

  // Count all tables
  console.log('\n' + '='.repeat(60));
  console.log('ROW COUNTS:');
  console.log('='.repeat(60));

  const tables = [
    'content_hero_new',
    'content_header_new',
    'content_cta_new',
    'content_faq_new',
    'content_testimonials_new',
    'content_services_new',
    'content_meta_new',
    'content_service_pages',
    'content_service_area',
    'content_legal',
    'content_home_article',
    'content_questionnaire',
    'content_feedback'
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`${table}: ERROR - ${error.message}`);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }
}

checkStructure().catch(console.error);
