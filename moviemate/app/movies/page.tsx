import { MovieGrid } from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTrendingMovies } from "@/lib/api"
import { Search } from "lucide-react"

export default async function MoviesPage() {
  const movies = await getTrendingMovies()

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Browse Movies</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search movies..." className="pl-8" />
        </div>
        <Select defaultValue="popularity">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="release">Release Date</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="drama">Drama</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MovieGrid movies={movies} />

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

