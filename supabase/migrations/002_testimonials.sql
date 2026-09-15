-- =============================================
-- Clube da Gravata — Depoimentos de clientes
-- Execute no Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR NOT NULL,
  feedback TEXT NOT NULL,
  photo_url TEXT,
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(active);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Leitura pública dos ativos; escrita exige autenticação
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (active = true);

CREATE POLICY "testimonials_admin_all" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Storage bucket
-- =============================================
-- Execute manualmente no Supabase Dashboard:
--   Storage > New bucket > Name: "testimonial-images" > Public: ON
-- =============================================
