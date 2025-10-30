const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FAQ = sequelize.define(
  "FAQ",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    display_order: {
      type: DataTypes.INTEGER,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "faqs",
    timestamps: true,
    underscored: true,
  },
);

module.exports = FAQ;
