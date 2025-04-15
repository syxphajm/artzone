import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const withImages = true // Always include images

    // Build the API URL with query parameters
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiUrl = `${baseUrl}/api/categories`

    console.log(`Fetching categories from: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: req.headers.get("authorization") ? `${req.headers.get("authorization")}` : "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const data = await response.json()

    // Add image URLs to categories if requested
    if (withImages) {
      const categoryImages = {
        Abstract:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot_1744474291-QvLJczTB7NDbzXkAjpsnE81Z4T2qJh.png",
        Cubism: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dRRFUO2m0DueOMPHs77eOwEQQLr8pr.png",
        Expressionism:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5LHbczuTypGN6xnRKhx9IVHUhZNuXq.png",
        Impressionism:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FT4VIRJYkZs8B5VceDmEjiV2PMvQ4I.png",
        Minimalism: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i0ViEBcQFFnX3ivLzSiL9Cg2J3UHo9.png",
        Realism: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BLlBlnLQIVMuZXhMZZAsqO1ntTBiS9.png",
        Surrealism: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-srS27HVWp2ZycBpINCt3FxLGBnha9s.png",
      }

      // Add images to categories
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((category) => {
          if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item) => {
              if (categoryImages[item.name]) {
                item.image = categoryImages[item.name]
              }
            })
          }
        })
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/categories:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
