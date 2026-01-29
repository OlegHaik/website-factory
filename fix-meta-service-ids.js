#!/usr/bin/env node
/**
 * Fix META table service_id to use slugs instead of "1a", "1b", etc.
 */

require('dotenv').config({ path: '.env.local' });
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const XLSX_FILE = './MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx';

// Service slug normalization (same as FINAL_IMPORT.js)
const SERVICE_SLUG_MAP = {
  'water-restoration': 'water-damage-restoration',
  'fire-damage': 'fire-smoke-damage',
  'burst-pipe': 'burst-pipe-repair',
  'emergency-leak': 'emergency-leak-repair',
};

function normalizeSlug(slug) {
  return SERVICE_SLUG_MAP[slug] || slug;
}

async function fixMeta() {
  console.log('='.repeat(60));
  console.log('Fixing META service_id to use slugs');
  console.log('='.repeat(60));

  const workbook = XLSX.readFile(XLSX_FILE);

  // Build service_id -> slug mapping from SERVICES_GRID
  const gridSheet = workbook.Sheets['SERVICES_GRID'];
  const gridData = XLSX.utils.sheet_to_json(gridSheet, { defval: '' });

  const idToSlug = {};
  for (const row of gridData) {
    const key = `${row.category}:${row.service_id}`;
    idToSlug[key] = normalizeSlug(row.service_slug);
  }

  console.log('Service ID to Slug mapping created:', Object.keys(idToSlug).length, 'entries');

  // Get META data
  const metaSheet = workbook.Sheets['META'];
  const metaData = XLSX.utils.sheet_to_json(metaSheet, { defval: '' });

  // Update service page meta rows
  const serviceMeta = metaData.filter(r => r.page_type === 'service' && r.service_id);

  console.log('Service meta rows to update:', serviceMeta.length);

  let updated = 0;
  let failed = 0;

  for (const row of serviceMeta) {
    const key = `${row.category}:${row.service_id}`;
    const slug = idToSlug[key];

    if (!slug) {
      console.log(`  ⚠️ No slug found for ${key}`);
      failed++;
      continue;
    }

    // Update the row in DB
    const { error } = await supabase
      .from('content_meta_new')
      .update({ service_id: slug })
      .eq('category', row.category)
      .eq('page_type', 'service')
      .eq('service_id', row.service_id);

    if (error) {
      console.log(`  ❌ Error updating ${key}:`, error.message);
      failed++;
    } else {
      updated++;
    }
  }

  console.log(`\n✅ Updated: ${updated}, Failed: ${failed}`);

  // Verify
  console.log('\n--- Verification ---');
  const { data: verify } = await supabase
    .from('content_meta_new')
    .select('category, page_type, service_id, meta_title')
    .eq('page_type', 'service')
    .eq('category', 'water_damage');

  for (const row of verify || []) {
    console.log(`  ${row.category}:${row.service_id} = ${(row.meta_title || '').substring(0, 40)}...`);
  }
}

fixMeta().catch(console.error);
