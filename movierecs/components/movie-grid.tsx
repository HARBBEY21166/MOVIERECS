import type { Movie } from "@/types"
import MovieCard from "./movie-card"

interface MovieGridProps {
  movies: Movie[]
  isLoading?: boolean
}

export default function MovieGrid({ movies, isLoading = false }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-muted animate-pulse h-[400px]"></div>
        ))}
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.movie_id} movie={movie} />
      ))}
    </div>
  )
}

