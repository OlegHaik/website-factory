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
    .select("service_slug, service_title_spintax, service_description_spintax, hero_subheadline_spintax")
    .eq("category", "roofing")
    .order("service_slug");

  console.log("=== content_service_pages (roofing) ===");
  for (const s of servicePages || []) {
    console.log("\n" + s.service_slug + ":");
    console.log("  title_spintax:", (s.service_title_spintax || "NULL").substring(0, 80));
    console.log("  desc_spintax:", (s.service_description_spintax || "NULL").substring(0, 80));
    console.log("  hero_sub:", (s.hero_subheadline_spintax || "NULL").substring(0, 80));
  }

  // Check SERVICES_GRID in xlsx
  console.log("\n\n=== Checking xlsx SERVICES_GRID ===");
  const XLSX = require('xlsx');
  const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');
  const sg = XLSX.utils.sheet_to_json(wb.Sheets['SERVICES_GRID']);
  const roofingSg = sg.filter(r => r.category === 'roofing');

  for (const r of roofingSg) {
    console.log("\n" + r.service_slug + ":");
    console.log("  service_name:", r.service_name);
    console.log("  service_name_spin:", (r.service_name_spin || "NULL").substring(0, 80));
    console.log("  svc_grid_desc:", (r.svc_grid_desc || "NULL").substring(0, 80));
  }
}

check();
