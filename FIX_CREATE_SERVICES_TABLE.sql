-- =====================================================
-- CREATE MISSING content_services_new TABLE
-- Execute this SQL in Supabase SQL Editor
-- =====================================================

-- Drop if exists (optional, only if you want to recreate)
-- DROP TABLE IF EXISTS content_services_new CASCADE;

-- Create table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_services_new_category ON content_services_new(category);
CREATE INDEX IF NOT EXISTS idx_content_services_new_service_id ON content_services_new(service_id);
CREATE INDEX IF NOT EXISTS idx_content_services_new_service_slug ON content_services_new(service_slug);

-- Enable RLS
ALTER TABLE content_services_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY IF NOT EXISTS "Allow public read on content_services_new" 
  ON content_services_new 
  FOR SELECT 
  USING (true);

-- Verify table was created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'content_services_new') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'content_services_new';

-- Show current row count (should be 0)
SELECT COUNT(*) as row_count FROM content_services_new;
