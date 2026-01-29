#!/usr/bin/env node
/**
 * Import missing data from xlsx to Supabase
 *
 * This imports:
 * 1. AREA_PAGES → content_service_area
 * 2. SERVICE_PAGES → updates content_service_pages with article content
 * 3. FEEDBACK → content_feedback
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

function normalizeSpintax(text) {
  if (!text) return text;
  let result = text;
  result = result.replace(/\{\{([^{}]*\|[^{}]*)\}\}/g, '{$1}');
  result = result.replace(/\{\{\{\{(\w+)\}\}\}\}/g, '{{$1}}');
  return result;
}

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return sheet ? XLSX.utils.sheet_to_json(sheet, { defval: '' }) : [];
}

// =====================================================
// Import AREA_PAGES → content_service_area
// =====================================================

async function importAreaPages(workbook) {
  console.log('\n📄 AREA_PAGES → content_service_area...');
  const data = readSheet(workbook, 'AREA_PAGES');

  // Group by category
  const byCategory = {};
  data.forEach(row => {
    if (!byCategory[row.category]) {
      byCategory[row.category] = {};
    }
    byCategory[row.category][row.element_order] = {
      type: row.element_type,
      content: normalizeSpintax(row.content)
    };
  });

  // Map elements to columns
  // Based on analysis:
  // 1 = H2 → headline_spintax
  // 2 = P → paragraph1_spintax
  // 3 = H3 → why_city_headline_spintax (or paragraph2)
  // 4 = P → why_city_paragraph_spintax (or paragraph3)
  // 5 = BULLETS → trust_points_spintax
  // 6 = H3 → services_list_headline_spintax
  // 7 = P → paragraph4_spintax

  const rows = Object.entries(byCategory).map(([category, elements]) => ({
    category,
    headline_spintax: elements[1]?.content || null,
    paragraph1_spintax: elements[2]?.content || null,
    why_city_headline_spintax: elements[3]?.content || null,
    why_city_paragraph_spintax: elements[4]?.content || null,
    trust_points_spintax: elements[5]?.content || null,
    services_list_headline_spintax: elements[6]?.content || null,
    paragraph2_spintax: elements[7]?.content || null,
    // Defaults for remaining fields
    paragraph3_spintax: null,
    paragraph4_spintax: null,
    midpage_cta_headline_spintax: '{Need|Ready for|Looking for|Want} {Professional|Expert|Quality} Service?',
    midpage_cta_subtext_spintax: '{Call|Contact|Reach} {{business_name}} {today|now}!',
    why_choose_headline_spintax: '{Why Choose|Why Trust|Why Pick} {{business_name}}?'
  }));

  console.log(`  Prepared ${rows.length} categories`);

  // Check existing categories
  const { data: existing } = await supabase
    .from('content_service_area')
    .select('category');

  const existingCats = new Set((existing || []).map(r => r.category));

  // Insert missing categories
  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    if (existingCats.has(row.category)) {
      // Update existing
      const { error } = await supabase
        .from('content_service_area')
        .update(row)
        .eq('category', row.category);
      if (error) {
        console.log(`  ❌ Update error for ${row.category}:`, error.message);
      } else {
        updated++;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('content_service_area')
        .insert(row);
      if (error) {
        console.log(`  ❌ Insert error for ${row.category}:`, error.message);
      } else {
        inserted++;
      }
    }
  }

  console.log(`  ✅ Inserted: ${inserted}, Updated: ${updated}`);
  return { inserted, updated };
}

// =====================================================
// Import SERVICE_PAGES article content
// =====================================================

async function importServicePagesContent(workbook) {
  console.log('\n📄 SERVICE_PAGES article content...');
  const data = readSheet(workbook, 'SERVICE_PAGES');
  const gridData = readSheet(workbook, 'SERVICES_GRID');

  // Create service_id to slug mapping from SERVICES_GRID
  const idToSlug = {};
  gridData.forEach(row => {
    const key = `${row.category}:${row.service_id}`;
    idToSlug[key] = normalizeSlug(row.service_slug);
  });

  // Group SERVICE_PAGES by category and service_id
  const byService = {};
  data.forEach(row => {
    const key = `${row.category}:${row.service_id}`;
    if (!byService[key]) {
      byService[key] = {
        category: row.category,
        service_id: row.service_id,
        service_name: row.service_name,
        elements: {}
      };
    }
    byService[key].elements[row.element_order] = {
      type: row.element_type,
      content: normalizeSpintax(row.content)
    };
  });

  console.log(`  Found ${Object.keys(byService).length} services with article content`);

  // Map elements to content_service_pages columns
  // Based on analysis:
  // 1 = H2 → section_headline_spintax
  // 2 = P → section_body_spintax
  // 3 = H3 → why_choose_headline_spintax
  // 4 = P → why_choose_body_spintax
  // 5 = BULLETS → trust_points_spintax
  // 6 = H3 → process_headline_spintax
  // 7 = P → process_body_spintax

  let updated = 0;
  let notFound = 0;

  for (const [key, service] of Object.entries(byService)) {
    const slug = idToSlug[key];
    if (!slug) {
      console.log(`  ⚠️ No slug mapping for ${key}`);
      notFound++;
      continue;
    }

    const elements = service.elements;
    const updateData = {
      section_headline_spintax: elements[1]?.content || null,
      section_body_spintax: elements[2]?.content || null,
      why_choose_headline_spintax: elements[3]?.content || null,
      why_choose_body_spintax: elements[4]?.content || null,
      trust_points_spintax: elements[5]?.content || null,
      process_headline_spintax: elements[6]?.content || null,
      process_body_spintax: elements[7]?.content || null
    };

    const { error } = await supabase
      .from('content_service_pages')
      .update(updateData)
      .eq('category', service.category)
      .eq('service_slug', slug);

    if (error) {
      console.log(`  ❌ Update error for ${service.category}:${slug}:`, error.message);
    } else {
      updated++;
    }
  }

  console.log(`  ✅ Updated: ${updated}, Not found: ${notFound}`);
  return { updated, notFound };
}

// =====================================================
// Import FEEDBACK → content_feedback
// =====================================================

async function importFeedback(workbook) {
  console.log('\n📄 FEEDBACK → content_feedback...');
  const data = readSheet(workbook, 'FEEDBACK');

  // First check if table exists
  const { error: checkError } = await supabase
    .from('content_feedback')
    .select('id')
    .limit(1);

  if (checkError && checkError.message.includes('does not exist')) {
    console.log('  ⚠️ Table content_feedback does not exist. Creating...');
    // Table doesn't exist - skip for now
    return { count: 0, error: 'Table does not exist' };
  }

  // Clear existing
  await supabase.from('content_feedback').delete().neq('id', -1);

  const rows = data.map(row => ({
    category: row.category,
    element_order: row.element_order,
    element_type: row.element_type,
    content: normalizeSpintax(row.content)
  }));

  // Insert in batches
  const batchSize = 50;
  let total = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('content_feedback').insert(batch);
    if (error) {
      console.log(`  ❌ Insert error:`, error.message);
      return { count: total, error: error.message };
    }
    total += batch.length;
  }

  console.log(`  ✅ Inserted: ${total} rows`);
  return { count: total };
}

// =====================================================
// Fix air_duct category name
// =====================================================

async function fixAirDuctCategory() {
  console.log('\n🔧 Fixing air_duct → air_duct_cleaning...');

  const tables = [
    'content_service_area'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .update({ category: 'air_duct_cleaning' })
      .eq('category', 'air_duct');

    if (error) {
      console.log(`  ⚠️ ${table}: ${error.message}`);
    } else {
      console.log(`  ✅ ${table} updated`);
    }
  }
}

// =====================================================
// Main
// =====================================================

async function main() {
  console.log('═'.repeat(80));
  console.log('🚀 IMPORT MISSING DATA');
  console.log('═'.repeat(80));

  const workbook = XLSX.readFile(XLSX_FILE);

  await importAreaPages(workbook);
  await importServicePagesContent(workbook);
  await importFeedback(workbook);
  await fixAirDuctCategory();

  console.log('\n' + '═'.repeat(80));
  console.log('✅ Done!');
  console.log('═'.repeat(80));
}

main().catch(console.error);
