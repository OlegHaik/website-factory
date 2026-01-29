const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // Check content_service_pages for roofing
  const { data: servicePages, error: e1 } = await supabase
    .from("content_service_pages")
    .select("service_slug, service_title_spintax")
    .eq("category", "roofing")
    .order("service_slug");

  console.log("=== content_service_pages (roofing) ===");
  console.log("Count:", servicePages?.length || 0);
  for (const s of servicePages || []) {
    console.log("  -", s.service_slug, ":", (s.service_title_spintax || "").substring(0, 40));
  }

  // Check content_meta_new for roofing services
  const { data: meta, error: e2 } = await supabase
    .from("content_meta_new")
    .select("service_id, meta_title")
    .eq("category", "roofing")
    .eq("page_type", "service")
    .order("service_id");

  console.log("\n=== content_meta_new (roofing, service) ===");
  console.log("Count:", meta?.length || 0);
  for (const m of meta || []) {
    console.log("  -", m.service_id, ":", (m.meta_title || "").substring(0, 40));
  }

  // Check category-mapping.ts for roofing services
  console.log("\n=== Check lib/category-mapping.ts for roofing services ===");
}

check();
