# Design System - Central de Empresas BJL

## 🎨 Visão Geral

Este design system é inspirado na estética minimalista e elegante do **Evernote**, adaptado para o contexto brasileiro e para a cidade de Bom Jesus da Lapa.

## 🎯 Princípios de Design

1. **Minimalismo** - Menos é mais. Cada elemento tem um propósito.
2. **Clareza** - Informação organizada e fácil de encontrar.
3. **Acessibilidade** - Contraste adequado e navegação intuitiva.
4. **Consistência** - Padrões visuais mantidos em todo o sistema.
5. **Respiração** - Espaçamento amplo para conforto visual.

## 🎨 Paleta de Cores

### Cores Primárias
```css
--color-primary: #00A82D          /* Verde Evernote - Ações principais */
--color-primary-dark: #0A7A27     /* Hover e ênfase */
--color-primary-light: #D8F5E0    /* Fundos suaves, feedback positivo */
```

### Cores de Acento
```css
--color-accent-yellow: #FFD43B    /* Destaques, banners */
--color-accent-purple: #9B59B6    /* Elementos ilustrativos */
--color-accent-orange: #FF8A05    /* Atenção moderada */
```

### Cores Neutras
```css
--color-cream: #FAF8F5            /* Fundo principal */

--color-neutral-900: #1A1A1A      /* Títulos, texto forte */
--color-neutral-800: #2F2F2F      /* Descritivos fortes */
--color-neutral-700: #515151      /* Parágrafos */
--color-neutral-500: #7D7D7D      /* Informações secundárias */
--color-neutral-300: #CFCFCF      /* Bordas leves, divisores */
--color-neutral-200: #E7E7E7      /* Fundos suaves */
--color-neutral-100: #F4F4F4      /* Superfícies */
```

### Cores de Estado
```css
--color-success: #00A82D          /* Mensagens positivas */
--color-warning: #FF8A05          /* Notificações */
--color-danger: #D90429           /* Alertas, campos inválidos */
--color-info: #0066FF             /* Estados informativos */
```

## 🔤 Tipografia

### Fontes
- **Primária**: Inter (Google Fonts)
- **Secundária**: Nunito Sans (Google Fonts)
- **Código**: JetBrains Mono (opcional)

### Escala Tipográfica

| Nível | Nome | Tamanho | Peso | Uso |
|-------|------|---------|------|-----|
| H1 | Título Hero | 42-48px | 700 | Títulos principais de página |
| H2 | Título de Seção | 32px | 600 | Títulos de seções |
| H3 | Subtítulo | 24px | 600 | Subtítulos |
| H4 | Destaque | 20px | 500 | Destaques em cards |
| Body 1 | Corpo Padrão | 16px | 400 | Texto principal |
| Body 2 | Secundário | 14px | 400 | Texto secundário |
| Label | Labels | 13px | 500 | Labels de formulários |
| Caption | Observações | 12px | 400 | Notas e observações |

## 📐 Espaçamento

### Escala de Espaçamentos
```css
--space-1: 4px      /* Micro espaçamentos */
--space-2: 8px      /* Espaçamentos pequenos */
--space-3: 12px     /* Espaçamentos médios-pequenos */
--space-4: 16px     /* Espaçamentos médios */
--space-6: 24px     /* Espaçamentos grandes */
--space-8: 32px     /* Espaçamentos extra-grandes */
--space-12: 48px    /* Espaçamentos de seção */
--space-16: 64px    /* Espaçamentos de página */
```

### Grid e Containers
- **Largura máxima desktop**: 1280px
- **Conteúdo padrão**: 1140px (com padding)
- **Grid**: 12 colunas
- **Gap padrão**: 24px

## 🧱 Componentes

### Botões

#### Botão Primário
- **Fundo**: `--color-primary`
- **Texto**: Branco
- **Hover**: `--color-primary-dark`
- **Padding**: `px-5 py-2.5` (20px horizontal, 10px vertical)
- **Border Radius**: 8px
- **Transição**: 200ms

#### Botão Secundário
- **Fundo**: Branco
- **Borda**: 1px `--color-neutral-300`
- **Texto**: `--color-neutral-900`
- **Hover**: `--color-neutral-100`

#### Botão Fantasma
- **Fundo**: Transparente
- **Texto**: `--color-primary`
- **Hover**: `--color-neutral-100`

#### Botão Perigo
- **Fundo**: `--color-danger`
- **Texto**: Branco
- **Hover**: #A4031F

### Inputs

#### Input Padrão
- **Altura**: 48px
- **Padding**: 16px horizontal
- **Borda**: 1px `--color-neutral-300`
- **Fundo**: Branco
- **Border Radius**: 8px
- **Focus**: Borda verde + ring verde claro

