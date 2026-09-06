# ConectaLapa Development Notes

## Phase 4 Notes & Handoff to Phase 5

### Domain Card Components
- In Phase 4, minimum viable versions of domain cards were implemented in `src/components/cards/`:
  - `EventCard`: Displays date badge, event title, category, ticket price badge, venue name, and links to `/eventos/:slug`.
  - `PackageCard`: Displays 16:9 destination visual (with lazy loading and explicit dimensions), departure date, agency name, price tag, and links to `/pacotes/:slug`.
  - `RecentEntryCard`: Displays compact feed item with domain badge (Empresa, Hospedagem, Gastronomia), name, address, and detail link.
- **Phase 5 ownership**: Phase 5 owns the complete card system and full list-page cards, including detailed amenities badges, gallery carousels, status indicators, and full filter interactions.

### Cross-Domain Search (`/busca`)
- Phase 4 built the search entry point on the home page and the route target `/busca` (`SearchPage`), which reads the query string (`?q=...`) and provides domain shortcuts.
- **Phase 5 ownership**: Task 5.8 in `docs/05-LISTING-PAGES.md` will implement the full-text search backend queries across all five domains using the Postgres GIN index, with debounced requests and accent-insensitive matching.
