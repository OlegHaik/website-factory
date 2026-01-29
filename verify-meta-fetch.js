const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getContentMeta(category, pageType, serviceId) {
  let query = supabase
    .from("content_meta_new")
    .select("*")
    .eq("category", category)
    .eq("page_type", pageType);

  if (serviceId) {
    query = query.eq("service_id", serviceId);
  } else {
    query = query.is("service_id", null);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data ? { title: data.meta_title, description: data.meta_desc } : null;
}

async function verify() {
  const category = "water_damage";
  console.log(`=== Testing META fetch for category: ${category} ===\n`);

  // Test all page types
  const pageTypes = [
    { dbType: "home", codeType: "homepage" },
    { dbType: "service", codeType: "service", serviceId: "water-damage-restoration" },
    { dbType: "area", codeType: "service_area" },
    { dbType: "terms", codeType: "terms_of_use" },
    { dbType: "privacy", codeType: "privacy_policy" },
    { dbType: "feedback", codeType: "feedback" },
  ];

  for (const pt of pageTypes) {
    const meta = await getContentMeta(category, pt.dbType, pt.serviceId);
    console.log(`${pt.codeType} -> ${pt.dbType}:`);
    if (meta) {
      console.log(`  ✓ title: ${(meta.title || "").substring(0, 60)}...`);
      console.log(`  ✓ desc: ${(meta.description || "(empty)").substring(0, 60)}...`);
    } else {
      console.log(`  ✗ NOT FOUND`);
    }
    console.log();
  }

  // Test service pages with specific slugs
  console.log("=== Testing SERVICE page meta with slugs ===\n");
  const serviceSlugs = [
    "water-damage-restoration",
    "fire-smoke-damage",
    "mold-remediation",
    "biohazard-cleanup",
    "burst-pipe-repair",
    "sewage-cleanup"
  ];

  for (const slug of serviceSlugs) {
    const meta = await getContentMeta(category, "service", slug);
    console.log(`service/${slug}:`);
    if (meta) {
      console.log(`  ✓ title: ${(meta.title || "").substring(0, 50)}...`);
    } else {
      console.log(`  ✗ NOT FOUND`);
    }
  }
}

verify();
