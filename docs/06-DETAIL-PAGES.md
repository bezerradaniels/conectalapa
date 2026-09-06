# Phase 6 — Detail Pages

**Prerequisite:** Phase 5 complete.
**Branch:** `feat/phase-6-details`
**Goal:** build the five detail pages. These are the conversion pages — the point where
someone decides to call a restaurant, message an agency, or go to an event. They are also
the pages that get shared on WhatsApp, which makes them the most-linked surface on the site.

---

## What a detail page is for

Every detail page answers three questions in order, and the layout should follow that order
on a phone:

1. **What is this?** Name, type, image, the one-line identity.
2. **Can I go / can I use it?** Address, hours or dates, price.
3. **How do I act?** WhatsApp, Instagram, directions, calendar.

Anything else — description, amenities, gallery — sits below those three. On a 375px screen
the contact action should be reachable within one scroll, and available again at the bottom
so a user who read the whole page does not have to scroll back up.

---

## Shared components

### ContactActions

The most important component in this phase. WhatsApp is the primary contact channel for
essentially every business in this city.

- **WhatsApp** — build `wa.me` links through the existing `lib/whatsapp.ts` helper.
  Normalize the stored number to E.164 with the Brazilian country code, and handle the
  reality that admin-entered numbers will arrive as `(77) 99999-9999`, `77999999999`,
  `+5577999999999`, and worse. Prefill a context-appropriate pt-BR message referencing what
  the user is contacting them about — a package inquiry and a restaurant reservation are
  different openings.
- **Instagram** — accept a handle with or without `@` and build the profile URL.
- **Directions** — a maps link built from the address, or from coordinates if you stored
  them in Phase 3.
- **Share** — the Web Share API where available, clipboard copy as the fallback, with
  visible confirmation that the copy happened.

Every action is a real link with a real `href` — not a button with a JS handler. Users
long-press to copy and open in new tabs, and a `div` with an `onClick` breaks both. Any
missing channel is simply absent; never render a dead button.

**Commit:** `feat(ui): add contact actions component`

---

### Gallery

- Responsive grid; tap opens a lightbox.
- Lightbox: keyboard navigable (arrows, Escape), swipeable on touch, focus-trapped, returns
  focus to the opening thumbnail on close.
- Lazy-load, correct dimensions reserved, `alt` text derived from the entity name and image
  position.
- Handle 1 image, 2 images, and 20 images without three different layouts breaking.

**Commit:** `feat(ui): add gallery with lightbox`

---

### Other shared pieces

- **OpeningHours** — the week's schedule with today highlighted, plus a current open/closed
  state if the Phase 3 model supports it.
- **AmenityList** — icon plus label. Choose icons that are actually recognizable; an
  ambiguous icon with a label is fine, an icon alone is not.
- **DetailSection** — the consistent heading-plus-content wrapper.
- **NotFound handling** — an unknown or unpublished slug renders a proper not-found page
  with a route back into the relevant listing. It must not render an empty shell or crash.

**Commit:** `feat(ui): add detail page shared components`

---

## Tasks

### 6.1 — Business detail (`/empresas/:slug`)

Logo, name, category, address with directions, contact actions, description, services,
amenities, opening hours, gallery, additional links.

**Commit:** `feat(businesses): add detail page`

---

### 6.2 — Event detail (`/eventos/:slug`)

Promotional image at its stored aspect ratio, name, date and time, venue with directions,
price or "Gratuito", description, amenities, restrictions, contact actions, links.

Event-specific requirements:

- **Restrictions must be visually distinct from amenities.** "Open bar" and "no coolers
  allowed" are opposite kinds of information and cannot look the same. Someone who misreads
  a dress code shows up in the wrong clothes.
- **Add to calendar** — generate an `.ics` file or a Google Calendar link. This is high
  value for a dated event and cheap to build.
- **Past events** — decide and implement the treatment. A clear "este evento já aconteceu"
  banner with the content still readable is usually better than a 404, because these links
  circulate on WhatsApp long after the date.
- Handle the unannounced-price state distinctly from free.

**Commit:** `feat(events): add detail page with calendar export`

---

### 6.3 — Package detail (`/pacotes/:slug`)

Destination, departure location, departure and return dates with duration, agency with a
link to its business page if it is registered, agency WhatsApp, price, amenities,
information, image.

The WhatsApp prefill here should carry the package name and dates. An agency receiving
"Olá, tenho interesse no pacote para Porto Seguro saindo dia 12/03" can respond
immediately; one receiving "Olá" has to ask three questions first. This single detail is
most of the product's value to the agencies.

**Commit:** `feat(packages): add detail page`

---

### 6.4 — Lodging detail (`/hospedagem/:slug`)

Gallery-led layout, name, type, address with directions, description, features, contact
actions, price range.

**Commit:** `feat(lodging): add detail page`

---

### 6.5 — Dining detail (`/gastronomia/:slug`)

Name, cuisine type, address with directions, contact actions, gallery, amenities, opening
hours with current status, price range.

**Commit:** `feat(dining): add detail page`

---

### 6.6 — Related content

At the bottom of each detail page, 3–4 related entries from the same domain — same category
or same neighborhood. Keep the query cheap and exclude the current entry. If there is
nothing related, render nothing rather than an empty section.

**Commit:** `feat(detail): add related content section`

---

### 6.7 — Social sharing metadata

These pages get pasted into WhatsApp constantly, so the link preview is part of the
product, not a nice-to-have.

Per-page Open Graph and Twitter tags: title, description, image, URL, type.

**The known constraint:** this is a client-rendered SPA, and WhatsApp's crawler does not
execute JavaScript. Tags injected at runtime will not appear in the preview. Do not ship
runtime-injected tags and call this done — verify with a real preview debugger and report
the actual result. If it does not work, document the options (prerendering, an edge
function that serves tags to crawlers, or moving to SSR) with a recommendation, and flag it
for Phase 9. An honest "this does not work yet and here is why" is worth more than a task
marked complete.

**Commit:** `feat(seo): add open graph tags to detail pages`

---

## Acceptance criteria

- Every field from the Phase 3 domain lists renders, and every optional field degrades
  gracefully when absent.
- WhatsApp links open the correct conversation with a sensible prefilled message, tested on
  a real device with real stored numbers in inconsistent formats.
- The gallery lightbox is keyboard and touch operable and manages focus correctly.
- Event restrictions are unmistakably distinct from amenities.
- An unknown slug renders the not-found page.
- Past events are handled per your stated decision.
- Every detail page is readable and actionable at 375px with contact reachable within one
  scroll.

---

## Report back

Summarize: how phone number normalization handles the messy input cases, your past-event
decision, the WhatsApp prefill message per domain, the outcome of the real link-preview
test with your recommendation if it failed, and anything in the Phase 3 model that made a
page harder to build than it should have been. Then stop and wait.
