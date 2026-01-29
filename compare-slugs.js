/**
 * Compare service slugs between xlsx and DB
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

async function compareSlslugs() {
  const gridSheet = workbook.Sheets['SERVICES_GRID'];
  const gridData = XLSX.utils.sheet_to_json(gridSheet, { defval: '' });

  const { data: servicesDb } = await supabase
    .from('content_services_new')
    .select('category, service_slug, service_name')
    .eq('category', 'water_damage');

  console.log('='.repeat(60));
  console.log('WATER_DAMAGE slugs comparison');
  console.log('='.repeat(60));

  console.log('\nXLSX SERVICES_GRID:');
  const xlsxWD = gridData.filter(r => r.category === 'water_damage');
  for (const row of xlsxWD) {
    console.log(`  ${row.service_id}: ${row.service_slug} - "${row.service_name}"`);
  }

  console.log('\nDB content_services_new:');
  for (const row of servicesDb || []) {
    console.log(`  ${row.service_slug} - "${row.service_name}"`);
  }

  // Check content_service_pages slugs
  const { data: pagesDb } = await supabase
    .from('content_service_pages')
    .select('category, service_slug, service_title_spintax')
    .eq('category', 'water_damage');

  console.log('\nDB content_service_pages:');
  for (const row of pagesDb || []) {
    console.log(`  ${row.service_slug}`);
  }

  // Check if there's overlap or mismatch
  const xlsxSlugs = new Set(xlsxWD.map(r => r.service_slug));
  const dbServicesSlugs = new Set((servicesDb || []).map(r => r.service_slug));
  const dbPagesSlugs = new Set((pagesDb || []).map(r => r.service_slug));

  console.log('\n' + '='.repeat(60));
  console.log('ANALYSIS');
  console.log('='.repeat(60));
  console.log('\nXLSX slugs:', [...xlsxSlugs].join(', '));
  console.log('content_services_new slugs:', [...dbServicesSlugs].join(', '));
  console.log('content_service_pages slugs:', [...dbPagesSlugs].join(', '));

  // Check intersection
  const inXlsxNotInServices = [...xlsxSlugs].filter(s => !dbServicesSlugs.has(s));
  const inServicesNotInXlsx = [...dbServicesSlugs].filter(s => !xlsxSlugs.has(s));

  console.log('\nIn XLSX but not in content_services_new:', inXlsxNotInServices.join(', ') || 'none');
  console.log('In content_services_new but not in XLSX:', inServicesNotInXlsx.join(', ') || 'none');
}

compareSlslugs().catch(console.error);
