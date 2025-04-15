import { NextResponse } from "next/server"

export async function PUT(req) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Không có token xác thực" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const body = await req.json()

    // Kiểm tra dữ liệu đầu vào
    if (!body.profile_picture) {
      return NextResponse.json({ message: "Thiếu thông tin ảnh đại diện" }, { status: 400 })
    }

    // Gửi request đến backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/auth/update-avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profile_picture: body.profile_picture,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Không thể cập nhật ảnh đại diện" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lỗi khi cập nhật ảnh đại diện:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}

