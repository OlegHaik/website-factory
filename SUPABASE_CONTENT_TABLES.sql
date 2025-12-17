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
-- Meta Tags (Title/Description)
-- =============================
CREATE TABLE IF NOT EXISTS content_meta (
  id SERIAL PRIMARY KEY,
  page_type TEXT NOT NULL,
  title_spintax TEXT,
  description_spintax TEXT
);

-- =============================
-- Legal Pages (Privacy / Terms)
-- =============================
CREATE TABLE IF NOT EXISTS content_legal (
  id SERIAL PRIMARY KEY,
  page_type TEXT NOT NULL,
  title TEXT,
  intro_spintax TEXT,
  content_spintax TEXT,
  last_updated TEXT DEFAULT 'January 1, 2025'
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

-- Insert meta content for each page type
INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'homepage',
  '{Trusted|Professional|Expert|Certified|#1 Rated} Fire & Water Restoration in {{city}}, {{state}} | {{business_name}}',
  '{{business_name}} {provides|offers|delivers} {24/7 emergency|professional|expert} water damage restoration, fire cleanup, and mold remediation in {{city}}, {{state}}. {Call now for fast response|Free estimates available|We work with all insurance companies}.'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'homepage');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_water',
  '{Professional|Expert|24/7|Emergency} Water Damage Restoration in {{city}}, {{state}} | {{business_name}}',
  '{Fast water extraction|Emergency flood response|Professional water damage repair} in {{city}}. {{business_name}} {responds within 60 minutes|offers 24/7 service|handles insurance claims}. {Call now|Get a free estimate}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_water');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_fire',
  '{Professional|Expert|Certified} Fire & Smoke Damage Restoration in {{city}}, {{state}} | {{business_name}}',
  '{Complete fire damage restoration|Smoke and soot removal|Fire cleanup services} in {{city}}. {{business_name}} {restores your property|handles full reconstruction|works with your insurance}. {Call 24/7|Free estimates}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_fire');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_mold',
  '{Certified|Professional|Expert} Mold Remediation in {{city}}, {{state}} | {{business_name}}',
  '{Safe mold removal|Professional mold remediation|Certified mold cleanup} in {{city}}. {{business_name}} {eliminates mold at the source|follows IICRC protocols|ensures safe indoor air}. {Call now|Free inspection}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_mold');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_biohazard',
  '{Professional|Certified|Discreet} Biohazard Cleanup in {{city}}, {{state}} | {{business_name}}',
  '{Biohazard cleanup|Trauma scene cleanup|Professional biohazard removal} in {{city}}. {{business_name}} {handles sensitive situations|follows OSHA protocols|provides discreet service}. {Call 24/7}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_biohazard');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_burst',
  '{Emergency|24/7|Fast} Burst Pipe Repair in {{city}}, {{state}} | {{business_name}}',
  '{Burst pipe emergency response|Frozen pipe repair|Pipe damage restoration} in {{city}}. {{business_name}} {responds in 60 minutes|stops damage fast|handles water cleanup}. {Call now}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_burst');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_sewage',
  '{Professional|Emergency|Certified} Sewage Cleanup in {{city}}, {{state}} | {{business_name}}',
  '{Sewage backup cleanup|Black water removal|Sewage damage restoration} in {{city}}. {{business_name}} {safely removes contamination|sanitizes your property|uses EPA-approved methods}. {Call 24/7}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_sewage');

INSERT INTO content_meta (page_type, title_spintax, description_spintax)
SELECT
  'service_area',
  '{Trusted|Professional|Local|Expert} Fire & Water Restoration in {{city}}, {{state}} | {{business_name}}',
  '{{business_name}} {serves|provides restoration services to} {{city}}, {{state}}. {24/7 emergency response|Fast water damage repair|Professional fire restoration}. {Call now for immediate help|Free estimates}!'
WHERE NOT EXISTS (SELECT 1 FROM content_meta WHERE page_type = 'service_area');

