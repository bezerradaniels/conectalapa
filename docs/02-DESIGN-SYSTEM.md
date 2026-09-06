# Phase 2 — Design System & App Shell

**Prerequisite:** Phase 1 complete.
**Branch:** `feat/phase-2-design-system`
**Goal:** define the visual language as Tailwind v4 tokens, build the primitive component
library, and build the persistent sidebar shell that every page will live inside. At the
end of this phase the app looks finished even though it contains no real content.

---

## Design brief

ConectaLapa is a directory for a small Brazilian city that receives heavy religious
tourism. Its users are, in roughly equal measure: pilgrims and visitors on a phone with a
weak connection looking for a hotel or a restaurant tonight; and residents checking what is
happening this weekend. The interface has to be legible in bright sunlight, fast on a
mid-range Android, and immediately obvious to someone who does not use apps much.

The visual reference is the conversational-AI product family — Claude, ChatGPT, Manus. What
we are borrowing specifically is: a quiet persistent sidebar, a single wide content column,
generous vertical rhythm, hairline borders instead of shadows, and one restrained accent.
What we are **not** borrowing is the chat metaphor. This is a directory.

**Accent:** Tailwind `sky-400` / `#38BDF8`.

Before writing any code, produce a short design plan — palette as named hex values, type
choices with their roles, a layout concept with an ASCII wireframe for mobile and for
desktop, and three or four principles specific to this product. Then review that plan
against this brief and tell me which parts, if any, you revised because they read as a
generic default rather than a choice made for this brief. Only then start building.

Two things to resist in particular. First, `sky-400` does not pass WCAG AA as a text color
on white — if you find yourself using it for body copy or small labels, the palette is
wrong, not the requirement. Reserve it for fills, borders, and active-state indicators, and
use a darker step for text. Second, this product will contain hundreds of listings; if
every listing is an identical rounded card with a soft grey shadow, the interface turns
into visual noise. Decide deliberately how a list item is separated from its neighbors.

---

## Tasks

### 2.1 — Token system

Define all design tokens in `src/index.css` inside a Tailwind v4 `@theme { … }` block.
Tokens declared there become real utility classes automatically — `--color-accent` yields
`bg-accent`, `text-accent`, `border-accent`, and so on. Do not create a JS theme object and
do not hardcode hex values in components.

Define, at minimum:

- **Accent ramp** — the sky family, with the specific steps you actually use named by role
  rather than by number where it clarifies intent.
- **Neutral ramp** — the slate family: page background, surface, subtle surface, hairline
  border, muted text, secondary text, primary text.
- **Semantic colors** — success, warning, danger, each with a background and a foreground
  that pass AA against each other.
- **Typography** — the families you chose, plus a type scale. Set the scale deliberately
  rather than accepting Tailwind's defaults wholesale; state the ratio you used.
- **Radius, spacing rhythm, and the one border/shadow treatment** you allow.

If you use a webfont, self-host it with `@fontsource` rather than calling Google Fonts at
runtime — this audience is on mobile data and a render-blocking third-party request is a
real cost. Subset to Latin.

Ship a `/dev/tokens` route (dev-only, excluded from the sidebar) that renders every token
as a swatch and every type step as a specimen. You will use it constantly in later phases
and it makes drift obvious.

**Commit:** `feat(styles): define design tokens`

---

### 2.2 — UI primitives

Build in `src/components/ui/`. Every primitive: typed props, forwarded ref where it wraps a
DOM element, `className` merged through `cn()`, keyboard-operable, visible focus ring.

- **Button** — variants `primary`, `secondary`, `ghost`, `danger`; sizes `sm`, `md`, `lg`;
  `isLoading` state that shows a spinner and disables interaction; optional leading/trailing
  icon slots. An icon-only button requires `aria-label` — enforce it in the type signature
  so it cannot be forgotten.
- **Input**, **Textarea**, **Select** — with label, description, and error slots. The error
  message is wired to the control with `aria-describedby` and `aria-invalid`. The error is
  never communicated by red border alone.
- **Badge** — for categories and statuses. Neutral by default; semantic variants available.
- **Card** — the shared surface primitive the domain cards in Phase 5 will build on.
- **Skeleton** — the loading placeholder. One primitive, composed into per-card skeletons
  later. Respect `prefers-reduced-motion` for its shimmer.
