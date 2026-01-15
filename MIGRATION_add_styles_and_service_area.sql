-- ============================================
-- ADD STYLE COLUMNS TO SITES TABLE
-- ============================================

-- Add heading_font and body_font columns to sites table
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS heading_font TEXT DEFAULT 'Outfit',
ADD COLUMN IF NOT EXISTS body_font TEXT DEFAULT 'Poppins';

-- Update existing rows with default fonts based on category
UPDATE sites 
SET 
  heading_font = CASE category
    WHEN 'water_damage' THEN 'Outfit'
    WHEN 'roofing' THEN 'Montserrat'
    WHEN 'mold_remediation' THEN 'Raleway'
    WHEN 'chimney' THEN 'Roboto Slab'
    WHEN 'kitchen_remodel' THEN 'Playfair Display'
    WHEN 'bathroom_remodel' THEN 'Lora'
    WHEN 'adu_builder' THEN 'Montserrat'
    WHEN 'air_conditioning' THEN 'Open Sans'
    WHEN 'air_duct' THEN 'Rubik'
    WHEN 'garage_door' THEN 'Nunito'
    WHEN 'heating' THEN 'Source Sans Pro'
    WHEN 'locksmith' THEN 'Inter'
    WHEN 'pest_control' THEN 'Karla'
    WHEN 'plumbing' THEN 'Barlow'
    WHEN 'pool_contractor' THEN 'Quicksand'
    ELSE 'Outfit'
  END,
  body_font = CASE category
    WHEN 'water_damage' THEN 'Poppins'
    WHEN 'roofing' THEN 'Open Sans'
    WHEN 'mold_remediation' THEN 'Merriweather'
    WHEN 'chimney' THEN 'Lora'
    WHEN 'kitchen_remodel' THEN 'Source Sans Pro'
    WHEN 'bathroom_remodel' THEN 'Merriweather'
    WHEN 'adu_builder' THEN 'Open Sans'
    WHEN 'air_conditioning' THEN 'Lato'
    WHEN 'air_duct' THEN 'Inter'
    WHEN 'garage_door' THEN 'Open Sans'
    WHEN 'heating' THEN 'Roboto'
    WHEN 'locksmith' THEN 'Roboto'
    WHEN 'pest_control' THEN 'Open Sans'
    WHEN 'plumbing' THEN 'Lato'
    WHEN 'pool_contractor' THEN 'Nunito'
    ELSE 'Poppins'
  END
WHERE heading_font IS NULL OR body_font IS NULL;

-- ============================================
-- ADD MISSING CONTENT_SERVICE_AREA ROWS
-- ============================================

-- Insert service area content for all 16 categories
INSERT INTO content_service_area (
  category,
  headline_spintax,
  paragraph1_spintax,
  paragraph2_spintax,
  paragraph3_spintax,
  paragraph4_spintax
)
SELECT 
  category,
  -- Use generic template that works for all categories
  REPLACE(REPLACE(
    '{Professional|Trusted|Certified|Local|Experienced} ' || category || ' Services in {{city}}',
    '_', ' '
  ), 'water damage', 'Water Damage'),
  
  'When you need ' || REPLACE(category, '_', ' ') || ' services in {{city}}, {our team|we|our company} is {here to help|ready to assist|standing by}. {Call us|Contact us|Reach out} at {{phone}} for {immediate|fast|prompt|quick} {service|assistance|help}.',
  
  '{{business_name}} has been {serving|supporting|helping} the {{city}} {community|area|region} for {years|many years}. We provide {professional|expert|quality} {service|workmanship} and {excellent customer service|outstanding support}.',
  
  'Our {team|technicians|professionals} {arrive|respond|are on site} {quickly|promptly|fast} at your {{city}} {location|property|home}. We {assess|evaluate|inspect} the {situation|problem|issue} and {develop|create|prepare} a {plan|solution|approach} to {resolve|fix|address} it {efficiently|effectively|properly}.',
  
  '{Call|Contact} {{business_name}} today at {{phone}} for {service|assistance} in {{city}}. Our team is {available|here|ready} to help you {24/7|around the clock}.'
FROM (
  SELECT DISTINCT category FROM content_hero
) categories
WHERE category NOT IN (
  SELECT category FROM content_service_area
)
ON CONFLICT (category) DO NOTHING;

-- ============================================
-- CREATE STYLES MAPPING TABLE (Optional)
-- ============================================

CREATE TABLE IF NOT EXISTS category_styles (
  id SERIAL PRIMARY KEY,
  category TEXT UNIQUE NOT NULL,
  heading_font TEXT DEFAULT 'Outfit',
  body_font TEXT DEFAULT 'Poppins',
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#3b82f6',
  accent_color TEXT DEFAULT '#60a5fa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default styles for all categories
INSERT INTO category_styles (category, heading_font, body_font, primary_color, secondary_color, accent_color)
VALUES 
  ('water_damage', 'Outfit', 'Poppins', '#1e40af', '#3b82f6', '#60a5fa'),
  ('roofing', 'Montserrat', 'Open Sans', '#dc2626', '#ef4444', '#f87171'),
  ('mold_remediation', 'Raleway', 'Merriweather', '#047857', '#10b981', '#34d399'),
  ('chimney', 'Roboto Slab', 'Lora', '#92400e', '#d97706', '#f59e0b'),
  ('kitchen_remodel', 'Playfair Display', 'Source Sans Pro', '#7c2d12', '#ea580c', '#fb923c'),
  ('bathroom_remodel', 'Lora', 'Merriweather', '#1e40af', '#3b82f6', '#60a5fa'),
  ('adu_builder', 'Montserrat', 'Open Sans', '#be123c', '#e11d48', '#f43f5e'),
  ('air_conditioning', 'Open Sans', 'Lato', '#0369a1', '#0284c7', '#0ea5e9'),
  ('air_duct', 'Rubik', 'Inter', '#4338ca', '#4f46e5', '#6366f1'),
  ('garage_door', 'Nunito', 'Open Sans', '#475569', '#64748b', '#94a3b8'),
  ('heating', 'Source Sans Pro', 'Roboto', '#b91c1c', '#dc2626', '#ef4444'),
  ('locksmith', 'Inter', 'Roboto', '#a16207', '#ca8a04', '#eab308'),
  ('pest_control', 'Karla', 'Open Sans', '#065f46', '#047857', '#059669'),
  ('plumbing', 'Barlow', 'Lato', '#1e3a8a', '#1e40af', '#2563eb'),
  ('pool_contractor', 'Quicksand', 'Nunito', '#0c4a6e', '#075985', '#0284c7')
ON CONFLICT (category) DO UPDATE SET
  heading_font = EXCLUDED.heading_font,
  body_font = EXCLUDED.body_font,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  updated_at = NOW();

-- Enable RLS
ALTER TABLE category_styles ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY IF NOT EXISTS "Allow public read on category_styles" 
  ON category_styles FOR SELECT 
  USING (true);

COMMENT ON TABLE category_styles IS 'Stores font and color styles for each category';
