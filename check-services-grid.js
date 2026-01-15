const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

const sheet = wb.Sheets['SERVICES_GRID'];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1, defval: ''});

console.log('Columns:', data[0]);
console.log('');
console.log('First 3 data rows:');
data.slice(1, 4).forEach((row, i) => {
  console.log('');
  console.log(`Row ${i+1}:`);
  data[0].forEach((col, j) => {
    if (row[j]) console.log(`  ${col}: ${String(row[j]).substring(0, 100)}`);
  });
});
console.log('');
console.log('Total rows:', data.length - 1);
