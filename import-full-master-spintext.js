/**
 * ПОВНИЙ імпорт MASTER_SPINTEXT з використанням ВСІХ даних
 * Використовує нову структуру БД
 */

require('dotenv').config({ path: '.env.local' })

const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Використовуємо нові таблиці (_new suffix) для всіх таблиць
const USE_NEW_TABLES = true
const TABLE_SUFFIX = '_new'

const SHEET_MAPPING = {
  'HERO': {
    table: `content_hero${TABLE_SUFFIX}`,
    conflictKey: 'category',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      headline_spintax: row.hero_h1,
      subheadline_spintax: row.hero_sub,
      chat_button_spintax: '{Contact Us|Email Our Team|Get In Touch}'
    })
  },
  
  'MENU': {
    table: `content_header${TABLE_SUFFIX}`,
    conflictKey: 'category',
    filter: (rows) => {
      // Беремо тільки першу варіацію кожної категорії
      const seen = new Set()
      return rows.filter(row => {
        if (seen.has(row.category)) return false
        seen.add(row.category)
        return true
      })
    },
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      nav_home: row.nav_home || 'Home',
      nav_services: row.nav_services || 'Services',
      nav_areas: row.nav_areas || 'Service Areas',
      nav_contact: row.nav_contact || 'Contact',
      call_button_text: row.nav_cta || 'Call Now',
      our_links_spintax: '{Our Links|Business Links|Find Us Online}'
    })
  },
  
  'CTA': {
    table: `content_cta${TABLE_SUFFIX}`,
    conflictKey: 'category',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      headline_spintax: row.cta_h2,
      subheadline_spintax: row.cta_p,
      chat_button_spintax: row.cta_btn || '{Contact Us|Get Quote}'
    })
  },
  
  'FAQ': {
    table: `content_faq${TABLE_SUFFIX}`,
    conflictKey: 'category,faq_id', // composite key
    transform: (row) => ({
      category: row.category,
      faq_id: row.faq_id,
      content: row.content
    })
  },
  
  'TESTIMONIALS': {
    table: `content_testimonials${TABLE_SUFFIX}`,
    conflictKey: 'category,testimonial_num', // composite key  
    transform: (row) => ({
      category: row.category,
      testimonial_num: row.testimonial_num,
      testimonial_body: row.testimonial_body,
      testimonial_name: row.testimonial_name,
      rating: 5
    })
  },
  
  'SERVICES_GRID': {
    table: `content_services${TABLE_SUFFIX}`,
    conflictKey: 'category,service_id',
    transform: (row) => ({
      category: row.category,
      service_id: row.service_id,
      service_name: row.service_name,
      service_name_spin: row.service_name_spin,
      service_slug: row.service_slug,
      svc_grid_desc: row.svc_grid_desc
    })
  },
  
  'META': {
    table: `content_meta${TABLE_SUFFIX}`,
    conflictKey: 'category,page_type,service_id',
    transform: (row) => ({
      category: row.category,
      page_type: row.page_type || 'homepage',
      service_id: row.service_id || null,
      meta_title: row.meta_title,
      meta_desc: row.meta_desc || row.meta_title || 'SEO description' // fallback якщо null
    })
  }
}

async function importFull(filePath) {
  console.log('📥 ПОВНИЙ імпорт MASTER_SPINTEXT\n')
  console.log(`📄 Файл: ${filePath}`)
  console.log(`🗄️  Таблиці: ${USE_NEW_TABLES ? 'НОВІ (_new)' : 'PRODUCTION'}\n`)
  
  const workbook = XLSX.readFile(filePath)
  let totalSuccess = 0
  let totalErrors = 0
  const results = []
  
  for (const sheetName of workbook.SheetNames) {
    const mapping = SHEET_MAPPING[sheetName]
    
    if (!mapping) {
      console.log(`⏭️  Пропускаємо ${sheetName} (немає mapping)\n`)
      continue
    }
    
    console.log(`📊 Обробка: ${sheetName} → ${mapping.table}`)
    
    const worksheet = workbook.Sheets[sheetName]
    let rows = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`   Знайдено: ${rows.length} рядків`)
    
    if (rows.length === 0) {
      console.log(`   ⏭️  Порожній sheet\n`)
      continue
    }
    
    // Фільтр (для MENU)
    if (mapping.filter) {
      rows = mapping.filter(rows)
      console.log(`   Відфільтровано до: ${rows.length} рядків`)
    }
    
    // Transform
    const transformed = rows.map(mapping.transform).filter(Boolean)
    console.log(`   Трансформовано: ${transformed.length} рядків`)
    
    // Import
    const batchSize = 100
    let success = 0
    let errors = 0
    const errorMessages = []
    
    for (let i = 0; i < transformed.length; i += batchSize) {
      const batch = transformed.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from(mapping.table)
        .upsert(batch, { 
          onConflict: mapping.conflictKey,
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.log(`   ❌ Batch ${i}-${i+batch.length}: ${error.message}`)
        errors += batch.length
        errorMessages.push(error.message)
      } else {
        success += batch.length
      }
    }
    
    totalSuccess += success
    totalErrors += errors
    
    const status = errors === 0 ? '✅' : '⚠️'
    console.log(`   ${status} Успішно: ${success}, Помилок: ${errors}\n`)
    
    results.push({
      sheet: sheetName,
      table: mapping.table,
      total: transformed.length,
      success,
      errors,
      errorMessages: [...new Set(errorMessages)]
    })
  }
  
  console.log('═'.repeat(70))
  console.log('\n🎉 Імпорт завершено!\n')
  console.log(`✅ Успішно імпортовано: ${totalSuccess} рядків`)
  console.log(`❌ Помилок: ${totalErrors} рядків\n`)
  
  if (totalErrors > 0) {
    console.log('⚠️  Таблиці з помилками:')
    results.filter(r => r.errors > 0).forEach(r => {
      console.log(`\n   ${r.sheet} → ${r.table}:`)
      console.log(`      Помилок: ${r.errors}/${r.total}`)
      r.errorMessages.forEach(msg => console.log(`      - ${msg}`))
    })
  }
  
  console.log('\n═'.repeat(70))
  
  if (USE_NEW_TABLES && totalErrors === 0) {
    console.log('\n✅ Все імпортовано в НОВІ таблиці (_new)')
    console.log('\n📝 Наступні кроки:')
    console.log('   1. Перевірте дані: npm run db:check')
    console.log('   2. Якщо все ОК - виконайте rename в SQL:')
    console.log('      ALTER TABLE content_faq RENAME TO content_faq_old;')
    console.log('      ALTER TABLE content_faq_new RENAME TO content_faq;')
    console.log('      (повторіть для інших таблиць)')
  }
}

// Run
const filePath = process.argv[2] || 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx'
importFull(filePath).catch(err => {
  console.error('\n❌ Помилка імпорту:', err.message)
  console.error(err.stack)
  process.exit(1)
})
