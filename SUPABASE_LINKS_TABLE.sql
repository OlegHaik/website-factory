-- LINKS TABLE MIGRATION
-- This table stores citations/links for each site (for the /links page)
-- Each site can have 50+ links

-- Create links table if it doesn't exist
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Business Listings',
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by site_id
CREATE INDEX IF NOT EXISTS idx_links_site_id ON links(site_id);

-- Enable Row Level Security (optional, for production)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on links"
  ON links FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated write access on links"
  ON links FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- EXAMPLE: How to bulk insert links for a site
-- ============================================

-- First, find the site_id for your domain:
-- SELECT id FROM sites WHERE domain_url = 'example.com' AND is_main = true;

-- Then insert links (replace 123 with actual site_id):
/*
INSERT INTO links (site_id, title, url, description, category, sort_order) VALUES
  (123, 'Google Business', 'https://google.com/maps?cid=xxxxx', 'Our Google Business Profile', 'Business Listings', 1),
  (123, 'Yelp', 'https://yelp.com/biz/example', 'Our Yelp page', 'Business Listings', 2),
  (123, 'Facebook', 'https://facebook.com/example', 'Our Facebook page', 'Social Media', 3),
  (123, 'BBB', 'https://bbb.org/example', 'Better Business Bureau', 'Trust & Accreditation', 4);
*/

-- ============================================
-- BULK INSERT TEMPLATE (copy and modify)
-- ============================================
-- Replace SITE_ID with actual site_id from sites table
-- Supported categories: 'Business Listings', 'Social Media', 'Trust & Accreditation', 'Other'

/*
INSERT INTO links (site_id, title, url, category, sort_order) VALUES
  (SITE_ID, 'Google Business Profile', 'https://google.com/maps?cid=XXX', 'Business Listings', 1),
  (SITE_ID, 'Yelp', 'https://yelp.com/biz/XXX', 'Business Listings', 2),
  (SITE_ID, 'Facebook', 'https://facebook.com/XXX', 'Social Media', 3),
  (SITE_ID, 'Instagram', 'https://instagram.com/XXX', 'Social Media', 4),
  (SITE_ID, 'LinkedIn', 'https://linkedin.com/company/XXX', 'Social Media', 5),
  (SITE_ID, 'BBB', 'https://bbb.org/XXX', 'Trust & Accreditation', 6),
  (SITE_ID, 'Angi', 'https://angi.com/XXX', 'Business Listings', 7),
  (SITE_ID, 'HomeAdvisor', 'https://homeadvisor.com/XXX', 'Business Listings', 8),
  (SITE_ID, 'Thumbtack', 'https://thumbtack.com/XXX', 'Business Listings', 9);
*/
