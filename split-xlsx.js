/**
 * XLSX Splitter - розділяє великий XLSX файл на менші частини
 * 
 * ВИКОРИСТАННЯ:
 * node split-xlsx.js large-file.xlsx 1000
 * 
 * Створить файли: large-file-part1.xlsx, large-file-part2.xlsx, ...
 */

const XLSX = require('xlsx')
const path = require('path')

function splitXlsx(inputFile, rowsPerFile = 1000) {
  console.log(`📖 Reading ${inputFile}...`)
  
  const workbook = XLSX.readFile(inputFile)
  const baseName = path.basename(inputFile, '.xlsx')
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n📊 Processing sheet: ${sheetName}`)
    
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    if (data.length === 0) {
      console.log(`   ⏭️  Empty sheet, skipping`)
      return
    }
    
    console.log(`   Found ${data.length} rows`)
    
    if (data.length <= rowsPerFile) {
      console.log(`   ✅ No split needed`)
      return
    }
    
    const numParts = Math.ceil(data.length / rowsPerFile)
    console.log(`   ✂️  Splitting into ${numParts} parts...`)
    
    for (let i = 0; i < numParts; i++) {
      const start = i * rowsPerFile
      const end = Math.min((i + 1) * rowsPerFile, data.length)
      const chunk = data.slice(start, end)
      
      // Створюємо новий workbook з одним sheet
      const newWorkbook = XLSX.utils.book_new()
      const newWorksheet = XLSX.utils.json_to_sheet(chunk)
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName)
      
      const outputFile = `${baseName}-${sheetName}-part${i + 1}.xlsx`
      XLSX.writeFile(newWorkbook, outputFile)
      
      console.log(`   ✅ Created ${outputFile} (${chunk.length} rows)`)
    }
  })
  
  console.log('\n✅ Split complete!')
}

// Run
const inputFile = process.argv[2] || 'content.xlsx'
const rowsPerFile = parseInt(process.argv[3]) || 1000

if (!inputFile) {
  console.error('Usage: node split-xlsx.js <file.xlsx> [rows-per-file]')
  process.exit(1)
}

splitXlsx(inputFile, rowsPerFile)
