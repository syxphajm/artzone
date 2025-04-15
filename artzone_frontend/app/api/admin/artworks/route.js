import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function GET(req) {
  try {
    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    const response = await fetch(`${baseUrl}/api/admin/artworks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch artworks")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/admin/artworks:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

