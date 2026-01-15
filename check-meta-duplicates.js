const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
const meta = XLSX.utils.sheet_to_json(wb.Sheets['META']);

console.log('META структура:');
console.log('Всього рядків:', meta.length);
console.log('\nПерші 10 рядків:');
meta.slice(0, 10).forEach((r, i) => {
  console.log(`${i+1}. category: ${r.category}, page_type: ${r.page_type || 'undefined'}`);
});

// Перевіримо на дублікати
const keys = meta.map(r => `${r.category}|${r.page_type || 'homepage'}`);
const uniqueKeys = [...new Set(keys)];

console.log('\nВсього унікальних комбінацій:', uniqueKeys.length);
console.log('Всього рядків:', meta.length);
console.log('Дублікатів:', meta.length - uniqueKeys.length);

// Покажемо дублікати
const duplicateKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
if (duplicateKeys.length > 0) {
  console.log('\nПриклади дублікатів:');
  [...new Set(duplicateKeys)].slice(0, 10).forEach(k => {
    const [cat, type] = k.split('|');
    const count = keys.filter(x => x === k).length;
    console.log(`  ${cat} | ${type}: ${count} разів`);
  });
}
