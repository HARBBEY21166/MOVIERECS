"use client"

import type { Movie } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { saveFavorite } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
}

export default function MovieCard({ movie, isFavorite = false }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFav, setIsFav] = useState(isFavorite)
  const { user } = useAuth()
  const { toast } = useToast()

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/original/${movie.poster}`
    : "/placeholder.svg?height=450&width=300"

  const handleSaveFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save favorites",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await saveFavorite(movie)
      setIsFav(true)
      toast({
        title: "Success",
        description: "Movie added to favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save favorite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[2/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Image
          src={posterUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {movie.rating ? (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        ) : null}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1 mb-2">
          {movie.language ? (
            <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
              {movie.language.toUpperCase()}
            </div>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{movie.overview}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" asChild className="flex-1 mr-2">
          <Link href={`/movies/${movie.movie_id}`}>Details</Link>
        </Button>
        <Button
          variant={isFav ? "default" : "outline"}
          size="icon"
          onClick={handleSaveFavorite}
          disabled={isLoading || isFav}
          className={isFav ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
        >
          <Heart className={isFav ? "fill-white" : ""} />
        </Button>
      </CardFooter>
    </Card>
  )
}

