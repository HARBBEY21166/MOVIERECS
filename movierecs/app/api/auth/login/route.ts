import { NextResponse } from "next/server"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.detail || "Invalid credentials",
          error: data,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      ...data,
    })
  } catch (error) {
    console.error("Login proxy error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 },
    )
  }
}

