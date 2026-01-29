/**
 * Check xlsx structure in detail
 */

const XLSX = require('xlsx');

const XLSX_PATH = './MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx';
const workbook = XLSX.readFile(XLSX_PATH);

console.log('='.repeat(60));
console.log('XLSX STRUCTURE ANALYSIS');
console.log('='.repeat(60));

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`\n${'='.repeat(40)}`);
  console.log(`SHEET: ${sheetName} (${data.length} rows)`);
  console.log('='.repeat(40));

  if (data.length > 0) {
    // Show columns
    const columns = Object.keys(data[0]);
    console.log('Columns:', columns.join(', '));

    // Show first row sample
    console.log('\nFirst row sample:');
    const firstRow = data[0];
    for (const col of columns.slice(0, 5)) {
      const val = String(firstRow[col]).substring(0, 80);
      console.log(`  ${col}: ${val}${val.length >= 80 ? '...' : ''}`);
    }

    // For SERVICE_PAGES - show category distribution
    if (sheetName === 'SERVICE_PAGES') {
      const categories = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        categories[cat] = (categories[cat] || 0) + 1;
      }
      console.log('\nCategory distribution:');
      for (const [cat, count] of Object.entries(categories).sort()) {
        console.log(`  ${cat}: ${count}`);
      }

      // Show unique service slugs per category
      const slugsByCat = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        const slug = row.service_slug || row.slug || 'unknown';
        if (!slugsByCat[cat]) slugsByCat[cat] = new Set();
        slugsByCat[cat].add(slug);
      }
      console.log('\nUnique service slugs per category:');
      for (const [cat, slugs] of Object.entries(slugsByCat).sort()) {
        console.log(`  ${cat}: ${slugs.size} slugs - ${[...slugs].join(', ')}`);
      }
    }

    // For SERVICES_GRID
    if (sheetName === 'SERVICES_GRID') {
      const categories = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        categories[cat] = (categories[cat] || 0) + 1;
      }
      console.log('\nCategory distribution:');
      for (const [cat, count] of Object.entries(categories).sort()) {
        console.log(`  ${cat}: ${count}`);
      }
    }

    // For AREA_PAGES
    if (sheetName === 'AREA_PAGES') {
      const categories = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        categories[cat] = (categories[cat] || 0) + 1;
      }
      console.log('\nCategory distribution:');
      for (const [cat, count] of Object.entries(categories).sort()) {
        console.log(`  ${cat}: ${count}`);
      }
    }

    // For MENU
    if (sheetName === 'MENU') {
      const categories = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        categories[cat] = (categories[cat] || 0) + 1;
      }
      console.log('\nCategory distribution:');
      for (const [cat, count] of Object.entries(categories).sort()) {
        console.log(`  ${cat}: ${count}`);
      }
    }

    // For FEEDBACK
    if (sheetName === 'FEEDBACK') {
      const categories = {};
      for (const row of data) {
        const cat = row.category || row.Category || 'unknown';
        categories[cat] = (categories[cat] || 0) + 1;
      }
      console.log('\nCategory distribution:');
      for (const [cat, count] of Object.entries(categories).sort()) {
        console.log(`  ${cat}: ${count}`);
      }
    }
  }
}
