-- =====================================================
-- MIGRATION: Нова структура для MASTER_SPINTEXT
-- Дата: 2026-01-15
-- =====================================================

-- Видалимо старі таблиці (збережіть backup перед запуском!)
-- DROP TABLE IF EXISTS content_faq CASCADE;
-- DROP TABLE IF EXISTS content_testimonials CASCADE;

-- =====================================================
-- content_faq - нова структура (12 питань на категорію)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_faq_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  faq_id TEXT NOT NULL, -- q1, a1, q2, a2, etc.
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Унікальність: одна пара category + faq_id
  CONSTRAINT content_faq_new_category_faq_id_unique UNIQUE (category, faq_id)
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_content_faq_new_category ON content_faq_new(category);
CREATE INDEX IF NOT EXISTS idx_content_faq_new_faq_id ON content_faq_new(faq_id);

COMMENT ON TABLE content_faq_new IS 'FAQ питання і відповіді зі спінтекстом (12 на категорію)';

-- =====================================================
-- content_testimonials - нова структура (15 відгуків на категорію)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_testimonials_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  testimonial_num INTEGER NOT NULL, -- 1-15
  testimonial_body TEXT NOT NULL,
  testimonial_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Унікальність: одна пара category + testimonial_num
  CONSTRAINT content_testimonials_new_category_num_unique UNIQUE (category, testimonial_num)
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_content_testimonials_new_category ON content_testimonials_new(category);
CREATE INDEX IF NOT EXISTS idx_content_testimonials_new_num ON content_testimonials_new(testimonial_num);

COMMENT ON TABLE content_testimonials_new IS 'Відгуки клієнтів зі спінтекстом (до 15 на категорію)';

-- =====================================================
-- content_services - оновлена структура для SERVICES_GRID
-- =====================================================

CREATE TABLE IF NOT EXISTS content_services_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL, -- '1a', '1b', etc.
  service_name TEXT NOT NULL,
  service_name_spin TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  svc_grid_desc TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Унікальність
  CONSTRAINT content_services_new_category_service_id_unique UNIQUE (category, service_id),
  CONSTRAINT content_services_new_category_slug_unique UNIQUE (category, service_slug)
);

CREATE INDEX IF NOT EXISTS idx_content_services_new_category ON content_services_new(category);
CREATE INDEX IF NOT EXISTS idx_content_services_new_service_id ON content_services_new(service_id);

COMMENT ON TABLE content_services_new IS 'Список послуг зі спінтекстом (6 на категорію)';

-- =====================================================
-- Після перевірки що все працює:
-- =====================================================

-- 1. Rename old tables (backup)
-- ALTER TABLE content_faq RENAME TO content_faq_old;
-- ALTER TABLE content_testimonials RENAME TO content_testimonials_old;
-- ALTER TABLE content_services RENAME TO content_services_old;

-- 2. Rename new tables to production names
-- ALTER TABLE content_faq_new RENAME TO content_faq;
-- ALTER TABLE content_testimonials_new RENAME TO content_testimonials;
-- ALTER TABLE content_services_new RENAME TO content_services;

-- 3. Update RLS policies if needed
-- ALTER TABLE content_faq ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON content_faq FOR SELECT USING (true);

-- ALTER TABLE content_testimonials ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON content_testimonials FOR SELECT USING (true);

-- ALTER TABLE content_services ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON content_services FOR SELECT USING (true);

-- =====================================================
-- ROLLBACK (якщо щось пішло не так)
-- =====================================================

-- DROP TABLE IF EXISTS content_faq_new;
-- DROP TABLE IF EXISTS content_testimonials_new;
-- DROP TABLE IF EXISTS content_services_new;

-- ALTER TABLE content_faq_old RENAME TO content_faq;
-- ALTER TABLE content_testimonials_old RENAME TO content_testimonials;
-- ALTER TABLE content_services_old RENAME TO content_services;
