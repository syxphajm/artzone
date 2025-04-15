const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Artist = require("../models/artist")
const JWT_SECRET = require("../config/jwt")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token xác thực!" })
    }

    const token = authHeader.split(" ")[1]
    console.log("Token received in backend:", token.substring(0, 20) + "...")
    console.log("Using JWT_SECRET from config")

    const decoded = jwt.verify(token, JWT_SECRET)

    // Tìm user theo id từ token
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Artist,
          required: false,
        },
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" })
    }

    // Gán user vào request để sử dụng trong các route tiếp theo
    req.user = user
    next()
  } catch (error) {
    console.error("Lỗi xác thực:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ!", error: error.message })
    }
    return res.status(500).json({ message: "Lỗi server!", error: error.message })
  }
}

module.exports = authenticateToken

