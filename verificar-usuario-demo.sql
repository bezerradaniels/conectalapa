-- Verificar se o usuário demo existe no auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'demo@conectalapa.com';

-- Verificar se o perfil existe no profiles
SELECT * 
FROM public.profiles 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'demo@conectalapa.com');

-- Se o perfil não existir, criar manualmente
-- Primeiro, pegue o ID do usuário acima e substitua aqui:
-- INSERT INTO public.profiles (id, name, role)
-- VALUES ('COLE_O_ID_AQUI', 'Usuário Demo', 'user');

-- Ou use este comando que cria automaticamente se não existir:
INSERT INTO public.profiles (id, name, role)
SELECT id, 'Usuário Demo', 'user'
FROM auth.users 
WHERE email = 'demo@conectalapa.com'
ON CONFLICT (id) DO NOTHING;
