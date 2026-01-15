-- =====================================================
-- REBUILD DATABASE FROM SCRATCH
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/yxtdgkdwydmvzgbibrrv/sql
-- =====================================================

-- =====================================================
-- 1. DROP ALL CONTENT TABLES (CAREFULLY)
-- These are the tables we're rebuilding
-- =====================================================

DROP TABLE IF EXISTS content_hero_new CASCADE;
DROP TABLE IF EXISTS content_header_new CASCADE;
DROP TABLE IF EXISTS content_cta_new CASCADE;
DROP TABLE IF EXISTS content_faq_new CASCADE;
DROP TABLE IF EXISTS content_testimonials_new CASCADE;
DROP TABLE IF EXISTS content_meta_new CASCADE;
DROP TABLE IF EXISTS content_services_new CASCADE;
DROP TABLE IF EXISTS content_home_article CASCADE;
DROP TABLE IF EXISTS content_service_pages_elements CASCADE;
DROP TABLE IF EXISTS content_area_pages CASCADE;
DROP TABLE IF EXISTS content_feedback CASCADE;
DROP TABLE IF EXISTS content_legal CASCADE;

-- =====================================================
-- 2. CREATE NEW TABLES
-- =====================================================

-- HERO section (16 rows - one per category)
CREATE TABLE content_hero_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HEADER/MENU section (16 rows - one per category with spintax)
CREATE TABLE content_header_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  nav_home TEXT DEFAULT 'Home',
  nav_services TEXT DEFAULT 'Services',
  nav_areas TEXT DEFAULT 'Areas',
  nav_contact TEXT DEFAULT 'Contact',
  call_button_text TEXT DEFAULT 'Call Now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA section (16 rows - one per category)
CREATE TABLE content_cta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  button_text_spintax TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ section (192 rows - 12 Q/A pairs per category)
CREATE TABLE content_faq_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  faq_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, faq_id)
);

-- TESTIMONIALS (100+ rows)
CREATE TABLE content_testimonials_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  testimonial_num INTEGER NOT NULL,
  testimonial_body TEXT NOT NULL,
  testimonial_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, testimonial_num)
);

-- META tags (176 rows)
CREATE TABLE content_meta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  page_type TEXT NOT NULL,
  service_id TEXT,
  meta_title TEXT NOT NULL,
  meta_desc TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index for meta (handles NULL service_id)
CREATE UNIQUE INDEX idx_meta_unique ON content_meta_new(category, page_type, COALESCE(service_id, ''));

-- SERVICES GRID (96 rows - 6 services per category)
CREATE TABLE content_services_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_name_spin TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  service_description TEXT NOT NULL,
  icon_key TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, service_id)
);

-- HOME ARTICLE SEO body (146 rows)
CREATE TABLE content_home_article (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- SERVICE PAGES elements (672 rows)
CREATE TABLE content_service_pages_elements (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, service_id, element_order)
);

-- AREA PAGES elements (112 rows)
CREATE TABLE content_area_pages (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- FEEDBACK page (64 rows)
CREATE TABLE content_feedback (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- LEGAL pages (32 rows)
CREATE TABLE content_legal (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  legal_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, legal_type)
);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE content_hero_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_header_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cta_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_faq_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_testimonials_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_meta_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_home_article ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_service_pages_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_area_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_legal ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE PUBLIC READ POLICIES
-- =====================================================

CREATE POLICY "Allow public read" ON content_hero_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_header_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_cta_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_faq_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_testimonials_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_meta_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_services_new FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_home_article FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_service_pages_elements FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_area_pages FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_feedback FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_legal FOR SELECT USING (true);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_hero_category ON content_hero_new(category);
CREATE INDEX idx_header_category ON content_header_new(category);
CREATE INDEX idx_cta_category ON content_cta_new(category);
CREATE INDEX idx_faq_category ON content_faq_new(category);
CREATE INDEX idx_testimonials_category ON content_testimonials_new(category);
CREATE INDEX idx_meta_category ON content_meta_new(category);
CREATE INDEX idx_meta_page_type ON content_meta_new(page_type);
CREATE INDEX idx_services_category ON content_services_new(category);
CREATE INDEX idx_services_slug ON content_services_new(service_slug);
CREATE INDEX idx_home_article_category ON content_home_article(category);
CREATE INDEX idx_service_pages_elements_category ON content_service_pages_elements(category);
CREATE INDEX idx_service_pages_elements_service ON content_service_pages_elements(service_id);
CREATE INDEX idx_area_pages_category ON content_area_pages(category);
CREATE INDEX idx_feedback_category ON content_feedback(category);
CREATE INDEX idx_legal_category ON content_legal(category);

-- =====================================================
-- Done! Now run the import script.
-- =====================================================
