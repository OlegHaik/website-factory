-- ========================================
-- COMPLETE DATABASE RESTORATION
-- Execute this SQL in Supabase SQL Editor
-- ========================================

-- Drop existing tables if needed (CAREFUL!)
-- DROP TABLE IF EXISTS content_cta_new CASCADE;
-- DROP TABLE IF EXISTS content_faq_new CASCADE;
-- DROP TABLE IF EXISTS content_header_new CASCADE;
-- DROP TABLE IF EXISTS content_hero_new CASCADE;
-- DROP TABLE IF EXISTS content_meta_new CASCADE;
-- DROP TABLE IF EXISTS content_services_new CASCADE;
-- DROP TABLE IF EXISTS content_testimonials_new CASCADE;
-- DROP TABLE IF EXISTS service_pages CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS styles CASCADE;

-- 1. Styles table (category-specific colors and fonts)
CREATE TABLE IF NOT EXISTS styles (
  id SERIAL PRIMARY KEY,
  category TEXT UNIQUE NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#0066cc',
  secondary_color TEXT NOT NULL DEFAULT '#004080',
  accent_color TEXT NOT NULL DEFAULT '#ff6600',
  font_heading TEXT NOT NULL DEFAULT 'Inter',
  font_body TEXT NOT NULL DEFAULT 'Inter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Content Hero (homepage hero section)
CREATE TABLE IF NOT EXISTS content_hero_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  heading_spintax TEXT NOT NULL,
  subheading_spintax TEXT,
  cta_text_spintax TEXT,
  cta_url TEXT DEFAULT '/contact',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_key)
);

-- 3. Content Header (navigation and logo)
CREATE TABLE IF NOT EXISTS content_header_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  logo_text_spintax TEXT,
  tagline_spintax TEXT,
  phone_display_spintax TEXT,
  cta_text_spintax TEXT,
  nav_home_spintax TEXT DEFAULT 'Home',
  nav_services_spintax TEXT DEFAULT 'Services',
  nav_about_spintax TEXT DEFAULT 'About',
  nav_contact_spintax TEXT DEFAULT 'Contact',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_key)
);

-- 4. Content Services (services grid)
CREATE TABLE IF NOT EXISTS content_services_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  service_key TEXT NOT NULL,
  title_spintax TEXT NOT NULL,
  description_spintax TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_key, service_key)
);

-- 5. Content Testimonials
CREATE TABLE IF NOT EXISTS content_testimonials_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  name TEXT NOT NULL,
  location_spintax TEXT NOT NULL DEFAULT '{{city}}, {{state}}',
  text_spintax TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Content FAQ
CREATE TABLE IF NOT EXISTS content_faq_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  question_spintax TEXT NOT NULL,
  answer_spintax TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Content CTA (call-to-action sections)
CREATE TABLE IF NOT EXISTS content_cta_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  heading_spintax TEXT NOT NULL,
  subheading_spintax TEXT,
  button_text_spintax TEXT DEFAULT 'Contact Us',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_key)
);

-- 8. Content Meta (SEO metadata)
CREATE TABLE IF NOT EXISTS content_meta_new (
  id SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL,
  page_type TEXT NOT NULL DEFAULT 'home',
  meta_title_spintax TEXT NOT NULL,
  meta_description_spintax TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_key, page_type)
);

-- 9. Service Pages (individual service pages)
CREATE TABLE IF NOT EXISTS service_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  service_key TEXT NOT NULL,
  title_spintax TEXT NOT NULL,
  description_spintax TEXT NOT NULL,
  meta_title_spintax TEXT,
  meta_description_spintax TEXT,
  body_spintax TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Services (for backwards compatibility)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name_spintax TEXT NOT NULL,
  description_spintax TEXT NOT NULL,
  category TEXT NOT NULL,
  service_key TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, service_key)
);

-- Enable Row Level Security
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_hero_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_header_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_testimonials_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_faq_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cta_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_meta_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON styles;
DROP POLICY IF EXISTS "Allow public read" ON content_hero_new;
DROP POLICY IF EXISTS "Allow public read" ON content_header_new;
DROP POLICY IF EXISTS "Allow public read" ON content_services_new;
DROP POLICY IF EXISTS "Allow public read" ON content_testimonials_new;
DROP POLICY IF EXISTS "Allow public read" ON content_faq_new;
DROP POLICY IF EXISTS "Allow public read" ON content_cta_new;
DROP POLICY IF EXISTS "Allow public read" ON content_meta_new;
DROP POLICY IF EXISTS "Allow public read" ON service_pages;
DROP POLICY IF EXISTS "Allow public read" ON services;

-- Create public read policies
CREATE POLICY "Allow public read" ON styles FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_hero_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_header_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_services_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_testimonials_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_faq_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_cta_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_meta_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON service_pages FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);

-- Insert category styles
INSERT INTO styles (category, primary_color, secondary_color, accent_color, font_heading, font_body)
VALUES 
  ('water_damage', '#0066cc', '#004080', '#00a8ff', 'Inter', 'Inter'),
  ('fire_damage', '#dc2626', '#991b1b', '#ff6b6b', 'Inter', 'Inter'),
  ('mold_remediation', '#16a34a', '#15803d', '#4ade80', 'Inter', 'Inter'),
  ('biohazard', '#9333ea', '#7e22ce', '#c084fc', 'Inter', 'Inter'),
  ('storm_damage', '#ea580c', '#c2410c', '#fb923c', 'Inter', 'Inter'),
  ('reconstruction', '#0891b2', '#0e7490', '#22d3ee', 'Inter', 'Inter')
ON CONFLICT (category) DO UPDATE SET
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  font_heading = EXCLUDED.font_heading,
  font_body = EXCLUDED.font_body;

-- Verify
SELECT 'Tables created successfully!' as status;
SELECT table_name, 
       (SELECT count(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND (table_name LIKE 'content%' OR table_name IN ('styles', 'service_pages', 'services'))
ORDER BY table_name;
