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

-- =============================
-- Service Area Page Spintax Content
-- =============================
CREATE TABLE IF NOT EXISTS content_service_area (
  id SERIAL PRIMARY KEY,
  hero_headline_spintax TEXT,
  hero_description_spintax TEXT,
  intro_title_spintax TEXT,
  intro_spintax TEXT,
  services_title_spintax TEXT,
  services_intro_spintax TEXT,
  why_choose_title_spintax TEXT,
  why_choose_spintax TEXT,
  cta_headline_spintax TEXT,
  cta_description_spintax TEXT
);

-- sites already has content_map in the theming SQL, but keep this idempotent
ALTER TABLE sites ADD COLUMN IF NOT EXISTS content_map JSONB DEFAULT '{}';

INSERT INTO content_header (nav_home, nav_services, nav_areas, nav_contact, call_button_text) VALUES
('Home', 'Services', 'Service Areas', 'Contact', 'Call Now'),
('Home Page', 'Our Services', 'Areas We Serve', 'Contact Us', '24/7 Emergency'),
('Main', 'Solutions', 'Locations', 'Get Help', 'Call Expert'),
('Start', 'What We Do', 'Coverage', 'Reach Us', 'Emergency Line'),
('Welcome', 'Expertise', 'Local Areas', 'Support', 'Speak to a Pro');

-- Insert default content (generic template for all service areas)
INSERT INTO content_service_area (
  id,
  hero_headline_spintax,
  hero_description_spintax,
  intro_title_spintax,
  intro_spintax,
  services_title_spintax,
  services_intro_spintax,
  why_choose_title_spintax,
  why_choose_spintax,
  cta_headline_spintax,
  cta_description_spintax
)
SELECT
  1,
  '{Trusted|Professional|Expert|Certified|Licensed|24/7} {Fire & Water Restoration|Water Damage Restoration|Disaster Recovery|Emergency Restoration} in {{city}}, {{state}}',
  '{When disaster strikes in|Emergencies don''t wait in|Property damage in} {{city}}, you need {fast, reliable restoration|immediate professional help|experts you can trust}. Our team {responds within 60 minutes|is available 24/7|provides complete restoration services} to {protect your property|minimize damage|restore your home or business}.',
  '{Professional Restoration Services|Expert Damage Recovery|Complete Restoration Solutions} in {{city}}',
  '{Water damage, fire incidents, and mold growth|Disasters like flooding, fire, and mold|Property emergencies} can {happen without warning|strike at any time|cause devastating damage} in {{city}}. Our {certified restoration professionals|licensed technicians|expert team} {understand the unique challenges|know the local area|serve the community} and {respond quickly to minimize damage|provide fast, effective restoration|are committed to restoring your property}. {We work with all insurance companies|Direct insurance billing available|We handle your insurance claim}.',
  '{Our {{city}} Services|What We Offer in {{city}}|Restoration Services Available}',
  '{We provide comprehensive restoration services|Our {{city}} team handles all types of damage|From water damage to fire restoration} including {water extraction, fire cleanup, mold remediation|emergency response, structural drying, complete repairs|all phases of disaster recovery}.',
  '{Why {{city}} Residents Choose Us|Why Trust Our {{city}} Team|Your Local Restoration Experts}',
  '{Homeowners and businesses in {{city}} trust us|We''ve served the {{city}} community for years|{{city}} residents choose us} because we {respond fast, work professionally, and deliver results|provide honest pricing and expert craftsmanship|treat every property like our own}. Our {IICRC certified technicians|trained professionals|licensed team} use {advanced equipment|state-of-the-art technology|professional-grade tools} to {ensure complete restoration|get the job done right|restore your property quickly}.',
  '{Need Help in {{city}}?|{{city}} Emergency? We''re Here|Get Immediate Help in {{city}}}',
  '{Our {{city}} team is standing by 24/7|Don''t wait - call our {{city}} experts now|Immediate response available in {{city}}}. {Free estimates, direct insurance billing|We handle everything from cleanup to paperwork|Fast response, professional service}.'
WHERE NOT EXISTS (SELECT 1 FROM content_service_area WHERE id = 1);


