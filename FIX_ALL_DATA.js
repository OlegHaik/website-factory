#!/usr/bin/env node
/**
 * FIX ALL DATA - Complete database rebuild from xlsx
 * This script:
 * 1. Clears and imports content_hero_new
 * 2. Clears and imports content_header_new
 * 3. Clears and imports content_cta_new
 * 4. Clears and imports content_faq_new
 * 5. Clears and imports content_testimonials_new
 * 6. Clears and imports content_meta_new
 * 7. Updates content_service_pages with correct data from SERVICES_GRID
 *
 * Usage: node FIX_ALL_DATA.js
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

// Service slug mapping from xlsx to code
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
  if (!sheet) {
    console.warn(`  Sheet "${sheetName}" not found`);
    return [];
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

async function clearTable(tableName) {
  const { error } = await supabase.from(tableName).delete().neq('id', -1);
  if (error && !error.message.includes('not find')) {
    console.warn(`  Warning clearing ${tableName}:`, error.message);
  }
}

async function insertData(tableName, data, batchSize = 50) {
  if (!data.length) return { count: 0 };

  let total = 0;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).insert(batch);
    if (error) {
      console.error(`  Error inserting into ${tableName}:`, error.message);
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
  await clearTable('content_hero_new');

  const data = readSheet(workbook, 'HERO');
  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.hero_h1,
    subheadline_spintax: row.hero_sub
  }));

  const result = await insertData('content_hero_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function importHeader(workbook) {
  console.log('\n📄 HEADER/MENU...');
  await clearTable('content_header_new');

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

  const result = await insertData('content_header_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function importCTA(workbook) {
  console.log('\n📄 CTA...');
  await clearTable('content_cta_new');

  const data = readSheet(workbook, 'CTA');
  const rows = data.map(row => ({
    category: row.category,
    headline_spintax: row.cta_h2,
    subheadline_spintax: row.cta_p,
    button_text_spintax: row.cta_btn
  }));

  const result = await insertData('content_cta_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function importFAQ(workbook) {
  console.log('\n📄 FAQ...');
  await clearTable('content_faq_new');

  const data = readSheet(workbook, 'FAQ');
  const rows = data.map(row => ({
    category: row.category,
    faq_id: row.faq_id,
    content: row.content
  }));

  const result = await insertData('content_faq_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function importTestimonials(workbook) {
  console.log('\n📄 TESTIMONIALS...');
  await clearTable('content_testimonials_new');

  const data = readSheet(workbook, 'TESTIMONIALS');
  const rows = data.map(row => ({
    category: row.category,
    testimonial_num: row.testimonial_num,
    testimonial_body: row.testimonial_body,
    testimonial_name: row.testimonial_name,
    rating: 5
  }));

  const result = await insertData('content_testimonials_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function importMeta(workbook) {
  console.log('\n📄 META...');
  await clearTable('content_meta_new');

  const data = readSheet(workbook, 'META');
  const rows = data.map(row => ({
    category: row.category,
    page_type: row.page_type || 'home',
    service_id: row.service_id || null,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc
  }));

  const result = await insertData('content_meta_new', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

async function fixServicePages(workbook) {
  console.log('\n📄 FIXING content_service_pages...');

  const servicesGrid = readSheet(workbook, 'SERVICES_GRID');
  const servicePagesElements = readSheet(workbook, 'SERVICE_PAGES');

  // Group SERVICE_PAGES elements by service_id
  const serviceElements = {};
  servicePagesElements.forEach(row => {
    const key = `${row.category}:${row.service_id}`;
    if (!serviceElements[key]) {
      serviceElements[key] = { elements: [], serviceName: row.service_name };
    }
    serviceElements[key].elements.push({
      order: row.element_order,
      type: row.element_type,
      content: row.content
    });
  });

  // Build rich content from elements
  function buildContentFromElements(elements) {
    elements.sort((a, b) => a.order - b.order);
    const hero = elements.find(e => e.order === 1 && e.type === 'H2');
    const subhead = elements.find(e => e.order === 2 && e.type === 'P');
    const body = elements.filter(e => e.type === 'P').map(e => e.content).join(' ');

    return {
      hero: hero?.content || '',
      subhead: subhead?.content || '',
      body: body || ''
    };
  }

  // Process SERVICES_GRID and match with SERVICE_PAGES elements
  for (const row of servicesGrid) {
    const slug = normalizeSlug(row.service_slug);
    const key = `${row.category}:${row.service_id}`;
    const elements = serviceElements[key];
    const content = elements ? buildContentFromElements(elements.elements) : null;

    // Update content_service_pages
    const updateData = {
      service_title_spintax: row.service_name_spin || row.service_name,
      service_description_spintax: row.svc_grid_desc,
      hero_headline_spintax: content?.hero || row.service_name_spin || row.service_name,
      hero_subheadline_spintax: content?.subhead || row.svc_grid_desc,
      section_body_spintax: content?.body || row.svc_grid_desc
    };

    // Try to update existing row
    const { data: existing } = await supabase
      .from('content_service_pages')
      .select('id')
      .eq('category', row.category)
      .eq('service_slug', slug)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('content_service_pages')
        .update(updateData)
        .eq('id', existing.id);
    } else {
      // Insert new row
      await supabase
        .from('content_service_pages')
        .insert({
          category: row.category,
          service_slug: slug,
          ...updateData
        });
    }
  }

  console.log(`  ✅ Updated ${servicesGrid.length} service pages`);
  return { count: servicesGrid.length };
}

async function importHomeArticle(workbook) {
  console.log('\n📄 HOME_ARTICLE...');

  // Check if table exists
  const { error: checkError } = await supabase
    .from('content_home_article')
    .select('id')
    .limit(1);

  if (checkError && checkError.message.includes('does not exist')) {
    console.log('  ⚠️ Table content_home_article does not exist, skipping...');
    console.log('  Run REBUILD_DATABASE.sql first to create this table.');
    return { count: 0, skipped: true };
  }

  await clearTable('content_home_article');

  const data = readSheet(workbook, 'HOME_ARTICLE');
  const rows = data.map(row => ({
    category: row.category,
    element_order: row.element_order,
    element_type: row.element_type,
    content: row.content
  }));

  const result = await insertData('content_home_article', rows);
  console.log(`  ✅ ${result.count} rows imported`);
  return result;
}

// =====================================================
// Main
// =====================================================

async function main() {
  console.log('═'.repeat(80));
  console.log('🔧 FIX ALL DATA - Complete Database Import');
  console.log('═'.repeat(80));
  console.log(`📁 Reading: ${XLSX_FILE}`);
  console.log(`🔗 Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

  const workbook = XLSX.readFile(XLSX_FILE);
  console.log(`📊 Sheets: ${workbook.SheetNames.join(', ')}`);

  const results = {};

  // Import all data
  results.hero = await importHero(workbook);
  results.header = await importHeader(workbook);
  results.cta = await importCTA(workbook);
  results.faq = await importFAQ(workbook);
  results.testimonials = await importTestimonials(workbook);
  results.meta = await importMeta(workbook);
  results.servicePages = await fixServicePages(workbook);
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
    } else if (result.skipped) {
      console.log(`  ⚠️ ${key}: SKIPPED (table missing)`);
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
  } else {
    console.log('\n⚠️ Some imports failed. Check logs above.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
