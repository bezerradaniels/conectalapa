-- Atualização do Schema para suportar os formulários

-- 1. Atualizar tabela jobs
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS deadline DATE,
ADD COLUMN IF NOT EXISTS work_type TEXT,
ADD COLUMN IF NOT EXISTS work_location TEXT,
ADD COLUMN IF NOT EXISTS how_to_apply JSONB;

-- 2. Atualizar tabela travel_packages
ALTER TABLE public.travel_packages
ADD COLUMN IF NOT EXISTS departure_location TEXT,
ADD COLUMN IF NOT EXISTS return_date DATE,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 3. Criar tabela events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  event_type TEXT,
  is_free BOOLEAN DEFAULT true,
  ticket_price TEXT,
  description TEXT,
  age_rating TEXT,
  logo_url TEXT,
  cover_image TEXT,
  gallery_images TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos podem ver eventos ativos" ON public.events;
CREATE POLICY "Todos podem ver eventos ativos"
  ON public.events FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Usuários podem ver seus próprios eventos" ON public.events;
CREATE POLICY "Usuários podem ver seus próprios eventos"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar eventos" ON public.events;
CREATE POLICY "Usuários podem criar eventos"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios eventos" ON public.events;
CREATE POLICY "Usuários podem atualizar seus próprios eventos"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios eventos" ON public.events;
CREATE POLICY "Usuários podem deletar seus próprios eventos"
  ON public.events FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins podem ver todos os eventos" ON public.events;
CREATE POLICY "Admins podem ver todos os eventos"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins podem atualizar todos os eventos" ON public.events;
CREATE POLICY "Admins podem atualizar todos os eventos"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Atualizar tabela companies para suportar metadados (para FoodForm)
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS metadata JSONB;
