import { initializeApp, getApps, getApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project"

const app = getApps().length > 0
  ? getApp()
  : initializeApp({ projectId })

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
