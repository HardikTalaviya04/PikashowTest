import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { type NextRequest } from "next/server"

if (!getApps().length) {
  try {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

export async function verifyAuth(request: NextRequest, uid: string) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return false
  }
  const idToken = authHeader.split("Bearer ")[1]
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return decodedToken.uid === uid
  } catch (error) {
    return false
  }
}
