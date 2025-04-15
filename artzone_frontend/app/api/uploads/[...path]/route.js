import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    // Get the path parameters
    const pathParams = params.path

    // Join the path parts
    const pathString = Array.isArray(pathParams) ? pathParams.join("/") : pathParams

    // Get backend URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    console.log(`Proxying image request to: ${baseUrl}/uploads/${pathString}`)

    // Send request to backend
    const response = await fetch(`${baseUrl}/uploads/${pathString}`, {
      cache: "no-store", // Ensure we don't cache to always get the latest image
    })

    if (!response.ok) {
      console.error(`Error fetching image: ${response.status} ${response.statusText}`)
      return NextResponse.json({ message: "Image not found" }, { status: 404 })
    }

    // Get image data as buffer
    const imageBuffer = await response.arrayBuffer()

    // Get content type from response
    const contentType = response.headers.get("content-type") || "image/jpeg"

    // Return image with appropriate content type
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    })
  } catch (error) {
    console.error(`Error in GET /api/uploads/[...path]:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
