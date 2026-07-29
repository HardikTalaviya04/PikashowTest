import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUserData } from './use-user-data'

describe('useUserData', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    global.fetch = originalFetch
  })

  it('does not call fetch and returns undefined data when uid is null', () => {
    const { result } = renderHook(() => useUserData(null))

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.userData).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBeUndefined()
  })

  it('calls fetch when uid is provided', async () => {
    const mockData = { id: '123', name: 'Test User' }
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData)
    })

    const { result } = renderHook(() => useUserData('123'))

    expect(global.fetch).toHaveBeenCalledWith('/api/user/123')
  })
})
