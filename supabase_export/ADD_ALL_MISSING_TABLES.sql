-- =====================================================
-- ВСІ ТАБЛИЦІ ЩО НЕ БУЛИ В ПОЧАТКОВОМУ ЕКСПОРТІ
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

-- CONTENT_META (without _new suffix - used in code)
CREATE TABLE IF NOT EXISTS content_meta (
  id SERIAL PRIMARY KEY,
  category TEXT,
  page_type TEXT,
  service_id TEXT,
  meta_title TEXT,
  meta_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_SERVICE_PAGES
CREATE TABLE IF NOT EXISTS content_service_pages (
  id SERIAL PRIMARY KEY,
  service_slug TEXT,
  hero_headline_spintax TEXT,
  hero_subheadline_spintax TEXT,
  hero_cta_secondary_spintax TEXT,
  section_headline_spintax TEXT,
  section_body_spintax TEXT,
  process_headline_spintax TEXT,
  process_body_spintax TEXT,
  midpage_cta_headline_spintax TEXT,
  midpage_cta_subtext_spintax TEXT,
  why_choose_headline_spintax TEXT,
  trust_points_spintax TEXT,
  category TEXT,
  service_title_spintax TEXT,
  service_description_spintax TEXT,
  icon_key TEXT,
  sort_order INTEGER,
  meta_title_spintax TEXT,
  meta_description_spintax TEXT,
  why_choose_body_spintax TEXT,
  residential_headline_spintax TEXT,
  residential_body_spintax TEXT
);

-- CONTENT_SERVICE_AREA
CREATE TABLE IF NOT EXISTS content_service_area (
  id SERIAL PRIMARY KEY,
  headline_spintax TEXT,
  paragraph1_spintax TEXT,
  paragraph2_spintax TEXT,
  paragraph3_spintax TEXT,
  paragraph4_spintax TEXT,
  why_city_headline_spintax TEXT,
  why_city_paragraph_spintax TEXT,
  midpage_cta_headline_spintax TEXT,
  midpage_cta_subtext_spintax TEXT,
  why_choose_headline_spintax TEXT,
  trust_points_spintax TEXT,
  services_list_headline_spintax TEXT,
  category TEXT
);

-- CONTENT_QUESTIONNAIRE
CREATE TABLE IF NOT EXISTS content_questionnaire (
  id SERIAL PRIMARY KEY,
  category TEXT,
  url_slug_spintax TEXT,
  h1_spintax TEXT,
  subheadline_spintax TEXT,
  step1_progress_spintax TEXT,
  step1_question_spintax TEXT,
  step2_progress_spintax TEXT,
  step2_question_spintax TEXT,
  step3_progress_spintax TEXT,
  step3_question_spintax TEXT,
  step3_helper_spintax TEXT,
  step4_progress_spintax TEXT,
  thank_you_headline_spintax TEXT,
  thank_you_text_spintax TEXT,
  review_prompt_spintax TEXT,
  button_text_spintax TEXT,
  cta_subtext_spintax TEXT,
  back_link_spintax TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_SEO_BODY
CREATE TABLE IF NOT EXISTS content_seo_body (
  id SERIAL PRIMARY KEY,
  section_title TEXT,
  intro_paragraph TEXT,
  why_choose_title TEXT,
  why_choose_content TEXT,
  process_title TEXT,
  process_content TEXT,
  category TEXT
);

-- LEGACY TABLES (without _new suffix)

-- CONTENT_HERO (legacy)
CREATE TABLE IF NOT EXISTS content_hero (
  id SERIAL PRIMARY KEY,
  category TEXT,
  headline_spintax TEXT,
  subheadline_spintax TEXT,
  chat_button_spintax TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_HEADER (legacy)
CREATE TABLE IF NOT EXISTS content_header (
  id SERIAL PRIMARY KEY,
  category TEXT,
  nav_home TEXT,
  nav_services TEXT,
  nav_areas TEXT,
  nav_contact TEXT,
  call_button_text TEXT,
  our_links_spintax TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_CTA (legacy)
CREATE TABLE IF NOT EXISTS content_cta (
  id SERIAL PRIMARY KEY,
  category TEXT,
  headline_spintax TEXT,
  subheadline_spintax TEXT,
  chat_button_spintax TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_FAQ (legacy)
CREATE TABLE IF NOT EXISTS content_faq (
  id SERIAL PRIMARY KEY,
  category TEXT,
  faq_id TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_TESTIMONIALS (legacy)
CREATE TABLE IF NOT EXISTS content_testimonials (
  id SERIAL PRIMARY KEY,
  category TEXT,
  testimonial_num INTEGER,
  testimonial_body TEXT,
  testimonial_name TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT_SERVICES (legacy)
CREATE TABLE IF NOT EXISTS content_services (
  id SERIAL PRIMARY KEY,
  category TEXT,
  service_id TEXT,
  service_name TEXT,
  service_name_spin TEXT,
  service_slug TEXT,
  svc_grid_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENABLE RLS FOR ALL NEW TABLES
-- =====================================================

ALTER TABLE config_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_service_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_service_area ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_seo_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_services ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE PUBLIC READ POLICIES
-- =====================================================

CREATE POLICY "Allow public read" ON config_styles FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_blocks FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_meta FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_service_pages FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_service_area FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_questionnaire FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_seo_body FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_hero FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_header FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_cta FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_faq FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON content_services FOR SELECT USING (true);

-- =====================================================
-- DONE! Now run: node IMPORT_TO_NEW_SUPABASE.js
-- =====================================================
