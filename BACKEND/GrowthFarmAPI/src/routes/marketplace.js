const express = require('express');
const { Product } = require('../models/Product');
const { User } = require('../models/User');

const router = express.Router();

// GET /marketplace/products - ดึงข้อมูลสินค้าทั้งหมด (ทำงานได้ดีอยู่แล้ว)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: 'available' },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'full_name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      products: products,
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch products' }});
  }
});

// --- 🔽 เพิ่ม Route นี้เข้าไป 🔽 ---
// POST /marketplace/products - สร้างสินค้าใหม่
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, unit, quantity, sellerId } = req.body;

        // ตรวจสอบข้อมูลเบื้องต้น
        if (!name || !price || !category || !unit || quantity == null || !sellerId) {
            return res.status(400).json({ 
                error: { message: 'Missing required fields: name, price, category, unit, quantity, sellerId' } 
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            unit,
            quantity,
            sellerId
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: { message: 'Failed to create product' }});
    }
});


module.exports = router;