import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getTrendingMovies, getMovieRecommendations } from "@/lib/api"
import MovieGrid from "@/components/movie-grid"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  // Fetch movie details and recommendations
  const [allMovies, recommendations] = await Promise.all([getTrendingMovies(), getMovieRecommendations(params.id)])

  // Find the current movie from all movies
  const movie = allMovies.results.find((m) => m.movie_id === params.id)

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
        <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/movies">Back to Movies</a>
        </Button>
      </div>
    )
  }

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/original/${movie.poster}`
    : "/placeholder.svg?height=600&width=400"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              Rating: {movie.rating ? movie.rating.toFixed(1) : "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              Language: {movie.language ? movie.language.toUpperCase() : "N/A"}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>

          <div className="flex gap-4">
            <Button id="favorite-button">Add to Favorites</Button>
            <Button variant="outline">Back to Movies</Button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
        <MovieGrid movies={recommendations.results.slice(0, 4)} />
      </div>
    </div>
  )
}

