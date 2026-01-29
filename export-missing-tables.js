const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://yxtdgkdwydmvzgbibrrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA'
);

const EXPORT_DIR = './supabase_export';

// Таблиці що потрібно експортувати
const tables = [
  'content_meta',
  'content_service_pages',
  'content_service_area',
  'content_questionnaire',
  'content_seo_body',
  // Legacy (можливо потрібні)
  'content_hero',
  'content_header',
  'content_cta',
  'content_faq',
  'content_testimonials',
  'content_services',
];

async function exportTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*');

  if (error) {
    console.log(`❌ ${tableName}: ${error.message}`);
    return null;
  }

  if (!data || data.length === 0) {
    console.log(`⚠️  ${tableName}: empty`);
    return null;
  }

  const filePath = path.join(EXPORT_DIR, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ ${tableName}: ${data.length} records`);

  // Show columns
  console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);

  return { tableName, count: data.length, columns: Object.keys(data[0]) };
}

async function main() {
  console.log('=== EXPORTING MISSING TABLES ===\n');

  const results = [];
  for (const table of tables) {
    const result = await exportTable(table);
    if (result) results.push(result);
  }

  console.log('\n=== EXPORT COMPLETE ===');
  console.log(`Exported ${results.length} tables`);
}

main();
