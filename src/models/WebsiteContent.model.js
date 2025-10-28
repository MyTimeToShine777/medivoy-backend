const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebsiteContent = sequelize.define('WebsiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page_slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255)
  },
  content: {
    type: DataTypes.TEXT
  },
  meta_description: {
    type: DataTypes.TEXT
  },
  meta_keywords: {
    type: DataTypes.TEXT
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'website_content',
  timestamps: true,
  underscored: true
});

module.exports = WebsiteContent;