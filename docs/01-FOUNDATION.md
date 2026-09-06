# Phase 1 — Foundation

**Prerequisite:** read `00-PROJECT-OVERVIEW.md` first.
**Branch:** `feat/phase-1-foundation`
**Goal:** turn a bare Vite starter into a properly configured application skeleton with
routing, providers, path aliases, and linting. No visual design work happens here — that
is Phase 2. Every route in this phase renders a placeholder.

---

## Context

The repository currently contains an unmodified `npm create vite@latest` React + TypeScript
scaffold, plus Tailwind CSS v4 installed as a dependency. Tailwind's configuration was
started but may be incomplete — verify it before assuming it works.

Note that **Tailwind v4 configures itself through CSS, not through `tailwind.config.js`**.
The v3 pattern (`@tailwind base; @tailwind components; @tailwind utilities;` plus a JS
config exporting `content` paths) is obsolete. In v4 you import Tailwind once with
`@import "tailwindcss";` and declare design tokens inside an `@theme { … }` block in the
same stylesheet. Content paths are auto-detected. If a `tailwind.config.js` or a
`postcss.config.js` was created by an earlier `init` attempt, evaluate whether they are
still needed and remove them if they are vestigial — but confirm the build still works
after removing anything.

Verify the installed Tailwind version with `npm ls tailwindcss` before deciding which
setup applies.

---

## Tasks

### 1.1 — Verify and repair the Tailwind v4 setup

- Confirm the installed major version.
- Ensure the Vite plugin for Tailwind v4 (`@tailwindcss/vite`) is installed and registered
  in `vite.config.ts`. This is the recommended integration for Vite projects and replaces
  the PostCSS pipeline.
- Reduce `src/index.css` to a single `@import "tailwindcss";` for now. Tokens arrive in
  Phase 2.
- Delete `src/App.css` and any starter assets that are no longer referenced.
- Replace `src/App.tsx` with a minimal component that renders a single Tailwind-styled
  element, and confirm in the browser that a utility class actually applies. Do not proceed
  until a class visibly takes effect — a silent Tailwind failure will waste hours in Phase 2.

**Commit:** `chore(styles): configure tailwind v4 with vite plugin`

---

### 1.2 — Path aliases

Configure `@/` to resolve to `src/`, in **both** places (they are independent and both are
required):

- `vite.config.ts` → `resolve.alias`
- `tsconfig.app.json` → `compilerOptions.paths` and `baseUrl`

Verify with an import like `import { cn } from "@/lib/cn"` that resolves in the editor and
survives `npm run build`. Relative imports climbing more than one level (`../../..`) are
not acceptable anywhere in this codebase after this task.

**Commit:** `chore(config): add @ path alias`

---

### 1.3 — Install runtime dependencies

```
react-router-dom
@tanstack/react-query
react-hook-form
zod
@hookform/resolvers
lucide-react
date-fns
clsx
tailwind-merge
```

Nothing else. If you believe another package is required, stop and ask.

**Commit:** `chore(deps): add routing, data, form, and utility dependencies`

---

### 1.4 — Utilities

Create `src/lib/cn.ts` exporting a `cn()` helper that merges `clsx` and `tailwind-merge`.
Every component in this project composes class names through `cn()` so that consumer-passed
`className` props can override internal defaults without specificity fights.

Create `src/lib/env.ts` that reads `import.meta.env` values, validates them with Zod at
module load, and exports a typed object. It must throw a clear, readable error naming the
missing variable if a required env var is absent — a blank screen with a Supabase 401 is a
bad debugging experience. Required variables for now:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Create `.env.example` documenting both. Confirm `.env` and `.env.local` are in
`.gitignore` — **verify this before the first commit that touches env files.** Never commit
real keys.

**Commit:** `feat(lib): add cn helper and validated env loader`

---

### 1.5 — Routing

Create `src/app/router.tsx` using `createBrowserRouter`. Route table:

| Path | Element |
|---|---|
| `/` | Home |
| `/empresas` | Business list |
| `/empresas/:slug` | Business detail |
| `/eventos` | Event list |
| `/eventos/:slug` | Event detail |
| `/pacotes` | Package list |
| `/pacotes/:slug` | Package detail |
| `/hospedagem` | Lodging list |
| `/hospedagem/:slug` | Lodging detail |
| `/gastronomia` | Dining list |
| `/gastronomia/:slug` | Dining detail |
| `/solicitar` | Public submission form |
| `/admin` | Admin dashboard (unprotected for now) |
| `*` | Not found |

**URL paths are Portuguese** because they are user-facing. **Component and file names are
English.** This is deliberate and consistent with the language rule in the overview.

Routing decisions:
- Detail routes use `:slug`, not `:id`. Slugs are readable and better for SEO. The slug
  strategy is defined in Phase 3; for now, treat the param as an opaque string.
- Lazy-load every route module with `React.lazy` and a `Suspense` boundary, except Home.
- Add a `routeErrorElement` that renders the router's error and offers a link back to Home.
  It must not white-screen.

Each page component in this phase is a placeholder: the route name in an `h1` and the
resolved params printed below it. That is enough to verify the routing table works.

**Commit:** `feat(router): add route table with lazy-loaded pages`

---

### 1.6 — Providers

Create `src/app/providers.tsx` composing, from outermost to innermost:

1. A React error boundary (hand-written, ~40 lines — do not add a dependency for this)
2. `QueryClientProvider`
3. `RouterProvider`

Create `src/lib/query.ts` exporting the configured `QueryClient`. Defaults:

- `staleTime: 5 * 60 * 1000` — this is a directory of content that changes a few times a
  day at most; aggressive refetching buys nothing and costs mobile data.
- `retry: 1`
- `refetchOnWindowFocus: false`

In the same file, export a `queryKeys` factory object. Every query key in the application
comes from here. Example shape:

```ts
export const queryKeys = {
  businesses: {
    all: ["businesses"] as const,
    list: (filters: BusinessFilters) => ["businesses", "list", filters] as const,
    detail: (slug: string) => ["businesses", "detail", slug] as const,
  },
  // …one namespace per domain
};
```

Reduce `src/main.tsx` to mounting `<Providers />` and nothing else.

**Commit:** `feat(app): add providers with query client and error boundary`

---

### 1.7 — Linting and formatting

- Extend the ESLint flat config with the `react-hooks` and `jsx-a11y` plugins. The
  accessibility rules are not decorative — they are the mechanism that enforces the a11y
  standard in the overview, so leave them at error level.
- Add Prettier with `prettier-plugin-tailwindcss` so utility class order is deterministic
  and diffs stay readable.
- Add scripts: `lint`, `lint:fix`, `format`, `typecheck`.
- Run all of them. Fix everything they report. Do not leave warnings behind with the
  intention of cleaning up later.

**Commit:** `chore(lint): add eslint a11y rules and prettier`

---

## Acceptance criteria

- `npm run dev` serves the app; every route in the table renders its placeholder.
- `npm run build` and `npm run typecheck` both pass with zero errors.
- `npm run lint` is clean.
- A Tailwind utility class demonstrably applies in the browser.
- `@/` imports resolve in both the editor and the production build.
- Navigating to `/rota-inexistente` renders the not-found page, not a crash.
- `.env` is untracked; `.env.example` is committed.

---

## Report back

When the phase is complete, summarize: the final dependency list, the Tailwind
configuration approach you settled on and why, the route table as implemented, and anything
in the existing repository you had to remove or repair. Then stop and wait.
