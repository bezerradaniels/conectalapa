-- ============================================
-- CRIAR USUÁRIO ADMIN
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Verificar se o usuário já existe
SELECT id, email FROM auth.users WHERE email = 'admconectalapa@gmail.com';

-- 2. Se não existir, você precisa criar via interface do Supabase:
--    Authentication > Users > Add user > Create new user
--    Email: admconectalapa@gmail.com
--    Password: admin123456
--    Auto Confirm User: ✅ (marque esta opção)

-- 3. Depois de criar o usuário, execute este SQL para criar o perfil e promover a admin:

-- Criar perfil admin automaticamente
INSERT INTO public.profiles (id, name, role)
SELECT id, 'Administrador ConectaLapa', 'admin'
FROM auth.users 
WHERE email = 'admconectalapa@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', name = 'Administrador ConectaLapa';

-- 4. Verificar se foi criado corretamente
SELECT 
    u.id,
    u.email,
    p.name,
    p.role,
    p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'admconectalapa@gmail.com';

-- ============================================
-- CREDENCIAIS DO ADMIN
-- ============================================
-- Email: admconectalapa@gmail.com
-- Senha: admin123456
-- Role: admin
-- ============================================
-- 
-- PASSO A PASSO:
-- 1. Vá em Authentication > Users no Supabase
-- 2. Clique em "Add user" > "Create new user"
-- 3. Preencha:
--    - Email: admconectalapa@gmail.com
--    - Password: admin123456
--    - ✅ Auto Confirm User (IMPORTANTE!)
-- 4. Copie o SQL acima (linha 13-16) e execute no SQL Editor
-- 5. Verifique com o último SELECT (linha 19-26)
-- ============================================
