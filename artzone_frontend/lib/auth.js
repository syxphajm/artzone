/**
 * Kiểm tra xem người dùng có phải là admin không
 * @param {Request} req - Request object
 * @returns {Promise<boolean>} - True nếu là admin, false nếu không phải
 */
export async function authenticateAdmin(req) {
  try {
    console.log("Authenticating admin access")

    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header found")
      return false
    }

    const token = authHeader.split(" ")[1]

    // Gửi request đến API để kiểm tra quyền admin
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    console.log(`Checking admin auth at: ${baseUrl}/api/admin/check-auth`)

    const response = await fetch(`${baseUrl}/api/admin/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.log(`Admin auth check failed with status: ${response.status}`)
      return false
    }

    const data = await response.json()
    console.log(`Admin auth check result: ${data.isAdmin ? "Admin" : "Not admin"}`)

    return data.isAdmin === true
  } catch (error) {
    console.error("Error authenticating admin:", error)
    return false
  }
}
