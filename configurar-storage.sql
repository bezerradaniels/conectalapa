-- ============================================
-- CONFIGURAÇÃO DE STORAGE PARA IMAGENS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CRIAR BUCKETS DE STORAGE
-- ============================================

-- Bucket para logos de empresas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para capas de empresas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-covers',
  'company-covers',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para galeria de empresas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-gallery',
  'company-gallery',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para imagens de eventos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events',
  'events',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para imagens de alimentação
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'foods',
  'foods',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. POLÍTICAS DE ACESSO - COMPANY LOGOS
-- ============================================

-- Permitir usuários fazerem upload de seus próprios logos
CREATE POLICY "Usuários podem fazer upload de logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Logos são públicos (qualquer um pode ver)
CREATE POLICY "Logos são públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

-- Usuários podem atualizar seus próprios logos
CREATE POLICY "Usuários podem atualizar seus logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Usuários podem deletar seus próprios logos
CREATE POLICY "Usuários podem deletar seus logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 3. POLÍTICAS DE ACESSO - COMPANY COVERS
-- ============================================

CREATE POLICY "Usuários podem fazer upload de capas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Capas são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-covers');

CREATE POLICY "Usuários podem atualizar suas capas"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas capas"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 4. POLÍTICAS DE ACESSO - COMPANY GALLERY
-- ============================================

CREATE POLICY "Usuários podem fazer upload na galeria"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-gallery' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Galeria é pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-gallery');

CREATE POLICY "Usuários podem atualizar imagens da galeria"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-gallery' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar imagens da galeria"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-gallery' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 5. POLÍTICAS DE ACESSO - EVENTS
-- ============================================

CREATE POLICY "Usuários podem fazer upload de imagens de eventos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'events' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Imagens de eventos são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'events');

CREATE POLICY "Usuários podem atualizar imagens de eventos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'events' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar imagens de eventos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'events' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 6. POLÍTICAS DE ACESSO - FOODS
-- ============================================

CREATE POLICY "Usuários podem fazer upload de imagens de alimentação"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'foods' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Imagens de alimentação são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'foods');

CREATE POLICY "Usuários podem atualizar imagens de alimentação"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'foods' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar imagens de alimentação"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'foods' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 7. ATUALIZAR SCHEMA DAS TABELAS
-- ============================================

-- Adicionar campos de imagem na tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];

-- Adicionar campos de imagem nas outras tabelas (se necessário)
-- Atualizar travel_packages (já tem cover_image, adicionar outras se necessário)
-- Adicionar campos em events e foods quando as tabelas forem criadas

-- ============================================
-- 8. VERIFICAR CONFIGURAÇÃO
-- ============================================

-- Listar todos os buckets criados
SELECT * FROM storage.buckets WHERE id LIKE 'company%' OR id IN ('events', 'foods');

-- Listar todas as políticas de storage
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- 9. EXEMPLO DE USO NO FRONTEND
-- ============================================

/*
// Upload de logo
const uploadLogo = async (file: File, userId: string) => {
  const fileName = `${userId}/logo-${Date.now()}.${file.name.split('.').pop()}`;
  const { data, error } = await supabase.storage
    .from('company-logos')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('company-logos')
    .getPublicUrl(fileName);
  
  return publicUrl;
};

// Upload de galeria
const uploadGalleryImages = async (files: File[], userId: string) => {
  const urls = [];
  
  for (const file of files) {
    const fileName = `${userId}/gallery-${Date.now()}-${Math.random()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('company-gallery')
      .upload(fileName, file);
    
    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('company-gallery')
        .getPublicUrl(fileName);
      urls.push(publicUrl);
    }
  }
  
  return urls;
};
*/

-- ============================================
-- CONFIGURAÇÃO CONCLUÍDA!
-- ============================================
-- Buckets criados:
-- ✅ company-logos (5MB)
-- ✅ company-covers (10MB)
-- ✅ company-gallery (10MB, até 10 imagens)
-- ✅ events (10MB)
-- ✅ foods (10MB)
-- ✅ travel-packages (já existente)
--
-- Todos os buckets permitem:
-- - Upload apenas pelo dono (user_id na pasta)
-- - Visualização pública
-- - Edição/Deleção apenas pelo dono
-- ============================================
