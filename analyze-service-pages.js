/**
 * Analyze SERVICE_PAGES structure
 */

const XLSX = require('xlsx');

const XLSX_PATH = './MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx';
const workbook = XLSX.readFile(XLSX_PATH);

// Analyze SERVICE_PAGES
console.log('='.repeat(60));
console.log('SERVICE_PAGES Analysis');
console.log('='.repeat(60));

const sheet = workbook.Sheets['SERVICE_PAGES'];
const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// Group by category and service_id
const byService = {};
for (const row of data) {
  const key = `${row.category}|${row.service_id}`;
  if (!byService[key]) {
    byService[key] = [];
  }
  byService[key].push(row);
}

// Show structure for one service
const firstService = Object.values(byService)[0];
console.log('\nFirst service elements:');
for (const el of firstService) {
  console.log(`  order=${el.element_order}, type=${el.element_type}, content=${(el.content || '').substring(0, 50)}...`);
}

// Show unique element_types
const elementTypes = new Set();
for (const row of data) {
  elementTypes.add(row.element_type);
}
console.log('\nUnique element_types:', [...elementTypes].join(', '));

// Check service_ids
const serviceIds = new Set();
for (const row of data) {
  serviceIds.add(`${row.category}:${row.service_id}`);
}
console.log('\nTotal unique services:', serviceIds.size);

// Analyze AREA_PAGES
console.log('\n' + '='.repeat(60));
console.log('AREA_PAGES Analysis');
console.log('='.repeat(60));

const areaSheet = workbook.Sheets['AREA_PAGES'];
const areaData = XLSX.utils.sheet_to_json(areaSheet, { defval: '' });

// Group by category
const byCategory = {};
for (const row of areaData) {
  if (!byCategory[row.category]) {
    byCategory[row.category] = [];
  }
  byCategory[row.category].push(row);
}

// Show structure for one category
const firstCat = Object.values(byCategory)[0];
console.log('\nFirst category elements:');
for (const el of firstCat) {
  console.log(`  order=${el.element_order}, type=${el.element_type}, content=${(el.content || '').substring(0, 50)}...`);
}

// Map element_order to field names
console.log('\n' + '='.repeat(60));
console.log('MAPPING element_order to DB columns:');
console.log('='.repeat(60));

console.log('\nFor AREA_PAGES (based on element_type and order):');
console.log('  1 = H2 → headline_spintax');
console.log('  2 = P → paragraph1_spintax');
console.log('  3 = P → paragraph2_spintax');
console.log('  4 = H2 → why_city_headline_spintax');
console.log('  5 = P → why_city_paragraph_spintax');
console.log('  6 = H2 → services_list_headline or why_choose_headline');
console.log('  7 = BULLETS/P → trust_points_spintax');

// Show SERVICES_GRID columns vs DB columns
console.log('\n' + '='.repeat(60));
console.log('SERVICES_GRID vs content_services_new');
console.log('='.repeat(60));

const gridSheet = workbook.Sheets['SERVICES_GRID'];
const gridData = XLSX.utils.sheet_to_json(gridSheet, { defval: '' });

console.log('\nSERVICES_GRID columns:', Object.keys(gridData[0] || {}).join(', '));
console.log('\nSample row:');
const sample = gridData[0];
for (const [k, v] of Object.entries(sample)) {
  console.log(`  ${k}: ${String(v).substring(0, 60)}${String(v).length > 60 ? '...' : ''}`);
}
