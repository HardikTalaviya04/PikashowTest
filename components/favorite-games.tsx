"use client"

import { useEffect, useState } from "react"
import { GameCard } from "./game-card"
import type { Game } from "@/lib/types"
import { Heart } from "lucide-react"

interface FavoriteGamesProps {
  favoriteIds: string[]
}

export function FavoriteGames({ favoriteIds }: FavoriteGamesProps) {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    async function fetchFavoriteGames() {
      try {
        const idsString = favoriteIds.join(",")
        const res = await fetch(`/api/games?ids=${idsString}`)
        const data = await res.json()

        const gameMap = new Map<string, Game>()
        if (data.games) {
          data.games.forEach((game: Game) => {
            gameMap.set(game.slug, game)
          })
        }

        const favorites = favoriteIds.map((slug) => gameMap.get(slug)).filter(Boolean) as Game[]

        setGames(favorites)
      } catch (error) {
        console.error("Failed to fetch favorite games:", error)
      }
    }

    if (favoriteIds.length > 0) {
      fetchFavoriteGames()
    }
  }, [favoriteIds])

  if (favoriteIds.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-8 text-center">
        <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No favorite games yet</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-500" />
        Favorite Games
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  )
}
