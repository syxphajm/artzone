const fs = require("fs")
const path = require("path")

// Đường dẫn đến thư mục uploads
const uploadsDir = path.join(__dirname, "uploads")

// Kiểm tra xem thư mục có tồn tại không
if (!fs.existsSync(uploadsDir)) {
  console.log("Thư mục uploads không tồn tại. Đang tạo...")
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log("Đã tạo thư mục uploads tại:", uploadsDir)
} else {
  console.log("Thư mục uploads đã tồn tại tại:", uploadsDir)

  // Liệt kê các file trong thư mục
  const files = fs.readdirSync(uploadsDir)
  console.log("Số lượng file trong thư mục uploads:", files.length)

  // Hiển thị 5 file đầu tiên (nếu có)
  if (files.length > 0) {
    console.log("Các file đầu tiên:")
    files.slice(0, 5).forEach((file) => {
      console.log(" -", file)
    })
  }
}

