"use client"

import { useState, useEffect } from "react"
import { Play, X, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GamePlayerProps {
  gameName: string
  gameSlug: string
  gameUrl: string
  gameImage: string
}

export function GamePlayer({ gameName, gameSlug, gameUrl, gameImage }: GamePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Clean game URL
  // const gameEmbedUrl = (gameUrl || "")
  //   .trim()
  //   .replace(/\r?\n|\r|\t/g, "")

  const gameEmbedUrl = gameSlug
    ? `https://www.atmhtml5games.com/splash/${gameSlug}/`
    : ""

  // Handle true fullscreen toggle
  const toggleFullscreen = () => {
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement
    if (!iframe) return

    if (!document.fullscreenElement) {
      iframe.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  // When exiting fullscreen manually (Esc), update state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  if (!gameEmbedUrl || !gameEmbedUrl.startsWith("http")) {
    return (
      <div className="relative w-full bg-slate-900 rounded-lg overflow-hidden border border-purple-500/20 aspect-video flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Game script not available</p>
          <p className="text-sm text-slate-500">This game will be available soon!</p>
          {gameUrl && <p className="text-xs text-slate-600 mt-4 break-all">Received: {gameUrl.substring(0, 100)}...</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full bg-slate-900 rounded-lg overflow-hidden border border-purple-500/20 transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : "aspect-video"
        }`}
    >
      {!isPlaying ? (
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <img
            src={`https://www.atmhtml5games.com${gameImage}`}
            alt={gameName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <button
            onClick={() => {
              console.log("[v0] Play button clicked, loading iframe with URL:", gameEmbedUrl)
              setIsPlaying(true)
            }}
            className="absolute flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Game</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col">
          <iframe
            id="game-iframe"
            key={gameEmbedUrl}
            src={gameEmbedUrl}
            title={gameName}
            allowFullScreen
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; camera; microphone; accelerometer; gyroscope"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation"
            onLoad={() => console.log("[v0] Game iframe loaded successfully:", gameEmbedUrl)}
            onError={() => console.error("[v0] Game iframe failed to load:", gameEmbedUrl)}
          />

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {/* Fullscreen toggle */}
            <Button
              onClick={toggleFullscreen}
              className="bg-slate-900/80 hover:bg-slate-800 p-2 rounded-lg"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>

            {/* Close button */}
            <Button
              onClick={() => setIsPlaying(false)}
              className="bg-slate-900/80 hover:bg-slate-800 p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
