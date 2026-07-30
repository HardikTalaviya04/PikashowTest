## 2025-02-28 - React.memo for Infinite Scroll Grid
**Learning:** In append-only lists (like the infinite scroll GameGrid here), adding new items causes the parent to re-render, which by default re-renders all previously loaded child components (GameCards). Since we load 20 games at a time, this causes an exponential number of unnecessary re-renders.
**Action:** Always wrap list item components in `React.memo()` when they are part of a grid or list that appends items via 'Load More' or infinite scroll, as their props (the individual item data) rarely change after the initial render. Furthermore, always ensure images below the fold use `loading="lazy"` to defer image loads.

## 2025-03-01 - Global Cache in Next.js Serverless Routes
**Learning:** In Next.js route handlers (`app/api/...`), module-level variables persist across invocations within the same running process. Fetching full datasets on every request can be extremely slow and rate-limited.
**Action:** For static or infrequently changing external APIs, implement lightweight in-memory caching using module-level variables with a TTL (e.g., `let cachedData = null; let lastFetch = 0; const TTL = 5 * 60 * 1000;`) to drastically reduce I/O and speed up responses.
