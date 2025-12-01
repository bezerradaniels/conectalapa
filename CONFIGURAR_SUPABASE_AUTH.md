# Configuração de Autenticação do Supabase

## Problema: Usuários não conseguem se cadastrar

Se os usuários não estão conseguindo fazer login após o cadastro, provavelmente a confirmação de email está ativada.

## Solução: Desabilitar Confirmação de Email

### Passo a Passo:

1. Acesse o **Dashboard do Supabase**
2. Selecione seu projeto **conectalapa**
3. Vá em **Authentication** (menu lateral)
4. Clique em **Settings** (ou "Providers" → "Email")
5. Procure por **"Confirm email"** ou **"Enable email confirmations"**
6. **Desmarque** a opção
7. Clique em **Save**

### Alternativa via SQL:

Se preferir, execute este SQL no **SQL Editor**:

```sql
-- Desabilitar confirmação de email para novos usuários
-- Isso permite que usuários façam login imediatamente após o cadastro
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
```

## Configuração Recomendada para Desenvolvimento:

No painel de **Authentication → Settings**:

- ✅ **Enable Email Provider**
- ❌ **Confirm Email** (desabilitar para desenvolvimento)
- ❌ **Secure Email Change** (desabilitar para desenvolvimento)
- ✅ **Enable Email Autoconfirm** (se disponível)

## Verificar se está funcionando:

Após fazer essa configuração:

1. Crie um novo usuário no site
2. Verifique o console do navegador (F12)
3. Você deve ver logs como:
   - "Attempting signup for: email@exemplo.com"
   - "User created: uuid-do-usuario"
   - "Profile loaded successfully"
4. O usuário deve ser redirecionado para `/painel` automaticamente

## Se ainda não funcionar:

Execute este SQL para verificar o que está acontecendo:

```sql
-- Ver último usuário criado
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;

-- Ver se o perfil foi criado
SELECT 
    u.email,
    p.name,
    p.role,
    p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 1;
```

Se o perfil não foi criado automaticamente, execute:

```sql
-- Criar perfil manualmente para o último usuário
INSERT INTO public.profiles (id, name, role)
SELECT id, 'Usuário', 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
```
