## 2026-07-28 - Removed Hardcoded Firebase Secrets
**Vulnerability:** The `lib/firebase.ts` file had a hardcoded set of Firebase credentials including the `apiKey`.
**Learning:** Hardcoding credentials exposes sensitive project credentials publicly which poses a massive security risk. Next.js supports `NEXT_PUBLIC_*` environment variables to inject them securely at build time without persisting them in code.
**Prevention:** Always use environment variables for sensitive settings like API keys and ensure they are populated dynamically during the CI/CD pipeline or deployment process.

## 2026-07-30 - Fixed Unauthorized API Endpoint Access
**Vulnerability:** The `/api/user/[uid]/coins` endpoint was missing authentication, allowing anyone to modify any user's coin balance by sending a POST request with the user's ID.
**Learning:** Missing authentication and authorization checks on critical endpoints can lead to significant data manipulation and game economy abuse. We should use Firebase Admin SDK to verify the authorization token from the request header and ensure the authenticated user matches the `uid` parameter.
**Prevention:** Always implement robust authentication and authorization checks on all API endpoints that modify user data or handle sensitive operations. Verify user identity using secure tokens (e.g., Bearer tokens with Firebase Admin SDK) and ensure users can only modify their own data.
