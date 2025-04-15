const express = require("express")
const router = express.Router()
const sequelize = require("../config/database")

// Lấy danh sách tất cả categories
router.get("/", async (req, res) => {
  try {
    // Lấy danh sách categories từ database
    const [categories] = await sequelize.query(`
     SELECT c.*, 
            (SELECT COUNT(*) FROM artworks a WHERE a.category_id = c.id AND a.status = 1) as artwork_count
     FROM categories c
     ORDER BY c.name
   `)

    // Add image URLs for each category
    const categoryImages = {
      1: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot_1744474291-QvLJczTB7NDbzXkAjpsnE81Z4T2qJh.png", // Abstract
      2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dRRFUO2m0DueOMPHs77eOwEQQLr8pr.png", // Cubism
      3: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5LHbczuTypGN6xnRKhx9IVHUhZNuXq.png", // Expressionism
      4: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FT4VIRJYkZs8B5VceDmEjiV2PMvQ4I.png", // Impressionism
      5: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i0ViEBcQFFnX3ivLzSiL9Cg2J3UHo9.png", // Minimalism
      6: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BLlBlnLQIVMuZXhMZZAsqO1ntTBiS9.png", // Realism
      7: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-srS27HVWp2ZycBpINCt3FxLGBnha9s.png", // Surrealism
    }

    // Add image URLs to categories
    categories.forEach((category) => {
      category.image = categoryImages[category.id] || null
    })

    // Tạo cấu trúc dữ liệu phù hợp với giao diện
    const formattedCategories = [
      {
        title: "Art Styles",
        items: categories.map((cat) => ({
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
          id: cat.id,
          count: cat.artwork_count || 0,
          image: cat.image,
        })),
      },
    ]

    return res.status(200).json(formattedCategories)
  } catch (error) {
    console.error("Error getting categories list:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Lấy tác phẩm theo danh mục
router.get("/:id/artworks", async (req, res) => {
  try {
    const { id } = req.params

    // Kiểm tra danh mục tồn tại
    const [category] = await sequelize.query(
      `
     SELECT * FROM categories WHERE id = ?
   `,
      {
        replacements: [id],
      },
    )

    if (category.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" })
    }

    // Lấy tác phẩm đã được phê duyệt của danh mục
    const [artworks] = await sequelize.query(
      `
     SELECT a.*, c.name as category_name, u.fullname as artist_name
     FROM artworks a
     LEFT JOIN categories c ON a.category_id = c.id
     LEFT JOIN artists ar ON a.artists_id = ar.id
     LEFT JOIN users u ON ar.users_id = u.id
     WHERE a.category_id = ? AND a.status = 1
     ORDER BY a.upload_date DESC
   `,
      {
        replacements: [id],
      },
    )

    return res.status(200).json({
      category: category[0],
      artworks,
    })
  } catch (error) {
    console.error("Lỗi khi lấy tác phẩm theo danh mục:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

module.exports = router
