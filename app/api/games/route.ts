const GAMES_API = "http://pikashowgames.soon.it/api/v0/list.php"
const ALL_GAMES_API = "https://raw.githubusercontent.com/TasvirLimbani/Atme/refs/heads/main/game.json"

let cachedGames: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "0")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")

    // Check if the parameter is provided (even if empty, like ids=)
    if (searchParams.has("ids")) {
      const idsParam = searchParams.get("ids") || ""
      const idList = idsParam.split(",").filter(Boolean)

      const now = Date.now();
      if (!cachedGames || now - lastFetchTime > CACHE_TTL) {
        const gamesRes = await fetch(ALL_GAMES_API)
        const gamesData = await gamesRes.json()
        cachedGames = gamesData.games || []
        lastFetchTime = now;
      }

      const allGames = cachedGames || []

      // Filter by the provided IDs (which are slugs)
      let games = allGames.filter((game: any) => idList.includes(game.slug))

      // ✅ OPTIONAL: NORMALIZE DATA to match frontend Game type
      // Using slug as id if numeric id isn't present in the old JSON,
      // but wait, let's see what the old JSON has.
      // We will map it to have id, name, slug, image, etc.
      const formattedGames = games.map((game: any) => ({
        id: game.id || game.slug, // fallback to slug if id missing in old JSON
        name: game.name || game.title,
        slug: game.slug,
        image: game.image || game.thumb_small,
        likes: game.likes || game.upvote || 0,
        manualRating: 5,
        totalPlayed: game.totalPlayed || game.views || 0,
        ownGame: game.ownGame || false,
        addDate: game.addDate || game.created_at || new Date().toISOString(),
      }))

      return Response.json({
        games: formattedGames,
        total: formattedGames.length,
        page: 0,
        limit: formattedGames.length,
        hasMore: false,
      })
    }

    const res = await fetch(
      `${GAMES_API}?page=${page + 1}`,
      {
        cache: "no-store",
      }
    )

    const data = await res.json()

    // ✅ NEW DATA SOURCE
    let games = data.data || []

    // ✅ CATEGORY FILTER (updated)
    if (category && category !== "all") {
      games = games.filter((game: any) =>
        game.category?.toLowerCase().includes(category.toLowerCase())
      )
    }

    // ✅ OPTIONAL: NORMALIZE DATA (IMPORTANT if frontend expects old structure)
    const formattedGames = games.map((game: any) => ({
      id: game.id,
      name: game.title,
      slug: game.slug,
      image: game.thumb_small,
      likes: game.upvote,
      manualRating: 5,
      totalPlayed: game.views,
      ownGame: false,
      addDate: game.created_at,
    }))

    return Response.json({
      games: formattedGames, // 👈 send normalized data
      total: games.length,
      page,
      limit,
      hasMore: formattedGames.length > 0,
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    )
  }
}
