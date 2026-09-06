# Phase 8 — Public Submissions & Moderation

**Prerequisite:** Phase 7 complete.
**Branch:** `feat/phase-8-submissions`
**Goal:** let business owners request a listing through a public form, and let the
administrator review, approve, and convert those requests into published entries.

---

## The two sides

**The submitter** is a local business owner on a phone who has never used the site before
and has limited patience for forms. If the form asks for twenty fields, they abandon it.
The goal is to collect *enough to make contact and start a conversation* — not a complete
listing. The admin will fill in the rest, and they were always going to.

**The administrator** needs to triage quickly, separate real requests from spam, and turn
a good one into a published entry without retyping everything.

The tension between "collect enough" and "keep it short" is the central design decision of
this phase. Resolve it explicitly and say where you drew the line.

---

## Tasks

### 8.1 — Public submission form (`/solicitar`)

**Required fields — keep this list short:**
- Contact name
- WhatsApp
- What kind of listing (the five domains)
- Business or event name
- A free-text field describing what they want listed

**Optional:** address, Instagram, email, website.

Consider whether the form should adapt to the selected domain — asking an event submitter
for a date is worth one extra field, and asking a restaurant for one is noise. If you make
it adaptive, keep it to two or three domain-specific fields at most.

Requirements:

- One column, large touch targets, correct mobile keyboards via `inputMode` and `type`.
- Real-time validation on blur, not on every keystroke, and never blocking submission until
  the user has actually finished a field.
- Phone masking for the Brazilian format, while storing a normalized value.
- Errors in plain pt-BR that say what to do, not what went wrong internally.
- The submit button shows a loading state and cannot be double-fired.
- A clear success state explaining what happens next and roughly when — "vamos entrar em
  contato pelo WhatsApp" sets a real expectation. Do not leave them wondering if it worked.
- Draft persistence in local storage so a dropped connection does not erase their input.

**Decide whether to accept image uploads.** Anonymous uploads to a public bucket are an
abuse vector and a moderation burden. Collecting the contact and requesting images over
WhatsApp afterward is defensible and simpler. If you do allow uploads, they go to a
quarantined bucket that is not publicly readable, with hard type and size limits. State
your decision and reasoning.

**Commit:** `feat(submissions): add public submission form`

---

### 8.2 — Spam protection

This is an unauthenticated public write endpoint. It will be found by bots. Phase 3 added
basic rate limiting; make it real here.

Implement in layers:

1. **Honeypot field** — hidden from users, ignored by real submitters, filled by naive
   bots. Nearly free and catches a surprising share.
2. **Timing check** — a form completed in under two seconds was not completed by a human.
3. **Rate limiting** — per IP and per phone number, over a sensible window.
4. **Content heuristics** — reject submissions containing URLs in fields that should not
   have them, or obvious spam markers.

Deliberately **do not** add a CAPTCHA in this phase. It adds friction for exactly the users
we most want to convert, requires a third-party script, and creates accessibility problems.
Note it as an escalation if the layered approach proves insufficient in production.

Rejected submissions should fail quietly from the bot's perspective — do not tell a spammer
which layer caught them.

**Commit:** `feat(submissions): add layered spam protection`

---

### 8.3 — Moderation queue (`/admin/solicitacoes`)

- List of submissions with status filter, defaulting to pending.
- Sorted oldest-first so nothing sits forgotten at the bottom.
- Each row: name, domain, contact, submission date, status.
- Detail view showing everything submitted, with the WhatsApp number as a working `wa.me`
  link so the admin can start the conversation in one tap.
- Actions: approve, reject with an optional note, delete.
- Bulk-reject for spam that got through.

**Commit:** `feat(admin): add submission moderation queue`

---

### 8.4 — Approve-to-entry conversion

The feature that makes this phase worth building. Approving a submission opens the
corresponding admin create form **prefilled** with everything the submitter provided,
mapped into the real fields.

- The submission is linked to the created entry so the origin is traceable.
- The submission moves to approved only when the entry is actually saved — not when the
  form opens, or an abandoned form leaves a lie in the queue.
- The admin can edit everything before saving; nothing is auto-published.

**Commit:** `feat(admin): add submission to entry conversion`

---

### 8.5 — Notifications

Decide what is actually needed and justify cutting the rest.

- **Submitter confirmation** — genuinely useful, but requires email infrastructure for an
  optional field most submitters will skip. Weigh it against the WhatsApp-first reality of
  this audience.
- **Admin notification of a new submission** — the pending badge on the dashboard may be
  sufficient if the admin visits daily. An email or WhatsApp ping is better if they do not.

Build the smaller useful thing. If you build email, use a Supabase edge function and keep
credentials server-side. Do not build a notification preferences system.

**Commit:** `feat(submissions): add admin notification`

---

### 8.6 — Privacy

`submissions` contains personal contact data belonging to people who are not users of the
site.

- Confirm anonymous `select` is still denied. Re-test with the anon key and report the
  result — this is the leak that would matter most.
- Add a short privacy note on the form stating what the data is used for and that it is not
  published. One sentence, plain language, not a wall of legal text.
- Define a retention policy for rejected submissions and implement or document the cleanup.

**Commit:** `feat(submissions): add privacy notice and retention policy`

---

## Acceptance criteria

- The form is completable on a phone in under a minute.
- Draft persistence survives a refresh mid-form.
- All four spam layers are active, and you have verified each one triggers.
- Anonymous users cannot read the submissions table; demonstrated, not assumed.
- Approving prefills the admin form correctly for every domain.
- Status only changes when the resulting entry is actually saved.
- The success state tells the submitter what happens next.

---

## Report back

Summarize: your required-versus-optional field decision and where you drew the line, the
image upload decision, each spam layer with evidence it fires, your notification decision
and what you deliberately did not build, and the anon read test output for `submissions`.
Then stop and wait.
