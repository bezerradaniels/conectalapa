# Phase 5 — Listing Pages

**Prerequisite:** Phase 4 complete.
**Branch:** `feat/phase-5-listings`
**Goal:** build the five listing pages plus search results, with filtering, sorting, and
pagination. This is where users spend most of their time, and it is the phase where a
generic implementation shows most.

---

## The shared problem

Five pages that are structurally identical and semantically different. Build a shared
listing framework — layout, filter bar, pagination, URL state, empty and error states — and
have each domain supply its own card, its own filter set, and its own sort options.

Getting the abstraction boundary right matters here. Too little sharing and you maintain
five copies of pagination. Too much and the abstraction fights you the moment events need a
date filter that nothing else has. A reasonable line: share everything about *how a list
behaves*, share nothing about *what a domain means*. Propose your boundary before building
it.

---

## Universal requirements

**URL as state.** Every filter, sort, and page number lives in the query string. A filtered
list must be shareable and survive a refresh and the back button. Use `useSearchParams` as
the source of truth — do not mirror filter state into `useState` and try to keep them in
sync, which is where this pattern usually breaks.

**Mobile filter pattern.** A filter sidebar does not exist at 375px. Filters open in a
drawer from a button that shows the active filter count. Applying closes the drawer. There
must be a visible way to clear all filters — users get stuck in a filtered empty state and
cannot work out why the page is blank.

**Pagination.** Choose between numbered pagination and load-more, and justify it. Consider
that this audience is on mobile, that back-button behavior from a detail page must return
them to where they were, and that infinite scroll makes the footer unreachable. Whatever
you choose, it must be keyboard accessible and announce changes to screen readers.

**Empty states, three distinct kinds.** These are different situations and must not share
one message:
1. The domain has no published content at all → invite a submission.
2. Filters returned nothing → show which filters are active and offer to clear them.
3. Search returned nothing → show the query and suggest browsing the category instead.

**Result count.** Always show how many results matched. It is the fastest way for a user to
tell whether a filter did what they expected.

---

## Tasks

### 5.1 — Listing framework

In `src/components/listing/`:

- `ListingLayout` — page header, filter bar, result count, results region, pagination.
- `FilterBar` — desktop inline, mobile drawer trigger, active-filter chips that can be
  dismissed individually.
- `SortSelect` — per-domain options.
- `Pagination` — your chosen pattern.
- `ResultsGrid` — responsive, one column at mobile.
- `useListingParams` — the hook binding URL params to typed filter state, with Zod parsing
  so a hand-edited malformed URL degrades to defaults rather than crashing.

**Commit:** `feat(listing): add shared listing framework`

---

### 5.2 — Domain cards

In `src/components/cards/`. Each card is a link to its detail page, with the whole card as
one link target rather than nested interactive elements — nested links inside a card link
are an accessibility failure and a common bug.

- **BusinessCard** — logo, name, category badge, neighborhood, an open/closed indicator if
  the opening-hours model from Phase 3 supports it.
- **EventCard** — image at its stored aspect ratio, name, date and time, venue, price or
  "Gratuito". If the price is unannounced, say so; do not render it as free.
- **PackageCard** — destination as the headline (it is what people scan for), departure
  date, duration, agency, price.
- **LodgingCard** — image, name, type badge, neighborhood, price range.
- **DiningCard** — image, name, cuisine type badge, neighborhood, open/closed.

Every card needs a matching skeleton with identical dimensions.

Test each card against the deliberately awkward seed rows from Phase 3: the very long name,
the missing image, the empty gallery. A card that only looks right with ideal data is not
finished. Decide what a missing image looks like — a placeholder that is clearly a
placeholder is better than a broken image icon or a collapsed layout.

**Commit one card at a time:** `feat(cards): add event card`

---

### 5.3 — Business listing (`/empresas`)

Filters: category, neighborhood, amenities, open now (if supported).
Sorts: name A–Z, recently added.

**Commit:** `feat(businesses): add listing page with filters`

---

### 5.4 — Event listing (`/eventos`)

Filters: date range (with quick presets — hoje, este fim de semana, este mês), free vs
paid, price ceiling, neighborhood, amenities.
Sorts: soonest first (default), recently added.

Events carry state that the others do not: an event can be upcoming, happening now, or
finished. Decide how each is treated. Default to hiding finished events, but consider
whether a user arriving from an old shared link should hit a 404 or a clearly-labeled past
event.

Consider grouping by date rather than a flat grid. A list of events is chronological data,
and a date-grouped list reads faster than fifteen cards each repeating their own date. This
is the one listing page where a different structure is probably correct — think it through
rather than defaulting to the shared grid.

**Commit:** `feat(events): add listing page with date filters`

---

### 5.5 — Package listing (`/pacotes`)

Filters: destination, departure month, price range, agency.
Sorts: soonest departure (default), price ascending, price descending.

Packages with a departure date in the past are dead content. Exclude them by default and
decide whether they are reachable at all.

**Commit:** `feat(packages): add listing page`

---

### 5.6 — Lodging listing (`/hospedagem`)

Filters: type, neighborhood, features, price range.
Sorts: name, recently added.

**Commit:** `feat(lodging): add listing page`

---

### 5.7 — Dining listing (`/gastronomia`)

Filters: cuisine type, neighborhood, amenities (delivery, parking, card payment), open now.
Sorts: name, recently added.

**Commit:** `feat(dining): add listing page`

---

### 5.8 — Search results (`/busca`)

Full-text search across all five domains using the GIN index from Phase 3.

- Results grouped by domain, each group showing its top matches with a link to that
  domain's filtered listing.
- Handle Portuguese properly: accent-insensitive and case-insensitive matching. Someone
  typing "acai" must find "Açaí". Verify this explicitly — it is the single most likely
  thing to be quietly broken in a Brazilian search implementation.
- Debounce input, and cancel superseded requests.
- Show the query back to the user in the results header.

**Commit:** `feat(search): add cross-domain search results page`

---

### 5.9 — Performance pass

- Images lazy-load below the fold with explicit dimensions.
- Requests are paginated at the database level, not filtered client-side after fetching
  everything.
- Filter changes do not refetch data that has not changed — check the network tab and
  report what you see.
- Rapid filter toggling does not produce a request storm or an out-of-order render.

**Commit:** `perf(listing): optimize queries and image loading`

---

## Acceptance criteria

- Every filter, sort, and page state is in the URL, survives refresh, and back/forward works.
- All three empty-state kinds are implemented and reachable.
- Filters are usable in a drawer at 375px, with an active count and a clear-all.
- Every card handles missing images and overflowing text without breaking.
- Accent-insensitive search is demonstrated working.
- Returning from a detail page restores the list scroll position.
- Skeletons match real content dimensions; no layout shift when data arrives.

---

## Report back

Summarize: your shared-versus-per-domain abstraction boundary and why, the pagination
pattern you chose and the tradeoff you accepted, how you structured the events page and
whether you grouped by date, how accent-insensitive search is implemented and how you
verified it, and the network behavior on rapid filter changes. Then stop and wait.
