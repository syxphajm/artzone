import { NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function GET(req, { params }) {
  try {
    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    const response = await fetch(`${baseUrl}/api/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch user details")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in GET /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    const response = await fetch(`${baseUrl}/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ message: errorData.message || "Failed to update user" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in PUT /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const isAdmin = await authenticateAdmin(req)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const token = req.headers.get("authorization")?.split(" ")[1] || ""

    const response = await fetch(`${baseUrl}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ message: errorData.message || "Failed to delete user" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in DELETE /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
