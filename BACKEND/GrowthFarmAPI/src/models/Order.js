// src/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
  shippingAddress: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  buyerId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'orders_GrowthFarm'
});

module.exports = { Order };