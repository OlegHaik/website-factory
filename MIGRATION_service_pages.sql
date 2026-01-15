-- Create content_service_pages table for detailed service pages
-- This table stores full content for each service's dedicated page

CREATE TABLE IF NOT EXISTS content_service_pages (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  hero_headline_spintax TEXT,
  hero_subheadline_spintax TEXT,
  intro_spintax TEXT,
  process_headline_spintax TEXT,
  process_body_spintax TEXT,
  why_choose_headline_spintax TEXT,
  why_choose_body_spintax TEXT,
  faq_headline_spintax TEXT,
  meta_title_spintax TEXT,
  meta_description_spintax TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, service_slug)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_service_pages_category_slug 
  ON content_service_pages(category, service_slug);

-- Enable RLS
ALTER TABLE content_service_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read on content_service_pages" 
  ON content_service_pages FOR SELECT USING (true);

-- Insert service page data based on existing services
-- Water Damage category
INSERT INTO content_service_pages (category, service_id, service_slug, hero_headline_spintax, hero_subheadline_spintax, intro_spintax, meta_title_spintax, meta_description_spintax) VALUES
('water_damage', 'water_1', 'water-damage-restoration', 
  '{Emergency|Rapid|24/7|Professional} {Water Damage Restoration|Water Removal|Flood Cleanup} in {{city}}, {{state}}',
  '{Fast|Rapid|Quick|Immediate} {Response|Service} • {Advanced|Professional|Expert} Equipment • {Certified|Licensed|Experienced} Technicians',
  '{Water damage|Flooding|Water intrusion} can {strike|occur|happen} {without warning|unexpectedly|suddenly}, {causing|creating|leading to} {extensive|significant|severe} {damage|destruction|harm} to your {property|home|building}. Our {certified|expert|professional} team in {{city}}, {{state}} {responds|arrives|is available} {24/7|around the clock|immediately} to {minimize|reduce|prevent} {damage|destruction|losses} and {restore|return|bring back} your {property|space|home}.',
  '{Professional|Expert|Emergency} Water Damage Restoration Services in {{city}}, {{state}} | {{business_name}}',
  '{24/7|Emergency|Professional} water damage restoration in {{city}}, {{state}}. {Fast|Rapid|Quick} response, {advanced|professional} equipment, {certified|licensed} technicians. Call {now|today}: {{phone}}'
),

('water_damage', 'water_2', 'burst-pipe-repair',
  '{Emergency|Fast|Professional|24/7} Burst Pipe Repair in {{city}}, {{state}}',
  '{Immediate|Fast|Rapid} Response • {Expert|Professional|Experienced} Plumbers • {Complete|Full|Comprehensive} Damage Restoration',
  'A {burst|broken|ruptured} pipe {requires|needs|demands} {immediate|instant|urgent} {attention|action|response}. Our {emergency|rapid-response|24/7} team in {{city}}, {{state}} {quickly|rapidly|immediately} {locates|finds|identifies} and {repairs|fixes|restores} {burst pipes|pipe damage|plumbing issues}, then {handles|manages|completes} all {water damage restoration|cleanup|repair work}.',
  'Emergency Burst Pipe Repair & Water Damage Restoration | {{city}}, {{state}}',
  '24/7 emergency burst pipe repair in {{city}}, {{state}}. {Fast|Rapid|Quick} leak detection, {professional|expert} repairs, {complete|full} water damage restoration. Call {{phone}}'
),

('water_damage', 'water_3', 'sewage-cleanup',
  '{Professional|Expert|Safe} Sewage Cleanup Services in {{city}}, {{state}}',
  '{Safe|Proper|Complete} {Removal|Cleanup|Remediation} • {Full|Complete|Thorough} {Sanitization|Disinfection|Decontamination} • {Certified|Licensed|Expert} Team',
  'Sewage {backups|spills|overflows} {pose|present|create} {serious|severe|significant} health {risks|hazards|dangers}. Our {certified|licensed|professional} team in {{city}}, {{state}} {safely|properly|effectively} {removes|cleans|remediates} {contaminated|sewage|hazardous} {water|materials|waste} and {thoroughly|completely|fully} {sanitizes|disinfects|decontaminates} {affected|contaminated|damaged} {areas|spaces|zones}.',
  'Professional Sewage Cleanup & Remediation Services | {{city}}, {{state}}',
  'Safe sewage cleanup and remediation in {{city}}, {{state}}. {Certified|Licensed|Professional} team, {complete|full|thorough} sanitization, {fast|rapid} response. Call {{phone}}'
),

