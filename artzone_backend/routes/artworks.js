const express = require("express")
const router = express.Router()
const sequelize = require("../config/database")

// Lấy danh sách tất cả tác phẩm đã được duyệt (status = 1)
router.get("/", async (req, res) => {
  try {
    const status = req.query.status || 1 // Default to approved artworks

    // Lấy danh sách tác phẩm từ database
    const [artworks] = await sequelize.query(
      `
      SELECT a.*, c.name as category_name, u.fullname as artist_name
      FROM artworks a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN artists ar ON a.artists_id = ar.id
      LEFT JOIN users u ON ar.users_id = u.id
      WHERE a.status = ?
      ORDER BY a.upload_date DESC
      `,
      { replacements: [status] },
    )

    return res.status(200).json({ artworks })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Lấy chi tiết tác phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Lấy chi tiết tác phẩm từ database
    const [artworks] = await sequelize.query(
      `
      SELECT a.*, c.name as category_name, u.fullname as artist_name
      FROM artworks a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN artists ar ON a.artists_id = ar.id
      LEFT JOIN users u ON ar.users_id = u.id
      WHERE a.id = ? AND a.status = 1
      `,
      { replacements: [id] },
    )

    if (artworks.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tác phẩm" })
    }

    return res.status(200).json({ artwork: artworks[0] })
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

module.exports = router

