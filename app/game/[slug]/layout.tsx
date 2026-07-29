import { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

const GAME_DETAILS_API = "http://pikashowgames.soon.it/api/v0/get.php"

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const id = slug

  try {
    const res = await fetch(`${GAME_DETAILS_API}?id=${id}`, {
      cache: "no-store",
    })

    const data = await res.json()

    if (!data || !data.data) {
      return {
        title: "Game Not Found | PikaShow Games",
      }
    }

    const game = data.data

    const mTitle = (game.title?.replaceAll("Atmegame.com", "pikashowgames.com") || "") + " | PikaShow Games"
    const mDesc = (game.description?.slice(0, 150) || "").replaceAll("atmegame.com", "pikashowgames.com")

    const imageUrl = game.thumb_small
      ? `https://www.atmhtml5games.com${game.thumb_small}`
      : ""

    const keywordsStr = game.tags || "PikaShowGames, free online games, play games online, browser games, HTML5 games, no download games"
    const keywords = keywordsStr.split(",").map((k: string) => k.trim())

    return {
      title: mTitle,
      description: mDesc,
      keywords: keywords,
      openGraph: {
        title: mTitle,
        description: mDesc,
        type: "website",
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata for game:", error)
    return {
      title: "Game | PikaShow Games",
    }
  }
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
