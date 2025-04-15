import { NextResponse } from "next/server"

async function authenticate(req) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: true, response: NextResponse.json({ message: "Không có token xác thực" }, { status: 401 }) }
  }
  const token = authHeader.split(" ")[1]
  console.log("Token received in frontend API:", token)
  return { error: false, token }
}

async function fetchFromBackend(endpoint, method, token, body = null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  if (body) {
    if (body instanceof FormData) {
      delete options.headers["Content-Type"]
      options.body = body
    } else {
      options.body = JSON.stringify(body)
    }
  }

  console.log("Sending request to backend:", `${baseUrl}${endpoint}`, options)

  const response = await fetch(`${baseUrl}${endpoint}`, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Backend error:", errorData)
    return NextResponse.json({ message: errorData.message || "Lỗi từ backend" }, { status: response.status })
  }
  return NextResponse.json(await response.json())
}

export async function GET(req) {
  const auth = await authenticate(req)
  if (auth.error) return auth.response
  return fetchFromBackend("/api/artist/artworks", "GET", auth.token)
}

export async function POST(req) {
  const auth = await authenticate(req)
  if (auth.error) return auth.response

  try {
    const formData = await req.formData()
    const response = await fetchFromBackend("/api/artist/artworks", "POST", auth.token, formData)

    if (response.status === 500) {
      const errorData = await response.json()
      console.error("Backend error:", errorData)
      return NextResponse.json({ message: errorData.message || "Lỗi server" }, { status: 500 })
    }

    return response
  } catch (error) {
    console.error("Error in POST /api/artist/artworks:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}

