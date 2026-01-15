#!/usr/bin/env node
/**
 * MASTER IMPORT SCRIPT
 * Imports all data from MASTER_SPINTEXT xlsx to Supabase
 *
 * Usage: node IMPORT_ALL_DATA.js
 */

require('dotenv').config({ path: '.env.local' });
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// =====================================================
// Configuration
// =====================================================

const XLSX_FILE = path.join(__dirname, 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Service slug mapping (from xlsx service_slug to standard slugs)
const SERVICE_SLUG_MAP = {
  // Water Damage
  'water-restoration': 'water-damage-restoration',
  'fire-damage': 'fire-smoke-damage',
  'mold-remediation': 'mold-remediation',
  'biohazard-cleanup': 'biohazard-cleanup',
  'burst-pipe': 'burst-pipe-repair',
  'sewage-cleanup': 'sewage-cleanup',
  // Mold
  'mold-inspection': 'mold-inspection',
  'mold-remediation-service': 'mold-remediation',
  'black-mold': 'black-mold-removal',
  'mold-water-damage': 'mold-water-damage',
  'commercial-mold': 'commercial-mold-remediation',
  'air-quality': 'air-quality-testing',
  // Roofing
  'roof-installation': 'roof-installation',
  'roof-repair': 'roof-repair',
  'shingle-roofing': 'shingle-roofing',
  'metal-roofing': 'metal-roofing',
  'commercial-roofing': 'commercial-roofing',
  'emergency-leak': 'emergency-leak-repair',
};

// Icon mapping for services
const SERVICE_ICONS = {
  'water-damage-restoration': 'water',
  'fire-smoke-damage': 'fire',
  'mold-remediation': 'mold',
  'biohazard-cleanup': 'biohazard',
  'burst-pipe-repair': 'burst-pipe',
  'sewage-cleanup': 'sewage',
  'mold-inspection': 'search',
  'black-mold-removal': 'mold',
  'mold-water-damage': 'water',
  'commercial-mold-remediation': 'building',
  'air-quality-testing': 'air',
  'roof-installation': 'roof',
  'roof-repair': 'wrench',
  'shingle-roofing': 'roof',
  'metal-roofing': 'roof',
  'commercial-roofing': 'building',
  'emergency-leak-repair': 'alert',
};

// =====================================================
// Utility Functions
// =====================================================

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.warn(`  Sheet "${sheetName}" not found`);
    return [];
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

function normalizeSlug(slug) {
  return SERVICE_SLUG_MAP[slug] || slug;
}

async function upsertData(tableName, data, conflictColumns) {
  if (!data || data.length === 0) {
    console.log(`  ⚠️ No data to insert into ${tableName}`);
    return { count: 0, error: null };
  }

  const { data: result, error } = await supabase
    .from(tableName)
    .upsert(data, {
      onConflict: conflictColumns,
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    console.error(`  ❌ Error inserting into ${tableName}:`, error.message);
    return { count: 0, error };
  }

  return { count: result?.length || data.length, error: null };
}

async function deleteAndInsert(tableName, data) {
  if (!data || data.length === 0) {
    console.log(`  ⚠️ No data to insert into ${tableName}`);
    return { count: 0, error: null };
  }

  // Delete all existing data
  const { error: deleteError } = await supabase
    .from(tableName)
    .delete()
    .neq('id', 0); // Delete all rows

  if (deleteError) {
    console.warn(`  ⚠️ Error deleting from ${tableName}:`, deleteError.message);
  }

  // Insert new data
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();

  if (error) {
    console.error(`  ❌ Error inserting into ${tableName}:`, error.message);
    return { count: 0, error };
  }

  return { count: result?.length || data.length, error: null };
}

// =====================================================
// Import Functions for Each Sheet
// =====================================================

async function importHero(workbook) {
  console.log('\n📄 Importing HERO...');
  const data = readSheet(workbook, 'HERO');

  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.hero_h1,
    subheadline_spintax: row.hero_sub
  }));

  const result = await deleteAndInsert('content_hero_new', rows);
  console.log(`  ✅ Imported ${result.count} hero rows`);
  return result;
}

