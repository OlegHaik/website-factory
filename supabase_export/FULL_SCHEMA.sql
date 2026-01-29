-- =====================================================
-- ПОВНА СХЕМА БАЗИ ДАНИХ ДЛЯ НОВОГО SUPABASE
-- Виконайте цей SQL в Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ТАБЛИЦЯ SITES (ГОЛОВНА)
-- =====================================================

CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  slug TEXT,
  business_name TEXT,
  domain_url TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  state TEXT,
  phone TEXT,
  category TEXT,
  owner TEXT,
  email TEXT,
  service_areas TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  style_id INTEGER,
  content_map JSONB DEFAULT '{}',

  -- Social links
  social_google TEXT,
  social_facebook TEXT,
  social_pinterest TEXT,
  social_youtube TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_yelp TEXT,
  social_bing TEXT,
  social_apple_maps TEXT,

  is_main BOOLEAN DEFAULT false,
  google_review_link TEXT
);

-- Indexes for sites
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_domain_url ON sites(domain_url);
CREATE INDEX IF NOT EXISTS idx_sites_category ON sites(category);
CREATE INDEX IF NOT EXISTS idx_sites_is_main ON sites(is_main);

-- =====================================================
-- 2. ТАБЛИЦЯ SERVICES
-- =====================================================

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

-- =====================================================
-- 3. ТАБЛИЦЯ STYLES
-- =====================================================

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

-- =====================================================
-- 4. КОНТЕНТ ТАБЛИЦІ
-- =====================================================

-- HERO section
CREATE TABLE IF NOT EXISTS content_hero_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HEADER/MENU section
CREATE TABLE IF NOT EXISTS content_header_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  nav_home TEXT DEFAULT 'Home',
  nav_services TEXT DEFAULT 'Services',
  nav_areas TEXT DEFAULT 'Areas',
  nav_contact TEXT DEFAULT 'Contact',
  call_button_text TEXT DEFAULT 'Call Now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA section
CREATE TABLE IF NOT EXISTS content_cta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  button_text_spintax TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ section
CREATE TABLE IF NOT EXISTS content_faq_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  faq_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, faq_id)
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS content_testimonials_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  testimonial_num INTEGER NOT NULL,
  testimonial_body TEXT NOT NULL,
  testimonial_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, testimonial_num)
);

-- META tags
CREATE TABLE IF NOT EXISTS content_meta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  page_type TEXT NOT NULL,
  service_id TEXT,
  meta_title TEXT NOT NULL,
  meta_desc TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index for meta
CREATE UNIQUE INDEX IF NOT EXISTS idx_meta_unique ON content_meta_new(category, page_type, COALESCE(service_id, ''));

-- SERVICES GRID
CREATE TABLE IF NOT EXISTS content_services_new (
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

-- HOME ARTICLE SEO body
CREATE TABLE IF NOT EXISTS content_home_article (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- SERVICE PAGES elements
CREATE TABLE IF NOT EXISTS content_service_pages_elements (
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

-- AREA PAGES elements
CREATE TABLE IF NOT EXISTS content_area_pages (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- FEEDBACK page
CREATE TABLE IF NOT EXISTS content_feedback (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  element_order INTEGER NOT NULL,
  element_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, element_order)
);

-- LEGAL pages
CREATE TABLE IF NOT EXISTS content_legal (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  legal_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, legal_type)
);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
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
-- 6. CREATE PUBLIC READ POLICIES
-- =====================================================

CREATE POLICY "Allow public read" ON sites FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON styles FOR SELECT USING (true);
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
-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_hero_category ON content_hero_new(category);
CREATE INDEX IF NOT EXISTS idx_header_category ON content_header_new(category);
CREATE INDEX IF NOT EXISTS idx_cta_category ON content_cta_new(category);
CREATE INDEX IF NOT EXISTS idx_faq_category ON content_faq_new(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_category ON content_testimonials_new(category);
CREATE INDEX IF NOT EXISTS idx_meta_category ON content_meta_new(category);
CREATE INDEX IF NOT EXISTS idx_meta_page_type ON content_meta_new(page_type);
CREATE INDEX IF NOT EXISTS idx_services_category ON content_services_new(category);
CREATE INDEX IF NOT EXISTS idx_services_slug ON content_services_new(service_slug);
CREATE INDEX IF NOT EXISTS idx_home_article_category ON content_home_article(category);
CREATE INDEX IF NOT EXISTS idx_service_pages_elements_category ON content_service_pages_elements(category);
CREATE INDEX IF NOT EXISTS idx_service_pages_elements_service ON content_service_pages_elements(service_id);
CREATE INDEX IF NOT EXISTS idx_area_pages_category ON content_area_pages(category);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON content_feedback(category);
CREATE INDEX IF NOT EXISTS idx_legal_category ON content_legal(category);

-- =====================================================
-- DONE! Database schema created successfully.
-- Now run: node IMPORT_TO_NEW_SUPABASE.js
-- =====================================================
