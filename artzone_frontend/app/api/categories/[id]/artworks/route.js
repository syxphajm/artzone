import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    // Await params trước khi sử dụng
    const id = await params.id

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/categories/${id}/artworks`, {
      headers: {
        Authorization: req.headers.get("authorization") ? `${req.headers.get("authorization")}` : "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch category artworks")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in GET /api/categories/${params.id}/artworks:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

