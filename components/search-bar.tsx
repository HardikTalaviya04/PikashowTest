"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import type { Game } from "@/lib/types"
import Link from "next/link"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Game[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(query)}&limit=10`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("[v0] Search failed:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:bg-slate-800 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-purple-500/30 rounded-lg shadow-2xl shadow-purple-900/50 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-400 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((game) => (
                <Link key={game.slug} href={`/game/${game.slug}`}>
                  <div className="px-4 py-2 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-3">
                    <img
                      src={`https://slides.atmegame.com/slide/${game.image}_slide.jpg`}
                      alt={game.name}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 truncate text-sm font-medium">{game.name}</p>
                      <p className="text-slate-500 text-xs">{(game.totalPlayed / 1000).toFixed(0)}K plays</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-sm">No games found</div>
          )}
        </div>
      )}
    </div>
  )
}
