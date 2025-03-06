import { MovieGrid } from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTrendingMovies } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const trendingMovies = (await getTrendingMovies()) || []

  return (
    <div className="container py-6 space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Discover Movies</h2>
          <Link href="/movies">
            <Button variant="ghost" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="space-y-4">
            <MovieGrid movies={trendingMovies} />
          </TabsContent>
          <TabsContent value="recommended" className="space-y-4">
            <MovieGrid movies={trendingMovies.length > 5 ? trendingMovies.slice(5, 15) : trendingMovies} />
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            <MovieGrid movies={trendingMovies.length > 10 ? trendingMovies.slice(10, 20) : trendingMovies} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

