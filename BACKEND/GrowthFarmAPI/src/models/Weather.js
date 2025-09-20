// src/models/Weather.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // ตรวจสอบให้แน่ใจว่า path นี้ถูกต้องสำหรับโปรเจกต์ของคุณ

const Weather = sequelize.define('Weather', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy'),
    allowNull: false
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  windSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'weathers',
  timestamps: true
});

// [สำคัญที่สุด] ตรวจสอบให้แน่ใจว่าคุณได้ export object ที่มี Key ชื่อ Weather (W พิมพ์ใหญ่)
module.exports = { Weather };