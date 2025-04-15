const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./user")

const Artist = sequelize.define(
  "Artist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    pseudonym: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year_of_birth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place_of_birth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education_training: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    main_art_style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about_me: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "artists",
    timestamps: false,
  },
)

// Define association
Artist.belongsTo(User, { foreignKey: "users_id" })
User.hasOne(Artist, { foreignKey: "users_id" })

module.exports = Artist

