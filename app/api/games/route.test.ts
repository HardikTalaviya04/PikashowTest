import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockData = {
  data: [
    {
      id: 1,
      title: 'Action Game',
      slug: 'action-game',
      thumb_small: 'action.jpg',
      upvote: 10,
      views: 100,
      created_at: '2023-01-01',
      category: 'Action'
    },
    {
      id: 2,
      title: 'Adventure Game',
      slug: 'adventure-game',
      thumb_small: 'adventure.jpg',
      upvote: 5,
      views: 50,
      created_at: '2023-01-02',
      category: 'Adventure'
    },
    {
      id: 3,
      title: 'Action Packed',
      slug: 'action-packed',
      thumb_small: 'action2.jpg',
      upvote: 20,
      views: 200,
      created_at: '2023-01-03',
      category: 'Action, RPG'
    }
  ]
};

describe('GET /api/games', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all games if no category is provided', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockData
    } as Response);

    const req = new Request('http://localhost/api/games');
    const res = await GET(req);
    const json = await res.json();

    expect(json.games).toHaveLength(3);
    expect(json.total).toBe(3);
  });

  it('should return all games if category="all"', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockData
    } as Response);

    const req = new Request('http://localhost/api/games?category=all');
    const res = await GET(req);
    const json = await res.json();

    expect(json.games).toHaveLength(3);
  });

  it('should filter games correctly when category matches exactly (case-insensitive)', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockData
    } as Response);

    const req = new Request('http://localhost/api/games?category=action');
    const res = await GET(req);
    const json = await res.json();

    expect(json.games).toHaveLength(2);
    expect(json.games[0].name).toBe('Action Game');
    expect(json.games[1].name).toBe('Action Packed');
  });

  it('should handle fetch failures gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const req = new Request('http://localhost/api/games');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Failed to fetch games');
  });

  it('should handle empty data gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({}) // no data property
    } as Response);

    const req = new Request('http://localhost/api/games');
    const res = await GET(req);
    const json = await res.json();

    expect(json.games).toHaveLength(0);
    expect(json.total).toBe(0);
  });
});
