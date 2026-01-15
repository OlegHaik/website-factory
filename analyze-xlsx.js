/**
 * XLSX File Analyzer - аналізує структуру XLSX файлу
 * Перевіряє чи підходить файл під наш імпорт скрипт
 * 
 * ВИКОРИСТАННЯ:
 * node analyze-xlsx.js your-file.xlsx
 */

const XLSX = require('xlsx')
const fs = require('fs')

// Очікувані таблиці та їх структура
const EXPECTED_TABLES = {
  content_hero: {
    required: ['id', 'category', 'headline_spintax', 'subheadline_spintax'],
    optional: ['chat_button_spintax'],
    description: 'Hero секція homepage'
  },
  content_header: {
    required: ['id'],
    optional: ['category', 'nav_home', 'nav_services', 'nav_areas', 'nav_contact', 'call_button_text', 'our_links_spintax'],
    description: 'Header та навігація'
  },
  content_services: {
    required: ['id'],
    optional: ['category', 'water_title', 'water_description', 'fire_title', 'mold_title'],
    description: 'Описи послуг'
  },
  content_cta: {
    required: ['id', 'category', 'headline_spintax', 'subheadline_spintax'],
    optional: ['chat_button_spintax'],
    description: 'Call-to-action секція'
  },
  content_seo_body: {
    required: ['id', 'category'],
    optional: ['intro_spintax', 'why_choose_title_spintax', 'why_choose_spintax', 'process_title_spintax', 'process_spintax'],
    description: 'SEO текст для homepage'
  },
  content_faq: {
    required: ['id', 'category', 'heading_spintax'],
    optional: ['items'],
    description: 'FAQ секція'
  },
  content_testimonials: {
    required: ['id', 'category', 'heading_spintax', 'subheading_spintax'],
    optional: ['items'],
    description: 'Відгуки клієнтів'
  },
  content_service_pages: {
    required: ['id', 'category', 'service_slug'],
    optional: ['service_title_spintax', 'hero_headline_spintax', 'section_body_spintax'],
    description: 'Сторінки послуг'
  },
  content_service_area: {
    required: ['id', 'category'],
    optional: ['headline_spintax', 'paragraph1_spintax', 'why_city_headline_spintax'],
    description: 'Сторінки локацій'
  },
  content_blocks: {
    required: ['id', 'category_key', 'page_type', 'section_key', 'element_type', 'element_order', 'value_spintax_html'],
    optional: ['global_order', 'site_id'],
    description: 'Structured content blocks'
  },
  content_meta: {
    required: ['id', 'category', 'page_type'],
    optional: ['title_spintax', 'description_spintax'],
    description: 'Meta tags для SEO'
  }
}

const VALID_CATEGORIES = [
  'water_damage', 'roofing', 'mold_remediation', 'plumbing',
  'bathroom_remodel', 'kitchen_remodel', 'air_duct', 'chimney',
  'locksmith', 'garage_door', 'adu_builder', 'pool_contractor'
]

function analyzeSheet(sheetName, data, expectedSchema) {
  const issues = []
  const warnings = []
  const info = []
  
  if (data.length === 0) {
    warnings.push('Sheet порожній')
    return { issues, warnings, info, compatible: true }
  }
  
  // Перевірка колонок
  const actualColumns = Object.keys(data[0] || {})
  const missingRequired = expectedSchema.required.filter(col => !actualColumns.includes(col))
  
  if (missingRequired.length > 0) {
    issues.push(`Відсутні обов'язкові колонки: ${missingRequired.join(', ')}`)
  }
  
  // Інфо про знайдені колонки
  const foundOptional = expectedSchema.optional.filter(col => actualColumns.includes(col))
  if (foundOptional.length > 0) {
    info.push(`Знайдено опціональних колонок: ${foundOptional.length}`)
  }
  
  // Перевірка даних
  let emptyIds = 0
  let invalidCategories = 0
  let emptyRequired = 0
  
  data.forEach((row, idx) => {
    // Перевірка ID
    if (!row.id || row.id === '') {
      emptyIds++
    }
    
    // Перевірка category
    if (row.category && !VALID_CATEGORIES.includes(row.category)) {
      invalidCategories++
    }
    
    // Перевірка обов'язкових полів
    expectedSchema.required.forEach(col => {
      if (row[col] === null || row[col] === undefined || row[col] === '') {
        emptyRequired++
      }
    })
  })
  
  if (emptyIds > 0) {
    issues.push(`${emptyIds} рядків без ID`)
  }
  
  if (invalidCategories > 0) {
    warnings.push(`${invalidCategories} рядків з невідомою категорією`)
  }
  
  if (emptyRequired > 0) {
    warnings.push(`${emptyRequired} випадків порожніх обов'язкових полів`)
  }
  
  // Перевірка спінтексту
  let spintaxFound = 0
  let variablesFound = 0
  
  actualColumns.forEach(col => {
    if (col.includes('spintax')) {
      data.forEach(row => {
        const value = String(row[col] || '')
        if (value.includes('{') && value.includes('|')) spintaxFound++
        if (value.includes('{{') && value.includes('}}')) variablesFound++
      })
    }
  })
  
  if (spintaxFound > 0) {
    info.push(`Знайдено спінтекст у ${spintaxFound} клітинках`)
  }
  
  if (variablesFound > 0) {
    info.push(`Знайдено змінні у ${variablesFound} клітинках`)
  }
  
  const compatible = issues.length === 0
  
  return { issues, warnings, info, compatible }
}

