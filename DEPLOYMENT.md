# Deploying to Vercel

This guide shows how to deploy this Next.js app to Vercel safely (no secrets committed).

## Prerequisites

- A GitHub account (with this repo pushed)
- A Vercel account (free at [vercel.com](https://vercel.com))
- A Supabase project with a `sites` table (used as the source of truth)

## Step 1: Supabase project + data

1. In Supabase, create/verify a table named `sites`.
2. Ensure there is at least one row with:
   - `slug` (e.g. `denver-pros`)
   - `business_name`, `phone`, `city`, `state`
   - `domain_url` (the domain you will attach in Vercel, e.g. `example.com`)

Note: this app resolves the current site by request domain and looks up `sites.domain_url`.

## Step 2: Deploy to Vercel

### 2.1 Push Code to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Roofing website"

# Create a new private repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 2.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 2.3 Add Environment Variables

Before clicking "Deploy", add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase **Project URL** (Project Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase **Publishable / anon** key (Project Settings → API / API Keys)

Do NOT paste `service_role` keys into Vercel env vars.

### 2.4 Deploy

Click **"Deploy"** and wait 2-3 minutes. Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy it live

## Step 3: Test Your Deployment

1. Once deployed, Vercel will give you a URL like: `https://your-project.vercel.app`
2. Add a custom domain in Vercel (recommended for multi-site)
3. Ensure the domain exists in `sites.domain_url`
4. Visit the domain root `/` — it should render the correct site

## Step 4: Connect Custom Domain (Optional)

If you have a custom domain:

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your domain (e.g., `miamiexpertroofing.com`)
4. Follow Vercel's DNS instructions
5. Update your Supabase `sites.domain_url` field to match

## Adding More Sites

To add more sites, insert more rows into `sites`.

Each location will automatically get:
- Unique color theme
- Location-specific content
- SEO-optimized pages
- Structured data for Google

## Troubleshooting

### Site shows "No location data found"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel
- Verify your `sites` table has at least one row

### 404 on location pages
- For domain-based routing: verify the current domain matches `sites.domain_url`
- For slug-based routing: ensure the `slug` in the URL matches `sites.slug`

### Changes not showing
- Redeploy from Vercel dashboard
- Or push a new commit to GitHub (auto-deploys)

## Success!

Your roofing website is now live! 🎉

You can:
- Add unlimited locations via Supabase
- Each location gets automatic SEO optimization
- Fully responsive and fast
- Ready for Google indexing
