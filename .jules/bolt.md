## 2026-07-30 - Server-Side Data Filtering

**Learning:** When client-side components download large data lists (like 100 entries per page) just to filter down to a few items (e.g. user favorites), it creates unnecessary network overhead and client CPU usage. Furthermore, when external APIs don't easily support batch filtering across pages, caching the full list in memory on the server and filtering it there before sending it to the client is highly performant.

**Action:** Look for client-side components that fetch paginated lists and manually filter them (e.g., using `Array.prototype.find` or `Array.prototype.filter` against local Maps). Refactor these by adding batch querying parameters (like `ids`) to the backend API route, moving the filtering logic to the server, and ensuring the server efficiently caches the upstream data source to avoid rate-limiting or latency.
## 2026-07-31 - Enable caching for game details

**Learning:** Changing `cache: "no-store"` to `next: { revalidate: 3600 }` enables ISR/caching in Next.js App Router for external fetch requests that rarely change. This leads to a massive improvement on TTFB for static details.

**Action:** Look for `no-store` in API routes or metadata generation where the data isn't highly dynamic and replace it with a suitable revalidation interval.
