const fs = require("fs")
const path = require("path")
const https = require("https")
const http = require("http")

// Danh sách URL avatar
const avatarUrls = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9653cdef422295a55df52506fc108e57.jpg-b0YqoycdYYgyqjF9cQKlH2JrRihDmx.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c1e2678fffcde71a14a6856a158b7f62.jpg-DJ9qDwQWbkE0TQ1JvfGUzFHork4LHZ.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00abd9564318bcd03abeeda380f08b19.jpg-2Em6wCURIlkKYop0himKp55YAzhPOa.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/330f9833fabd7fc13d9ebe8c1b4016e1.jpg-NgtVa8JGbkyTMDvMzkEZYmoXc2gHpR.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ac312780e071afd063527c1c01a529a.jpg-tPMnub1HOSVHAafeFPmWetqEqMQCpf.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ddd4f480bd5f3ddb561ae1b70ba60f74.jpg-vUVSpHHeLlxmcEvpxk58tlQ0NcjzmJ.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c65b4aa73ee5c8c9ec8bfb641b4175b2.jpg-aQGgn3lkCh3JNvkoJ0fz3roVLqwspd.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d19c143d61847e8bcfb5983b7af4cf63.jpg-HLiMIOtXvdsdtBYmdkwvfPWRmJ4ro9.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ec5247c993852fe0ffdfe82102e570c5.jpg-2mtfJCZyOcNCfhqRsHXUEXw0zH8LJF.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eed4b615981b421f8a6eb50ee3cd1e12.jpg-IRwpFPHr8eU8VTSsayIinOTDeF07El.jpeg",
]

// Thư mục đích để lưu ảnh avatar
const destDir = path.join(__dirname, "../public/avatars")

// Tạo thư mục đích nếu chưa tồn tại
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
  console.log(`Đã tạo thư mục: ${destDir}`)
}

// Hàm tải xuống ảnh từ URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http

    protocol
      .get(url, (response) => {
        // Kiểm tra nếu response không thành công
        if (response.statusCode !== 200) {
          reject(new Error(`Không thể tải xuống ảnh, mã trạng thái: ${response.statusCode}`))
          return
        }

        const file = fs.createWriteStream(filename)

        response.pipe(file)

        file.on("finish", () => {
          file.close()
          resolve()
        })

        file.on("error", (err) => {
          fs.unlink(filename, () => {}) // Xóa file nếu có lỗi
          reject(err)
        })
      })
      .on("error", (err) => {
        reject(err)
      })
  })
}

// Tải xuống tất cả ảnh
async function downloadAllAvatars() {
  console.log("Bắt đầu tải xuống avatar...")

  for (let i = 0; i < avatarUrls.length; i++) {
    const url = avatarUrls[i]
    const filename = path.join(destDir, `custom-avatar-${i + 1}.jpeg`)

    try {
      console.log(`Đang tải xuống avatar ${i + 1}/${avatarUrls.length}...`)
      await downloadImage(url, filename)
      console.log(`✓ Đã tải xuống: ${filename}`)
    } catch (error) {
      console.error(`✗ Lỗi khi tải xuống ${url}:`, error.message)
    }
  }

  console.log("Hoàn tất tải xuống avatar!")
  console.log("Hãy cập nhật mảng DEFAULT_AVATARS trong file app/profile/avatar-selector.jsx")
}

// Chạy hàm tải xuống
downloadAllAvatars()