-- Insert Privacy Policy + Terms of Use templates
INSERT INTO content_legal (page_type, title, intro_spintax, content_spintax, last_updated)
SELECT
  'privacy_policy',
  'Privacy Policy',
  '{At|Here at} {{business_name}}, we {take your privacy seriously|are committed to protecting your privacy|value your trust and privacy}. This Privacy Policy {explains|describes|outlines} how we {collect, use, and protect|handle|manage} your {personal information|data|information} when you {use our services|visit our website|contact us}.',
  '## Information We Collect\n\n{We collect information you provide directly|When you contact us, we collect information} such as:\n- {Name and contact information|Your name, email, phone number, and address}\n- {Property details|Information about your property and the damage}\n- {Insurance information|Details about your insurance coverage}\n- {Communication records|Records of our communications with you}\n\n## How We Use Your Information\n\n{{business_name}} uses your information to:\n- {Provide restoration services|Deliver the services you requested}\n- {Communicate with you|Keep you updated on your project}\n- {Process insurance claims|Work with your insurance company}\n- {Improve our services|Enhance our customer experience}\n\n## Information Sharing\n\nWe {may share|share} your information with:\n- {Insurance companies|Your insurance provider} (with your consent)\n- {Service partners|Contractors and vendors} who help us deliver services\n- {Legal authorities|Law enforcement} when required by law\n\n## Data Security\n\nWe {implement|use} {industry-standard|appropriate} security measures to protect your {personal information|data}. {However, no method of transmission over the Internet is 100% secure|While we strive to protect your information, we cannot guarantee absolute security}.\n\n## Your Rights\n\nYou have the right to:\n- {Access your personal information|Request a copy of your data}\n- {Correct inaccurate information|Update your information}\n- {Request deletion|Ask us to delete your data}\n- {Opt out of marketing communications|Unsubscribe from our emails}\n\n## Contact Us\n\nIf you have questions about this Privacy Policy, {contact us at|please reach out}:\n\n{{business_name}}\n{{address}}\n{{city}}, {{state}} {{zip_code}}\nPhone: {{phone}}\nEmail: {{email}}',
  'January 1, 2025'
WHERE NOT EXISTS (SELECT 1 FROM content_legal WHERE page_type = 'privacy_policy');

INSERT INTO content_legal (page_type, title, intro_spintax, content_spintax, last_updated)
SELECT
  'terms_of_use',
  'Terms of Use',
  '{Welcome to|Thank you for visiting} {{business_name}}. {By using our website and services|By accessing this website}, you agree to {these Terms of Use|the following terms and conditions}. {Please read them carefully|Review these terms before using our services}.',
  '## Services\n\n{{business_name}} provides {water damage restoration, fire damage restoration, mold remediation, and related services|property restoration and emergency cleanup services} in {{city}}, {{state}} and surrounding areas. {Service availability may vary by location|Not all services are available in all areas}.\n\n## Service Agreement\n\n{When you request our services|Upon booking}, you agree to:\n- {Provide accurate information|Give us correct details about the damage}\n- {Grant access to your property|Allow our technicians access to perform work}\n- {Pay for services rendered|Fulfill payment obligations}\n- {Follow safety instructions|Comply with our safety guidelines}\n\n## Estimates and Pricing\n\n- {We provide free estimates|Estimates are provided at no cost}\n- {Final pricing may vary|Actual costs may differ from estimates} based on {the extent of damage discovered|conditions found during work}\n- {We work directly with insurance companies|Insurance billing is available}\n- {Payment terms will be discussed|We offer flexible payment options} before work begins\n\n## Limitation of Liability\n\n{To the maximum extent permitted by law|Within legal limits}, {{business_name}} {shall not be liable|is not responsible} for:\n- {Indirect or consequential damages|Secondary damages}\n- {Pre-existing conditions|Damage that existed before our arrival}\n- {Delays beyond our control|Force majeure events}\n- {Third-party actions|Actions of your insurance company}\n\n## Intellectual Property\n\n{All content on this website|Website content} including {text, images, logos|all materials} is owned by {{business_name}} and {protected by copyright|may not be reproduced without permission}.\n\n## Dispute Resolution\n\nAny disputes {shall be resolved|will be handled} through:\n1. {Direct negotiation|Good faith discussions}\n2. {Mediation|Third-party mediation} if necessary\n3. {Binding arbitration|Arbitration} in {{state}}\n\n## Changes to Terms\n\n{We reserve the right to|{{business_name}} may} update these Terms {at any time|periodically}. {Continued use constitutes acceptance|Your continued use means you accept changes}.\n\n## Contact Us\n\n{Questions about these Terms|For inquiries}? Contact us:\n\n{{business_name}}\n{{address}}\n{{city}}, {{state}} {{zip_code}}\nPhone: {{phone}}\nEmail: {{email}}',
  'January 1, 2025'
WHERE NOT EXISTS (SELECT 1 FROM content_legal WHERE page_type = 'terms_of_use');

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
