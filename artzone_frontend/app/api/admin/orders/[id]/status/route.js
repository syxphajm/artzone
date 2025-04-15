import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function PATCH(req, { params }) {
  try {
    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { status } = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    const response = await fetch(`${baseUrl}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error("Failed to update order status")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in PATCH /api/admin/orders/${params.id}/status:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
