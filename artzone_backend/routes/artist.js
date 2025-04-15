const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const sequelize = require("../config/database")
const authenticateToken = require("../middleware/auth")
const Artist = require("../models/artist")

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Lấy danh sách tác phẩm của nghệ sĩ
router.get("/artworks", authenticateToken, async (req, res) => {
  try {
    // Kiểm tra xem user có phải là nghệ sĩ không
    if (req.user.role_id !== 3) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" })
    }

    // Lấy artist_id từ bảng artists dựa trên users_id
    const artist = await Artist.findOne({ where: { users_id: req.user.id } })

    if (!artist) {
      return res.status(404).json({ message: "Không tìm thấy thông tin nghệ sĩ!" })
    }

    console.log("Artist ID:", artist.id)

    // Lấy danh sách tác phẩm từ database - không lọc theo status
    const [artworks] = await sequelize.query(
      `
      SELECT a.*, c.name as category_name 
      FROM artworks a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.artists_id = ?
      ORDER BY a.upload_date DESC
    `,
      { replacements: [artist.id] },
    )

    console.log("Found artworks:", artworks.length)

    return res.status(200).json({ artworks })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Thêm tác phẩm mới
router.post("/artworks", authenticateToken, upload.array("images", 5), async (req, res) => {
  try {
    // Kiểm tra xem user có phải là nghệ sĩ không
    if (req.user.role_id !== 3) {
      return res.status(403).json({ message: "Bạn không có quyền thêm tác phẩm!" })
    }

    const { title, description, price, dimensions, material, category_id } = req.body

    // Lấy artist_id từ bảng artists dựa trên users_id
    const artist = await Artist.findOne({ where: { users_id: req.user.id } })

    let artistId
    if (!artist) {
      // Nếu chưa có, tạo một bản ghi mới trong bảng artists
      const newArtist = await Artist.create({
        users_id: req.user.id,
        // Thêm các trường khác nếu cần
      })

      artistId = newArtist.id
    } else {
      artistId = artist.id
    }

    // Xử lý các file đã upload
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`).join(",")

    // Thêm tác phẩm vào database
    const [result] = await sequelize.query(
      `
      INSERT INTO artworks (title, description, price, image, dimensions, material, category_id, upload_date, artists_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 0)
    `,
      {
        replacements: [title, description, price, imageUrls, dimensions, material, category_id, artistId],
      },
    )

    return res.status(201).json({
      message: "Thêm tác phẩm thành công!",
      artwork_id: result,
    })
  } catch (error) {
    console.error("Lỗi khi thêm tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

module.exports = router

