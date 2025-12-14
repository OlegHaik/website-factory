# Roofing Business Multi-Location Website

A modern, dynamic multi-location roofing business website template built with Next.js 16, React 19, and Supabase.

## Features

- 🏠 **Multi-Domain Support** - Serve multiple roofing businesses from a single codebase
- 📍 **Location-Based Content** - Dynamic content generation based on city/state
- 🎨 **Color Theming** - Automatic color theme assignment per domain
- 📱 **Responsive Design** - Mobile-first design with sticky CTAs
- 🔍 **SEO Optimized** - Built-in meta tags and structured data (Schema.org)
- ⚡ **Fast Performance** - Built with Next.js 16 and React Server Components
- 🗄️ **Supabase Integration** - Centralized location data management

## Tech Stack

- **Framework**: Next.js 16
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **UI Components**: Radix UI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- pnpm (recommended) or npm

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Update your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_DOMAIN=generalroofing.com
   ```

### Supabase Database Setup

Create a table named `locations_template` in your Supabase database with the following schema:

```sql
create table locations_template (
  id uuid default gen_random_uuid() primary key,
  slug text not null,
  domain text not null,
  city text not null,
  state text not null,
  phone text not null,
  address text,
  postal_code text,
  business_name text not null,
  is_active boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

Add your location data to this table.

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   └── [slug]/            # Dynamic location pages
├── components/            # React components
│   ├── about.tsx
│   ├── services.tsx
│   ├── faq.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── color-themes.ts   # Theme & content generation
│   └── get-location-data.ts
└── public/               # Static assets

```

## Customization

### Services
Edit the services array in [components/services.tsx](components/services.tsx) to customize the roofing services offered.

### Content Variants
Modify the content variants in [lib/color-themes.ts](lib/color-themes.ts) to adjust headlines, descriptions, and CTAs.

### FAQ
Update the questions and answers in [components/faq.tsx](components/faq.tsx).

## Deployment

Deploy to Vercel with one click or via CLI:

```bash
vercel deploy
```

Make sure to add your environment variables in the Vercel dashboard.

## License

MIT
