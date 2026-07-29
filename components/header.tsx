"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SearchBar } from "./search-bar"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
    window.location.replace("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-2 md:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
           <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
             <span className="text-xl font-bold text-white">
               <img src="/Logo.png" alt="Logo" />
             </span>
           </div>
           <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
             PikaShowGames
           </span>
         </Link>

        {/* Search Bar - Hidden on mobile, shown on md and up */}
        <div className="hidden md:flex flex-1 mx-4">
          <SearchBar />
        </div>

        {/* Desktop Navigation and Auth - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <Link href="/categories" className="text-slate-300 hover:text-white transition-colors text-sm">
            Categories
          </Link>
          <Link href="/trending" className="text-slate-300 hover:text-white transition-colors text-sm">
            Trending
          </Link>
        </nav>

        {/* Desktop Auth Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:text-white hover:border-purple-400 bg-transparent text-sm"
                >
                  Profile
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:text-white hover:border-purple-400 bg-transparent text-sm"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu - Shown only on mobile */}
        <MobileMenu />
      </div>

      {/* Mobile Search Bar - Shown only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar />
      </div>
    </header>
  )
}
