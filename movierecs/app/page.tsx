import Link from "next/link"
import { Button } from "@/components/ui/button"
import MovieGrid from "@/components/movie-grid"
import { getTrendingMovies } from "@/lib/api"

export default async function Home() {
  const movies = await getTrendingMovies()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
          Get personalized movie recommendations and keep track of your favorites all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/movies">Browse Movies</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Movies</h2>
          <Button asChild variant="ghost">
            <Link href="/movies">View All</Link>
          </Button>
        </div>
        <MovieGrid movies={movies.results.slice(0, 4)} />
      </section>
    </div>
  )
}

