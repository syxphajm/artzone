import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    // Await params trước khi sử dụng
    const id = await params.id

    // Lấy token từ header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Không có token xác thực" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Gửi request đến backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 })
      }
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Không thể lấy thông tin đơn hàng" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}

