-- Create content_services_new table
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

ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow public read on content_services_new" ON content_services_new FOR SELECT USING (true);

-- Перевірка
SELECT COUNT(*) as count FROM content_services_new;
