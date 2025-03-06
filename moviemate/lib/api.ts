import type { Movie } from "@/types"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

// Helper function to validate movie data
function validateMovieData(movies: any[]): Movie[] {
  return movies
    .filter((movie) => movie && typeof movie === "object")
    .map((movie) => ({
      id: Number.parseInt(movie.movie_id) || 0,
      title: movie.title || "Untitled Movie",
      overview: movie.overview || "No description available",
      poster_path: movie.poster || null,
      backdrop_path: null,
      release_date: movie.release_date || "",
      vote_average: typeof movie.rating === "number" ? movie.rating : 0,
    }))
}

// Helper function to get auth token
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// Helper function for authenticated fetch
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Get trending movies
export async function getTrendingMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/trending/`, { next: { revalidate: 3600 } })
    const data = await response.json()
    return validateMovieData(data.results || [])
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return []
  }
}

// Get movie details
export async function getMovieDetails(id: string): Promise<any> {
  try {
    // For demo purposes, we'll use the trending movies endpoint
    // In a real app, you would have a dedicated endpoint for movie details
    const response = await fetch(`${API_BASE_URL}/movies/trending/`)
    const data = await response.json()
    const movies = data.results || []
    const movie = movies.find((m: any) => m.movie_id === id)

    if (!movie) {
      throw new Error("Movie not found")
    }

    return {
      id: Number.parseInt(movie.movie_id),
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster,
      backdrop_path: null,
      release_date: movie.release_date || "",
      vote_average: movie.rating,
      runtime: 120,
      budget: 150000000,
      revenue: 370000000,
      genres: [
        { id: 1, name: "Action" },
        { id: 2, name: "Drama" },
      ],
      production_companies: [{ id: 1, name: "Warner Bros", logo_path: null }],
    }
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error)
    return {
      id: Number.parseInt(id),
      title: "Movie Not Found",
      overview: "Details for this movie could not be loaded.",
      poster_path: null,
      backdrop_path: null,
      release_date: "",
      vote_average: 0,
      runtime: 0,
      budget: 0,
      revenue: 0,
      genres: [],
      production_companies: [],
    }
  }
}

// Get similar movies
export async function getSimilarMovies(id: string): Promise<Movie[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/recommendations/${id}/`, { next: { revalidate: 3600 } })
    const data = await response.json()
    return validateMovieData(data.results || [])
  } catch (error) {
    console.error(`Error fetching similar movies for ID ${id}:`, error)
    return []
  }
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query || query.trim() === "") {
    return []
  }

  try {
    // For demo purposes, we'll filter trending movies
    // In a real app, you would have a dedicated search endpoint
    const response = await fetch(`${API_BASE_URL}/movies/trending/`)
    const data = await response.json()
    const movies = data.results || []

    return validateMovieData(movies.filter((movie: any) => movie.title.toLowerCase().includes(query.toLowerCase())))
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

// Get favorite movies
export async function getFavoriteMovies(): Promise<Movie[]> {
  try {
    const data = await authFetch(`${API_BASE_URL}/favorites/`)
    return validateMovieData(data || [])
  } catch (error) {
    console.error("Error fetching favorite movies:", error)
    return []
  }
}

// Add a favorite movie
export async function addFavoriteMovie(movie: any): Promise<void> {
  const movieData = {
    movie_id: movie.id || movie.movie_id,
    title: movie.title,
    overview: movie.overview,
    poster: movie.poster_path || movie.poster,
    language: movie.original_language || movie.language || "en",
    rating: movie.vote_average || movie.rating || 0,
  }

  await authFetch(`${API_BASE_URL}/favorites/`, {
    method: "POST",
    body: JSON.stringify(movieData),
  })
}

// Remove a favorite movie
export async function removeFavoriteMovie(movieId: number): Promise<void> {
  await authFetch(`${API_BASE_URL}/favorites/${movieId}/`, {
    method: "DELETE",
  })
}

