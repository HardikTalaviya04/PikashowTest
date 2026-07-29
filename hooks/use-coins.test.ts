import { renderHook } from "@testing-library/react"
import { useCoins } from "./use-coins"
import { vi, describe, it, expect } from "vitest"

vi.mock("./use-auth", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}))

describe("useCoins error handling", () => {
  it("addCoins returns false and logs error on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useCoins())
    const res = await result.current.addCoins(10, "test")

    expect(res).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith("Failed to add coins:", expect.any(Error))
    consoleSpy.mockRestore()
  })

  it("addCoins returns false and logs error on network rejection", async () => {
    const error = new Error("Network error")
    global.fetch = vi.fn().mockRejectedValue(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useCoins())
    const res = await result.current.addCoins(10, "test")

    expect(res).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith("Failed to add coins:", error)
    consoleSpy.mockRestore()
  })
})
