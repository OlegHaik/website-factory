-- Migration: Add global_order column to content_blocks
-- This ensures content renders in the exact order as in the source XLSX/spintext file

-- Add global_order column (defaults to 0 for existing rows)
ALTER TABLE content_blocks 
ADD COLUMN IF NOT EXISTS global_order INT NOT NULL DEFAULT 0;

-- Create index for efficient lookup and ordering
CREATE INDEX IF NOT EXISTS idx_content_blocks_lookup_order
ON content_blocks (category_key, page_type, section_key, site_id, global_order);

-- Optional: Update existing rows to have sequential global_order based on current id
-- Uncomment if you want to auto-populate for existing data:
-- UPDATE content_blocks cb
-- SET global_order = sub.row_num
-- FROM (
--   SELECT id, ROW_NUMBER() OVER (
--     PARTITION BY category_key, page_type, section_key, COALESCE(site_id, -1)
--     ORDER BY id
--   ) as row_num
--   FROM content_blocks
-- ) sub
-- WHERE cb.id = sub.id;
