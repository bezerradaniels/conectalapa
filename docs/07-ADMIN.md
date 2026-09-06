# Phase 7 — Admin Panel

**Prerequisite:** Phase 6 complete.
**Branch:** `feat/phase-7-admin`
**Goal:** build the authenticated admin panel where all content is created and maintained.

---

## Who uses this

One person — the project owner — sitting down to enter thirty businesses in an afternoon,
frequently on a laptop but sometimes on a phone. This is not a multi-tenant SaaS dashboard
and should not be built like one. The success metric is **how fast one person can enter one
complete listing and how confident they are that they did not lose work**.

That framing drives three decisions:

- **Optimize for repetitive entry.** Keyboard-first, sensible defaults, the ability to save
  and immediately start another, no unnecessary confirmation dialogs on routine actions.
- **Never lose work.** Long forms with image uploads on a mobile connection will fail.
  Autosave drafts locally, warn on navigation away from unsaved changes, and make a failed
  submit recoverable rather than destructive.
- **Do not overbuild.** No roles, no permissions matrix, no audit log, no activity feed. If
  you find yourself building user management, stop.

---

## Tasks

### 7.1 — Authentication

Supabase Auth, email and password. No public sign-up route — the admin account is created
manually in the Supabase dashboard.

- `/admin/login` with clear pt-BR error messages. "Credenciais inválidas" is fine;
  distinguishing "wrong password" from "no such user" is not, since it enumerates accounts.
- An auth context exposing session, user, loading, and sign-out.
- A `ProtectedRoute` wrapper redirecting unauthenticated users to login, preserving the
  intended destination so they land where they were going after signing in.
- Handle session expiry mid-session without dumping the user into a blank screen or losing
  a form they were filling in.

**The client-side guard is a convenience, not a security boundary.** The actual protection
is the RLS policies from Phase 3. Confirm those still hold — an admin route that merely
hides the UI while the anon key can still write is not secure. Re-run the adversarial write
tests from Phase 3 and report the results.

**Commit:** `feat(auth): add admin authentication and protected routes`

---

### 7.2 — Admin shell

A distinct layout from the public site — the visual difference should be immediate so the
admin never wonders which context they are in.

- Sidebar: Dashboard, Empresas, Eventos, Pacotes, Hospedagem, Gastronomia, Solicitações,
  and sign-out.
- A pending-submission count badge on Solicitações.
- Usable at tablet width; acceptable but not optimized on a phone.

**Commit:** `feat(admin): add admin layout shell`

---

### 7.3 — Dashboard (`/admin`)

Counts per domain by status, pending submissions with a link to the queue, recently edited
entries, and quick-create buttons. Keep it to what is genuinely useful on arrival — resist
building charts nobody will read.

**Commit:** `feat(admin): add dashboard`

---

### 7.4 — Shared admin CRUD framework

Five domains with near-identical management screens. Build the framework once:

- **AdminTable** — sortable columns, status filter, text search, row actions (edit,
  duplicate, change status, delete), and a bulk status change. Paginated server-side.
- **AdminForm** — React Hook Form plus a Zod schema per domain, field-level errors,
  save/save-and-new/cancel, and unsaved-changes warning on navigation.
- **StatusControl** — draft / published / archived, with the publishing consequence stated
  plainly.
- **DeleteConfirm** — a dialog naming what is being deleted. Deletion also removes the
  associated storage objects; decide whether it is a soft delete and justify the choice.
  Orphaned images in a bucket are a slow leak nobody notices.

**Commit:** `feat(admin): add shared crud framework`

---

### 7.5 — Image upload

The highest-friction part of content entry — make it good.

- Drag-and-drop plus file picker, multi-file for galleries.
- **Client-side resize and WebP conversion before upload.** The admin will select 4MB phone
  photos; uploading them raw wastes their time and every visitor's bandwidth forever. This
  single step is the most valuable thing in this phase.
- Per-file progress, individual cancel, and clear per-file errors.
- Validate type and size before upload starts, not after.
- Gallery reordering by drag, with a keyboard-accessible alternative.
- Set one image as primary.
- Removing an image from the form deletes the storage object, and a failed form submit does
  not leave orphaned uploads behind.
- Alt text field per image, since the public pages need it.

**Commit:** `feat(admin): add image upload with client-side optimization`

---

### 7.6 — Domain management screens

One list screen plus one form screen per domain. Every field from the Phase 3 model is
editable.

Per-domain notes:

- **Businesses** — opening hours need a genuinely fast editor. Seven rows of two time
  inputs is tedious; provide copy-to-all-weekdays and a closed toggle per day. Amenities as
  a multi-select. Repeatable link rows with add and remove.
- **Events** — datetime pickers where end cannot precede start. Price with a "gratuito"
  toggle that is distinct from leaving it blank. Amenities and restrictions as separate
  repeatable lists. Image upload should enforce or at least warn about the 1080×1080 /
  1080×1350 expectation.
- **Packages** — agency as a searchable select over existing businesses, with a path for an
  unregistered agency per your Phase 3 decision. Date validation on departure and return.
- **Lodging** and **Dining** — straightforward; reuse the framework fully.

**Commit one domain at a time:** `feat(admin): add event management screens`

---

### 7.7 — Slug management

Slugs auto-generate from the name, are editable, and are validated for uniqueness before
save with immediate feedback.

**Changing the slug of a published entry breaks every link already shared on WhatsApp.**
Warn explicitly when editing the slug of a published entry, and consider keeping old slugs
as redirects. State your decision.

**Commit:** `feat(admin): add slug generation and validation`

---

### 7.8 — Preview

From the edit form, preview the entry exactly as it will appear publicly, including drafts.
Reusing the public detail components is the point — a preview that renders differently from
production is worse than no preview.

**Commit:** `feat(admin): add entry preview`

---

## Acceptance criteria

- Unauthenticated access to any `/admin` route redirects to login.
- Anonymous writes still fail at the database level; you have re-demonstrated it.
- All five domains are fully creatable, editable, and deletable, with every modeled field.
- Images are resized and converted client-side before upload; verify the actual uploaded
  file size against the original.
- Deleting an entry removes its storage objects, and abandoned forms leave no orphans.
- Unsaved-changes warning fires on navigation away.
- A published entry appears on the public site immediately; a draft does not appear at all.

---

## Report back

Summarize: the auth flow, your re-run of the anon write tests, the soft-versus-hard delete
decision and how storage cleanup works, the slug-change decision, the measured before/after
file size on image optimization, and how long it took you to enter one complete business by
hand — that number is the real metric for this phase. Then stop and wait.
