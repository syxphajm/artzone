import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
/**
 * Kiểm tra xem người dùng có phải là admin không
 * @param {Request} req - Request object
 * @returns {Promise<boolean>} - True nếu là admin, false nếu không phải
 */
export async function authenticateAdmin(req) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false
    }

    const token = authHeader.split(" ")[1]

    // Gửi request đến API để kiểm tra quyền admin
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${baseUrl}/api/admin/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.isAdmin === true
  } catch (error) {
    console.error("Error authenticating admin:", error)
    return false
  }
}





