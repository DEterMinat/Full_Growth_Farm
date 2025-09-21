const express = require('express');
const router = express.Router();

// ลอง import Crop model แบบปลอดภัย
let Crop;
try {
  const cropModel = require('../models/Crop');
  Crop = cropModel.Crop;
  if (!Crop) {
    console.error('❌ Crop model not found in export');
    throw new Error('Crop model is undefined');
  }
  console.log('✅ Crop model loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Crop model:', error.message);
  console.error('Full error:', error);
}

// Middleware ตรวจสอบว่า Crop model โหลดได้
router.use((req, res, next) => {
  if (!Crop) {
    return res.status(500).json({
      success: false,
      message: 'Crop model is not available',
      error: 'Failed to load Crop model'
    });
  }
  next();
});

// POST /api/crops - Create a new crop
router.post('/', async (req, res) => {
  try {
    const cropData = {
      cropName: req.body.name,
      variety: req.body.variety,
      plantingDate: req.body.plantingDate,
      expectedHarvestDate: req.body.expectedHarvestDate,
      zoneId: req.body.zoneId || 1, 
      status: 'PLANTED',
      healthStatus: 'GOOD',
      quantity: req.body.area,
      unit: req.body.areaUnit,
      growthStage: req.body.stage,
      notes: req.body.notes
    };
    const crop = await Crop.create(cropData);
    res.status(201).json({ success: true, message: 'Crop created successfully', data: crop });
  } catch (error) {
    console.error("Create Crop Error:", error);
    res.status(500).json({ success: false, message: 'Failed to create crop', error: error.message });
  }
});

// GET /api/crops - Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.findAll({
        order: [['createdAt', 'DESC']]
    });
    
    const formattedCrops = crops.map(crop => ({
        id: crop.id,
        name: crop.cropName,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        area: crop.quantity,
        areaUnit: crop.unit,
        stage: crop.growthStage,
        status: crop.healthStatus ? crop.healthStatus.toLowerCase() : 'healthy',
        notes: crop.notes,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt
    }));

    // 🔽 --- จุดที่แก้ไข --- 🔽
    // คืนค่ากลับไปเป็นรูปแบบ Object ที่มี property 'data' เหมือนเดิม
    // เพื่อให้ตรงกับที่ Frontend Service คาดหวัง
    res.status(200).json({
        success: true,
        data: formattedCrops
    });

  } catch (error) {
    console.error("Get All Crops Error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch crops', error: error.message });
  }
});

// PUT /api/crops/:id - Update a crop by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByPk(id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    const updatedData = {
      cropName: req.body.name,
      variety: req.body.variety,
      plantingDate: req.body.plantingDate,
      expectedHarvestDate: req.body.expectedHarvestDate,
      quantity: req.body.area,
      unit: req.body.areaUnit,
      growthStage: req.body.stage,
      healthStatus: req.body.status ? req.body.status.toUpperCase() : 'GOOD',
      notes: req.body.notes
    };
    await crop.update(updatedData);
    res.status(200).json({ success: true, message: 'Crop updated successfully', data: crop });
  } catch (error) {
    console.error("Update Crop Error:", error);
    res.status(500).json({ success: false, message: 'Failed to update crop', error: error.message });
  }
});

// DELETE /api/crops/:id - Delete a crop by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByPk(id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    await crop.destroy();
    res.status(204).send();

  } catch (error) {
    console.error("Delete Crop Error:", error);
    res.status(500).json({ success: false, message: 'Failed to delete crop', error: error.message });
  }
});

module.exports = router;