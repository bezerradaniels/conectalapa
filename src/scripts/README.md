# Script de Geração de Slugs

Este script gera automaticamente slugs amigáveis para URLs das empresas cadastradas.

## O que são Slugs?

Slugs são versões simplificadas e amigáveis do nome da empresa para usar em URLs.

**Exemplos:**
- "Padaria Central" → `padaria-central`
- "Restaurante do João" → `restaurante-do-joao`
- "Loja de Roupas & Acessórios" → `loja-de-roupas-acessorios`

## Como Executar

### Opção 1: Usando npm (Recomendado)
```bash
npm run generate-slugs
```

### Opção 2: Usando npx
```bash
npx tsx src/scripts/generateSlugs.ts
```

## O que o Script Faz

1. **Busca empresas sem slug** - Encontra todas as empresas que não possuem um slug definido
2. **Gera slugs únicos** - Cria slugs amigáveis baseados no nome da empresa
3. **Evita duplicatas** - Se um slug já existe, adiciona um identificador único
4. **Atualiza o banco** - Salva os novos slugs no Supabase

## Resultado

Após executar o script, todas as empresas terão URLs amigáveis:

**Antes:**
- `/empresa/123e4567-e89b-12d3-a456-426614174000`

**Depois:**
- `/empresa/padaria-central`
- `/empresa/restaurante-do-joao`

## Segurança

- ✅ O script **não modifica** empresas que já possuem slug
- ✅ Verifica duplicatas antes de salvar
- ✅ Adiciona sufixo único em caso de conflito
- ✅ Mostra progresso detalhado no console

## Quando Executar

Execute este script:
- ✅ Após importar empresas antigas
- ✅ Quando empresas forem cadastradas sem slug
- ✅ Uma vez após atualizar o sistema

**Nota:** É seguro executar múltiplas vezes - empresas que já têm slug não serão modificadas.
