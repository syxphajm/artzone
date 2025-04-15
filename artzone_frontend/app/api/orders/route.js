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
    const response = await fetch(`${baseUrl}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Không thể lấy danh sách đơn hàng" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error)
    return NextResponse.json({ message: "Lỗi server: " + error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Không có token xác thực" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const body = await req.json()

    // Log để debug
    console.log("Sending order data to backend:", body)

    // Validate input
    if (!body.items || !body.items.length || !body.phone || !body.address) {
      return NextResponse.json({ message: "Thiếu thông tin đơn hàng" }, { status: 400 })
    }

    // Gửi request đến backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiUrl = `${baseUrl}/api/orders`

    console.log("API URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    // Kiểm tra response
    let responseData
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json()
    } else {
      const text = await response.text()
      console.error("Backend không trả về JSON. Content-Type:", contentType)
      console.error("Response text:", text)
      return NextResponse.json({ message: "Lỗi kết nối với server backend" }, { status: 500 })
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Không thể tạo đơn hàng" },
        { status: response.status },
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error)
    return NextResponse.json({ message: "Lỗi server: " + error.message }, { status: 500 })
  }
}

