"use client"

import axios from "axios"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})

// Add request interceptor to include auth token - only in browser environment
if (typeof window !== "undefined") {
  api.interceptors.request.use(
    (config) => {
      console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`)

      const token = localStorage.getItem("access_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error("Request interceptor error:", error)
      return Promise.reject(error)
    },
  )

  // Add response interceptor to handle token refresh
  api.interceptors.response.use(
    (response) => {
      console.log("Response received successfully")
      return response
    },
    async (error) => {
      console.error("Response error:", error.message)

      // If there's no response, it's likely a network error
      if (!error.response) {
        console.error("Network error details:", error)
        return Promise.reject(
          new Error(
            "Network Error: Unable to connect to the server. Please check your internet connection and make sure the backend server is running.",
          ),
        )
      }

      const originalRequest = error.config

      // If error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem("refresh_token")
          if (!refreshToken) {
            throw new Error("No refresh token available")
          }

          const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem("access_token", access)

          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch (refreshError) {
          // If refresh fails, log out the user
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}

// User registration
interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
}

export const registerUser = async (userData: RegisterData): Promise<void> => {
  try {
    console.log("Attempting to register user with data:", {
      ...userData,
      password: "[REDACTED]",
    })

    // Use the Next.js API route as a proxy to avoid CORS issues
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    }

    console.log("Registration successful")
  } catch (error) {
    console.error("Registration error details:", error)
    throw error
  }
}

// User login
export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    console.log("Attempting to login user:", email)

    // Use the Next.js API route as a proxy to avoid CORS issues
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed")
    }

    const data = await response.json()
    console.log("Login successful")

    localStorage.setItem("access_token", data.access)
    localStorage.setItem("refresh_token", data.refresh)
  } catch (error) {
    console.error("Login error details:", error)
    throw error
  }
}

// User logout
export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") {
    return false
  }
  return !!localStorage.getItem("access_token")
}

export default api