('water_damage', 'water_4', 'flood-damage-repair',
  '{Complete|Professional|Expert} Flood Damage Repair in {{city}}, {{state}}',
  '{Rapid|Fast|Emergency} Water Extraction • {Complete|Full|Thorough} Drying • {Professional|Expert|Complete} Restoration',
  'Flooding {causes|creates|results in} {devastating|extensive|severe} {damage|destruction|harm} that {requires|needs|demands} {professional|expert|specialized} {restoration|repair|remediation}. Our {experienced|certified|professional} team in {{city}}, {{state}} {provides|delivers|offers} {complete|comprehensive|full} flood {damage|restoration|recovery} services.',
  'Flood Damage Repair & Restoration Services | {{city}}, {{state}} | {{business_name}}',
  'Professional flood damage repair in {{city}}, {{state}}. {Emergency|24/7|Rapid} response, {advanced|professional} equipment, {complete|full} restoration. Call {{phone}}'
),

('water_damage', 'water_5', 'storm-damage-restoration',
  '{Emergency|Professional|Expert} Storm Damage Restoration in {{city}}, {{state}}',
  '{Fast|Rapid|24/7} Response • {Complete|Full|Comprehensive} Repairs • {Insurance|Claim} {Assistance|Support|Help}',
  '{Severe storms|Hurricanes|Severe weather} can {cause|create|result in} {extensive|significant|major} {damage|destruction|harm} to your {property|home|building}. Our {emergency|rapid-response|professional} team in {{city}}, {{state}} {specializes|excels|focuses} in {storm|weather|disaster} {damage|restoration|recovery} services.',
  'Storm Damage Restoration & Emergency Repairs | {{city}}, {{state}}',
  'Emergency storm damage restoration in {{city}}, {{state}}. {Fast|Rapid|24/7} response, {complete|comprehensive} repairs, insurance {assistance|support}. Call {{phone}}'
),

('water_damage', 'water_6', 'leak-repair',
  '{Professional|Expert|Fast} Leak Detection & Repair in {{city}}, {{state}}',
  '{Advanced|Modern|Professional} Detection Equipment • {Expert|Professional|Experienced} Technicians • {Complete|Full} Repair Services',
  '{Hidden|Concealed|Undetected} leaks can {cause|create|lead to} {significant|extensive|major} {damage|problems|issues} {over time|gradually|eventually}. Our {expert|professional|certified} team in {{city}}, {{state}} uses {advanced|modern|state-of-the-art} {technology|equipment|tools} to {detect|locate|find} and {repair|fix|resolve} leaks {quickly|efficiently|effectively}.',
  'Professional Leak Detection & Repair Services | {{city}}, {{state}}',
  'Expert leak detection and repair in {{city}}, {{state}}. {Advanced|Modern} equipment, {experienced|certified} technicians, {complete|full} repair services. Call {{phone}}'
);

-- Roofing category
INSERT INTO content_service_pages (category, service_id, service_slug, hero_headline_spintax, hero_subheadline_spintax, intro_spintax, meta_title_spintax, meta_description_spintax) VALUES
('roofing', 'roof_1', 'roof-installation',
  '{Professional|Expert|Quality} Roof Installation Services in {{city}}, {{state}}',
  '{Durable|Quality|Premium} Materials • {Expert|Professional|Experienced} Craftsmen • {Lifetime|Extended|Comprehensive} Warranty',
  'A {new|quality|properly installed} roof is a {major|significant|important} investment that {protects|safeguards|secures} your {home|property|building} for {decades|years|generations}. Our {experienced|certified|professional} roofing team in {{city}}, {{state}} {provides|delivers|offers} {quality|expert|professional} roof {installation|replacement} services.',
  'Professional Roof Installation Services | {{city}}, {{state}} | {{business_name}}',
  'Expert roof installation in {{city}}, {{state}}. {Quality|Premium|Durable} materials, {experienced|certified} roofers, {lifetime|extended} warranty. Call {{phone}} for {free|no-cost} estimate'
),

