-- =============================================
-- Clube da Gravata — Políticas de Storage
-- Execute no Supabase SQL Editor
-- =============================================
-- Os buckets "product-images" e "testimonial-images" já existem e são
-- públicos para LEITURA, mas RLS em storage.objects bloqueia qualquer
-- escrita (upload/edição/exclusão) até criarmos políticas explícitas
-- para o role "authenticated" (usado pelo login do painel admin).

-- product-images
CREATE POLICY "product_images_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- testimonial-images
CREATE POLICY "testimonial_images_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'testimonial-images');

CREATE POLICY "testimonial_images_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'testimonial-images');

CREATE POLICY "testimonial_images_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'testimonial-images');
