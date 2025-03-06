import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getMovieDetails, getSimilarMovies } from "@/lib/api"
import { Clock, Star } from "lucide-react"
import Image from "next/image"
import { MovieGrid } from "@/components/movie-grid"
import { AddToFavoritesButton } from "@/components/add-to-favorites-button"

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)
  const similarMovies = await getSimilarMovies(params.id)

  return (
    <div className="container py-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.svg?height=750&width=500"
              }
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>

          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{movie.vote_average?.toFixed(1)}/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{movie.runtime} min</span>
            </div>
            <div>{new Date(movie.release_date).getFullYear()}</div>
          </div>

          <p className="text-muted-foreground">{movie.overview}</p>

          <div className="flex flex-wrap gap-3">
            <AddToFavoritesButton movie={movie} />
            <Button variant="outline">Watch Trailer</Button>
          </div>

          <Card className="p-4 mt-6">
            <h3 className="font-semibold mb-2">Movie Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Director</dt>
                <dd>Christopher Nolan</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Budget</dt>
                <dd>${(movie.budget / 1000000).toFixed(1)}M</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Revenue</dt>
                <dd>${(movie.revenue / 1000000).toFixed(1)}M</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Production</dt>
                <dd>{movie.production_companies?.[0]?.name || "Unknown"}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Similar Movies</h2>
        <MovieGrid movies={similarMovies} />
      </section>
    </div>
  )
}

