import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTrendingMovies, getMovieRecommendations } from "@/lib/api"
import MovieGrid from "@/components/movie-grid"
import { Star, ArrowLeft, Heart } from "lucide-react"
import { Suspense } from "react"

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
          <Link href="/movies">Back to Movies</Link>
        </Button>
      </div>
    )
  }

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/original/${movie.poster}`
    : "/placeholder.svg?height=600&width=400"

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/movies" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Movies
      </Link>

      <div className="bg-muted/30 rounded-xl overflow-hidden mb-12">
        <div className="relative h-[300px] md:h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
          {movie.poster && (
            <Image
              src={`https://image.tmdb.org/t/p/original/${movie.poster}`}
              alt={movie.title}
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority
            />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 p-6 -mt-32 relative z-20">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl border-4 border-background">
            <Image
              src={posterUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>

          <div className="md:col-span-2 text-white md:pt-32">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              {movie.rating ? (
                <div className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-primary" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              ) : null}

              {movie.language ? (
                <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                  {movie.language.toUpperCase()}
                </div>
              ) : null}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-white/80">{movie.overview}</p>
            </div>

            <div className="flex gap-4">
              <Button className="gap-2">
                <Heart className="h-4 w-4" />
                Add to Favorites
              </Button>
              <Button variant="outline" asChild>
                <Link href="/movies">Back to Movies</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <Suspense fallback={<MovieGrid movies={[]} isLoading={true} />}>
          <MovieGrid movies={recommendations.results.slice(0, 4)} />
        </Suspense>
      </div>
    </div>
  )
}

