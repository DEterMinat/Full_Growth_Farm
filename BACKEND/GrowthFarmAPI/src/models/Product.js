// src/models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', { // <-- แก้ไขจาก 'MarketplaceProduct' เป็น 'Product'
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'kg' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('available', 'out_of_stock', 'discontinued'), defaultValue: 'available' },
  sellerId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'marketplace_products_GrowthFarm' // <-- ยังคงใช้ชื่อตารางเดิม
});

module.exports = { Product };