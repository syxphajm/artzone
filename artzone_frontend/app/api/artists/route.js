import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const limit = url.searchParams.get("limit")

    // Build the API URL with query parameters
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    let apiUrl = `${baseUrl}/api/artists`

    if (limit) {
      apiUrl += `?limit=${limit}`
    }

    console.log(`Fetching artists from: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: req.headers.get("authorization") ? `${req.headers.get("authorization")}` : "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Error response from backend: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`Error details: ${errorText}`)
      throw new Error(`Failed to fetch artists: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Successfully fetched artists data with ${data.artists?.length || 0} artists`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/artists:", error)
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 })
  }
}
