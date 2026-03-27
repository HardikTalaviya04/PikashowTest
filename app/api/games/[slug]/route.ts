const GAME_DETAILS_API = "http://pikashowgames.soon.it/api/v0/get.php"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const id = slug // slug is actually id now

    const res = await fetch(`${GAME_DETAILS_API}?id=${id}`, {
      cache: "no-store",
    })

    const data = await res.json()

    if (!data || !data.data) {
      return Response.json({ error: "Game not found" }, { status: 404 })
    }

    const game = data.data

    // ✅ FORMAT FOR FRONTEND
    const formattedGame = {
      id: game.id,
      name: game.title,
      slug: game.slug,
      image: game.thumb_small,

      description: game.description,
      instructions: game.instructions,

      likes: game.upvote,
      totalPlayed: game.views,
      manualRating: 5,

      category: game.category,
      releaseDate: game.createdDate,

      // not needed anymore but keeping
      url: game.url,
      script: game.url,

      metaTitle: game.title,
      metaDesc: game.description?.slice(0, 150),
      metaKeyword: game.tags,
    }

    return Response.json(formattedGame)
  } catch (error) {
    console.error("Game details error:", error)
    return Response.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    )
  }
}