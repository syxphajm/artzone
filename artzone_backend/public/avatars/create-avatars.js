// Đây là script để tạo thư mục và các file avatar mặc định
// Bạn có thể chạy script này hoặc tự tạo thư mục và các file avatar

const fs = require("fs")
const path = require("path")

// Tạo thư mục avatars nếu chưa tồn tại
const avatarsDir = path.join(__dirname, "public", "avatars")
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true })
}

// Danh sách các avatar mặc định
const defaultAvatars = [
  "https://api.dicebear.com/7.x/avataaars/9653cdef422295a55df52506fc108e57.jpg",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
]

// Tải và lưu các avatar
const https = require("https")
const http = require("http")

defaultAvatars.forEach((url, index) => {
  const fileName = `avatar-${index + 1}.png`
  const filePath = path.join(avatarsDir, fileName)

  const protocol = url.startsWith("https") ? https : http

  protocol
    .get(url, (response) => {
      const file = fs.createWriteStream(filePath)
      response.pipe(file)

      file.on("finish", () => {
        file.close()
        console.log(`Downloaded ${fileName}`)
      })
    })
    .on("error", (err) => {
      console.error(`Error downloading ${fileName}:`, err.message)
    })
})

