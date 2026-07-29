import { renderHook, act } from '@testing-library/react'
import { useCoins } from './use-coins'
import { useAuth } from './use-auth'

// Mock the useAuth hook
jest.mock('./use-auth', () => ({
  useAuth: jest.fn(),
}))

describe('useCoins', () => {
  const mockUser = { uid: 'test-user-id' }
  const originalConsoleError = console.error

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Silence console.error for tests expecting errors
    console.error = jest.fn()
  })

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })
    })

    it('addCoins should return false', async () => {
      const { result } = renderHook(() => useCoins())

      let response
      await act(async () => {
        response = await result.current.addCoins(100, 'test')
      })

      expect(response).toBe(false)
    })

    it('updateStats should return false', async () => {
      const { result } = renderHook(() => useCoins())

      let response
      await act(async () => {
        response = await result.current.updateStats(1, 60)
      })

      expect(response).toBe(false)
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
      // Setup global.fetch mock
      global.fetch = jest.fn()
    })

    describe('addCoins', () => {
      it('should successfully add coins', async () => {
        const mockResponse = { success: true, coins: 100 }
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        })

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.addCoins(100, 'test reason')
        })

        expect(global.fetch).toHaveBeenCalledWith(`/api/user/${mockUser.uid}/coins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 100, reason: 'test reason' }),
        })
        expect(response).toEqual(mockResponse)
      })

      it('should return false on failed API response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        })

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.addCoins(100, 'test reason')
        })

        expect(response).toBe(false)
        expect(console.error).toHaveBeenCalled()
      })

      it('should return false on network error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.addCoins(100, 'test reason')
        })

        expect(response).toBe(false)
        expect(console.error).toHaveBeenCalled()
      })
    })

    describe('updateStats', () => {
      it('should successfully update stats', async () => {
        const mockResponse = { success: true, gamesPlayed: 1, timeSpent: 60 }
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        })

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.updateStats(1, 60)
        })

        expect(global.fetch).toHaveBeenCalledWith(`/api/user/${mockUser.uid}/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gamesPlayed: 1, timeSpent: 60 }),
        })
        expect(response).toEqual(mockResponse)
      })

      it('should return false on failed API response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        })

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.updateStats(1, 60)
        })

        expect(response).toBe(false)
        expect(console.error).toHaveBeenCalled()
      })

      it('should return false on network error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

        const { result } = renderHook(() => useCoins())

        let response
        await act(async () => {
          response = await result.current.updateStats(1, 60)
        })

        expect(response).toBe(false)
        expect(console.error).toHaveBeenCalled()
      })
    })
  })
})
