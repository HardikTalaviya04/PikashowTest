"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { GameCard } from "@/components/game-card"
import { Footer } from "@/components/footer"
import type { Game } from "@/lib/types"
import { TrendingUp, Flame } from "lucide-react"
import HorizontalAd from "@/components/AdsComponents/HorizontalAd"

export default function TrendingPage() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    async function fetchTrendingGames() {
      try {
        const res = await fetch(`/api/games?limit=50&page=0&category=${selectedCategory}`)
        const data = await res.json()
        // Sort by likes and totalPlayed to get trending games
        const trending = data.games.sort((a: Game, b: Game) => b.likes + b.totalPlayed - (a.likes + a.totalPlayed))
        setGames(trending.slice(0, 50))
      } catch (error) {
        console.log("[v0] Failed to fetch trending games:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingGames()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Header />
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Trending Games</h1>
            <p className="text-slate-400">Most played and loved games right now</p>
          </div>
        </div>
        {/* <HorizontalAd /> */}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-video bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game, index) => (
              <div key={`${game.slug}-${index}`} className="relative">
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />#{index + 1}
                </div>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </main>
      {/* <HorizontalAd /> */}

      <Footer />
    </div>
  )
}
