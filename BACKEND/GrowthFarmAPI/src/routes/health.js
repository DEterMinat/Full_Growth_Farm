const express = require('express');
const { sequelize } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // ตรวจสอบการเชื่อมต่อฐานข้อมูล
    await sequelize.authenticate();
    
    const uptime = process.uptime();
    const uptimeFormatted = {
      days: Math.floor(uptime / 86400),
      hours: Math.floor((uptime % 86400) / 3600),
      minutes: Math.floor((uptime % 3600) / 60),
      seconds: Math.floor(uptime % 60)
    };

    res.json({
      success: true,
      status: 'สุขภาพดี',
      message: 'ระบบทำงานปกติ',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'เชื่อมต่อแล้ว',
      services: {
        api: 'ออนไลน์',
        database: 'เชื่อมต่อแล้ว',
        auth: 'พร้อมใช้งาน',
        ai: 'พร้อมใช้งาน'
      },
      server: {
        host: process.env.API_SERVER_HOST || 'localhost',
        port: process.env.PORT || 30007,
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'มีปัญหา',
      message: 'ระบบมีปัญหา',
      timestamp: new Date().toISOString(),
      error: 'การเชื่อมต่อฐานข้อมูลล้มเหลว',
      services: {
        api: 'ออนไลน์',
        database: 'ขาดการเชื่อมต่อ',
        auth: 'จำกัด',
        ai: 'ไม่พร้อมใช้งาน'
      }
    });
  }
});

module.exports = router;
