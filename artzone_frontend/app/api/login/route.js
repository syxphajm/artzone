import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json({ message: "Vui lòng nhập email và mật khẩu" }, { status: 400 })
    }

    // Sửa lại URL API - loại bỏ phần /api/auth từ biến môi trường
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiUrl = `${baseUrl}/api/auth/login`

    console.log("Login API URL:", apiUrl)

    // Send login data to backend API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Kiểm tra content-type của response
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Backend không trả về JSON. Content-Type:", contentType)
      const text = await response.text()
      console.error("Response text:", text)
      return NextResponse.json({ message: "Lỗi kết nối với server backend" }, { status: 500 })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Đăng nhập thất bại" }, { status: response.status })
    }

    return NextResponse.json({
      message: "Đăng nhập thành công",
      token: data.token,
      user: data.user,
    })
  } catch (error) {
    console.error("Lỗi đăng nhập:", error)
    return NextResponse.json({ message: "Lỗi server: " + error.message }, { status: 500 })
  }
}