-- =============================
-- Service Page Spintax Content
-- =============================
CREATE TABLE IF NOT EXISTS content_service_pages (
  id SERIAL PRIMARY KEY,
  service_slug TEXT NOT NULL,
  hero_headline_spintax TEXT,
  hero_description_spintax TEXT,
  intro_spintax TEXT,
  process_title_spintax TEXT,
  process_spintax TEXT,
  why_choose_title_spintax TEXT,
  why_choose_spintax TEXT,
  cta_headline_spintax TEXT,
  cta_description_spintax TEXT
);

-- Insert default content for each service
INSERT INTO content_service_pages (service_slug, hero_headline_spintax, hero_description_spintax, intro_spintax) VALUES
('water-damage-restoration',
  '{Professional|Expert|Certified|Emergency|24/7} Water Damage Restoration in {{city}}, {{state}}',
  '{Fast water extraction and drying|Immediate flood response|Rapid moisture removal} by certified technicians. We {respond within 60 minutes|are available 24/7|handle insurance claims directly}.',
  '{Water damage can strike at any moment|Flooding emergencies require immediate action|When water invades your property}, causing {devastating effects|serious structural damage|costly repairs} if not addressed quickly. Our {{city}} team {specializes in|is expert at|provides professional} water damage restoration services.'
),
('fire-smoke-damage',
  '{Professional|Expert|Certified|Complete} Fire & Smoke Damage Restoration in {{city}}, {{state}}',
  '{Comprehensive fire damage recovery|Complete smoke and soot removal|Expert fire restoration services}. We {restore your property to pre-loss condition|handle everything from cleanup to rebuild|work with your insurance company}.',
  '{After a fire, the damage extends beyond what you can see|Fire and smoke leave lasting damage|The aftermath of a fire can be overwhelming}. Our {{city}} fire restoration team {removes soot, eliminates odors, and repairs structural damage|provides complete fire damage recovery|restores your property professionally}.'
),
('mold-remediation',
  '{Professional|Certified|Expert|Complete} Mold Remediation in {{city}}, {{state}}',
  '{Safe mold removal and prevention|Certified mold inspection and cleanup|Professional mold remediation services}. We {eliminate mold at the source|ensure your indoor air quality|follow strict IICRC protocols}.',
  '{Mold growth poses serious health risks|Hidden mold can spread quickly|Mold infestations require professional treatment}. Our {{city}} mold remediation team {uses advanced techniques|follows certified protocols|safely eliminates mold} to protect your family.'
),
('biohazard-cleanup',
  '{Professional|Certified|Discreet|Expert} Biohazard Cleanup in {{city}}, {{state}}',
  '{Safe biohazard removal and sanitization|Professional trauma cleanup services|Certified biohazard remediation}. We {handle sensitive situations with care|follow OSHA safety protocols|restore safe conditions}.',
  '{Biohazard situations require specialized training|Trauma scenes need professional cleanup|Biohazard materials pose serious health risks}. Our {{city}} team {provides discreet, professional service|follows strict safety protocols|ensures complete decontamination}.'
),
('burst-pipe-repair',
  '{Emergency|24/7|Rapid|Professional} Burst Pipe Repair in {{city}}, {{state}}',
  '{Fast response to pipe emergencies|Immediate water shutoff and repair|Expert frozen pipe restoration}. We {minimize water damage|repair and restore quickly|handle the complete cleanup}.',
  '{A burst pipe can release hundreds of gallons per hour|Frozen pipes can cause catastrophic damage|Pipe failures require immediate response}. Our {{city}} team {responds within 60 minutes|stops the damage fast|handles repair and water damage restoration}.'
),
('sewage-cleanup',
  '{Professional|Emergency|Certified|Expert} Sewage Cleanup in {{city}}, {{state}}',
  '{Safe sewage removal and sanitization|Professional black water cleanup|Complete sewage damage restoration}. We {eliminate health hazards|sanitize affected areas|restore your property safely}.',
  '{Sewage backups pose serious health risks|Black water contains dangerous pathogens|Sewage damage requires professional cleanup}. Our {{city}} team {safely removes contamination|thoroughly sanitizes your property|uses EPA-approved disinfectants}.'
);

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
