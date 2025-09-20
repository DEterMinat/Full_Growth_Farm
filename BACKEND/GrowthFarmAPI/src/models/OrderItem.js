// src/models/OrderItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  }
  // ไม่ต้องกำหนด foreign keys ที่นี่ ปล่อยให้ associations จัดการ
}, {
  tableName: 'order_items_GrowthFarm',
  timestamps: true
});

module.exports = { OrderItem };