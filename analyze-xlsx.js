#!/usr/bin/env node
/**
 * Analyze MASTER_SPINTEXT xlsx file structure
 */

const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
console.log('📊 Analyzing:', filePath);
console.log('═'.repeat(80));

const workbook = XLSX.readFile(filePath);

console.log('\n📋 SHEETS FOUND:', workbook.SheetNames.length);
console.log('─'.repeat(40));

workbook.SheetNames.forEach((sheetName, idx) => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`\n${idx + 1}. 📄 SHEET: "${sheetName}"`);
  console.log(`   Rows: ${data.length}`);

  if (data.length > 0) {
    const columns = Object.keys(data[0]);
    console.log(`   Columns (${columns.length}):`);
    columns.forEach(col => {
      // Get sample value from first non-empty row
      let sampleValue = '';
      for (let row of data) {
        if (row[col] && String(row[col]).trim()) {
          sampleValue = String(row[col]).substring(0, 60);
          if (String(row[col]).length > 60) sampleValue += '...';
          break;
        }
      }
      console.log(`      - ${col}: ${sampleValue || '(empty)'}`);
    });

    // Show unique categories if there's a category column
    const categoryCol = columns.find(c => c.toLowerCase().includes('category'));
    if (categoryCol) {
      const categories = [...new Set(data.map(r => r[categoryCol]).filter(Boolean))];
      console.log(`   Categories: ${categories.join(', ')}`);
    }

    // Show unique service_key if exists
    const serviceKeyCol = columns.find(c => c.toLowerCase().includes('service_key') || c.toLowerCase() === 'service_slug');
    if (serviceKeyCol) {
      const serviceKeys = [...new Set(data.map(r => r[serviceKeyCol]).filter(Boolean))];
      console.log(`   Service Keys (${serviceKeys.length}): ${serviceKeys.slice(0, 6).join(', ')}${serviceKeys.length > 6 ? '...' : ''}`);
    }
  }
});

console.log('\n' + '═'.repeat(80));
console.log('✅ Analysis complete');
