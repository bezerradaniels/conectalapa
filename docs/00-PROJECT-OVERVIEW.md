# ConectaLapa — Project Overview & Engineering Standards

> **Read this file first, before any phase file.** Every phase document assumes the
> conventions defined here. If a phase file contradicts this document, this document wins
> unless the phase explicitly says "supersedes overview".

---

## 1. What we are building

ConectaLapa is a regional discovery platform for **Bom Jesus da Lapa, Bahia, Brazil** —
a city that receives a large volume of religious tourism and has a fragmented local
business scene. Today, finding a restaurant, a hotel, an event, or a tour package in the
city means digging through WhatsApp groups and Instagram profiles. ConectaLapa
consolidates that into a single, fast, mobile-first directory.

The product covers **five content domains**:

| Domain | What it holds | Example |
|---|---|---|
| **Businesses & professionals** | Local companies and independent professionals | A dentist, a mechanic, a clothing store |
| **Events** | Dated happenings with tickets or free entry | A festival, a show, a religious celebration |
| **Tour packages** | Trips departing **from** Bom Jesus da Lapa, sold by local agencies | Líder Turismo sells a Bom Jesus da Lapa → Porto Seguro package |
| **Lodging** | Hotels, inns (pousadas), guesthouses | A pousada near the sanctuary |
| **Food** | Restaurants, snack bars, lanchonetes | A churrascaria, a pizzeria |

**Content model, phase 1 of the business:** all content is seeded and maintained by a
single administrator through an internal admin panel. The public can *request* to be
listed through a public submission form; those requests land in a moderation queue and
only become public after the administrator approves and completes them. There is no
public self-serve account system in the initial scope.

**Language:** all user-facing copy is **Brazilian Portuguese (pt-BR)**. All code,
identifiers, comments, commit messages, and documentation are **English**. Do not mix.

---

## 2. Technical stack

Already installed and configured in the repository:

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Postgres, Auth, Storage) — MCP server is connected
- **Git** over SSH → `git@github.com:bezerradaniels/conectalapa.git`

To be added during Phase 1:

- **React Router v6** — routing
- **TanStack Query (React Query) v5** — server state, caching, invalidation
- **React Hook Form** + **Zod** — forms and schema validation
- **lucide-react** — icons
- **date-fns** with `ptBR` locale — date formatting

Do not add any other runtime dependency without stating the justification in the PR/commit
message. Prefer writing 40 lines of local code over adding a dependency for one function.

---

## 3. Design direction

The visual reference is the **conversational-AI product family** (Claude, ChatGPT, Manus):
a persistent left sidebar for navigation, a wide quiet content column, generous whitespace,
almost no chrome, and a single restrained accent color.

**Non-negotiable design rules:**

1. **Mobile-first, single column.** Design and build the 375px viewport first, then widen.
   The desktop layout is the mobile layout plus a sidebar and more horizontal breathing
   room — not a different design.
2. **Sidebar navigation.** Fixed and always visible from `lg` up; a slide-over drawer
   below `lg`, triggered from a header button.
3. **Accent color is Tailwind `sky-400` (`#38BDF8`).** It is used for interactive and
   active states only — links, primary buttons, the active nav item, focus rings. It is
   never used as a large background fill, and never as a decorative gradient.
4. **Neutrals carry the interface.** Slate scale for text, borders, and surfaces. The page
   background is near-white, surfaces are white, borders are hairline.
5. **Restraint.** No drop shadows on every card, no gradient washes, no motion on scroll.
   Motion exists only as a response to a user action (drawer opening, accordion expanding,
   dialog appearing) and must respect `prefers-reduced-motion`.
6. Avoid the generated-page tells: all-caps tracked-out eyebrow labels, `→` glued to
   button text, meta strings joined by middle dots, one word of a headline in a different
   color.

The full token system and primitive components are specified in **Phase 2**.

---

## 4. Folder structure

Build toward this tree. Create folders only when the phase that needs them arrives — do
not scaffold empty directories ahead of time.

```
src/
├── app/
│   ├── router.tsx              # route table
│   └── providers.tsx           # QueryClient, router, error boundary
├── components/
│   ├── ui/                     # design primitives: Button, Input, Badge, Dialog…
│   ├── layout/                 # AppShell, Sidebar, MobileHeader, PageHeader
│   ├── cards/                  # BusinessCard, EventCard, PackageCard…
│   ├── sections/               # Hero, FeaturedGrid, CategoryGrid
│   └── forms/                  # shared form fields and controls
├── features/
│   ├── businesses/
│   ├── events/
│   ├── packages/
│   ├── lodging/
│   ├── dining/
│   ├── submissions/
│   └── admin/
├── pages/
│   ├── home/index.tsx
│   ├── businesses/{index.tsx,detail.tsx}
│   ├── events/{index.tsx,detail.tsx}
│   ├── packages/{index.tsx,detail.tsx}
│   ├── lodging/{index.tsx,detail.tsx}
│   ├── dining/{index.tsx,detail.tsx}
│   ├── submit/index.tsx
│   └── admin/…
├── lib/
│   ├── supabase.ts             # client singleton
│   ├── query.ts                # QueryClient config + query key factory
│   ├── format.ts               # currency, date, phone formatters
│   └── whatsapp.ts             # wa.me link builder
├── types/
│   └── database.ts             # generated from Supabase, plus domain types
├── hooks/
└── constants/
```

