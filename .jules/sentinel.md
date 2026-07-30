## 2026-07-28 - Removed Hardcoded Firebase Secrets
**Vulnerability:** The `lib/firebase.ts` file had a hardcoded set of Firebase credentials including the `apiKey`.
**Learning:** Hardcoding credentials exposes sensitive project credentials publicly which poses a massive security risk. Next.js supports `NEXT_PUBLIC_*` environment variables to inject them securely at build time without persisting them in code.
**Prevention:** Always use environment variables for sensitive settings like API keys and ensure they are populated dynamically during the CI/CD pipeline or deployment process.

<<<<<<< Updated upstream
## 2026-07-28 - Missing Authentication in User Stats API
**Vulnerability:** The `app/api/user/[uid]/stats/route.ts` API route lacked authentication, meaning anyone could send requests to increment arbitrary users' stats and potentially abuse the system.
**Learning:** API routes that modify user-specific state must always verify the identity of the requester to ensure they have the authorization to perform such modifications. Trusting user-supplied UIDs without verifying them against an authenticated session can lead to unauthenticated unauthorized changes.
**Prevention:** Use Firebase ID tokens provided by the client and verify them in the backend API using the `firebase-admin` SDK. Make sure the authenticated user's UID matches the targeted UID before performing updates.
=======
## 2026-07-29 - Missing Authentication in API Endpoints
**Vulnerability:** The `app/api/user/[uid]/coins/route.ts` endpoint did not verify the user's identity before processing coin update requests.
**Learning:** Any endpoint that mutates user data (like adding coins) must verify the authorization of the caller. In Firebase environments, this is typically done by sending the user's ID token in the `Authorization` header and verifying it on the backend using `firebase-admin`.
**Prevention:** Always require and validate authentication tokens (e.g., Bearer tokens) in API endpoints before making any changes to user-specific data or performing privileged actions.
>>>>>>> Stashed changes
