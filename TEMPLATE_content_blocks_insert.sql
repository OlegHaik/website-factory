-- Template: INSERT content_blocks with global_order
-- Use this format when importing from XLSX/spintext files.
-- global_order should be the sequential row number in the source file (1, 2, 3, ...)

-- Example INSERT format:
INSERT INTO content_blocks (
  category_key,
  page_type,
  section_key,
  element_type,
  element_order,
  global_order,  -- Sequential order from XLSX (1=first row, 2=second, etc.)
  site_id,
  value_spintax_html
) VALUES
-- Section: seo_body_article for 'roofing' category, home page
-- global_order preserves exact XLSX top-to-bottom order
('roofing', 'home', 'seo_body_article', 'h1', 1, 1, NULL, '{Your|The|Our} Trusted Roofing Experts in {{city}}, {{state}}'),
('roofing', 'home', 'seo_body_article', 'p', 1, 2, NULL, 'First paragraph of intro text with spintax...'),
('roofing', 'home', 'seo_body_article', 'h2', 1, 3, NULL, '{Why Choose|Reasons to Choose} {{business_name}}'),
('roofing', 'home', 'seo_body_article', 'p', 2, 4, NULL, 'Second paragraph explaining benefits...'),
('roofing', 'home', 'seo_body_article', 'bullets', 1, 5, NULL, '• Licensed and insured\r\n• Quality materials\r\n• Experienced crews'),
('roofing', 'home', 'seo_body_article', 'h2', 2, 6, NULL, '{Our Process|How We Work}'),
('roofing', 'home', 'seo_body_article', 'p', 3, 7, NULL, 'Process description paragraph...'),
('roofing', 'home', 'seo_body_article', 'cta', 1, 8, NULL, 'Call {{phone}} today for a free estimate!')
ON CONFLICT (category_key, page_type, section_key, element_type, element_order, COALESCE(site_id, -1))
DO UPDATE SET 
  value_spintax_html = EXCLUDED.value_spintax_html,
  global_order = EXCLUDED.global_order;

-- For site-specific overrides (site_id is set):
-- INSERT INTO content_blocks (
--   category_key, page_type, section_key, element_type, element_order, global_order, site_id, value_spintax_html
-- ) VALUES
-- ('roofing', 'home', 'seo_body_article', 'h1', 1, 1, 123, 'Custom H1 for site 123...');

-- ============================================
-- XLSX/CSV Import Script Pattern (pseudo-code)
-- ============================================
-- When processing XLSX file:
--   1. Read all rows from the sheet/section
--   2. For each row (rowIndex starting at 1):
--      INSERT INTO content_blocks (..., global_order, ...)
--      VALUES (..., rowIndex, ...)
--   3. global_order = rowIndex preserves exact document order
-- ============================================
