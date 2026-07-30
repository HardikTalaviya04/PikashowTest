"use client"

import { useAuth } from "./use-auth"

export function useCoins() {
  const { user } = useAuth()

  const addCoins = async (amount: number, reason: string) => {
    if (!user) return false

    try {
      const idToken = await user.getIdToken()
      const res = await fetch(`/api/user/${user.uid}/coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ amount, reason }),
      })

      if (!res.ok) throw new Error("Failed to add coins")
      return await res.json()
    } catch (error) {
      console.error("Failed to add coins:", error)
      return false
    }
  }

  const updateStats = async (gamesPlayed: number, timeSpent: number) => {
    if (!user) return false

    try {
      const idToken = await user.getIdToken()
      const res = await fetch(`/api/user/${user.uid}/stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ gamesPlayed, timeSpent }),
      })

      if (!res.ok) throw new Error("Failed to update stats")
      return await res.json()
    } catch (error) {
      console.error("Failed to update stats:", error)
      return false
    }
  }

  return { addCoins, updateStats }
}
