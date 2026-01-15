#!/usr/bin/env node
/**
 * Detailed XLSX analysis with sample data
 */

const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
const workbook = XLSX.readFile(filePath);

console.log('📊 Detailed XLSX Analysis\n');

// Analyze each sheet with first 2 rows of data
workbook.SheetNames.forEach((sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📄 SHEET: "${sheetName}" (${data.length} rows)`);
  console.log('─'.repeat(80));

  if (data.length > 0) {
    console.log('\nFirst row:');
    const first = data[0];
    Object.keys(first).forEach(col => {
      let val = String(first[col]).substring(0, 100);
      if (String(first[col]).length > 100) val += '...';
      console.log(`  ${col}: ${val}`);
    });

    if (data.length > 6) {
      console.log('\nRow 7 (different category sample):');
      const seventh = data[6];
      Object.keys(seventh).forEach(col => {
        let val = String(seventh[col]).substring(0, 100);
        if (String(seventh[col]).length > 100) val += '...';
        console.log(`  ${col}: ${val}`);
      });
    }
  }
});

console.log('\n' + '═'.repeat(80));
console.log('✅ Done');
