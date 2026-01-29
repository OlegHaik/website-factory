const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
const meta = XLSX.utils.sheet_to_json(wb.Sheets['META']);

console.log('=== xlsx META Sheet ===');
console.log('Total rows:', meta.length);

// Group by category and page_type
const byCat = {};
for (const row of meta) {
  const cat = row.category || 'unknown';
  const pt = row.page_type || 'unknown';
  const key = cat + '|' + pt;
  if (!byCat[key]) byCat[key] = 0;
  byCat[key]++;
}

console.log('\nBy category|page_type:');
for (const key of Object.keys(byCat).sort()) {
  console.log('  ' + key + ': ' + byCat[key]);
}

// Show sample for each page_type
console.log('\n=== Sample Meta by page_type ===');
const seen = new Set();
for (const row of meta) {
  const key = row.category + '|' + row.page_type;
  if (!seen.has(key)) {
    seen.add(key);
    console.log(key + ':');
    console.log('  service_id:', row.service_id || 'null');
    console.log('  meta_title:', (row.meta_title || '').substring(0, 70));
    console.log('  meta_desc:', (row.meta_desc || '').substring(0, 70));
  }
}
