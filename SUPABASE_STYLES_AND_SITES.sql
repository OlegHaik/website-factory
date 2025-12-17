-- Dynamic theming + content blueprint support
-- Run this in Supabase SQL editor.

-- STEP 10: Create CONFIG_STYLES table
CREATE TABLE IF NOT EXISTS config_styles (
  id SERIAL PRIMARY KEY,
  theme_name TEXT,
  warm_dark TEXT DEFAULT '#450A0A',
  warm_med TEXT DEFAULT '#7F1D1D',
  warm_bright TEXT DEFAULT '#BA1C1C',
  cool_dark TEXT DEFAULT '#1E3A5F',
  cool_med TEXT DEFAULT '#1E3A8A',
  cool_accent TEXT DEFAULT '#312E81',
  accent_primary TEXT DEFAULT '#BA1C1C',
  accent_hover TEXT DEFAULT '#2CD4BD',
  font_family TEXT DEFAULT 'Plus Jakarta Sans'
);

-- Example themes
INSERT INTO config_styles (
  id,
  theme_name,
  warm_dark,
  warm_med,
  warm_bright,
  cool_dark,
  cool_med,
  cool_accent,
  accent_primary,
  accent_hover,
  font_family
) VALUES
(1, 'Original Fire & Ice', '#450A0A', '#7F1D1D', '#BA1C1C', '#172554', '#1E3A8A', '#312E81', '#BA1C1C', '#2CD4BD', 'Plus Jakarta Sans'),
(2, 'Deep Sea Aurora', '#042F2E', '#115E59', '#14B8A6', '#0C4A6E', '#0369A1', '#0D9488', '#0D9488', '#2DD4BF', 'Plus Jakarta Sans'),
(3, 'Royal Sunset', '#422006', '#713F12', '#EAB308', '#312E81', '#4338CA', '#CA8A04', '#CA8A04', '#FDE047', 'Poppins')
ON CONFLICT (id) DO NOTHING;

-- STEP 1 / 11: Add style_id + content_map to sites
ALTER TABLE sites ADD COLUMN IF NOT EXISTS style_id INT DEFAULT 1;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS content_map JSONB DEFAULT '{}';

-- Optional FK (only if you want strict referential integrity)
-- ALTER TABLE sites
--   ADD CONSTRAINT sites_style_id_fkey
--   FOREIGN KEY (style_id)
--   REFERENCES config_styles(id);

-- Backfill
UPDATE sites SET style_id = 1 WHERE style_id IS NULL;

-- Example content_map shape
-- UPDATE sites
-- SET content_map = '{"header":5,"hero":12,"services":3,"faq":8,"testimonials":2,"cta":15}'::jsonb
-- WHERE id = 123;
