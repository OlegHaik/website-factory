const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yxtdgkdwydmvzgbibrrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA';

const supabase = createClient(supabaseUrl, supabaseKey);

const servicePages = [
  // Water Damage
  {
    category: 'water_damage',
    service_id: 'water_1',
    service_slug: 'water-damage-restoration',
    hero_headline_spintax: '{Emergency|Rapid|24/7|Professional} {Water Damage Restoration|Water Removal|Flood Cleanup} in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Fast|Rapid|Quick|Immediate} {Response|Service} • {Advanced|Professional|Expert} Equipment • {Certified|Licensed|Experienced} Technicians',
    intro_spintax: '{Water damage|Flooding|Water intrusion} can {strike|occur|happen} {without warning|unexpectedly|suddenly}, {causing|creating|leading to} {extensive|significant|severe} {damage|destruction|harm} to your {property|home|building}. Our {certified|expert|professional} team in {{city}}, {{state}} {responds|arrives|is available} {24/7|around the clock|immediately} to {minimize|reduce|prevent} {damage|destruction|losses} and {restore|return|bring back} your {property|space|home}.',
    meta_title_spintax: '{Professional|Expert|Emergency} Water Damage Restoration Services in {{city}}, {{state}} | {{business_name}}',
    meta_description_spintax: '{24/7|Emergency|Professional} water damage restoration in {{city}}, {{state}}. {Fast|Rapid|Quick} response, {advanced|professional} equipment, {certified|licensed} technicians. Call {now|today}: {{phone}}'
  },
  {
    category: 'water_damage',
    service_id: 'water_2',
    service_slug: 'burst-pipe-repair',
    hero_headline_spintax: '{Emergency|Fast|Professional|24/7} Burst Pipe Repair in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Immediate|Fast|Rapid} Response • {Expert|Professional|Experienced} Plumbers • {Complete|Full|Comprehensive} Damage Restoration',
    intro_spintax: 'A {burst|broken|ruptured} pipe {requires|needs|demands} {immediate|instant|urgent} {attention|action|response}. Our {emergency|rapid-response|24/7} team in {{city}}, {{state}} {quickly|rapidly|immediately} {locates|finds|identifies} and {repairs|fixes|restores} {burst pipes|pipe damage|plumbing issues}, then {handles|manages|completes} all {water damage restoration|cleanup|repair work}.',
    meta_title_spintax: 'Emergency Burst Pipe Repair & Water Damage Restoration | {{city}}, {{state}}',
    meta_description_spintax: '24/7 emergency burst pipe repair in {{city}}, {{state}}. {Fast|Rapid|Quick} leak detection, {professional|expert} repairs, {complete|full} water damage restoration. Call {{phone}}'
  },
  {
    category: 'water_damage',
    service_id: 'water_3',
    service_slug: 'sewage-cleanup',
    hero_headline_spintax: '{Professional|Expert|Safe} Sewage Cleanup Services in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Safe|Proper|Complete} {Removal|Cleanup|Remediation} • {Full|Complete|Thorough} {Sanitization|Disinfection|Decontamination} • {Certified|Licensed|Expert} Team',
    intro_spintax: 'Sewage {backups|spills|overflows} {pose|present|create} {serious|severe|significant} health {risks|hazards|dangers}. Our {certified|licensed|professional} team in {{city}}, {{state}} {safely|properly|effectively} {removes|cleans|remediates} {contaminated|sewage|hazardous} {water|materials|waste} and {thoroughly|completely|fully} {sanitizes|disinfects|decontaminates} {affected|contaminated|damaged} {areas|spaces|zones}.',
    meta_title_spintax: 'Professional Sewage Cleanup & Remediation Services | {{city}}, {{state}}',
    meta_description_spintax: 'Safe sewage cleanup and remediation in {{city}}, {{state}}. {Certified|Licensed|Professional} team, {complete|full|thorough} sanitization, {fast|rapid} response. Call {{phone}}'
  },
  {
    category: 'water_damage',
    service_id: 'water_4',
    service_slug: 'flood-damage-repair',
    hero_headline_spintax: '{Complete|Professional|Expert} Flood Damage Repair in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Rapid|Fast|Emergency} Water Extraction • {Complete|Full|Thorough} Drying • {Professional|Expert|Complete} Restoration',
    intro_spintax: 'Flooding {causes|creates|results in} {devastating|extensive|severe} {damage|destruction|harm} that {requires|needs|demands} {professional|expert|specialized} {restoration|repair|remediation}. Our {experienced|certified|professional} team in {{city}}, {{state}} {provides|delivers|offers} {complete|comprehensive|full} flood {damage|restoration|recovery} services.',
    meta_title_spintax: 'Flood Damage Repair & Restoration Services | {{city}}, {{state}} | {{business_name}}',
    meta_description_spintax: 'Professional flood damage repair in {{city}}, {{state}}. {Emergency|24/7|Rapid} response, {advanced|professional} equipment, {complete|full} restoration. Call {{phone}}'
  },
  {
    category: 'water_damage',
    service_id: 'water_5',
    service_slug: 'storm-damage-restoration',
    hero_headline_spintax: '{Emergency|Professional|Expert} Storm Damage Restoration in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Fast|Rapid|24/7} Response • {Complete|Full|Comprehensive} Repairs • {Insurance|Claim} {Assistance|Support|Help}',
    intro_spintax: '{Severe storms|Hurricanes|Severe weather} can {cause|create|result in} {extensive|significant|major} {damage|destruction|harm} to your {property|home|building}. Our {emergency|rapid-response|professional} team in {{city}}, {{state}} {specializes|excels|focuses} in {storm|weather|disaster} {damage|restoration|recovery} services.',
    meta_title_spintax: 'Storm Damage Restoration & Emergency Repairs | {{city}}, {{state}}',
    meta_description_spintax: 'Emergency storm damage restoration in {{city}}, {{state}}. {Fast|Rapid|24/7} response, {complete|comprehensive} repairs, insurance {assistance|support}. Call {{phone}}'
  },
  {
    category: 'water_damage',
    service_id: 'water_6',
    service_slug: 'leak-repair',
    hero_headline_spintax: '{Professional|Expert|Fast} Leak Detection & Repair in {{city}}, {{state}}',
    hero_subheadline_spintax: '{Advanced|Modern|Professional} Detection Equipment • {Expert|Professional|Experienced} Technicians • {Complete|Full} Repair Services',
    intro_spintax: '{Hidden|Concealed|Undetected} leaks can {cause|create|lead to} {significant|extensive|major} {damage|problems|issues} {over time|gradually|eventually}. Our {expert|professional|certified} team in {{city}}, {{state}} uses {advanced|modern|state-of-the-art} {technology|equipment|tools} to {detect|locate|find} and {repair|fix|resolve} leaks {quickly|efficiently|effectively}.',
    meta_title_spintax: 'Professional Leak Detection & Repair Services | {{city}}, {{state}}',
    meta_description_spintax: 'Expert leak detection and repair in {{city}}, {{state}}. {Advanced|Modern} equipment, {experienced|certified} technicians, {complete|full} repair services. Call {{phone}}'
  }
];

async function insertServicePages() {
  console.log('Inserting service pages...');
  
  for (const page of servicePages) {
    const { data, error } = await supabase
      .from('content_service_pages')
      .upsert(page, { onConflict: 'category,service_slug' });
    
    if (error) {
      console.error(`Error inserting ${page.service_slug}:`, error);
    } else {
      console.log(`✓ Inserted ${page.category}/${page.service_slug}`);
    }
  }
  
  console.log('\nDone!');
}

insertServicePages();
