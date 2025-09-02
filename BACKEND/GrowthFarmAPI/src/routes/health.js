const express = require('express');
const { sequelize } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    const uptime = process.uptime();
    const uptimeFormatted = {
      days: Math.floor(uptime / 86400),
      hours: Math.floor((uptime % 86400) / 3600),
      minutes: Math.floor((uptime % 3600) / 60),
      seconds: Math.floor(uptime % 60)
    };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      services: {
        api: 'online',
        database: 'connected',
        auth: 'available'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      services: {
        api: 'online',
        database: 'disconnected',
        auth: 'limited'
      }
    });
  }
});

module.exports = router;
