-- ============================================
-- CENTRAL DE EMPRESAS - BOM JESUS DA LAPA
-- Schema do Banco de Dados Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: business_categories
-- Categorias de empresas (hierárquica)
-- ============================================
CREATE TABLE IF NOT EXISTS public.business_categories (
  id INTEGER PRIMARY KEY,
  parent_id INTEGER REFERENCES public.business_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_business_categories_parent_id ON public.business_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_business_categories_slug ON public.business_categories(slug);

-- RLS para business_categories (leitura pública)
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorias são públicas"
  ON public.business_categories FOR SELECT
  USING (true);

-- ============================================
-- TABELA: neighborhoods
-- Bairros de Bom Jesus da Lapa
-- ============================================
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_neighborhoods_slug ON public.neighborhoods(slug);

-- RLS para neighborhoods (leitura pública)
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bairros são públicos"
  ON public.neighborhoods FOR SELECT
  USING (true);

-- ============================================
-- TABELA: profiles
-- Perfis de usuários (complementa auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas de admin para categorias e bairros (após criar profiles)
CREATE POLICY "Apenas admins podem gerenciar categorias"
  ON public.business_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem gerenciar bairros"
  ON public.neighborhoods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA: companies
-- Empresas cadastradas
-- ============================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES public.business_categories(id),
  neighborhood_id INTEGER REFERENCES public.neighborhoods(id),
  description TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_category_id ON public.companies(category_id);
CREATE INDEX IF NOT EXISTS idx_companies_neighborhood_id ON public.companies(neighborhood_id);

-- RLS para companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver empresas ativas"
  ON public.companies FOR SELECT
  USING (status = 'active');

CREATE POLICY "Usuários podem ver suas próprias empresas"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar empresas"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias empresas"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias empresas"
  ON public.companies FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as empresas"
  ON public.companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar todas as empresas"
  ON public.companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA: jobs
-- Vagas de emprego
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  salary TEXT,
  description TEXT,
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

-- RLS para jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver vagas ativas"
  ON public.jobs FOR SELECT
  USING (status = 'active');

CREATE POLICY "Usuários podem ver suas próprias vagas"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar vagas"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias vagas"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias vagas"
  ON public.jobs FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as vagas"
  ON public.jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar todas as vagas"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA: travel_packages
-- Pacotes de viagem
-- ============================================
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination TEXT NOT NULL,
  departure_date DATE,
  agency TEXT,
  price DECIMAL(10, 2),
  cover_image TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_travel_packages_user_id ON public.travel_packages(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_packages_status ON public.travel_packages(status);
CREATE INDEX IF NOT EXISTS idx_travel_packages_departure_date ON public.travel_packages(departure_date);

-- RLS para travel_packages
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver pacotes ativos"
  ON public.travel_packages FOR SELECT
  USING (status = 'active');

CREATE POLICY "Usuários podem ver seus próprios pacotes"
  ON public.travel_packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pacotes"
  ON public.travel_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios pacotes"
  ON public.travel_packages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios pacotes"
  ON public.travel_packages FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os pacotes"
  ON public.travel_packages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar todos os pacotes"
  ON public.travel_packages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_companies ON public.companies;
CREATE TRIGGER set_updated_at_companies
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_jobs ON public.jobs;
CREATE TRIGGER set_updated_at_jobs
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_travel_packages ON public.travel_packages;
CREATE TRIGGER set_updated_at_travel_packages
  BEFORE UPDATE ON public.travel_packages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_business_categories ON public.business_categories;
CREATE TRIGGER set_updated_at_business_categories
  BEFORE UPDATE ON public.business_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_neighborhoods ON public.neighborhoods;
CREATE TRIGGER set_updated_at_neighborhoods
  BEFORE UPDATE ON public.neighborhoods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED: Categorias de Negócios
-- ============================================
INSERT INTO public.business_categories (id, parent_id, name, slug, sort_order) VALUES
  -- CATEGORIAS PRINCIPAIS
  (1, NULL, 'Saúde', 'saude', 1),
  (2, NULL, 'Alimentação', 'alimentacao', 2),
  (3, NULL, 'Comércio', 'comercio', 3),
  (4, NULL, 'Construção e Reforma', 'construcao-reforma', 4),
  (5, NULL, 'Serviços', 'servicos', 5),
  (6, NULL, 'Beleza e Estética', 'beleza-estetica', 6),
  (7, NULL, 'Turismo e Viagens', 'turismo-viagens', 7),
  (8, NULL, 'Fitness e Bem-Estar', 'fitness-bem-estar', 8),
  (9, NULL, 'Automotivo', 'automotivo', 9),
  (10, NULL, 'Educação', 'educacao', 10),
  (11, NULL, 'Eventos', 'eventos', 11),
  (12, NULL, 'Tecnologia', 'tecnologia', 12),
  (13, NULL, 'Casa e Serviços Domésticos', 'casa-servicos-domesticos', 13),
  (14, NULL, 'Financeiro', 'financeiro', 14),
  (15, NULL, 'Pets', 'pets', 15),
  
  -- SUBCATEGORIAS SAÚDE
  (101, 1, 'Clínicas', 'clinicas', 1),
  (102, 1, 'Hospitais', 'hospitais', 2),
  (103, 1, 'Laboratórios', 'laboratorios', 3),
  (104, 1, 'Consultórios', 'consultorios', 4),
  (105, 1, 'Farmácias', 'farmacias', 5),
  
  -- SUBCATEGORIAS ALIMENTAÇÃO
  (201, 2, 'Restaurantes', 'restaurantes', 1),
  (202, 2, 'Lanchonetes', 'lanchonetes', 2),
  (203, 2, 'Padarias', 'padarias', 3),
  (204, 2, 'Docerias', 'docerias', 4),
  (205, 2, 'Delivery de Marmita', 'delivery-marmita', 5),
  
  -- SUBCATEGORIAS COMÉRCIO
  (301, 3, 'Moda e Acessórios', 'moda-acessorios', 1),
  (302, 3, 'Calçados', 'calcados', 2),
  (303, 3, 'Papelaria e Escritório', 'papelaria-escritorio', 3),
  (304, 3, 'Presentes e Utilidades', 'presentes-utilidades', 4),
  (305, 3, 'Eletrônicos e Telefonia', 'eletronicos-telefonia', 5),
  
  -- SUBCATEGORIAS CONSTRUÇÃO E REFORMA
  (401, 4, 'Materiais de Construção', 'materiais-construcao', 1),
  (402, 4, 'Engenharia e Arquitetura', 'engenharia-arquitetura', 2),
  (403, 4, 'Marcenaria e Móveis Planejados', 'marcenaria-moveis-planejados', 3),
  (404, 4, 'Serviços de Reforma', 'servicos-reforma', 4),
  
  -- SUBCATEGORIAS SERVIÇOS
  (501, 5, 'Contabilidade', 'contabilidade', 1),
  (502, 5, 'Advocacia', 'advocacia', 2),
  (503, 5, 'Consultoria', 'consultoria', 3),
  (504, 5, 'Serviços Gerais', 'servicos-gerais', 4),
  (505, 5, 'Marketing e Publicidade', 'marketing-publicidade', 5),
  
  -- SUBCATEGORIAS BELEZA E ESTÉTICA
  (601, 6, 'Salão de Beleza', 'salao-beleza', 1),
  (602, 6, 'Barbearia', 'barbearia', 2),
  (603, 6, 'Estética Avançada', 'estetica-avancada', 3),
  (604, 6, 'Manicure e Pedicure', 'manicure-pedicure', 4),
  
  -- SUBCATEGORIAS TURISMO E VIAGENS
  (701, 7, 'Agências de Turismo', 'agencias-turismo', 1),
  (702, 7, 'Hotéis e Pousadas', 'hoteis-pousadas', 2),
  (703, 7, 'Guias Turísticos', 'guias-turisticos', 3),
  (704, 7, 'Transporte Turístico', 'transporte-turistico', 4),
  
  -- SUBCATEGORIAS FITNESS E BEM-ESTAR
  (801, 8, 'Academias', 'academias', 1),
  (802, 8, 'Estúdios de Pilates', 'estudios-pilates', 2),
  (803, 8, 'Estúdios de Dança', 'estudios-danca', 3),
  (804, 8, 'Yoga e Meditação', 'yoga-meditacao', 4),
  
  -- SUBCATEGORIAS AUTOMOTIVO
  (901, 9, 'Mecânicas', 'mecanicas', 1),
  (902, 9, 'Autopeças', 'autopecas', 2),
  (903, 9, 'Lava-Jatos', 'lava-jatos', 3),
  (904, 9, 'Funilaria e Pintura', 'funilaria-pintura', 4),
  
  -- SUBCATEGORIAS EDUCAÇÃO
  (1001, 10, 'Escolas', 'escolas', 1),
  (1002, 10, 'Cursos Livres', 'cursos-livres', 2),
  (1003, 10, 'Cursos Profissionalizantes', 'cursos-profissionalizantes', 3),
  (1004, 10, 'Reforço Escolar', 'reforco-escolar', 4),
  
  -- SUBCATEGORIAS EVENTOS
  (1101, 11, 'Buffet', 'buffet', 1),
  (1102, 11, 'Locação de Espaço', 'locacao-espaco', 2),
  (1103, 11, 'Som e Iluminação', 'som-iluminacao', 3),
  (1104, 11, 'Decoração de Eventos', 'decoracao-eventos', 4),
  
  -- SUBCATEGORIAS TECNOLOGIA
  (1201, 12, 'Assistência Técnica', 'assistencia-tecnica', 1),
  (1202, 12, 'Desenvolvimento de Software', 'desenvolvimento-software', 2),
  (1203, 12, 'Provedores de Internet', 'provedores-internet', 3),
  
  -- SUBCATEGORIAS CASA E SERVIÇOS DOMÉSTICOS
  (1301, 13, 'Limpeza Residencial', 'limpeza-residencial', 1),
  (1302, 13, 'Jardinagem', 'jardinagem', 2),
  (1303, 13, 'Manutenção Elétrica', 'manutencao-eletrica', 3),
  (1304, 13, 'Manutenção Hidráulica', 'manutencao-hidraulica', 4),
  
  -- SUBCATEGORIAS FINANCEIRO
  (1401, 14, 'Correspondentes Bancários', 'correspondentes-bancarios', 1),
  (1402, 14, 'Seguradoras', 'seguradoras', 2),
  (1403, 14, 'Consultoria Financeira', 'consultoria-financeira', 3),
  
  -- SUBCATEGORIAS PETS
  (1501, 15, 'Pet Shops', 'pet-shops', 1),
  (1502, 15, 'Clínicas Veterinárias', 'clinicas-veterinarias', 2),
  (1503, 15, 'Banho e Tosa', 'banho-tosa', 3),
  (1504, 15, 'Hospedagem para Pets', 'hospedagem-pets', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED: Bairros de Bom Jesus da Lapa
-- ============================================
INSERT INTO public.neighborhoods (id, name, slug) VALUES
  (1,  'Centro',                      'centro'),
  (2,  'Cavalhadas',                  'cavalhadas'),
  (3,  'Beira Rio',                   'beira-rio'),
  (4,  'Barrinha',                    'barrinha'),
  (5,  'Guarani',                     'guarani'),
  (6,  'Jurema',                      'jurema'),
  (7,  'Amaralina',                   'amaralina'),
  (8,  'Magalhães Neto',              'magalhaes-neto'),
  (9,  'João Paulo II',               'joao-paulo-ii'),
  (10, 'Maribondo',                   'maribondo'),
  (11, 'Loteamento Mirante da Lapa',  'loteamento-mirante-da-lapa'),
  (12, 'Loteamento Nova Lapa',        'loteamento-nova-lapa'),
  (13, 'Loteamento São Conrado',      'loteamento-sao-conrado'),
  (14, 'Loteamento Bom Jesus',        'loteamento-bom-jesus'),
  (15, 'Loteamento Novo Horizonte',   'loteamento-novo-horizonte'),
  (16, 'Loteamento Santa Luzia',      'loteamento-santa-luzia'),
  (17, 'Loteamento Santa Cruz',       'loteamento-santa-cruz'),
  (18, 'Loteamento Água Viva',        'loteamento-agua-viva'),
  (19, 'Residencial Primavera I',     'residencial-primavera-1'),
  (20, 'Residencial Primavera II',    'residencial-primavera-2'),
  (21, 'Residencial B',               'residencial-b'),
  (22, 'Residencial Bom Jesus',       'residencial-bom-jesus'),
  (23, 'Residencial Bela Vista',      'residencial-bela-vista'),
  (24, 'Residencial Cidade Nova',     'residencial-cidade-nova'),
  (25, 'Residencial Pioneiros',       'residencial-pioneiros'),
  (26, 'Residencial Caminho das Águas','residencial-caminho-das-aguas'),
  (27, 'Nova Brasília',               'nova-brasilia'),
  (28, 'Nova Brasília II',            'nova-brasilia-2'),
  (29, 'Nova Jerusalém (Campinhos)',  'nova-jerusalem-campinhos'),
  (30, 'Nova Lapa',                   'nova-lapa'),
  (31, 'Nova Esperança',              'nova-esperanca'),
  (32, 'Lagoa Grande',                'lagoa-grande'),
  (33, 'Maravilhas I',                'maravilhas-1'),
  (34, 'Maravilhas II',               'maravilhas-2'),
  (35, 'Parque Verde',                'parque-verde'),
  (36, 'Parque Verde II',             'parque-verde-2'),
  (37, 'São João',                    'sao-joao'),
  (38, 'Vila Topázio',                'vila-topazio'),
  (39, 'Vila Nova',                   'vila-nova'),
  (40, 'Vila São Francisco',          'vila-sao-francisco'),
  (41, 'Vila Pope',                   'vila-pope'),
  (42, 'Vila Maria',                  'vila-maria'),
  (43, 'Vila Nova Era',               'vila-nova-era'),
  (44, 'Formoso',                     'formoso'),
  (45, 'Formoso II',                  'formoso-2'),
  (46, 'Rio Corrente',                'rio-corrente'),
  (47, 'Capoeirão',                   'capoeirao'),
  (48, 'Queimada Grande',             'queimada-grande'),
  (49, 'Sobradinho',                  'sobradinho'),
  (50, 'Pedra Branca',                'pedra-branca'),
  (51, 'Malhada',                     'malhada')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Bucket para imagens de empresas
INSERT INTO storage.buckets (id, name, public)
VALUES ('companies', 'companies', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para imagens de pacotes
INSERT INTO storage.buckets (id, name, public)
VALUES ('travel-packages', 'travel-packages', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para companies
CREATE POLICY "Usuários podem fazer upload de imagens de empresas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'companies' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Imagens de empresas são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'companies');

CREATE POLICY "Usuários podem atualizar suas próprias imagens"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'companies' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas próprias imagens"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'companies' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Políticas de storage para travel-packages
CREATE POLICY "Usuários podem fazer upload de imagens de pacotes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'travel-packages' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Imagens de pacotes são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'travel-packages');

CREATE POLICY "Usuários podem atualizar suas próprias imagens de pacotes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'travel-packages' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas próprias imagens de pacotes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'travel-packages' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
