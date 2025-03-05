"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface SignupData {
  email: string
  password: string
  first_name: string
  last_name: string
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://alxprodev-movie-recommendation-backend.onrender.com/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      // Store token
      localStorage.setItem("token", data.access)
      setToken(data.access)

      // Fetch user data
      const userResponse = await fetch("https://alxprodev-movie-recommendation-backend.onrender.com/api/users/me/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://alxprodev-movie-recommendation-backend.onrender.com/api/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      // Login after successful signup
      await login(userData.email, userData.password)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

