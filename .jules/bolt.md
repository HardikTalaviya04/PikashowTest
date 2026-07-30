## 2025-02-28 - React.memo for Infinite Scroll Grid
**Learning:** In append-only lists (like the infinite scroll GameGrid here), adding new items causes the parent to re-render, which by default re-renders all previously loaded child components (GameCards). Since we load 20 games at a time, this causes an exponential number of unnecessary re-renders.
**Action:** Always wrap list item components in `React.memo()` when they are part of a grid or list that appends items via 'Load More' or infinite scroll, as their props (the individual item data) rarely change after the initial render. Furthermore, always ensure images below the fold use `loading="lazy"` to defer image loads.

## 2026-07-30 - Incremental Static Regeneration for Static External APIs
**Learning:** External API routes that return static or rarely changing data (like game details) shouldn't use `cache: "no-store"` as it creates a bottleneck on every request. Next.js App Router cache can intercept these requests natively.
**Action:** Always favor Incremental Static Regeneration (ISR) using `next: { revalidate: [seconds] }` in `fetch()` options over `cache: "no-store"` when the external data updates infrequently, to massively reduce response times (e.g. from 60ms to 17ms) and avoid hitting upstream API limits.
