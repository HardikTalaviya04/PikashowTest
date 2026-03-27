// "use client"

// import { useEffect, useRef, useState } from "react"
// import type { Game } from "@/lib/types"
// import { GameCard } from "./game-card"

// interface GameGridProps {
//   category: string
// }

// export function GameGrid({ category }: GameGridProps) {
//   const [games, setGames] = useState<Game[]>([])
//   const [page, setPage] = useState(0)
//   const [isLoading, setIsLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const observerTarget = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     setGames([])
//     setPage(0)
//     setHasMore(true)
//   }, [category])

//   const loadMoreGames = async (pageToLoad) => {
//     if (isLoading) return

//     setIsLoading(true)

//     try {
//       const params = new URLSearchParams({
//         page: pageToLoad.toString(),
//         limit: "20",
//         category,
//       })

//       const res = await fetch(`/api/games?${params}`)
//       const data = await res.json()
//       console.log("API RESPONSE:", data)

//       // ✅ SAFETY FILTER ADDED HERE
//       setGames((prev) => {
//         const newGames = data.games.filter(
//           (newGame) => !prev.some((g) => g.id === newGame.id)
//         )
//         return [...prev, ...newGames]
//       })

//       setHasMore(data.hasMore)

//     } catch (error) {
//       console.error("Failed to load games:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     // if (!hasMore || isLoading) return

//     loadMoreGames(page)
//   }, [page, category])

//   return (
//     <>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

//         {games.map((game) => (
//           <GameCard key={game.id} game={game} />
//         ))}

//         {/* 🔥 Skeleton Loader */}
//         {isLoading &&
//           [...Array(6)].map((_, i) => (
//             <div
//               key={`skeleton-${i}`}
//               className="h-32 bg-slate-800 rounded-lg animate-pulse"
//             />
//           ))}

//       </div>

//       {hasMore && !isLoading && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={() => setPage((prev) => prev + 1)}
//             disabled={isLoading}
//             className="px-6 py-2 mt-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition-colors"
//           >
//             {"Load More"}
//           </button>
//         </div>
//       )}
//     </>
//   )
// }





"use client"

import { useEffect, useState } from "react"
import type { Game } from "@/lib/types"
import { GameCard } from "./game-card"

interface GameGridProps {
  category: string
}

export function GameGrid({ category }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setGames([])
    setPage(0)
    setHasMore(true)
  }, [category])

  const loadMoreGames = async (pageToLoad: number) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        page: pageToLoad.toString(),
        limit: "20",
        category,
      })

      const res = await fetch(`/api/games?${params}`)
      const data = await res.json()

      // ✅ Prevent duplicates
      setGames((prev) => {
        const newGames = data.games.filter(
          (newGame: Game) => !prev.some((g) => g.id === newGame.id)
        )
        return [...prev, ...newGames]
      })

      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Failed to load games:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMoreGames(page)
  }, [page, category])

  return (
    <>
      {/* ✅ GAME GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* ✅ LOAD MORE BUTTON */}
      {hasMore && !isLoading &&(
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-bold text-lg disabled:bg-gray-400"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* ✅ BOTTOM LOADER + END MESSAGE */}
      <div className="h-10 mt-6 flex items-center justify-center">
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
          </div>
        )}

        {!hasMore && games.length > 0 && !isLoading && (
          <p className="text-slate-500 text-sm">
            No more games to load
          </p>
        )}
      </div>
    </>
  )
}