('roofing', 'roof_2', 'roof-repair',
  '{Fast|Professional|Expert} Roof Repair Services in {{city}}, {{state}}',
  '{Emergency|24/7|Rapid} Repairs • {Leak|Damage} Detection • {Warranty|Guaranteed} {Work|Repairs}',
  'Roof {leaks|damage|problems} {require|need|demand} {immediate|prompt|fast} {attention|repair|action} to {prevent|avoid|stop} {further|additional|more} {damage|destruction|problems}. Our {expert|professional|experienced} team in {{city}}, {{state}} {provides|offers|delivers} {fast|rapid|prompt}, {reliable|quality|professional} roof repair services.',
  'Professional Roof Repair Services | {{city}}, {{state}} | {{business_name}}',
  'Fast roof repair in {{city}}, {{state}}. {Emergency|24/7|Rapid} service, {leak|damage} detection, {guaranteed|warranty} work. Call {{phone}} for {immediate|fast} service'
),

('roofing', 'roof_3', 'shingle-roofing',
  '{Quality|Professional|Expert} Shingle Roofing in {{city}}, {{state}}',
  '{Asphalt|Architectural|Premium} Shingles • {Expert|Professional|Quality} Installation • {Best|Top|Highest} {Rated|Quality} Materials',
  'Asphalt shingle roofing {offers|provides|delivers} {excellent|superior|outstanding} {protection|performance|value} and {aesthetic|curb} appeal. Our {professional|expert|experienced} team in {{city}}, {{state}} {specializes|excels|focuses} in {quality|expert|professional} shingle roof {installation|replacement|repair}.',
  'Asphalt Shingle Roofing Installation & Repair | {{city}}, {{state}}',
  'Quality shingle roofing in {{city}}, {{state}}. {Asphalt|Architectural|Premium} shingles, {expert|professional} installation, {best|top} materials. Call {{phone}}'
),

('roofing', 'roof_4', 'metal-roofing',
  '{Durable|Professional|Premium} Metal Roofing in {{city}}, {{state}}',
  '{Energy|Cost} Efficient • {Lifetime|Long-lasting|Extended} Durability • {Modern|Contemporary|Attractive} {Design|Appearance|Styles}',
  'Metal roofing {provides|offers|delivers} {exceptional|outstanding|superior} {durability|longevity|performance}, {energy|cost} efficiency, and {modern|contemporary|attractive} {styling|appearance|aesthetics}. Our {expert|professional|experienced} team in {{city}}, {{state}} {specializes|excels} in {quality|professional} metal roof {installation|systems}.',
  'Metal Roofing Installation & Repair | {{city}}, {{state}} | {{business_name}}',
  'Professional metal roofing in {{city}}, {{state}}. {Energy|Cost} efficient, {durable|long-lasting}, {modern|attractive} design. Call {{phone}} for {free|no-cost} consultation'
),

('roofing', 'roof_5', 'commercial-roofing',
  '{Commercial|Professional|Expert} Roofing Services in {{city}}, {{state}}',
  '{Flat|Low-slope|Commercial} Roofing • {Preventive|Scheduled|Regular} Maintenance • {Minimal|No} Business Disruption',
  'Commercial {properties|buildings|facilities} {require|need|demand} {specialized|professional|expert} roofing {solutions|services|systems}. Our {experienced|certified|professional} commercial roofing team in {{city}}, {{state}} {provides|delivers|offers} {comprehensive|complete|full} {services|solutions} for {businesses|commercial properties|facilities}.',
  'Commercial Roofing Services | {{city}}, {{state}} | {{business_name}}',
  'Professional commercial roofing in {{city}}, {{state}}. {Flat|Low-slope} roof {experts|specialists}, {scheduled|preventive} maintenance, {minimal|no} disruption. Call {{phone}}'
),

