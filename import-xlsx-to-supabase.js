/**
 * XLSX to Supabase Importer
 * 
 * Цей скрипт читає XLSX файл з спінтекстом та імпортує дані в Supabase.
 * 
 * ВИКОРИСТАННЯ:
 * 1. Встановіть залежності: npm install xlsx
 * 2. Налаштуйте .env файл з SUPABASE_URL та SUPABASE_SERVICE_ROLE_KEY
 * 3. Запустіть: node import-xlsx-to-supabase.js your-file.xlsx
 * 
 * ВАЖЛИВО: Використовуйте SERVICE_ROLE_KEY (не ANON_KEY) для batch imports
 */

const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// ==================== КОНФІГУРАЦІЯ ====================

const CONFIG = {
  // Назва XLSX файлу (або передайте через аргумент командного рядка)
  defaultXlsxFile: 'spintax-content.xlsx',
  
  // Розмір batch для вставки (для великих файлів)
  batchSize: 100,
  
  // Таблиці та їх mapping (налаштуйте під вашу структуру)
  tableMapping: {
    // Назва sheet в XLSX -> назва таблиці в Supabase
    'content_hero': 'content_hero',
    'content_header': 'content_header',
    'content_services': 'content_services',
    'content_cta': 'content_cta',
    'content_seo_body': 'content_seo_body',
    'content_faq': 'content_faq',
    'content_testimonials': 'content_testimonials',
    'content_service_pages': 'content_service_pages',
    'content_service_area': 'content_service_area',
    'content_meta': 'content_meta',
    'content_legal': 'content_legal',
    'content_blocks': 'content_blocks',
  },
  
  // Колонки, які треба парсити як JSON
  jsonColumns: ['items', 'content_map', 'trust_points_spintax'],
  
  // Колонки, які треба ігнорувати
  ignoreColumns: ['_notes', '_temp', 'notes'],
}

// ==================== SETUP ====================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('   Set: NEXT_PUBLIC_SUPABASE_URL')
  console.error('   Set: SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ==================== HELPER FUNCTIONS ====================

/**
 * Читає XLSX файл та повертає всі sheets як об'єкт
 */
function readXlsxFile(filePath) {
  console.log(`📖 Reading XLSX file: ${filePath}`)
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  
  const workbook = XLSX.readFile(filePath)
  const sheets = {}
  
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      defval: null, // Пусті клітинки = null
      raw: false // Конвертувати все в строки
    })
    sheets[sheetName] = data
  })
  
  return { workbook, sheets }
}

/**
 * Очищує та нормалізує row дані
 */
function normalizeRow(row, tableName) {
  const normalized = {}
  
  for (const [key, value] of Object.entries(row)) {
    // Пропускаємо ignored columns
    if (CONFIG.ignoreColumns.some(ignored => key.toLowerCase().includes(ignored.toLowerCase()))) {
      continue
    }
    
    // Конвертуємо column names (з spaces в snake_case)
    const columnName = key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
    
    // Пропускаємо пусті значення
    if (value === null || value === undefined || value === '') {
      normalized[columnName] = null
      continue
    }
    
    // Парсимо JSON columns
    if (CONFIG.jsonColumns.includes(columnName)) {
      try {
        normalized[columnName] = typeof value === 'string' ? JSON.parse(value) : value
      } catch (e) {
        console.warn(`⚠️  Failed to parse JSON for ${columnName}:`, value)
        normalized[columnName] = value
      }
      continue
    }
    
    // Конвертуємо булеві значення
    if (typeof value === 'string') {
      const lower = value.toLowerCase()
      if (lower === 'true' || lower === 'yes' || lower === '1') {
        normalized[columnName] = true
        continue
      }
      if (lower === 'false' || lower === 'no' || lower === '0') {
        normalized[columnName] = false
        continue
      }
    }
    
    // Trim strings
    normalized[columnName] = typeof value === 'string' ? value.trim() : value
  }
  
  return normalized
}

/**
 * Вставляє дані в Supabase батчами
 */
async function insertBatch(tableName, rows, mode = 'insert') {
  if (rows.length === 0) return { success: 0, errors: 0 }
  
  const batches = []
  for (let i = 0; i < rows.length; i += CONFIG.batchSize) {
    batches.push(rows.slice(i, i + CONFIG.batchSize))
  }
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`  📦 Batch ${i + 1}/${batches.length} (${batch.length} rows)...`)
    
    try {
      let result
      
      if (mode === 'upsert') {
        result = await supabase
          .from(tableName)
          .upsert(batch, { onConflict: 'id' })
      } else {
        result = await supabase
          .from(tableName)
          .insert(batch)
      }
      
      if (result.error) {
        console.error(`  ❌ Batch error:`, result.error.message)
        errorCount += batch.length
      } else {
        console.log(`  ✅ Batch inserted successfully`)
        successCount += batch.length
      }
    } catch (err) {
      console.error(`  ❌ Exception:`, err.message)
      errorCount += batch.length
    }
  }
  
  return { success: successCount, errors: errorCount }
}

