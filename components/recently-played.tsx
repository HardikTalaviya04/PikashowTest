"use client"

import type { RecentlyPlayedGame } from "@/lib/types"
import { GameCard } from "./game-card"
import type { Game } from "@/lib/types"
import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface RecentlyPlayedProps {
  games: RecentlyPlayedGame[]
}

export function RecentlyPlayed({ games }: RecentlyPlayedProps) {
  const [gameDetails, setGameDetails] = useState<Game[]>([])

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        const gameSlugs = Array.from(new Set(games.map(g => g.gameSlug)))
        const idsString = gameSlugs.join(",")
        const res = await fetch(`/api/games?ids=${idsString}`)
        const data = await res.json()

        const gameMap = new Map<string, Game>()
        if (data.games) {
          data.games.forEach((game: Game) => {
            gameMap.set(game.slug, game)
          })
        }

        const details = games.map((rp) => gameMap.get(rp.gameSlug)).filter(Boolean) as Game[]

        setGameDetails(details)
      } catch (error) {
        console.error("Failed to fetch game details:", error)
      }
    }

    if (games.length > 0) {
      fetchGameDetails()
    }
  }, [games])

  if (games.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-8 text-center">
        <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No recently played games yet</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Recently Played
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gameDetails.slice(0, 10).map((game, index) => (
          <GameCard key={`${game.slug}-${index}`} game={game} />
        ))}
      </div>
    </div>
  )
}
