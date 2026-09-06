# ConectaLapa

Guia comercial e turístico de Bom Jesus da Lapa (BA): empresas, eventos, pacotes de viagem, hospedagem e gastronomia, com um painel administrativo para o proprietário do site gerenciar todo o conteúdo.

For the non-technical site owner's day-to-day guide (in Portuguese), see [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7 (data router / `createBrowserRouter`)
- TanStack Query v5
- react-hook-form + zod
- Supabase (Postgres, Auth, Storage, Row-Level Security)

## Local setup

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

The Supabase URL and anon key come from the project's Supabase dashboard (Settings → API). The anon key is safe to expose client-side — all write access is enforced by Postgres Row-Level Security policies, not by keeping this key secret.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, build, then run `postbuild` automatically (see below) |
| `npm run preview` | Serve the production build locally, for a final check before deploying |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | `tsc` with no emit |
| `npm run db:types` | Regenerate `src/types/database.ts` from the live Supabase schema |

`postbuild` runs automatically after `build` (it's an npm lifecycle hook, not something to invoke separately). It reads `.env` for the Supabase credentials, then:
1. Generates `dist/sitemap.xml` from every published entry.
2. Prerenders a real `index.html` (with title, meta description, canonical link, Open Graph/Twitter tags, and JSON-LD) into `dist/<section>/<slug>/` for every published business, event, package, lodging, and dining entry — needed because this is a client-rendered SPA on static hosting with no serverless functions, so crawlers that don't execute JavaScript (WhatsApp, Facebook, Google's initial crawl) would otherwise see only the generic app shell.

**Known limitation:** the sitemap and prerendered pages are only as fresh as the last deploy. Publishing a new entry in the admin panel does not appear in search results or link previews until the site is rebuilt and redeployed. See [docs/09-POLISH-LAUNCH.md](docs/09-POLISH-LAUNCH.md) for the reasoning and what a proper fix (an edge function) would look like.

## Database

Migrations live in `supabase/migrations/`. Row-Level Security is enforced on every table: public reads are limited to `status = 'published'` rows, and all writes require `is_admin()` — a Postgres function backed by a dedicated `admins` table (not JWT claims), checked in `supabase/`.

After changing the schema, regenerate types with `npm run db:types` and commit the result.

## Deploying to Hostinger (shared/business plan)

This plan is static Apache hosting — no Node server, no serverless functions. The build output is a set of static files.

1. `npm run build` locally (this also runs `postbuild` — see above). Confirm `.env` has the **production** Supabase project's URL and anon key before building: those values are baked into the JS bundle at build time, not read at runtime, so building against the wrong project silently ships the wrong backend.
2. Upload the entire contents of `dist/` (including the hidden `.htaccess` file — make sure your FTP client or file manager shows hidden files) to `public_html/` (or your domain's document root) via Hostinger's File Manager or an SFTP client.
3. In hPanel, point the domain (`conectalapa.com.br`) at that document root and enable a free SSL certificate (Hostinger provisions Let's Encrypt automatically).
4. Verify:
   - `https://conectalapa.com.br/` loads the app.
   - A deep link like `https://conectalapa.com.br/empresas` works on a **hard refresh**, not just via in-app navigation — this confirms the `.htaccess` SPA-fallback rewrite is active.
   - `https://conectalapa.com.br/sitemap.xml` returns real content.
   - `https://conectalapa.com.br/robots.txt` returns real content.
   - Paste a published entry's URL into WhatsApp or Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) and confirm a real title/image/description appear (not the generic "ConectaLapa" shell) — this is the actual proof the prerendering step worked, since a browser-based check alone can't tell you what a non-JS crawler sees.
5. Redeploy (repeat steps 1–2) whenever content changes and you want it reflected in the sitemap and in link previews for newly published entries.

`.htaccess` (in `public/`, copied into every build) handles the SPA fallback rewrite and sets baseline security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`). HSTS is deliberately not set there — enable "Force HTTPS" in hPanel's SSL settings instead, so a certificate problem can't lock out visitors via a cached header with no easy way to undo it.

## Project structure

```
src/
  app/            Router, layouts, error boundaries, providers
  components/     Shared UI (cards, layout, admin, detail, seo)
  features/       Per-domain data hooks (queries/mutations) — businesses, events, packages, lodging, dining, submissions
  pages/          Route-level components, one folder per route
  lib/            Cross-cutting utilities (Supabase client, formatting, image URLs, WhatsApp/maps link builders)
  types/          Domain types + generated Supabase types
scripts/
  postbuild.mjs   Sitemap + prerendering (see above)
supabase/
  migrations/     SQL migrations, applied in order
docs/
  0X-*.md         Phase-by-phase implementation specs this app was built from
  ADMIN-GUIDE.md  Portuguese guide for the non-technical site owner
```
