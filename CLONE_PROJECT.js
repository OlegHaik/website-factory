/**
 * ПОВНА КОПІЯ ПРОЕКТУ - Експорт всіх даних з Supabase
 *
 * Цей скрипт експортує ВСІ дані з поточної БД у JSON файли,
 * які потім можна імпортувати в новий Supabase проект.
 *
 * Запуск: node CLONE_PROJECT.js
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

// Всі таблиці для експорту
const TABLES = [
  'sites',
  'services',
  'service_areas',
  'site_service_areas',
  'site_services',
  'styles',
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
  'content_legal'
];

async function exportTable(tableName) {
  console.log(`📦 Експортую таблицю: ${tableName}...`);

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.log(`  ⚠️  Таблиця ${tableName} не існує або помилка: ${error.message}`);
      return null;
    }

    console.log(`  ✅ ${data.length} записів`);
    return data;
  } catch (err) {
    console.log(`  ❌ Помилка: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Початок експорту даних з Supabase\n');
  console.log(`📍 URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

  // Створюємо директорію для експорту
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  const exportData = {};
  let totalRecords = 0;

  for (const table of TABLES) {
    const data = await exportTable(table);
    if (data !== null) {
      exportData[table] = data;
      totalRecords += data.length;

      // Зберігаємо кожну таблицю окремо
      fs.writeFileSync(
        path.join(EXPORT_DIR, `${table}.json`),
        JSON.stringify(data, null, 2)
      );
    }
  }

  // Зберігаємо все разом
  fs.writeFileSync(
    path.join(EXPORT_DIR, 'ALL_DATA.json'),
    JSON.stringify(exportData, null, 2)
  );

  // Зберігаємо SQL для створення таблиць
  const createTablesSql = fs.readFileSync('./REBUILD_DATABASE.sql', 'utf-8');
  fs.writeFileSync(
    path.join(EXPORT_DIR, 'CREATE_TABLES.sql'),
    createTablesSql
  );

  console.log('\n' + '='.repeat(50));
  console.log(`✅ ЕКСПОРТ ЗАВЕРШЕНО!`);
  console.log(`📊 Всього записів: ${totalRecords}`);
  console.log(`📁 Файли збережено в: ${EXPORT_DIR}/`);
  console.log('='.repeat(50));

  // Генеруємо інструкцію
  console.log('\n📋 НАСТУПНІ КРОКИ:');
  console.log('1. Створіть новий репозиторій на GitHub');
  console.log('2. Створіть новий проект Supabase на https://supabase.com');
  console.log('3. В SQL Editor нового Supabase запустіть CREATE_TABLES.sql');
  console.log('4. Оновіть .env.local з новими ключами Supabase');
  console.log('5. Запустіть: node IMPORT_TO_NEW_SUPABASE.js');
}

main().catch(console.error);