**Rule for `features/` vs `pages/`:** `pages/` files are thin — they compose, they do not
contain business logic. Data fetching hooks, mutations, Zod schemas, and domain-specific
components live in the matching `features/` folder.

**File naming:** components are `PascalCase.tsx`. Everything else is `kebab-case.ts`. A
component folder with an `index.tsx` is acceptable when the component ships with sibling
files (`BusinessCard/index.tsx` + `BusinessCard/skeleton.tsx`); a lone component is a
single file.

---

## 5. Engineering standards

**TypeScript**
- `strict: true`. No `any`. If a type is genuinely unknown, use `unknown` and narrow it.
- Domain types live in `src/types/`. Supabase row types are generated, never hand-written.
- Prefer `type` for unions and object shapes; use `interface` only when declaration
  merging is actually needed.

**Components**
- Function components with named exports. No default exports except for route modules.
- Props typed inline as `type Props = {…}` immediately above the component.
- A component that exceeds ~150 lines is a signal to split it, not a target to hit.
- Never fetch data inside a presentational component. Data comes in through props, or the
  component is a container that calls a feature hook.

**Data access**
- All Supabase calls go through a feature-level hook (`useBusinesses`, `useEvent(id)`).
  A page never imports the Supabase client directly.
- Query keys come from the central factory in `lib/query.ts`. No inline string arrays.

**Accessibility — treated as a build error, not a nice-to-have**
- Every interactive element is reachable and operable by keyboard, with a visible focus ring.
- Every image has a meaningful `alt`; decorative images get `alt=""`.
- Icon-only buttons carry an `aria-label` in Portuguese.
- Text contrast meets WCAG AA (4.5:1 body, 3:1 large text). `sky-400` on white fails for
  body text — use `sky-600` or darker for text, and reserve `sky-400` for fills and borders.
- Touch targets are at least 44×44 CSS pixels.

**Definition of done for every phase**
1. `npm run build` completes with zero TypeScript errors.
2. `npm run lint` is clean.
3. The feature works at 375px, 768px, and 1440px.
4. Loading, empty, and error states exist for anything that fetches.
5. Committed and pushed with a conventional-commit message.

---

## 6. Git workflow

One branch per phase, branched from `main`:

```
feat/phase-1-foundation
feat/phase-2-design-system
…
```

Conventional commits, imperative mood, English:

```
feat(events): add event detail page with gallery
fix(sidebar): close drawer on route change
chore(deps): add react-router and tanstack query
```

Commit at the end of each numbered task inside a phase, not once at the end of the phase.
Small commits make it possible to follow along and roll back a single decision.

---

## 7. How to work through the phase files

Each phase file is a self-contained brief. When you start a phase:

1. Read the whole phase file before writing code.
2. State back, in three or four sentences, what you understood the phase to require and
   what you plan to build. Flag anything ambiguous **before** starting.
3. Work task by task in the given order. The tasks are ordered by dependency.
4. After each task, report what changed, which files were touched, and what the user should
   check in the browser.
5. Do not start the next phase without being asked.

**Scope discipline:** if you notice something worth doing that belongs to a later phase,
write it down in a `NOTES.md` list instead of building it. Do not pull work forward.

---

## 8. Phase map

| # | File | Outcome |
|---|---|---|
| 1 | `01-FOUNDATION.md` | Tooling, routing, providers, folder skeleton |
| 2 | `02-DESIGN-SYSTEM.md` | Tokens, UI primitives, app shell with sidebar |
| 3 | `03-DATA-LAYER.md` | Supabase schema, RLS, storage, typed data hooks |
| 4 | `04-HOME.md` | Home page, hero, featured content, search entry |
| 5 | `05-LISTING-PAGES.md` | Five listing pages with filters and pagination |
| 6 | `06-DETAIL-PAGES.md` | Five detail pages, gallery, contact actions |
| 7 | `07-ADMIN.md` | Auth-gated admin CRUD for all five domains |
| 8 | `08-SUBMISSIONS.md` | Public submission form and moderation queue |
| 9 | `09-POLISH-LAUNCH.md` | SEO, performance, a11y audit, error handling, deploy |