async function importHeader(workbook) {
  console.log('\n📄 Importing HEADER/MENU...');
  const data = readSheet(workbook, 'MENU');

  // Get unique categories and build spintax from variations
  const categoryData = {};

  data.forEach(row => {
    if (!categoryData[row.category]) {
      categoryData[row.category] = {
        nav_home: new Set(),
        nav_services: new Set(),
        nav_areas: new Set(),
        nav_contact: new Set(),
        nav_cta: new Set()
      };
    }
    if (row.nav_home) categoryData[row.category].nav_home.add(row.nav_home);
    if (row.nav_services) categoryData[row.category].nav_services.add(row.nav_services);
    if (row.nav_areas) categoryData[row.category].nav_areas.add(row.nav_areas);
    if (row.nav_contact) categoryData[row.category].nav_contact.add(row.nav_contact);
    if (row.nav_cta) categoryData[row.category].nav_cta.add(row.nav_cta);
  });

  // Convert sets to spintax format
  const rows = Object.entries(categoryData).map(([category, fields]) => ({
    category,
    nav_home: `{${[...fields.nav_home].join('|')}}`,
    nav_services: `{${[...fields.nav_services].join('|')}}`,
    nav_areas: `{${[...fields.nav_areas].join('|')}}`,
    nav_contact: `{${[...fields.nav_contact].join('|')}}`,
    call_button_text: `{${[...fields.nav_cta].join('|')}}`
  }));

  const result = await deleteAndInsert('content_header_new', rows);
  console.log(`  ✅ Imported ${result.count} header rows`);
  return result;
}

async function importCTA(workbook) {
  console.log('\n📄 Importing CTA...');
  const data = readSheet(workbook, 'CTA');

  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.cta_h2,
    subheadline_spintax: row.cta_p,
    button_text_spintax: row.cta_btn
  }));

  const result = await deleteAndInsert('content_cta_new', rows);
  console.log(`  ✅ Imported ${result.count} CTA rows`);
  return result;
}

async function importFAQ(workbook) {
  console.log('\n📄 Importing FAQ...');
  const data = readSheet(workbook, 'FAQ');

  const rows = data.map(row => ({
    category: row.category,
    faq_id: row.faq_id,
    content: row.content
  }));

  const result = await deleteAndInsert('content_faq_new', rows);
  console.log(`  ✅ Imported ${result.count} FAQ rows`);
  return result;
}

async function importTestimonials(workbook) {
  console.log('\n📄 Importing TESTIMONIALS...');
  const data = readSheet(workbook, 'TESTIMONIALS');

  const rows = data.map(row => ({
    category: row.category,
    testimonial_num: row.testimonial_num,
    testimonial_body: row.testimonial_body,
    testimonial_name: row.testimonial_name,
    rating: 5
  }));

  const result = await deleteAndInsert('content_testimonials_new', rows);
  console.log(`  ✅ Imported ${result.count} testimonial rows`);
  return result;
}

async function importMeta(workbook) {
  console.log('\n📄 Importing META...');
  const data = readSheet(workbook, 'META');

  const rows = data.map(row => ({
    category: row.category,
    page_type: row.page_type || 'home',
    service_id: row.service_id || null,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc
  }));

  const result = await deleteAndInsert('content_meta_new', rows);
  console.log(`  ✅ Imported ${result.count} meta rows`);
  return result;
}

async function importServicesGrid(workbook) {
  console.log('\n📄 Importing SERVICES_GRID...');
  const data = readSheet(workbook, 'SERVICES_GRID');

  const rows = data.map((row, idx) => ({
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    service_name_spin: row.service_name_spin,
    service_slug: normalizeSlug(row.service_slug),
    service_description: row.svc_grid_desc,
    icon_key: SERVICE_ICONS[normalizeSlug(row.service_slug)] || 'default',
    sort_order: idx
  }));

  const result = await deleteAndInsert('content_services_new', rows);
  console.log(`  ✅ Imported ${result.count} service rows`);
  return result;
}

