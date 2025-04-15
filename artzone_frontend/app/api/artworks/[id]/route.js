import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { id } = params
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/artworks/${id}`, {
      headers: {
        Authorization: req.headers.get("authorization") ? `${req.headers.get("authorization")}` : "",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "Artwork not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch artwork")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in GET /api/artworks/${params.id}:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

