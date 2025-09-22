const express = require('express');
const router = express.Router();
const { Farm, FarmZone } = require('../models/Farm');
const { authenticateToken } = require('../middleware/auth');

// GET /api/farm-zones - Get all zones from all farms
router.get('/', async (req, res) => {
  try {
    const zones = await FarmZone.findAll({
      include: [
        {
          model: Farm,
          as: 'farm',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, zones });
  } catch (error) {
    console.error('Get all zones error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch zones', error: error.message });
  }
});

module.exports = router;