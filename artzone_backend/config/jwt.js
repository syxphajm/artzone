// Tạo file mới để quản lý JWT Secret
const dotenv = require("dotenv")

// Đảm bảo biến môi trường được tải
dotenv.config()

// Lấy JWT Secret từ biến môi trường hoặc sử dụng giá trị mặc định
const JWT_SECRET = process.env.JWT_SECRET || "your_very_secure_and_long_secret_key"

// Log để kiểm tra
console.log("JWT_SECRET from config:", JWT_SECRET)

module.exports = JWT_SECRET

