import type { Movie } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"
import Link from "next/link"
import { AddToFavoritesButton } from "./add-to-favorites-button"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden group">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.svg?height=450&width=300"
            }
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/movies/${movie.id}`} className="flex-1">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
            <p className="text-xs text-muted-foreground">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
            </p>
          </Link>
          <AddToFavoritesButton movie={movie} variant="ghost" size="icon" className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}

