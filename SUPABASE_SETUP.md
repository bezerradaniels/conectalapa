# 🚀 Guia de Configuração do Supabase

## Passo 1: Executar o Schema SQL

Você precisa executar o arquivo `supabase-schema.sql` no seu projeto Supabase para criar as tabelas e configurações necessárias.

### Opção A: Via Dashboard do Supabase (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto: **ierpedlnxfjgbyqurzyw**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase-schema.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)

### Opção B: Via CLI do Supabase

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Executar o schema
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.ierpedlnxfjgbyqurzyw.supabase.co:5432/postgres"
```

## Passo 2: Verificar as Tabelas Criadas

Após executar o schema, verifique se as seguintes tabelas foram criadas:

1. **profiles** - Perfis de usuários
2. **companies** - Empresas cadastradas
3. **jobs** - Vagas de emprego
4. **travel_packages** - Pacotes de viagem

### Como verificar:

1. No Supabase Dashboard, vá em **Table Editor**
2. Você deve ver todas as 4 tabelas listadas
3. Clique em cada uma para ver a estrutura

## Passo 3: Configurar Storage (Buckets)

O schema já cria os buckets automaticamente, mas verifique:

1. No Supabase Dashboard, vá em **Storage**
2. Você deve ver dois buckets:
   - **companies** (para imagens de empresas)
   - **travel-packages** (para imagens de pacotes)

## Passo 4: Testar a Autenticação

### Criar primeiro usuário:

1. Acesse a aplicação em `http://localhost:5173`
2. Clique em **Cadastrar**
3. Preencha os dados:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
4. Clique em **Criar Conta**

### Verificar no Supabase:

1. No Dashboard, vá em **Authentication** > **Users**
2. Você deve ver o usuário criado
3. Vá em **Table Editor** > **profiles**
4. Você deve ver o perfil criado automaticamente (graças ao trigger)

## Passo 5: Criar um Usuário Admin (Opcional)

Para ter acesso administrativo:

1. Crie um usuário normalmente
2. No Supabase Dashboard, vá em **Table Editor** > **profiles**
3. Encontre o usuário que você quer tornar admin
4. Clique na linha para editar
5. Mude o campo **role** de `user` para `admin`
6. Salve

Agora esse usuário terá acesso ao painel administrativo!

## Passo 6: Testar o Sistema

### Teste de Login:
1. Faça logout (se estiver logado)
2. Clique em **Entrar**
3. Use as credenciais do usuário criado
4. Você deve ser redirecionado para a home

### Teste de Cadastro de Empresa:
1. Faça login
2. Clique em **Painel** na sidebar
3. Você verá o dashboard (vazio por enquanto)
4. Navegue para `/empresa/cadastrar`
5. Preencha o formulário
6. Clique em **Salvar Empresa**

### Verificar no Banco:
1. No Supabase Dashboard, vá em **Table Editor** > **companies**
2. Você deve ver a empresa cadastrada com status `pending`

## 🔐 Políticas de Segurança (RLS)

O schema já configurou Row Level Security (RLS) para todas as tabelas:

### Usuários podem:
- ✅ Ver suas próprias empresas/vagas/pacotes
- ✅ Ver empresas/vagas/pacotes com status `active`
- ✅ Criar novos cadastros (status inicial: `pending`)
- ✅ Editar/deletar seus próprios cadastros

### Admins podem:
- ✅ Ver TODOS os cadastros (incluindo `pending`)
- ✅ Aprovar/rejeitar cadastros
- ✅ Editar qualquer cadastro
- ✅ Ver todos os usuários

## 📊 Estrutura do Banco de Dados

```
auth.users (gerenciado pelo Supabase)
    └── profiles (1:1)
            ├── companies (1:N)
            ├── jobs (1:N)
            └── travel_packages (1:N)

jobs
    └── companies (N:1) [opcional]
```

## 🔄 Triggers Automáticos

O schema configurou os seguintes triggers:

1. **on_auth_user_created**: Cria automaticamente um perfil quando um usuário se registra
2. **set_updated_at_***: Atualiza automaticamente o campo `updated_at` em todas as tabelas

## 🎨 Storage Policies

As políticas de storage permitem:

- ✅ Usuários podem fazer upload de imagens em suas próprias pastas
- ✅ Todas as imagens são públicas (podem ser visualizadas por qualquer um)
- ✅ Usuários só podem editar/deletar suas próprias imagens

## ⚠️ Troubleshooting

### Erro: "relation does not exist"
- Certifique-se de que executou o schema SQL completo
- Verifique se as tabelas foram criadas no Table Editor

### Erro: "permission denied for table"
- As políticas RLS estão ativas
- Verifique se o usuário está autenticado
- Para admins, verifique se o role está correto

### Erro ao fazer upload de imagens
- Verifique se os buckets foram criados
- Verifique as políticas de storage

### Usuário não consegue ver seus cadastros
- Verifique se o `user_id` está correto
- Verifique se o usuário está autenticado

## 📝 Próximos Passos

Agora que o Supabase está configurado, você pode:

1. ✅ Implementar upload de imagens
2. ✅ Criar página de aprovação para admins
3. ✅ Implementar busca e filtros
4. ✅ Adicionar paginação
5. ✅ Criar notificações
6. ✅ Implementar sistema de favoritos

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no Supabase Dashboard > **Logs**
2. Verifique o console do navegador (F12)
3. Verifique se as credenciais no `.env` estão corretas
4. Teste as queries diretamente no SQL Editor

---

**Configuração concluída!** 🎉

Seu projeto agora está totalmente integrado com o Supabase e pronto para uso!