function analyzeXlsx(filePath) {
  console.log('🔍 Аналіз XLSX файлу\n')
  console.log(`📄 Файл: ${filePath}\n`)
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ Файл не знайдено!')
    process.exit(1)
  }
  
  const workbook = XLSX.readFile(filePath)
  const sheetNames = workbook.SheetNames
  
  console.log(`📊 Знайдено ${sheetNames.length} sheets:\n`)
  
  let totalIssues = 0
  let totalWarnings = 0
  let compatibleSheets = 0
  let unknownSheets = []
  let recognizedSheets = []
  
  const results = []
  
  sheetNames.forEach(sheetName => {
    console.log(`${'='.repeat(70)}`)
    console.log(`📋 Sheet: ${sheetName}`)
    
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`   Рядків: ${data.length}`)
    
    if (data.length > 0) {
      const columns = Object.keys(data[0])
      console.log(`   Колонок: ${columns.length}`)
      console.log(`   Колонки: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}`)
    }
    
    const expectedSchema = EXPECTED_TABLES[sheetName]
    
    if (!expectedSchema) {
      unknownSheets.push(sheetName)
      console.log(`\n   ⚠️  Невідомий sheet (не знайдено у схемі)`)
      console.log(`   💡 Можливо, це кастомна таблиця або помилка у назві`)
    } else {
      recognizedSheets.push(sheetName)
      console.log(`\n   ℹ️  ${expectedSchema.description}`)
      
      const analysis = analyzeSheet(sheetName, data, expectedSchema)
      results.push({ sheetName, ...analysis })
      
      if (analysis.compatible) {
        compatibleSheets++
        console.log(`   ✅ Сумісний з імпортом`)
      } else {
        console.log(`   ❌ Є проблеми`)
      }
      
      if (analysis.issues.length > 0) {
        console.log(`\n   🚨 ПРОБЛЕМИ:`)
        analysis.issues.forEach(issue => console.log(`      - ${issue}`))
        totalIssues += analysis.issues.length
      }
      
      if (analysis.warnings.length > 0) {
        console.log(`\n   ⚠️  Попередження:`)
        analysis.warnings.forEach(warn => console.log(`      - ${warn}`))
        totalWarnings += analysis.warnings.length
      }
      
      if (analysis.info.length > 0) {
        console.log(`\n   ℹ️  Інформація:`)
        analysis.info.forEach(inf => console.log(`      - ${inf}`))
      }
    }
    
    console.log('')
  })
  
  // Фінальний звіт
  console.log(`${'='.repeat(70)}`)
  console.log(`\n📊 ПІДСУМОК:\n`)
  
  console.log(`Всього sheets: ${sheetNames.length}`)
  console.log(`Розпізнано: ${recognizedSheets.length}`)
  console.log(`Невідомих: ${unknownSheets.length}`)
  console.log(`Сумісних: ${compatibleSheets}`)
  console.log(`Проблем: ${totalIssues}`)
  console.log(`Попереджень: ${totalWarnings}`)
  
  if (unknownSheets.length > 0) {
    console.log(`\n⚠️  Невідомі sheets:`)
    unknownSheets.forEach(s => console.log(`   - ${s}`))
    console.log(`\n💡 Ці sheets будуть проігноровані при імпорті`)
    console.log(`   Перевірте правильність назв (має бути точно як у схемі)`)
  }
  
  console.log(`\n${'='.repeat(70)}`)
  
  if (totalIssues === 0) {
    console.log(`\n✅ ФАЙЛ ГОТОВИЙ ДО ІМПОРТУ!`)
    console.log(`\nЗапустіть:`)
    console.log(`   npm run import:validate ${filePath}`)
    console.log(`   npm run import ${filePath}`)
  } else {
    console.log(`\n❌ ФАЙЛ МАЄ ПРОБЛЕМИ`)
    console.log(`\nВиправте проблеми та запустіть знову:`)
    console.log(`   node analyze-xlsx.js ${filePath}`)
  }
  
  if (totalWarnings > 0 && totalIssues === 0) {
    console.log(`\n⚠️  Є попередження, але файл можна імпортувати`)
    console.log(`   Перегляньте попередження вище та вирішіть чи це проблема`)
  }
  
  // Рекомендації
  console.log(`\n💡 РЕКОМЕНДАЦІЇ:\n`)
  
  if (recognizedSheets.length === 0) {
    console.log(`   ❌ Жоден sheet не розпізнано!`)
    console.log(`      Перевірте назви sheets - вони мають точно відповідати:`)
    Object.keys(EXPECTED_TABLES).forEach(name => {
      console.log(`      - ${name}`)
    })
  } else {
    console.log(`   ✅ Розпізнано ${recognizedSheets.length} sheets`)
  }
  
  const missingTables = Object.keys(EXPECTED_TABLES).filter(
    t => !recognizedSheets.includes(t)
  )
  
  if (missingTables.length > 0) {
    console.log(`\n   ℹ️  Відсутні sheets (не обов'язкові):`)
    missingTables.forEach(t => {
      console.log(`      - ${t} (${EXPECTED_TABLES[t].description})`)
    })
  }
  
  console.log(`\n${'='.repeat(70)}\n`)
}

// Run
const filePath = process.argv[2]

if (!filePath) {
  console.error('Використання: node analyze-xlsx.js <file.xlsx>')
  console.log('\nПриклад:')
  console.log('   node analyze-xlsx.js my-spintax-content.xlsx')
  process.exit(1)
}

try {
  analyzeXlsx(filePath)
} catch (err) {
  console.error('\n❌ Помилка:', err.message)
  console.error('\nМожливо:')
  console.error('   - Файл пошкоджений')
  console.error('   - Файл не є XLSX форматом')
  console.error('   - Немає доступу до файлу')
  process.exit(1)
}
