const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING(255),
    },
    file_url: {
      type: DataTypes.TEXT,
    },
    file_type: {
      type: DataTypes.STRING(50),
    },
    file_size: {
      type: DataTypes.INTEGER,
    },
    entity_type: {
      type: DataTypes.STRING(100),
    },
    entity_id: {
      type: DataTypes.INTEGER,
    },
    uploaded_by_user_id: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "media",
    timestamps: true,
    underscored: true,
    updatedAt: false,
  },
);

module.exports = Media;
