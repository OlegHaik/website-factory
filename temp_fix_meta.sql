-- Видалити стару таблицю META_new і створити нову з правильним constraint
DROP TABLE IF EXISTS content_meta_new CASCADE;

CREATE TABLE content_meta_new (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  page_type TEXT NOT NULL,
  service_id TEXT, -- для service pages
  meta_title TEXT NOT NULL,
  meta_desc TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Унікальність: category + page_type + service_id (якщо є)
  CONSTRAINT content_meta_new_unique UNIQUE (category, page_type, service_id)
);

CREATE INDEX idx_content_meta_new_category ON content_meta_new(category);
CREATE INDEX idx_content_meta_new_page_type ON content_meta_new(page_type);
CREATE INDEX idx_content_meta_new_service_id ON content_meta_new(service_id);

ALTER TABLE content_meta_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on content_meta_new" ON content_meta_new FOR SELECT USING (true);

COMMENT ON TABLE content_meta_new IS 'Meta tags для SEO (різні типи сторінок + service pages)';
