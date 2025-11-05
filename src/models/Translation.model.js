const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Translation = sequelize.define(
  'Translation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entity_type: {
      type: DataTypes.STRING(100),
    },
    entity_id: {
      type: DataTypes.INTEGER,
    },
    field_name: {
      type: DataTypes.STRING(100),
    },
    locale: {
      type: DataTypes.STRING(10),
    },
    translated_text: {
      type: DataTypes.TEXT,
    },
    is_auto_translated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'translations',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Translation;
