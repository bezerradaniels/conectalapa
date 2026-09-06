# Phase 9 — Polish & Launch

**Prerequisite:** Phase 8 complete.
**Branch:** `feat/phase-9-launch`
**Goal:** take a feature-complete application to production. This phase is measurement,
correction, and deployment — not new features.

Every task here produces a **number or a piece of evidence**. "Improved performance" is not
an acceptable report; "LCP went from 3.4s to 1.6s on throttled 4G" is.

---

## Tasks

### 9.1 — Resolve the SEO rendering problem

Phase 6 flagged this: WhatsApp, Facebook, and most link crawlers do not execute JavaScript,
so a client-rendered SPA has no usable link previews and weak search indexing. Given that
this product's primary distribution channel is people pasting links into WhatsApp, this is
a product problem, not a technical nicety.

Evaluate the options and implement one:

- **Prerendering at build time** — works for stable pages, but content is admin-managed and
  changes without a rebuild, so a newly published event would have no preview until the
  next deploy. Consider whether a deploy hook on publish closes that gap.
- **An edge function serving meta tags to crawlers** by user-agent, with the SPA served to
  everyone else. Effective, moderate complexity.
- **Migrating to a framework with SSR.** Correct long-term, expensive now.

Choose based on the actual cost, implement it, and **verify with a real crawler** — paste a
link into WhatsApp and into the Facebook sharing debugger. Report the screenshots or the
debugger output. Do not mark this complete on the basis that the tags exist in the DOM.

**Commit:** `feat(seo): implement crawler-visible meta tags`

---

### 9.2 — SEO fundamentals

- `robots.txt`, disallowing `/admin`.
- A `sitemap.xml` including every published entry, regenerated when content changes.
- Canonical URLs on every page.
- `JSON-LD` structured data: `LocalBusiness` for businesses, dining, and lodging; `Event`
  for events, including offers and location. This is what produces rich results for local
  search, which is most of the organic traffic this site will ever get.
- `lang="pt-BR"` on `<html>`.
- Unique title and meta description per page, generated from content rather than templated
  into meaninglessness.

Validate the structured data with Google's Rich Results Test and report the output.

**Commit:** `feat(seo): add sitemap, robots, and structured data`

---

### 9.3 — Performance

Measure before changing anything. Run Lighthouse mobile with throttling on: home, a listing
page, and a detail page. Record the numbers. Then work the largest problems.

Likely candidates:

- **Images** — verify actual served sizes. Serve WebP with `srcset` and correct `sizes`.
  Explicit dimensions everywhere to keep CLS at zero.
- **Bundle** — analyze it. Route-level code splitting should already be in place from Phase
  1; check it is actually splitting. Look for a heavy dependency pulled in globally that
  only one route needs.
- **Fonts** — `font-display: swap`, preload the primary face, subset to Latin.
- **Queries** — check for N+1 patterns and over-fetching on list pages.

Targets on throttled mobile: LCP under 2.5s, CLS under 0.1, INP under 200ms, Lighthouse
performance ≥ 90.

Report before and after for each page.

**Commit:** `perf: optimize images, bundle, and fonts`

---

### 9.4 — Accessibility audit

Automated tooling catches maybe 40% of real problems. Run it, then do the manual work.

**Automated:** axe DevTools on every page type. Fix everything reported.

**Manual, and this is the part that matters:**
- Navigate the entire site with the keyboard only. Every interactive element reachable,
  visible focus at all times, logical order, no traps, skip link working.
- Test the sidebar drawer, gallery lightbox, filter drawer, and all dialogs for focus
  management and Escape handling.
- Run one full task with a screen reader — VoiceOver is on the Mac already. Find a
  restaurant and open its WhatsApp link. Report what was confusing.
- Verify contrast on the states automated tools miss: disabled controls, placeholder text,
  focus rings against their backgrounds, text over images.
- Zoom to 200% and confirm nothing is cut off or overlapping.
- Confirm `prefers-reduced-motion` suppresses all non-essential animation.

**Commit:** `fix(a11y): resolve audit findings`

---

### 9.5 — Error handling and resilience

- A global error boundary that renders something useful, not a white screen.
- Offline detection with a clear pt-BR message. This audience has unreliable mobile data
  and will hit this often.
- Retry on failed queries, with a manual retry affordance when automatic retries are
  exhausted.
- A 404 page that helps people get somewhere rather than apologizing.
- Confirm no raw Postgres or Supabase error text can reach the UI.

Test by deliberately breaking things: kill the network mid-load, point at a bad Supabase
URL, request a deleted entry's slug. Report what the user actually sees in each case.

**Commit:** `feat(errors): add resilient error handling`

---

### 9.6 — Analytics

Something privacy-respecting and lightweight — Plausible, Umami, or Vercel Analytics. Not
Google Analytics; it is heavy, requires a cookie banner in most readings of Brazilian
privacy law, and you do not need what it offers.

Track what will actually inform decisions: page views, which domains get traffic, search
queries with no results (this tells the admin what content to add next, which is the single
most useful signal the site can produce), and WhatsApp click-throughs per entry.

Do not collect personal data. Do not track admin routes.

**Commit:** `feat(analytics): add privacy-friendly analytics`

---

### 9.7 — Production deployment

Deploy to Vercel or Netlify. Configure:

- Environment variables in the hosting dashboard, never in the repository. Confirm again
  that no key was ever committed — check the git history, not just the working tree.
- SPA fallback routing so deep links resolve.
- Security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.
- A custom domain with HTTPS if one is available.
- Automatic deploys from `main`, preview deploys from branches.

Confirm the Supabase project is on a production-appropriate configuration, that RLS is
enabled on every table one final time, and that the anon key in the client build has only
the access it should.

**Commit:** `chore(deploy): configure production deployment`

---

### 9.8 — Documentation

A `README.md` covering: what the project is, the stack, local setup from a clean clone,
environment variables, how to run migrations, how to regenerate types, the deploy process,
and the project structure.

Separately, a short **admin guide in Portuguese** for the person actually running the site:
how to log in, how to add each type of entry, how to handle submissions, image size
guidance, and what draft versus published means. Written for someone who is not a
developer.

**Commit:** `docs: add readme and admin guide`

---

### 9.9 — Pre-launch checklist

Walk through on a real phone, not a simulator:

- [ ] Every route loads; every link resolves.
- [ ] A WhatsApp link opens the right conversation with the right prefill.
- [ ] A shared link renders a correct preview in WhatsApp.
- [ ] The submission form works end to end and the submission appears in the queue.
- [ ] Admin login, create, edit, publish, delete all work in production.
- [ ] A published entry appears publicly; a draft does not.
- [ ] Search returns sensible results, accent-insensitively.
- [ ] No console errors on any page.
- [ ] No placeholder or lorem ipsum content anywhere.
- [ ] Anonymous writes and anonymous submission reads both still fail.

**Commit:** `chore: pre-launch fixes`

---

## Acceptance criteria

- Link previews verified working in WhatsApp with evidence.
- Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility, ≥ 95 best practices, ≥ 95 SEO on
  all three page types.
- Core Web Vitals within target on throttled mobile.
- Zero critical axe violations; keyboard and screen reader walkthroughs completed.
- Structured data validates.
- Production deployment live with security headers and no committed secrets.
- Both documents written.

---

## Report back

Final summary: before and after metrics for every measured item, the SEO approach you chose
with the crawler verification evidence, the accessibility findings you fixed and any you
consciously deferred, what you deliberately did not build, and a prioritized list of what
should happen after launch based on what you learned building it.
