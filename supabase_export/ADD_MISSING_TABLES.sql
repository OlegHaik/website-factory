-- =====================================================
-- ДОДАТКОВІ ТАБЛИЦІ (якщо вже запущено FULL_SCHEMA.sql)
-- Виконайте в Supabase SQL Editor
-- =====================================================

-- CONFIG_STYLES (160 theme presets)
CREATE TABLE IF NOT EXISTS config_styles (
  id SERIAL PRIMARY KEY,
  theme_name TEXT,
  warm_dark TEXT,
  warm_med TEXT,
  warm_bright TEXT,
  cool_dark TEXT,
  cool_med TEXT,
  cool_accent TEXT,
  accent_primary TEXT,
  accent_hover TEXT,
  font_family TEXT
);

ALTER TABLE config_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON config_styles FOR SELECT USING (true);

-- CONTENT_BLOCKS (270 universal content blocks)
CREATE TABLE IF NOT EXISTS content_blocks (
  id SERIAL PRIMARY KEY,
  site_id INTEGER,
  category_key TEXT,
  page_type TEXT,
  section_key TEXT,
  element_type TEXT,
  element_order INTEGER,
  value_spintax_html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  global_order INTEGER
);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON content_blocks FOR SELECT USING (true);

-- =====================================================
-- DONE! Now run: node IMPORT_TO_NEW_SUPABASE.js
-- =====================================================
