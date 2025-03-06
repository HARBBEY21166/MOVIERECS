import { NextResponse } from "next/server"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

export async function GET() {
  try {
    // Test connectivity to the backend API
    const response = await fetch(`${API_BASE_URL}/movies/trending/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add a timeout
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "Successfully connected to the API",
      apiUrl: API_BASE_URL,
      timestamp: new Date().toISOString(),
      dataPreview: data.results ? `Received ${data.results.length} movies` : "No results found",
    })
  } catch (error) {
    console.error("API connectivity test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to the API",
        error: error instanceof Error ? error.message : String(error),
        apiUrl: API_BASE_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

