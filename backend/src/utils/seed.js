require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { Order, OrderItem } = require('../models/Order');
const { Inventory } = require('../models/Inventory');

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log('Database synced');

  // Users
  const adminPass = await bcrypt.hash('admin123', 10);
  await User.bulkCreate([
    { name: 'Admin User', email: 'admin@tekstilhub.uz', password: adminPass, role: 'admin' },
    { name: 'Sardor Xoliqov', email: 'sardor@tekstilhub.uz', password: adminPass, role: 'manager' },
    { name: 'Nilufar Yusupova', email: 'nilufar@tekstilhub.uz', password: adminPass, role: 'staff' },
  ]);

  // Products
  const products = await Product.bulkCreate([
    { sku: 'TH-M-001', name: "Classic Oxford Shirt", nameUz: "Klassik Oksford Ko'ylak", category: "Men's Clothing", brand: 'TextilPro', fabric: 'Cotton 100%', colors: ['White', 'Blue', 'Black'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], unitPrice: 35000, wholesalePrice: 28000, minOrderQty: 12, stockQty: 480 },
    { sku: 'TH-M-002', name: "Slim Fit Chino Pants", nameUz: "Slim-Fit Chino Shim", category: "Men's Clothing", brand: 'TextilPro', fabric: 'Cotton 98%, Elastane 2%', colors: ['Beige', 'Navy', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], unitPrice: 55000, wholesalePrice: 44000, minOrderQty: 12, stockQty: 360 },
    { sku: 'TH-W-001', name: "Floral Wrap Dress", nameUz: "Guldor Libos", category: "Women's Clothing", brand: 'EleganceUz', fabric: 'Viscose 100%', colors: ['Red', 'Blue', 'Green'], sizes: ['XS', 'S', 'M', 'L'], unitPrice: 75000, wholesalePrice: 60000, minOrderQty: 6, stockQty: 240 },
    { sku: 'TH-W-002', name: "Office Blazer", nameUz: "Ofis Kostyumi", category: "Women's Clothing", brand: 'EleganceUz', fabric: 'Polyester 70%, Viscose 30%', colors: ['Black', 'Grey', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], unitPrice: 120000, wholesalePrice: 96000, minOrderQty: 6, stockQty: 180 },
    { sku: 'TH-K-001', name: "Kids Denim Jacket", nameUz: "Bolalar Denim Kepkasi", category: "Children's Clothing", brand: 'KidsFirst', fabric: 'Denim 100%', colors: ['Blue', 'Light Blue'], sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], unitPrice: 45000, wholesalePrice: 36000, minOrderQty: 12, stockQty: 300 },
    { sku: 'TH-S-001', name: "Sport Running T-Shirt", nameUz: "Sport Futbolka", category: 'Sportswear', brand: 'ActiveUz', fabric: 'Polyester 90%, Spandex 10%', colors: ['Black', 'White', 'Red', 'Blue'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], unitPrice: 32000, wholesalePrice: 25600, minOrderQty: 24, stockQty: 600 },
    { sku: 'TH-O-001', name: "Winter Down Jacket", nameUz: "Qishki Kurtka", category: 'Outerwear', brand: 'WarmWear', fabric: 'Nylon + Down Fill', colors: ['Black', 'Navy', 'Khaki'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], unitPrice: 180000, wholesalePrice: 144000, minOrderQty: 6, stockQty: 120 },
    { sku: 'TH-A-001', name: "Leather Belt", nameUz: "Charm Kamar", category: 'Accessories', brand: 'AccessoPro', fabric: 'Genuine Leather', colors: ['Black', 'Brown'], sizes: ['S', 'M', 'L'], unitPrice: 28000, wholesalePrice: 22400, minOrderQty: 24, stockQty: 480 },
    { sku: 'TH-M-003', name: "Formal Suit", nameUz: "Rasmiy Kostyum", category: "Men's Clothing", brand: 'TextilPro', fabric: 'Wool 60%, Polyester 40%', colors: ['Black', 'Navy', 'Charcoal'], sizes: ['46', '48', '50', '52', '54'], unitPrice: 350000, wholesalePrice: 280000, minOrderQty: 3, stockQty: 60 },
    { sku: 'TH-W-003', name: "Summer Blouse", nameUz: "Yozgi Bluzka", category: "Women's Clothing", brand: 'EleganceUz', fabric: 'Cotton 100%', colors: ['White', 'Pink', 'Yellow', 'Green'], sizes: ['XS', 'S', 'M', 'L', 'XL'], unitPrice: 42000, wholesalePrice: 33600, minOrderQty: 12, stockQty: 420 },
    { sku: 'TH-K-002', name: "School Uniform Set", nameUz: "Maktab Formasi", category: "Children's Clothing", brand: 'KidsFirst', fabric: 'Cotton 65%, Polyester 35%', colors: ['Dark Blue', 'Black'], sizes: ['4Y', '6Y', '8Y', '10Y', '12Y', '14Y'], unitPrice: 85000, wholesalePrice: 68000, minOrderQty: 12, stockQty: 25 },
    { sku: 'TH-U-001', name: "Cotton Boxer Set (3pcs)", nameUz: "Paxta Ishton To'plami", category: 'Underwear', brand: 'ComfortLine', fabric: 'Cotton 95%, Elastane 5%', colors: ['Mixed', 'White'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], unitPrice: 22000, wholesalePrice: 17600, minOrderQty: 36, stockQty: 720 },
  ]);

  // Customers
  const customers = await Customer.bulkCreate([
    { companyName: 'Toshkent Kiyim Bozori', contactName: 'Aziz Karimov', email: 'aziz@tkb.uz', phone: '+998901234567', region: 'Toshkent', city: 'Toshkent', tier: 'Platinum', creditLimit: 50000000, totalPurchases: 125000000 },
    { companyName: 'Samarqand Fashion Store', contactName: 'Dilnoza Ergasheva', email: 'dilnoza@sfs.uz', phone: '+998912345678', region: 'Samarqand', city: 'Samarqand', tier: 'Gold', creditLimit: 25000000, totalPurchases: 67000000 },
    { companyName: 'Namangan Textile Center', contactName: 'Jasur Toshmatov', email: 'jasur@ntc.uz', phone: '+998923456789', region: 'Namangan', city: 'Namangan', tier: 'Gold', creditLimit: 20000000, totalPurchases: 54000000 },
    { companyName: 'Andijon Moda', contactName: 'Mohira Yuldasheva', email: 'mohira@am.uz', phone: '+998934567890', region: 'Andijon', city: 'Andijon', tier: 'Silver', creditLimit: 15000000, totalPurchases: 32000000 },
    { companyName: 'Buxoro Style', contactName: 'Sherzod Nazarov', email: 'sherzod@bs.uz', phone: '+998945678901', region: 'Buxoro', city: 'Buxoro', tier: 'Silver', creditLimit: 12000000, totalPurchases: 28000000 },
    { companyName: 'Fargona Online Shop', contactName: 'Feruza Xasanova', email: 'feruza@fos.uz', phone: '+998956789012', region: 'Fargona', city: 'Fargona', tier: 'Bronze', creditLimit: 5000000, totalPurchases: 8500000 },
  ]);

  // Orders
  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const paymentStatuses = ['Unpaid', 'Partial', 'Paid'];

  for (let i = 0; i < 30; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product1 = products[Math.floor(Math.random() * products.length)];
    const product2 = products[Math.floor(Math.random() * products.length)];
    const qty1 = (Math.floor(Math.random() * 5) + 1) * 12;
    const qty2 = (Math.floor(Math.random() * 3) + 1) * 12;
    const sub = product1.wholesalePrice * qty1 + product2.wholesalePrice * qty2;
    const tax = sub * 0.12;
    const total = sub + tax;
    const daysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date(Date.now() - daysAgo * 86400000);

    const order = await Order.create({
      orderNumber: `TH-${(2000 + i).toString().padStart(6, '0')}`,
      customerId: customer.id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      subtotal: sub,
      tax,
      total,
      priority: ['Normal', 'High', 'Low'][Math.floor(Math.random() * 3)],
      paymentMethod: ['Bank Transfer', 'Cash', 'Card'][Math.floor(Math.random() * 3)],
      createdAt: orderDate,
    });

    await OrderItem.bulkCreate([
      { orderId: order.id, productId: product1.id, productName: product1.name, sku: product1.sku, quantity: qty1, unitPrice: product1.wholesalePrice, total: product1.wholesalePrice * qty1 },
      { orderId: order.id, productId: product2.id, productName: product2.name, sku: product2.sku, quantity: qty2, unitPrice: product2.wholesalePrice, total: product2.wholesalePrice * qty2 },
    ]);
  }

  console.log('✅ Seed data created successfully!');
  console.log('Login: admin@tekstilhub.uz / admin123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
