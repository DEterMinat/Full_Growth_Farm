const express = require('express');
const { Weather } = require('../models/Weather'); // [สำคัญ] ตรวจสอบ Path ไปยัง Model ของคุณให้ถูกต้อง
const router = express.Router();

// GET /weather - ดึงข้อมูลสภาพอากาศล่าสุดเพียง 1 รายการจากฐานข้อมูล
router.get('/', async (req, res) => {
  try {
    // ค้นหาข้อมูลล่าสุดโดยเรียงจากเวลาที่สร้าง (createdAt) จากใหม่ไปเก่า แล้วเอาแค่ตัวแรก
    const latestWeather = await Weather.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (latestWeather) {
      // ถ้าเจอข้อมูลในตาราง, ส่งข้อมูลนั้นกลับไป
      res.status(200).json(latestWeather);
    } else {
      // ถ้าไม่เจอข้อมูลในตารางเลย (ตารางว่าง)
      // ให้ส่งข้อมูลตัวอย่างกลับไปก่อน เพื่อให้ Frontend ไม่แครช
      res.status(200).json({
        city: "Demo City",
        temperature: 31.0,
        condition: "Sunny", // [สำคัญ] ต้องมี key นี้ เพื่อไม่ให้ Frontend พัง
        humidity: 70,
        windSpeed: 8.5
      });
    }
  } catch (error) {
    console.error("Get Weather Error:", error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// POST /weather - เพิ่มข้อมูลสภาพอากาศใหม่ลงในฐานข้อมูล
router.post('/', async (req, res) => {
  try {
    // ดึงข้อมูลจาก body ของ request ที่ส่งมา
    const { city, temperature, condition, humidity, windSpeed } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!city || temperature == null || !condition || humidity == null || windSpeed == null) {
      return res.status(400).json({ message: 'Missing required fields for weather' });
    }

    // สร้าง record ใหม่ในตาราง Weather ด้วยข้อมูลที่ได้รับ
    const newWeather = await Weather.create({
      city,
      temperature,
      condition,
      humidity,
      windSpeed
    });

    // ส่งสถานะ 201 (Created) พร้อมข้อมูลที่เพิ่งสร้างกลับไป
    res.status(201).json({
      message: 'Weather data created successfully',
      data: newWeather
    });

  } catch (error) {
    console.error("Create Weather Error:", error);
    res.status(500).json({ message: 'Failed to create weather data' });
  }
});

module.exports = router;