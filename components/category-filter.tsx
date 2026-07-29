"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Category } from "@/lib/types"
import { Gamepad2, Zap, Heart, Skull, Dices, Sword, Music, Palette } from "lucide-react"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

// Map category slugs to icons
const categoryIcons: Record<string, React.ReactNode> = {
  action: <Sword className="w-5 h-5" />,
  puzzle: <Dices className="w-5 h-5" />,
  adventure: <Heart className="w-5 h-5" />,
  racing: <Zap className="w-5 h-5" />,
  sports: <Gamepad2 className="w-5 h-5" />,
  horror: <Skull className="w-5 h-5" />,
  arcade: <Music className="w-5 h-5" />,
  casual: <Palette className="w-5 h-5" />,
}

export function CategoryFilter({ onCategoryChange, selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.slice(0, 8))
      } catch (error) {
        // Ignore error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="sticky top-20 z-40 bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 border-b border-purple-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            All
          </button>

          {categories.map((category) => {
            const icon = categoryIcons[category.slug] || <Gamepad2 className="w-5 h-5" />
            return (
              <button
                key={category._id}
                onClick={() => onCategoryChange(category.slug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category.slug
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {/* {icon} */}
                <img
  src={`https://images.atmegame.com/cat/${category.slug}.png`}
  alt={category.name}
  className="w-6 h-6 object-contain"
/>
                <span className="capitalize text-sm font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
