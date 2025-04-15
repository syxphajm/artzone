const express = require("express")
const router = express.Router()
const sequelize = require("../config/database")
const authenticateToken = require("../middleware/auth")

// Hàm kiểm tra và tạo bảng nếu chưa tồn tại
async function ensureTablesExist(transaction) {
  try {
    // Kiểm tra bảng orders
    const [ordersExists] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders'",
      { transaction },
    )

    if (ordersExists[0].count === 0) {
      console.log("Bảng orders không tồn tại, đang tạo...")
      await sequelize.query(
        `
       CREATE TABLE orders (
         id INT AUTO_INCREMENT PRIMARY KEY,
         users_id INT NOT NULL,
         order_date DATETIME NOT NULL,
         total_amount DECIMAL(10, 2) NOT NULL,
         status TINYINT DEFAULT 0,
         phone VARCHAR(20) NOT NULL,
         address TEXT NOT NULL,
         note TEXT,
         code VARCHAR(10),
         FOREIGN KEY (users_id) REFERENCES users(id)
       )
     `,
        { transaction },
      )
      console.log("Đã tạo bảng orders")
    }

    // Kiểm tra bảng order_details
    const [detailsExists] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'order_details'",
      { transaction },
    )

    if (detailsExists[0].count === 0) {
      console.log("Bảng order_details không tồn tại, đang tạo...")
      await sequelize.query(
        `
       CREATE TABLE order_details (
         id INT AUTO_INCREMENT PRIMARY KEY,
         orders_id INT NOT NULL,
         artworks_id INT NOT NULL,
         quantity INT NOT NULL,
         price DECIMAL(10, 2) NOT NULL,
         FOREIGN KEY (orders_id) REFERENCES orders(id),
         FOREIGN KEY (artworks_id) REFERENCES artworks(id)
       )
     `,
        { transaction },
      )
      console.log("Đã tạo bảng order_details")
    }

    return true
  } catch (error) {
    console.error("Lỗi khi kiểm tra/tạo bảng:", error)
    throw error
  }
}

// Tạo đơn hàng mới
router.post("/", authenticateToken, async (req, res) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction()

  try {
    const { items, total_amount, phone, address, note, code } = req.body
    const userId = req.user.id

    console.log("Received order data:", req.body)

    if (!items || !items.length || !phone || !address) {
      await transaction.rollback()
      return res.status(400).json({ message: "Missing required order information" })
    }

    // Đảm bảo các bảng tồn tại
    await ensureTablesExist(transaction)

    // Tạo đơn hàng mới
    const [orderId] = await sequelize.query(
      `INSERT INTO orders (users_id, order_date, total_amount, status, phone, address, note, code) 
      VALUES (?, NOW(), ?, 0, ?, ?, ?, ?)`,
      {
        replacements: [userId, total_amount, phone, address, note || "", code || ""],
        transaction,
      },
    )

    console.log("Created order with ID:", orderId)

    // Thêm chi tiết đơn hàng
    for (const item of items) {
      await sequelize.query(
        `INSERT INTO order_details (orders_id, artworks_id, quantity, price) 
        VALUES (?, ?, ?, ?)`,
        {
          replacements: [orderId, item.artwork_id, item.quantity, item.price],
          transaction,
        },
      )
    }

    // Commit transaction
    await transaction.commit()

    return res.status(201).json({
      message: "Order placed successfully",
      order_id: orderId,
    })
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback()
    console.error("Error creating order:", error)
    return res.status(500).json({ message: "Server error: " + error.message })
  }
})

// Lấy thông tin đơn hàng theo ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Đảm bảo các bảng tồn tại
    await ensureTablesExist(null)

    // Lấy thông tin đơn hàng
    const [orders] = await sequelize.query(
      `SELECT o.*, u.fullname, u.email 
      FROM orders o
      JOIN users u ON o.users_id = u.id
      WHERE o.id = ? AND o.users_id = ?`,
      {
        replacements: [id, userId],
      },
    )

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" })
    }

    const order = orders[0]

    // Lấy chi tiết đơn hàng
    const [orderDetails] = await sequelize.query(
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

    // Thêm chi tiết đơn hàng vào kết quả
    order.items = orderDetails

    return res.status(200).json({ order })
  } catch (error) {
    console.error("Error getting order details:", error)
    return res.status(500).json({ message: "Server error: " + error.message })
  }
})

// Lấy danh sách đơn hàng của người dùng
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Đảm bảo các bảng tồn tại
    await ensureTablesExist(null)

    // Lấy danh sách đơn hàng
    const [orders] = await sequelize.query(
      `SELECT o.*, 
             (SELECT COUNT(*) FROM order_details WHERE orders_id = o.id) as item_count
      FROM orders o
      WHERE o.users_id = ?
      ORDER BY o.order_date DESC`,
      {
        replacements: [userId],
      },
    )

    return res.status(200).json({ orders })
  } catch (error) {
    console.error("Error getting orders list:", error)
    return res.status(500).json({ message: "Server error: " + error.message })
  }
})

// Cancel order (DELETE instead of just changing status)
router.patch("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    console.log(`Attempting to cancel order ${id} for user ${userId}`)

    // Check if order exists and belongs to the user
    const [orders] = await sequelize.query(`SELECT * FROM orders WHERE id = ? AND users_id = ?`, {
      replacements: [id, userId],
    })

    if (orders.length === 0) {
      console.log(`Order ${id} not found or does not belong to user ${userId}`)
      return res.status(404).json({ message: "Order not found" })
    }

    const order = orders[0]

    // Check if order can be canceled (only pending orders can be canceled)
    if (order.status !== 0) {
      console.log(`Cannot cancel order ${id} with status ${order.status}`)
      return res.status(400).json({ message: "Only pending orders can be canceled" })
    }

    console.log(`Deleting order ${id} and its details`)

    // Start a transaction
    const transaction = await sequelize.transaction()

    try {
      // First delete the order details
      await sequelize.query(`DELETE FROM order_details WHERE orders_id = ?`, {
        replacements: [id],
        transaction,
      })

      // Then delete the order
      await sequelize.query(`DELETE FROM orders WHERE id = ?`, {
        replacements: [id],
        transaction,
      })

      // Commit the transaction
      await transaction.commit()

      console.log(`Successfully deleted order ${id} and its details`)
      return res.status(200).json({ message: "Order canceled and deleted successfully" })
    } catch (error) {
      // Rollback the transaction if there's an error
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error("Error canceling order:", error)
    return res.status(500).json({ message: "Server error: " + error.message })
  }
})

module.exports = router
