import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.fullname || !body.email || !body.password || !body.role_id) {
      return NextResponse.json({ message: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    // Log để debug
    console.log("Sending registration data to backend:", body)

    // Sửa lại URL API - loại bỏ phần /api/auth từ biến môi trường
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiUrl = `${baseUrl}/api/auth/register`

    console.log("API URL:", apiUrl)

    // Send registration data to backend API
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
      return NextResponse.json({ message: data.message || "Đăng ký thất bại" }, { status: response.status })
    }

    return NextResponse.json({ message: "Đăng ký thành công", user: data.user }, { status: 201 })
  } catch (error) {
    console.error("Lỗi đăng ký:", error)
    return NextResponse.json({ message: "Lỗi server: " + error.message }, { status: 500 })
  }
}

