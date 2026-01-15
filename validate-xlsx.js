/**
 * XLSX Validator - перевіряє XLSX файл перед імпортом
 * 
 * Перевіряє:
 * - Чи існують потрібні sheets
 * - Чи правильні назви колонок
 * - Чи є пусті обов'язкові поля
 * - Чи валідний JSON у JSON колонках
 * 
 * ВИКОРИСТАННЯ:
 * node validate-xlsx.js your-file.xlsx
 */

const XLSX = require('xlsx')
const path = require('path')

// Очікувана структура таблиць
const EXPECTED_SCHEMAS = {
  content_hero: {
    required: ['id', 'category', 'headline_spintax', 'subheadline_spintax'],
    optional: ['chat_button_spintax'],
    jsonColumns: []
  },
  content_header: {
    required: ['id'],
    optional: ['nav_home', 'nav_services', 'nav_areas', 'nav_contact', 'call_button_text', 'our_links_spintax'],
    jsonColumns: []
  },
  content_services: {
    required: ['id'],
    optional: [
      'water_title', 'water_description',
      'fire_title', 'fire_description',
      'mold_title', 'mold_description',
      'category'
    ],
    jsonColumns: []
  },
  content_faq: {
    required: ['id', 'category', 'heading_spintax'],
    optional: ['items'],
    jsonColumns: ['items']
  },
  content_testimonials: {
    required: ['id', 'category', 'heading_spintax', 'subheading_spintax'],
    optional: ['items'],
    jsonColumns: ['items']
  },
  content_service_pages: {
    required: ['id', 'service_slug', 'category'],
    optional: [
      'hero_headline_spintax',
      'hero_subheadline_spintax',
      'section_headline_spintax',
      'section_body_spintax'
    ],
    jsonColumns: []
  },
  content_blocks: {
    required: ['id', 'category_key', 'page_type', 'section_key', 'element_type', 'element_order', 'value_spintax_html'],
    optional: ['site_id', 'global_order'],
    jsonColumns: []
  }
}

function validateSheet(sheetName, data, schema) {
  const errors = []
  const warnings = []
  
  if (data.length === 0) {
    warnings.push(`Sheet is empty`)
    return { errors, warnings, valid: true }
  }
  
  // Перевірка колонок
  const firstRow = data[0]
  const actualColumns = Object.keys(firstRow)
  
  // Перевірка обов'язкових колонок
  for (const required of schema.required) {
    if (!actualColumns.includes(required)) {
      errors.push(`Missing required column: ${required}`)
    }
  }
  
  // Перевірка кожного рядка
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2 // +2 because: array index 0 + header row
    
    // Перевірка обов'язкових полів
    for (const required of schema.required) {
      const value = row[required]
      if (value === null || value === undefined || value === '') {
        errors.push(`Row ${rowNum}: Required field "${required}" is empty`)
      }
    }
    
    // Перевірка JSON полів
    for (const jsonCol of schema.jsonColumns) {
      const value = row[jsonCol]
      if (value && typeof value === 'string') {
        try {
          JSON.parse(value)
        } catch (e) {
          errors.push(`Row ${rowNum}: Invalid JSON in "${jsonCol}": ${e.message}`)
        }
      }
    }
    
    // Перевірка category values
    if (row.category) {
      const validCategories = [
        'water_damage', 'roofing', 'mold_remediation', 'plumbing',
        'bathroom_remodel', 'kitchen_remodel', 'air_duct', 'chimney',
        'locksmith', 'garage_door', 'adu_builder', 'pool_contractor'
      ]
      if (!validCategories.includes(row.category)) {
        warnings.push(`Row ${rowNum}: Unusual category value "${row.category}"`)
      }
    }
  }
  
  return {
    errors,
    warnings,
    valid: errors.length === 0
  }
}

function validateXlsx(filePath) {
  console.log(`\n🔍 Validating: ${filePath}\n`)
  
  if (!require('fs').existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }
  
  const workbook = XLSX.readFile(filePath)
  const results = []
  let totalErrors = 0
  let totalWarnings = 0
  
  console.log(`📊 Found ${workbook.SheetNames.length} sheets\n`)
  
  for (const sheetName of workbook.SheetNames) {
    console.log(`📄 Sheet: ${sheetName}`)
    
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`   Rows: ${data.length}`)
    
    const schema = EXPECTED_SCHEMAS[sheetName]
    if (!schema) {
      console.log(`   ⚠️  No validation schema defined for this sheet`)
      console.log(`   💡 Define schema in validate-xlsx.js to enable validation\n`)
      continue
    }
    
    const result = validateSheet(sheetName, data, schema)
    results.push({ sheetName, ...result })
    
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length
    
    if (result.valid) {
      console.log(`   ✅ Valid`)
    } else {
      console.log(`   ❌ ${result.errors.length} errors`)
    }
    
    if (result.warnings.length > 0) {
      console.log(`   ⚠️  ${result.warnings.length} warnings`)
    }
    
    console.log()
  }
  
  // Детальний звіт
  console.log(`\n${'='.repeat(60)}`)
  console.log(`VALIDATION REPORT`)
  console.log(`${'='.repeat(60)}\n`)
  
  for (const result of results) {
    if (result.errors.length === 0 && result.warnings.length === 0) continue
    
    console.log(`📄 ${result.sheetName}:`)
    
    if (result.errors.length > 0) {
      console.log(`\n   ❌ ERRORS:`)
      result.errors.forEach(err => console.log(`      - ${err}`))
    }
    
    if (result.warnings.length > 0) {
      console.log(`\n   ⚠️  WARNINGS:`)
      result.warnings.forEach(warn => console.log(`      - ${warn}`))
    }
    
    console.log()
  }
  
  console.log(`${'='.repeat(60)}`)
  console.log(`Total: ${totalErrors} errors, ${totalWarnings} warnings`)
  console.log(`${'='.repeat(60)}\n`)
  
  if (totalErrors > 0) {
    console.log(`❌ Validation FAILED - fix errors before importing`)
    process.exit(1)
  } else if (totalWarnings > 0) {
    console.log(`⚠️  Validation passed with warnings - review before importing`)
  } else {
    console.log(`✅ Validation PASSED - file is ready for import`)
  }
}

// Run
const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node validate-xlsx.js <file.xlsx>')
  process.exit(1)
}

validateXlsx(filePath)
