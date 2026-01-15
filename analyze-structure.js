const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

console.log('📊 Аналіз структури MASTER_SPINTEXT\n');

// FAQ
const faq = XLSX.utils.sheet_to_json(wb.Sheets['FAQ']);
console.log('=== FAQ ===');
console.log('Всього рядків:', faq.length);
console.log('Унікальних категорій:', [...new Set(faq.map(r => r.category))].length);

const waterDamageFaq = faq.filter(r => r.category === 'water_damage');
console.log('Питань для water_damage:', waterDamageFaq.length);
console.log('\nПерші 5 питань water_damage:');
waterDamageFaq.slice(0, 5).forEach((row, i) => {
  console.log(`  ${i+1}. ID: ${row.faq_id}`);
  console.log(`     Q: ${row.content.substring(0, 100)}...`);
});

// TESTIMONIALS  
const testimonials = XLSX.utils.sheet_to_json(wb.Sheets['TESTIMONIALS']);
console.log('\n=== TESTIMONIALS ===');
console.log('Всього рядків:', testimonials.length);
console.log('Унікальних категорій:', [...new Set(testimonials.map(r => r.category))].length);

const waterDamageTest = testimonials.filter(r => r.category === 'water_damage');
console.log('Відгуків для water_damage:', waterDamageTest.length);
console.log('\nПерші 3 відгуки water_damage:');
waterDamageTest.slice(0, 3).forEach((row, i) => {
  console.log(`  ${i+1}. Testimonial #${row.testimonial_num}`);
  console.log(`     Name: ${row.testimonial_name.substring(0, 50)}`);
  console.log(`     Text: ${row.testimonial_body.substring(0, 100)}...`);
});

// CTA
const cta = XLSX.utils.sheet_to_json(wb.Sheets['CTA']);
console.log('\n=== CTA ===');
console.log('Всього рядків:', cta.length);
console.log('Приклад water_damage:');
const waterCta = cta.find(r => r.category === 'water_damage');
if (waterCta) {
  console.log('  H2:', waterCta.cta_h2.substring(0, 80));
  console.log('  P:', waterCta.cta_p.substring(0, 80));
}
