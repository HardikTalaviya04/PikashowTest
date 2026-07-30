import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const uid = (await params).uid
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userSnap.data())
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const uid = (await params).uid
    const body = await request.json()

    const userRef = doc(db, "users", uid)
    await setDoc(userRef, body, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}
