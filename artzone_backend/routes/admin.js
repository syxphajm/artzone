const express = require("express")
const router = express.Router()
const authenticateToken = require("../middleware/auth")
const sequelize = require("../config/database")

// Kiểm tra quyền admin
router.get("/check-auth", authenticateToken, (req, res) => {
  try {
    // Kiểm tra xem user có phải là admin không (role_id = 1)
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập!" })
    }

    return res.status(200).json({
      isAdmin: true,
      user: {
        id: req.user.id,
        fullname: req.user.fullname,
        email: req.user.email,
        role_id: req.user.role_id,
      },
    })
  } catch (error) {
    console.error("Lỗi kiểm tra quyền admin:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Dashboard data
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Get total users count
    const [usersResult] = await sequelize.query(`SELECT COUNT(*) as count FROM users`)
    const totalUsers = usersResult[0].count

    // Get total artworks count
    const [artworksResult] = await sequelize.query(`SELECT COUNT(*) as count FROM artworks WHERE status = 1`)
    const totalArtworks = artworksResult[0].count

    // Get total revenue (from delivered orders)
    const [revenueResult] = await sequelize.query(`SELECT SUM(total_amount) as total FROM orders WHERE status = 2`)
    const totalRevenue = revenueResult[0].total || 0

    // Get pending orders count
    const [pendingOrdersResult] = await sequelize.query(`SELECT COUNT(*) as count FROM orders WHERE status = 0`)
    const pendingOrders = pendingOrdersResult[0].count

    // Get recent activities
    const [recentActivities] = await sequelize.query(`
      (SELECT 'user' as type, 'New user registered' as title, 
              CONCAT(fullname, ' registered as a ', 
                    CASE 
                      WHEN role_id = 1 THEN 'admin'
                      WHEN role_id = 2 THEN 'buyer'
                      WHEN role_id = 3 THEN 'artist'
                      ELSE 'user'
                    END) as description,
              CONCAT(TIMESTAMPDIFF(HOUR, NOW(), NOW()), ' hours ago') as time
       FROM users ORDER BY id DESC LIMIT 2)
      UNION ALL
      (SELECT 'artwork' as type, 'New artwork uploaded' as title,
              CONCAT(a.title, ' by ', u.fullname) as description,
              CONCAT(TIMESTAMPDIFF(HOUR, a.upload_date, NOW()), ' hours ago') as time
       FROM artworks a
       JOIN artists ar ON a.artists_id = ar.id
       JOIN users u ON ar.users_id = u.id
       ORDER BY a.id DESC LIMIT 2)
      UNION ALL
      (SELECT 'order' as type, 'New order placed' as title,
              CONCAT('Order #', o.id, ' for $', o.total_amount) as description,
              CONCAT(TIMESTAMPDIFF(HOUR, o.order_date, NOW()), ' hours ago') as time
       FROM orders o
       ORDER BY o.id DESC LIMIT 2)
      LIMIT 5
    `)

    // Get pending approvals
    const [pendingApprovals] = await sequelize.query(`
      SELECT a.id, a.title, a.image, u.fullname as artist_name,
             CONCAT(TIMESTAMPDIFF(HOUR, a.upload_date, NOW()), 'h ago') as time
      FROM artworks a
      JOIN artists ar ON a.artists_id = ar.id
      JOIN users u ON ar.users_id = u.id
      WHERE a.status = 0
      ORDER BY a.upload_date DESC
      LIMIT 5
    `)

    // Calculate growth percentages (mock data for now)
    const newUsersPercent = 12
    const newArtworksPercent = 8
    const revenueGrowthPercent = 15

    return res.status(200).json({
      totalUsers,
      totalArtworks,
      totalRevenue,
      pendingOrders,
      newUsersPercent,
      newArtworksPercent,
      revenueGrowthPercent,
      recentActivities,
      pendingApprovals,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all users (admin only)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Get all users
    const [users] = await sequelize.query(`
      SELECT u.*, 
             CASE 
               WHEN a.id IS NOT NULL THEN TRUE 
               ELSE FALSE 
             END as is_artist
      FROM users u
      LEFT JOIN artists a ON u.id = a.users_id
      ORDER BY u.id DESC
    `)

    return res.status(200).json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user details (admin only)
router.get("/users/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    const { id } = req.params

    // Get user details
    const [users] = await sequelize.query(
      `
      SELECT u.*, 
             CASE 
               WHEN a.id IS NOT NULL THEN TRUE 
               ELSE FALSE 
             END as is_artist
      FROM users u
      LEFT JOIN artists a ON u.id = a.users_id
      WHERE u.id = ?
    `,
      {
        replacements: [id],
      },
    )

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = users[0]

    // If user is an artist, get artist details
    if (user.is_artist) {
      const [artists] = await sequelize.query(
        `
        SELECT * FROM artists WHERE users_id = ?
      `,
        {
          replacements: [id],
        },
      )

      if (artists.length > 0) {
        user.artist = artists[0]
      }
    }

    // Get user's orders
    const [orders] = await sequelize.query(
      `
      SELECT o.*, 
             (SELECT COUNT(*) FROM order_details WHERE orders_id = o.id) as item_count
      FROM orders o
      WHERE o.users_id = ?
      ORDER BY o.order_date DESC
      LIMIT 5
    `,
      {
        replacements: [id],
      },
    )

    user.recent_orders = orders

    // If user is an artist, get their artworks
    if (user.is_artist) {
      const [artworks] = await sequelize.query(
        `
        SELECT a.*, c.name as category_name
        FROM artworks a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.artists_id = (SELECT id FROM artists WHERE users_id = ?)
        ORDER BY a.upload_date DESC
        LIMIT 5
      `,
        {
          replacements: [id],
        },
      )

      user.recent_artworks = artworks
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Error fetching user details:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user (admin only)
router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    const { id } = req.params
    const { fullname, email, phone, role_id } = req.body

    // Check if user exists
    const [users] = await sequelize.query(`SELECT * FROM users WHERE id = ?`, {
      replacements: [id],
    })

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user
    await sequelize.query(
      `
      UPDATE users 
      SET fullname = ?, email = ?, phone = ?, role_id = ?
      WHERE id = ?
    `,
      {
        replacements: [fullname, email, phone, role_id, id],
      },
    )

    return res.status(200).json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete user (admin only)
router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    const { id } = req.params

    // Check if user exists
    const [users] = await sequelize.query(`SELECT * FROM users WHERE id = ?`, {
      replacements: [id],
    })

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user is an admin
    if (users[0].role_id === 1) {
      return res.status(400).json({ message: "Cannot delete admin user" })
    }

    // Start transaction
    const transaction = await sequelize.transaction()

    try {
      // Delete user's orders and order details
      const [orders] = await sequelize.query(`SELECT id FROM orders WHERE users_id = ?`, {
        replacements: [id],
        transaction,
      })

      for (const order of orders) {
        await sequelize.query(`DELETE FROM order_details WHERE orders_id = ?`, {
          replacements: [order.id],
          transaction,
        })
      }

      await sequelize.query(`DELETE FROM orders WHERE users_id = ?`, {
        replacements: [id],
        transaction,
      })

      // If user is an artist, delete their artworks
      if (users[0].role_id === 3) {
        const [artists] = await sequelize.query(`SELECT id FROM artists WHERE users_id = ?`, {
          replacements: [id],
          transaction,
        })

        if (artists.length > 0) {
          await sequelize.query(`DELETE FROM artworks WHERE artists_id = ?`, {
            replacements: [artists[0].id],
            transaction,
          })

          await sequelize.query(`DELETE FROM artists WHERE users_id = ?`, {
            replacements: [id],
            transaction,
          })
        }
      }

      // Delete user
      await sequelize.query(`DELETE FROM users WHERE id = ?`, {
        replacements: [id],
        transaction,
      })

      // Commit transaction
      await transaction.commit()

      return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      // Rollback transaction
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Lấy danh sách tác phẩm chờ duyệt
router.get("/artworks", authenticateToken, async (req, res) => {
  try {
    // Kiểm tra xem user có phải là admin không
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập!" })
    }

    // Lấy danh sách tác phẩm từ database
    const [artworks] = await sequelize.query(
      `
    SELECT a.*, c.name as category_name, u.fullname as artist_name
    FROM artworks a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN artists ar ON a.artists_id = ar.id
    LEFT JOIN users u ON ar.users_id = u.id
    ORDER BY a.upload_date DESC
    `,
    )

    return res.status(200).json({ artworks })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Cập nhật trạng thái tác phẩm
router.patch("/artworks/:id", authenticateToken, async (req, res) => {
  try {
    // Kiểm tra xem user có phải là admin không
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập!" })
    }

    const { id } = req.params
    const { status } = req.body

    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" })
    }

    // Cập nhật trạng thái tác phẩm
    await sequelize.query(
      `
    UPDATE artworks
    SET status = ?
    WHERE id = ?
    `,
      {
        replacements: [status, id],
      },
    )

    return res.status(200).json({
      message: `Tác phẩm đã được ${status === 1 ? "duyệt" : "từ chối"} thành công`,
      artwork_id: id,
      status,
    })
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái tác phẩm:", error)
    return res.status(500).json({ message: "Lỗi server", error: error.message })
  }
})

// Get all orders (admin only)
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Get all orders with customer info
    const [orders] = await sequelize.query(
      `SELECT o.*, u.fullname, u.email,
             (SELECT COUNT(*) FROM order_details WHERE orders_id = o.id) as item_count
      FROM orders o
      JOIN users u ON o.users_id = u.id
      ORDER BY o.order_date DESC`,
    )

    return res.status(200).json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get order details (admin only)
router.get("/orders/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    const { id } = req.params

    // Get order with customer info
    const [orders] = await sequelize.query(
      `SELECT o.*, u.fullname, u.email
      FROM orders o
      JOIN users u ON o.users_id = u.id
      WHERE o.id = ?`,
      {
        replacements: [id],
      },
    )

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" })
    }

    const order = orders[0]

    // Get order items
    const [orderItems] = await sequelize.query(
      `SELECT od.*, a.title, a.image, u.fullname as artist_name
      FROM order_details od
      JOIN artworks a ON od.artworks_id = a.id
      LEFT JOIN artists ar ON a.artists_id = ar.id
      LEFT JOIN users u ON ar.users_id = u.id
      WHERE od.orders_id = ?`,
      {
        replacements: [id],
      },
    )

    order.items = orderItems

    return res.status(200).json({ order })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update order status (admin only)
router.patch("/orders/:id/status", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied" })
    }

    const { id } = req.params
    const { status } = req.body

    if (![0, 1, 2, 3].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    // Update order status
    await sequelize.query(`UPDATE orders SET status = ? WHERE id = ?`, {
      replacements: [status, id],
    })

    return res.status(200).json({
      message: "Order status updated successfully",
      order_id: id,
      status,
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
