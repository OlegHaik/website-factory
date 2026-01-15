#!/usr/bin/env node
/**
 * REBUILD AND IMPORT SCRIPT
 * 1. Drops and recreates all content tables
 * 2. Imports all data from MASTER_SPINTEXT xlsx
 *
 * Usage: node REBUILD_AND_IMPORT.js
 */

require('dotenv').config({ path: '.env.local' });
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

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
  'mold-remediation-service': 'mold-remediation-service',
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
// SQL to rebuild tables (individual statements)
// =====================================================

const SQL_STATEMENTS = [
  // Drop tables
  'DROP TABLE IF EXISTS content_hero_new CASCADE',
  'DROP TABLE IF EXISTS content_header_new CASCADE',
  'DROP TABLE IF EXISTS content_cta_new CASCADE',
  'DROP TABLE IF EXISTS content_faq_new CASCADE',
  'DROP TABLE IF EXISTS content_testimonials_new CASCADE',
  'DROP TABLE IF EXISTS content_meta_new CASCADE',
  'DROP TABLE IF EXISTS content_services_new CASCADE',
  'DROP TABLE IF EXISTS content_home_article CASCADE',
  'DROP TABLE IF EXISTS content_service_pages_elements CASCADE',
  'DROP TABLE IF EXISTS content_area_pages CASCADE',
  'DROP TABLE IF EXISTS content_feedback CASCADE',
  'DROP TABLE IF EXISTS content_legal CASCADE',

  // Create tables
  `CREATE TABLE content_hero_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL UNIQUE,
    headline_spintax TEXT NOT NULL,
    subheadline_spintax TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_header_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL UNIQUE,
    nav_home TEXT DEFAULT 'Home',
    nav_services TEXT DEFAULT 'Services',
    nav_areas TEXT DEFAULT 'Areas',
    nav_contact TEXT DEFAULT 'Contact',
    call_button_text TEXT DEFAULT 'Call Now',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_cta_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL UNIQUE,
    headline_spintax TEXT NOT NULL,
    subheadline_spintax TEXT NOT NULL,
    button_text_spintax TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_faq_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    faq_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, faq_id)
  )`,

  `CREATE TABLE content_testimonials_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    testimonial_num INTEGER NOT NULL,
    testimonial_body TEXT NOT NULL,
    testimonial_name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, testimonial_num)
  )`,

  `CREATE TABLE content_meta_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    page_type TEXT NOT NULL,
    service_id TEXT,
    meta_title TEXT NOT NULL,
    meta_desc TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_services_new (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_name_spin TEXT NOT NULL,
    service_slug TEXT NOT NULL,
    service_description TEXT NOT NULL,
    icon_key TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, service_id)
  )`,

  `CREATE TABLE content_home_article (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    element_order INTEGER NOT NULL,
    element_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_service_pages_elements (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    element_order INTEGER NOT NULL,
    element_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_area_pages (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    element_order INTEGER NOT NULL,
    element_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_feedback (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    element_order INTEGER NOT NULL,
    element_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE content_legal (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    legal_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Enable RLS
  'ALTER TABLE content_hero_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_header_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_cta_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_faq_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_testimonials_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_meta_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_home_article ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_service_pages_elements ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_area_pages ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_feedback ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE content_legal ENABLE ROW LEVEL SECURITY',

  // Create RLS policies
  `CREATE POLICY "Allow public read" ON content_hero_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_header_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_cta_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_faq_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_testimonials_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_meta_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_services_new FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_home_article FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_service_pages_elements FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_area_pages FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_feedback FOR SELECT USING (true)`,
  `CREATE POLICY "Allow public read" ON content_legal FOR SELECT USING (true)`,
];

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

async function runSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    // Try direct fetch to Supabase REST API for SQL
    // This won't work without pg extension, so we'll handle it differently
    return { success: false, error };
  }
  return { success: true, data };
}

async function insertData(tableName, data) {
  if (!data || data.length === 0) {
    return { count: 0, error: null };
  }

  // Insert in batches of 100
  const batchSize = 100;
  let totalInserted = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(batch)
      .select();

    if (error) {
      console.error(`  ❌ Error inserting batch into ${tableName}:`, error.message);
      return { count: totalInserted, error };
    }
    totalInserted += result?.length || batch.length;
  }

  return { count: totalInserted, error: null };
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

  const result = await insertData('content_hero_new', rows);
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

  const result = await insertData('content_header_new', rows);
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

  const result = await insertData('content_cta_new', rows);
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

  const result = await insertData('content_faq_new', rows);
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

  const result = await insertData('content_testimonials_new', rows);
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

  const result = await insertData('content_meta_new', rows);
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

  const result = await insertData('content_services_new', rows);
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

  const result = await insertData('content_home_article', rows);
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

  const result = await insertData('content_service_pages_elements', rows);
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

  const result = await insertData('content_area_pages', rows);
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

  const result = await insertData('content_feedback', rows);
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

  const result = await insertData('content_legal', rows);
  console.log(`  ✅ Imported ${result.count} legal rows`);
  return result;
}

// =====================================================
// Main Function
// =====================================================

async function main() {
  console.log('═'.repeat(80));
  console.log('🚀 REBUILD AND IMPORT SCRIPT');
  console.log('═'.repeat(80));
  console.log(`📁 Reading: ${XLSX_FILE}`);
  console.log(`🔗 Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log('');

  // =====================================================
  // STEP 1: Run SQL to rebuild tables
  // =====================================================

  console.log('─'.repeat(80));
  console.log('📋 STEP 1: Running SQL to rebuild tables...');
  console.log('─'.repeat(80));
  console.log('');
  console.log('⚠️  IMPORTANT: You need to run the SQL manually in Supabase SQL Editor!');
  console.log('');
  console.log('1. Open https://supabase.com/dashboard/project/yxtdgkdwydmvzgbibrrv/sql');
  console.log('2. Copy and paste the contents of REBUILD_DATABASE.sql');
  console.log('3. Click "Run" to execute');
  console.log('4. Press Enter here when done...');
  console.log('');

  // Wait for user input
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise((resolve) => {
    rl.question('Press Enter when SQL has been executed in Supabase... ', () => {
      rl.close();
      resolve();
    });
  });

  // =====================================================
  // STEP 2: Import data from xlsx
  // =====================================================

  console.log('\n' + '─'.repeat(80));
  console.log('📋 STEP 2: Importing data from xlsx...');
  console.log('─'.repeat(80));

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
    console.log('\nNext steps:');
    console.log('1. Update fetch-content.ts to use the new table structure');
    console.log('2. Test the website locally');
    console.log('3. Deploy to Vercel');
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
