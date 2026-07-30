const GAMES_API = "https://raw.githubusercontent.com/TasvirLimbani/Atme/refs/heads/main/game.json"

let cachedGames: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const now = Date.now();
    if (!cachedGames || now - lastFetchTime > CACHE_TTL) {
      const gamesRes = await fetch(GAMES_API)
      const gamesData = await gamesRes.json()
      cachedGames = gamesData.games || []
      lastFetchTime = now;
    }

    let games = cachedGames || [];

    if (query) {
      games = games.filter((game: any) => game.name?.toLowerCase().includes(query))
    }

    return Response.json({
      results: games.slice(0, limit),
      total: games.length,
    })
  } catch (error) {
    return Response.json({ error: "Search failed" }, { status: 500 })
  }
}
