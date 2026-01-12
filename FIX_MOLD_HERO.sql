-- =====================================================
-- FIX: CONTENT_HERO for mold_remediation category
-- The current record has water damage content instead of mold content
-- =====================================================

-- First, check the current content
SELECT id, category, headline_spintax, subheadline_spintax 
FROM content_hero 
WHERE category = 'mold_remediation';

-- Update the mold_remediation hero content with correct mold-related text
UPDATE content_hero
SET 
  headline_spintax = '{Professional|Expert|Trusted|Certified|Local} {Mold Remediation|Mold Removal|Mold Cleanup|Mold Inspection} {Services|Experts|Specialists} in {{city}}',
  subheadline_spintax = '{Protect your family from|Eliminate|Remove} {harmful mold|mold contamination|hidden mold} that can cause {health issues|respiratory problems|property damage}. Our {{city}} {specialists|experts|certified professionals} use {advanced|professional|IICRC-approved} {remediation techniques|removal methods|containment protocols} to {safely remove mold|restore healthy indoor air|eliminate mold at the source}. We {provide|offer} {free inspections|professional assessments|thorough evaluations}.'
WHERE category = 'mold_remediation';

-- Verify the update
SELECT id, category, headline_spintax, subheadline_spintax 
FROM content_hero 
WHERE category = 'mold_remediation';


-- =====================================================
-- OPTIONAL: Add missing content for pool_contractor
-- =====================================================

-- Check if pool_contractor exists in content_seo_body
SELECT * FROM content_seo_body WHERE category = 'pool_contractor';

-- If missing, insert:
-- INSERT INTO content_seo_body (section_title, intro_paragraph, why_choose_title, why_choose_content, process_title, process_content, category)
-- VALUES (
--   '{Professional|Expert|Trusted} Pool Construction in {{city}}',
--   'Content for pool contractor...',
--   'Why Choose Our Pool Team?',
--   'Pool why choose content...',
--   'Our Pool Building Process',
--   'Pool process content...',
--   'pool_contractor'
-- );
