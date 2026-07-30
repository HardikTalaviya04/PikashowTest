## 2026-07-28 - Removed Hardcoded Firebase Secrets
**Vulnerability:** The `lib/firebase.ts` file had a hardcoded set of Firebase credentials including the `apiKey`.
**Learning:** Hardcoding credentials exposes sensitive project credentials publicly which poses a massive security risk. Next.js supports `NEXT_PUBLIC_*` environment variables to inject them securely at build time without persisting them in code.
**Prevention:** Always use environment variables for sensitive settings like API keys and ensure they are populated dynamically during the CI/CD pipeline or deployment process.

## 2026-07-29 - Missing Authentication in API Endpoints
**Vulnerability:** The `app/api/user/[uid]/coins/route.ts` endpoint did not verify the user's identity before processing coin update requests.
**Learning:** Any endpoint that mutates user data (like adding coins) must verify the authorization of the caller. In Firebase environments, this is typically done by sending the user's ID token in the `Authorization` header and verifying it on the backend using `firebase-admin`.
**Prevention:** Always require and validate authentication tokens (e.g., Bearer tokens) in API endpoints before making any changes to user-specific data or performing privileged actions.
