-- Content system tables for dynamic spintax content
-- Run this in Supabase SQL editor.

-- STEP 8: Create content tables
CREATE TABLE IF NOT EXISTS content_header (
  id SERIAL PRIMARY KEY,
  nav_home TEXT DEFAULT 'Home',
  nav_services TEXT DEFAULT 'Services',
  nav_areas TEXT DEFAULT 'Service Areas',
  nav_contact TEXT DEFAULT 'Contact',
  call_button_text TEXT DEFAULT 'Call Now'
);

CREATE TABLE IF NOT EXISTS content_hero (
  id SERIAL PRIMARY KEY,
  headline_spintax TEXT,
  subheadline_spintax TEXT,
  chat_button_spintax TEXT DEFAULT '{Chat With Us|Message Us|Text Us}'
);

CREATE TABLE IF NOT EXISTS content_services (
  id SERIAL PRIMARY KEY,
  water_title TEXT,
  water_description TEXT,
  fire_title TEXT,
  fire_description TEXT,
  mold_title TEXT,
  mold_description TEXT,
  biohazard_title TEXT,
  biohazard_description TEXT,
  burst_title TEXT,
  burst_description TEXT,
  sewage_title TEXT,
  sewage_description TEXT
);

-- sites already has content_map in the theming SQL, but keep this idempotent
ALTER TABLE sites ADD COLUMN IF NOT EXISTS content_map JSONB DEFAULT '{}';

-- STEP 9: Insert sample content rows
INSERT INTO content_header (nav_home, nav_services, nav_areas, nav_contact, call_button_text) VALUES
('Home', 'Services', 'Service Areas', 'Contact', 'Call Now'),
('Home Page', 'Our Services', 'Areas We Serve', 'Contact Us', '24/7 Emergency'),
('Main', 'Solutions', 'Locations', 'Get Help', 'Call Expert'),
('Start', 'What We Do', 'Coverage', 'Reach Us', 'Emergency Line'),
('Welcome', 'Expertise', 'Local Areas', 'Support', 'Speak to a Pro');

INSERT INTO content_hero (headline_spintax, subheadline_spintax, chat_button_spintax) VALUES
(
  '{Trusted|Reliable|Professional|Certified|Expert} Fire & Water Restoration in {{city}}, {{state}}',
  '{Don''t let water damage destroy your home|When disaster strikes, every second counts|Water damage can devastate your property}. Our {{city}} team {uses advanced drying tech|responds within 60 minutes|is available 24/7} to restore your property fast. {Direct insurance billing available|We work with all insurance companies|Free estimates available}.',
  '{Chat With Us|Message Us|Text Us|Start Chat|Quick Chat|Text Now}'
);

-- Example: assign content to a site
-- UPDATE sites
-- SET content_map = '{"header": 1, "hero": 1, "services": 1}'::jsonb
-- WHERE domain_url = 'example.com';
