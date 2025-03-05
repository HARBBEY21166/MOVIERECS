import { getTrendingMovies } from "@/lib/api"
import MovieGrid from "@/components/movie-grid"

export default async function MoviesPage() {
  const movies = await getTrendingMovies()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trending Movies</h1>
      <MovieGrid movies={movies.results} />
    </div>
  )
}