- **EmptyState** — icon, headline, one line of explanation, optional action. Per the writing
  guidance: an empty screen is an invitation to act, not an apology.
- **Dialog** / **Drawer** — built on the native `<dialog>` element or a hand-rolled portal
  with a focus trap. Escape closes, focus returns to the trigger, background scroll locks.
- **Tabs**, **Accordion** — keyboard-navigable per WAI-ARIA patterns.
- **Spinner**, **Divider**, **Avatar**.

Extend the `/dev/tokens` route into a component gallery showing every variant and state of
every primitive, including disabled, loading, error, and long-content-overflow cases.

**Commit one primitive group at a time**, e.g. `feat(ui): add button primitive`.

---

### 2.3 — App shell

Build in `src/components/layout/`.

**Sidebar** (`lg` and up: fixed, ~260px, always visible; below `lg`: slide-over drawer)

Contents, top to bottom:
- Wordmark linking to `/`
- Primary navigation: Início, Empresas, Eventos, Pacotes, Hospedagem, Gastronomia — each
  with a lucide icon and a Portuguese label
- A divider, then: Solicitar cadastro
- Pinned at the bottom: a compact footer block with the city name and a link to the About
  page

Active state comes from `NavLink`. The active treatment must not rely on color alone —
pair it with a background or an indicator so it survives a colorblind user and a bright
screen.

**MobileHeader** (below `lg` only)
- Left: menu button opening the drawer. `aria-label="Abrir menu"`, `aria-expanded` bound to
  drawer state.
- Center: wordmark.
- Right: search button routing to search (a stub for now).
- Sticky. Decide deliberately whether it hides on scroll — if it does, it must reappear on
  any upward scroll, and it must never hide while a drawer is open.

**AppShell** — the layout route wrapping all pages. Sidebar plus a `<main>` with the
content column, correct max-width, and horizontal padding that holds at 375px without the
content touching the viewport edges.

Behaviors to get right:
- The drawer closes on route change. This is the single most common bug in this pattern.
- The drawer traps focus while open and returns focus to the menu button on close.
- `<main>` has `id="main"` and a skip-to-content link is the first focusable element in the
  DOM.
- The page scrolls to top on navigation, except when returning to a list via browser back —
  scroll position restoration there is expected behavior and users notice when it breaks.

**Commit:** `feat(layout): add app shell with sidebar and mobile drawer`

---

### 2.4 — Shared page furniture

- **PageHeader** — title, optional description, optional action slot. Used by every list
  and detail page.
- **Breadcrumbs** — for detail pages. Marked up as a `<nav aria-label="…">` with an ordered
  list.
- **Container** — the max-width wrapper, so the content measure is defined once.
- **SEO/Head** component — a thin wrapper setting `document.title` and meta description per
  route. Full SEO work is Phase 9; this is the hook it will use.

**Commit:** `feat(layout): add page header, breadcrumbs, and container`

---

### 2.5 — Wire the shell to the placeholder routes

Convert the Phase 1 routes into children of the `AppShell` layout route. Every placeholder
page now renders inside the shell with a real `PageHeader`. Walk every route at 375px,
768px, and 1440px and fix anything that breaks.

**Commit:** `feat(layout): render all routes inside app shell`

---

## Acceptance criteria

- No hex value, font stack, or spacing magic number appears outside `@theme`.
- Every primitive is keyboard-operable with a visible focus ring, and every variant is
  visible in the component gallery.
- The sidebar is fixed on desktop and a working drawer on mobile; the drawer closes on
  navigation and manages focus correctly.
- Every route renders inside the shell at all three breakpoints without horizontal scroll.
- Text contrast passes AA everywhere. Check the muted text and any text sitting on the
  accent — those are where it fails.
- `prefers-reduced-motion` suppresses all non-essential animation.

---

## Report back

Summarize the design plan you settled on: the palette with hex values and the role of each,
the typefaces and why, the layout concept, and the parts of your first draft you revised
after reviewing against the brief. Include what a list item looks like and why you chose
that separation treatment over the alternatives. Then stop and wait.
