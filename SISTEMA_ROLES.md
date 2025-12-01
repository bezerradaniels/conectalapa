# 👥 Sistema de Roles (Permissões de Usuários)

## Tipos de Usuários

### 1. **Usuário Padrão (user)**
- **Cadastro**: Criado automaticamente ao se registrar na aplicação
- **Role padrão**: `user`
- **Permissões**:
  - ✅ Criar empresas, vagas, pacotes, eventos e alimentação
  - ✅ Ver seus próprios cadastros
  - ✅ Editar seus próprios cadastros
  - ✅ Pausar/Excluir seus próprios cadastros
  - ❌ NÃO pode ver cadastros de outros usuários (exceto os aprovados publicamente)
  - ❌ NÃO pode aprovar/rejeitar cadastros
  - ❌ NÃO pode ver a lista de usuários
  - ⏳ Todos os cadastros criados ficam com status `pending` até aprovação do admin

### 2. **Administrador (admin)**
- **Cadastro**: Promovido manualmente no banco de dados
- **Role**: `admin`
- **Permissões**:
  - ✅ Ver TODOS os cadastros (de todos os usuários)
  - ✅ Aprovar/Rejeitar cadastros pendentes
  - ✅ Editar qualquer cadastro
  - ✅ Pausar/Excluir qualquer cadastro
  - ✅ Ver lista completa de usuários
  - ✅ Gerenciar categorias e bairros

## Fluxo de Aprovação

### Para Usuários Padrão:
1. Usuário se cadastra na plataforma → Role: `user`
2. Usuário cria uma empresa/vaga/pacote → Status: `pending`
3. Cadastro fica invisível para o público
4. Usuário pode ver seus próprios cadastros pendentes no painel
5. Admin precisa aprovar para ficar público

### Para Administradores:
1. Admin vê TODOS os cadastros no painel
2. Cadastros `pending` mostram botões de "Aprovar" ✓ e "Rejeitar" ✗
3. Admin clica em Aprovar → Status muda para `active` → Fica público
4. Admin clica em Rejeitar → Status muda para `inactive` → Permanece invisível

## Visualização no Dashboard

### Usuário Padrão vê:
```
Meu Painel
- Minhas Empresas (apenas suas)
- Minhas Vagas (apenas suas)
- Meus Pacotes (apenas seus)
- Meus Eventos (apenas seus)
- Minha Alimentação (apenas suas)
```

### Administrador vê:
```
Painel Administrativo
- Todas as Empresas (de todos os usuários)
  ↳ Com botões: Aprovar | Rejeitar | Editar | Pausar | Excluir
- Todas as Vagas
- Todos os Pacotes
- Todos os Eventos
- Toda Alimentação
- Usuários Cadastrados (lista completa)
```

## Políticas RLS (Row Level Security)

### Profiles:
- Usuários podem ver apenas seu próprio perfil
- Admins podem ver todos os perfis

### Companies/Jobs/Packages/Events/Foods:
- **SELECT (leitura)**:
  - Todos podem ver itens com status `active`
  - Usuários podem ver seus próprios itens (qualquer status)
  - Admins podem ver todos os itens (qualquer status)
  
- **INSERT (criar)**:
  - Qualquer usuário autenticado pode criar
  - Status inicial: `pending`
  
- **UPDATE (editar)**:
  - Usuários podem editar apenas seus próprios itens
  - Admins podem editar qualquer item
  
- **DELETE (excluir)**:
  - Usuários podem excluir apenas seus próprios itens
  - Admins podem excluir qualquer item

## Como Promover um Usuário a Admin

### Opção 1: Via SQL Editor do Supabase
```sql
-- Encontre o ID do usuário
SELECT id, email, name, role FROM public.profiles WHERE email = 'usuario@email.com';

-- Promova para admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'usuario@email.com';
```

### Opção 2: Via Table Editor do Supabase
1. Vá em **Table Editor** > **profiles**
2. Encontre o usuário
3. Clique na linha para editar
4. Mude o campo `role` de `user` para `admin`
5. Salve

## Status de Cadastros

### `pending` (Aguardando aprovação)
- Cadastro recém-criado
- Visível apenas para o dono e admins
- Não aparece publicamente
- Aguarda aprovação

### `active` (Ativo)
- Cadastro aprovado pelo admin
- Visível publicamente
- Aparece nas listagens públicas

### `inactive` (Inativo)
- Cadastro rejeitado ou pausado
- Não aparece publicamente
- Visível apenas para o dono e admins

## Segurança

✅ **Garantido pelo Supabase RLS**:
- Usuários NÃO conseguem ver dados de outros usuários
- Usuários NÃO conseguem editar dados de outros usuários
- Apenas admins podem aprovar cadastros
- Tentativas de burlar são bloqueadas no banco de dados

✅ **Garantido no Frontend**:
- Botões de aprovação só aparecem para admins
- Rotas protegidas verificam autenticação
- UI adapta conforme o role do usuário

## Exemplo Prático

### Cenário 1: Usuário Normal
```
1. João se cadastra → Role: user
2. João cria "Padaria do João" → Status: pending
3. João vê no painel: "Minhas Empresas" com status "Aguardando aprovação"
4. Público não vê a padaria ainda
5. Admin aprova → Status: active
6. Agora todos veem "Padaria do João" na listagem pública
```

### Cenário 2: Admin
```
1. Maria é admin → Role: admin
2. Maria acessa o painel
3. Maria vê TODAS as empresas, incluindo as pendentes
4. Maria clica em "Aprovar" na "Padaria do João"
5. Status muda para active
6. Padaria aparece publicamente
```

---

**Sistema de roles implementado e funcional!** 🔒
