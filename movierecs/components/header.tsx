"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Film, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Favorites", href: "/favorites" },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="font-bold text-xl">MovieRecs</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">Hello, {user.first_name}</span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-4 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="text-sm">Hello, {user.first_name}</span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild onClick={closeMenu}>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild onClick={closeMenu}>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

