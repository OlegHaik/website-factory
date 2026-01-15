-- =====================================================
-- COMPLETE SERVICES MIGRATION FIX
-- This addresses the "p" display and 404 issues
-- =====================================================

-- Step 1: Ensure content_service_pages table exists and has all needed columns
DO $$ 
BEGIN
    -- Check if category column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_service_pages' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE content_service_pages ADD COLUMN category TEXT;
        
        -- Set default category for existing rows if any
        UPDATE content_service_pages 
        SET category = 'water_damage' 
        WHERE category IS NULL;
    END IF;
END $$;

-- Step 2: Import services data from SERVICES_GRID sheet
-- Note: You need to run this after manually creating the data based on SERVICES_GRID from XLSX

-- First, let's create a temp table for importing
CREATE TEMP TABLE IF NOT EXISTS temp_services_import (
    category TEXT,
    category_id TEXT,
    service_id TEXT,
    service_name TEXT,
    service_name_spin TEXT,
    service_slug TEXT,
    svc_grid_desc TEXT
);

-- Step 3: Create content_service_pages entries from services data
-- This ensures each service has a proper page configuration

-- Water Damage Services (6 services)
INSERT INTO content_service_pages (
    category,
    service_slug,
    service_title_spintax,
    hero_headline_spintax,
    hero_subheadline_spintax,
    section_headline_spintax,
    section_body_spintax,
    process_headline_spintax,
    process_body_spintax,
    why_choose_headline_spintax,
    trust_points_spintax,
    midpage_cta_headline_spintax,
    midpage_cta_subtext_spintax,
    hero_cta_secondary_spintax
) 
SELECT 
    'water_damage',
    service_slug,
    service_name,
    service_name || ' Services in {{city}}, {{state}}',
    'Professional ' || service_name || ' by certified technicians. Available 24/7 for emergency response.',
    'Expert ' || service_name || ' Services',
    svc_grid_desc,
    'Our ' || service_name || ' Process',
    'We follow industry-leading protocols to ensure thorough restoration and complete customer satisfaction.',
    'Why Choose {{business_name}} for ' || service_name || '?',
    '24/7 Emergency Response • Licensed & Insured • Advanced Equipment • Experienced Technicians',
    'Need Immediate ' || service_name || '?',
    'Contact {{business_name}} at {{phone}} for fast, professional service.',
    'Get Free Estimate'
FROM content_services_new
WHERE category = 'water_damage'
ON CONFLICT (category, service_slug) 
DO UPDATE SET
    service_title_spintax = EXCLUDED.service_title_spintax,
    hero_headline_spintax = EXCLUDED.hero_headline_spintax,
    hero_subheadline_spintax = EXCLUDED.hero_subheadline_spintax;

-- Roofing Services (6 services)
INSERT INTO content_service_pages (
    category,
    service_slug,
    service_title_spintax,
    hero_headline_spintax,
    hero_subheadline_spintax,
    section_headline_spintax,
    section_body_spintax,
    process_headline_spintax,
    process_body_spintax,
    why_choose_headline_spintax,
    trust_points_spintax,
    midpage_cta_headline_spintax,
    midpage_cta_subtext_spintax,
    hero_cta_secondary_spintax
) 
SELECT 
    'roofing',
    service_slug,
    service_name,
    service_name || ' Services in {{city}}, {{state}}',
    'Professional ' || service_name || ' by experienced roofers. Quality workmanship guaranteed.',
    'Expert ' || service_name || ' Services',
    svc_grid_desc,
    'Our ' || service_name || ' Process',
    'We use premium materials and proven techniques to deliver long-lasting results.',
    'Why Choose {{business_name}} for ' || service_name || '?',
    'Licensed & Insured • Quality Materials • Expert Craftsmanship • Warranty Protection',
    'Need Professional ' || service_name || '?',
    'Contact {{business_name}} at {{phone}} for a free consultation.',
    'Schedule Consultation'
FROM content_services_new
WHERE category = 'roofing'
ON CONFLICT (category, service_slug) 
DO UPDATE SET
    service_title_spintax = EXCLUDED.service_title_spintax,
    hero_headline_spintax = EXCLUDED.hero_headline_spintax,
    hero_subheadline_spintax = EXCLUDED.hero_subheadline_spintax;

-- Repeat for all other categories
INSERT INTO content_service_pages (
    category,
    service_slug,
    service_title_spintax,
    hero_headline_spintax,
    hero_subheadline_spintax,
    section_headline_spintax,
    section_body_spintax,
    process_headline_spintax,
    process_body_spintax,
    why_choose_headline_spintax,
    trust_points_spintax,
    midpage_cta_headline_spintax,
    midpage_cta_subtext_spintax,
    hero_cta_secondary_spintax
) 
SELECT 
    category,
    service_slug,
    service_name,
    service_name || ' Services in {{city}}, {{state}}',
    'Professional ' || service_name || ' services. Experienced team ready to help.',
    'Expert ' || service_name || ' Services',
    svc_grid_desc,
    'Our ' || service_name || ' Process',
    'We deliver quality results with attention to detail and customer satisfaction.',
    'Why Choose {{business_name}} for ' || service_name || '?',
    'Professional Service • Licensed & Insured • Quality Results • Customer Satisfaction',
    'Need ' || service_name || ' Services?',
    'Contact {{business_name}} at {{phone}} today.',
    'Get Started'
FROM content_services_new
WHERE category NOT IN ('water_damage', 'roofing')
ON CONFLICT (category, service_slug) 
DO UPDATE SET
    service_title_spintax = EXCLUDED.service_title_spintax,
    hero_headline_spintax = EXCLUDED.hero_headline_spintax,
    hero_subheadline_spintax = EXCLUDED.hero_subheadline_spintax;

-- Step 4: Verify the data
SELECT category, COUNT(*) as service_count
FROM content_service_pages
GROUP BY category
ORDER BY category;

-- Step 5: Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Done!
SELECT 'Migration completed. Services should now display correctly.' as status;
