const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // Find the main site
  const { data: mainSite } = await supabase
    .from('sites')
    .select('*')
    .ilike('domain_url', '%connorwaterfirerestoration%')
    .is('slug', null)
    .single();

  console.log('=== MAIN SITE ===');
  if (mainSite) {
    console.log('id:', mainSite.id);
    console.log('domain_url:', mainSite.domain_url);
    console.log('business_name:', mainSite.business_name);
    console.log('address:', mainSite.address || 'NULL');
    console.log('city:', mainSite.city);
    console.log('state:', mainSite.state);
    console.log('zip_code:', mainSite.zip_code);
    console.log('phone:', mainSite.phone);
    console.log('email:', mainSite.email);
  }

  // Find service areas for this domain
  const { data: serviceAreas } = await supabase
    .from('sites')
    .select('*')
    .ilike('domain_url', '%connorwaterfirerestoration%')
    .not('slug', 'is', null)
    .order('slug');

  console.log('\n=== SERVICE AREAS ===');
  console.log('Count:', serviceAreas?.length || 0);

  for (const sa of (serviceAreas || []).slice(0, 5)) {
    console.log('\n' + sa.slug + ':');
    console.log('  address:', sa.address ? `"${sa.address}"` : 'NULL/EMPTY');
    console.log('  city:', sa.city);
    console.log('  state:', sa.state);
    console.log('  zip_code:', sa.zip_code);
    console.log('  phone:', sa.phone);
    console.log('  email:', sa.email);
  }
}

check();
