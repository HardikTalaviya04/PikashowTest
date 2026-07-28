"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    setIsOpen(false)
    router.push("/login")
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 md:hidden">
          <div className="px-4 py-4 space-y-3">
            {/* Navigation Links */}
            <Link href="/" onClick={() => setIsOpen(false)}>
              <div className="text-slate-300 hover:text-white transition-colors py-2">Home</div>
            </Link>
            <Link href="/categories" onClick={() => setIsOpen(false)}>
              <div className="text-slate-300 hover:text-white transition-colors py-2">Categories</div>
            </Link>
            <Link href="/trending" onClick={() => setIsOpen(false)}>
              <div className="text-slate-300 hover:text-white transition-colors py-2">Trending</div>
            </Link>

            <div className="border-t border-purple-500/20 pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button className="w-full border-purple-500/50 text-purple-400 hover:text-white hover:border-purple-400 bg-transparent text-sm justify-start">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button className="w-full border-purple-500/50 text-purple-400 hover:text-white hover:border-purple-400 bg-transparent text-sm justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
