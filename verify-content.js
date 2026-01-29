/**
 * Verify actual content was imported
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('='.repeat(60));
  console.log('CONTENT VERIFICATION');
  console.log('='.repeat(60));

  // 1. Check content_service_area
  console.log('\n📄 content_service_area:');
  const { data: areas, count: areaCount } = await supabase
    .from('content_service_area')
    .select('*', { count: 'exact' });

  console.log(`  Total rows: ${areaCount}`);

  const hasContent = (areas || []).filter(r => r.headline_spintax && r.paragraph1_spintax);
  console.log(`  Rows with content: ${hasContent.length}`);

  if (hasContent.length > 0) {
    const sample = hasContent[0];
    console.log(`\n  Sample (${sample.category}):`);
    console.log(`    headline_spintax: ${(sample.headline_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    paragraph1_spintax: ${(sample.paragraph1_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    trust_points_spintax: ${(sample.trust_points_spintax || 'NULL').substring(0, 50)}...`);
  }

  // 2. Check content_service_pages has article content
  console.log('\n📄 content_service_pages (article content):');
  const { data: pages } = await supabase
    .from('content_service_pages')
    .select('*')
    .limit(3);

  const hasArticle = (pages || []).filter(r => r.section_headline_spintax && r.section_body_spintax);
  console.log(`  Sample rows with article content: ${hasArticle.length}/3`);

  if (hasArticle.length > 0) {
    const sample = hasArticle[0];
    console.log(`\n  Sample (${sample.category}:${sample.service_slug}):`);
    console.log(`    section_headline_spintax: ${(sample.section_headline_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    section_body_spintax: ${(sample.section_body_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    why_choose_headline_spintax: ${(sample.why_choose_headline_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    trust_points_spintax: ${(sample.trust_points_spintax || 'NULL').substring(0, 50)}...`);
    console.log(`    process_headline_spintax: ${(sample.process_headline_spintax || 'NULL').substring(0, 50)}...`);
  }

  // Check how many service pages have article content
  const { data: allPages } = await supabase
    .from('content_service_pages')
    .select('category, service_slug, section_headline_spintax, section_body_spintax');

  const withContent = (allPages || []).filter(p => p.section_headline_spintax);
  console.log(`\n  Total service pages: ${allPages?.length || 0}`);
  console.log(`  With article content: ${withContent.length}`);

  // 3. Check content_feedback
  console.log('\n📄 content_feedback:');
  const { count: fbCount } = await supabase
    .from('content_feedback')
    .select('*', { count: 'exact', head: true });

  console.log(`  Total rows: ${fbCount}`);

  // 4. Summary of all tables
  console.log('\n' + '='.repeat(60));
  console.log('FINAL STATUS');
  console.log('='.repeat(60));

  const tables = [
    { name: 'content_hero_new', expected: 16 },
    { name: 'content_header_new', expected: 16 },
    { name: 'content_cta_new', expected: 16 },
    { name: 'content_faq_new', expected: 192 },
    { name: 'content_testimonials_new', expected: 100 },
    { name: 'content_services_new', expected: 96 },
    { name: 'content_meta_new', expected: 176 },
    { name: 'content_service_pages', expected: 96 },
    { name: 'content_service_area', expected: 16 },
    { name: 'content_legal', expected: 32 },
    { name: 'content_home_article', expected: 146 },
    { name: 'content_feedback', expected: 64 }
  ];

  let allGood = true;
  for (const t of tables) {
    const { count } = await supabase
      .from(t.name)
      .select('*', { count: 'exact', head: true });

    const match = count === t.expected;
    const icon = match ? '✅' : '⚠️';
    console.log(`${icon} ${t.name}: ${count}/${t.expected}`);
    if (!match) allGood = false;
  }

  if (allGood) {
    console.log('\n✅ ВСІ ДАНІ ІМПОРТОВАНО УСПІШНО!');
  } else {
    console.log('\n⚠️ Деякі таблиці мають розбіжності');
  }
}

verify().catch(console.error);
