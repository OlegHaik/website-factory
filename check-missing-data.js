/**
 * Check what data is missing
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const XLSX_PATH = './MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx';
const workbook = XLSX.readFile(XLSX_PATH);

async function checkMissing() {
  // 1. Check content_services_new vs SERVICES_GRID
  console.log('='.repeat(60));
  console.log('1. content_services_new vs SERVICES_GRID');
  console.log('='.repeat(60));

  const gridSheet = workbook.Sheets['SERVICES_GRID'];
  const gridData = XLSX.utils.sheet_to_json(gridSheet, { defval: '' });

  const { data: servicesDb } = await supabase
    .from('content_services_new')
    .select('category, service_slug');

  const xlsxSlugs = new Set(gridData.map(r => `${r.category}:${r.service_slug}`));
  const dbSlugs = new Set((servicesDb || []).map(r => `${r.category}:${r.service_slug}`));

  console.log(`XLSX services: ${xlsxSlugs.size}`);
  console.log(`DB services: ${dbSlugs.size}`);

  const missingInDb = [...xlsxSlugs].filter(s => !dbSlugs.has(s));
  if (missingInDb.length > 0) {
    console.log('Missing in DB:', missingInDb.slice(0, 10).join(', '), missingInDb.length > 10 ? '...' : '');
  } else {
    console.log('✅ All SERVICES_GRID items are in content_services_new');
  }

  // 2. Check content_service_area vs AREA_PAGES
  console.log('\n' + '='.repeat(60));
  console.log('2. content_service_area - which categories are missing');
  console.log('='.repeat(60));

  const areaSheet = workbook.Sheets['AREA_PAGES'];
  const areaData = XLSX.utils.sheet_to_json(areaSheet, { defval: '' });

  const xlsxCategories = new Set(areaData.map(r => r.category));

  const { data: areaDb } = await supabase
    .from('content_service_area')
    .select('category');

  const dbCategories = new Set((areaDb || []).map(r => r.category));

  console.log(`XLSX categories: ${[...xlsxCategories].sort().join(', ')}`);
  console.log(`DB categories: ${[...dbCategories].sort().join(', ')}`);

  const missingCategories = [...xlsxCategories].filter(c => !dbCategories.has(c));
  console.log(`Missing categories in DB: ${missingCategories.join(', ') || 'none'}`);

  // 3. Check content_service_pages vs SERVICE_PAGES
  console.log('\n' + '='.repeat(60));
  console.log('3. content_service_pages - article content storage');
  console.log('='.repeat(60));

  const spSheet = workbook.Sheets['SERVICE_PAGES'];
  const spData = XLSX.utils.sheet_to_json(spSheet, { defval: '' });

  // Group by service
  const byService = {};
  for (const row of spData) {
    const key = `${row.category}:${row.service_id}`;
    if (!byService[key]) {
      byService[key] = { service_name: row.service_name, elements: [] };
    }
    byService[key].elements.push({
      order: row.element_order,
      type: row.element_type,
      content: row.content
    });
  }

  console.log(`Total services in xlsx: ${Object.keys(byService).length}`);
  console.log(`Elements per service: ${Object.values(byService)[0]?.elements.length || 0}`);

  // Check if DB has article content columns
  const { data: spSample } = await supabase
    .from('content_service_pages')
    .select('*')
    .eq('category', 'water_damage')
    .eq('service_slug', 'water-restoration')
    .maybeSingle();

  if (spSample) {
    console.log('\nDB sample for water_damage:water-restoration:');
    console.log(`  section_headline_spintax: ${(spSample.section_headline_spintax || 'NULL').substring(0, 50)}`);
    console.log(`  section_body_spintax: ${(spSample.section_body_spintax || 'NULL').substring(0, 50)}`);
    console.log(`  why_choose_headline_spintax: ${(spSample.why_choose_headline_spintax || 'NULL').substring(0, 50)}`);
    console.log(`  why_choose_body_spintax: ${(spSample.why_choose_body_spintax || 'NULL').substring(0, 50)}`);
    console.log(`  trust_points_spintax: ${(spSample.trust_points_spintax || 'NULL').substring(0, 50)}`);
  }

  // Compare xlsx element structure with DB columns
  console.log('\nXLSX element structure for water_damage:1a:');
  const wdService = byService['water_damage:1a'];
  if (wdService) {
    for (const el of wdService.elements) {
      console.log(`  ${el.order}. ${el.type}: ${el.content.substring(0, 50)}...`);
    }
  }

  // 4. Check content_feedback
  console.log('\n' + '='.repeat(60));
  console.log('4. content_feedback (0 rows in DB)');
  console.log('='.repeat(60));

  const fbSheet = workbook.Sheets['FEEDBACK'];
  const fbData = XLSX.utils.sheet_to_json(fbSheet, { defval: '' });

  console.log(`XLSX FEEDBACK rows: ${fbData.length}`);
  console.log('Sample:');
  for (const row of fbData.slice(0, 4)) {
    console.log(`  ${row.category} order=${row.element_order} type=${row.element_type}`);
  }
}

checkMissing().catch(console.error);
