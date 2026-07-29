import { expect, test, vi, describe, afterEach } from 'vitest'
import { GET } from './route'

describe('GET /api/games', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return 500 when fetch throws an error', async () => {
    // Mock the global fetch function to throw an error
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Failed to fetch from external API'))))

    const request = new Request('http://localhost:3000/api/games?page=0&limit=20')
    const response = await GET(request)

    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to fetch games' })
  })

  test('should return formatted games successfully', async () => {
    const mockGamesData = {
      data: [
        {
          id: '1',
          title: 'Test Game',
          slug: 'test-game',
          thumb_small: 'image.jpg',
          upvote: 100,
          views: 5000,
          created_at: '2023-01-01',
          category: 'Action'
        }
      ]
    }

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockGamesData)
      })
    ))

    const request = new Request('http://localhost:3000/api/games?page=0&limit=20')
    const response = await GET(request)

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.games).toHaveLength(1)
    expect(data.games[0].name).toBe('Test Game')
    expect(data.games[0].id).toBe('1')
    expect(data.games[0].slug).toBe('test-game')
    expect(data.games[0].image).toBe('image.jpg')
    expect(data.games[0].likes).toBe(100)
    expect(data.games[0].totalPlayed).toBe(5000)
    expect(data.games[0].addDate).toBe('2023-01-01')
    expect(data.total).toBe(1)
    expect(data.page).toBe(0)
    expect(data.limit).toBe(20)
    expect(data.hasMore).toBe(true)
  })

  test('should filter by category if provided', async () => {
    const mockGamesData = {
      data: [
        { id: '1', title: 'Action Game', category: 'Action' },
        { id: '2', title: 'Puzzle Game', category: 'Puzzle' }
      ]
    }

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockGamesData)
      })
    ))

    const request = new Request('http://localhost:3000/api/games?category=action')
    const response = await GET(request)

    const data = await response.json()
    expect(data.games).toHaveLength(1)
    expect(data.games[0].name).toBe('Action Game')
  })
})
