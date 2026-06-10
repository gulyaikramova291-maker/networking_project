const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  warehouseLocation: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g. A-01-03 (Aisle-Row-Shelf)',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reservedQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  reorderQty: {
    type: DataTypes.INTEGER,
    defaultValue: 200,
  },
  lastRestocked: {
    type: DataTypes.DATE,
  },
  batchNumber: {
    type: DataTypes.STRING(50),
  },
});

const InventoryMovement = sequelize.define('InventoryMovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'IN',
      'OUT',
      'TRANSFER',
      'ADJUSTMENT',
      'RETURN'
    ),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING(100),
  },
  notes: {
    type: DataTypes.TEXT,
  },
  performedBy: {
    type: DataTypes.STRING(100),
  },
});

module.exports = { Inventory, InventoryMovement };
