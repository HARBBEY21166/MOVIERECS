"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, logoutUser } from "@/lib/auth"

interface AuthContextType {
  isLoggedIn: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    // Check authentication status on mount and when pathname changes
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Redirect to login if not authenticated and trying to access protected routes
    const publicRoutes = ["/login", "/register"]
    if (!isAuthenticated() && !publicRoutes.includes(pathname)) {
      router.push("/login")
    }
  }, [pathname, router, isClient])

  const logout = () => {
    logoutUser()
    setIsLoggedIn(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

