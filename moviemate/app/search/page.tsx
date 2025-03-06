"use client"

import { MovieGrid } from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchMovies } from "@/lib/api"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/hooks"
import type { Movie } from "@/types"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    async function fetchMovies() {
      if (debouncedQuery.trim() === "") {
        setMovies([])
        return
      }

      setLoading(true)
      try {
        const results = await searchMovies(debouncedQuery)
        setMovies(results)
      } catch (error) {
        console.error("Error searching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [debouncedQuery])

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Search Movies</h1>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for movies..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-muted-foreground">Searching for movies...</p>
        </div>
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : debouncedQuery.trim() !== "" ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No movies found</h3>
          <p className="text-muted-foreground mt-1">Try searching for a different movie title.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mt-4">Search for movies</h3>
          <p className="text-muted-foreground mt-1">Enter a movie title to search for movies.</p>
        </div>
      )}
    </div>
  )
}

