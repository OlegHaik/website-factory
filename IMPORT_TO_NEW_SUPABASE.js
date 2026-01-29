/**
 * ІМПОРТ ДАНИХ В НОВИЙ SUPABASE
 *
 * ПЕРЕД ЗАПУСКОМ:
 * 1. Створіть новий проект Supabase
 * 2. В SQL Editor запустіть supabase_export/CREATE_TABLES.sql
 * 3. Оновіть .env.local з НОВИМИ ключами:
 *    - NEXT_PUBLIC_SUPABASE_URL=https://NEW-PROJECT.supabase.co
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *    - SUPABASE_SERVICE_ROLE_KEY=...
 *
 * Запуск: node IMPORT_TO_NEW_SUPABASE.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EXPORT_DIR = './supabase_export';

// Порядок імпорту (залежності!)
const IMPORT_ORDER = [
  'sites',           // Основна таблиця (692)
  'services',        // Залежить від sites
  'service_areas',   // Залежить від sites
  'site_service_areas',
  'site_services',
  'styles',          // 6 category styles
  'config_styles',   // 160 theme presets
  'content_blocks',  // 270 universal content blocks

  // _new версії таблиць
  'content_hero_new',
  'content_header_new',
  'content_cta_new',
  'content_faq_new',
  'content_testimonials_new',
  'content_meta_new',
  'content_services_new',
  'content_home_article',
  'content_service_pages_elements',
  'content_area_pages',
  'content_feedback',
  'content_legal',

  // Legacy таблиці (без _new) - використовуються в коді
  'content_meta',           // 176
  'content_service_pages',  // 96
  'content_service_area',   // 16
  'content_questionnaire',  // 10
  'content_seo_body',       // 11
  'content_hero',           // 16
  'content_header',         // 16
  'content_cta',            // 16
  'content_faq',            // 192
  'content_testimonials',   // 100
  'content_services',       // 96
];

async function importTable(tableName) {
  const filePath = path.join(EXPORT_DIR, `${tableName}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  Файл ${filePath} не знайдено, пропускаю...`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!data || data.length === 0) {
    console.log(`  ⚠️  Таблиця ${tableName} порожня, пропускаю...`);
    return 0;
  }

  console.log(`📥 Імпортую ${tableName}: ${data.length} записів...`);

  // Для таблиці sites - зберігаємо ID для збереження зв'язків
  // Для інших таблиць - видаляємо ID щоб SERIAL працював
  const cleanData = data.map(row => {
    const clean = { ...row };
    if (tableName !== 'sites') {
      delete clean.id;
    }
    return clean;
  });

  // Імпортуємо батчами по 500 записів
  const BATCH_SIZE = 500;
  let imported = 0;

  for (let i = 0; i < cleanData.length; i += BATCH_SIZE) {
    const batch = cleanData.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from(tableName)
      .upsert(batch, {
        onConflict: getConflictKey(tableName),
        ignoreDuplicates: false
      });

    if (error) {
      console.log(`  ❌ Помилка: ${error.message}`);
      // Пробуємо по одному запису
      for (const record of batch) {
        const { error: singleError } = await supabase
          .from(tableName)
          .insert(record);
        if (!singleError) imported++;
      }
    } else {
      imported += batch.length;
    }
  }

  console.log(`  ✅ Імпортовано: ${imported}`);
  return imported;
}

function getConflictKey(tableName) {
  const conflictKeys = {
    'sites': 'id',
    'services': 'id',
    'service_areas': 'id',
    'site_service_areas': 'id',
    'site_services': 'id',
    'styles': 'id',
    'content_hero_new': 'category',
    'content_header_new': 'category',
    'content_cta_new': 'category',
    'content_faq_new': 'category,faq_id',
    'content_testimonials_new': 'category,testimonial_num',
    'content_meta_new': 'id',
    'content_services_new': 'category,service_id',
    'content_home_article': 'category,element_order',
    'content_service_pages_elements': 'category,service_id,element_order',
    'content_area_pages': 'category,element_order',
    'content_feedback': 'category,element_order',
    'content_legal': 'category,legal_type'
  };
  return conflictKeys[tableName] || 'id';
}

async function main() {
  console.log('🚀 ІМПОРТ ДАНИХ В НОВИЙ SUPABASE\n');
  console.log(`📍 URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

  // Перевіряємо чи є експортовані дані
  if (!fs.existsSync(EXPORT_DIR)) {
    console.log('❌ Директорія supabase_export/ не знайдена!');
    console.log('   Спочатку запустіть: node CLONE_PROJECT.js');
    process.exit(1);
  }

  let totalImported = 0;

  for (const table of IMPORT_ORDER) {
    const count = await importTable(table);
    totalImported += count;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ ІМПОРТ ЗАВЕРШЕНО!`);
  console.log(`📊 Всього імпортовано: ${totalImported} записів`);
  console.log('='.repeat(50));
}

main().catch(console.error);
