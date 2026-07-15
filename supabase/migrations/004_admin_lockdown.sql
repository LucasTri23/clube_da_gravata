-- =============================================
-- Clube da Gravata — Trava de acesso admin
-- Execute no Supabase SQL Editor
-- =============================================
-- Até aqui, qualquer usuário autenticado (auth.role() = 'authenticated')
-- tinha permissão de escrita em products/testimonials, e o cadastro público
-- do Supabase Auth permite que qualquer pessoa crie uma conta e vire
-- "authenticated". Isso troca a checagem para uma lista explícita de admins.

-- Tabela de admins (RLS habilitado, sem policies públicas —
-- só a função is_admin(), que roda com privilégios de dono, consegue ler)
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Admin inicial: conta de login lucastri227@gmail.com já usada no /admin.
-- Para adicionar outro admin, pegue o user_id em Authentication > Users
-- e rode: INSERT INTO admins (user_id) VALUES ('...') ON CONFLICT DO NOTHING;
INSERT INTO admins (user_id) VALUES ('389d3ba1-a72a-4083-a417-1fbfc53843bf')
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- Products / Testimonials / Analytics: troca "authenticated" por "is_admin()"
-- =============================================

DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "testimonials_admin_all" ON testimonials;
CREATE POLICY "testimonials_admin_all" ON testimonials
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "analytics_admin_read" ON analytics_events;
CREATE POLICY "analytics_admin_read" ON analytics_events
  FOR SELECT USING (is_admin());

-- =============================================
-- Storage: troca "TO authenticated" por checagem de is_admin()
-- =============================================

DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "testimonial_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "testimonial_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "testimonial_images_admin_delete" ON storage.objects;

CREATE POLICY "product_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "testimonial_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'testimonial-images' AND is_admin());

CREATE POLICY "testimonial_images_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'testimonial-images' AND is_admin());

CREATE POLICY "testimonial_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'testimonial-images' AND is_admin());

-- =============================================
-- Buckets: restringe tipo e tamanho de arquivo (estavam sem limite algum)
-- =============================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 8388608 -- 8MB
WHERE id IN ('product-images', 'testimonial-images');
