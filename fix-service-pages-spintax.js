#!/usr/bin/env node
/**
 * Fix spintax format in content_service_pages
 * Converts {{options|like|this}} to {options|like|this}
 * And {{{{city}}}} to {{city}}
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function normalizeSpintax(text) {
  if (!text) return text;
  let result = text;
  // Convert {{options|like|this}} to {options|like|this}
  result = result.replace(/\{\{([^{}]*\|[^{}]*)\}\}/g, '{$1}');
  // Fix variables: {{{{city}}}} -> {{city}}
  result = result.replace(/\{\{\{\{(\w+)\}\}\}\}/g, '{{$1}}');
  return result;
}

async function fix() {
  // Get all service pages
  const { data: pages, error } = await supabase
    .from('content_service_pages')
    .select('id, service_description_spintax, hero_subheadline_spintax, service_title_spintax');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Fixing', pages.length, 'service pages...');

  let fixed = 0;
  for (const page of pages) {
    const updates = {};

    if (page.service_description_spintax) {
      const newVal = normalizeSpintax(page.service_description_spintax);
      if (newVal !== page.service_description_spintax) {
        updates.service_description_spintax = newVal;
      }
    }

    if (page.hero_subheadline_spintax) {
      const newVal = normalizeSpintax(page.hero_subheadline_spintax);
      if (newVal !== page.hero_subheadline_spintax) {
        updates.hero_subheadline_spintax = newVal;
      }
    }

    if (page.service_title_spintax) {
      const newVal = normalizeSpintax(page.service_title_spintax);
      if (newVal !== page.service_title_spintax) {
        updates.service_title_spintax = newVal;
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('content_service_pages')
        .update(updates)
        .eq('id', page.id);

      if (updateError) {
        console.error('Update error for id', page.id, updateError);
      } else {
        fixed++;
      }
    }
  }

  console.log('Fixed', fixed, 'records');

  // Verify
  const { data: check } = await supabase
    .from('content_service_pages')
    .select('service_slug, service_description_spintax')
    .eq('category', 'water_damage')
    .eq('service_slug', 'biohazard-cleanup')
    .single();

  console.log('\nAfter fix (biohazard-cleanup):');
  console.log(check?.service_description_spintax);
}

fix().catch(console.error);