('roofing', 'roof_6', 'emergency-leak',
  '{Emergency|24/7|Immediate} Roof Leak Repair in {{city}}, {{state}}',
  '{Available|On-call} 24/7 • {Fast|Rapid|Immediate} Response • {Temporary|Permanent} {Repairs|Solutions}',
  'Roof leaks {require|need|demand} {immediate|instant|urgent} {attention|action|response} to {prevent|avoid|minimize} {water|interior|structural} damage. Our {emergency|24/7|rapid-response} team in {{city}}, {{state}} is {available|ready|on-call} {24/7|around the clock} for {urgent|emergency} roof {leak|repair} situations.',
  'Emergency Roof Leak Repair | 24/7 Service | {{city}}, {{state}}',
  '24/7 emergency roof leak repair in {{city}}, {{state}}. {Fast|Immediate|Rapid} response, {temporary|permanent} repairs. Call {{phone}} {now|anytime}'
);

-- Mold Remediation category
INSERT INTO content_service_pages (category, service_id, service_slug, hero_headline_spintax, hero_subheadline_spintax, intro_spintax, meta_title_spintax, meta_description_spintax) VALUES
('mold_remediation', 'mold_1', 'mold-inspection',
  '{Professional|Certified|Expert} Mold Inspection in {{city}}, {{state}}',
  '{Comprehensive|Thorough|Complete} Testing • {Certified|Licensed|Expert} Inspectors • {Detailed|Complete|Full} Reports',
  '{Proper|Professional|Thorough} mold inspection is {essential|critical|vital} for {identifying|detecting|finding} {hidden|concealed} mold {problems|issues|growth}. Our {certified|licensed|professional} inspectors in {{city}}, {{state}} {provide|deliver|offer} {comprehensive|detailed|thorough} mold {inspection|testing|assessment} services.',
  'Professional Mold Inspection Services | {{city}}, {{state}} | {{business_name}}',
  'Certified mold inspection in {{city}}, {{state}}. {Comprehensive|Thorough} testing, {detailed|complete} reports, {expert|certified} inspectors. Call {{phone}}'
),

('mold_remediation', 'mold_2', 'mold-removal',
  '{Safe|Professional|Complete} Mold Removal in {{city}}, {{state}}',
  '{Safe|Proper|Complete} Removal • {Full|Complete|Thorough} Containment • {Certified|Licensed|Expert} {Technicians|Specialists}',
  'Mold {removal|remediation|abatement} {requires|needs|demands} {specialized|professional|expert} {knowledge|training|techniques} to {safely|properly|effectively} {eliminate|remove|eradicate} mold without {spreading|distributing} spores. Our {certified|licensed|professional} team in {{city}}, {{state}} {provides|delivers|offers} {complete|safe|professional} mold {removal|remediation} services.',
  'Professional Mold Removal & Remediation | {{city}}, {{state}}',
  'Safe mold removal in {{city}}, {{state}}. {Complete|Proper|Thorough} containment, {certified|licensed} specialists, {guaranteed|effective} results. Call {{phone}}'
),

('mold_remediation', 'mold_3', 'black-mold-removal',
  '{Safe|Professional|Emergency} Black Mold Removal in {{city}}, {{state}}',
  '{Toxic|Hazardous} Mold {Removal|Remediation} • {Complete|Full|Safe} {Containment|Isolation} • {Health|Safety} {Protection|Focused}',
  'Black mold ({Stachybotrys|toxic mold}) {poses|presents|creates} {serious|significant|severe} health {risks|hazards|dangers}. Our {certified|specialized|professional} team in {{city}}, {{state}} {safely|properly|effectively} {removes|remediates|eliminates} black mold using {proper|strict|complete} containment {protocols|procedures}.',
  'Black Mold Removal & Remediation | {{city}}, {{state}} | {{business_name}}',
  'Safe black mold removal in {{city}}, {{state}}. {Toxic|Hazardous} mold {specialists|experts}, {complete|proper} containment, health-focused. Call {{phone}}'
),

