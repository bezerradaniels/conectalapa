# 👤 Usuário Demo

## Opção 1: Criar via Interface do Supabase

### Passo 1: Criar o usuário
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Authentication** > **Users**
4. Clique em **Add user** > **Create new user**
5. Preencha:
   - **Email**: `demo@conectalapa.com`
   - **Password**: `demo123456`
   - **Auto Confirm User**: ✅ (marque esta opção)
6. Clique em **Create user**

### Passo 2: Criar o perfil manualmente
1. Copie o **ID do usuário** criado (algo como: `123e4567-e89b-12d3-a456-426614174000`)
2. Vá em **SQL Editor**
3. Execute este SQL (substitua o ID):

```sql
INSERT INTO public.profiles (id, name, role)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000', -- Cole o ID do usuário aqui
  'Usuário Demo',
  'user'
);
```

## Opção 2: Criar via SQL (Recomendado)

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar usuário demo no auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@conectalapa.com',
  crypt('demo123456', gen_salt('bf')), -- Senha: demo123456
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Usuário Demo"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

⚠️ **Nota**: Este método pode não funcionar devido a restrições do Supabase. Use a **Opção 1** se houver erro.

## Opção 3: Criar via Aplicação

A forma mais simples é usar a própria aplicação:

1. Acesse `http://localhost:5173`
2. Clique em **Cadastrar**
3. Preencha:
   - **Nome**: Usuário Demo
   - **Email**: demo@conectalapa.com
   - **WhatsApp**: (77) 99999-9999
   - **Senha**: demo123456
   - Aceite os termos
4. Clique em **Criar conta**

O perfil será criado automaticamente pelo trigger!

## 📋 Credenciais do Usuário Demo

Após criar, use estas credenciais para fazer login:

- **Email**: `demo@conectalapa.com`
- **Senha**: `demo123456`

## 🔧 Adicionar Dados de Exemplo

Após criar o usuário demo, você pode adicionar alguns dados de exemplo:

```sql
-- Pegar o ID do usuário demo
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Buscar o ID do usuário demo
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@conectalapa.com';

  -- Inserir uma empresa de exemplo
  INSERT INTO public.companies (name, category_id, neighborhood_id, description, address, phone, whatsapp, email, status, user_id)
  VALUES (
    'Empresa Demo Tech',
    1201, -- Assistência Técnica
    1, -- Centro
    'Empresa de demonstração para testes do sistema.',
    'Rua Principal, 123 - Centro',
    '(77) 3481-1234',
    '(77) 99999-8888',
    'contato@empresademo.com',
    'active',
    demo_user_id
  );

  -- Inserir uma vaga de exemplo
  INSERT INTO public.jobs (title, company_id, salary, description, requirements, status, user_id)
  VALUES (
    'Desenvolvedor Web',
    (SELECT id FROM public.companies WHERE user_id = demo_user_id LIMIT 1),
    'R$ 3.000,00',
    'Vaga para desenvolvedor web com experiência em React.',
    'Conhecimento em React, TypeScript e Git.',
    'active',
    demo_user_id
  );

  -- Inserir um pacote de viagem de exemplo
  INSERT INTO public.travel_packages (destination, departure_date, agency, price, description, status, user_id)
  VALUES (
    'Salvador - BA',
    '2025-12-25',
    'Lapa Tur',
    1500.00,
    'Pacote completo para Salvador incluindo hotel e passeios.',
    'active',
    demo_user_id
  );
END $$;
```

## ✅ Verificar

Após criar o usuário:

1. Faça login com as credenciais
2. Acesse o **Painel**
3. Você deve ver as empresas, vagas e pacotes de exemplo

---

**Usuário demo criado com sucesso!** 🎉
