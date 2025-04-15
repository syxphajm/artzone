import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function GET(req) {
  try {
    console.log("Admin orders API route called")

    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      console.log("Unauthorized access attempt to admin orders")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    console.log(`Fetching orders from backend: ${baseUrl}/api/admin/orders`)

    const response = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error response from backend: ${response.status} ${response.statusText}`)
      console.error(`Error details: ${errorText}`)

      return NextResponse.json(
        {
          message: "Failed to fetch orders from backend",
          status: response.status,
          details: errorText,
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    console.log(`Successfully fetched ${data.orders?.length || 0} orders`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error)
    return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 })
  }
}
