import { getTrendingMovies } from "@/lib/api"
import MovieGrid from "@/components/movie-grid"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default async function MoviesPage() {
  const movies = await getTrendingMovies()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trending Movies</h1>
        <p className="text-muted-foreground">Discover the most popular movies right now</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <MovieGrid movies={movies.results} />
      </Suspense>
    </div>
  )
}

