#!/usr/bin/env node
/**
 * FINAL IMPORT SCRIPT
 * Imports all data from MASTER_SPINTEXT xlsx to Supabase
 *
 * Prerequisites:
 * 1. Run REBUILD_DATABASE.sql in Supabase SQL Editor first
 * 2. Then run this script: node FINAL_IMPORT.js
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

// Service slug normalization
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

async function clearAndInsert(tableName, data) {
  if (!data.length) {
    console.log(`  ⚠️ No data for ${tableName}`);
    return { count: 0 };
  }

  // Clear existing data
  await supabase.from(tableName).delete().neq('id', -1);

  // Insert in batches
  const batchSize = 50;
  let total = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).insert(batch);
    if (error) {
      console.error(`  ❌ Error in ${tableName}:`, error.message);
      return { count: total, error };
    }
    total += batch.length;
  }

  return { count: total };
}

// =====================================================
// Import Functions
// =====================================================

async function importHero(workbook) {
  console.log('\n📄 HERO...');
  const data = readSheet(workbook, 'HERO');
  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.hero_h1,
    subheadline_spintax: row.hero_sub
  }));
  const result = await clearAndInsert('content_hero_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importHeader(workbook) {
  console.log('\n📄 HEADER/MENU...');
  const data = readSheet(workbook, 'MENU');

  // Aggregate menu variations into spintax
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

  const rows = Object.entries(categoryData).map(([category, fields]) => ({
    category,
    nav_home: `{${[...fields.nav_home].join('|')}}`,
    nav_services: `{${[...fields.nav_services].join('|')}}`,
    nav_areas: `{${[...fields.nav_areas].join('|')}}`,
    nav_contact: `{${[...fields.nav_contact].join('|')}}`,
    call_button_text: `{${[...fields.nav_cta].join('|')}}`
  }));

  const result = await clearAndInsert('content_header_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importCTA(workbook) {
  console.log('\n📄 CTA...');
  const data = readSheet(workbook, 'CTA');
  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.cta_h2,
    subheadline_spintax: row.cta_p,
    button_text_spintax: row.cta_btn
  }));
  const result = await clearAndInsert('content_cta_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importFAQ(workbook) {
  console.log('\n📄 FAQ...');
  const data = readSheet(workbook, 'FAQ');
  const rows = data.map(row => ({
    category: row.category,
    faq_id: row.faq_id,
    content: row.content
  }));
  const result = await clearAndInsert('content_faq_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importTestimonials(workbook) {
  console.log('\n📄 TESTIMONIALS...');
  const data = readSheet(workbook, 'TESTIMONIALS');
  const rows = data.map(row => ({
    category: row.category,
    testimonial_num: row.testimonial_num,
    testimonial_body: row.testimonial_body,
    testimonial_name: row.testimonial_name,
    rating: 5
  }));
  const result = await clearAndInsert('content_testimonials_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importMeta(workbook) {
  console.log('\n📄 META...');
  const data = readSheet(workbook, 'META');
  const rows = data.map(row => ({
    category: row.category,
    page_type: row.page_type || 'home',
    service_id: row.service_id || null,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc
  }));
  const result = await clearAndInsert('content_meta_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importServicesGrid(workbook) {
  console.log('\n📄 SERVICES_GRID...');
  const data = readSheet(workbook, 'SERVICES_GRID');
  const rows = data.map((row, idx) => ({
    category: row.category,
    service_id: row.service_id,
    service_name: row.service_name,
    service_name_spin: row.service_name_spin,
    service_slug: normalizeSlug(row.service_slug),
    service_description: row.svc_grid_desc,
    icon_key: 'default',
    sort_order: idx
  }));
  const result = await clearAndInsert('content_services_new', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

async function importHomeArticle(workbook) {
  console.log('\n📄 HOME_ARTICLE...');
  const data = readSheet(workbook, 'HOME_ARTICLE');

  // Group by category and renumber element_order to avoid duplicates
  const byCategory = {};
  data.forEach(row => {
    if (!byCategory[row.category]) byCategory[row.category] = [];
    byCategory[row.category].push(row);
  });

  const rows = [];
  Object.entries(byCategory).forEach(([category, items]) => {
    items.forEach((row, idx) => {
      rows.push({
        category: row.category,
        element_order: idx + 1,  // Sequential numbering per category
        element_type: row.element_type,
        content: row.content
      });
    });
  });

  const result = await clearAndInsert('content_home_article', rows);
  console.log(`  ✅ ${result.count} rows`);
  return result;
}

// =====================================================
// Main
// =====================================================

async function main() {
  console.log('═'.repeat(80));
  console.log('🚀 FINAL IMPORT SCRIPT');
  console.log('═'.repeat(80));
  console.log(`📁 Reading: ${XLSX_FILE}`);
  console.log(`🔗 Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Make sure you ran REBUILD_DATABASE.sql in Supabase first!');
  console.log('   https://supabase.com/dashboard/project/yxtdgkdwydmvzgbibrrv/sql');
  console.log('');

  const workbook = XLSX.readFile(XLSX_FILE);
  console.log(`📊 Sheets: ${workbook.SheetNames.join(', ')}`);

  const results = {};

  results.hero = await importHero(workbook);
  results.header = await importHeader(workbook);
  results.cta = await importCTA(workbook);
  results.faq = await importFAQ(workbook);
  results.testimonials = await importTestimonials(workbook);
  results.meta = await importMeta(workbook);
  results.services = await importServicesGrid(workbook);
  results.homeArticle = await importHomeArticle(workbook);

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 SUMMARY');
  console.log('─'.repeat(40));

  let total = 0;
  let errors = 0;

  Object.entries(results).forEach(([key, result]) => {
    if (result.error) {
      console.log(`  ❌ ${key}: FAILED`);
      errors++;
    } else {
      console.log(`  ✅ ${key}: ${result.count} rows`);
      total += result.count;
    }
  });

  console.log('─'.repeat(40));
  console.log(`  Total: ${total} rows, Errors: ${errors}`);
  console.log('═'.repeat(80));

  if (errors === 0) {
    console.log('\n✅ All data imported successfully!');
    console.log('\nNext steps:');
    console.log('1. npm run build');
    console.log('2. npm run dev (to test locally)');
    console.log('3. Deploy to Vercel');
  } else {
    console.log('\n⚠️ Some imports failed. Run REBUILD_DATABASE.sql first.');
    process.exit(1);
  }
}

main().catch(console.error);
