-- ============================================
-- CORREÇÃO: Remover recursão infinita nas políticas RLS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Remover políticas problemáticas de profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- 2. Remover políticas problemáticas de business_categories
DROP POLICY IF EXISTS "Apenas admins podem gerenciar categorias" ON public.business_categories;

-- 3. Remover políticas problemáticas de neighborhoods
DROP POLICY IF EXISTS "Apenas admins podem gerenciar bairros" ON public.neighborhoods;

-- 4. Remover políticas problemáticas de companies
DROP POLICY IF EXISTS "Admins podem ver todas as empresas" ON public.companies;
DROP POLICY IF EXISTS "Admins podem atualizar todas as empresas" ON public.companies;

-- 5. Remover políticas problemáticas de jobs
DROP POLICY IF EXISTS "Admins podem ver todas as vagas" ON public.jobs;
DROP POLICY IF EXISTS "Admins podem atualizar todas as vagas" ON public.jobs;

-- 6. Remover políticas problemáticas de travel_packages
DROP POLICY IF EXISTS "Admins podem ver todos os pacotes" ON public.travel_packages;
DROP POLICY IF EXISTS "Admins podem atualizar todos os pacotes" ON public.travel_packages;

-- ============================================
-- CRIAR FUNÇÃO SEGURA PARA VERIFICAR SE É ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RECRIAR POLÍTICAS SEM RECURSÃO
-- ============================================

-- Profiles: Admin pode ver todos
CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Business Categories: Admin pode gerenciar
CREATE POLICY "Apenas admins podem gerenciar categorias"
  ON public.business_categories FOR ALL
  USING (public.is_admin());

-- Neighborhoods: Admin pode gerenciar
CREATE POLICY "Apenas admins podem gerenciar bairros"
  ON public.neighborhoods FOR ALL
  USING (public.is_admin());

-- Companies: Admin pode ver e atualizar todas
CREATE POLICY "Admins podem ver todas as empresas"
  ON public.companies FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem atualizar todas as empresas"
  ON public.companies FOR UPDATE
  USING (public.is_admin());

-- Jobs: Admin pode ver e atualizar todas
CREATE POLICY "Admins podem ver todas as vagas"
  ON public.jobs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem atualizar todas as vagas"
  ON public.jobs FOR UPDATE
  USING (public.is_admin());

-- Travel Packages: Admin pode ver e atualizar todos
CREATE POLICY "Admins podem ver todos os pacotes"
  ON public.travel_packages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem atualizar todos os pacotes"
  ON public.travel_packages FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- CONCLUÍDO
-- ============================================
-- As políticas agora usam uma função SECURITY DEFINER
-- que evita a recursão infinita
