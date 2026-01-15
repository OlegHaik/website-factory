-- =====================================================
-- ПОВНА МІГРАЦІЯ: Всі таблиці для MASTER_SPINTEXT
-- Дата: 2026-01-15
-- Версія: 2.0 (Complete)
-- =====================================================

-- =====================================================
-- 1. content_hero_new
-- =====================================================

CREATE TABLE IF NOT EXISTS content_hero_new (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  chat_button_spintax TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_hero_new_category ON content_hero_new(category);

COMMENT ON TABLE content_hero_new IS 'Hero секція homepage зі спінтекстом';

-- =====================================================
-- 2. content_header_new
-- =====================================================

CREATE TABLE IF NOT EXISTS content_header_new (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  nav_home TEXT DEFAULT 'Home',
  nav_services TEXT DEFAULT 'Services',
  nav_areas TEXT DEFAULT 'Service Areas',
  nav_contact TEXT DEFAULT 'Contact',
  call_button_text TEXT DEFAULT 'Call Now',
  our_links_spintax TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_header_new_category ON content_header_new(category);

COMMENT ON TABLE content_header_new IS 'Header навігація та меню';

-- =====================================================
-- 3. content_cta_new
-- =====================================================

CREATE TABLE IF NOT EXISTS content_cta_new (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  headline_spintax TEXT NOT NULL,
  subheadline_spintax TEXT NOT NULL,
  chat_button_spintax TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_cta_new_category ON content_cta_new(category);

COMMENT ON TABLE content_cta_new IS 'Call-to-action секція зі спінтекстом';

-- =====================================================
-- 4. content_faq_new (вже створена, але додаємо для повноти)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_faq_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  faq_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_faq_new_category_faq_id_unique UNIQUE (category, faq_id)
);

CREATE INDEX IF NOT EXISTS idx_content_faq_new_category ON content_faq_new(category);
CREATE INDEX IF NOT EXISTS idx_content_faq_new_faq_id ON content_faq_new(faq_id);

COMMENT ON TABLE content_faq_new IS 'FAQ питання і відповіді зі спінтекстом (12 на категорію)';

-- =====================================================
-- 5. content_testimonials_new (вже створена)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_testimonials_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  testimonial_num INTEGER NOT NULL,
  testimonial_body TEXT NOT NULL,
  testimonial_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_testimonials_new_category_num_unique UNIQUE (category, testimonial_num)
);

CREATE INDEX IF NOT EXISTS idx_content_testimonials_new_category ON content_testimonials_new(category);
CREATE INDEX IF NOT EXISTS idx_content_testimonials_new_num ON content_testimonials_new(testimonial_num);

COMMENT ON TABLE content_testimonials_new IS 'Відгуки клієнтів зі спінтекстом (до 15 на категорію)';

-- =====================================================
-- 6. content_services_new (вже створена)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_services_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_name_spin TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  svc_grid_desc TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_services_new_category_service_id_unique UNIQUE (category, service_id),
  CONSTRAINT content_services_new_category_slug_unique UNIQUE (category, service_slug)
);

CREATE INDEX IF NOT EXISTS idx_content_services_new_category ON content_services_new(category);
CREATE INDEX IF NOT EXISTS idx_content_services_new_service_id ON content_services_new(service_id);

COMMENT ON TABLE content_services_new IS 'Список послуг зі спінтекстом (6 на категорію)';

-- =====================================================
-- 7. content_meta_new
-- =====================================================

CREATE TABLE IF NOT EXISTS content_meta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  page_type TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_desc TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_meta_new_category_page_type_unique UNIQUE (category, page_type)
);

CREATE INDEX IF NOT EXISTS idx_content_meta_new_category ON content_meta_new(category);
CREATE INDEX IF NOT EXISTS idx_content_meta_new_page_type ON content_meta_new(page_type);

COMMENT ON TABLE content_meta_new IS 'Meta tags для SEO (різні типи сторінок)';

-- =====================================================
-- Додати RLS для нових таблиць
-- =====================================================

ALTER TABLE content_hero_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_hero_new" ON content_hero_new FOR SELECT USING (true);

ALTER TABLE content_header_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_header_new" ON content_header_new FOR SELECT USING (true);

ALTER TABLE content_cta_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_cta_new" ON content_cta_new FOR SELECT USING (true);

ALTER TABLE content_faq_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_faq_new" ON content_faq_new FOR SELECT USING (true);

ALTER TABLE content_testimonials_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_testimonials_new" ON content_testimonials_new FOR SELECT USING (true);

ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_services_new" ON content_services_new FOR SELECT USING (true);

ALTER TABLE content_meta_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_meta_new" ON content_meta_new FOR SELECT USING (true);

-- =====================================================
-- ГОТОВО! Тепер можна імпортувати дані
-- =====================================================

-- Перевірка створених таблиць:
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE '%_new'
ORDER BY table_name;
