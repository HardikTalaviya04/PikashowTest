import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAuth } from './use-auth'
import { onAuthStateChanged } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}))

vi.mock('@/lib/firebase', () => ({
  auth: {},
}))

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with user as null and loading as true', () => {
    let callback: any = null
    ;(onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      callback = cb
      return vi.fn() // Unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('sets user and loading false when user logs in', () => {
    let callback: any = null
    ;(onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      callback = cb
      return vi.fn() // Unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)

    const mockUser = { uid: '123', email: 'test@example.com' }

    act(() => {
      callback(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it('sets user to null and loading false when user logs out', () => {
    let callback: any = null
    ;(onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      callback = cb
      return vi.fn() // Unsubscribe function
    })

    const { result } = renderHook(() => useAuth())

    act(() => {
      callback(null)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('unsubscribes from onAuthStateChanged when component unmounts', () => {
    const unsubscribeMock = vi.fn()
    ;(onAuthStateChanged as any).mockReturnValue(unsubscribeMock)

    const { unmount } = renderHook(() => useAuth())

    expect(unsubscribeMock).not.toHaveBeenCalled()

    unmount()

    expect(unsubscribeMock).toHaveBeenCalled()
  })
})
