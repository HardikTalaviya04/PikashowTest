"use client"

import { useEffect, useRef, useState } from "react"
import type { Game } from "@/lib/types"
import { GameCard } from "./game-card"
import HorizontalAd from "./AdsComponents/HorizontalAd"

interface GameGridProps {
  category: string
}

export function GameGrid({ category }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setGames([])
    setPage(0)
    setHasMore(true)
    console.log("category changed:", category, page);
  }, [category])

  const loadMoreGames = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        category,
      })
      if (category === "all") {
        const res = await fetch(`/api/games?${params}`)
        const data = await res.json()
        console.log("appi check hardi1 ", data);
        setGames((prev) => [...prev, ...data.games])
        setHasMore(data.hasMore)
      }
      else {
        const res = await fetch(`https://raw.githubusercontent.com/TasvirLimbani/Atme/refs/heads/main/category/${category}.json`)
        const data = await res.json()
        console.log("appi check hardi2 ", data);
        setGames(data?.data?.games)
        setHasMore(false)
      }


    } catch (error) {
      console.error("Failed to load games:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!hasMore || isLoading) return

    loadMoreGames()
  }, [category])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1)
      }
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading])

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

        {games.map((game) => (
          <GameCard key={`${game.name}`} game={game} />
        ))}

      </div>

      {hasMore && !isLoading && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreGames}
            disabled={isLoading}
            className="px-6 py-2 mt-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition-colors"
          >
            {"Load More"}
          </button>
        </div>
      )}


      {/* Lazy Load Trigger */}
      <div ref={observerTarget} className="h-10 mt-8 flex items-center justify-center">
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
          </div>
        )}
        {!hasMore && games.length > 0 && <p className="text-slate-500 text-sm">No more games to load</p>}
      </div>
      {/* <HorizontalAd /> */}
    </>
  )
}
