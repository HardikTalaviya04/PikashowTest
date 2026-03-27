"use client"

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { GameGrid } from "@/components/game-grid"
import { Footer } from "@/components/footer"
import { useSearchParams } from "next/navigation"
import HorizontalAd from "@/components/AdsComponents/HorizontalAd"

export const dynamic = "force-dynamic"

function HomeInner() {
  const searchParams = useSearchParams()
  const categoryFromURL = searchParams.get("category") || "all"
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL)

  useEffect(() => {
    setSelectedCategory(categoryFromURL)
  }, [categoryFromURL])

  return (
    <>
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      {/* <HorizontalAd /> */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Play{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Amazing Games
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Discover thousands of free online games</p>
        </div>
        <GameGrid category={selectedCategory} />
      </main>
    </>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">

      <Header />
      <Suspense fallback={<div className="text-white p-8 text-center">Loading...</div>}>
        <HomeInner />
      </Suspense>
      <Footer />
    </div>
  )
}

