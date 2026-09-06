# Phase 4 — Home Page

**Prerequisite:** Phase 3 complete.
**Branch:** `feat/phase-4-home`
**Goal:** build the home page — the entry point that has to answer "what is this and what
can I find here" within one screen on a phone, and route the visitor into the right domain
in one tap.

---

## Who lands here

Two distinct arrivals, and the page has to serve both without splitting in half:

1. **A visitor or pilgrim on a phone, right now**, looking for somewhere to eat or sleep
   tonight. They arrived from a shared link or a Google search. They have low patience and
   possibly a weak connection. They need to get into a category immediately.
2. **A resident**, checking what is happening this weekend. Events are their reason to
   return. They come back weekly, so the page should reward a repeat visit with something
   that has changed.

The shared need is orientation. The differing need is destination. Bias the top of the page
toward navigation and the middle toward freshness.

---

## Design guidance

The hero is the first thing anyone sees, and the default treatment — a big centered
headline over a gradient with two buttons — is what this page would look like if nobody
thought about it. Before building it, decide what the most characteristic thing about this
product is and lead with that. Some directions worth weighing: the five domains themselves
as the hero (navigation *is* the product); a search field as the hero (if search is genuinely
good enough to carry it); what is happening in the city this week (fresh, and gives
residents a reason to return). Pick one, commit to it, and say why you rejected the others.

Whatever you choose must work at 375px without the fold cutting it in half.

Constraints carried from Phase 2 that apply here in particular:

- No decorative gradient washes, no scroll-triggered fade-and-slide-up on each section.
- If sections use a repeated card grid, make sure each grid is visually distinguishable
  from the last — five identical grids stacked vertically is the failure mode of this page.
- Do not put an all-caps eyebrow label above each section heading.
- Copy is pt-BR, sentence case, plain verbs. Section headings say what the section contains,
  not what it means to you.

---

## Tasks

### 4.1 — Hero

Build the hero you argued for. Requirements regardless of direction:

- One clear statement of what ConectaLapa is, in one line, understandable to someone who
  has never heard of it.
- The primary action reachable without scrolling on a 375×667 viewport.
- Any image is `loading="eager"` with explicit dimensions and a `fetchpriority="high"`;
  everything below the fold is lazy. This page's LCP is its most important metric.
- No layout shift as fonts and images load. Reserve space.

**Commit:** `feat(home): add hero section`

---

### 4.2 — Category navigation

The five domains as a primary navigation block: Empresas, Eventos, Pacotes, Hospedagem,
Gastronomia. Each with an icon, a Portuguese label, and — if you have it cheaply — a count.

This is the most important interactive element on the page for arrival type 1. On mobile it
must be a single-column or two-column layout with targets comfortably above 44px, reachable
in the thumb zone. Do not make these five identical squares in a grid that requires reading
five icons to find the right one; consider whether ordering, sizing, or grouping can encode
which is most used.

**Commit:** `feat(home): add category navigation`

---

### 4.3 — Featured content sections

Three sections, each pulling live published data:

1. **Próximos eventos** — the next 4–6 events by start date. Exclude events that have
   already ended. This is the returning-resident payoff, so it should be prominent.
2. **Pacotes de viagem** — 3–4 upcoming departures. Show destination, departure date, and
   agency; these are the three things that decide whether someone taps.
3. **Novidades** — the most recently published entries across the other domains, so the
   page changes as the admin adds content even in a quiet week.

Each section: heading, the items, and a link to the full listing. Each needs a real empty
state — early on, several of these will genuinely be empty, and "Nenhum evento por
enquanto" with a link to submit one is better than a section that silently disappears and
makes the page look broken.

Use the domain card components. If they don't exist yet, build the minimum version here and
note in `NOTES.md` that Phase 5 owns their full form — do not build the complete card
system in this phase.

**Commit one section at a time:** `feat(home): add upcoming events section`

---

### 4.4 — Search entry point

A search field that routes to a results page with the query as a URL param. The results
page itself is Phase 5's work — here, build the entry and the route target that reads the
param.

Decide where it lives: in the hero, in the mobile header, or both. If it appears in two
places, they must behave identically.

**Commit:** `feat(home): add search entry point`

---

### 4.5 — Submission call to action

A block inviting businesses to request a listing, routing to `/solicitar`. One sentence of
context, one button. This is how the directory grows in its first months, so it should be
findable — but it is not the page's primary job and should not compete with the hero.

**Commit:** `feat(home): add listing request cta`

---

### 4.6 — Loading and error behavior

The home page fires several queries. Handle the composite state deliberately:

- Each section resolves independently. One slow query must not block the whole page.
- Skeletons match the real content's dimensions so nothing jumps when data arrives.
- A failed section shows an inline retry, not a full-page error. The rest of the page stays
  usable.

**Commit:** `feat(home): add loading and error states`

---

## Acceptance criteria

- At 375px, the page reads as a single column, the hero's primary action is above the fold,
  and there is no horizontal scroll.
- Every section has a working empty state, verified by testing with the data actually absent.
- No cumulative layout shift on load — check this, don't assume it.
- The page is fully keyboard-navigable in a sensible order, and the skip link lands in `main`.
- All copy is pt-BR and free of the tells listed in the overview.
- Lighthouse mobile performance ≥ 90 on a throttled run.

---

## Report back

Summarize: the hero direction you chose and the alternatives you rejected with reasoning,
how the category navigation is ordered and why, which queries the page fires and how many
round trips that is, and your Lighthouse numbers. Then stop and wait.
