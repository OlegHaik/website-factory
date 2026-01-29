/**
 * Verify XLSX import - compare xlsx file with database content
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const XLSX_PATH = './MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx';

// Mapping of xlsx sheets to database tables
const SHEET_TO_TABLE = {
  'HERO': 'content_hero_new',
  'HEADER': 'content_header_new',
  'CTA': 'content_cta_new',
  'FAQ': 'content_faq_new',
  'TESTIMONIALS': 'content_testimonials_new',
  'SERVICES': 'content_services_new',
  'META': 'content_meta_new',
  'SERVICE_PAGES': 'content_service_pages',
  'SERVICE_AREA': 'content_service_area',
  'LEGAL': 'content_legal',
  'HOME_ARTICLE': 'content_home_article',
};

async function verifyImport() {
  console.log('='.repeat(60));
  console.log('XLSX vs Database Comparison');
  console.log('='.repeat(60));

  // Read xlsx
  const workbook = XLSX.readFile(XLSX_PATH);
  const sheetNames = workbook.SheetNames;

  console.log('\nШити у xlsx файлі:', sheetNames.join(', '));
  console.log('');

  const results = [];

  for (const sheetName of sheetNames) {
    const tableName = SHEET_TO_TABLE[sheetName];

    // Get xlsx data
    const sheet = workbook.Sheets[sheetName];
    const xlsxData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const xlsxCount = xlsxData.length;

    if (!tableName) {
      console.log(`⚠️  ${sheetName}: ${xlsxCount} rows - НЕ МАППИТЬСЯ на таблицю`);
      continue;
    }

    // Get database count
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${sheetName} → ${tableName}: ПОМИЛКА - ${error.message}`);
      results.push({ sheet: sheetName, table: tableName, xlsx: xlsxCount, db: 'ERROR', match: false });
      continue;
    }

    const dbCount = count || 0;
    const match = xlsxCount === dbCount;

    const icon = match ? '✅' : '❌';
    console.log(`${icon} ${sheetName} → ${tableName}: xlsx=${xlsxCount}, db=${dbCount} ${match ? '' : '⚠️ РІЗНИЦЯ: ' + (xlsxCount - dbCount)}`);

    results.push({ sheet: sheetName, table: tableName, xlsx: xlsxCount, db: dbCount, match });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const matched = results.filter(r => r.match).length;
  const total = results.length;

  console.log(`\nВсього таблиць: ${total}`);
  console.log(`Співпадають: ${matched}`);
  console.log(`Не співпадають: ${total - matched}`);

  if (matched === total) {
    console.log('\n✅ ВСІ ДАНІ ІМПОРТОВАНО УСПІШНО!');
  } else {
    console.log('\n⚠️ Є розбіжності - перевірте деталі вище');
  }

  // Detailed check for mismatches
  const mismatches = results.filter(r => !r.match);
  if (mismatches.length > 0) {
    console.log('\n' + '-'.repeat(60));
    console.log('ДЕТАЛІ РОЗБІЖНОСТЕЙ:');
    console.log('-'.repeat(60));

    for (const m of mismatches) {
      console.log(`\n${m.sheet} (${m.table}):`);
      console.log(`  xlsx: ${m.xlsx} rows`);
      console.log(`  db:   ${m.db} rows`);
      console.log(`  різниця: ${m.xlsx - m.db}`);
    }
  }

  // Check categories in database
  console.log('\n' + '='.repeat(60));
  console.log('КАТЕГОРІЇ В БАЗІ ДАНИХ');
  console.log('='.repeat(60));

  const categoriesToCheck = [
    'content_hero_new',
    'content_header_new',
    'content_cta_new',
    'content_service_pages'
  ];

  for (const table of categoriesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('category')
      .order('category');

    if (error) {
      console.log(`${table}: ERROR`);
      continue;
    }

    const categories = [...new Set(data.map(r => r.category))];
    console.log(`${table}: ${categories.join(', ')}`);
  }
}

verifyImport().catch(console.error);
