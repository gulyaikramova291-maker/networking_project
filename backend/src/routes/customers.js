const express = require('express');
const { Op } = require('sequelize');
const Customer = require('../models/Customer');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const { search, tier, region, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { contactName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (tier) where.tier = tier;
    if (region) where.region = { [Op.iLike]: `%${region}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Customer.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['totalPurchases', 'DESC']],
    });

    res.json({ customers: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update(req.body);
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update({ isActive: false });
    res.json({ message: 'Customer deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/customers/stats/tiers
router.get('/stats/tiers', async (req, res) => {
  try {
    const sequelize = require('../config/database');
    const tiers = await Customer.findAll({
      attributes: ['tier', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { isActive: true },
      group: ['tier'],
    });
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
