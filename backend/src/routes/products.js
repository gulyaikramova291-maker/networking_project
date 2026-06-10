const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, inStock, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;
    if (brand) where.brand = { [Op.iLike]: `%${brand}%` };
    if (minPrice) where.wholesalePrice = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.wholesalePrice = { ...where.wholesalePrice, [Op.lte]: parseFloat(maxPrice) };
    if (inStock === 'true') where.stockQty = { [Op.gt]: 0 };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      products: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update({ isActive: false });
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Product.count({ where: { isActive: true } });
    const lowStock = await Product.count({ where: { isActive: true, stockQty: { [Op.lt]: 50 } } });
    const outOfStock = await Product.count({ where: { isActive: true, stockQty: 0 } });
    res.json({ total, lowStock, outOfStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
