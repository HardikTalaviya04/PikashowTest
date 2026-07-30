import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

describe('GET /api/games/search', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 500 when fetch throws an error', async () => {
    // Mock global fetch to throw an error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const req = new Request('http://localhost/api/games/search?q=test');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Search failed' });
  });

  it('should return 200 and search results on success', async () => {
    const mockGames = [
      { name: 'Test Game 1' },
      { name: 'Another Game' },
      { name: 'Test Game 2' },
    ];

    // Mock global fetch to return success
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ games: mockGames }),
    } as Response);

    const req = new Request('http://localhost/api/games/search?q=test');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(2);
    expect(data.results[0].name).toBe('Test Game 1');
    expect(data.results[1].name).toBe('Test Game 2');
    expect(data.total).toBe(2);
  });
});
