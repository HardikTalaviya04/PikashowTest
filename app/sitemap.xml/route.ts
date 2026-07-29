import { NextResponse } from 'next/server'

const API_BASE_URL = "http://pikashowgames.soon.it/api/v0"

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const baseUrl = 'https://www.pikashowgames.com'

  // Fetch all games
  let allGames: any[] = []
  let page = 1
  const limit = 100 // Fetch in batches
  let hasMore = true

  try {
    while (hasMore) {
      const res = await fetch(`${API_BASE_URL}/list.php?page=${page}&limit=${limit}`, {
        next: { revalidate: 86400 } // Cache API responses
      })
      const data = await res.json()

      if (data.data && data.data.length > 0) {
        allGames = [...allGames, ...data.data]
        page++
      } else {
        hasMore = false
      }

      // Safety net to prevent infinite loops if API is misbehaving
      if (page > 50) hasMore = false;
    }
  } catch (error) {
    console.error("Failed to fetch games for sitemap:", error)
  }

  const staticRoutes = [
    '', '/categories', '/trending', '/about', '/contact', '/blog', '/privacy', '/terms', '/sitemap'
  ]

  const categories = ['action', 'adventure', 'puzzle', 'sports', 'racing', 'arcade', 'strategy']

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // Add static routes
  for (const route of staticRoutes) {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  }

  // Add category routes
  for (const cat of categories) {
    xml += `
  <url>
    <loc>${baseUrl}/?category=${cat}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  }

  // Add games
  for (const game of allGames) {
    xml += `
  <url>
    <loc>${baseUrl}/game/${game.id}</loc>
    <lastmod>${new Date(game.createdDate || game.created_at || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  }

  xml += `\n</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}