import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const limit = url.searchParams.get("limit")
    const featured = url.searchParams.get("featured")

    // Build the API URL with query parameters
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    let apiUrl = `${baseUrl}/api/artworks?status=1`

    if (limit) {
      apiUrl += `&limit=${limit}`
    }

    if (featured === "true") {
      apiUrl += `&featured=true`
    }

    console.log(`Fetching artworks from: ${apiUrl}`)

    // Fetch approved artworks from the backend
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: req.headers.get("authorization") ? `${req.headers.get("authorization")}` : "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch artworks")
    }

    const data = await response.json()
    console.log(`Received ${data.artworks?.length || 0} artworks from backend`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/artworks:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