#### Textarea
- **Min-height**: 128px
- **Padding**: 16px horizontal, 12px vertical
- **Resize**: Vertical
- **Demais propriedades**: Igual ao input

### Cards

#### Card Base
- **Fundo**: Branco
- **Borda**: 1px `--color-neutral-200`
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: Opcional, sutil
- **Hover** (se clicável): Shadow + borda mais escura

#### Card de Empresa
- **Imagem**: 100% largura, altura fixa
- **Conteúdo**: Padding 16px
- **Badge**: Categoria com fundo verde claro

#### Card de Vaga
- **Layout**: Vertical
- **Título**: 16px/600
- **Empresa**: 14px/500
- **Salário**: 14px/600 verde
- **Botão**: Secundário, discreto

### Sidebar

#### Estrutura
- **Largura**: 256px (16rem)
- **Fundo**: Branco
- **Borda**: Direita, 1px `--color-neutral-200`
- **Position**: Sticky top-0

#### Seções
1. **Logo** - Topo, com padding
2. **Conta** - Saudação + botões
3. **Menu** - Links de navegação

#### Item de Menu Ativo
- **Fundo**: `--color-primary-light`
- **Texto**: `--color-primary-dark`
- **Font Weight**: 500

### Tabelas

#### Estilo Evernote
- **Linhas**: Altura ampla (py-4)
- **Borda**: `--color-neutral-200`
- **Header**: Font weight 600
- **Hover**: Fundo sutil

#### Colunas Padrão
- Nome/Título
- Status (badge)
- Data
- Ações (ícones)

## 🎭 Estados e Interações

### Hover
- **Botões**: Mudança de cor suave
- **Cards**: Shadow + borda
- **Links**: Mudança de cor
- **Transição**: 200ms ease

### Focus
- **Inputs**: Borda verde + ring
- **Botões**: Outline verde
- **Links**: Outline padrão

### Disabled
- **Opacity**: 50%
- **Cursor**: not-allowed
- **Sem hover**: Nenhuma interação

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  /* Sidebar vira bottom bar */
  /* Cards em coluna única */
  /* Padding reduzido */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2 colunas de cards */
  /* Sidebar colapsável */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Layout completo */
  /* Sidebar fixa */
  /* 3 colunas de cards */
}
```

## ♿ Acessibilidade

### Contraste
- **Texto principal**: Mínimo 7:1
- **Texto secundário**: Mínimo 4.5:1
- **Elementos interativos**: Mínimo 3:1

### Navegação
- **Teclado**: Todos os elementos acessíveis via Tab
- **Focus visible**: Outline claro em todos os elementos
- **ARIA labels**: Em ícones e elementos sem texto

### Semântica
- **HTML5**: Tags semânticas (header, nav, main, section)
- **Headings**: Hierarquia correta (h1 → h2 → h3)
- **Forms**: Labels associados a inputs

## 🎨 Ilustrações

### Estilo
- **Formas**: Orgânicas, curvas suaves
- **Cores**: Paleta limitada (verde + neutros)
- **Uso**: Páginas vazias, erros, onboarding

### Ícones
- **Biblioteca**: Lucide React
- **Estilo**: Linhas finas, flat
- **Tamanho padrão**: 20px
- **Cor**: Herda do contexto

## 📦 Componentes React

Todos os componentes estão em `src/components/`:

- `Button.tsx` - Botões com variantes
- `Input.tsx` - Campos de texto
- `Textarea.tsx` - Campos de texto multi-linha
- `Card.tsx` - Container de conteúdo
- `Sidebar.tsx` - Navegação lateral

## 🔄 Animações

### Transições
- **Duração padrão**: 200ms
- **Easing**: ease ou ease-in-out
- **Propriedades**: color, background, border, transform

### Micro-interações
- **Hover**: Scale sutil em cards (1.02)
- **Click**: Scale down (0.98)
- **Loading**: Spinner ou skeleton

## 📝 Boas Práticas

1. **Use variáveis CSS** para cores e espaçamentos
2. **Mantenha consistência** nos componentes
3. **Teste acessibilidade** com ferramentas como axe
4. **Otimize imagens** antes de fazer upload
5. **Use lazy loading** para imagens e componentes pesados
6. **Documente** mudanças no design system

## 🚀 Implementação

### TailwindCSS v4
As cores e tokens estão definidos em `src/index.css` usando `@theme`.

### Componentes
Todos os componentes seguem o padrão:
- Props tipadas com TypeScript
- Variantes via props
- Classes Tailwind compostas
- Acessibilidade integrada

---

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
