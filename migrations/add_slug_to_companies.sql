-- Migration: Adicionar coluna slug à tabela companies
-- Data: 2025-12-03
-- Descrição: Adiciona suporte para URLs amigáveis nas páginas de empresas

-- 1. Adicionar coluna slug (nullable inicialmente)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Criar índice único para slugs (para evitar duplicatas)
CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_unique 
ON companies(slug) 
WHERE slug IS NOT NULL;

-- 3. Criar índice para melhorar performance de busca por slug
CREATE INDEX IF NOT EXISTS companies_slug_idx 
ON companies(slug);

-- 4. Adicionar comentário na coluna
COMMENT ON COLUMN companies.slug IS 'URL-friendly identifier for the company (e.g., "padaria-central")';

-- Instruções de uso:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Após executar, rode o script: npm run generate-slugs
-- 3. As empresas existentes terão slugs gerados automaticamente
