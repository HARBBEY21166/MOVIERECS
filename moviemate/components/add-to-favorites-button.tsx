"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useFavorites } from "@/context/favorites-context"
import type { Movie } from "@/types"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AddToFavoritesButtonProps extends ButtonProps {
  movie: Movie
}

export function AddToFavoritesButton({
  movie,
  className,
  variant = "default",
  size,
  ...props
}: AddToFavoritesButtonProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsFavorite(favorites.some((fav) => fav.id === movie.id))
  }, [favorites, movie.id])

  if (!isMounted) {
    return null
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite()
      }}
      className={cn(
        isFavorite && variant === "default" && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
        className,
      )}
      {...props}
    >
      <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-primary")} />
      {!size && (isFavorite ? "Remove from Favorites" : "Add to Favorites")}
    </Button>
  )
}

