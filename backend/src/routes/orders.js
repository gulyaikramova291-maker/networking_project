const express = require('express');
const { Op } = require('sequelize');
const { Order, OrderItem } = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) where.orderNumber = { [Op.iLike]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['companyName', 'contactName'] },
        { model: OrderItem, as: 'items' },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({ orders: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderItem, as: 'items' },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  const sequelize = require('../config/database');
  const t = await sequelize.transaction();
  try {
    const { customerId, items, shippingAddress, notes, priority, deliveryDate, paymentMethod } = req.body;

    const orderNumber = `TH-${Date.now().toString().slice(-8)}`;
    let subtotal = 0;

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const total = product.wholesalePrice * item.quantity;
      subtotal += total;
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: product.wholesalePrice,
        total,
        size: item.size,
        color: item.color,
      });
    }

    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const order = await Order.create(
      { orderNumber, customerId, subtotal, tax, total, shippingAddress, notes, priority, deliveryDate, paymentMethod },
      { transaction: t }
    );

    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/orders/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const sequelize = require('../config/database');
    const [total, pending, processing, revenue] = await Promise.all([
      Order.count(),
      Order.count({ where: { status: 'Pending' } }),
      Order.count({ where: { status: 'Processing' } }),
      Order.sum('total', { where: { status: { [Op.notIn]: ['Cancelled', 'Returned'] } } }),
    ]);
    res.json({ total, pending, processing, revenue: revenue || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Associate Order with Customer
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

module.exports = router;
