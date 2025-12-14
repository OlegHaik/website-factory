# Water Damage Location Website Factory

A multi-tenant, multi-location **water damage / restoration** website built with Next.js 16, React 19, and Supabase.

## Features

- 🏠 **Multi-Domain Support** - Serve multiple brands from a single codebase (domain-based routing)
- 📍 **Per-Site Service Areas** - Areas come from Supabase and can include stable slugs
- 🧩 **Spintext Templates** - `{a|b|c}` + `{{vars}}` for controlled content variety
- 🔍 **SEO Ready** - Metadata support and clean URLs
- ⚡ **Fast Performance** - Next.js App Router + server rendering
- 🗄️ **Supabase Integration** - Centralized site configuration in a `sites` table

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
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
   ```

### Supabase Database Setup

This app reads site configuration from a table named `sites`.

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for:
- required columns
- recommended formats for `service_areas`, `links`, and `social_links`
- optional RLS policy SQL

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
