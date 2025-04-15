import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
  try {
    // Properly await and extract the ID from params
    const id = await params.id

    // Get token from header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No authentication token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Send request to backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    console.log(`Sending cancel request to: ${baseUrl}/api/orders/${id}/cancel`)

    const response = await fetch(`${baseUrl}/api/orders/${id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error response from backend: ${response.status} ${response.statusText}`)
      console.error(`Error details: ${errorText}`)

      let errorMessage = "Failed to cancel order"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If parsing fails, use the default message
      }

      return NextResponse.json({ message: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in PATCH /api/orders/${params.id}/cancel:`, error)
    return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 })
  }
}