/**
 * Truncate table перед імпортом (опційно)
 */
async function truncateTable(tableName) {
  console.log(`  🗑️  Clearing table ${tableName}...`)
  
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 0) // Delete all rows
    
    if (error) {
      console.warn(`  ⚠️  Could not clear table:`, error.message)
      return false
    }
    
    console.log(`  ✅ Table cleared`)
    return true
  } catch (err) {
    console.warn(`  ⚠️  Exception clearing table:`, err.message)
    return false
  }
}

/**
 * Експортує SQL файл (fallback для дуже великих файлів)
 */
function exportToSQL(sheets, outputPath) {
  console.log(`📝 Generating SQL file: ${outputPath}`)
  
  let sql = '-- Generated SQL from XLSX import\n'
  sql += `-- Generated: ${new Date().toISOString()}\n\n`
  
  for (const [sheetName, rows] of Object.entries(sheets)) {
    const tableName = CONFIG.tableMapping[sheetName] || sheetName
    
    if (rows.length === 0) continue
    
    sql += `-- Table: ${tableName}\n`
    
    rows.forEach(row => {
      const normalized = normalizeRow(row, tableName)
      const columns = Object.keys(normalized).join(', ')
      const values = Object.values(normalized).map(v => {
        if (v === null) return 'NULL'
        if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
        if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`
        return `'${String(v).replace(/'/g, "''")}'`
      }).join(', ')
      
      sql += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`
    })
    
    sql += '\n'
  }
  
  fs.writeFileSync(outputPath, sql, 'utf8')
  console.log(`✅ SQL file saved: ${outputPath}`)
}

// ==================== MAIN FUNCTION ====================

async function main() {
  console.log('🚀 XLSX to Supabase Importer\n')
  
  // Отримуємо шлях до файлу
  const xlsxFile = process.argv[2] || CONFIG.defaultXlsxFile
  const xlsxPath = path.resolve(xlsxFile)
  
  // Параметри
  const clearTables = process.argv.includes('--clear')
  const upsertMode = process.argv.includes('--upsert')
  const generateSQL = process.argv.includes('--sql')
  const dryRun = process.argv.includes('--dry-run')
  
  console.log(`📋 Options:`)
  console.log(`   File: ${xlsxPath}`)
  console.log(`   Clear tables: ${clearTables}`)
  console.log(`   Mode: ${upsertMode ? 'upsert' : 'insert'}`)
  console.log(`   Dry run: ${dryRun}`)
  console.log(`   Generate SQL: ${generateSQL}\n`)
  
  // Читаємо XLSX
  const { sheets } = readXlsxFile(xlsxPath)
  const sheetNames = Object.keys(sheets)
  
  console.log(`📊 Found ${sheetNames.length} sheets:`)
  sheetNames.forEach(name => {
    console.log(`   - ${name} (${sheets[name].length} rows)`)
  })
  console.log('')
  
  // Генеруємо SQL якщо потрібно
  if (generateSQL) {
    const sqlPath = path.join(__dirname, 'sql_out', `import-${Date.now()}.sql`)
    if (!fs.existsSync(path.dirname(sqlPath))) {
      fs.mkdirSync(path.dirname(sqlPath), { recursive: true })
    }
    exportToSQL(sheets, sqlPath)
  }
  
  if (dryRun) {
    console.log('\n✅ Dry run completed (no data inserted)')
    return
  }
  
  // Імпортуємо кожен sheet
  let totalSuccess = 0
  let totalErrors = 0
  
  for (const [sheetName, rows] of Object.entries(sheets)) {
    const tableName = CONFIG.tableMapping[sheetName] || sheetName
    
    if (rows.length === 0) {
      console.log(`⏭️  Skipping ${sheetName} (empty)\n`)
      continue
    }
    
    console.log(`🔄 Processing sheet: ${sheetName} → table: ${tableName}`)
    
    // Clear table якщо потрібно
    if (clearTables) {
      await truncateTable(tableName)
    }
    
    // Нормалізуємо rows
    const normalizedRows = rows.map(row => normalizeRow(row, tableName))
    
    // Вставляємо дані
    const { success, errors } = await insertBatch(
      tableName, 
      normalizedRows, 
      upsertMode ? 'upsert' : 'insert'
    )
    
    totalSuccess += success
    totalErrors += errors
    
    console.log(`✅ Sheet ${sheetName} complete: ${success} success, ${errors} errors\n`)
  }
  
  console.log('\n🎉 Import complete!')
  console.log(`   ✅ Success: ${totalSuccess} rows`)
  console.log(`   ❌ Errors: ${totalErrors} rows`)
  
  if (totalErrors > 0) {
    console.log('\n⚠️  Some rows failed. Check:')
    console.log('   - Column names match your database schema')
    console.log('   - Data types are correct')
    console.log('   - Required fields are not null')
  }
}

// ==================== RUN ====================

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message)
  console.error(err.stack)
  process.exit(1)
})
