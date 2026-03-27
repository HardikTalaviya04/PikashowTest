"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Head from "next/head"
import { Header } from "@/components/header"
import { GameStats } from "@/components/game-stats"
import { GamePlayer } from "@/components/game-player"
import { GameCard } from "@/components/game-card"
import { Footer } from "@/components/footer"
import type { GameDetails } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Share2, Heart, BookOpen } from "lucide-react"
import HorizontalAd from "@/components/AdsComponents/HorizontalAd"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [game, setGame] = useState<GameDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [relatedGames, setRelatedGames] = useState<any[]>([])
  const [showInstructions, setShowInstructions] = useState(false)
  const [mTitle, setMTitle] = useState('')
  const [mDesc, setMDesc] = useState('')

  const id = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug

  useEffect(() => {
    if (!id) return

    async function fetchGame() {
      try {
        const res = await fetch(`/api/games/${id}`)
        const data = await res.json()

        const mdesc = data.metaDesc?.replaceAll("atmegame.com", "pikashowgames.com");
        const mtitle = data.metaTitle?.replaceAll("Atmegame.com", "pikashowgames.com");
        setMTitle(mtitle);
        setMDesc(mdesc);

        setGame(data)

        // Track recently played
        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            recentlyPlayed: arrayUnion({
              gameSlug: data.slug,
              gameName: data.name,
              playedAt: Timestamp.now(),
              timeSpent: 0,
            }),
          })
        }

        // Fetch related games
        const relatedRes = await fetch(`/api/games?limit=10&page=0`)
        const relatedData = await relatedRes.json()
        setRelatedGames(relatedData.games.filter((g: any) => g.id !== Number(id)).slice(0, 5))
      } catch (error) {
        console.error("[v0] Failed to fetch game:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGame()
  }, [id, user])

  const handleAddToFavorites = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        favoriteGames: arrayUnion(game?.slug),
      })
      setIsFavorited(!isFavorited)
    } catch (error) {
      console.error("Failed to add favorite:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-800 rounded-lg w-1/2" />
            <div className="aspect-video bg-slate-800 rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
          <p className="text-white text-center">Game not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = game?.image
    ? `https://www.atmhtml5games.com${game.image}`
    : ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Header />

      <Head>
        <title>{game ? `${game.name} | PikaShow Games` : "PikaShow Games"}</title>
        <meta
          name="description"
          content={mDesc}
        />
        <meta name="keyword" content={game.metaKeyword} />
        <meta property="og:title" content={mTitle} />
        <meta
          property="og:description"
          content={mDesc}
        />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:keyword" content={game.metaKeyword || "PikaShowGames, free online games, play games online, browser games, HTML5 games, no download games"} />
      </Head>


      <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Game Header */}
        {/* <HorizontalAd /> */}

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{game.name}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleAddToFavorites}
              className={`gap-2 ${isFavorited ? "bg-pink-600 hover:bg-pink-700" : "bg-slate-800 hover:bg-slate-700"}`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Button>
            <Button className="gap-2 bg-slate-800 hover:bg-slate-700">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
            {game.instructions && (
              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                className="gap-2 bg-slate-800 hover:bg-slate-700"
              >
                <BookOpen className="w-5 h-5" />
                {showInstructions ? "Hide" : "Show"} Instructions
              </Button>
            )}
          </div>
        </div>

        {game.instructions && showInstructions && (
          <div className="mb-8 p-6 bg-blue-950/30 rounded-lg border border-blue-500/20">
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              How to Play
            </h3>
            <p className="text-slate-300 leading-relaxed">{game.instructions}</p>
          </div>
        )}

        {/* Game Player - Pass both script and url properties */}
        <div className="mb-12">
          <GamePlayer gameName={game.name} gameSlug={game.slug} gameUrl={game.script || game.url || ""} gameImage={game.image} />
        </div>

        {/* Game Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Game Statistics</h2>
          <GameStats game={game} />
        </div>

        <div className="mb-12 p-6 bg-slate-800/50 rounded-lg border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
          {/* <p className="text-slate-300 leading-relaxed mb-4">
            {game.description ||
              `Experience ${game.name}, an exciting game with ${game.totalPlayed.toLocaleString()} total plays and a ${game.manualRating}/5 rating. With ${game.likes.toLocaleString()} likes, this game is loved by players worldwide.`}
          </p> */}
          <p className="text-slate-300 leading-relaxed mb-4">
            {game.description ||
              `Experience ${game.name}, played by ${game.totalPlayed.toLocaleString()} users.`}
          </p>
          {game.category && (
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>
                <strong>Category:</strong> {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
              </span>
              {game.releaseDate && (
                <span>
                  <strong>Released:</strong> {game.releaseDate}
                </span>
              )}
            </div>
          )}
        </div>
        {/* <HorizontalAd /> */}

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Similar Games</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
