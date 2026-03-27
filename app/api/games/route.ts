// const GAMES_API = "https://raw.githubusercontent.com/TasvirLimbani/Atme/refs/heads/main/game.json"
// const CATEGORIES_API = "https://raw.githubusercontent.com/TasvirLimbani/Atme/refs/heads/main/category.json"

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const page = Number.parseInt(searchParams.get("page") || "0")
//     const limit = Number.parseInt(searchParams.get("limit") || "20")
//     const category = searchParams.get("category")

//     const gamesRes = await fetch(GAMES_API)
//     const gamesData = await gamesRes.json()
//     let games = gamesData.games || []

//     if (category && category !== "all") {
//       games = games.filter((game: any) => game.slug?.includes(category.toLowerCase()))
//     }

//     const start = page * limit
//     const end = start + limit
//     const paginatedGames = games.slice(start, end)

//     return Response.json({
//       games: paginatedGames,
//       total: games.length,
//       page,
//       limit,
//       hasMore: end < games.length,
//     })
//   } catch (error) {
//     return Response.json({ error: "Failed to fetch games" }, { status: 500 })
//   }
// }


const GAMES_API = "http://pikashowgames.soon.it/api/v0/list.php"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "0")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")

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