const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  nameUz: {
    type: DataTypes.STRING(200),
  },
  category: {
    type: DataTypes.ENUM(
      "Men's Clothing",
      "Women's Clothing",
      "Children's Clothing",
      'Accessories',
      'Sportswear',
      'Workwear',
      'Underwear',
      'Outerwear'
    ),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fabric: {
    type: DataTypes.STRING(100),
  },
  colors: {
    type: sequelize.getDialect() === 'postgres' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.JSON,
    defaultValue: [],
  },
  sizes: {
    type: sequelize.getDialect() === 'postgres' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.JSON,
    defaultValue: [],
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  wholesalePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  minOrderQty: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
  },
  stockQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Product;
