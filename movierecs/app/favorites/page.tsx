"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getFavoriteMovies } from "@/lib/api"
import type { Movie } from "@/types"
import MovieGrid from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function loadFavorites() {
      if (user) {
        try {
          const data = await getFavoriteMovies()
          setFavorites(data)
        } catch (error) {
          console.error("Error loading favorites:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-8">Please login to view your favorite movies.</p>
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Movies</h1>

      {isLoading ? (
        <MovieGrid movies={[]} isLoading={true} />
      ) : favorites.length > 0 ? (
        <MovieGrid movies={favorites} isFavorite={true} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">You haven't added any movies to your favorites yet.</p>
          <Button asChild>
            <Link href="/movies">Browse Movies</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

