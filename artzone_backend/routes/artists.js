const express = require("express")
const router = express.Router()
const sequelize = require("../config/database")

// Lấy danh sách nghệ sĩ có tác phẩm đã được phê duyệt
router.get("/", async (req, res) => {
  try {
    console.log("Fetching artists with approved artworks")

    // Lấy danh sách nghệ sĩ có tác phẩm đã được phê duyệt (status = 1)
    const [artists] = await sequelize.query(`
      SELECT DISTINCT a.id, a.users_id, a.pseudonym, a.year_of_birth, a.place_of_birth, 
             a.nationality, a.education_training, a.main_art_style, a.about_me,
             u.fullname, u.email, u.profile_picture
      FROM artists a
      JOIN users u ON a.users_id = u.id
      JOIN artworks aw ON a.id = aw.artists_id
      WHERE aw.status = 1
      GROUP BY a.id
      ORDER BY u.fullname
    `)

    console.log(`Found ${artists.length} artists with approved artworks`)

    // Lấy số lượng tác phẩm đã được phê duyệt của mỗi nghệ sĩ
    for (const artist of artists) {
      const [artworksCount] = await sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM artworks
        WHERE artists_id = ? AND status = 1
      `,
        {
          replacements: [artist.id],
        },
      )

      artist.artworks_count = artworksCount[0].count
    }

    return res.status(200).json({ artists })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nghệ sĩ:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Lấy thông tin chi tiết của một nghệ sĩ và tác phẩm của họ
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Fetching artist details for ID: ${id}`)

    // Lấy thông tin nghệ sĩ
    const [artists] = await sequelize.query(
      `
      SELECT a.*, u.fullname, u.email, u.profile_picture
      FROM artists a
      JOIN users u ON a.users_id = u.id
      WHERE a.id = ?
    `,
      {
        replacements: [id],
      },
    )

    if (artists.length === 0) {
      console.log(`Artist with ID ${id} not found`)
      return res.status(404).json({ message: "Không tìm thấy nghệ sĩ" })
    }

    const artist = artists[0]
    console.log(`Found artist: ${artist.fullname}`)

    // Lấy tác phẩm đã được phê duyệt của nghệ sĩ
    const [artworks] = await sequelize.query(
      `
      SELECT aw.*, c.name as category_name
      FROM artworks aw
      LEFT JOIN categories c ON aw.category_id = c.id
      WHERE aw.artists_id = ? AND aw.status = 1
      ORDER BY aw.upload_date DESC
    `,
      {
        replacements: [id],
      },
    )

    console.log(`Found ${artworks.length} approved artworks for artist ID ${id}`)

    return res.status(200).json({
      artist,
      artworks,
    })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nghệ sĩ:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

module.exports = router

