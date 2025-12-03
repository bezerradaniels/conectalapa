-- Adicionar campo slug à tabela companies
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Criar índice único para o slug
CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_idx ON public.companies(slug);

-- Função para gerar slug a partir do nome
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          unaccent(text_input),
          '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Atualizar slugs existentes baseado no nome
UPDATE public.companies
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Trigger para gerar slug automaticamente ao inserir/atualizar
CREATE OR REPLACE FUNCTION set_company_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_company_slug ON public.companies;
CREATE TRIGGER trigger_set_company_slug
  BEFORE INSERT OR UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION set_company_slug();

-- Comentários
COMMENT ON COLUMN public.companies.slug IS 'URL-friendly slug gerado automaticamente a partir do nome';
COMMENT ON FUNCTION generate_slug(TEXT) IS 'Gera slug amigável para URL removendo acentos e caracteres especiais';
COMMENT ON FUNCTION set_company_slug() IS 'Trigger function para gerar slug automaticamente';