('mold_remediation', 'mold_4', 'attic-mold-removal',
  'Attic Mold Removal Services in {{city}}, {{state}}',
  '{Complete|Thorough|Professional} Attic {Remediation|Treatment} • {Ventilation|Moisture} Solutions • {Prevention|Protection}',
  'Attic mold is a {common|frequent|widespread} {problem|issue|concern} caused by {poor|inadequate|insufficient} {ventilation|airflow} and {moisture|humidity|condensation}. Our {expert|professional|experienced} team in {{city}}, {{state}} {removes|eliminates|remediates} attic mold and {addresses|resolves|fixes} the {underlying|root|source} {causes|problems|issues}.',
  'Attic Mold Removal & Prevention | {{city}}, {{state}}',
  'Professional attic mold removal in {{city}}, {{state}}. {Complete|Thorough} remediation, {ventilation|moisture} solutions, {prevention|protection}. Call {{phone}}'
),

('mold_remediation', 'mold_5', 'crawlspace-mold',
  'Crawl Space Mold Remediation in {{city}}, {{state}}',
  '{Complete|Professional|Safe} {Removal|Remediation|Treatment} • {Moisture|Humidity} Control • {Encapsulation|Sealing}',
  'Crawl space mold {thrives|grows|develops} in {damp|humid|wet}, {dark|enclosed} {spaces|areas|environments}. Our {specialized|professional|expert} team in {{city}}, {{state}} {provides|offers|delivers} {complete|comprehensive} crawl space mold {remediation|removal} and {prevention|protection} services.',
  'Crawl Space Mold Remediation & Encapsulation | {{city}}, {{state}}',
  'Professional crawl space mold remediation in {{city}}, {{state}}. {Complete|Safe} removal, moisture control, {encapsulation|sealing}. Call {{phone}}'
),

('mold_remediation', 'mold_6', 'mold-testing',
  '{Comprehensive|Professional|Certified} Mold Testing in {{city}}, {{state}}',
  '{Laboratory|Lab} Analysis • {Air|Surface} {Quality|Testing} • {Detailed|Complete} Reports',
  'Professional mold testing {identifies|determines|detects} the {type|species|nature} and {extent|severity|level} of mold {contamination|presence|growth}. Our {certified|licensed|professional} team in {{city}}, {{state}} {provides|offers|delivers} {accurate|reliable|comprehensive} mold testing with {laboratory|lab} analysis.',
  'Professional Mold Testing & Analysis | {{city}}, {{state}}',
  'Certified mold testing in {{city}}, {{state}}. {Laboratory|Lab} analysis, {air|surface} quality testing, {detailed|comprehensive} reports. Call {{phone}}'
);

-- Fire Damage category
INSERT INTO content_service_pages (category, service_id, service_slug, hero_headline_spintax, hero_subheadline_spintax, intro_spintax, meta_title_spintax, meta_description_spintax) VALUES
('fire_damage', 'fire_1', 'fire-damage-restoration',
  '{Complete|Professional|Expert} Fire Damage Restoration in {{city}}, {{state}}',
  '{24/7|Emergency|Rapid} Response • {Complete|Full|Comprehensive} {Restoration|Recovery|Rebuild}',
  'Fire damage {requires|needs|demands} {immediate|urgent|prompt}, {professional|expert|specialized} {restoration|recovery|repair} services. Our {experienced|certified|professional} team in {{city}}, {{state}} {provides|delivers|offers} {complete|comprehensive|full} fire {damage|restoration|recovery} services {24/7|around the clock}.',
  'Fire Damage Restoration Services | {{city}}, {{state}} | {{business_name}}',
  'Professional fire damage restoration in {{city}}, {{state}}. {24/7|Emergency|Rapid} response, {complete|comprehensive} restoration. Call {{phone}} {now|anytime}'
),

('fire_damage', 'fire_2', 'smoke-damage-cleanup',
  '{Professional|Expert|Complete} Smoke Damage Cleanup in {{city}}, {{state}}',
  '{Odor|Smell} Removal • {Soot|Residue} Cleaning • {Air|Indoor} {Quality|Purification}',
  'Smoke damage {affects|impacts|damages} {every|all} {surface|area|space} and {requires|needs|demands} {specialized|professional|expert} cleaning {techniques|methods|procedures}. Our {certified|trained|professional} team in {{city}}, {{state}} {removes|eliminates|cleans} smoke {damage|odors|residue} and {restores|returns} {air|indoor} quality.',
  'Smoke Damage Cleanup & Odor Removal | {{city}}, {{state}}',
  'Professional smoke damage cleanup in {{city}}, {{state}}. {Odor|Smell} removal, {soot|residue} cleaning, {air|indoor} purification. Call {{phone}}'
),

