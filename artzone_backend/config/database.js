const { Sequelize } = require("sequelize")

// Khởi tạo kết nối Sequelize với MySQL
const sequelize = new Sequelize("artzone", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log, // Bật logging SQL queries để debug
  dialectOptions: {
    // Cấu hình thêm cho kết nối MySQL
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

// Kiểm tra kết nối
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Kết nối cơ sở dữ liệu thành công.")
  } catch (error) {
    console.error("Không thể kết nối đến cơ sở dữ liệu:", error)
  }
}

testConnection()

module.exports = sequelize

