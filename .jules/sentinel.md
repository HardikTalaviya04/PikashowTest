## 2026-07-28 - Removed Hardcoded Firebase Secrets
**Vulnerability:** The `lib/firebase.ts` file had a hardcoded set of Firebase credentials including the `apiKey`.
**Learning:** Hardcoding credentials exposes sensitive project credentials publicly which poses a massive security risk. Next.js supports `NEXT_PUBLIC_*` environment variables to inject them securely at build time without persisting them in code.
**Prevention:** Always use environment variables for sensitive settings like API keys and ensure they are populated dynamically during the CI/CD pipeline or deployment process.
