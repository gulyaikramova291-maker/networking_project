const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Returned'
    ),
    defaultValue: 'Pending',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Normal', 'High', 'Urgent'),
    defaultValue: 'Normal',
  },
  subtotal: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid', 'Refunded'),
    defaultValue: 'Unpaid',
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
  },
  shippingAddress: {
    type: DataTypes.TEXT,
  },
  deliveryDate: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING(200),
  },
  sku: {
    type: DataTypes.STRING(50),
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING(20),
  },
  color: {
    type: DataTypes.STRING(50),
  },
});

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };
