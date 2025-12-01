# Central de Empresas - Bom Jesus da Lapa

Sistema web para centralizar informações sobre empresas, vagas de emprego e pacotes de viagem em Bom Jesus da Lapa.

## 🎨 Design System

Este projeto segue uma estética inspirada no **Evernote**, com:

- **Paleta de cores**: Verde Evernote (#00A82D), tons neutros e fundo creme (#FAF8F5)
- **Tipografia**: Inter (principal) e Nunito Sans (alternativa)
- **Componentes**: Minimalistas, com espaçamento amplo e bordas suaves
- **Layout**: Clean, profissional e acessível

## 🚀 Tecnologias

- **Vite** - Build tool
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **TailwindCSS v4** - Estilização
- **Supabase** - Backend (Auth, Database, Storage)
- **React Router** - Navegação
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🗂 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Card.tsx
│   └── Sidebar.tsx
├── layouts/        # Layouts da aplicação
│   └── MainLayout.tsx
├── pages/          # Páginas da aplicação
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   └── CompanyForm.tsx
├── lib/            # Configurações e utilitários
│   └── supabase.ts
├── types/          # Tipos TypeScript
│   └── index.ts
├── App.tsx         # Componente principal com rotas
└── main.tsx        # Entry point
```

## 🎯 Funcionalidades

### Usuários
- ✅ Cadastro e login
- ✅ Dashboard pessoal
- ✅ Cadastro de empresas
- 🚧 Cadastro de vagas
- 🚧 Cadastro de pacotes de viagem
- 🚧 Edição de cadastros

### Administradores
- ✅ Dashboard administrativo
- 🚧 Aprovação/rejeição de cadastros
- 🚧 Gerenciamento de usuários
- 🚧 Moderação de conteúdo

### Público
- ✅ Visualização de empresas
- ✅ Visualização de vagas
- ✅ Visualização de pacotes
- ✅ Busca global
- ✅ Carrossel de destaques

## 🔐 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a URL e a chave anônima do projeto
3. Configure as variáveis de ambiente no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Schema do Banco de Dados

```sql
-- Tabela de usuários (gerenciada pelo Supabase Auth)

-- Tabela de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de vagas
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  salary TEXT,
  description TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de pacotes de viagem
CREATE TABLE travel_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination TEXT NOT NULL,
  departure_date DATE,
  agency TEXT,
  price DECIMAL,
  cover_image TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Paleta de Cores

```css
--color-primary: #00A82D          /* Verde Evernote */
--color-primary-dark: #0A7A27     /* Verde escuro */
--color-primary-light: #D8F5E0    /* Verde claro */

--color-cream: #FAF8F5            /* Fundo principal */

--color-neutral-900: #1A1A1A      /* Texto principal */
--color-neutral-700: #515151      /* Texto secundário */
--color-neutral-500: #7D7D7D      /* Texto terciário */
--color-neutral-300: #CFCFCF      /* Bordas */
--color-neutral-200: #E7E7E7      /* Divisores */
--color-neutral-100: #F4F4F4      /* Superfícies */

--color-success: #00A82D
--color-warning: #FF8A05
--color-danger: #D90429
--color-info: #0066FF
```

## 📱 Responsividade

O projeto é totalmente responsivo, com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para a comunidade de Bom Jesus da Lapa - BA
