const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Artist = require("../models/artist")
const Role = require("../models/role")
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const bcrypt = require("bcrypt")
const JWT_SECRET = require("../config/jwt")

const router = express.Router()

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token!" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user by id from token
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Artist,
          required: false,
        },
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }

    // Attach user to request to be used in subsequent routes
    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token!" })
    }
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
}

// User registration
router.post("/register", async (req, res) => {
  console.log("Received registration request:", req.body)

  const { fullname, email, phone, password, role_id, artist } = req.body

  // Validate input
  if (!fullname || !email || !password || !role_id) {
    return res.status(400).json({ message: "Missing required information!" })
  }

  // Begin transaction to ensure data integrity
  const transaction = await sequelize.transaction()

  try {
    // Check if role_id exists
    const role = await Role.findByPk(role_id, { transaction })
    if (!role) {
      await transaction.rollback()
      return res.status(400).json({ message: "Invalid role!" })
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    })

    if (existingUser) {
      await transaction.rollback()
      return res.status(400).json({ message: "Email already exists!" })
    }

    // Create new user
    const newUser = await User.create(
      {
        fullname,
        email,
        phone,
        password, // Password will be hashed in beforeCreate hook
        role_id,
      },
      { transaction },
    )

    // If the user is an artist, create an entry in the artists table
    if (role_id == 3 && artist) {
      await Artist.create(
        {
          users_id: newUser.id,
          pseudonym: artist.pseudonym,
          year_of_birth: artist.year_of_birth,
          place_of_birth: artist.place_of_birth,
          nationality: artist.nationality,
          education_training: artist.education_training,
          main_art_style: artist.main_art_style,
          about_me: artist.about_me,
        },
        { transaction },
      )
    }

    // Commit transaction
    await transaction.commit()

    // Return user information (excluding password)
    const userData = newUser.toJSON()
    delete userData.password

    console.log("Registration successful for:", email)
    return res.status(201).json({
      message: "Registration successful!",
      user: userData,
    })
  } catch (error) {
    // Rollback transaction if error occurs
    await transaction.rollback()
    console.error("Registration error:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// User login
router.post("/login", async (req, res) => {
  console.log("Received login request for:", req.body.email)

  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password!" })
  }

  try {
    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Artist,
          required: false, // LEFT JOIN
        },
      ],
    })

    if (!user) {
      return res.status(400).json({ message: "Email does not exist!" })
    }

    // Check password
    const passwordMatch = await user.checkPassword(password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password!" })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, role: user.role_id }, JWT_SECRET, { expiresIn: "24h" })
    console.log("Token created in backend:", token.substring(0, 20) + "...")
    console.log("Using JWT_SECRET from config for token creation")

    const userData = user.toJSON()
    delete userData.password

    console.log("Login successful for:", email)
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Get current user information (requires token authentication)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // Get user information from authenticateToken middleware
    const user = req.user

    // Do not return password
    const userData = user.toJSON()
    delete userData.password

    return res.status(200).json({ user: userData })
  } catch (error) {
    console.error("Error fetching user information:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Update personal information
router.put("/update-profile", authenticateToken, async (req, res) => {
  const { fullname } = req.body
  const userId = req.user.id

  if (!fullname) {
    return res.status(400).json({ message: "Missing required information!" })
  }

  try {
    // Update user information
    await User.update({ fullname }, { where: { id: userId } })

    // Fetch updated user information
    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: Artist,
          required: false,
        },
      ],
      attributes: { exclude: ["password"] },
    })

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = req.user

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required information!" })
  }

  try {
    // Check current password
    const passwordMatch = await user.checkPassword(currentPassword)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect!" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await User.update({ password: hashedPassword }, { where: { id: user.id } })

    return res.status(200).json({
      message: "Password changed successfully!",
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Update artist profile
router.put("/update-artist-profile", authenticateToken, async (req, res) => {
  const userId = req.user.id
  const artistData = req.body

  try {
    // Check if user is an artist
    if (req.user.role_id !== 3) {
      return res.status(403).json({ message: "You do not have permission to update artist information!" })
    }

    // Check if artist information exists
    let artist = await Artist.findOne({ where: { users_id: userId } })

    if (!artist) {
      // If not, create new entry
      artist = await Artist.create({
        users_id: userId,
        ...artistData,
      })
    } else {
      // If exists, update it
      await Artist.update(artistData, {
        where: { users_id: userId },
      })

      // Fetch updated artist information
      artist = await Artist.findOne({ where: { users_id: userId } })
    }

    return res.status(200).json({
      message: "Artist profile updated successfully!",
      artist,
    })
  } catch (error) {
    console.error("Error updating artist profile:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Update avatar
router.put("/update-avatar", authenticateToken, async (req, res) => {
  const { profile_picture } = req.body
  const userId = req.user.id

  if (!profile_picture) {
    return res.status(400).json({ message: "Missing profile picture!" })
  }

  try {
    // Update profile picture
    await User.update({ profile_picture }, { where: { id: userId } })

    // Fetch updated user information
    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: Artist,
          required: false,
        },
      ],
      attributes: { exclude: ["password"] },
    })

    return res.status(200).json({
      message: "Profile picture updated successfully!",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating profile picture:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

// Get list of Users + Roles
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Artist,
          required: false,
        },
      ],
      attributes: { exclude: ["password"] }, // Do not return password
    })

    return res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching list of users:", error)
    return res.status(500).json({ message: "Server error!", error: error.message })
  }
})

module.exports = router
