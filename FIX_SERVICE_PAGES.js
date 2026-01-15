#!/usr/bin/env node
/**
 * FIX SERVICE PAGES - Clear and reimport content_service_pages
 */

require('dotenv').config({ path: '.env.local' });
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const XLSX_FILE = path.join(__dirname, 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Normalize service slugs
const SERVICE_SLUG_MAP = {
  'water-restoration': 'water-damage-restoration',
  'fire-damage': 'fire-smoke-damage',
  'burst-pipe': 'burst-pipe-repair',
  'emergency-leak': 'emergency-leak-repair',
};

function normalizeSlug(slug) {
  return SERVICE_SLUG_MAP[slug] || slug;
}

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return sheet ? XLSX.utils.sheet_to_json(sheet, { defval: '' }) : [];
}

async function main() {
  console.log('🔧 FIX SERVICE PAGES\n');

  const workbook = XLSX.readFile(XLSX_FILE);

  // Step 1: Delete ALL rows from content_service_pages
  console.log('1️⃣ Deleting all rows from content_service_pages...');
  const { error: deleteError, count: deleteCount } = await supabase
    .from('content_service_pages')
    .delete()
    .neq('id', -1)
    .select('id', { count: 'exact' });

  if (deleteError) {
    console.log('  Error:', deleteError.message);
  } else {
    console.log(`  Deleted rows`);
  }

  // Step 2: Read SERVICES_GRID and SERVICE_PAGES
  console.log('\n2️⃣ Reading xlsx data...');
  const servicesGrid = readSheet(workbook, 'SERVICES_GRID');
  const servicePagesElements = readSheet(workbook, 'SERVICE_PAGES');
  console.log(`  SERVICES_GRID: ${servicesGrid.length} rows`);
  console.log(`  SERVICE_PAGES: ${servicePagesElements.length} elements`);

  // Step 3: Group SERVICE_PAGES elements by service
  const serviceContent = {};
  servicePagesElements.forEach(row => {
    const key = `${row.category}:${row.service_id}`;
    if (!serviceContent[key]) {
      serviceContent[key] = [];
    }
    serviceContent[key].push({
      order: row.element_order,
      type: row.element_type,
      content: row.content
    });
  });

  // Step 4: Build and insert new rows
  console.log('\n3️⃣ Building and inserting new rows...');

  const newRows = servicesGrid.map((row, idx) => {
    const key = `${row.category}:${row.service_id}`;
    const elements = serviceContent[key] || [];
    elements.sort((a, b) => a.order - b.order);

    // Extract content from elements
    const heroHeadline = elements.find(e => e.order === 1 && e.type === 'H2');
    const heroSub = elements.find(e => e.order === 2 && e.type === 'P');
    const bodyParagraphs = elements.filter(e => e.type === 'P' && e.order > 2);
    const bullets = elements.filter(e => e.type === 'BULLETS');

    const bodyText = bodyParagraphs.map(e => e.content).join('\n\n');
    const bulletsText = bullets.map(e => e.content).join('\n');

    return {
      category: row.category,
      service_slug: normalizeSlug(row.service_slug),
      service_title_spintax: row.service_name_spin || row.service_name,
      service_description_spintax: row.svc_grid_desc,
      hero_headline_spintax: heroHeadline?.content || row.service_name_spin || row.service_name,
      hero_subheadline_spintax: heroSub?.content || row.svc_grid_desc,
      section_body_spintax: bodyText || row.svc_grid_desc,
      process_body_spintax: bulletsText || '',
      icon_key: 'default',
      sort_order: idx
    };
  });

  // Insert in batches
  const batchSize = 20;
  let inserted = 0;

  for (let i = 0; i < newRows.length; i += batchSize) {
    const batch = newRows.slice(i, i + batchSize);
    const { error } = await supabase.from('content_service_pages').insert(batch);
    if (error) {
      console.log(`  Error at batch ${i}:`, error.message);
    } else {
      inserted += batch.length;
    }
  }

  console.log(`  ✅ Inserted ${inserted} rows`);

  // Step 5: Verify
  console.log('\n4️⃣ Verifying...');
  const { data: verify } = await supabase
    .from('content_service_pages')
    .select('service_slug, category, service_title_spintax')
    .limit(5);

  verify?.forEach(row => {
    const title = (row.service_title_spintax || '').substring(0, 50);
    console.log(`  ${row.category} | ${row.service_slug} | ${title}...`);
  });

  console.log('\n✅ Done!');
}

main().catch(console.error);
