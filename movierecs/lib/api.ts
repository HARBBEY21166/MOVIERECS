import type { Movie } from "@/types"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

// Helper function to validate movie data
function validateMovieData(movies: any[]): Movie[] {
  return movies
    .filter((movie) => movie && typeof movie === "object")
    .map((movie) => ({
      movie_id: movie.movie_id || "",
      title: movie.title || "Untitled Movie",
      overview: movie.overview || "No description available",
      poster: movie.poster || "",
      language: movie.language || "en",
      rating: typeof movie.rating === "number" ? movie.rating : 0,
    }))
}

// Helper function to get auth token
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
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
export async function getTrendingMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/trending/`, { next: { revalidate: 3600 } })
    const data = await response.json()
    return {
      ...data,
      results: validateMovieData(data.results || []),
    }
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return { results: [] }
  }
}

// Get movie recommendations
export async function getMovieRecommendations(movieId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/recommendations/${movieId}/`, { next: { revalidate: 3600 } })
    const data = await response.json()
    return {
      ...data,
      results: validateMovieData(data.results || []),
    }
  } catch (error) {
    console.error("Error fetching movie recommendations:", error)
    return { results: [] }
  }
}

// Get favorite movies
export async function getFavoriteMovies() {
  try {
    const data = await authFetch(`${API_BASE_URL}/favorites/`)
    return validateMovieData(data || [])
  } catch (error) {
    console.error("Error fetching favorite movies:", error)
    return []
  }
}

// Save a favorite movie
export async function saveFavorite(movie: Movie) {
  return authFetch(`${API_BASE_URL}/favorites/`, {
    method: "POST",
    body: JSON.stringify(movie),
  })
}

// Remove a favorite movie
export async function removeFavorite(movieId: string) {
  return authFetch(`${API_BASE_URL}/favorites/${movieId}/`, {
    method: "DELETE",
  })
}

