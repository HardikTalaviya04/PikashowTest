import { db } from "@/lib/firebase"
import { adminAuth } from "@/lib/firebase-admin"
import { doc, updateDoc, increment, getDoc } from "firebase/firestore"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const uid = (await params).uid

    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (decodedToken.uid !== uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { amount, reason } = await request.json()

    if (!amount || !reason) {
      return NextResponse.json({ error: "Amount and reason required" }, { status: 400 })
    }

    const userRef = doc(db, "users", uid)

    // Add transaction record
    const userSnap = await getDoc(userRef)
    const currentCoins = userSnap.data()?.coins || 0

    await updateDoc(userRef, {
      coins: increment(amount),
      lastCoinUpdate: new Date(),
    })

    return NextResponse.json({
      success: true,
      newBalance: currentCoins + amount,
      transaction: { amount, reason, timestamp: new Date() },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coins" }, { status: 500 })
  }
}
