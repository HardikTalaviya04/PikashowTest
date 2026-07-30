## 2026-07-28 - Removed Hardcoded Firebase Secrets
**Vulnerability:** The `lib/firebase.ts` file had a hardcoded set of Firebase credentials including the `apiKey`.
**Learning:** Hardcoding credentials exposes sensitive project credentials publicly which poses a massive security risk. Next.js supports `NEXT_PUBLIC_*` environment variables to inject them securely at build time without persisting them in code.
**Prevention:** Always use environment variables for sensitive settings like API keys and ensure they are populated dynamically during the CI/CD pipeline or deployment process.

## 2026-07-29 - Secured Unauthenticated API Endpoints
**Vulnerability:** Several backend API endpoints handling sensitive user data and account actions (like `/api/user/[uid]`, `/api/user/[uid]/coins`, `/api/user/[uid]/stats`) were completely unauthenticated. Attackers could perform an Insecure Direct Object Reference (IDOR) by specifying arbitrary user IDs in the request URL to modify someone else's account.
**Learning:** Next.js Serverless Functions (`route.ts`) do not automatically inherit client-side Firebase Auth state unless specifically handled by middleware/cookies or manual verification. Passing `firebase/auth` ID tokens in the HTTP Authorization header and verifying them using `firebase-admin/auth` is critical for authenticated backend endpoints.
**Prevention:** Always require and verify an ID token using `admin.auth().verifyIdToken()` in API routes that alter protected user data, and always check that the decoded `uid` matches the `uid` requested in the route parameters.
