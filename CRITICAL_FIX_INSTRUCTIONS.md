# CRITICAL FIXES FOR DEPLOYMENT

## Problem Summary
The application is trying to use new database tables (_new suffix), but the Supabase PostgREST schema cache is outdated. We need to:
1. Reload the schema cache in Supabase
2. Import services data from XLSX

## Solution

### Step 1: Reload Schema Cache in Supabase

Go to Supabase SQL Editor and run this command:

```sql
NOTIFY pgrst, 'reload schema';
```

### Step 2: Verify Tables Exist

Run this in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%_new' 
ORDER BY table_name;
```

You should see:
- content_cta_new
- content_faq_new
- content_header_new
- content_hero_new
- content_meta_new
- content_services_new
- content_testimonials_new

### Step 3: Import Services Data

After schema reload, run the import script:

```bash
node import-services-grid.js
```

This will populate `content_services_new` with 96 service records from the XLSX file.

### Step 4: Commit and Deploy

```bash
git add .
git commit -m "Fix TypeScript errors and prepare service data"
git push
```

## What This Fixes

1. **Services showing as 'p'**: Services will now display correctly with proper names
2. **404 errors on service pages**: Service pages will now load with correct data
3. **TypeScript build errors**: All type mismatches have been resolved

## Files Modified

- lib/fetch-content.ts - Fixed ContentMetaNew interface
- lib/generate-metadata.ts - Uses correct property names
- lib/category-mapping.ts - Updated type references

## Files Created

- import-services-grid.js - Imports services from XLSX
- check-service-data.js - Verifies database content
- MIGRATION_service_pages.sql - Creates service page content (if needed later)
