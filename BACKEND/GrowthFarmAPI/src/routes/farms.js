const express = require('express');
const { body, validationResult } = require('express-validator');
const { Farm, FarmZone } = require('../models/Farm');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all farms (with optional user filter)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    } else if (req.user) {
      whereClause.userId = req.user.id;
    }

    const { count, rows: farms } = await Farm.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: FarmZone,
          as: 'zones'
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      farms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch farms',
        status: 500
      }
    });
  }
});

// Get single farm
router.get('/:id', async (req, res) => {
  try {
    const farm = await Farm.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: FarmZone,
          as: 'zones'
        }
      ]
    });

    if (!farm) {
      return res.status(404).json({
        error: {
          message: 'Farm not found',
          status: 404
        }
      });
    }

    res.json({ farm });

  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch farm',
        status: 500
      }
    });
  }
});

// Create farm
router.post('/', authenticateToken, [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('size').optional().isNumeric(),
  body('farmType').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const farmData = {
      ...req.body,
      userId: req.user.id
    };

    const farm = await Farm.create(farmData);
    
    // Fetch the created farm with associations
    const createdFarm = await Farm.findByPk(farm.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: FarmZone,
          as: 'zones'
        }
      ]
    });

    res.status(201).json({
      message: 'Farm created successfully',
      farm: createdFarm
    });

  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create farm',
        status: 500
      }
    });
  }
});

// Update farm
router.put('/:id', authenticateToken, [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('size').optional().isNumeric(),
  body('farmType').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const farm = await Farm.findByPk(req.params.id);

    if (!farm) {
      return res.status(404).json({
        error: {
          message: 'Farm not found',
          status: 404
        }
      });
    }

    // Check if user owns the farm
    if (farm.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to update this farm',
          status: 403
        }
      });
    }

    await farm.update(req.body);

    // Fetch updated farm with associations
    const updatedFarm = await Farm.findByPk(farm.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: FarmZone,
          as: 'zones'
        }
      ]
    });

    res.json({
      message: 'Farm updated successfully',
      farm: updatedFarm
    });

  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update farm',
        status: 500
      }
    });
  }
});

// Delete farm
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const farm = await Farm.findByPk(req.params.id);

    if (!farm) {
      return res.status(404).json({
        error: {
          message: 'Farm not found',
          status: 404
        }
      });
    }

    // Check if user owns the farm
    if (farm.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to delete this farm',
          status: 403
        }
      });
    }

    await farm.destroy();

    res.json({
      message: 'Farm deleted successfully'
    });

  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete farm',
        status: 500
      }
    });
  }
});

// Farm Zones endpoints

// Get zones for a farm
router.get('/:farmId/zones', async (req, res) => {
  try {
    const zones = await FarmZone.findAll({
      where: { farmId: req.params.farmId },
      include: [
        {
          model: Farm,
          as: 'farm',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ zones });

  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch zones',
        status: 500
      }
    });
  }
});

// Create zone
router.post('/:farmId/zones', authenticateToken, [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('cropType').optional().trim(),
  body('size').optional().isNumeric(),
  body('status').optional().isIn(['planning', 'planted', 'growing', 'harvesting', 'fallow'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    // Check if farm exists and user owns it
    const farm = await Farm.findByPk(req.params.farmId);
    if (!farm) {
      return res.status(404).json({
        error: {
          message: 'Farm not found',
          status: 404
        }
      });
    }

    if (farm.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to add zones to this farm',
          status: 403
        }
      });
    }

    const zoneData = {
      ...req.body,
      farmId: req.params.farmId
    };

    const zone = await FarmZone.create(zoneData);

    res.status(201).json({
      message: 'Zone created successfully',
      zone
    });

  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create zone',
        status: 500
      }
    });
  }
});

// Update zone
router.put('/:farmId/zones/:zoneId', authenticateToken, [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('cropType').optional().trim(),
  body('size').optional().isNumeric(),
  body('status').optional().isIn(['planning', 'planted', 'growing', 'harvesting', 'fallow'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const zone = await FarmZone.findOne({
      where: {
        id: req.params.zoneId,
        farmId: req.params.farmId
      },
      include: [
        {
          model: Farm,
          as: 'farm'
        }
      ]
    });

    if (!zone) {
      return res.status(404).json({
        error: {
          message: 'Zone not found',
          status: 404
        }
      });
    }

    if (zone.farm.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to update this zone',
          status: 403
        }
      });
    }

    await zone.update(req.body);

    res.json({
      message: 'Zone updated successfully',
      zone
    });

  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update zone',
        status: 500
      }
    });
  }
});

// Delete zone
router.delete('/:farmId/zones/:zoneId', authenticateToken, async (req, res) => {
  try {
    const zone = await FarmZone.findOne({
      where: {
        id: req.params.zoneId,
        farmId: req.params.farmId
      },
      include: [
        {
          model: Farm,
          as: 'farm'
        }
      ]
    });

    if (!zone) {
      return res.status(404).json({
        error: {
          message: 'Zone not found',
          status: 404
        }
      });
    }

    if (zone.farm.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to delete this zone',
          status: 403
        }
      });
    }

    await zone.destroy();

    res.json({
      message: 'Zone deleted successfully'
    });

  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete zone',
        status: 500
      }
    });
  }
});

module.exports = router;
