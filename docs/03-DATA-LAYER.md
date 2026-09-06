# Phase 3 — Data Layer

**Prerequisite:** Phase 2 complete.
**Branch:** `feat/phase-3-data-layer`
**Goal:** model the domain in Postgres, secure it with row-level security, configure image
storage, generate types, and expose typed data hooks. No new UI in this phase — the
placeholder pages start rendering real data at the end of it.

The Supabase MCP server is connected. Use it to inspect the project, apply migrations, and
generate types. Every schema change must exist as a **migration file committed to the
repository** — never as an untracked change made through the dashboard. If the schema only
exists in the cloud, the project is one accident away from being unreproducible.

Project ref: `vydymabffpgfrigkbtax`

---

## Domain model

Field lists come from the product owner and are authoritative. Where a field's type is
ambiguous, choose the type that will not require a migration later and explain the choice.

### Shared conventions

Every content table carries:

- `id uuid primary key default gen_random_uuid()`
- `slug text unique not null` — URL identifier, generated from the name, lowercase, ASCII-
  folded (Portuguese accents removed), hyphenated. Collisions get a numeric suffix. Write
  this as a Postgres function so slugs are consistent regardless of who inserts the row.
- `status text not null default 'draft'` — one of `draft`, `published`, `archived`. The
  public site reads `published` only. Enforce the allowed values with a check constraint or
  an enum; state which you chose.
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()` — maintained by a trigger, not by the
  client.

Design decisions to make explicitly, with a stated rationale:

- **Categories** — a `categories` table with a `domain` discriminator, or a per-domain
  enum? The admin will want to add categories without a deploy, which points one way.
- **Amenities / features / restrictions** — these repeat across domains (parking, air
  conditioning, accepts cards). A shared `amenities` table with a join table avoids five
  parallel `text[]` columns that can never be filtered consistently. Weigh that against the
  added join complexity for a dataset this size and decide.
- **Galleries** — a separate `media` table with a polymorphic owner, or a `gallery` join
  per domain? Polymorphic references cannot be enforced by a foreign key, which matters.
- **Opening hours** — structured `jsonb` with a documented shape, or a `opening_hours` row
  per weekday? The second is queryable ("open now"); the first is simpler to edit. Decide
  based on whether "open now" filtering is plausible in the next year.

Whatever you choose, write the reasoning into the migration file as a comment. Future-you
will not remember.

### `businesses`
name, logo (image), category, address, whatsapp, instagram, gallery, services, amenities,
opening hours, additional links (label + url pairs), description.

### `events`
name, whatsapp, instagram, promotional image (1080×1080 or 1080×1350 — store the aspect
ratio so the UI can reserve the right space and avoid layout shift), ticket price
(nullable — null means free; do not use `0`, because "free" and "price not yet announced"
are different states and the UI must distinguish them), start datetime, end datetime,
address, venue name, description, amenities (open bar, VIP area, parking), restrictions
(no coolers, white dress code only), links.

Events are the only time-sensitive domain. Store timestamps as `timestamptz`. The app is
single-timezone (America/Bahia, no DST) but storing local timestamps without a zone is the
kind of shortcut that becomes a data migration later.

### `packages`
destination, departure location (defaults to Bom Jesus da Lapa but must be editable),
departure date, return date, responsible agency, agency whatsapp, amenities, information,
price, image.

The agency is a business. Decide whether `agency_id` is a real foreign key into
`businesses` or a denormalized text field. A foreign key is correct; confirm the admin flow
in Phase 7 can handle "agency not yet registered" before committing to it.

### `lodging`
lodging type (hotel, pousada, guesthouse, resort), establishment name, address,
description, features, gallery, whatsapp, instagram, price range indicator.

### `dining`
name, address, restaurant type (churrascaria, pizzeria, lanchonete, …), whatsapp,
instagram, gallery, amenities, opening hours, price range indicator.

### `submissions`
Public-facing requests. Holds the submitter's contact details, the target domain, a free-
text payload of what they want listed, plus `status` (`pending`, `approved`, `rejected`),
`reviewed_at`, and `review_notes`. This table is written by anonymous users, which makes it
the primary abuse surface in the application — see the RLS section.

---

## Tasks

### 3.1 — Migrations

Write ordered, idempotent-where-possible migration files. One migration per logical change,
not one giant file. Include the slug function, the `updated_at` trigger, all check
constraints, and indexes on: `slug` (unique), `status`, `category`, and `start_at` for
events. Add a GIN index for full-text search on name and description — search arrives in
Phase 5 and retrofitting the index is avoidable work.

Apply through the MCP server and verify the resulting schema by reading it back, not by
assuming the migration succeeded.

**Commit:** `feat(db): add core schema migrations`

---

### 3.2 — Row-level security

**Enable RLS on every table. Verify it is on before moving on** — a table with RLS disabled
and an anon key in the browser is a public read-write database.

Policies:

- **Public content tables** — anonymous `select` where `status = 'published'`. No anonymous
  insert, update, or delete under any circumstance.
- **All writes** — restricted to authenticated users carrying the admin role. Define how
  the admin role is expressed (a custom claim, or an `admins` table keyed by `auth.uid()`)
  and state the tradeoff.
- **`submissions`** — anonymous `insert` allowed, but anonymous `select` **denied**.
  Getting this backwards leaks every submitter's phone number to anyone with the anon key.
  Admins can select and update.

Then test the policies adversarially. Using the anon key, attempt: reading a `draft` row,
inserting into `businesses`, updating an existing row, and reading `submissions`. All four
must fail. Report the actual error responses — do not assert the policies work without
demonstrating it.

Add rate limiting on submission inserts. At minimum a per-IP or per-window constraint at
the database or edge-function level, because an unauthenticated public insert endpoint will
be found and abused. Note in your report what protection you implemented and what it does
not cover; a full anti-spam solution is Phase 8's problem, but leaving it entirely open now
is not acceptable.

**Commit:** `feat(db): enable rls and add access policies`

---

### 3.3 — Storage

Create buckets with an explicit public/private decision each:

- `logos` — small, public read
- `galleries` — public read
- `events` — public read

Set per-bucket size limits and allowed MIME types (`image/jpeg`, `image/png`, `image/webp`
— reject SVG, which can carry script). Restrict uploads to authenticated admins.

Define the path convention now: `{bucket}/{domain}/{entity_id}/{uuid}.{ext}`. Ad-hoc paths
make orphan cleanup impossible later.

Document how images will be served and resized — Supabase image transformations, or
pre-generated sizes on upload. This choice determines what Phase 5's cards can assume, so
make it now rather than discovering it during the listing build.

**Commit:** `feat(storage): configure image buckets and policies`

---

### 3.4 — Types

Generate TypeScript types from the live schema via the MCP server into
`src/types/database.ts`. Add an npm script so regeneration is one command, and note in the
file header that it is generated and must not be hand-edited.

In `src/types/`, add hand-written domain types that compose the generated row types with
their relations (a `BusinessWithRelations` that includes category and gallery, for example).
Components consume the domain types; the generated types stay an implementation detail of
the data layer.

**Commit:** `feat(types): generate database types and add domain models`

---

### 3.5 — Supabase client and data hooks

`src/lib/supabase.ts` — a single typed client instance, constructed from the validated env
object from Phase 1. One instance for the whole app; multiple clients cause duplicate auth
listeners and subtle session bugs.

For each domain, in `src/features/{domain}/api/`:

- `queries.ts` — the raw Supabase query functions. Each selects only the columns it needs.
  `select('*')` on a list endpoint with galleries attached will send far more data than a
  card renders.
- `hooks.ts` — the React Query hooks: `useBusinesses(filters)`, `useBusiness(slug)`, and so
  on. Keys come from the `queryKeys` factory built in Phase 1.

Error handling: normalize Supabase errors into an application error shape carrying a
user-facing Portuguese message and the original error for logging. Every hook surfaces that
shape. Do not let a raw Postgres error string reach the UI.

**Commit one domain at a time:** `feat(businesses): add data queries and hooks`

---

### 3.6 — Seed data

Write a seed script inserting a realistic amount of test content per domain — at least 12
businesses, 8 events (a mix of past, ongoing, and future, plus one free and one with an
unannounced price), 6 packages, 8 lodging entries, 10 dining entries.

Make the seed data realistic to Bom Jesus da Lapa rather than lorem ipsum: plausible
Brazilian business names, real-shaped addresses, correct-format phone numbers, prices in
BRL at local levels. Fake data that is too tidy hides layout bugs — include at least one
business with a very long name, one with no logo, one with an empty gallery, and one event
with a two-line venue name. Those are the rows that will break the cards in Phase 5, and
you want to find them now.

**Commit:** `chore(db): add seed script with realistic test data`

---

### 3.7 — Wire one page end to end

Replace the `/empresas` placeholder with a bare unstyled list rendering real data from
`useBusinesses()`, including loading, empty, and error states. This is a vertical-slice
proof that migrations, RLS, types, and hooks all work together. It stays ugly — Phase 5
does the real listing UI.

**Commit:** `feat(businesses): render live data on list page`

---

## Acceptance criteria

- Every schema change exists as a committed migration; nothing was applied only via the
  dashboard.
- RLS is enabled on every table, and you have demonstrated that the four adversarial anon
  operations fail.
- `submissions` is not readable with the anon key.
- Types regenerate with one command and the build is clean.
- `/empresas` shows seeded data, with working loading, empty, and error states.
- The seed set includes deliberate edge cases.

---

## Report back

Summarize: the schema as built, each ambiguous modeling decision and the reasoning behind
it, the RLS policy set with your adversarial test output, the storage path and resizing
strategy, and any field from the domain lists that you could not model cleanly and why.
Then stop and wait.
