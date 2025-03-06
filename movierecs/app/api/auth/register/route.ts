import { NextResponse } from "next/server"

const API_BASE_URL = "https://alxprodev-movie-recommendation-backend.onrender.com/api"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/users/signup/`, {
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
          message: data.message || Object.values(data).flat().join(", ") || "Registration failed",
          error: data,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data,
    })
  } catch (error) {
    console.error("Registration proxy error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 },
    )
  }
}

