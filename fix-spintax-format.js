#!/usr/bin/env node
/**
 * Fix spintax format in content_services_new
 * Converts {{option1|option2}} to {option1|option2}
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  // Get all services
  const { data: services, error } = await supabase
    .from('content_services_new')
    .select('id, service_description');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Fixing', services.length, 'services...');

  let fixed = 0;
  for (const svc of services) {
    let desc = svc.service_description;
    if (!desc) continue;

    // Convert {{options|like|this}} to {options|like|this}
    // Pattern: {{...}} where content contains | (spintax options)
    let newDesc = desc.replace(/\{\{([^{}]*\|[^{}]*)\}\}/g, '{$1}');

    // Fix variables: {{{{city}}}} -> {{city}}
    newDesc = newDesc.replace(/\{\{\{\{(\w+)\}\}\}\}/g, '{{$1}}');

    if (newDesc !== desc) {
      const { error: updateError } = await supabase
        .from('content_services_new')
        .update({ service_description: newDesc })
        .eq('id', svc.id);

      if (updateError) {
        console.error('Update error for id', svc.id, updateError);
      } else {
        fixed++;
      }
    }
  }

  console.log('Fixed', fixed, 'records');

  // Verify
  const { data: check } = await supabase
    .from('content_services_new')
    .select('service_slug, service_description')
    .eq('category', 'water_damage')
    .limit(1)
    .single();

  console.log('\nAfter fix:');
  console.log(check?.service_description?.substring(0, 200));
}

fix().catch(console.error);
