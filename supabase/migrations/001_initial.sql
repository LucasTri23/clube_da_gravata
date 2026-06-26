-- =============================================
-- Clube da Gravata — Schema inicial
-- Execute no Supabase SQL Editor
-- =============================================

-- Categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  order_index INT DEFAULT 0
);

-- Seed das categorias
INSERT INTO categories (name, slug, order_index) VALUES
  ('Ternos', 'ternos', 1),
  ('Gravatas', 'gravatas', 2),
  ('Camisas', 'camisas', 3),
  ('Prendedores', 'prendedores', 4),
  ('Feminino', 'feminino', 5),
  ('Infantil', 'infantil', 6)
ON CONFLICT (slug) DO NOTHING;

-- Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL CHECK (event_type IN ('view', 'cart_add', 'whatsapp_click')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  session_id VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Categories: leitura pública
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Products: leitura pública dos ativos; escrita exige autenticação
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Analytics: qualquer um pode inserir (anônimo), apenas admin lê
CREATE POLICY "analytics_public_insert" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_admin_read" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- Storage bucket
-- =============================================
-- Execute manualmente no Supabase Dashboard:
--   Storage > New bucket > Name: "product-images" > Public: ON
-- =============================================
""