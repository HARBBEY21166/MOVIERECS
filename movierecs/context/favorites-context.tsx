"use client"

import type React from "react"

import type { Movie } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getFavoriteMovies, addFavoriteMovie, removeFavoriteMovie } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

interface FavoritesContextType {
  favorites: Movie[]
  addFavorite: (movie: Movie) => void
  removeFavorite: (id: number) => void
  clearFavorites: () => void
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Only fetch favorites if user is authenticated
    if (isAuthenticated()) {
      fetchFavorites()
    }
  }, [])

  const fetchFavorites = async () => {
    setIsLoading(true)
    try {
      const data = await getFavoriteMovies()
      setFavorites(data)
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFavorite = async (movie: Movie) => {
    try {
      await addFavoriteMovie(movie)
      setFavorites((prev) => [...prev, movie])

      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      })
    } catch (error) {
      console.error("Failed to add favorite:", error)
      toast({
        title: "Error",
        description: "Failed to add movie to favorites.",
        variant: "destructive",
      })
    }
  }

  const removeFavorite = async (id: number) => {
    try {
      const movie = favorites.find((m) => m.id === id)
      await removeFavoriteMovie(id)

      setFavorites((prev) => prev.filter((movie) => movie.id !== id))

      if (movie) {
        toast({
          title: "Removed from favorites",
          description: `${movie.title} has been removed from your favorites.`,
        })
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      toast({
        title: "Error",
        description: "Failed to remove movie from favorites.",
        variant: "destructive",
      })
    }
  }

  const clearFavorites = () => {
    // This would need a backend endpoint to clear all favorites
    // For now, we'll just clear the local state
    setFavorites([])

    toast({
      title: "Favorites cleared",
      description: "All movies have been removed from your favorites.",
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

