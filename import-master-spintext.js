/**
 * Custom XLSX Import - для MASTER_SPINTEXT файлу
 * Конвертує вашу структуру в структуру Supabase
 */

require('dotenv').config({ path: '.env.local' })

const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Mapping вашої структури -> Supabase структура
const SHEET_MAPPING = {
  'HERO': {
    table: 'content_hero',
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
    table: 'content_header',
    conflictKey: 'category',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      nav_home: row.nav_home || 'Home',
      nav_services: row.nav_services || 'Services',
      nav_areas: row.nav_areas || 'Service Areas',
      nav_contact: row.nav_contact || 'Contact',
      call_button_text: row.nav_cta || 'Call Now',
      our_links_spintax: '{Our Links|Business Links|Find Us Online}'
    }),
    // Берем только первую вариацию для каждой категории
    filter: (rows) => {
      const seen = new Set();
      return rows.filter(row => {
        if (seen.has(row.category)) return false;
        seen.add(row.category);
        return true;
      });
    }
  },
  
  'CTA': {
    table: 'content_cta',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      headline_spintax: row.cta_h2,
      subheadline_spintax: row.cta_p,
      chat_button_spintax: row.cta_btn
    })
  },
  
  'FAQ': {
    table: 'content_faq',
    transform: (row) => ({
      id: row.faq_id || row.category_id,
      category: row.category,
      heading_spintax: '{Frequently Asked Questions|Common Questions|FAQ}',
      items: row.content // Припускаю що це вже JSON
    })
  },
  
  'TESTIMONIALS': {
    table: 'content_testimonials',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      heading_spintax: '{What Our Clients Say|Customer Reviews|Testimonials}',
      subheading_spintax: '{Real reviews|Testimonials} from {satisfied|happy} customers',
      items: JSON.stringify([{
        name: row.testimonial_name,
        location_spintax: '{{city}}, {{state}}',
        text_spintax: row.testimonial_body,
        rating: 5
      }])
    })
  },
  
  'META': {
    table: 'content_meta',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      page_type: row.page_type || 'homepage',
      title_spintax: row.meta_title,
      description_spintax: row.meta_desc
    })
  },
  
  'HOME_ARTICLE': {
    table: 'content_blocks',
    transform: (row) => ({
      id: row.element_order + (row.category_id * 1000), // Унікальний ID
      category_key: row.category,
      page_type: 'home',
      section_key: 'seo_body_article',
      element_type: row.element_type,
      element_order: row.element_order,
      global_order: row.element_order,
      site_id: null,
      value_spintax_html: row.content
    })
  },
  
  'SERVICE_PAGES': {
    table: 'content_service_pages',
    transform: (row) => ({
      id: row.service_id + (row.category_id * 1000),
      category: row.category,
      service_slug: row.service_name?.toLowerCase().replace(/\s+/g, '-'),
      service_title_spintax: row.service_name,
      hero_headline_spintax: row.content || '',
      section_body_spintax: row.content || '',
      element_type: row.element_type,
      element_order: row.element_order
    })
  },
  
  'AREA_PAGES': {
    table: 'content_service_area',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      headline_spintax: row.content,
      element_type: row.element_type,
      element_order: row.element_order
    })
  },
  
  'LEGAL': {
    table: 'content_legal',
    transform: (row) => ({
      id: row.category_id,
      category: row.category,
      page_type: row.legal_type,
      content_spintax: row.content,
      title: row.legal_type === 'privacy' ? 'Privacy Policy' : 'Terms of Use',
      last_updated_spintax: 'Last updated: {{current_date}}'
    })
  }
}

async function importCustomXlsx(filePath) {
  console.log('📥 Custom XLSX Import\n')
  console.log(`📄 File: ${filePath}\n`)
  
  const workbook = XLSX.readFile(filePath)
  let totalSuccess = 0
  let totalErrors = 0
  
  for (const sheetName of workbook.SheetNames) {
    const mapping = SHEET_MAPPING[sheetName]
    
    if (!mapping) {
      console.log(`⏭️  Skipping ${sheetName} (no mapping defined)\n`)
      continue
    }
    
    console.log(`📊 Processing: ${sheetName} → ${mapping.table}`)
    
    const worksheet = workbook.Sheets[sheetName]
    let rows = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`   Found ${rows.length} rows`)
    
    if (rows.length === 0) {
      console.log(`   ⏭️  Empty sheet\n`)
      continue
    }
    
    // Apply filter if exists (для MENU - беремо тільки унікальні категорії)
    if (mapping.filter) {
      rows = mapping.filter(rows)
      console.log(`   Filtered to ${rows.length} rows`)
    }
    
    // Transform data
    const transformed = rows.map(mapping.transform).filter(Boolean)
    console.log(`   Transformed ${transformed.length} rows`)
    
    // Insert in batches
    const batchSize = 100
    let success = 0
    let errors = 0
    
    for (let i = 0; i < transformed.length; i += batchSize) {
      const batch = transformed.slice(i, i + batchSize)
      
      // Визначаємо правильний conflict key для upsert
      const conflictKey = mapping.conflictKey || 'id'
      
      const { error } = await supabase
        .from(mapping.table)
        .upsert(batch, { onConflict: conflictKey })
      
      if (error) {
        console.log(`   ❌ Batch ${i}-${i+batch.length} failed: ${error.message}`)
        errors += batch.length
      } else {
        success += batch.length
      }
    }
    
    totalSuccess += success
    totalErrors += errors
    
    console.log(`   ✅ Imported: ${success}, ❌ Failed: ${errors}\n`)
  }
  
  console.log('🎉 Import complete!')
  console.log(`   ✅ Total success: ${totalSuccess}`)
  console.log(`   ❌ Total errors: ${totalErrors}`)
}

// Run
const filePath = process.argv[2] || 'MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx'
importCustomXlsx(filePath).catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
