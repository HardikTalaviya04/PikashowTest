import { db } from "@/lib/firebase"
import { verifyAuth } from "@/lib/firebase-admin"
import { doc, updateDoc, increment } from "firebase/firestore"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const uid = (await params).uid

    const isAuthorized = await verifyAuth(request, uid)
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gamesPlayed = 0, timeSpent = 0 } = await request.json()

    const userRef = doc(db, "users", uid)

    await updateDoc(userRef, {
      totalPlayed: increment(gamesPlayed),
      totalTimeSpent: increment(timeSpent),
      lastActivityDate: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