async function importHomeArticle(workbook) {
  console.log('\n📄 Importing HOME_ARTICLE...');
  const data = readSheet(workbook, 'HOME_ARTICLE');

  const rows = data.map(row => ({
    category: row.category,
    element_order: row.element_order,
    element_type: row.element_type,
    content: row.content
  }));

  const result = await deleteAndInsert('content_home_article', rows);
  console.log(`  ✅ Imported ${result.count} home article rows`);
  return result;
}

async function importServicePagesElements(workbook) {
  console.log('\n📄 Importing SERVICE_PAGES elements...');
  const data = readSheet(workbook, 'SERVICE_PAGES');

  const rows = data.map(row => ({
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    element_order: row.element_order,
    element_type: row.element_type,
    content: row.content
  }));

  const result = await deleteAndInsert('content_service_pages_elements', rows);
  console.log(`  ✅ Imported ${result.count} service page element rows`);
  return result;
}

async function importAreaPages(workbook) {
  console.log('\n📄 Importing AREA_PAGES...');
  const data = readSheet(workbook, 'AREA_PAGES');

  const rows = data.map(row => ({
    category: row.category,
    element_order: row.element_order,
    element_type: row.element_type,
    content: row.content
  }));

  const result = await deleteAndInsert('content_area_pages', rows);
  console.log(`  ✅ Imported ${result.count} area page rows`);
  return result;
}

async function importFeedback(workbook) {
  console.log('\n📄 Importing FEEDBACK...');
  const data = readSheet(workbook, 'FEEDBACK');

  const rows = data.map(row => ({
    category: row.category,
    element_order: row.element_order,
    element_type: row.element_type,
    content: row.content
  }));

  const result = await deleteAndInsert('content_feedback', rows);
  console.log(`  ✅ Imported ${result.count} feedback rows`);
  return result;
}

async function importLegal(workbook) {
  console.log('\n📄 Importing LEGAL...');
  const data = readSheet(workbook, 'LEGAL');

  const rows = data.map(row => ({
    category: row.category,
    legal_type: row.legal_type,
    content: row.content
  }));

  const result = await deleteAndInsert('content_legal', rows);
  console.log(`  ✅ Imported ${result.count} legal rows`);
  return result;
}

// =====================================================
// Main Import Function
// =====================================================

async function main() {
  console.log('═'.repeat(80));
  console.log('🚀 MASTER IMPORT SCRIPT');
  console.log('═'.repeat(80));
  console.log(`📁 Reading: ${XLSX_FILE}`);
  console.log(`🔗 Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

  const workbook = XLSX.readFile(XLSX_FILE);
  console.log(`📊 Sheets found: ${workbook.SheetNames.join(', ')}`);

  const results = {};

  // Import all sheets
  results.hero = await importHero(workbook);
  results.header = await importHeader(workbook);
  results.cta = await importCTA(workbook);
  results.faq = await importFAQ(workbook);
  results.testimonials = await importTestimonials(workbook);
  results.meta = await importMeta(workbook);
  results.services = await importServicesGrid(workbook);
  results.homeArticle = await importHomeArticle(workbook);
  results.servicePages = await importServicePagesElements(workbook);
  results.areaPages = await importAreaPages(workbook);
  results.feedback = await importFeedback(workbook);
  results.legal = await importLegal(workbook);

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 IMPORT SUMMARY');
  console.log('─'.repeat(40));

  let totalRows = 0;
  let errors = 0;

  Object.entries(results).forEach(([key, result]) => {
    if (result.error) {
      console.log(`  ❌ ${key}: FAILED - ${result.error.message}`);
      errors++;
    } else {
      console.log(`  ✅ ${key}: ${result.count} rows`);
      totalRows += result.count;
    }
  });

  console.log('─'.repeat(40));
  console.log(`  Total rows imported: ${totalRows}`);
  console.log(`  Errors: ${errors}`);
  console.log('═'.repeat(80));

  if (errors === 0) {
    console.log('\n✅ Import completed successfully!');
  } else {
    console.log('\n⚠️ Import completed with errors. Check the logs above.');
    process.exit(1);
  }
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