('fire_damage', 'fire_3', 'soot-removal',
  '{Professional|Expert|Complete} Soot Removal Services in {{city}}, {{state}}',
  '{Specialized|Professional|Expert} Cleaning • {All|Every} {Surfaces|Materials} • {Complete|Thorough} {Restoration|Cleaning}',
  'Soot {particles|residue|contamination} {penetrate|seep into|affect} {every|all} {surface|material|space} and {require|need|demand} {professional|specialized|expert} cleaning {techniques|methods|equipment}. Our {expert|trained|certified} team in {{city}}, {{state}} {safely|properly|effectively} {removes|cleans|eliminates} soot from {all|every} {surfaces|materials|areas}.',
  'Professional Soot Removal & Cleaning Services | {{city}}, {{state}}',
  'Expert soot removal in {{city}}, {{state}}. {Specialized|Professional} cleaning, {all|every} surfaces, {complete|thorough} restoration. Call {{phone}}'
),

('fire_damage', 'fire_4', 'odor-removal',
  '{Complete|Professional|Effective} Fire Odor Removal in {{city}}, {{state}}',
  '{Advanced|Professional|Industrial} {Equipment|Technology|Methods} • {Complete|Total|Permanent} {Odor|Smell} {Elimination|Removal}',
  'Fire {odors|smells} {penetrate|seep into|contaminate} {every|all} {material|surface|space} and {require|need|demand} {professional|specialized|advanced} {removal|elimination|treatment}. Our {expert|certified|professional} team in {{city}}, {{state}} uses {advanced|industrial|professional} {equipment|technology|methods} for {complete|permanent|total} odor {elimination|removal}.',
  'Fire Odor Removal Services | {{city}}, {{state}} | {{business_name}}',
  'Complete fire odor removal in {{city}}, {{state}}. {Advanced|Industrial} equipment, {permanent|total} odor elimination. Call {{phone}}'
),

('fire_damage', 'fire_5', 'structural-repairs',
  '{Complete|Professional|Expert} Fire Damage Structural Repairs in {{city}}, {{state}}',
  '{Licensed|Certified|Experienced} Contractors • {Complete|Full|Comprehensive} {Rebuild|Restoration|Reconstruction}',
  'Fire {damage|destruction} often {requires|needs|demands} {significant|extensive|major} structural {repairs|restoration|reconstruction}. Our {licensed|certified|experienced} contractors in {{city}}, {{state}} {provide|deliver|offer} {complete|comprehensive|quality} structural {repair|restoration|reconstruction} services.',
  'Fire Damage Structural Repairs & Reconstruction | {{city}}, {{state}}',
  'Professional fire damage structural repairs in {{city}}, {{state}}. {Licensed|Certified} contractors, {complete|comprehensive} reconstruction. Call {{phone}}'
),

('fire_damage', 'fire_6', 'content-cleaning',
  '{Professional|Expert|Specialized} Fire Damage Content Cleaning in {{city}}, {{state}}',
  '{Furniture|Belonging|Property} {Restoration|Cleaning|Recovery} • {Specialized|Professional|Expert} {Techniques|Methods|Equipment}',
  'Fire-damaged {contents|belongings|items} often can be {restored|saved|cleaned} with {proper|professional|specialized} cleaning {techniques|methods|procedures}. Our {expert|trained|professional} team in {{city}}, {{state}} {specializes|excels} in fire-damaged {content|belonging|item} {restoration|cleaning|recovery}.',
  'Fire Damage Content Cleaning & Restoration | {{city}}, {{state}}',
  'Professional fire damage content cleaning in {{city}}, {{state}}. {Furniture|Belonging} restoration, {specialized|expert} techniques. Call {{phone}}'
);

-- Add more categories as needed...

COMMIT;
