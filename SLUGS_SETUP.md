# 🔧 Guia: Adicionar Slugs Amigáveis às Empresas

Este guia mostra como adicionar URLs amigáveis (slugs) para as empresas cadastradas.

## 📋 Pré-requisitos

- Acesso ao painel do Supabase
- Permissões de administrador no banco de dados

## 🚀 Passo a Passo

### 1️⃣ Adicionar a Coluna Slug no Banco de Dados

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `migrations/add_slug_to_companies.sql`
6. Clique em **Run** para executar

**O que este SQL faz:**
- ✅ Adiciona a coluna `slug` na tabela `companies`
- ✅ Cria índice único para evitar slugs duplicados
- ✅ Otimiza buscas por slug

### 2️⃣ Gerar Slugs para Empresas Existentes

Após executar o SQL, volte para o terminal e execute:

```bash
npm run generate-slugs
```

**O que este script faz:**
- 🔍 Busca todas as empresas sem slug
- 🏷️ Gera slugs amigáveis (ex: "Padaria Central" → `padaria-central`)
- 💾 Salva no banco de dados
- ✅ Evita duplicatas automaticamente

### 3️⃣ Verificar Resultados

Após executar o script, você verá algo como:

```
🔄 Iniciando geração de slugs para empresas...

📊 Encontradas 5 empresas sem slug

✅ Padaria Central                          → padaria-central
✅ Restaurante do João                      → restaurante-do-joao
✅ Loja de Roupas & Acessórios             → loja-de-roupas-acessorios
✅ Mercadinho São José                      → mercadinho-sao-jose
✅ Farmácia Popular                         → farmacia-popular

============================================================
📈 Resumo:
   ✅ Sucesso: 5
   ❌ Erros: 0
============================================================
🎉 Processo concluído!
```

### 4️⃣ Testar as URLs

Agora as empresas terão URLs amigáveis:

**Antes:**
- `/empresa/123e4567-e89b-12d3-a456-426614174000`

**Depois:**
- `/empresa/padaria-central`
- `/empresa/restaurante-do-joao`

## 🔄 Para Empresas Futuras

### Opção 1: Gerar Slug Automaticamente no Cadastro

Adicione esta lógica no formulário de cadastro (`CompanyForm.tsx`):

```typescript
import { generateSlug } from '../lib/utils';

// No handleSubmit, antes de inserir:
const slug = generateSlug(formData.name);

const { error } = await supabase
    .from('companies')
    .insert({
        ...formData,
        slug: slug,
        user_id: user?.id,
        status: 'pending'
    });
```

### Opção 2: Executar Script Periodicamente

Execute o script sempre que necessário:

```bash
npm run generate-slugs
```

O script é **seguro** e pode ser executado múltiplas vezes - ele só atualiza empresas sem slug.

## ❓ Solução de Problemas

### Erro: "column companies.slug does not exist"
**Solução:** Execute o SQL do passo 1 primeiro.

### Erro: "duplicate key value violates unique constraint"
**Solução:** O script adiciona automaticamente um sufixo único quando detecta duplicatas.

### Slugs não aparecem nas URLs
**Solução:** 
1. Verifique se o script foi executado com sucesso
2. Recarregue a página no navegador (Ctrl+F5 ou Cmd+Shift+R)
3. Verifique no Supabase se a coluna `slug` foi populada

## 📚 Recursos Adicionais

- **Script de geração:** `src/scripts/generateSlugs.ts`
- **Migration SQL:** `migrations/add_slug_to_companies.sql`
- **Função de geração:** `src/lib/utils.ts` → `generateSlug()`

---

**Dúvidas?** Verifique os logs do script ou consulte a documentação do Supabase.
