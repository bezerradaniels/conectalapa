# ConectaLapa — Implementation Plan

Phase-by-phase engineering briefs for building ConectaLapa with Claude Code.

## Files

| File | Phase | Outcome |
|---|---|---|
| `00-PROJECT-OVERVIEW.md` | — | Domain, stack, conventions, standards. **Read first, always.** |
| `01-FOUNDATION.md` | 1 | Tailwind v4, aliases, routing, providers, linting |
| `02-DESIGN-SYSTEM.md` | 2 | Tokens, UI primitives, sidebar app shell |
| `03-DATA-LAYER.md` | 3 | Supabase schema, RLS, storage, typed hooks, seed data |
| `04-HOME.md` | 4 | Home page, hero, featured sections |
| `05-LISTING-PAGES.md` | 5 | Five listing pages, filters, search |
| `06-DETAIL-PAGES.md` | 6 | Five detail pages, gallery, WhatsApp actions |
| `07-ADMIN.md` | 7 | Auth, admin CRUD, image upload |
| `08-SUBMISSIONS.md` | 8 | Public request form, moderation queue |
| `09-POLISH-LAUNCH.md` | 9 | SEO, performance, a11y, deploy |

## How to use these with Claude Code

Put this folder at `docs/` in the repository so the files are versioned alongside the code.

Start each phase in a **fresh Claude Code session** — carrying the previous phase's context
forward wastes the window and blurs the scope. Open with something like:

```
Read docs/00-PROJECT-OVERVIEW.md and docs/01-FOUNDATION.md.

Before writing any code, tell me what you understood the phase to require,
what you plan to build, and anything ambiguous you want resolved first.
```

Every phase file ends with a "Report back" section. Use it — that report is your checkpoint
before approving the next phase.

## Why the phases are ordered this way

Each phase depends on the one before it and is independently reviewable:

- **1–2** produce nothing a user sees, and skipping them means retrofitting tokens and
  layout into forty finished components later.
- **3** is the schema. Getting it wrong is the most expensive mistake available, which is
  why that file asks for reasoning on each modeling decision rather than just a table list.
- **4–6** are the public site, ordered so each phase produces something demonstrable.
- **7–8** are the operational side. They come after the public pages because the admin
  forms should mirror fields you have already rendered.
- **9** is measurement and deployment.

## Two things worth watching for

**Scope creep between phases.** Each file says to write later-phase ideas into `NOTES.md`
instead of building them. Hold that line — the most common failure mode here is Phase 2
quietly becoming Phase 2 through 5.

**Completion claimed without evidence.** Several tasks — RLS policies, WhatsApp link
previews, accent-insensitive search, image optimization — ask for demonstrated results
rather than assertions. These are precisely the things that look done and are not. When a
report says a policy works, ask what the actual error response was.
