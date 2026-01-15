-- Create styles table for category-specific styling
-- Each category has unique colors, fonts, and visual settings

CREATE TABLE IF NOT EXISTS public.styles (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  fonts JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default styles for all categories
INSERT INTO public.styles (category, colors, fonts) VALUES
('water_damage', 
  '{"primary": "#1e40af", "secondary": "#3b82f6", "accent": "#60a5fa", "accentHover": "#3b82f6"}'::jsonb,
  '{"heading": "Inter", "body": "Inter"}'::jsonb
),
('roofing',
  '{"primary": "#b91c1c", "secondary": "#dc2626", "accent": "#ef4444", "accentHover": "#dc2626"}'::jsonb,
  '{"heading": "Roboto", "body": "Roboto"}'::jsonb
),
('mold_remediation',
  '{"primary": "#065f46", "secondary": "#059669", "accent": "#10b981", "accentHover": "#059669"}'::jsonb,
  '{"heading": "Montserrat", "body": "Open Sans"}'::jsonb
),
('adu_builder',
  '{"primary": "#7c2d12", "secondary": "#c2410c", "accent": "#f97316", "accentHover": "#ea580c"}'::jsonb,
  '{"heading": "Poppins", "body": "Lato"}'::jsonb
),
('air_conditioning',
  '{"primary": "#0c4a6e", "secondary": "#0284c7", "accent": "#38bdf8", "accentHover": "#0ea5e9"}'::jsonb,
  '{"heading": "Nunito", "body": "Source Sans Pro"}'::jsonb
),
('air_duct',
  '{"primary": "#1e3a8a", "secondary": "#2563eb", "accent": "#60a5fa", "accentHover": "#3b82f6"}'::jsonb,
  '{"heading": "Raleway", "body": "Roboto"}'::jsonb
),
('bathroom_remodel',
  '{"primary": "#155e75", "secondary": "#0891b2", "accent": "#06b6d4", "accentHover": "#0891b2"}'::jsonb,
  '{"heading": "Playfair Display", "body": "Lora"}'::jsonb
),
('chimney',
  '{"primary": "#991b1b", "secondary": "#dc2626", "accent": "#f87171", "accentHover": "#ef4444"}'::jsonb,
  '{"heading": "Merriweather", "body": "PT Sans"}'::jsonb
),
('garage_door',
  '{"primary": "#4c1d95", "secondary": "#7c3aed", "accent": "#a78bfa", "accentHover": "#8b5cf6"}'::jsonb,
  '{"heading": "Oswald", "body": "Roboto"}'::jsonb
),
('heating',
  '{"primary": "#be123c", "secondary": "#fb7185", "accent": "#fda4af", "accentHover": "#fb7185"}'::jsonb,
  '{"heading": "Ubuntu", "body": "Noto Sans"}'::jsonb
),
('kitchen_remodel',
  '{"primary": "#9f1239", "secondary": "#e11d48", "accent": "#f43f5e", "accentHover": "#e11d48"}'::jsonb,
  '{"heading": "Crimson Text", "body": "Libre Baskerville"}'::jsonb
),
('locksmith',
  '{"primary": "#713f12", "secondary": "#a16207", "accent": "#eab308", "accentHover": "#ca8a04"}'::jsonb,
  '{"heading": "Archivo", "body": "Work Sans"}'::jsonb
),
('pest_control',
  '{"primary": "#14532d", "secondary": "#16a34a", "accent": "#4ade80", "accentHover": "#22c55e"}'::jsonb,
  '{"heading": "Exo 2", "body": "Rubik"}'::jsonb
),
('plumbing',
  '{"primary": "#1e40af", "secondary": "#3b82f6", "accent": "#60a5fa", "accentHover": "#3b82f6"}'::jsonb,
  '{"heading": "Inter", "body": "Inter"}'::jsonb
),
('pool_contractor',
  '{"primary": "#075985", "secondary": "#0ea5e9", "accent": "#7dd3fc", "accentHover": "#38bdf8"}'::jsonb,
  '{"heading": "Barlow", "body": "Karla"}'::jsonb
)
ON CONFLICT (category) DO NOTHING;

-- Enable RLS
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read
CREATE POLICY "Allow public read on styles" ON public.styles
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update on styles" ON public.styles
  FOR UPDATE USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.styles IS 'Category-specific styling configuration including colors and fonts';
