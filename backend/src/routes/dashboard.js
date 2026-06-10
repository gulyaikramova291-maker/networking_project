const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Order } = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders, monthOrders, lastMonthOrders,
      totalRevenue, monthRevenue, lastMonthRevenue,
      totalCustomers, newCustomers,
      totalProducts, lowStockProducts,
    ] = await Promise.all([
      Order.count(),
      Order.count({ where: { createdAt: { [Op.gte]: startOfMonth } } }),
      Order.count({ where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } } }),
      Order.sum('total', { where: { status: { [Op.notIn]: ['Cancelled', 'Returned'] } } }),
      Order.sum('total', { where: { createdAt: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: ['Cancelled', 'Returned'] } } }),
      Order.sum('total', { where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: ['Cancelled', 'Returned'] } } }),
      Customer.count({ where: { isActive: true } }),
      Customer.count({ where: { isActive: true, createdAt: { [Op.gte]: startOfMonth } } }),
      Product.count({ where: { isActive: true } }),
      Product.count({ where: { isActive: true, stockQty: { [Op.lt]: 50 } } }),
    ]);

    const orderGrowth = lastMonthOrders > 0 ? ((monthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) : 0;
    const revenueGrowth = lastMonthRevenue > 0 ? (((monthRevenue || 0) - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    res.json({
      orders: { total: totalOrders, thisMonth: monthOrders, growth: orderGrowth },
      revenue: { total: totalRevenue || 0, thisMonth: monthRevenue || 0, growth: revenueGrowth },
      customers: { total: totalCustomers, newThisMonth: newCustomers },
      products: { total: totalProducts, lowStock: lowStockProducts },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/dashboard/revenue-chart (last 6 months)
router.get('/revenue-chart', async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString('en', { month: 'short' }) + ' ' + d.getFullYear(),
      });
    }

    const data = await Promise.all(
      months.map(async ({ year, month, label }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        const revenue = await Order.sum('total', {
          where: { createdAt: { [Op.between]: [start, end] }, status: { [Op.notIn]: ['Cancelled'] } },
        });
        const orders = await Order.count({
          where: { createdAt: { [Op.between]: [start, end] } },
        });
        return { month: label, revenue: revenue || 0, orders };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/dashboard/top-products
router.get('/top-products', async (req, res) => {
  try {
    const { OrderItem } = require('../models/Order');
    const topProducts = await OrderItem.findAll({
      attributes: [
        'productName',
        'sku',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQty'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue'],
      ],
      group: ['productName', 'sku'],
      order: [[sequelize.fn('SUM', sequelize.col('total')), 'DESC']],
      limit: 5,
    });
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
