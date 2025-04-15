const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const path = require("path")

// Load environment variables - đảm bảo đây là dòng đầu tiên trước khi sử dụng bất kỳ biến môi trường nào
dotenv.config()

// Kiểm tra xem biến môi trường đã được tải chưa
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No")

// Khởi tạo kết nối database
require("./config/database")

// Khởi tạo models
require("./models/user")
require("./models/artist")
require("./models/role")

const app = express()

// Đảm bảo middleware phục vụ file tĩnh được đặt TRƯỚC các route API
// Thêm middleware để phục vụ file tĩnh
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Thêm middleware để log các request đến /uploads
app.use("/uploads", (req, res, next) => {
  console.log(`Static file request: ${req.method} ${req.url}`)
  next()
})

// Middleware
// Thêm middleware CORS để cho phép truy cập từ frontend
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL || "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(bodyParser.json())

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Routes
app.get("/", (req, res) => {
  res.json({ message: "ArtZone API đang chạy!" })
})

// Thêm vào phần routes
const categoriesRoutes = require("./routes/categories")
const artistRoutes = require("./routes/artist")
const adminRoutes = require("./routes/admin")
const artworksRoutes = require("./routes/artworks")
const artistsRoutes = require("./routes/artists") // Thêm route mới
const ordersRoutes = require("./routes/orders")

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/artist", artistRoutes)
app.use("/api/artists", artistsRoutes) // Thêm route mới
app.use("/api/admin", adminRoutes)
app.use("/api/artworks", artworksRoutes)
app.use("/api/orders", ordersRoutes) // Thêm route orders

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({
    message: "Đã xảy ra lỗi server!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy API endpoint" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`)
})

