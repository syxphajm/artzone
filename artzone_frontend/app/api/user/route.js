import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Không có token xác thực" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Gửi request đến backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiUrl = `${baseUrl}/api/auth/me`

    console.log("Fetching user data from:", apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Không thể lấy thông tin người dùng" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Không có token xác thực" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const body = await req.json()

    // Gửi request đến backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Không thể cập nhật thông tin người dùng" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}

