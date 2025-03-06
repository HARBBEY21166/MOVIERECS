"use client"

import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/context/favorites-context"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
        <p>Loading favorites...</p>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFavorites} className="gap-1">
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No favorites yet</h3>
          <p className="text-muted-foreground mt-1">Start adding movies to your favorites to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

